from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from ..db import SessionLocal
from ..models.models import Assistant
from ..security import decode_token
from ..services.live_voice_service import run_live_voice

import os


router = APIRouter(
    prefix="/api/voice",
    tags=["Live Voice"],
)


SUPPORTED_LANGUAGES = {
    "English",
    "Tamil",
    "Hindi",
    "Telugu",
    "Malayalam",
    "Kannada",
    "Bengali",
}


# =========================================================
# PUBLIC DEMO ASSISTANT
# =========================================================

def get_demo_assistant(db: Session):
    """
    Assistant used by the public landing-page demo.

    .env:
        DEMO_ASSISTANT_ID=1
    """

    demo_id = os.getenv("DEMO_ASSISTANT_ID")

    if demo_id:
        try:
            assistant = (
                db.query(Assistant)
                .filter(
                    Assistant.id == int(demo_id),
                    Assistant.active.is_(True),
                )
                .first()
            )

            if assistant:
                return assistant

        except Exception as error:
            print(
                "[VOICE DEMO] DEMO_ASSISTANT_ID ERROR:",
                repr(error),
            )

    return (
        db.query(Assistant)
        .filter(
            Assistant.active.is_(True),
        )
        .order_by(Assistant.id.asc())
        .first()
    )


# =========================================================
# USER ASSISTANT
# =========================================================

def get_user_assistant(
    db: Session,
    user_id,
    assistant_id_raw=None,
    assistant_name=None,
):
    """
    Select an active assistant belonging to
    the authenticated user.
    """

    query = (
        db.query(Assistant)
        .filter(
            Assistant.user_id == user_id,
            Assistant.active.is_(True),
        )
    )

    # -----------------------------------------------------
    # Numeric database ID
    # -----------------------------------------------------

    if assistant_id_raw:

        try:

            assistant = (
                query
                .filter(
                    Assistant.id == int(
                        assistant_id_raw
                    )
                )
                .first()
            )

            if assistant:
                return assistant

        except (ValueError, TypeError):

            print(
                "[VOICE] Invalid assistant_id:",
                assistant_id_raw,
            )

    # -----------------------------------------------------
    # Assistant name
    # -----------------------------------------------------

    if assistant_name:

        assistant = (
            query
            .filter(
                Assistant.name == assistant_name
            )
            .first()
        )

        if assistant:
            return assistant

    # -----------------------------------------------------
    # User default assistant
    # -----------------------------------------------------

    return (
        query
        .order_by(Assistant.id.asc())
        .first()
    )


# =========================================================
# LIVE VOICE WEBSOCKET
# =========================================================

@router.websocket("/live")
async def live_voice(
    websocket: WebSocket
):

    await websocket.accept()

    db: Session = SessionLocal()

    try:

        # =================================================
        # QUERY PARAMETERS
        # =================================================

        assistant_id_raw = (
            websocket.query_params.get(
                "assistant_id"
            )
        )

        assistant_name = (
            websocket.query_params.get(
                "assistant_name"
            )
        )

        token = (
            websocket.query_params.get("token")
            or websocket.query_params.get(
                "access_token"
            )
        )

        mode = (
            websocket.query_params.get("mode")
            or "test"
        ).lower()

        if mode not in {
            "test",
            "roleplay",
            "role_play",
        }:
            mode = "test"

        if mode == "role_play":
            mode = "roleplay"

        # Automatic language detection
        language = "auto"


        # =================================================
        # LOG
        # =================================================

        print("\n" + "=" * 70)

        print(
            "[VOICE] New WebSocket connection"
        )

        print(
            "[VOICE] Assistant ID:",
            assistant_id_raw,
        )

        print(
            "[VOICE] Assistant Name:",
            assistant_name,
        )

        print(
            "[VOICE] Token provided:",
            bool(token),
        )

        print(
            "[VOICE] Mode:",
            mode,
        )

        print(
            "[VOICE] Language:",
            language,
        )

        print("=" * 70)


        # =================================================
        # ASSISTANT SELECTION
        # =================================================

        assistant = None

        authenticated = False

        user_id = None


        # =================================================
        # LOGGED-IN USER
        # =================================================

        if token:

            try:

                user_id = decode_token(token)

                print(
                    "[VOICE] Authenticated user:",
                    user_id,
                )

                assistant = get_user_assistant(
                    db=db,
                    user_id=user_id,
                    assistant_id_raw=
                        assistant_id_raw,
                    assistant_name=
                        assistant_name,
                )

                if assistant:

                    authenticated = True

                    print(
                        "[VOICE] User assistant selected:",
                        assistant.id,
                        assistant.name,
                    )

            except Exception as error:

                print(
                    "[VOICE] Token invalid/expired:",
                    repr(error),
                )

                assistant = None

                authenticated = False

                user_id = None


        # =================================================
        # PUBLIC LANDING PAGE
        # =================================================

        if assistant is None:

            print(
                "[VOICE] Using public demo assistant"
            )

            assistant = get_demo_assistant(
                db
            )


        # =================================================
        # NO ASSISTANT
        # =================================================

        if assistant is None:

            await websocket.send_json(
                {
                    "type": "error",

                    "message": (
                        "No active voice assistant "
                        "is configured."
                    ),
                }
            )

            await websocket.close(
                code=1011
            )

            return


        # =================================================
        # SELECTED ASSISTANT
        # =================================================

        print(
            "[VOICE] Assistant selected:",
            assistant.id,
            assistant.name,
        )


        # =================================================
        # SESSION STARTED
        # =================================================

        await websocket.send_json(
            {
                "type": "session_started",

                "assistant_id":
                    assistant.id,

                "assistant_name":
                    assistant.name,

                "language":
                    "auto",

                "authenticated":
                    authenticated,

                "mode":
                    mode,
            }
        )


        # =================================================
        # START VOICE ENGINE
        # =================================================

        print(
            "[VOICE] Starting live voice engine..."
        )

        print(
            "[VOICE] Mode:",
            mode,
        )

        print(
            "[VOICE] Assistant:",
            assistant.name,
        )


        # -------------------------------------------------
        # Try with mode first.
        # -------------------------------------------------

        try:

            await run_live_voice(
                browser_websocket=
                    websocket,

                db=db,

                assistant=
                    assistant,

                language=
                    "auto",

                mode=
                    mode,
            )

        except TypeError as mode_error:

            # -------------------------------------------------
            # Backward compatibility.
            #
            # If run_live_voice() doesn't yet have a
            # mode parameter, use the old function signature.
            # -------------------------------------------------

            if "mode" not in str(
                mode_error
            ):
                raise

            print(
                "[VOICE] run_live_voice() does not "
                "yet accept mode."
            )

            await run_live_voice(
                browser_websocket=
                    websocket,

                db=db,

                assistant=
                    assistant,

                language=
                    "auto",
            )


    # =====================================================
    # DISCONNECTED
    # =====================================================

    except WebSocketDisconnect:

        print(
            "[VOICE] Browser disconnected"
        )


    # =====================================================
    # ERROR
    # =====================================================

    except Exception as error:

        print(
            "[VOICE] ERROR:",
            repr(error),
        )

        try:

            await websocket.send_json(
                {
                    "type": "error",
                    "message": str(error),
                }
            )

        except Exception:

            pass


    # =====================================================
    # CLEANUP
    # =====================================================

    finally:

        db.close()

        print(
            "[VOICE] Database session closed"
        )