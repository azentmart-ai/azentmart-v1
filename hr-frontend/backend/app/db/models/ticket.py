from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from ..base import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True
    )
    subject: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )
    category: Mapped[str] = mapped_column(
        String(100),
        default="General HR",
        nullable=False
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    status: Mapped[str] = mapped_column(String(40),default="Open",nullable=False)
    priority: Mapped[str] = mapped_column(String(30),default="Normal",nullable=False)
    assigned_to: Mapped[int | None] = mapped_column(Integer,nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
