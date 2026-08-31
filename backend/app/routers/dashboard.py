from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user
from ..models.models import Assistant, Campaign, Contact, CallLog

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/")
@router.get("/stats")
def get_dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    calls = db.query(CallLog).filter(CallLog.user_id == user.id)
    total_calls = calls.count()
    total_seconds = db.query(func.coalesce(func.sum(CallLog.duration_seconds), 0)).filter(CallLog.user_id == user.id).scalar() or 0
    completed_calls = calls.filter(CallLog.status.ilike("completed")).count()
    active_campaigns = db.query(Campaign).filter(Campaign.user_id == user.id, Campaign.status.in_(["ACTIVE", "RUNNING"])).count()
    total_campaigns = db.query(Campaign).filter(Campaign.user_id == user.id).count()
    total_contacts = db.query(Contact).filter(Contact.user_id == user.id).count()
    total_assistants = db.query(Assistant).filter(Assistant.user_id == user.id).count()
    avg_duration = round(total_seconds / total_calls, 1) if total_calls else 0

    return {
        "total_calls": total_calls,
        "totalCalls": total_calls,
        "call_minutes": round(total_seconds / 60, 2),
        "callMinutes": round(total_seconds / 60, 2),
        "total_contacts": total_contacts,
        "totalContacts": total_contacts,
        "total_campaigns": total_campaigns,
        "totalCampaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "activeCampaigns": active_campaigns,
        "total_assistants": total_assistants,
        "totalAssistants": total_assistants,
        "completed_calls": completed_calls,
        "completedCalls": completed_calls,
        "avg_duration_seconds": avg_duration,
        "avgDurationSeconds": avg_duration,
    }
