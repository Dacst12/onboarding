from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import UserRole
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.feedback import Feedback
    from app.models.onboarding_plan import OnboardingPlan, Task
    from app.models.template_plan import TemplateTask


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.new_employee, nullable=False)
    position: Mapped[str | None] = mapped_column(String(255), nullable=True)
    department: Mapped[str | None] = mapped_column(String(255), nullable=True)
    telegram: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    responsibility_tags: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    mentor_id: Mapped[int | None] = mapped_column(ForeignKey('users.id'), nullable=True)

    mentor: Mapped[User | None] = relationship('User', remote_side='User.id', back_populates='mentees')
    mentees: Mapped[list[User]] = relationship('User', back_populates='mentor')
    onboarding_plan: Mapped[OnboardingPlan | None] = relationship('OnboardingPlan', back_populates='user', uselist=False)
    feedbacks: Mapped[list[Feedback]] = relationship('Feedback', back_populates='user')
    added_tasks: Mapped[list[Task]] = relationship('Task', back_populates='added_by_mentor')
    added_template_tasks: Mapped[list[TemplateTask]] = relationship('TemplateTask', back_populates='created_by')
