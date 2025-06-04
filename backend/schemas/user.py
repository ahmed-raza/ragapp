from pydantic import BaseModel, EmailStr, StringConstraints
from typing import Annotated

class UserCreate(BaseModel):
    email: EmailStr
    username: Annotated[str, StringConstraints(min_length=3)]
    password: Annotated[str, StringConstraints(min_length=6)]

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str

    class Config:
        from_attributes = True
