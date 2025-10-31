# crud.py
from sqlalchemy.orm import Session
from models import Event
from schemas import EventCreate, EventUpdate
from datetime import datetime

def create_event(db: Session, event: EventCreate):
    db_event = Event(
        title=event.title,
        description=event.description,
        date=event.date,
        location=event.location,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_event(db: Session, event_id: int):
    return db.query(Event).filter(Event.id == event_id).first()

def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Event).order_by(Event.date).offset(skip).limit(limit).all()

def update_event(db: Session, event_id: int, event_update: EventUpdate):
    db_event = get_event(db, event_id)
    if not db_event:
        return None
    for field, value in event_update.dict(exclude_unset=True).items():
        setattr(db_event, field, value)
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = get_event(db, event_id)
    if not db_event:
        return False
    db.delete(db_event)
    db.commit()
    return True
