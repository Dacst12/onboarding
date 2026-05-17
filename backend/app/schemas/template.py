from datetime import datetime
from pydantic import BaseModel

from app.schemas.common import ORMBase


class TemplateTaskCreate(BaseModel):
    title: str
    description: str | None = None
    offset_days: int = 0


class TemplateTaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    offset_days: int | None = None


class TemplateStageCreate(BaseModel):
    title: str
    order_index: int


class TemplateStageUpdate(BaseModel):
    title: str | None = None
    order_index: int | None = None


class TemplatePlanCreate(BaseModel):
    title: str


class TemplatePlanUpdate(BaseModel):
    title: str | None = None


class TemplateTaskRead(ORMBase):
    id: int
    stage_id: int
    title: str
    description: str | None
    offset_days: int


class TemplateStageRead(ORMBase):
    id: int
    template_id: int
    title: str
    order_index: int
    tasks: list[TemplateTaskRead] = []


class TemplatePlanRead(ORMBase):
    id: int
    title: str
    created_at: datetime
    stages: list[TemplateStageRead] = []

