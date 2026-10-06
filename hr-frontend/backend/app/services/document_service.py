from sqlalchemy.orm import Session

from ..models import Document


def list_documents(db: Session):
    return (
        db.query(Document)
        .order_by(Document.id)
        .all()
    )
