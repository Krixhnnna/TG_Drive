from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pyrogram import Client
from sqlalchemy.orm import Session
import os, shutil, hashlib, hmac
from models import User, Folder, File as FileModel
from database import get_db
import json
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Telegram Configuration
API_ID = int(os.getenv("API_ID"))
API_HASH = os.getenv("API_HASH")
BOT_TOKEN = os.getenv("BOT_TOKEN")
GROUP_ID = int(os.getenv("GROUP_ID"))

# Initialize Pyrogram client
bot = Client("cloudbox_bot", api_id=API_ID, api_hash=API_HASH, bot_token=BOT_TOKEN)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await bot.start()
    yield
    # Shutdown
    await bot.stop()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_telegram_auth(auth_data: dict, bot_token: str) -> bool:
    """Verify Telegram login authentication"""
    check_hash = auth_data.pop('hash', '')
    data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted(auth_data.items())])
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    hash_value = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return hash_value == check_hash

@app.post("/auth/telegram")
async def telegram_auth(auth_data: dict, db: Session = Depends(get_db)):
    if not verify_telegram_auth(auth_data, BOT_TOKEN):
        raise HTTPException(status_code=400, detail="Invalid authentication")
    
    user = db.query(User).filter(User.telegram_id == auth_data['id']).first()
    if not user:
        user = User(
            telegram_id=auth_data['id'],
            username=auth_data.get('username'),
            first_name=auth_data.get('first_name'),
            last_name=auth_data.get('last_name'),
            profile_photo=auth_data.get('photo_url')
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return {"user": user, "token": f"user_{user.telegram_id}"}

@app.post("/folders/create")
async def create_folder(name: str = Form(...), user_id: int = Form(...), db: Session = Depends(get_db)):
    folder = Folder(name=name, owner_id=user_id)
    db.add(folder)
    db.commit()
    db.refresh(folder)
    return folder

@app.get("/folders/{user_id}")
async def get_folders(user_id: int, db: Session = Depends(get_db)):
    folders = db.query(Folder).filter(Folder.owner_id == user_id, Folder.is_trashed == False).all()
    return folders

@app.post("/upload")
async def upload_file(
    user_id: int = Form(...),
    folder_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save file temporarily
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Upload to Telegram group
    message = await bot.send_document(
        GROUP_ID,
        temp_path,
        caption=f"User: {user_id} | Folder: {folder_id} | File: {file.filename}"
    )
    
    # Save file metadata to database
    file_record = FileModel(
        filename=file.filename,
        telegram_file_id=message.document.file_id,
        telegram_message_id=message.id,
        file_size=file.size,
        mime_type=file.content_type,
        owner_id=user_id,
        folder_id=folder_id
    )
    db.add(file_record)
    db.commit()
    
    # Clean up temp file
    os.remove(temp_path)
    
    return {"status": "uploaded", "file_id": file_record.id}

@app.get("/files/{user_id}")
async def get_files(user_id: int, folder_id: int = None, db: Session = Depends(get_db)):
    query = db.query(FileModel).filter(FileModel.owner_id == user_id, FileModel.is_trashed == False)
    if folder_id:
        query = query.filter(FileModel.folder_id == folder_id)
    files = query.all()
    return files

@app.get("/stats/{user_id}")
async def get_stats(user_id: int, db: Session = Depends(get_db)):
    files_count = db.query(FileModel).filter(FileModel.owner_id == user_id).count()
    folders_count = db.query(Folder).filter(Folder.owner_id == user_id).count()
    trash_count = db.query(FileModel).filter(FileModel.owner_id == user_id, FileModel.is_trashed == True).count()
    favorites_count = db.query(FileModel).filter(FileModel.owner_id == user_id, FileModel.is_favorite == True).count()
    shared_files_count = db.query(FileModel).filter(FileModel.owner_id == user_id, FileModel.is_shared == True).count()
    shared_folders_count = db.query(Folder).filter(Folder.owner_id == user_id, Folder.is_shared == True).count()
    
    return {
        "files_added": files_count,
        "folders_created": folders_count,
        "trash_files": trash_count,
        "favorites": favorites_count,
        "files_shared": shared_files_count,
        "folders_shared": shared_folders_count
    }

@app.patch("/files/{file_id}/favorite")
async def toggle_favorite(file_id: int, db: Session = Depends(get_db)):
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_record.is_favorite = not file_record.is_favorite
    db.commit()
    return {"status": "updated", "is_favorite": file_record.is_favorite}

@app.delete("/files/{file_id}")
async def delete_file(file_id: int, db: Session = Depends(get_db)):
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_record.is_trashed = True
    db.commit()
    return {"status": "moved to trash"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 