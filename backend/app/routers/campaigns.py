import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user
from ..models.models import Campaign, Assistant, Dialer, Segment, Contact
from ..schemas.common import CampaignIn

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])


def _owned(db, model, item_id, user_id, label):
    if item_id is None:
        return None
    obj = db.query(model).filter(model.id == item_id, model.user_id == user_id).first()
    if not obj:
        raise HTTPException(400, f"{label} does not belong to the current user")
    return obj


def _save_values(data: CampaignIn):
    values = data.model_dump()
    values["contact_filter_json"] = json.dumps(values.pop("contact_filter") or {})
    values["drip_days_json"] = json.dumps(values.pop("drip_days") or [])
    return values


def out(x: Campaign, db: Session) -> dict:
    assistant = db.get(Assistant, x.assistant_id) if x.assistant_id else None
    dialer = db.get(Dialer, x.dialer_id) if x.dialer_id else None
    segment = db.get(Segment, x.segment_id) if x.segment_id else None
    try:
        contact_filter = json.loads(x.contact_filter_json or "{}")
    except json.JSONDecodeError:
        contact_filter = {}
    try:
        drip_days = json.loads(x.drip_days_json or "[]")
    except json.JSONDecodeError:
        drip_days = []
    return {
        "id": x.id,
        "name": x.name,
        "assistant": assistant.name if assistant else "",
        "assistant_id": x.assistant_id,
        "assistantId": x.assistant_id,
        "dialer": dialer.phone_number if dialer else "",
        "dialer_id": x.dialer_id,
        "dialerId": x.dialer_id,
        "segment": segment.name if segment else "",
        "segment_id": x.segment_id,
        "segmentId": x.segment_id,
        "status": x.status,
        "type": x.call_type,
        "call_type": x.call_type,
        "callType": x.call_type,
        "schedule": x.schedule,
        "contacts": x.contacts,
        "completed": x.completed,
        "contact_filter": contact_filter,
        "contactFilter": contact_filter,
        "automation_enabled": x.automation_enabled,
        "automationEnabled": x.automation_enabled,
        "scheduled_enabled": x.scheduled_enabled,
        "scheduledEnabled": x.scheduled_enabled,
        "scheduled_at": x.scheduled_at,
        "scheduledAt": x.scheduled_at,
        "retry_enabled": x.retry_enabled,
        "retryEnabled": x.retry_enabled,
        "drip_enabled": x.drip_enabled,
        "dripEnabled": x.drip_enabled,
        "drip_action_name": x.drip_action_name,
        "actionsName": x.drip_action_name,
        "drip_batch_quantity": x.drip_batch_quantity,
        "batchQuantity": x.drip_batch_quantity,
        "drip_days": drip_days,
        "sendOn": drip_days,
        "drip_start_date": x.drip_start_date,
        "startDate": x.drip_start_date,
        "drip_timezone": x.drip_timezone,
        "timezone": x.drip_timezone,
        "drip_start_time": x.drip_start_time,
        "startTime": x.drip_start_time,
        "drip_end_time": x.drip_end_time,
        "endTime": x.drip_end_time,
        "created": x.created_at,
        "created_at": x.created_at,
    }


@router.get("/")
def list_(db: Session = Depends(get_db), user=Depends(get_current_user)):
    rows = db.query(Campaign).filter(Campaign.user_id == user.id).order_by(Campaign.id.desc()).all()
    return [out(x, db) for x in rows]


@router.get("/{campaign_id}")
def get(campaign_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.user_id == user.id).first()
    if not x:
        raise HTTPException(404, "Campaign not found")
    return out(x, db)


@router.post("/", status_code=201)
def create(data: CampaignIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    _owned(db, Assistant, data.assistant_id, user.id, "Assistant")
    _owned(db, Dialer, data.dialer_id, user.id, "Dialer")
    _owned(db, Segment, data.segment_id, user.id, "Segment")
    values = _save_values(data)
    x = Campaign(**values, user_id=user.id)
    if x.segment_id:
        x.contacts = db.query(Contact).filter(Contact.user_id == user.id, Contact.segment == db.get(Segment, x.segment_id).name, Contact.active.is_(True)).count()
    db.add(x)
    db.commit()
    db.refresh(x)
    return out(x, db)


@router.put("/{campaign_id}")
def update(campaign_id: int, data: CampaignIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.user_id == user.id).first()
    if not x:
        raise HTTPException(404, "Campaign not found")
    _owned(db, Assistant, data.assistant_id, user.id, "Assistant")
    _owned(db, Dialer, data.dialer_id, user.id, "Dialer")
    _owned(db, Segment, data.segment_id, user.id, "Segment")
    for key, value in _save_values(data).items():
        setattr(x, key, value)
    db.commit()
    db.refresh(x)
    return out(x, db)


@router.delete("/{campaign_id}")
def delete(campaign_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    x = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.user_id == user.id).first()
    if not x:
        raise HTTPException(404, "Campaign not found")
    db.delete(x)
    db.commit()
    return {"message": "Campaign deleted"}
