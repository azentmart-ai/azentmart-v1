from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database import Base


class Resume(Base):

    __tablename__ = "resumes"

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
        nullable=False,
        index=True
    )

    # Resume information

    title = Column(
        String(255),
        nullable=True
    )

    name = Column(
        String(255),
        nullable=True
    )

    email = Column(
        String(255),
        nullable=True
    )

    phone = Column(
        String(50),
        nullable=True
    )

    linkedin = Column(
        String(500),
        nullable=True
    )

    location = Column(
        String(255),
        nullable=True
    )

    summary = Column(
        Text,
        nullable=True
    )

    skills = Column(
        Text,
        nullable=True
    )

    experience = Column(
        Text,
        nullable=True
    )

    education = Column(
        Text,
        nullable=True
    )

    certifications = Column(
        Text,
        nullable=True
    )

    # Uploaded file information

    file_name = Column(
        String(255),
        nullable=True
    )

    file_path = Column(
        String(500),
        nullable=True
    )

    extracted_text = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )