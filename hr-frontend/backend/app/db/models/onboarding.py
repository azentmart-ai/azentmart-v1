from sqlalchemy import ForeignKey, Integer, String, JSON
from sqlalchemy.orm import Mapped, mapped_column

from ..base import Base


class Onboarding(Base):
    __tablename__ = "onboarding"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"), nullable=False, index=True)
    progress: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="Not Started", nullable=False)
    details: Mapped[dict | None] = mapped_column(JSON, nullable=True)
