from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.interview import InterviewSession
from app.models.user import User

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

    new_session = InterviewSession(
        user_id=session_data.user_id,
        company=session_data.company,
        job_description=session_data.job_description,
        session_type=session_data.session_type,
        model=session_data.model,
        language=session_data.language,
        resume_added=session_data.resume_added,
        documents_added=session_data.documents_added,
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
    session.documents_added = session_data.documents_added
    session.extra_context_added = (
        session_data.extra_context_added
    )

    session.auto_answer = session_data.auto_answer
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