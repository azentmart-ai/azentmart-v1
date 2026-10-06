from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from ..base import Base

class AttendanceRegularization(Base):
    __tablename__ = "attendance_regularizations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    attendance_id: Mapped[int | None] = mapped_column(ForeignKey("attendance.id"), nullable=True)
    requested_check_in: Mapped[str | None] = mapped_column(String(10), nullable=True)
    requested_check_out: Mapped[str | None] = mapped_column(String(10), nullable=True)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="Pending", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
