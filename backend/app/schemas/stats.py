from pydantic import BaseModel


class ProgressByDepartment(BaseModel):
    department: str | None
    avg_progress: float
    total_new_employees: int


class FeedbackPoint(BaseModel):
    week_number: int
    avg_mood: float

