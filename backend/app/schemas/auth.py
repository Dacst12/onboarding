from pydantic import BaseModel, EmailStr, Field

from app.schemas.common import TokenResponse


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class RefreshResponse(TokenResponse):
    pass


class AuthResponse(TokenResponse):
    pass

