from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TemplatePlan(Base):
    __tablename__ = 'template_plans'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    stages = relationship('TemplateStage', back_populates='template', cascade='all, delete-orphan')


class TemplateStage(Base):
    __tablename__ = 'template_stages'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    template_id: Mapped[int] = mapped_column(ForeignKey('template_plans.id', ondelete='CASCADE'), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)

    template = relationship('TemplatePlan', back_populates='stages')
    tasks = relationship('TemplateTask', back_populates='stage', cascade='all, delete-orphan')


class TemplateTask(Base):
    __tablename__ = 'template_tasks'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    stage_id: Mapped[int] = mapped_column(ForeignKey('template_stages.id', ondelete='CASCADE'), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    offset_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    stage = relationship('TemplateStage', back_populates='tasks')
    created_by_id: Mapped[int | None] = mapped_column(ForeignKey('users.id'), nullable=True)
    created_by = relationship('User', back_populates='added_template_tasks')
