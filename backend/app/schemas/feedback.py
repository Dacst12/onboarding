from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas.common import ORMBase


class FeedbackCreate(BaseModel):
    week_number: int = Field(ge=1)
    mood: int = Field(ge=1, le=5)
    tasks_clear: bool | None = None
    wish: str | None = None


class FeedbackRead(ORMBase):
    id: int
    user_id: int
    week_number: int
    mood: int
    tasks_clear: bool | None
    wish: str | None
    created_at: datetime

