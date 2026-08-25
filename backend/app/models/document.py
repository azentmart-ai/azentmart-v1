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


class Document(Base):

    __tablename__ = "documents"

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

    # Document basic details

    title = Column(
        String(255),
        nullable=False,
        index=True
    )

    source_type = Column(
        String(50),
        default="manual",
        nullable=False
    )

    content = Column(
        Text,
        nullable=True
    )

    # Uploaded file details

    file_name = Column(
        String(255),
        nullable=True
    )

    file_path = Column(
        String(500),
        nullable=True
    )

    # Scraped URL details

    original_url = Column(
        String(500),
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )