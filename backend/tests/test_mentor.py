import pytest
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.onboarding_plan import OnboardingPlan, PlanStage, Task
from app.models.user import User


async def login(client, email: str, password: str) -> str:
    res = await client.post('/auth/login', json={'email': email, 'password': password})
    return res.json()['access_token']


@pytest.mark.anyio
async def test_mentor_mentees(client):
    token = await login(client, 'mentor@test.com', 'mentor123')
    res = await client.get('/mentor/mentees', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 200
    body = res.json()
    names = {item['full_name'] for item in body}
    assert 'Employee' in names
    assert 'Employee With Plan' in names
    employee = next(item for item in body if item['full_name'] == 'Employee')
    employee_with_plan = next(item for item in body if item['full_name'] == 'Employee With Plan')
    assert employee['start_date'] is None
    assert employee_with_plan['start_date'] is not None


@pytest.mark.anyio
async def test_mentor_mentees_forbidden_for_employee(client):
    token = await login(client, 'employee@test.com', 'employee123')
    res = await client.get('/mentor/mentees', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 403


@pytest.mark.anyio
async def test_mentee_plan_access(client, db_session):
    mentor = await db_session.scalar(select(User).where(User.email == 'mentor@test.com'))
    mentee_no_plan = await db_session.scalar(select(User).where(User.email == 'employee@test.com'))
    mentee_with_plan = await db_session.scalar(select(User).where(User.email == 'employee2@test.com'))

    token = await login(client, mentor.email, 'mentor123')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.get(f'/mentor/mentees/{mentee_no_plan.id}/plan', headers=headers)
    assert res.status_code == 404

    res2 = await client.get(f'/mentor/mentees/{mentee_with_plan.id}/plan', headers=headers)
    assert res2.status_code == 200


@pytest.mark.anyio
async def test_mentee_plan_forbidden_for_other_mentor(client, db_session):
    other_mentor = await db_session.scalar(select(User).where(User.email == 'mentor2@test.com'))
    mentee = await db_session.scalar(select(User).where(User.email == 'employee3@test.com'))
    token = await login(client, 'mentor@test.com', 'mentor123')
    res = await client.get(f'/mentor/mentees/{mentee.id}/plan', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 403

    token2 = await login(client, other_mentor.email, 'mentor234')
    res2 = await client.get(f'/mentor/mentees/{mentee.id}/plan', headers={'Authorization': f'Bearer {token2}'})
    assert res2.status_code in (200, 404)


@pytest.mark.anyio
async def test_mentor_task_lifecycle(client, db_session):
    user = await db_session.scalar(select(User).where(User.email == 'employee2@test.com'))
    plan = await db_session.scalar(
        select(OnboardingPlan)
        .where(OnboardingPlan.user_id == user.id)
        .options(selectinload(OnboardingPlan.stages).selectinload(PlanStage.tasks))
    )
    stage_id = plan.stages[0].id
    system_task_id = plan.stages[0].tasks[0].id

    token = await login(client, 'mentor@test.com', 'mentor123')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.post(
        f'/mentor/mentees/{user.id}/tasks',
        headers=headers,
        json={'stage_id': stage_id, 'title': 'Extra', 'description': 'desc', 'due_date': '2024-01-10'},
    )
    assert res.status_code == 200

    new_task = await db_session.scalar(select(Task).where(Task.stage_id == stage_id, Task.title == 'Extra'))
    res2 = await client.patch(
        f'/mentor/mentees/{user.id}/tasks/{new_task.id}/deadline',
        headers=headers,
        json={'due_date': '2024-01-12'},
    )
    assert res2.status_code == 200
    refreshed = await db_session.get(Task, new_task.id)
    await db_session.refresh(refreshed)
    assert str(refreshed.due_date) == '2024-01-12'

    res3 = await client.delete(f'/mentor/mentees/{user.id}/tasks/{new_task.id}', headers=headers)
    assert res3.status_code == 200

    res4 = await client.delete(f'/mentor/mentees/{user.id}/tasks/{system_task_id}', headers=headers)
    assert res4.status_code == 403


@pytest.mark.anyio
async def test_mentor_task_errors(client, db_session):
    user = await db_session.scalar(select(User).where(User.email == 'employee2@test.com'))
    plan = await db_session.scalar(
        select(OnboardingPlan)
        .where(OnboardingPlan.user_id == user.id)
        .options(selectinload(OnboardingPlan.stages))
    )
    token = await login(client, 'mentor@test.com', 'mentor123')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.patch(
        f'/mentor/mentees/{user.id}/tasks/999999/deadline',
        headers=headers,
        json={'due_date': '2024-01-12'},
    )
    assert res.status_code == 404
    res2 = await client.post(
        f'/mentor/mentees/{user.id}/tasks',
        headers=headers,
        json={'stage_id': plan.stages[0].id, 'title': 'Bad', 'description': 'desc', 'due_date': 'bad-date'},
    )
    assert res2.status_code == 422


@pytest.mark.anyio
async def test_admin_can_manage_mentee_tasks(client, db_session):
    user = await db_session.scalar(select(User).where(User.email == 'employee2@test.com'))
    plan = await db_session.scalar(
        select(OnboardingPlan)
        .where(OnboardingPlan.user_id == user.id)
        .options(selectinload(OnboardingPlan.stages).selectinload(PlanStage.tasks))
    )
    stage_id = plan.stages[0].id

    token = await login(client, 'admin@test.com', 'admin123')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.get(f'/mentor/mentees/{user.id}/plan', headers=headers)
    assert res.status_code == 200

    res2 = await client.post(
        f'/mentor/mentees/{user.id}/tasks',
        headers=headers,
        json={'stage_id': stage_id, 'title': 'Admin Task', 'description': 'desc', 'due_date': '2024-02-01'},
    )
    assert res2.status_code == 200

    new_task = await db_session.scalar(select(Task).where(Task.stage_id == stage_id, Task.title == 'Admin Task'))
    res3 = await client.patch(
        f'/mentor/mentees/{user.id}/tasks/{new_task.id}/deadline',
        headers=headers,
        json={'due_date': '2024-02-05'},
    )
    assert res3.status_code == 200

    res4 = await client.delete(f'/mentor/mentees/{user.id}/tasks/{new_task.id}', headers=headers)
    assert res4.status_code == 200
