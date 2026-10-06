from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from ..base import Base

class PolicyAcknowledgement(Base):
    __tablename__ = "policy_acknowledgements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    policy_id: Mapped[int] = mapped_column(ForeignKey("policies.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    acknowledged_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
