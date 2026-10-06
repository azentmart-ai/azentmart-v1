from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import current_user
from ..models import Benefit

router = APIRouter(
    prefix="/benefits",
    tags=["Benefits"]
)


@router.get("")
def list_benefits(
    db: Session = Depends(get_db),
    user=Depends(current_user)
):
    rows = db.query(Benefit).order_by(Benefit.id).all()

    return [
        {
            "id": row.id,
            "title": row.title,
            "description": row.description,
            "status": row.status
        }
        for row in rows
    ]
