from fastapi import APIRouter, Depends
from schemas.document import DocumentOut
from core.security import get_current_user
from models.user import User
from typing import List

router = APIRouter()

@router.get("/documents", response_model=List[DocumentOut])
def get_documents(current_user: User = Depends(get_current_user)):
    return current_user.documents
