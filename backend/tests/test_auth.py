import pytest

from app.core.security import create_access_token


async def login(client, email: str, password: str):
    return await client.post('/auth/login', json={'email': email, 'password': password})


@pytest.mark.anyio
async def test_login_and_refresh(client):
    res = await login(client, 'employee@test.com', 'employee123')
    assert res.status_code == 200
    assert 'access_token' in res.json()
    assert 'refresh_token=' in res.headers.get('set-cookie', '')

    res2 = await client.post('/auth/refresh')
    assert res2.status_code == 200
    assert 'access_token' in res2.json()


@pytest.mark.anyio
async def test_login_invalid_password(client):
    res = await login(client, 'employee@test.com', 'wrong')
    assert res.status_code == 401
    assert res.json()['detail'] == 'Invalid credentials'


@pytest.mark.anyio
async def test_login_inactive_user(client):
    res = await login(client, 'inactive@test.com', 'inactive123')
    assert res.status_code == 401


@pytest.mark.anyio
async def test_refresh_missing_cookie(client):
    res = await client.post('/auth/refresh')
    assert res.status_code == 401
    assert res.json()['detail'] == 'Missing refresh token'


@pytest.mark.anyio
async def test_refresh_invalid_token_type(client):
    access_token = create_access_token('1')
    client.cookies.set('refresh_token', access_token)
    res = await client.post('/auth/refresh')
    assert res.status_code == 401
    assert res.json()['detail'] == 'Invalid or expired refresh token'


@pytest.mark.anyio
async def test_logout_clears_cookie(client):
    res = await client.post('/auth/logout')
    assert res.status_code == 200
    assert 'refresh_token=' in res.headers.get('set-cookie', '')
