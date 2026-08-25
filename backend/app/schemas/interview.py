from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InterviewSessionCreate(BaseModel):

    user_id: int

    company: str

    job_description: str

    session_type: str = "interview"

    model: str

    language: str = "English"

    resume_added: bool = False

    documents_added: bool = False

    extra_context_added: bool = False

    auto_answer: bool = False

    save_transcript: bool = False

    status: str = "active"


class InterviewSessionResponse(BaseModel):

    id: int

    user_id: int

    company: str

    job_description: str

    session_type: str

    model: str

    language: str

    resume_added: bool
    documents_added: bool
    extra_context_added: bool
    auto_answer: bool
    save_transcript: bool

    status: str

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )