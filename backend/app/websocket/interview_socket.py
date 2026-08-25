from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.models.interview import InterviewSession
from app.services.llm_service import generate_ai_answer


async def interview_websocket(
    websocket: WebSocket,
    session_id: int,
    db: Session
):

    await websocket.accept()

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == session_id
        )
        .first()
    )

    if not session:

        await websocket.send_json({
            "type": "error",
            "message": "Interview session not found"
        })

        await websocket.close()

        return

    try:

        await websocket.send_json({
            "type": "connected",
            "session_id": session.id,
            "model": session.model
        })

        while True:

            data = await websocket.receive_json()

            message_type = data.get("type")

            # ==========================================
            # TRANSCRIPT FROM SPEECH RECOGNITION
            # ==========================================

            if message_type == "transcript":

                text = data.get(
                    "text",
                    ""
                ).strip()

                if not text:
                    continue

                answer = await generate_ai_answer(
                    selected_model=session.model,
                    question=text,
                    company=session.company,
                    job_description=session.job_description,
                    language=session.language
                )

                await websocket.send_json({
                    "type": "ai_answer",
                    "answer": answer,
                    "model": session.model,
                    "source": "transcript"
                })

            # ==========================================
            # MANUAL QUESTION
            # ==========================================

            elif message_type == "manual_question":

                question = data.get(
                    "question",
                    ""
                ).strip()

                if not question:
                    continue

                answer = await generate_ai_answer(
                    selected_model=session.model,
                    question=question,
                    company=session.company,
                    job_description=session.job_description,
                    language=session.language
                )

                await websocket.send_json({
                    "type": "ai_answer",
                    "answer": answer,
                    "model": session.model,
                    "source": "manual"
                })

            # ==========================================
            # END INTERVIEW
            # ==========================================

            elif message_type == "end":

                session.status = "ended"

                db.commit()

                await websocket.send_json({
                    "type": "session_ended"
                })

                await websocket.close()

                break

            else:

                await websocket.send_json({
                    "type": "error",
                    "message": "Unknown message type"
                })

    except WebSocketDisconnect:

        print(
            f"Interview WebSocket disconnected: "
            f"session={session_id}"
        )

    except Exception as error:

        print(
            f"WebSocket error: {error}"
        )

        try:

            await websocket.send_json({
                "type": "error",
                "message": str(error)
            })

        except Exception:
            pass