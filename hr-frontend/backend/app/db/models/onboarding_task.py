from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from ..base import Base

class OnboardingTask(Base):
    __tablename__ = "onboarding_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    onboarding_id: Mapped[int] = mapped_column(ForeignKey("onboarding.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(80), default="General", nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
