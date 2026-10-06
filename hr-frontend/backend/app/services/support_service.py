from sqlalchemy.orm import Session

from ..models import Ticket


def list_tickets(db: Session, user_id: int):
    return (
        db.query(Ticket)
        .filter(Ticket.user_id == user_id)
        .order_by(Ticket.id.desc())
        .all()
    )
