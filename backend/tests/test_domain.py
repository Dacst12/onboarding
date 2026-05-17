from datetime import date

import pytest
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.constants import UserRole
from app.core.security import hash_password
from app.models.onboarding_plan import OnboardingPlan, PlanStage, Task
from app.models.template_plan import TemplatePlan, TemplateStage, TemplateTask
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.domain import create_plan_from_template, create_user_with_plan, get_plan_for_user, recalc_progress


@pytest.mark.anyio
async def test_recalc_progress():
    plan = OnboardingPlan(user_id=1, template_id=None, start_date=date(2024, 1, 1))
    stage = PlanStage(plan_id=1, title='Stage 1', order_index=1)
    task1 = Task(stage_id=1, title='Task 1', description=None, due_date=None, is_completed=True)
    task2 = Task(stage_id=1, title='Task 2', description=None, due_date=None, is_completed=False)
    stage.tasks = [task1, task2]
    plan.stages = [stage]

    progress = await recalc_progress(plan)
    assert progress == 50

    empty_plan = OnboardingPlan(user_id=2, template_id=None, start_date=date(2024, 1, 1))
    empty_plan.stages = []
    progress_empty = await recalc_progress(empty_plan)
    assert progress_empty == 0


@pytest.mark.anyio
async def test_create_plan_from_template(db_session):
    template = TemplatePlan(title='Domain Template')
    stage = TemplateStage(title='Week 1', order_index=1, template=template)
    task = TemplateTask(title='Task', description='Desc', offset_days=3, stage=stage)
    user = User(email='domain_user@test.com', hashed_password=hash_password('pass123'), full_name='Domain User', role=UserRole.new_employee)
    db_session.add_all([template, stage, task, user])
    await db_session.commit()

    await db_session.refresh(template, attribute_names=['stages'])
    for staged in template.stages:
        await db_session.refresh(staged, attribute_names=['tasks'])

    plan = await create_plan_from_template(db_session, user, template, date(2024, 1, 1))
    assert plan.user_id == user.id

    loaded = await db_session.scalar(
        select(OnboardingPlan)
        .where(OnboardingPlan.user_id == user.id)
        .options(selectinload(OnboardingPlan.stages).selectinload(PlanStage.tasks))
    )
    assert loaded is not None
    assert loaded.stages[0].tasks[0].due_date == date(2024, 1, 4)


@pytest.mark.anyio
async def test_get_plan_for_user(db_session):
    user = await db_session.scalar(select(User).where(User.email == 'employee2@test.com'))
    plan = await get_plan_for_user(db_session, user)
    assert plan.user_id == user.id


@pytest.mark.anyio
async def test_get_plan_for_user_not_found(db_session):
    user = await db_session.scalar(select(User).where(User.email == 'employee@test.com'))
    with pytest.raises(HTTPException) as exc:
        await get_plan_for_user(db_session, user)
    assert exc.value.status_code == 404


@pytest.mark.anyio
async def test_create_user_with_plan(db_session):
    template = await db_session.scalar(select(TemplatePlan))
    admin = await db_session.scalar(select(User).where(User.email == 'admin@test.com'))
    payload = UserCreate(
        email='domain_created@test.com',
        password='pass123',
        full_name='Domain Created',
        role=UserRole.new_employee,
        template_id=template.id,
        start_date=date(2024, 1, 5),
    )
    user = await create_user_with_plan(db_session, payload, admin)
    plan = await db_session.scalar(select(OnboardingPlan).where(OnboardingPlan.user_id == user.id))
    assert plan is not None
