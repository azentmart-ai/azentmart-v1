from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.models.interview import InterviewSession
from app.models.resume import Resume
from app.models.document import Document
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

    # ==========================================
    # FETCH RESUME & DOCUMENT CONTEXT FROM DB
    # ==========================================
    resume_text = ""
    if getattr(session, "resume_id", None):
        resume_obj = db.query(Resume).filter(Resume.id == session.resume_id).first()
        if resume_obj:
            resume_text = getattr(resume_obj, "summary", "") or getattr(resume_obj, "experience", "")

    documents_text = ""
    doc_ids = getattr(session, "document_ids", None)
    if doc_ids and isinstance(doc_ids, list):
        docs = db.query(Document).filter(Document.id.in_(doc_ids)).all()
        doc_contents = [doc.content for doc in docs if getattr(doc, "content", None)]
        documents_text = "\n---\n".join(doc_contents)

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
                    language=session.language,
                    resume_text=resume_text,
                    documents_text=documents_text
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
                    language=session.language,
                    resume_text=resume_text,
                    documents_text=documents_text
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