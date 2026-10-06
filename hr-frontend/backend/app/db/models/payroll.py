from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from ..base import Base
class Payroll(Base):
    __tablename__ = "payroll"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    employee_id: Mapped[int | None] = mapped_column(ForeignKey("employees.id"), nullable=True)
    month: Mapped[str] = mapped_column(String(30), nullable=False)
    gross_pay: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    pf: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    tds: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    claims: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    professional_tax: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    other_deductions: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    net_pay: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="Processed", nullable=False)
