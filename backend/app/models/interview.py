from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    JSON
)

from sqlalchemy.sql import func

from app.database import Base


class InterviewSession(Base):

    __tablename__ = "interview_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    company = Column(
        String(255),
        nullable=False
    )

    job_description = Column(
        Text,
        nullable=False
    )

    session_type = Column(
        String(50),
        default="interview",
        nullable=False
    )

    model = Column(
        String(100),
        nullable=False
    )

    language = Column(
        String(50),
        default="English",
        nullable=False
    )

    resume_added = Column(
        Boolean,
        default=False,
        nullable=False
    )

    # Added resume_id & document_ids columns here
    resume_id = Column(
        Integer,
        nullable=True
    )

    documents_added = Column(
        Boolean,
        default=False,
        nullable=False
    )

    document_ids = Column(
        JSON,
        nullable=True
    )

    extra_context_added = Column(
        Boolean,
        default=False,
        nullable=False
    )

    auto_answer = Column(
        Boolean,
        default=False,
        nullable=False
    )

    save_transcript = Column(
        Boolean,
        default=False,
        nullable=False
    )

    status = Column(
        String(20),
        default="active",
        nullable=False
    )

    transcript_text = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )