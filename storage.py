"""Object storage for dish photos, backed by MongoDB (collection: file_blobs).

Replaces the Emergent-only storage proxy. Same interface as before:
put_object / get_object / init_storage. Photos are capped at 8 MB in app_routes.py,
which is under MongoDB's 16 MB document limit.
"""
from database import db


async def init_storage(force: bool = False):
    return True  # nothing to initialise


async def put_object(path: str, data: bytes, content_type: str) -> dict:
    await db.file_blobs.update_one(
        {"_id": path},
        {"$set": {"data": data, "content_type": content_type, "size": len(data)}},
        upsert=True,
    )
    return {"path": path, "size": len(data)}


async def get_object(path: str):
    doc = await db.file_blobs.find_one({"_id": path})
    if not doc:
        raise FileNotFoundError(path)
    return bytes(doc["data"]), doc.get("content_type", "application/octet-stream")
