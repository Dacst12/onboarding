from __future__ import annotations

from datetime import date, datetime, timezone

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class OnboardingPlan(Base):
    __tablename__ = 'onboarding_plans'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    template_id: Mapped[int | None] = mapped_column(ForeignKey('template_plans.id', ondelete='SET NULL'), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship('User', back_populates='onboarding_plan')
    stages = relationship('PlanStage', back_populates='plan', cascade='all, delete-orphan')

    @property
    def progress_percent(self) -> int:
        total = sum(len(stage.tasks) for stage in self.stages)
        if total == 0:
            return 0
        completed = sum(1 for stage in self.stages for task in stage.tasks if task.is_completed)
        return int(round((completed / total) * 100))


class PlanStage(Base):
    __tablename__ = 'plan_stages'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey('onboarding_plans.id', ondelete='CASCADE'), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)

    plan = relationship('OnboardingPlan', back_populates='stages')
    tasks = relationship('Task', back_populates='stage', cascade='all, delete-orphan')


class Task(Base):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    stage_id: Mapped[int] = mapped_column(ForeignKey('plan_stages.id', ondelete='CASCADE'), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_system_task: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    requires_confirmation: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    added_by_mentor_id: Mapped[int | None] = mapped_column(ForeignKey('users.id'), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    stage = relationship('PlanStage', back_populates='tasks')
    added_by_mentor = relationship('User', back_populates='added_tasks')
