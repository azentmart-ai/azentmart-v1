from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..deps import get_current_user
from ..models.models import KnowledgeBase
from ..schemas.common import KnowledgeBaseIn

router = APIRouter(prefix="/api/knowledge-bases", tags=["Knowledge Base"])


def out(x):
    return {"id": x.id, "title": x.title, "language": x.language, "content": x.content, "source_type": x.source_type, "active": x.active, "created_at": x.created_at}


@router.get("/")
def list_(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return [out(x) for x in db.query(KnowledgeBase).filter(KnowledgeBase.user_id == user.id).order_by(KnowledgeBase.id.desc()).all()]


@router.post("/", status_code=201)
def create(data: KnowledgeBaseIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = KnowledgeBase(**data.model_dump(), user_id=user.id)
    db.add(x); db.commit(); db.refresh(x)
    return out(x)


@router.get("/{id}")
def get(id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(KnowledgeBase).filter(KnowledgeBase.id == id, KnowledgeBase.user_id == user.id).first()
    if not x: raise HTTPException(404, "Knowledge base not found")
    return out(x)


@router.put("/{id}")
def update(id: int, data: KnowledgeBaseIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(KnowledgeBase).filter(KnowledgeBase.id == id, KnowledgeBase.user_id == user.id).first()
    if not x: raise HTTPException(404, "Knowledge base not found")
    for k, v in data.model_dump().items(): setattr(x, k, v)
    db.commit(); db.refresh(x)
    return out(x)


@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(KnowledgeBase).filter(KnowledgeBase.id == id, KnowledgeBase.user_id == user.id).first()
    if not x: raise HTTPException(404, "Knowledge base not found")
    db.delete(x); db.commit()
    return {"message": "Knowledge base deleted"}
