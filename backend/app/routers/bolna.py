from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from ..config import settings
from ..deps import get_current_user
from ..services.bolna_service import make_bolna_call


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/bolna",
    tags=["Bolna"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class BolnaCallRequest(BaseModel):
    agent_id: str = Field(
        ...,
        min_length=1,
        description="Bolna Voice Agent ID",
    )

    recipient_phone_number: str = Field(
        ...,
        min_length=8,
        description="Customer phone number in E.164 format",
        examples=["+919876543210"],
    )

    from_phone_number: str = Field(
        ...,
        min_length=8,
        description="Bolna phone number in E.164 format",
        examples=["+919876543210"],
    )

    user_data: dict = Field(
        default_factory=dict,
        description="Dynamic data passed to the Bolna agent",
    )


# =========================================================
# START OUTBOUND CALL
# =========================================================

@router.post("/call")
def start_bolna_call(
    request: BolnaCallRequest,
    user=Depends(get_current_user),
):
    """
    Start an outbound Bolna AI voice call.
    """

    try:
        result = make_bolna_call(
            agent_id=request.agent_id,
            recipient_phone_number=(
                request.recipient_phone_number
            ),
            from_phone_number=(
                request.from_phone_number
            ),
            user_data=request.user_data,
        )

        return {
            "success": True,
            "message": "Bolna call initiated.",
            "data": result,
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:

        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        print("❌ Unexpected Bolna error:", str(exc))

        raise HTTPException(
            status_code=500,
            detail=f"Unexpected Bolna error: {exc}",
        ) from exc


# =========================================================
# CHECK BOLNA CONFIGURATION
# =========================================================

@router.get("/status")
def bolna_status(
    user=Depends(get_current_user),
):
    """
    Check whether Bolna is configured.
    """

    return {
        "success": True,
        "configured": bool(
            settings.bolna_api_key
        ),
        "base_url": settings.bolna_base_url,
    }