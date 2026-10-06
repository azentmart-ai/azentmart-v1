from datetime import date
from sqlalchemy import Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from ..base import Base

class Employee(Base):
    __tablename__ = "employees"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    designation: Mapped[str | None] = mapped_column(String(120), nullable=True)
    location: Mapped[str | None] = mapped_column(String(120), nullable=True)
    manager: Mapped[str | None] = mapped_column(String(150), nullable=True)
    employment_type: Mapped[str] = mapped_column(String(50), default="Full-time", nullable=False)
    salary: Mapped[float | None] = mapped_column(Float, nullable=True)
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    bank_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    bank_account: Mapped[str | None] = mapped_column(String(40), nullable=True)
    ifsc_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="Active", nullable=False)
    join_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
