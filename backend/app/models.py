from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey, Boolean, JSON, UniqueConstraint
from .db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=True)
    role = Column(String, default="RECRUITER")
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
    avatar_url = Column(String, nullable=True)
    notifications = Column(JSON, default=lambda: {"email": True, "interviews": True, "candidates": True})
    preferences = Column(JSON, default=lambda: {"timezone": "Asia/Kolkata", "theme": "light", "language": "English"})
    reset_token_hash = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Job(Base):
    __tablename__ = "jobs"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    department = Column(String, default="")
    location = Column(String, default="")
    workplace_type = Column(String, default="Hybrid")
    employment_type = Column(String, default="Full-time")
    status = Column(String, default="ACTIVE")
    description = Column(Text, default="")
    requirements = Column(JSON, default=list)
    skills_required = Column(JSON, default=list)
    salary_range = Column(String, default="")
    creator_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(String, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, default="")
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    resume_filename = Column(String, nullable=True)
    resume_text = Column(Text, nullable=True)
    parsed_resume = Column(JSON, nullable=True)
    skills = Column(JSON, default=list)
    total_experience = Column(Float, nullable=True)
    talent_pool = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Application(Base):
    __tablename__ = "applications"
    id = Column(String, primary_key=True)
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(String, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    stage = Column(String, default="APPLIED")
    ai_match_score = Column(Float, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_pros = Column(JSON, default=list)
    ai_cons = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    __table_args__ = (UniqueConstraint("job_id", "candidate_id", name="uq_application_job_candidate"),)

class Interview(Base):
    __tablename__ = "interviews"
    id = Column(String, primary_key=True)
    application_id = Column(String, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    interviewer_id = Column(String, ForeignKey("users.id"), nullable=True)
    is_ai_conducted = Column(Boolean, default=True)
    scheduled_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String, default="SCHEDULED")
    transcript = Column(JSON, nullable=True)
    evaluation_score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    recording_url = Column(String, nullable=True)
    questions = Column(JSON, nullable=True)

class Activity(Base):
    __tablename__ = "activities"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    candidate_id = Column(String, ForeignKey("candidates.id", ondelete="SET NULL"), nullable=True)
    job_id = Column(String, ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True)
    type = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    job_id = Column(String, ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True)
    subject = Column(String, default="")
    body = Column(Text, default="")
    status = Column(String, default="DRAFT")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CampaignRecipient(Base):
    __tablename__ = "campaign_recipients"
    id = Column(String, primary_key=True)
    campaign_id = Column(String, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(String, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="PENDING")
    sent_at = Column(DateTime, nullable=True)
    __table_args__ = (UniqueConstraint("campaign_id", "candidate_id", name="uq_campaign_recipient"),)

class PasswordResetRequest(Base):
    __tablename__ = "password_reset_requests"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
