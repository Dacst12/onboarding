from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import create_access_token, create_refresh_token, decode_token, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest

router = APIRouter(prefix='/auth', tags=['auth'])
settings = get_settings()


@router.post('/login', response_model=AuthResponse)
async def login(payload: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()
    if not user or not user.is_active or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    response.set_cookie('refresh_token', refresh_token, httponly=True, secure=settings.COOKIE_SECURE, samesite=settings.COOKIE_SAMESITE)
    return {'access_token': access_token, 'token_type': 'bearer'}


@router.post('/refresh', response_model=AuthResponse)
async def refresh(request: Request, response: Response):
    token = request.cookies.get('refresh_token')
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Missing refresh token')
    try:
        payload = decode_token(token)
        if payload.get('type') != 'refresh':
            raise ValueError('Invalid token type')
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid or expired refresh token') from exc

    user_id = payload['sub']
    access_token = create_access_token(str(user_id))
    refresh_token = create_refresh_token(str(user_id))
    response.set_cookie('refresh_token', refresh_token, httponly=True, secure=settings.COOKIE_SECURE, samesite=settings.COOKIE_SAMESITE)
    return {'access_token': access_token, 'token_type': 'bearer'}


@router.post('/logout')
async def logout(response: Response):
    response.delete_cookie('refresh_token')
    return {'detail': 'Logged out'}
