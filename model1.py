# schemas.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str = Field(..., example="Project Demo")
    description: Optional[str] = Field(None, example="Zoom link etc.")
    date: datetime = Field(..., example="2025-11-01T10:00:00Z")
    location: Optional[str] = Field(None, example="Online")

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    date: Optional[datetime]
    location: Optional[str]

class EventOut(EventBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
