import os
import shutil
import uuid
from typing import List

import uvicorn
from dotenv import load_dotenv
from fastapi import Body, FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from starlette.responses import FileResponse

load_dotenv()
MONGO_URL = os.environ.get("MONGO_URL")
BASE_URL = os.environ.get("BASE_URL", "http://localhost:8000")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

USING_MONGO = bool(MONGO_URL)

# setup db
if USING_MONGO:
    client = AsyncIOMotorClient(MONGO_URL)
    db = client["cashmere_take_home"]
    collection = db["portfolios"]
else:
    portfolio_db = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class MediaItem(BaseModel):
    id: str
    filename: str
    media_type: str  # "image" or "video"
    title: str
    description: str
    category: str


class Portfolio(BaseModel):
    user_id: str
    items: List[MediaItem]


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1]
    unique_id = str(uuid.uuid4())
    saved_filename = f"{unique_id}{file_ext}"
    saved_path = os.path.join(UPLOAD_DIR, saved_filename)

    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    media_type = "video" if "video" in file.content_type else "image"

    return {
        "id": unique_id,
        "filename": saved_filename,
        "media_type": media_type,
        "url": f"/uploads/{saved_filename}",
    }


@app.post("/save-portfolio")
async def save_portfolio(data: Portfolio):
    if USING_MONGO:
        await collection.update_one(
            {"user_id": data.user_id},
            {"$set": {"items": [item.dict() for item in data.items]}},
            upsert=True,
        )
    else:
        portfolio_db[data.user_id] = [item.model_dump() for item in data.items]

    return {"status": "success"}


@app.get("/load-portfolio/{user_id}")
async def load_portfolio(user_id: str, request: Request):
    if USING_MONGO:
        doc = await collection.find_one({"user_id": user_id})
        if not doc:
            return {"items": []}
        items = doc["items"]
    else:
        items = portfolio_db.get(user_id, [])

    # url depends on if local or prod
    base_url = str(request.base_url).rstrip("/")

    # add full url to all items
    for item in items:
        if isinstance(item, dict):
            item["url"] = f"{base_url}/uploads/{item['filename']}"
        else:
            item.url = f"{base_url}/uploads/{item.filename}"

    return {"items": items}


@app.delete("/remove-media")
async def remove_media(user_id: str = Body(...), media_id: str = Body(...)):
    if USING_MONGO:
        user_portfolio = await collection.find_one({"user_id": user_id})
        if not user_portfolio:
            return {"status": "error", "message": "User not found"}

        updated_items = [
            item for item in user_portfolio["items"] if item["id"] != media_id
        ]

        await collection.update_one(
            {"user_id": user_id}, {"$set": {"items": updated_items}}
        )
    else:
        if user_id not in portfolio_db:
            return {"status": "error", "message": "User not found"}

        updated_items = [
            item for item in portfolio_db[user_id] if item["id"] != media_id
        ]
        portfolio_db[user_id] = updated_items

    return {"status": "success", "removed": media_id}


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    port = 8000
    uvicorn.run("main:app", host="0.0.0.0", port=port)
