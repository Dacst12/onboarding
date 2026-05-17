from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    detail: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class DateRangeResponse(ORMBase):
    start_date: date
    end_date: date | None = None
    created_at: datetime | None = None

