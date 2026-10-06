from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import current_user, require_roles
from ..models import Policy, PolicyAcknowledgement

router = APIRouter(prefix="/policies", tags=["Policies"])

@router.get("")
def list_policies(db: Session = Depends(get_db), user=Depends(current_user)):
    rows = db.query(Policy).order_by(Policy.id).all()
    acknowledged = {
        x.policy_id
        for x in db.query(PolicyAcknowledgement).filter(PolicyAcknowledgement.user_id == user.id).all()
    }
    return [
        {
            "id": x.id,
            "title": x.title,
            "description": x.description,
            "status": x.status,
            "version": x.version,
            "effective_date": str(x.effective_date) if x.effective_date else None,
            "acknowledged": x.id in acknowledged,
        }
        for x in rows
    ]

@router.post("/{policy_id}/acknowledge")
def acknowledge(policy_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    policy = db.get(Policy, policy_id)
    if not policy:
        raise HTTPException(404, "Policy not found")
    existing = db.query(PolicyAcknowledgement).filter(
        PolicyAcknowledgement.policy_id == policy_id,
        PolicyAcknowledgement.user_id == user.id,
    ).first()
    if not existing:
        db.add(PolicyAcknowledgement(policy_id=policy_id, user_id=user.id))
        db.commit()
    return {"message": "Policy acknowledged", "policy_id": policy_id}
