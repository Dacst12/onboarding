from datetime import date, datetime
from pydantic import BaseModel, Field

from app.schemas.common import ORMBase


class TaskCompleteResponse(BaseModel):
    detail: str


class TaskDeadlineUpdate(BaseModel):
    due_date: date


class MentorTaskCreate(BaseModel):
    stage_id: int
    title: str
    description: str | None = None
    due_date: date


class TaskRead(ORMBase):
    id: int
    stage_id: int
    title: str
    description: str | None
    due_date: date | None
    is_completed: bool
    completed_at: datetime | None
    is_system_task: bool
    requires_confirmation: bool
    added_by_mentor_id: int | None
    updated_at: datetime


class StageRead(ORMBase):
    id: int
    plan_id: int
    title: str
    order_index: int
    tasks: list[TaskRead] = []


class PlanRead(ORMBase):
    id: int
    user_id: int
    template_id: int | None
    start_date: date
    progress_percent: int
    stages: list[StageRead] = []


class MenteeSummary(BaseModel):
    id: int
    full_name: str
    position: str | None
    progress_percent: int
    start_date: date | None
    last_feedback_available: bool
