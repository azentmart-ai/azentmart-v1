from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.interview import InterviewSession
from app.models.user import User
from app.models.subscription import Subscription

from app.schemas.interview import (
    InterviewSessionCreate,
    InterviewSessionResponse
)

router = APIRouter(
    prefix="/api/interviews",
    tags=["Interview Sessions"]
)


@router.post(
    "/",
    response_model=InterviewSessionResponse
)
def create_interview_session(
    session_data: InterviewSessionCreate,
    db: Session = Depends(get_db)
):
    # 1. Verify User Exists
    user = (
        db.query(User)
        .filter(User.id == session_data.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # 2. Check Free Session Limit (4 Free Sessions Max for non-subscribers)
    active_subscription = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == session_data.user_id,
            Subscription.status == "active"
        )
        .first()
    )

    if not active_subscription:
        existing_sessions_count = (
            db.query(InterviewSession)
            .filter(InterviewSession.user_id == session_data.user_id)
            .count()
        )

        if existing_sessions_count >= 4:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free limit reached! You have used all 4 free sessions. Please upgrade your plan or buy credits to continue."
            )

    # 3. Create Session with Resume and Document IDs context
    new_session = InterviewSession(
        user_id=session_data.user_id,
        company=session_data.company,
        job_description=session_data.job_description,
        session_type=session_data.session_type,
        model=session_data.model,
        language=session_data.language,
        resume_added=session_data.resume_added,
        resume_id=getattr(session_data, "resume_id", None),
        documents_added=session_data.documents_added,
        document_ids=getattr(session_data, "document_ids", []),
        extra_context_added=session_data.extra_context_added,
        auto_answer=session_data.auto_answer,
        save_transcript=session_data.save_transcript,
        status=session_data.status
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session


@router.get(
    "/user/{user_id}",
    response_model=list[InterviewSessionResponse]
)
def get_user_interview_sessions(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    sessions = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == user_id
        )
        .order_by(
            InterviewSession.created_at.desc()
        )
        .all()
    )

    return sessions


@router.get(
    "/{session_id}",
    response_model=InterviewSessionResponse
)
def get_interview_session(
    session_id: int,
    db: Session = Depends(get_db)
):
    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == session_id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    return session


@router.put(
    "/{session_id}",
    response_model=InterviewSessionResponse
)
def update_interview_session(
    session_id: int,
    session_data: InterviewSessionCreate,
    db: Session = Depends(get_db)
):
    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == session_id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    session.company = session_data.company
    session.job_description = session_data.job_description
    session.session_type = session_data.session_type
    session.model = session_data.model
    session.language = session_data.language

    session.resume_added = session_data.resume_added
    session.resume_id = getattr(session_data, "resume_id", session.resume_id)
    session.documents_added = session_data.documents_added
    session.document_ids = getattr(session_data, "document_ids", session.document_ids)
    
    session.extra_context_added = session_data.extra_context_added
    session.auto_answer = session_data.auto_update if hasattr(session_data, "auto_update") else session_data.auto_answer
    session.save_transcript = session_data.save_transcript
    session.status = session_data.status

    db.commit()
    db.refresh(session)

    return session


@router.delete(
    "/{session_id}"
)
def delete_interview_session(
    session_id: int,
    db: Session = Depends(get_db)
):
    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == session_id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    db.delete(session)
    db.commit()

    return {
        "message": "Interview session deleted successfully"
    }