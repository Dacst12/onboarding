from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.constants import UserRole
from app.core.security import hash_password
from app.db.session import get_db
from app.dependencies.auth import require_role
from app.models.template_plan import TemplatePlan, TemplateStage, TemplateTask
from app.models.user import User
from app.schemas.template import TemplatePlanCreate, TemplatePlanRead, TemplatePlanUpdate, TemplateStageCreate, TemplateStageUpdate, TemplateTaskCreate, TemplateTaskUpdate
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.domain import create_plan_from_template

router = APIRouter(prefix='/admin', tags=['admin'])


@router.get('/templates', response_model=list[TemplatePlanRead])
async def list_templates(current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TemplatePlan).options(selectinload(TemplatePlan.stages).selectinload(TemplateStage.tasks)))
    return result.scalars().all()


@router.post('/templates', response_model=TemplatePlanRead)
async def create_template(payload: TemplatePlanCreate, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    template = TemplatePlan(title=payload.title)
    db.add(template)
    await db.commit()
    await db.refresh(template, attribute_names=['stages'])
    return template


@router.get('/templates/{template_id}', response_model=TemplatePlanRead)
async def get_template(template_id: int, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TemplatePlan).where(TemplatePlan.id == template_id).options(selectinload(TemplatePlan.stages).selectinload(TemplateStage.tasks)))
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail='Template not found')
    return template


@router.put('/templates/{template_id}', response_model=TemplatePlanRead)
async def update_template(template_id: int, payload: TemplatePlanUpdate, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    template = await db.get(TemplatePlan, template_id)
    if not template:
        raise HTTPException(status_code=404, detail='Template not found')
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(template, field, value)
    await db.commit()
    await db.refresh(template, attribute_names=['stages'])
    return template


@router.delete('/templates/{template_id}')
async def delete_template(template_id: int, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    template = await db.get(TemplatePlan, template_id)
    if not template:
        raise HTTPException(status_code=404, detail='Template not found')
    await db.delete(template)
    await db.commit()
    return {'detail': 'Template deleted'}


@router.post('/templates/{template_id}/stages', response_model=dict)
async def add_template_stage(template_id: int, payload: TemplateStageCreate, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    stage = TemplateStage(template_id=template_id, **payload.model_dump())
    db.add(stage)
    await db.commit()
    return {'detail': 'Stage created'}


@router.put('/templates/{template_id}/stages/{stage_id}', response_model=dict)
async def update_template_stage(template_id: int, stage_id: int, payload: TemplateStageUpdate, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    stage = await db.get(TemplateStage, stage_id)
    if not stage or stage.template_id != template_id:
        raise HTTPException(status_code=404, detail='Stage not found')
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(stage, field, value)
    await db.commit()
    return {'detail': 'Stage updated'}


@router.delete('/templates/{template_id}/stages/{stage_id}')
async def delete_template_stage(template_id: int, stage_id: int, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    stage = await db.get(TemplateStage, stage_id)
    if not stage or stage.template_id != template_id:
        raise HTTPException(status_code=404, detail='Stage not found')
    await db.delete(stage)
    await db.commit()
    return {'detail': 'Stage deleted'}


@router.post('/templates/stages/{stage_id}/tasks', response_model=dict)
async def add_template_task(stage_id: int, payload: TemplateTaskCreate, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    task = TemplateTask(stage_id=stage_id, **payload.model_dump())
    db.add(task)
    await db.commit()
    return {'detail': 'Task created'}


@router.put('/templates/stages/{stage_id}/tasks/{task_id}', response_model=dict)
async def update_template_task(stage_id: int, task_id: int, payload: TemplateTaskUpdate, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    task = await db.get(TemplateTask, task_id)
    if not task or task.stage_id != stage_id:
        raise HTTPException(status_code=404, detail='Task not found')
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    await db.commit()
    return {'detail': 'Task updated'}


@router.delete('/templates/stages/{stage_id}/tasks/{task_id}')
async def delete_template_task(stage_id: int, task_id: int, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    task = await db.get(TemplateTask, task_id)
    if not task or task.stage_id != stage_id:
        raise HTTPException(status_code=404, detail='Task not found')
    await db.delete(task)
    await db.commit()
    return {'detail': 'Task deleted'}


@router.post('/users', response_model=UserRead)
async def create_user(payload: UserCreate, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    exists = await db.execute(select(User).where(User.email == payload.email))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=409, detail='User already exists')
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=payload.role,
        position=payload.position,
        department=payload.department,
        telegram=payload.telegram,
        phone=payload.phone,
        responsibility_tags=payload.responsibility_tags,
        mentor_id=payload.mentor_id,
    )
    db.add(user)
    await db.flush()
    if user.role == UserRole.new_employee:
        if not payload.template_id or not payload.start_date:
            raise HTTPException(status_code=400, detail='template_id and start_date are required for new_employee')
        template = await db.get(TemplatePlan, payload.template_id)
        if not template:
            raise HTTPException(status_code=404, detail='Template not found')
        await db.refresh(template, attribute_names=['stages'])
        for stage in template.stages:
            await db.refresh(stage, attribute_names=['tasks'])
        await create_plan_from_template(db, user, template, payload.start_date)
    await db.commit()
    await db.refresh(user)
    return user


@router.get('/users', response_model=list[UserRead])
async def list_users(role: UserRole | None = Query(default=None), current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    stmt = select(User)
    if role:
        stmt = stmt.where(User.role == role)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch('/users/{user_id}', response_model=UserRead)
async def update_user(user_id: int, payload: UserUpdate, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    if user.role == UserRole.admin and user.id != current_user.id:
        raise HTTPException(status_code=403, detail='Forbidden')
    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == 'password' and value:
            user.hashed_password = hash_password(value)
        elif value is not None:
            setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user


@router.delete('/users/{user_id}')
async def delete_user(user_id: int, current_user: User = Depends(require_role(UserRole.admin)), db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    if user.role == UserRole.admin and user.id != current_user.id:
        raise HTTPException(status_code=403, detail='Forbidden')
    user.is_active = False
    await db.commit()
    return {'detail': 'User deactivated'}
