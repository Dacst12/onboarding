from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import UserRole
from app.db.session import get_db
from app.dependencies.auth import require_roles
from app.models.user import User
from app.schemas.user import ContactRead

router = APIRouter(tags=["contacts"])


@router.get("/contacts", response_model=list[ContactRead])
async def contacts(
    search: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.new_employee, UserRole.mentor, UserRole.admin])),
):
    stmt = select(User).where(User.is_active.is_(True), User.role != UserRole.admin)

    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(
            or_(
                User.full_name.ilike(pattern),
                User.responsibility_tags.ilike(pattern),
            )
        )

    result = await db.execute(stmt)
    users = result.scalars().all()
    return users
