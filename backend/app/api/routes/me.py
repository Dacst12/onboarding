from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.constants import UserRole
from app.db.session import get_db
from app.dependencies.auth import require_role
from app.models.feedback import Feedback
from app.models.onboarding_plan import OnboardingPlan, PlanStage, Task
from app.models.user import User
from app.schemas.feedback import FeedbackCreate, FeedbackRead
from app.schemas.plan import PlanRead, TaskCompleteResponse

router = APIRouter(prefix='/me', tags=['me'])


@router.get('/plan', response_model=PlanRead)
async def my_plan(current_user: User = Depends(require_role(UserRole.new_employee)), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(OnboardingPlan)
        .where(OnboardingPlan.user_id == current_user.id)
        .options(selectinload(OnboardingPlan.stages).selectinload(PlanStage.tasks))
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Plan not found')
    return plan


@router.patch('/tasks/{task_id}/complete', response_model=TaskCompleteResponse)
async def complete_task(task_id: int, current_user: User = Depends(require_role(UserRole.new_employee)), db: AsyncSession = Depends(get_db)):
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Task not found')
    plan = await db.scalar(select(OnboardingPlan).join(PlanStage).join(Task).where(Task.id == task_id, OnboardingPlan.user_id == current_user.id))
    if not plan:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')
    task.is_completed = True
    task.completed_at = datetime.now(timezone.utc)
    await db.commit()
    return {'detail': 'Task completed'}


@router.patch('/tasks/{task_id}/uncomplete', response_model=TaskCompleteResponse)
async def uncomplete_task(task_id: int, current_user: User = Depends(require_role(UserRole.new_employee)), db: AsyncSession = Depends(get_db)):
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Task not found')
    plan = await db.scalar(select(OnboardingPlan).join(PlanStage).join(Task).where(Task.id == task_id, OnboardingPlan.user_id == current_user.id))
    if not plan:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Forbidden')
    task.is_completed = False
    task.completed_at = None
    await db.commit()
    return {'detail': 'Task uncompleted'}


@router.post('/feedback', response_model=FeedbackRead)
async def create_feedback(payload: FeedbackCreate, current_user: User = Depends(require_role(UserRole.new_employee)), db: AsyncSession = Depends(get_db)):
    exists = await db.execute(select(Feedback).where(Feedback.user_id == current_user.id, Feedback.week_number == payload.week_number))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Feedback for this week already exists')
    feedback = Feedback(user_id=current_user.id, **payload.model_dump())
    db.add(feedback)
    await db.commit()
    await db.refresh(feedback)
    return feedback


@router.get('/feedback/available')
async def feedback_available(current_user: User = Depends(require_role(UserRole.new_employee)), db: AsyncSession = Depends(get_db)):
    exists = await db.execute(select(Feedback.id).where(Feedback.user_id == current_user.id).limit(1))
    return {'available': exists.scalar_one_or_none() is None}
