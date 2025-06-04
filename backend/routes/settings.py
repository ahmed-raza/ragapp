from fastapi import APIRouter, Depends
from schemas.user import UserResponse
from core.security import get_current_user
from models.user import User

router = APIRouter()

@router.get("/settings", response_model=UserResponse)
def settings_route(current_user: User = Depends(get_current_user)):
    return current_user
