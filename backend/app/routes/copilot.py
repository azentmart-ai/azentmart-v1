from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.websocket.interview_socket import (
    interview_websocket
)


router = APIRouter(
    tags=["Interview Copilot"]
)


@router.websocket(
    "/ws/interview/{session_id}"
)
async def interview_copilot(
    websocket: WebSocket,
    session_id: int
):

    db: Session = SessionLocal()

    try:

        await interview_websocket(
            websocket=websocket,
            session_id=session_id,
            db=db
        )

    except WebSocketDisconnect:

        print(
            f"Client disconnected: "
            f"session={session_id}"
        )

    finally:

        db.close()