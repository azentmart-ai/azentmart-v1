from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..deps import get_current_user
from ..models.models import Dialer
from ..schemas.common import DialerIn

router = APIRouter(prefix="/api/dialers", tags=["Dialers"])


def out(x):
    return {"id": x.id, "name": x.name, "type": x.type, "phoneNumber": x.phone_number, "phone_number": x.phone_number, "status": x.status, "calls": x.calls, "description": x.description, "createdAt": x.created_at}


@router.get("/")
def list_(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return [out(x) for x in db.query(Dialer).filter(Dialer.user_id == user.id).order_by(Dialer.id.desc()).all()]


@router.post("/", status_code=201)
def create(data: DialerIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = Dialer(**data.model_dump(), user_id=user.id)
    db.add(x); db.commit(); db.refresh(x)
    return out(x)


@router.put("/{id}")
def update(id: int, data: DialerIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(Dialer).filter(Dialer.id == id, Dialer.user_id == user.id).first()
    if not x: raise HTTPException(404, "Dialer not found")
    for k, v in data.model_dump().items(): setattr(x, k, v)
    db.commit(); db.refresh(x)
    return out(x)


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(Dialer).filter(Dialer.id == id, Dialer.user_id == user.id).first()
    if not x: raise HTTPException(404, "Dialer not found")
    db.delete(x); db.commit()
    return {"message": "Dialer deleted"}
