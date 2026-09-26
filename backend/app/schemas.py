from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field, EmailStr

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(min_length=6)

class ProfileUpdate(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None

class SettingsUpdate(BaseModel):
    notifications: Optional[dict[str, Any]] = None
    preferences: Optional[dict[str, Any]] = None

class JobCreate(BaseModel):
    title: str
    department: str = ""
    location: str = ""
    workplace_type: str = "Hybrid"
    employment_type: str = "Full-time"
    description: str = ""
    requirements: list[str] = Field(default_factory=list)
    skills_required: list[str] = Field(default_factory=list)
    salary_range: str = ""

class JobUpdate(JobCreate):
    status: str = "ACTIVE"

class ManualCandidate(BaseModel):
    first_name: str
    last_name: str = ""
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    skills: list[str] = Field(default_factory=list)
    total_experience: Optional[float] = None
    summary: str = ""

class MatchRequest(BaseModel):
    job_id: str
    candidate_ids: list[str] = Field(default_factory=list)

class MoveStage(BaseModel):
    application_id: str
    stage: str

class ContactRequest(BaseModel):
    subject: str = "Recruiting opportunity"
    message: str = ""

class ScheduleRequest(BaseModel):
    job_id: str
    scheduled_at: datetime
    duration_minutes: int = 45
    mode: str = "AI_VIDEO"

class InterviewStartRequest(BaseModel):
    application_id: str

class InterviewAnswerRequest(BaseModel):
    interview_id: str
    question: str
    answer: str
    category: str = "General"

class InterviewFinishRequest(BaseModel):
    interview_id: str

class JDRequest(BaseModel):
    title: str
    seniority: str = "Senior"
    skills: list[str] = Field(default_factory=list)
    workplace_type: str = "Hybrid"
    requirements: str = ""
    department: str = ""

class ChatRequest(BaseModel):
    message: str
    candidate_id: Optional[str] = None
    mode: str = "candidate"

class CampaignCreate(BaseModel):
    name: str
    job_id: Optional[str] = None
    subject: str = ""
    body: str = ""
    candidate_ids: list[str] = Field(default_factory=list)

class CampaignUpdate(CampaignCreate):
    status: str = "DRAFT"

class CandidateAgentAction(BaseModel):
    candidate_id: Optional[str] = None
    action: str

class ApplicationCreate(BaseModel):
    job_id: str
    candidate_id: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6)
