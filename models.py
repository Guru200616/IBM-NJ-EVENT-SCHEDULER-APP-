# models.py
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    date = Column(DateTime(timezone=True), nullable=False, index=True)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
