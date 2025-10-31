from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = ""
    start: datetime
    end: Optional[datetime] = None
    location: Optional[str] = None
    organizer: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    start: Optional[datetime]
    end: Optional[datetime]
    location: Optional[str]
    organizer: Optional[str]

class EventOut(EventBase):
    id: str = Field(..., alias="_id")
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
