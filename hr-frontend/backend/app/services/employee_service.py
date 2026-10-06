from sqlalchemy.orm import Session

from ..models import Employee


def list_employees(db: Session):
    return (
        db.query(Employee)
        .order_by(Employee.id.desc())
        .all()
    )
