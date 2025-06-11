from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)  # or URL, if using cloud storage
    uploaded_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="documents")
