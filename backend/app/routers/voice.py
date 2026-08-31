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


# =========================================================
# SUPPORTED LANGUAGES
# =========================================================

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
    Get the assistant used by the public landing-page demo.

    Set this in .env:

        DEMO_ASSISTANT_ID=1

    The public landing page will always use this assistant.
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

    # -----------------------------------------------------
    # Fallback
    # -----------------------------------------------------

    return (
        db.query(Assistant)
        .filter(
            Assistant.active.is_(True),
        )
        .order_by(Assistant.id.asc())
        .first()
    )


# =========================================================
# GET USER ASSISTANT
# =========================================================

def get_user_assistant(
    db: Session,
    user_id,
    assistant_id_raw: str | None,
):
    """
    Get an active assistant belonging to the logged-in user.

    If assistant_id is provided:
        return that assistant.

    Otherwise:
        return the user's first active assistant.
    """

    user_query = (
        db.query(Assistant)
        .filter(
            Assistant.user_id == user_id,
            Assistant.active.is_(True),
        )
    )

    # -----------------------------------------------------
    # Requested assistant
    # -----------------------------------------------------

    if assistant_id_raw:
        try:
            assistant_id = int(assistant_id_raw)

            assistant = (
                user_query
                .filter(
                    Assistant.id == assistant_id
                )
                .first()
            )

            if assistant:
                return assistant

            print(
                "[VOICE] Requested assistant does not "
                "belong to this user:",
                assistant_id,
            )

        except (ValueError, TypeError):
            print(
                "[VOICE] Invalid assistant_id:",
                assistant_id_raw,
            )

    # -----------------------------------------------------
    # Default assistant
    # -----------------------------------------------------

    return (
        user_query
        .order_by(Assistant.id.asc())
        .first()
    )


# =========================================================
# LIVE VOICE WEBSOCKET
# =========================================================

@router.websocket("/live")
async def live_voice(websocket: WebSocket):

    await websocket.accept()

    db: Session = SessionLocal()

    try:

        # =================================================
        # READ QUERY PARAMETERS
        # =================================================

        assistant_id_raw = (
            websocket.query_params.get(
                "assistant_id"
            )
        )

        # Support both names.
        #
        # Frontend normally sends:
        #
        # token=...
        #
        # This also supports:
        #
        # access_token=...

        token = (
            websocket.query_params.get("token")
            or websocket.query_params.get(
                "access_token"
            )
        )

        # -------------------------------------------------
        # Test / Role Play
        # -------------------------------------------------

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

        # Normalize role_play
        if mode == "role_play":
            mode = "roleplay"

        # -------------------------------------------------
        # Language
        # -------------------------------------------------

        # Language remains automatic.
        language = "auto"


        print("\n" + "=" * 70)
        print("[VOICE] New WebSocket connection")
        print(
            "[VOICE] Assistant ID:",
            assistant_id_raw,
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
        # CASE 1
        # LOGGED-IN DASHBOARD USER
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
                    assistant_id_raw=assistant_id_raw,
                )

                if assistant:
                    authenticated = True

                    print(
                        "[VOICE] User assistant selected:",
                        assistant.id,
                        assistant.name,
                    )

                else:

                    print(
                        "[VOICE] No active assistant "
                        "found for user:",
                        user_id,
                    )

            except Exception as error:

                print(
                    "[VOICE] Token invalid/expired:",
                    repr(error),
                )

                authenticated = False
                user_id = None
                assistant = None


        # =================================================
        # CASE 2
        # PUBLIC LANDING PAGE
        # =================================================

        if assistant is None:

            print(
                "[VOICE] Using public demo assistant"
            )

            assistant = get_demo_assistant(db)


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
        # ASSISTANT INFORMATION
        # =================================================

        print(
            "[VOICE] Assistant selected:",
            assistant.id,
            assistant.name,
        )

        print(
            "[VOICE] Assistant category:",
            getattr(
                assistant,
                "category",
                None,
            ),
        )


        # =================================================
        # SESSION STARTED
        # =================================================

        await websocket.send_json(
            {
                "type": "session_started",

                "assistant_id": assistant.id,

                "assistant_name": assistant.name,

                "language": "auto",

                "authenticated": authenticated,

                "mode": mode,
            }
        )


        # =================================================
        # START LIVE VOICE ENGINE
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


        await run_live_voice(
            browser_websocket=websocket,
            db=db,
            assistant=assistant,
            language="auto",
        )


    # =====================================================
    # BROWSER DISCONNECTED
    # =====================================================

    except WebSocketDisconnect:

        print(
            "[VOICE] Browser disconnected"
        )


    # =====================================================
    # OTHER ERROR
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