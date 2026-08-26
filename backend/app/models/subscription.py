from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from app.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_name = Column(String(100), nullable=False) # 'Monthly', 'Yearly', 'Credits'
    billing_type = Column(String(50), nullable=False) # 'monthly', 'yearly', 'credits'
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(20), default="active") # 'active', 'expired', 'cancelled'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)

class PaymentLog(Base):
    __tablename__ = "payment_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    payment_method = Column(String(50), nullable=False) # 'upi', 'card'
    status = Column(String(20), default="success")
    transaction_id = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())