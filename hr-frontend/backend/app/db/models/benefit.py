from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from ..base import Base
class Benefit(Base):
    __tablename__ = "benefits"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    category: Mapped[str] = mapped_column(String(80), default="Employee Benefit", nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    coverage: Mapped[str | None] = mapped_column(String(250), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="Active", nullable=False)
