from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class ResumeBase(BaseModel):
    title: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    certifications: Optional[str] = None
    other_experience: Optional[str] = None
    education_entries: Optional[List[Any]] = None
    job_entries: Optional[List[Any]] = None
    other_entries: Optional[List[Any]] = None

class ResumeCreate(ResumeBase):
    user_id: int

class ResumeUpdate(ResumeBase):
    pass

class ResumeRename(BaseModel):
    title: str

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True