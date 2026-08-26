from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    linkedin = Column(String(500), nullable=True)
    location = Column(String(255), nullable=True)
    summary = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    education = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)
    other_experience = Column(Text, nullable=True)
    
    education_entries = Column(JSON, nullable=True)
    job_entries = Column(JSON, nullable=True)
    other_entries = Column(JSON, nullable=True)

    file_path = Column(String(500), nullable=True)
    file_name = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())