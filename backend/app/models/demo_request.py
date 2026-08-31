from sqlalchemy import Column, Integer, String, Date, Time, DateTime
from sqlalchemy.sql import func

from ..db import Base


class DemoRequest(Base):
    __tablename__ = "demo_request"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    full_name = Column(
        String(150),
        nullable=False,
    )

    business_email = Column(
        String(255),
        nullable=False,
    )

    designation = Column(
        String(100),
        nullable=True,
    )

    phone_number = Column(
        String(30),
        nullable=True,
    )

    demo_focus = Column(
        String(150),
        nullable=True,
    )

    preferred_date = Column(
        Date,
        nullable=True,
    )

    preferred_time = Column(
        Time,
        nullable=True,
    )

    status = Column(
        String(30),
        default="pending",
        nullable=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=True,
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True,
    )