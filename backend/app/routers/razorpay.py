from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from ..config import settings
from ..deps import get_current_user

import razorpay


router = APIRouter(
    prefix="/api/razorpay",
    tags=["Razorpay"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class CreateOrderRequest(BaseModel):
    credits: int = Field(..., ge=250)
    accountId: int | None = None
    userId: int | None = None


# =========================================================
# RAZORPAY CLIENT
# =========================================================

def get_razorpay_client():

    key_id = getattr(
        settings,
        "razorpay_key_id",
        None,
    )

    key_secret = getattr(
        settings,
        "razorpay_key_secret",
        None,
    )

    if not key_id or not key_secret:
        raise HTTPException(
            status_code=500,
            detail=(
                "Razorpay is not configured. "
                "Add RAZORPAY_KEY_ID and "
                "RAZORPAY_KEY_SECRET to your .env file."
            ),
        )

    return razorpay.Client(
        auth=(
            key_id,
            key_secret,
        )
    )


# =========================================================
# CREATE RAZORPAY ORDER
# =========================================================

@router.post("/create-order")
def create_order(
    data: CreateOrderRequest,
    user=Depends(get_current_user),
):

    try:

        client = get_razorpay_client()

        # 1 credit = ₹1
        amount_rupees = int(data.credits)

        # Razorpay requires amount in paise
        amount_paise = amount_rupees * 100

        receipt = (
            f"azentmart_{user.id}_"
            f"{data.credits}_"
            f"{int(__import__('time').time())}"
        )

        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": receipt,
            "notes": {
                "user_id": str(user.id),
                "credits": str(data.credits),
                "account_id": str(
                    data.accountId
                    if data.accountId
                    else user.id
                ),
            },
        }

        order = client.order.create(
            data=order_data
        )

        key_id = getattr(
            settings,
            "razorpay_key_id",
            None,
        )

        return {
            "success": True,
            "orderId": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "keyId": key_id,
            "credits": data.credits,
        }

    except HTTPException:
        raise

    except Exception as exc:

        print(
            "Razorpay order creation error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Unable to create Razorpay order: "
                f"{str(exc)}"
            ),
        )