# for reference - not used for motor directly but helpful
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    start: datetime
    end: Optional[datetime] = None
    location: Optional[str] = None
    organizer: Optional[str] = None

class EventInDB(EventCreate):
    id: str = Field(..., alias="_id")
