import hmac
import hashlib

import razorpay

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..config import settings
from ..db import get_db
from ..deps import get_current_user
from ..models.models import User, CreditTransaction


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/billing",
    tags=["Billing"],
)


# =========================================================
# RAZORPAY CONFIGURATION
# =========================================================
#
# IMPORTANT:
# Do NOT use os.getenv() here.
#
# config.py already loads the .env file through Pydantic
# Settings, so we use settings.razorpay_key_id and
# settings.razorpay_key_secret.
#
# =========================================================

RAZORPAY_KEY_ID = settings.razorpay_key_id
RAZORPAY_KEY_SECRET = settings.razorpay_key_secret


# =========================================================
# RAZORPAY CLIENT
# =========================================================

razorpay_client = None

if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(
        auth=(
            RAZORPAY_KEY_ID,
            RAZORPAY_KEY_SECRET,
        )
    )


# =========================================================
# REQUEST SCHEMAS
# =========================================================


class CreateOrderRequest(BaseModel):
    credits: int


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    credits: int


# =========================================================
# GET BILLING DATA
# =========================================================


@router.get("")
def get_billing(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # -----------------------------------------------------
    # Get current user
    # -----------------------------------------------------

    db_user = (
        db.query(User)
        .filter(User.id == user.id)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # -----------------------------------------------------
    # Total purchased
    # -----------------------------------------------------

    total_purchased = (
        db.query(
            func.coalesce(
                func.sum(CreditTransaction.amount),
                0,
            )
        )
        .filter(
            CreditTransaction.user_id == db_user.id,
            CreditTransaction.transaction_type == "PURCHASE",
        )
        .scalar()
    )

    # -----------------------------------------------------
    # Total used
    # -----------------------------------------------------

    total_used = (
        db.query(
            func.coalesce(
                func.sum(CreditTransaction.amount),
                0,
            )
        )
        .filter(
            CreditTransaction.user_id == db_user.id,
            CreditTransaction.transaction_type == "USAGE",
        )
        .scalar()
    )

    # -----------------------------------------------------
    # Transactions
    # -----------------------------------------------------

    transaction_rows = (
        db.query(CreditTransaction)
        .filter(
            CreditTransaction.user_id == db_user.id
        )
        .order_by(
            CreditTransaction.id.desc()
        )
        .all()
    )

    transactions = []

    for transaction in transaction_rows:
        transactions.append(
            {
                "id": transaction.id,
                "date": (
                    transaction.created_at.isoformat()
                    if transaction.created_at
                    else "-"
                ),
                "type": transaction.transaction_type,
                "reference": (
                    transaction.description
                    or "-"
                ),
                "credits": transaction.amount,
                "balance": transaction.balance_after,
            }
        )

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {
        "success": True,

        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
        },

        "account": {
            "id": db_user.id,
        },

        "credits": {
            "balance": float(
                db_user.credits or 0
            ),

            "total_purchased": float(
                total_purchased or 0
            ),

            "total_used": abs(
                float(total_used or 0)
            ),
        },

        "transactions": transactions,
    }


# =========================================================
# CREATE RAZORPAY ORDER
# =========================================================


@router.post("/create-order")
def create_razorpay_order(
    data: CreateOrderRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # -----------------------------------------------------
    # Validate credits
    # -----------------------------------------------------

    if data.credits < 1:
        raise HTTPException(
            status_code=400,
            detail="Credits must be greater than 0",
        )

    # -----------------------------------------------------
    # Check Razorpay configuration
    # -----------------------------------------------------

    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=500,
            detail=(
                "Razorpay is not configured. "
                "Set RAZORPAY_KEY_ID and "
                "RAZORPAY_KEY_SECRET in the backend .env file."
            ),
        )

    # -----------------------------------------------------
    # Check Razorpay client
    # -----------------------------------------------------

    if razorpay_client is None:
        raise HTTPException(
            status_code=500,
            detail="Razorpay client is not initialized.",
        )

    # -----------------------------------------------------
    # Make sure user exists
    # -----------------------------------------------------

    db_user = (
        db.query(User)
        .filter(User.id == user.id)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # -----------------------------------------------------
    # Amount
    #
    # 1 credit = ₹1
    #
    # Razorpay expects amount in paise.
    #
    # Example:
    # 250 credits = ₹250 = 25000 paise
    # -----------------------------------------------------

    amount_rupees = int(data.credits)
    amount_paise = amount_rupees * 100

    # -----------------------------------------------------
    # Create unique receipt
    # -----------------------------------------------------

    import time

    receipt = (
        f"azentmart_{db_user.id}_"
        f"{data.credits}_"
        f"{int(time.time())}"
    )

    # -----------------------------------------------------
    # Razorpay order data
    # -----------------------------------------------------

    order_data = {
        "amount": amount_paise,
        "currency": "INR",
        "receipt": receipt,
        "notes": {
            "user_id": str(db_user.id),
            "credits": str(data.credits),
        },
    }

    # -----------------------------------------------------
    # Create Razorpay order
    # -----------------------------------------------------

    try:
        order = razorpay_client.order.create(
            data=order_data
        )

    except Exception as exc:
        print(
            "Razorpay order creation error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to create Razorpay order: "
                f"{str(exc)}"
            ),
        )

    # -----------------------------------------------------
    # Return order to frontend
    # -----------------------------------------------------

    return {
        "success": True,

        "order_id": order["id"],

        "amount": order["amount"],

        "amount_rupees": amount_rupees,

        "currency": order["currency"],

        "credits": data.credits,

        "razorpay_key_id": RAZORPAY_KEY_ID,
    }


# =========================================================
# VERIFY RAZORPAY PAYMENT
# =========================================================


@router.post("/verify-payment")
def verify_razorpay_payment(
    data: VerifyPaymentRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # -----------------------------------------------------
    # Check Razorpay secret
    # -----------------------------------------------------

    if not RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Razorpay secret is not configured.",
        )

    # -----------------------------------------------------
    # Validate credit amount
    # -----------------------------------------------------

    if data.credits < 1:
        raise HTTPException(
            status_code=400,
            detail="Invalid credit amount.",
        )

    # -----------------------------------------------------
    # Validate Razorpay signature
    #
    # Razorpay signature:
    #
    # HMAC_SHA256(
    #     order_id + "|" + payment_id,
    #     key_secret
    # )
    #
    # -----------------------------------------------------

    message = (
        f"{data.razorpay_order_id}|"
        f"{data.razorpay_payment_id}"
    )

    generated_signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(
        generated_signature,
        data.razorpay_signature,
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid Razorpay payment signature.",
        )

    # -----------------------------------------------------
    # Get current user
    # -----------------------------------------------------

    db_user = (
        db.query(User)
        .filter(User.id == user.id)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # -----------------------------------------------------
    # Add credits
    # -----------------------------------------------------

    current_balance = float(
        db_user.credits or 0
    )

    new_balance = (
        current_balance + data.credits
    )

    db_user.credits = new_balance

    # -----------------------------------------------------
    # Create credit transaction
    # -----------------------------------------------------

    transaction = CreditTransaction(
        user_id=db_user.id,
        transaction_type="PURCHASE",
        amount=data.credits,
        balance_after=new_balance,
        description=(
            f"Razorpay payment "
            f"{data.razorpay_payment_id}"
        ),
    )

    db.add(transaction)

    db.commit()

    db.refresh(db_user)
    db.refresh(transaction)

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {
        "success": True,

        "message": "Payment successful. Credits added.",

        "payment_id": data.razorpay_payment_id,

        "order_id": data.razorpay_order_id,

        "credits_added": data.credits,

        "balance": float(
            db_user.credits or 0
        ),
    }