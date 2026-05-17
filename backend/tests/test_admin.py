import pytest
from sqlalchemy import select

from app.core.constants import UserRole
from app.core.security import verify_password
from app.models.template_plan import TemplatePlan, TemplateStage, TemplateTask
from app.models.user import User


async def login(client, email: str, password: str) -> str:
    res = await client.post('/auth/login', json={'email': email, 'password': password})
    return res.json()['access_token']


@pytest.mark.anyio
async def test_admin_templates_crud(client, db_session):
    token = await login(client, 'admin@test.com', 'admin123')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.get('/admin/templates', headers=headers)
    assert res.status_code == 200

    res2 = await client.post('/admin/templates', headers=headers, json={'title': 'Template X'})
    assert res2.status_code == 200
    template_id = res2.json()['id']

    res3 = await client.get(f'/admin/templates/{template_id}', headers=headers)
    assert res3.status_code == 200

    res4 = await client.put(f'/admin/templates/{template_id}', headers=headers, json={'title': 'Template Y'})
    assert res4.status_code == 200
    assert res4.json()['title'] == 'Template Y'

    res5 = await client.delete(f'/admin/templates/{template_id}', headers=headers)
    assert res5.status_code == 200

    res6 = await client.get(f'/admin/templates/{template_id}', headers=headers)
    assert res6.status_code == 404


@pytest.mark.anyio
async def test_admin_template_stage_task_crud(client, db_session):
    token = await login(client, 'admin@test.com', 'admin123')
    headers = {'Authorization': f'Bearer {token}'}

    template = TemplatePlan(title='Template Stage')
    db_session.add(template)
    await db_session.commit()
    await db_session.refresh(template)

    res = await client.post(f'/admin/templates/{template.id}/stages', headers=headers, json={'title': 'Stage 1', 'order_index': 1})
    assert res.status_code == 200

    stage = await db_session.scalar(select(TemplateStage).where(TemplateStage.template_id == template.id))
    res2 = await client.put(
        f'/admin/templates/{template.id}/stages/{stage.id}',
        headers=headers,
        json={'title': 'Stage 2'},
    )
    assert res2.status_code == 200

    res3 = await client.post(
        f'/admin/templates/stages/{stage.id}/tasks',
        headers=headers,
        json={'title': 'Task 1', 'description': 'Desc', 'offset_days': 2},
    )
    assert res3.status_code == 200

    task = await db_session.scalar(select(TemplateTask).where(TemplateTask.stage_id == stage.id))
    res4 = await client.put(
        f'/admin/templates/stages/{stage.id}/tasks/{task.id}',
        headers=headers,
        json={'title': 'Task 2'},
    )
    assert res4.status_code == 200

    res5 = await client.delete(f'/admin/templates/stages/{stage.id}/tasks/{task.id}', headers=headers)
    assert res5.status_code == 200

    res6 = await client.delete(f'/admin/templates/{template.id}/stages/{stage.id}', headers=headers)
    assert res6.status_code == 200


@pytest.mark.anyio
async def test_admin_user_crud(client, db_session):
    token = await login(client, 'admin@test.com', 'admin123')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.post(
        '/admin/users',
        headers=headers,
        json={'email': 'mentor_new@test.com', 'password': 'mentor123', 'full_name': 'Mentor New', 'role': 'mentor'},
    )
    assert res.status_code == 200

    res2 = await client.post(
        '/admin/users',
        headers=headers,
        json={'email': 'employee_new@test.com', 'password': 'employee123', 'full_name': 'Employee New', 'role': 'new_employee'},
    )
    assert res2.status_code == 400

    res3 = await client.post(
        '/admin/users',
        headers=headers,
        json={
            'email': 'employee_new2@test.com',
            'password': 'employee123',
            'full_name': 'Employee New 2',
            'role': 'new_employee',
            'template_id': 999999,
            'start_date': '2024-01-01',
        },
    )
    assert res3.status_code == 404

    template = await db_session.scalar(select(TemplatePlan))
    res4 = await client.post(
        '/admin/users',
        headers=headers,
        json={
            'email': 'employee_new3@test.com',
            'password': 'employee123',
            'full_name': 'Employee New 3',
            'role': 'new_employee',
            'template_id': template.id,
            'start_date': '2024-01-01',
        },
    )
    assert res4.status_code == 200

    res5 = await client.post(
        '/admin/users',
        headers=headers,
        json={'email': 'mentor_new@test.com', 'password': 'mentor123', 'full_name': 'Mentor New', 'role': 'mentor'},
    )
    assert res5.status_code == 409

    res6 = await client.get('/admin/users?role=new_employee', headers=headers)
    assert res6.status_code == 200
    assert all(item['role'] == 'new_employee' for item in res6.json())

    created_user = await db_session.scalar(select(User).where(User.email == 'mentor_new@test.com'))
    res7 = await client.patch(
        f'/admin/users/{created_user.id}',
        headers=headers,
        json={'full_name': 'Mentor Updated', 'password': 'newpass123'},
    )
    assert res7.status_code == 200
    await db_session.refresh(created_user)
    assert created_user.full_name == 'Mentor Updated'
    assert verify_password('newpass123', created_user.hashed_password)

    res8 = await client.delete(f'/admin/users/{created_user.id}', headers=headers)
    assert res8.status_code == 200
    refreshed = await db_session.get(User, created_user.id, populate_existing=True)
    assert refreshed.is_active is False


@pytest.mark.anyio
async def test_admin_access_forbidden(client):
    token = await login(client, 'mentor@test.com', 'mentor123')
    res = await client.get('/admin/templates', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 403


@pytest.mark.anyio
async def test_admin_cannot_edit_other_admin(client, db_session):
    other_admin = User(
        email='admin2@test.com',
        hashed_password='hash',
        full_name='Admin Two',
        role=UserRole.admin,
    )
    db_session.add(other_admin)
    await db_session.commit()
    await db_session.refresh(other_admin)

    token = await login(client, 'admin@test.com', 'admin123')
    headers = {'Authorization': f'Bearer {token}'}

    res = await client.patch(
        f'/admin/users/{other_admin.id}',
        headers=headers,
        json={'full_name': 'Admin Updated'},
    )
    assert res.status_code == 403

    res2 = await client.delete(f'/admin/users/{other_admin.id}', headers=headers)
    assert res2.status_code == 403
