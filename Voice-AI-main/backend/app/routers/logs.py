from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user

from ..models.models import (
    CallLog,
    Assistant,
    Campaign,
    Contact,
    Conversation,
    ConversationMessage,
)


router = APIRouter(
    prefix="/api/call-logs",
    tags=["Call Logs"],
)


# =========================================================
# LIST CALL LOGS
# =========================================================

@router.get("/")
def list_logs(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    rows = (
        db.query(CallLog)
        .filter(
            CallLog.user_id == user.id
        )
        .order_by(
            CallLog.created_at.desc()
        )
        .limit(500)
        .all()
    )

    result = []

    for x in rows:

        assistant = (
            db.get(
                Assistant,
                x.assistant_id,
            )
            if x.assistant_id
            else None
        )

        campaign = (
            db.get(
                Campaign,
                x.campaign_id,
            )
            if x.campaign_id
            else None
        )

        contact = (
            db.get(
                Contact,
                x.contact_id,
            )
            if x.contact_id
            else None
        )

        result.append(
            {
                "id": x.id,

                "type": (
                    "campaign"
                    if x.campaign_id
                    else "playground"
                ),

                "callType": x.call_type,

                "phone": (
                    x.phone
                    or (
                        contact.phone
                        if contact
                        else ""
                    )
                ),

                "name": (
                    contact.name
                    if contact
                    else ""
                ),

                "assistant": (
                    assistant.name
                    if assistant
                    else ""
                ),

                "assistantId": x.assistant_id,

                "campaign": (
                    campaign.name
                    if campaign
                    else "Playground Test"
                ),

                "campaignId": x.campaign_id,

                "duration": (
                    f"{x.duration_seconds // 60:02d}:"
                    f"{x.duration_seconds % 60:02d}"
                ),

                "durationSeconds": (
                    x.duration_seconds
                ),

                "responseLatencyMs": (
                    x.response_latency_ms
                ),

                "cost": (
                    f"₹{x.cost:.2f}"
                ),

                "costValue": x.cost,

                "calledAt": x.created_at,

                "createdAt": x.created_at,

                "sentiment": x.sentiment,

                "status": x.status,

                "outcome": x.outcome,

                "language": x.language,

                "transcript": x.transcript,

                "recording": x.recording_url,

                "sessionId": x.session_id,

                "conversationId": (
                    x.conversation_id
                ),
            }
        )

    return result


# =========================================================
# GET SINGLE CALL LOG
# =========================================================

@router.get("/{log_id}")
def get_log(
    log_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    x = (
        db.query(CallLog)
        .filter(
            CallLog.id == log_id,
            CallLog.user_id == user.id,
        )
        .first()
    )

    if not x:
        raise HTTPException(
            status_code=404,
            detail="Call log not found",
        )

    assistant = (
        db.get(
            Assistant,
            x.assistant_id,
        )
        if x.assistant_id
        else None
    )

    campaign = (
        db.get(
            Campaign,
            x.campaign_id,
        )
        if x.campaign_id
        else None
    )

    contact = (
        db.get(
            Contact,
            x.contact_id,
        )
        if x.contact_id
        else None
    )

    return {
        "id": x.id,

        "type": (
            "campaign"
            if x.campaign_id
            else "playground"
        ),

        "callType": x.call_type,

        "phone": x.phone,

        "contactName": (
            contact.name
            if contact
            else ""
        ),

        "assistant": (
            assistant.name
            if assistant
            else ""
        ),

        "assistantId": x.assistant_id,

        "campaign": (
            campaign.name
            if campaign
            else "Playground Test"
        ),

        "campaignId": x.campaign_id,

        "durationSeconds": (
            x.duration_seconds
        ),

        "responseLatencyMs": (
            x.response_latency_ms
        ),

        "cost": x.cost,

        "language": x.language,

        "sentiment": x.sentiment,

        "status": x.status,

        "outcome": x.outcome,

        "transcript": x.transcript,

        "recording": x.recording_url,

        "sessionId": x.session_id,

        "conversationId": (
            x.conversation_id
        ),

        "createdAt": x.created_at,
    }


# =========================================================
# CALL TRANSCRIPT / CONVERSATION
# =========================================================

@router.get("/{log_id}/conversation")
def get_call_conversation(
    log_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    call = (
        db.query(CallLog)
        .filter(
            CallLog.id == log_id,
            CallLog.user_id == user.id,
        )
        .first()
    )

    if not call:
        raise HTTPException(
            status_code=404,
            detail="Call log not found",
        )

    if not call.conversation_id:
        return {
            "call_log_id": call.id,
            "conversation_id": None,
            "messages": [],
        }

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id
            == call.conversation_id
        )
        .first()
    )

    if not conversation:
        return {
            "call_log_id": call.id,
            "conversation_id": None,
            "messages": [],
        }

    messages = (
        db.query(ConversationMessage)
        .filter(
            ConversationMessage.conversation_id
            == conversation.id
        )
        .order_by(
            ConversationMessage.created_at.asc()
        )
        .all()
    )

    return {
        "call_log_id": call.id,

        "conversation_id": (
            conversation.id
        ),

        "session_id": (
            conversation.session_id
        ),

        "assistant_id": (
            conversation.assistant_id
        ),

        "language": (
            conversation.language
        ),

        "status": (
            conversation.status
        ),

        "duration_seconds": (
            conversation.duration_seconds
        ),

        "messages": [
            {
                "id": message.id,
                "role": message.sender_type,
                "content": message.message,
                "message_type": message.message_type,
                "language": message.language,
                "created_at": message.created_at,
            }
            for message in messages
        ],
    }