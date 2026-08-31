from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..deps import get_current_user
from ..models.models import Segment, Contact
from ..schemas.common import SegmentIn

router = APIRouter(prefix="/api/segments", tags=["Segments"])


def out(x, db, user_id):
    count = db.query(Contact).filter(Contact.user_id == user_id, Contact.segment == x.name).count()
    return {"id": x.id, "name": x.name, "description": x.description, "contacts": count, "status": x.status, "created_at": x.created_at}


@router.get("/")
def list_(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return [out(x, db, user.id) for x in db.query(Segment).filter(Segment.user_id == user.id).order_by(Segment.id.desc()).all()]


@router.post("/", status_code=201)
def create(data: SegmentIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = Segment(**data.model_dump(), user_id=user.id)
    db.add(x); db.commit(); db.refresh(x)
    return out(x, db, user.id)


@router.put("/{id}")
def update(id: int, data: SegmentIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(Segment).filter(Segment.id == id, Segment.user_id == user.id).first()
    if not x: raise HTTPException(404, "Segment not found")
    for k, v in data.model_dump().items(): setattr(x, k, v)
    db.commit(); db.refresh(x)
    return out(x, db, user.id)


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(Segment).filter(Segment.id == id, Segment.user_id == user.id).first()
    if not x: raise HTTPException(404, "Segment not found")
    db.delete(x); db.commit()
    return {"message": "Segment deleted"}
