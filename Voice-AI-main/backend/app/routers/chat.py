from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user

from ..models.models import (
    Assistant,
    Conversation,
    ConversationMessage,
)

from ..schemas.common import ChatIn
from ..services.agent import generate_reply


router = APIRouter(
    prefix="/api/chat",
    tags=["AI Chat"],
)


# =========================================================
# CREATE / GET CONVERSATION
# =========================================================

def get_or_create_conversation(
    db: Session,
    user_id: int,
    assistant_id: int,
    session_id: str,
    language: str,
):
    """
    Find the existing conversation for this user/session.

    If it does not exist, create a new conversation.
    """

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.user_id == user_id,
            Conversation.session_id == session_id,
        )
        .first()
    )

    if conversation:
        # Make sure the conversation belongs to
        # the assistant currently being used.
        if conversation.assistant_id != assistant_id:
            raise HTTPException(
                status_code=400,
                detail="Session belongs to another assistant.",
            )

        return conversation

    conversation = Conversation(
        user_id=user_id,
        assistant_id=assistant_id,
        session_id=session_id,
        channel="chat",
        status="active",
        title="New Conversation",
        language=language or "auto",
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


# =========================================================
# SEND MESSAGE
# =========================================================

@router.post("/message")
async def message(
    data: ChatIn,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    # -----------------------------------------------------
    # Validate assistant
    # -----------------------------------------------------

    assistant = (
        db.query(Assistant)
        .filter(
            Assistant.id == data.assistant_id,
            Assistant.user_id == user.id,
            Assistant.active.is_(True),
        )
        .first()
    )

    if not assistant:
        raise HTTPException(
            status_code=404,
            detail="Assistant not found",
        )

    # -----------------------------------------------------
    # Get / create conversation
    # -----------------------------------------------------

    conversation = get_or_create_conversation(
        db=db,
        user_id=user.id,
        assistant_id=assistant.id,
        session_id=data.session_id,
        language=data.language or "auto",
    )

    # -----------------------------------------------------
    # Save USER message
    # -----------------------------------------------------

    user_message = ConversationMessage(
        conversation_id=conversation.id,
        sender_type="user",
        message=data.message,
        message_type="text",
        language=data.language or "auto",
    )

    db.add(user_message)

    conversation.updated_at = __import__(
        "datetime"
    ).datetime.now(
        __import__("datetime").timezone.utc
    )

    db.commit()
    db.refresh(user_message)

    # -----------------------------------------------------
    # Generate AI response
    # -----------------------------------------------------

    reply = await generate_reply(
        db,
        assistant,
        data.session_id,
        data.language,
        data.message,
    )

    # -----------------------------------------------------
    # Save ASSISTANT message
    # -----------------------------------------------------

    assistant_message = ConversationMessage(
        conversation_id=conversation.id,
        sender_type="assistant",
        message=reply,
        message_type="text",
        language=data.language or "auto",
    )

    db.add(assistant_message)

    db.commit()
    db.refresh(assistant_message)

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {
        "session_id": data.session_id,
        "conversation_id": conversation.id,
        "assistant_id": assistant.id,
        "assistant": assistant.name,
        "language": data.language or "auto",
        "reply": reply,
        "message_id": assistant_message.id,
    }


# =========================================================
# CONVERSATION HISTORY
# =========================================================

@router.get("/history/{session_id}")
def history(
    session_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.user_id == user.id,
            Conversation.session_id == session_id,
        )
        .first()
    )

    if not conversation:
        return []

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

    return [
        {
            "id": item.id,
            "conversation_id": conversation.id,
            "role": item.sender_type,
            "content": item.message,
            "message": item.message,
            "language": item.language,
            "message_type": item.message_type,
            "created_at": item.created_at,
        }
        for item in messages
    ]


# =========================================================
# GET CONVERSATION DETAILS
# =========================================================

@router.get("/conversation/{session_id}")
def get_conversation(
    session_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.user_id == user.id,
            Conversation.session_id == session_id,
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

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
        "id": conversation.id,
        "session_id": conversation.session_id,
        "assistant_id": conversation.assistant_id,
        "channel": conversation.channel,
        "status": conversation.status,
        "title": conversation.title,
        "language": conversation.language,
        "started_at": conversation.started_at,
        "ended_at": conversation.ended_at,
        "duration_seconds": conversation.duration_seconds,
        "messages": [
            {
                "id": item.id,
                "role": item.sender_type,
                "content": item.message,
                "language": item.language,
                "message_type": item.message_type,
                "created_at": item.created_at,
            }
            for item in messages
        ],
    }


# =========================================================
# CLOSE CONVERSATION
# =========================================================

@router.post("/conversation/{session_id}/close")
def close_conversation(
    session_id: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.user_id == user.id,
            Conversation.session_id == session_id,
        )
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found",
        )

    from datetime import datetime, timezone

    conversation.status = "completed"
    conversation.ended_at = datetime.now(timezone.utc)

    if conversation.started_at:
        conversation.duration_seconds = int(
            (
                conversation.ended_at
                - conversation.started_at
            ).total_seconds()
        )

    db.commit()

    return {
        "success": True,
        "session_id": session_id,
        "conversation_id": conversation.id,
        "status": conversation.status,
        "duration_seconds": (
            conversation.duration_seconds
        ),
    }