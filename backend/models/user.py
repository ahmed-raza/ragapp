from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created = Column(DateTime, default=func.now())
    last_login = Column(DateTime, nullable=True)

    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
