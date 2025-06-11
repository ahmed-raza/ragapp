from pydantic import BaseModel
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str

class DocumentCreate(DocumentBase):
    filepath: str

class DocumentOut(DocumentBase):
    id: int
    filepath: str
    uploaded_at: datetime

    class Config:
        from_attributes = True
