import pytest

from app.core.constants import UserRole
from app.core.security import hash_password
from app.models.user import User


@pytest.mark.anyio
async def test_contacts_requires_auth(client):
    res = await client.get('/contacts')
    assert res.status_code == 401


@pytest.mark.anyio
async def test_contacts_excludes_admin(client):
    res = await client.post('/auth/login', json={'email': 'mentor@test.com', 'password': 'mentor123'})
    token = res.json()['access_token']
    res2 = await client.get('/contacts', headers={'Authorization': f'Bearer {token}'})
    assert res2.status_code == 200
    roles = {item['role'] for item in res2.json()}
    assert 'admin' not in roles


@pytest.mark.anyio
async def test_contacts_search_by_name_and_tags(client, db_session):
    user = User(
        email='contact_search@test.com',
        hashed_password=hash_password('contact123'),
        full_name='Alice Example',
        role=UserRole.new_employee,
        responsibility_tags='python,backend',
    )
    db_session.add(user)
    await db_session.commit()

    res = await client.post('/auth/login', json={'email': 'employee@test.com', 'password': 'employee123'})
    token = res.json()['access_token']

    res2 = await client.get('/contacts?search=Alice', headers={'Authorization': f'Bearer {token}'})
    assert res2.status_code == 200
    assert any(item['email'] == user.email for item in res2.json())

    res3 = await client.get('/contacts?search=python', headers={'Authorization': f'Bearer {token}'})
    assert res3.status_code == 200
    assert any(item['email'] == user.email for item in res3.json())
