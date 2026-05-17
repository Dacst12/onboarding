import pytest
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.onboarding_plan import OnboardingPlan, PlanStage, Task
from app.models.user import User


async def login(client, email: str, password: str) -> str:
    res = await client.post('/auth/login', json={'email': email, 'password': password})
    return res.json()['access_token']


@pytest.mark.anyio
async def test_me_plan_not_found(client):
    token = await login(client, 'employee@test.com', 'employee123')
    res = await client.get('/me/plan', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 404


@pytest.mark.anyio
async def test_me_plan_success(client):
    token = await login(client, 'employee2@test.com', 'employee234')
    res = await client.get('/me/plan', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 200
    body = res.json()
    assert body['user_id']
    assert body['stages']


@pytest.mark.anyio
async def test_complete_and_uncomplete_task(client, db_session):
    user = await db_session.scalar(select(User).where(User.email == 'employee2@test.com'))
    plan = await db_session.scalar(
        select(OnboardingPlan)
        .where(OnboardingPlan.user_id == user.id)
        .options(selectinload(OnboardingPlan.stages).selectinload(PlanStage.tasks))
    )
    task_id = plan.stages[0].tasks[0].id

    token = await login(client, 'employee2@test.com', 'employee234')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.patch(f'/me/tasks/{task_id}/complete', headers=headers)
    assert res.status_code == 200
    task = await db_session.get(Task, task_id)
    await db_session.refresh(task)
    assert task.is_completed is True
    assert task.completed_at is not None

    res2 = await client.patch(f'/me/tasks/{task_id}/uncomplete', headers=headers)
    assert res2.status_code == 200
    task2 = await db_session.get(Task, task_id)
    await db_session.refresh(task2)
    assert task2.is_completed is False
    assert task2.completed_at is None


@pytest.mark.anyio
async def test_complete_task_forbidden(client, db_session):
    user = await db_session.scalar(select(User).where(User.email == 'employee2@test.com'))
    plan = await db_session.scalar(
        select(OnboardingPlan)
        .where(OnboardingPlan.user_id == user.id)
        .options(selectinload(OnboardingPlan.stages).selectinload(PlanStage.tasks))
    )
    task_id = plan.stages[0].tasks[0].id

    token = await login(client, 'employee@test.com', 'employee123')
    res = await client.patch(f'/me/tasks/{task_id}/complete', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 403


@pytest.mark.anyio
async def test_complete_task_not_found(client):
    token = await login(client, 'employee2@test.com', 'employee234')
    res = await client.patch('/me/tasks/999999/complete', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 404


@pytest.mark.anyio
async def test_feedback_create_and_available(client):
    token = await login(client, 'employee@test.com', 'employee123')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.get('/me/feedback/available', headers=headers)
    assert res.status_code == 200
    assert res.json()['available'] is True

    res2 = await client.post('/me/feedback', headers=headers, json={'week_number': 1, 'mood': 3})
    assert res2.status_code == 200

    res3 = await client.get('/me/feedback/available', headers=headers)
    assert res3.status_code == 200
    assert res3.json()['available'] is False

    res4 = await client.post('/me/feedback', headers=headers, json={'week_number': 1, 'mood': 4})
    assert res4.status_code == 409


@pytest.mark.anyio
async def test_feedback_validation_errors(client):
    token = await login(client, 'employee2@test.com', 'employee234')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.post('/me/feedback', headers=headers, json={'week_number': 0, 'mood': 3})
    assert res.status_code == 422

    res2 = await client.post('/me/feedback', headers=headers, json={'week_number': 1, 'mood': 6})
    assert res2.status_code == 422
