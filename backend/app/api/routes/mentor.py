from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.constants import UserRole
from app.dependencies.auth import require_role, require_roles
from app.db.session import get_db
from app.models.feedback import Feedback
from app.models.onboarding_plan import OnboardingPlan, PlanStage, Task
from app.models.user import User
from app.schemas.plan import MenteeSummary, PlanRead, MentorTaskCreate, TaskDeadlineUpdate, TaskCompleteResponse

router = APIRouter(prefix='/mentor', tags=['mentor'])


@router.get('/mentees', response_model=list[MenteeSummary])
async def mentees(current_user: User = Depends(require_role(UserRole.mentor)), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.mentor_id == current_user.id, User.is_active.is_(True)).options(selectinload(User.onboarding_plan).selectinload(OnboardingPlan.stages).selectinload(PlanStage.tasks)))
    users = result.scalars().all()
    items = []
    for user in users:
        plan = user.onboarding_plan
        last_feedback = await db.execute(select(Feedback).where(Feedback.user_id == user.id).order_by(Feedback.week_number.desc()))
        items.append({'id': user.id, 'full_name': user.full_name, 'position': user.position, 'progress_percent': plan.progress_percent if plan else 0, 'start_date': plan.start_date if plan else None, 'last_feedback_available': last_feedback.scalar_one_or_none() is not None})
    return items


@router.get('/mentees/{user_id}')
async def get_mentee(
    user_id: int,
    current_user: User = Depends(require_roles([UserRole.mentor, UserRole.admin])),
    db: AsyncSession = Depends(get_db),
):
    mentee = await db.get(User, user_id)
    if not mentee or (current_user.role != UserRole.admin and mentee.mentor_id != current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')
    return {
        'id': mentee.id,
        'email': mentee.email,
        'full_name': mentee.full_name,
        'role': mentee.role,
        'position': mentee.position,
        'department': mentee.department,
        'is_active': mentee.is_active,
        'created_at': mentee.created_at,
    }


@router.get('/mentees/{user_id}/plan', response_model=PlanRead)
async def mentee_plan(
    user_id: int,
    current_user: User = Depends(require_roles([UserRole.mentor, UserRole.admin])),
    db: AsyncSession = Depends(get_db),
):
    mentee = await db.get(User, user_id)
    if not mentee or (current_user.role != UserRole.admin and mentee.mentor_id != current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')
    result = await db.execute(select(OnboardingPlan).where(OnboardingPlan.user_id == user_id).options(selectinload(OnboardingPlan.stages).selectinload(PlanStage.tasks)))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail='Plan not found')
    return {'id': plan.id, 'user_id': plan.user_id, 'template_id': plan.template_id, 'start_date': plan.start_date, 'progress_percent': plan.progress_percent, 'stages': plan.stages}


@router.patch('/mentees/{user_id}/tasks/{task_id}/deadline', response_model=TaskCompleteResponse)
async def update_deadline(
    user_id: int,
    task_id: int,
    payload: TaskDeadlineUpdate,
    current_user: User = Depends(require_roles([UserRole.mentor, UserRole.admin])),
    db: AsyncSession = Depends(get_db),
):
    mentee = await db.get(User, user_id)
    if not mentee or (current_user.role != UserRole.admin and mentee.mentor_id != current_user.id):
        raise HTTPException(status_code=403, detail='Forbidden')
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    task.due_date = payload.due_date
    await db.commit()
    return {'detail': 'Deadline updated'}


@router.patch('/mentees/{user_id}/tasks/{task_id}/status', response_model=TaskCompleteResponse)
async def update_task_status(
    user_id: int,
    task_id: int,
    payload: dict,
    current_user: User = Depends(require_roles([UserRole.mentor, UserRole.admin])),
    db: AsyncSession = Depends(get_db),
):
    mentee = await db.get(User, user_id)
    if not mentee or (current_user.role != UserRole.admin and mentee.mentor_id != current_user.id):
        raise HTTPException(status_code=403, detail='Forbidden')
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    if 'is_completed' in payload:
        task.is_completed = payload['is_completed']
    await db.commit()
    return {'detail': 'Task status updated'}


@router.post('/mentees/{user_id}/tasks', response_model=TaskCompleteResponse)
async def add_task(
    user_id: int,
    payload: MentorTaskCreate,
    current_user: User = Depends(require_roles([UserRole.mentor, UserRole.admin])),
    db: AsyncSession = Depends(get_db),
):
    mentee = await db.get(User, user_id)
    if not mentee or (current_user.role != UserRole.admin and mentee.mentor_id != current_user.id):
        raise HTTPException(status_code=403, detail='Forbidden')
    added_by = None if current_user.role == UserRole.admin else current_user.id
    task = Task(
        stage_id=payload.stage_id,
        title=payload.title,
        description=payload.description,
        due_date=payload.due_date,
        is_system_task=False,
        added_by_mentor_id=added_by,
    )
    db.add(task)
    await db.commit()
    return {'detail': 'Task added'}


@router.delete('/mentees/{user_id}/tasks/{task_id}', response_model=TaskCompleteResponse)
async def delete_task(
    user_id: int,
    task_id: int,
    current_user: User = Depends(require_roles([UserRole.mentor, UserRole.admin])),
    db: AsyncSession = Depends(get_db),
):
    mentee = await db.get(User, user_id)
    if not mentee or (current_user.role != UserRole.admin and mentee.mentor_id != current_user.id):
        raise HTTPException(status_code=403, detail='Forbidden')
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    if task.is_system_task:
        raise HTTPException(status_code=403, detail='System task cannot be deleted')
    await db.delete(task)
    await db.commit()
    return {'detail': 'Task deleted'}


@router.get('/mentees/{user_id}/feedback')
async def get_mentee_feedback(
    user_id: int,
    current_user: User = Depends(require_roles([UserRole.mentor, UserRole.admin])),
    db: AsyncSession = Depends(get_db),
):
    mentee = await db.get(User, user_id)
    if not mentee or (current_user.role != UserRole.admin and mentee.mentor_id != current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')
    feedback_result = await db.execute(
        select(Feedback).where(Feedback.user_id == user_id).order_by(Feedback.week_number.asc())
    )
    feedbacks = feedback_result.scalars().all()
    return [
        {
            'week_number': f.week_number,
            'mood': f.mood,
            'tasks_clear': f.tasks_clear,
            'wish': f.wish,
            'created_at': f.created_at,
        }
        for f in feedbacks
    ]
