from datetime import date
from sqlalchemy import Date, ForeignKey, Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column
from ..base import Base
class Attendance(Base):
    __tablename__ = "attendance"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False)
    work_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    check_in: Mapped[str | None] = mapped_column(String(10), nullable=True)
    check_out: Mapped[str | None] = mapped_column(String(10), nullable=True)
    break_minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    working_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    overtime_hours: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="Present", nullable=False)
    remarks: Mapped[str | None] = mapped_column(String(500), nullable=True)
    source: Mapped[str] = mapped_column(String(40), default="system", nullable=False)
