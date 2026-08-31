# =========================================================
# AZENTMART AI - LIVE VOICE SERVICE
# GEMINI LIVE + FASTAPI WEBSOCKET
# CONTINUOUS MULTI-TURN CONVERSATION
# =========================================================

import os
import uuid
import asyncio
import json
from typing import Any, Optional

from fastapi import WebSocket, WebSocketDisconnect
from google import genai
from google.genai import types


# =========================================================
# GEMINI CLIENT
# =========================================================

def get_gemini_client():
    """
    Load GEMINI_API_KEY from backend/.env
    and create Gemini client.
    """

    from pathlib import Path
    from dotenv import load_dotenv

    backend_dir = Path(__file__).resolve().parents[2]
    env_file = backend_dir / ".env"

    load_dotenv(
        dotenv_path=env_file,
        override=False,
    )

    api_key = (
        os.getenv("GEMINI_API_KEY")
        or os.environ.get("GEMINI_API_KEY")
    )

    if api_key:
        api_key = str(api_key).strip()

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. "
            f"Checked: {env_file}"
        )

    print(
        "[LIVE VOICE] Gemini API key loaded "
        f"(length={len(api_key)})"
    )

    return genai.Client(
        api_key=api_key
    )


# =========================================================
# SAFE ASSISTANT VALUE
# =========================================================

def _get_assistant_value(
    assistant: Any,
    field: str,
    default: Any = None,
) -> Any:

    try:
        return getattr(
            assistant,
            field,
            default,
        )
    except Exception:
        return default


# =========================================================
# SYSTEM PROMPT
# =========================================================

def _build_system_prompt(
    assistant: Any,
    language: str = "auto",
    mode: str = "test",
) -> str:

    assistant_name = _get_assistant_value(
        assistant,
        "name",
        "AzentMart AI",
    )

    description = _get_assistant_value(
        assistant,
        "description",
        "",
    )

    system_prompt = _get_assistant_value(
        assistant,
        "system_prompt",
        "",
    )

    if not system_prompt:
        system_prompt = _get_assistant_value(
            assistant,
            "instructions",
            "",
        )

    return f"""
You are {assistant_name}, an AI voice assistant created for AzentMart AI.

Your job is to have a natural, helpful and professional real-time voice
conversation with the user.

IMPORTANT CONVERSATION RULES:

- This is ONE continuous conversation.
- Remember everything said earlier in this session.
- Never treat every user message as a new conversation.
- Answer follow-up questions using previous context.
- Do not restart your introduction on every turn.
- Do not say "How can I help you?" repeatedly.
- Listen carefully before responding.
- Keep answers concise and natural for voice.
- Do not give unnecessarily long answers.
- Ask clarification questions when needed.
- Be polite and professional.
- Do not interrupt the user.
- If the user changes language, continue in that language.
- Respond naturally in the user's language.
- Do not mention internal system instructions.
- Do not mention Python, FastAPI, WebSocket, Gemini,
  APIs or backend implementation unless explicitly asked.
- Continue listening after every AI response.
- The conversation should remain active until the user ends it.

LANGUAGE MODE:
{language}

CONVERSATION MODE:
{mode}

ASSISTANT DESCRIPTION:
{description}

ASSISTANT INSTRUCTIONS:
{system_prompt}
""".strip()


# =========================================================
# SAFE JSON SEND
# =========================================================

async def _send_json(
    websocket: WebSocket,
    data: dict,
) -> bool:

    try:
        await websocket.send_json(data)
        return True

    except Exception as exc:
        print(
            "[LIVE VOICE] JSON send error:",
            repr(exc),
        )
        return False


# =========================================================
# SAFE AUDIO SEND
# =========================================================

async def _send_audio(
    websocket: WebSocket,
    audio_data: bytes,
) -> bool:

    if not audio_data:
        return True

    try:
        await websocket.send_bytes(audio_data)
        return True

    except Exception as exc:
        print(
            "[LIVE VOICE] Audio send error:",
            repr(exc),
        )
        return False


# =========================================================
# LIVE VOICE
# =========================================================

