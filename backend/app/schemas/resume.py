from pydantic import BaseModel
from typing import Optional


class ResumeCreate(BaseModel):

    user_id: int

    title: Optional[str] = None
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

    file_name: Optional[str] = None
    file_path: Optional[str] = None
    extracted_text: Optional[str] = None


class ResumeUpdate(BaseModel):

    title: Optional[str] = None
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


class ResumeResponse(BaseModel):

    id: int
    user_id: int

    title: Optional[str] = None
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

    file_name: Optional[str] = None
    file_path: Optional[str] = None
    extracted_text: Optional[str] = None

    model_config = {
        "from_attributes": True
    }