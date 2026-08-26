from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    source_type = Column(String(50), nullable=False)  # 'uploaded', 'scraped', 'manual'
    content = Column(Text, nullable=True)             # Text content or summary
    file_path = Column(String(500), nullable=True)    # Path for uploaded files
    file_name = Column(String(255), nullable=True)    # Original file name
    original_url = Column(String(1000), nullable=True) # URL if scraped
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())