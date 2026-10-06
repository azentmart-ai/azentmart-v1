from datetime import date
from sqlalchemy import Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from ..base import Base
class Document(Base):
    __tablename__ = "documents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int | None] = mapped_column(ForeignKey("employees.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    category: Mapped[str] = mapped_column(String(80), default="HR Document", nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    file_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    expires_at: Mapped[date | None] = mapped_column(Date, nullable=True)
    visibility: Mapped[str] = mapped_column(String(40), default="HR", nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="Available", nullable=False)
