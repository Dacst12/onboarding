from __future__ import annotations

from datetime import date, datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.constants import UserRole
from app.core.security import hash_password
from app.core.utils import daterange_offset
from app.models.feedback import Feedback
from app.models.onboarding_plan import OnboardingPlan, PlanStage, Task
from app.models.template_plan import TemplatePlan, TemplateStage, TemplateTask
from app.models.user import User


async def get_plan_for_user(db: AsyncSession, user: User) -> OnboardingPlan:
    result = await db.execute(
        select(OnboardingPlan)
        .where(OnboardingPlan.user_id == user.id)
        .options(selectinload(OnboardingPlan.stages).selectinload(PlanStage.tasks))
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Plan not found')
    return plan


async def recalc_progress(plan: OnboardingPlan) -> int:
    total = sum(len(stage.tasks) for stage in plan.stages)
    if total == 0:
        return 0
    completed = sum(1 for stage in plan.stages for task in stage.tasks if task.is_completed)
    return int(round((completed / total) * 100))


async def create_plan_from_template(
    db: AsyncSession,
    user: User,
    template: TemplatePlan,
    start_date: date,
) -> OnboardingPlan:
    plan = OnboardingPlan(user_id=user.id, template_id=template.id, start_date=start_date)
    db.add(plan)
    await db.flush()
    stages = []
    for template_stage in sorted(template.stages, key=lambda s: s.order_index):
        stage = PlanStage(plan_id=plan.id, title=template_stage.title, order_index=template_stage.order_index)
        db.add(stage)
        await db.flush()
        for template_task in template_stage.tasks:
            db.add(
                Task(
                    stage_id=stage.id,
                    title=template_task.title,
                    description=template_task.description,
                    due_date=daterange_offset(start_date, template_task.offset_days),
                    is_system_task=True,
                    requires_confirmation=False,
                )
            )
        stages.append(stage)
    await db.commit()
    await db.refresh(plan)
    return plan


async def create_user_with_plan(db: AsyncSession, payload, current_user: User) -> User:
    exists = await db.execute(select(User).where(User.email == payload.email))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='User already exists')

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

    if payload.role == UserRole.new_employee:
        if not payload.template_id or not payload.start_date:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='template_id and start_date are required for new_employee')
        template = await db.get(TemplatePlan, payload.template_id)
        if not template:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Template not found')
        await db.refresh(template, attribute_names=['stages'])
        for stage in template.stages:
            await db.refresh(stage, attribute_names=['tasks'])
        await create_plan_from_template(db, user, template, payload.start_date)
    else:
        await db.commit()

    await db.refresh(user)
    return user

