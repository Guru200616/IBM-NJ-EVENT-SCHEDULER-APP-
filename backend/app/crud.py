from bson import ObjectId
from typing import List
from .database import db
import datetime

EVENT_COL = db.events

def format_event(doc: dict) -> dict:
    if not doc:
        return doc
    doc["_id"] = str(doc["_id"])
    return doc

# Create
async def create_event(data: dict) -> dict:
    result = await EVENT_COL.insert_one(data)
    doc = await EVENT_COL.find_one({"_id": result.inserted_id})
    return format_event(doc)

# Read all
async def list_events(limit: int = 100) -> List[dict]:
    cursor = EVENT_COL.find().sort("start", 1).limit(limit)
    docs = []
    async for d in cursor:
        docs.append(format_event(d))
    return docs

# Get one
async def get_event(event_id: str):
    doc = await EVENT_COL.find_one({"_id": ObjectId(event_id)})
    return format_event(doc)

# Update
async def update_event(event_id: str, data: dict):
    await EVENT_COL.update_one({"_id": ObjectId(event_id)}, {"$set": data})
    return await get_event(event_id)

# Delete
async def delete_event(event_id: str):
    r = await EVENT_COL.delete_one({"_id": ObjectId(event_id)})
    return r.deleted_count == 1
