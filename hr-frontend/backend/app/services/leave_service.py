from sqlalchemy.orm import Session

from ..models import Leave


def list_leave(db: Session):
    return (
        db.query(Leave)
        .order_by(Leave.id.desc())
        .all()
    )
