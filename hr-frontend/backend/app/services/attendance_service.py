from sqlalchemy.orm import Session

from ..models import Attendance


def list_attendance(db: Session):
    return (
        db.query(Attendance)
        .order_by(Attendance.id.desc())
        .all()
    )
