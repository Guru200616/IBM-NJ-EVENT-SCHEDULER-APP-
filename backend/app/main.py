import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from typing import List
from .schemas import EventCreate, EventOut, EventUpdate
from . import crud
from .config import settings
from .database import db

app = FastAPI(title="Event Scheduler API")

# Serve frontend static
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def root():
    return FileResponse("static/index.html")

# CRUD endpoints
@app.post("/api/events", response_model=EventOut)
async def create_event(event: EventCreate):
    data = event.dict()
    # ensure datetime objects are stored as ISO datetime
    doc = await crud.create_event(data)
    return doc

@app.get("/api/events", response_model=List[EventOut])
async def list_events():
    docs = await crud.list_events()
    return docs

@app.get("/api/events/{event_id}", response_model=EventOut)
async def get_event(event_id: str):
    doc = await crud.get_event(event_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Event not found")
    return doc

@app.put("/api/events/{event_id}", response_model=EventOut)
async def update_event(event_id: str, event: EventUpdate):
    data = {k:v for k,v in event.dict().items() if v is not None}
    doc = await crud.update_event(event_id, data)
    if not doc:
        raise HTTPException(status_code=404, detail="Event not found")
    return doc

@app.delete("/api/events/{event_id}")
async def delete_event(event_id: str):
    ok = await crud.delete_event(event_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"status": "deleted"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
