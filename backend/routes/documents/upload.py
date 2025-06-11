from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from models.user import User
from models.document import Document
from sqlalchemy.orm import Session
from core.deps import get_db
from core.security import get_current_user
import os, shutil
from uuid import uuid4
from config import UPLOAD_DIR

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".csv"}

@router.post("/documents/upload")
def upload_documents(
    files: list[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    saved_docs = []
    for file in files:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"File type {ext} not allowed.")

        user_dir = os.path.join(UPLOAD_DIR, str(current_user.id))
        os.makedirs(user_dir, exist_ok=True)

        filename = f"{uuid4().hex}_{file.filename}"
        file_path = os.path.join(user_dir, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        document = Document(
            filename=file.filename,
            filepath=file_path,
            user_id=current_user.id,
        )
        db.add(document)
        saved_docs.append(document)

    db.commit()
    return {"detail": f"Uploaded {len(saved_docs)} document(s)."}