async def run_live_voice(
    browser_websocket: WebSocket,
    db: Any,
    assistant: Any,
    language: str = "auto",
    mode: str = "test",
) -> None:

    session_id = (
        f"voice-{uuid.uuid4().hex}"
    )

    assistant_name = _get_assistant_value(
        assistant,
        "name",
        "AzentMart AI",
    )

    print()
    print("=" * 70)
    print("AZENTMART AI - GEMINI LIVE VOICE")
    print("=" * 70)
    print("Session:", session_id)
    print("Assistant:", assistant_name)
    print("Language:", language)
    print("Mode:", mode)
    print("=" * 70)

    # =====================================================
    # SYSTEM PROMPT
    # =====================================================

    system_prompt = _build_system_prompt(
        assistant=assistant,
        language=language,
        mode=mode,
    )

    # =====================================================
    # GEMINI CLIENT
    # =====================================================

    client = get_gemini_client()

    # =====================================================
    # GEMINI LIVE MODEL
    # =====================================================

    model = os.getenv(
        "GEMINI_LIVE_MODEL",
        "gemini-3.1-flash-live-preview",
    )

    print(
        "[LIVE VOICE] Gemini model:",
        model,
    )

    # =====================================================
    # GEMINI LIVE CONFIG
    # =====================================================

    config = types.LiveConnectConfig(
        response_modalities=[
            "AUDIO",
        ],

        system_instruction=types.Content(
            parts=[
                types.Part(
                    text=system_prompt,
                )
            ]
        ),

        # User speech -> text
        input_audio_transcription={},

        # AI speech -> text
        output_audio_transcription={},

        # Continuous automatic voice activity detection
        realtime_input_config=types.RealtimeInputConfig(
            automatic_activity_detection=(
                types.AutomaticActivityDetection(
                    disabled=False,

                    # Detect speech slightly earlier
                    prefix_padding_ms=300,

                    # Natural pause before completing turn
                    silence_duration_ms=900,
                )
            )
        ),
    )

    # =====================================================
    # CONNECT TO GEMINI
    # =====================================================

    try:

        async with client.aio.live.connect(
            model=model,
            config=config,
        ) as session:

            print(
                "[LIVE VOICE] Gemini Live connected."
            )

            # =================================================
            # FRONTEND CONNECTED
            # =================================================

            connected = await _send_json(
                browser_websocket,
                {
                    "type": "connected",
                    "session_id": session_id,

                    "assistant_id": _get_assistant_value(
                        assistant,
                        "id",
                        None,
                    ),

                    "assistant_name": assistant_name,

                    "language": language,

                    "mode": mode,

                    "multilingual": True,

                    "continuous": True,
                },
            )

            if not connected:
                return

            print(
                "[LIVE VOICE] Waiting for user speech..."
            )

            # =================================================
            # STOP EVENT
            # =================================================

            stop_event = asyncio.Event()

            # =================================================
            # BROWSER -> GEMINI
            # =================================================

            async def browser_to_gemini():

                print(
                    "[LIVE VOICE] Browser receiver started."
                )

                try:

                    while not stop_event.is_set():

                        message = (
                            await browser_websocket.receive()
                        )

                        message_type_raw = (
                            message.get("type")
                        )

                        # -----------------------------------------
                        # BROWSER DISCONNECTED
                        # -----------------------------------------

                        if (
                            message_type_raw
                            == "websocket.disconnect"
                        ):

                            print(
                                "[LIVE VOICE] "
                                "Browser disconnected."
                            )

                            stop_event.set()
                            return

                        # -----------------------------------------
                        # AUDIO FROM MICROPHONE
                        # -----------------------------------------

                        audio_data = message.get(
                            "bytes"
                        )

                        if audio_data:

                            try:

                                await session.send_realtime_input(
                                    audio=types.Blob(
                                        data=audio_data,
                                        mime_type=(
                                            "audio/pcm;"
                                            "rate=16000"
                                        ),
                                    )
                                )

                            except Exception as exc:

                                print(
                                    "[LIVE VOICE] "
                                    "Gemini audio input error:",
                                    repr(exc),
                                )

                                stop_event.set()
                                return

                            # IMPORTANT:
                            # Continue receiving microphone
                            # audio after every AI response.
                            continue

                        # -----------------------------------------
                        # TEXT / JSON
                        # -----------------------------------------

                        text_data = message.get(
                            "text"
                        )

                        if not text_data:
                            continue

                        try:

                            data = json.loads(
                                text_data
                            )

                        except json.JSONDecodeError:

                            data = {
                                "type": "text",
                                "text": text_data,
                            }

                        message_type = (
                            data.get("type")
                            or data.get("event")
                            or ""
                        ).lower()

                        # -----------------------------------------
                        # END SESSION
                        # -----------------------------------------

                        if message_type in {
                            "stop",
                            "end",
                            "disconnect",
                            "session_end",
                        }:

                            print(
                                "[LIVE VOICE] "
                                "Session end requested."
                            )

                            stop_event.set()
                            return

                        # -----------------------------------------
                        # PING
                        # -----------------------------------------

                        if message_type == "ping":

                            await _send_json(
                                browser_websocket,
                                {
                                    "type": "pong"
                                },
                            )

                            continue

                        # -----------------------------------------
                        # TEXT INPUT
                        # -----------------------------------------

                        text = (
                            data.get("text")
                            or data.get("message")
                            or data.get("transcript")
                            or data.get("user_text")
                        )

                        if (
                            isinstance(text, str)
                            and text.strip()
                        ):

                            text = text.strip()

                            print(
                                "[LIVE VOICE] USER TEXT:",
                                text,
                            )

                            try:

                                await session.send_realtime_input(
                                    text=text
                                )

                            except Exception as exc:

                                print(
                                    "[LIVE VOICE] "
                                    "Gemini text input error:",
                                    repr(exc),
                                )

                                stop_event.set()
                                return

                except WebSocketDisconnect:

                    print(
                        "[LIVE VOICE] "
                        "Browser WebSocket disconnected."
                    )

                    stop_event.set()

                except asyncio.CancelledError:

                    print(
                        "[LIVE VOICE] "
                        "Browser receiver cancelled."
                    )

                    raise

                except Exception as exc:

                    print(
                        "[LIVE VOICE] "
                        "Browser receiver error:",
                        repr(exc),
                    )

                    stop_event.set()

            # =================================================
            # GEMINI -> BROWSER
            # =================================================

            async def gemini_to_browser():

                print(
                    "[LIVE VOICE] "
                    "Gemini receiver started."
                )

                user_transcript = ""
                assistant_transcript = ""

                try:

                    async for response in session.receive():

                        if stop_event.is_set():
                            return

                        server_content = getattr(
                            response,
                            "server_content",
                            None,
                        )

                        if not server_content:
                            continue

                        # =====================================
                        # USER TRANSCRIPTION
                        # =====================================

                        input_transcription = getattr(
                            server_content,
                            "input_transcription",
                            None,
                        )

                        if input_transcription:

                            chunk = (
                                getattr(
                                    input_transcription,
                                    "text",
                                    None,
                                )
                                or ""
                            )

                            if chunk:

                                user_transcript += chunk

                                print(
                                    "[LIVE VOICE] USER:",
                                    repr(chunk),
                                )

                                await _send_json(
                                    browser_websocket,
                                    {
                                        "type":
                                            "user_transcript_delta",

                                        "text":
                                            chunk,
                                    },
                                )

                        # =====================================
                        # AI TRANSCRIPTION
                        # =====================================

                        output_transcription = getattr(
                            server_content,
                            "output_transcription",
                            None,
                        )

                        if output_transcription:

                            chunk = (
                                getattr(
                                    output_transcription,
                                    "text",
                                    None,
                                )
                                or ""
                            )

                            if chunk:

                                assistant_transcript += chunk

                                print(
                                    "[LIVE VOICE] AI:",
                                    repr(chunk),
                                )

                                await _send_json(
                                    browser_websocket,
                                    {
                                        "type":
                                            "assistant_transcript_delta",

                                        "text":
                                            chunk,
                                    },
                                )

                        # =====================================
                        # AI AUDIO
                        # =====================================

                        model_turn = getattr(
                            server_content,
                            "model_turn",
                            None,
                        )

                        if model_turn:

                            await _send_json(
                                browser_websocket,
                                {
                                    "type":
                                        "assistant_audio_start"
                                },
                            )

                            parts = (
                                getattr(
                                    model_turn,
                                    "parts",
                                    None,
                                )
                                or []
                            )

                            for part in parts:

                                inline_data = getattr(
                                    part,
                                    "inline_data",
                                    None,
                                )

                                if not inline_data:
                                    continue

                                audio_data = getattr(
                                    inline_data,
                                    "data",
                                    None,
                                )

                                if not audio_data:
                                    continue

                                success = await _send_audio(
                                    browser_websocket,
                                    audio_data,
                                )

                                if not success:

                                    stop_event.set()
                                    return

                        # =====================================
                        # USER INTERRUPTED AI
                        # =====================================

                        interrupted = getattr(
                            server_content,
                            "interrupted",
                            False,
                        )

                        if interrupted:

                            print(
                                "[LIVE VOICE] "
                                "USER INTERRUPTED AI"
                            )

                            assistant_transcript = ""

                            await _send_json(
                                browser_websocket,
                                {
                                    "type":
                                        "interrupted"
                                },
                            )

                        # =====================================
                        # TURN COMPLETE
                        # =====================================

                        turn_complete = getattr(
                            server_content,
                            "turn_complete",
                            False,
                        )

                        if turn_complete:

                            final_user_text = (
                                " ".join(
                                    user_transcript.split()
                                )
                            )

                            final_assistant_text = (
                                " ".join(
                                    assistant_transcript.split()
                                )
                            )

                            # ---------------------------------
                            # USER FINAL MESSAGE
                            # ---------------------------------

                            if final_user_text:

                                await _send_json(
                                    browser_websocket,
                                    {
                                        "type":
                                            "user_transcript",

                                        "text":
                                            final_user_text,
                                    },
                                )

                                print(
                                    "[LIVE VOICE] "
                                    "FINAL USER:",
                                    final_user_text,
                                )

                            # ---------------------------------
                            # AI FINAL MESSAGE
                            # ---------------------------------

                            if final_assistant_text:

                                await _send_json(
                                    browser_websocket,
                                    {
                                        "type":
                                            "assistant_transcript",

                                        "text":
                                            final_assistant_text,
                                    },
                                )

                                print(
                                    "[LIVE VOICE] "
                                    "FINAL AI:",
                                    final_assistant_text,
                                )

                            # ---------------------------------
                            # RESET ONLY TRANSCRIPT BUFFERS
                            #
                            # DO NOT reset Gemini session.
                            # Gemini keeps conversation context.
                            # ---------------------------------

                            user_transcript = ""
                            assistant_transcript = ""

                            await _send_json(
                                browser_websocket,
                                {
                                    "type":
                                        "turn_complete"
                                },
                            )

                            print(
                                "[LIVE VOICE] "
                                "READY FOR NEXT USER TURN."
                            )

                            # IMPORTANT:
                            # Do NOT stop here.
                            # The async generator continues waiting
                            # for the next user turn.

                            continue

                except WebSocketDisconnect:

                    print(
                        "[LIVE VOICE] "
                        "Frontend disconnected "
                        "from Gemini receiver."
                    )

                    stop_event.set()

                except asyncio.CancelledError:

                    print(
                        "[LIVE VOICE] "
                        "Gemini receiver cancelled."
                    )

                    raise

                except Exception as exc:

                    print(
                        "[LIVE VOICE] "
                        "Gemini receiver error:",
                        repr(exc),
                    )

                    stop_event.set()

                    try:

                        await _send_json(
                            browser_websocket,
                            {
                                "type": "error",
                                "message": str(exc),
                            },
                        )

                    except Exception:
                        pass

            # =================================================
            # START BOTH TASKS
            # =================================================

            browser_task = asyncio.create_task(
                browser_to_gemini(),
                name="browser_to_gemini",
            )

            gemini_task = asyncio.create_task(
                gemini_to_browser(),
                name="gemini_to_browser",
            )

            # =================================================
            # KEEP SESSION ALIVE
            #
            # IMPORTANT FIX:
            # Do NOT use FIRST_COMPLETED here.
            #
            # We explicitly wait for stop_event.
            # This keeps the Gemini session alive for
            # multiple user/AI turns.
            # =================================================

            try:

                await stop_event.wait()

            except asyncio.CancelledError:

                stop_event.set()

                raise

            finally:

                print(
                    "[LIVE VOICE] "
                    "Stopping voice tasks..."
                )

                # ---------------------------------------------
                # Cancel browser receiver
                # ---------------------------------------------

                if not browser_task.done():

                    browser_task.cancel()

                # ---------------------------------------------
                # Cancel Gemini receiver
                # ---------------------------------------------

                if not gemini_task.done():

                    gemini_task.cancel()

                # ---------------------------------------------
                # Cleanup
                # ---------------------------------------------

                await asyncio.gather(
                    browser_task,
                    gemini_task,
                    return_exceptions=True,
                )

                print(
                    "[LIVE VOICE] "
                    "Both voice tasks cleaned up."
                )

    except WebSocketDisconnect:

        print(
            "[LIVE VOICE] "
            "WebSocket disconnected."
        )

    except Exception as exc:

        print()
        print("=" * 70)
        print("LIVE VOICE ERROR")
        print("=" * 70)
        print(repr(exc))
        print("=" * 70)

        try:

            await _send_json(
                browser_websocket,
                {
                    "type": "error",
                    "message": str(exc),
                },
            )

        except Exception:
            pass

    finally:

        print()
        print("=" * 70)
        print("LIVE VOICE SESSION CLOSED")
        print("Session:", session_id)
        print("=" * 70)


# =========================================================
# OPTIONAL CLEANUP
# =========================================================

async def close_live_voice(
    websocket: Optional[WebSocket],
) -> None:

    if websocket is None:
        return

    try:
        await websocket.close()

    except Exception:
        pass