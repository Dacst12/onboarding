from datetime import date, timedelta

def daterange_offset(start: date, offset_days: int) -> date:
    return start + timedelta(days=offset_days)
