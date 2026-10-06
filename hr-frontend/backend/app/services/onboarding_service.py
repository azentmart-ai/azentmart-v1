from sqlalchemy.orm import Session

from ..models import Onboarding


def list_onboarding(db: Session):
    return db.query(Onboarding).all()
