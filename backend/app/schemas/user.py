from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field

from app.core.constants import UserRole
from app.schemas.common import ORMBase


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.new_employee
    position: str | None = None
    department: str | None = None
    telegram: str | None = None
    phone: str | None = None
    responsibility_tags: str | None = None
    mentor_id: int | None = None


class UserCreate(UserBase):
    password: str = Field(min_length=1)
    template_id: int | None = None
    start_date: date | None = None


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    full_name: str | None = None
    role: UserRole | None = None
    position: str | None = None
    department: str | None = None
    telegram: str | None = None
    phone: str | None = None
    responsibility_tags: str | None = None
    mentor_id: int | None = None
    password: str | None = None
    is_active: bool | None = None


class UserRead(ORMBase):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole
    position: str | None
    department: str | None
    telegram: str | None
    phone: str | None
    responsibility_tags: str | None
    is_active: bool
    created_at: datetime
    mentor_id: int | None


class ContactRead(BaseModel):
    id: int
    full_name: str
    role: UserRole
    position: str | None
    department: str | None
    telegram: str | None
    phone: str | None
    email: EmailStr
    responsibility_tags: str | None

