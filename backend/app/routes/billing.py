import os
import hmac
import hashlib
import secrets

import razorpay  # pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

load_dotenv()

# ============================================================
# RAZORPAY CONFIGURATION
# ============================================================
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise RuntimeError("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not configured in .env")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# ============================================================
# ROUTER
# ============================================================
router = APIRouter(
    prefix="/api/razorpay",
    tags=["Billing"]
)

# ============================================================
# SERVER-SIDE PLANS
# ============================================================
PLANS = {
    "single_call": {"name": "Single Call Credit", "amount": 199, "credits": 1, "type": "credit"},
    "three_calls": {"name": "3 Call Credits", "amount": 499, "credits": 3, "type": "credit"},
    "six_calls": {"name": "6 Call Credits", "amount": 899, "credits": 6, "type": "credit"},
    "nine_calls": {"name": "9 Call Credits", "amount": 1199, "credits": 9, "type": "credit"},
    "weekly_subscription": {"name": "Weekly Subscription", "amount": 499, "credits": 0, "type": "subscription"},
    "monthly_subscription": {"name": "Monthly Subscription", "amount": 999, "credits": 0, "type": "subscription"},
    "yearly_subscription": {"name": "Yearly Subscription", "amount": 7999, "credits": 0, "type": "subscription"},
}

# ============================================================
# REQUEST SCHEMAS
# ============================================================
class OrderRequest(BaseModel):
    user_id: int
    plan_id: str

class VerifyRequest(BaseModel):
    user_id: int
    plan_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

def get_plan(plan_id: str):
    plan = PLANS.get(plan_id)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan")
    return plan

# ============================================================
# 1. GET USER CREDITS
# ============================================================
@router.get("/billing/user-credits/{user_id}")
def get_user_credits(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.execute(text("SELECT id, name, email FROM public.users WHERE id = :uid"), {"uid": user_id}).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        credit_data = db.execute(
            text("SELECT balance, total_purchased, total_used FROM public.account_credits WHERE user_id = :uid"),
            {"uid": user_id}
        ).fetchone()

        if not credit_data:
            db.execute(
                text("""INSERT INTO public.account_credits (user_id, balance, total_purchased, total_used) 
                        VALUES (:uid, 0, 0, 0)"""),
                {"uid": user_id}
            )
            db.commit()
            balance, total_purchased, total_used = 0, 0, 0
        else:
            balance, total_purchased, total_used = credit_data.balance, credit_data.total_purchased, credit_data.total_used

        return {
            "success": True,
            "userId": user_id,
            "name": user.name,
            "email": user.email,
            "balance": balance,
            "totalPurchased": total_purchased,
            "totalUsed": total_used
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# 2. CREATE RAZORPAY ORDER
# ============================================================
@router.post("/create-order")
def create_order(payload: OrderRequest, db: Session = Depends(get_db)):
    try:
        user = db.execute(text("SELECT id FROM public.users WHERE id = :uid"), {"uid": payload.user_id}).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        plan = get_plan(payload.plan_id)
        amount_in_paise = int(plan["amount"] * 100)
        receipt = f"receipt_{payload.user_id}_{secrets.token_hex(6)}"

        order = razorpay_client.order.create(data={
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": receipt,
        })

        return {
            "success": True,
            "orderId": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "keyId": RAZORPAY_KEY_ID,
            "planId": payload.plan_id,
            "planName": plan["name"],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Razorpay order: {str(e)}")

# ============================================================
# 3. VERIFY PAYMENT
# ============================================================
@router.post("/verify-payment")
def verify_payment(payload: VerifyRequest, db: Session = Depends(get_db)):
    try:
        plan = get_plan(payload.plan_id)

        user = db.execute(text("SELECT id FROM public.users WHERE id = :uid"), {"uid": payload.user_id}).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Verify Razorpay signature
        message = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}"
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode("utf-8"),
            message.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(generated_signature, payload.razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid payment signature")

        # Prevent duplicate payment processing
        existing_payment = db.execute(
            text("SELECT id FROM public.payment_transactions WHERE razorpay_payment_id = :payment_id"),
            {"payment_id": payload.razorpay_payment_id}
        ).fetchone()

        if existing_payment:
            raise HTTPException(status_code=400, detail="Payment has already been processed")

        # CREDIT PURCHASE
        if plan["type"] == "credit":
            credits = plan["credits"]
            existing_credit = db.execute(
                text("SELECT id FROM public.account_credits WHERE user_id = :uid"),
                {"uid": payload.user_id}
            ).fetchone()

            if existing_credit:
                db.execute(
                    text("""UPDATE public.account_credits 
                            SET balance = balance + :credits, 
                                total_purchased = total_purchased + :credits
                            WHERE user_id = :uid"""),
                    {"credits": credits, "uid": payload.user_id}
                )
            else:
                db.execute(
                    text("""INSERT INTO public.account_credits (user_id, balance, total_purchased, total_used) 
                            VALUES (:uid, :credits, :credits, 0)"""),
                    {"uid": payload.user_id, "credits": credits}
                )

        # SUBSCRIPTION PURCHASE
        elif plan["type"] == "subscription":
            db.execute(
                text("""INSERT INTO public.user_subscriptions (user_id, plan_name, status) 
                        VALUES (:uid, :plan, 'active')"""),
                {"uid": payload.user_id, "plan": plan["name"]}
            )

        # SAVE TRANSACTION
        db.execute(
            text("""INSERT INTO public.payment_transactions 
                    (user_id, razorpay_order_id, razorpay_payment_id, item_name, amount, type) 
                    VALUES (:uid, :order_id, :payment_id, :item_name, :amount, :type)"""),
            {
                "uid": payload.user_id,
                "order_id": payload.razorpay_order_id,
                "payment_id": payload.razorpay_payment_id,
                "item_name": plan["name"],
                "amount": plan["amount"],
                "type": plan["type"]
            }
        )

        db.commit()

        return {
            "success": True,
            "message": "Payment successful" if plan["type"] == "subscription" else f"{plan['credits']} credits added successfully",
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")