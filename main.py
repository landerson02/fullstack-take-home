import os
import shutil
import uuid
from typing import List

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

portfolio_db = {}  # Simulated in-memory DB


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
    portfolio_db[data.user_id] = data.items
    return {"status": "success"}


@app.get("/load-portfolio/{user_id}")
async def load_portfolio(user_id: str):
    return {"items": portfolio_db.get(user_id, [])}
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
