from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from ..base import Base


class Leave(Base):
    __tablename__ = "leave_requests"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )
    employee_id: Mapped[int | None] = mapped_column(
        ForeignKey("employees.id"),
        nullable=True
    )
    leave_type: Mapped[str] = mapped_column(
        String(80),
        nullable=False
    )
    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )
    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )
    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(40),
        default="Pending",
        nullable=False
    )
