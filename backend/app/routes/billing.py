from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import razorpay
import hmac
import hashlib
import os
from sqlalchemy.orm import Session
from app.database import get_db  # Your database session dependency

router = APIRouter(prefix="/api/razorpay", tags=["Billing"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "YOUR_RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "YOUR_RAZORPAY_KEY_SECRET")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class OrderRequest(BaseModel):
    amount: float
    name: str
    userId: int

class VerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    itemName: str
    amount: float
    userId: int

# ============================================================
# 1. FETCH USER CREDITS (Based on users table)
# ============================================================
@router.get("/api/billing/user-credits/{user_id}")
async def get_user_credits(user_id: int, db: Session = Depends(get_db)):
    try:
        # Check if user exists in public.users
        user_check = db.execute("SELECT id, name, email FROM public.users WHERE id = :uid", {"uid": user_id}).fetchone()
        if not user_check:
            raise HTTPException(status_code=404, detail="User not found")

        # Get balance from account_credits table
        credit_data = db.execute(
            "SELECT balance, total_purchased, total_used FROM public.account_credits WHERE user_id = :uid",
            {"uid": user_id}
        ).fetchone()

        if not credit_data:
            # If no credit record exists yet, initialize with 0
            db.execute(
                "INSERT INTO public.account_credits (user_id, balance, total_purchased, total_used) VALUES (:uid, 0, 0, 0)",
                {"uid": user_id}
            )
            db.commit()
            balance, total_purchased, total_used = 0, 0, 0
        else:
            balance, total_purchased, total_used = credit_data.balance, credit_data.total_purchased, credit_data.total_used

        return {
            "success": True,
            "userId": user_id,
            "balance": balance,
            "totalPurchased": total_purchased,
            "totalUsed": total_used
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# 2. CREATE RAZORPAY ORDER
# ============================================================
@router.post("/create-order")
async def create_order(payload: OrderRequest):
    try:
        amount_in_paise = int(payload.amount * 100)
        data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"receipt_user_{payload.userId}_{os.urandom(3).hex()}"
        }
        order = client.order.create(data=data)
        return {
            "success": True,
            "orderId": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "keyId": RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================
# 3. VERIFY PAYMENT & UPDATE POSTGRESQL TABLES
# ============================================================
@router.post("/verify-payment")
async def verify_payment(payload: VerifyRequest, db: Session = Depends(get_db)):
    try:
        # Verify Razorpay Signature
        msg = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}"
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode('utf-8'),
            msg.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

        if generated_signature != payload.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")

        item_lower = payload.itemName.lower()
        is_subscription = "subscription" in item_lower or "monthly" in item_lower or "yearly" in item_lower or "weekly" in item_lower

        if is_subscription:
            # --- SUBSCRIPTION LOGIC ---
            db.execute(
                """INSERT INTO public.user_subscriptions (user_id, plan_name, status) 
                   VALUES (:uid, :plan, 'active')""",
                {"uid": payload.userId, "plan": payload.itemName}
            )
            db.commit()
        else:
            # --- CREDITS LOGIC ---
            credits_to_add = 0
            if "3 call credits" in item_lower:
                credits_to_add = 3
            elif "6 call credits" in item_lower:
                credits_to_add = 6
            elif "9 call credits" in item_lower:
                credits_to_add = 9
            elif "single call credit" in item_lower:
                credits_to_add = 1
            else:
                credits_to_add = int(payload.amount) # Custom amount default rate (₹1 = 1 credit)

            # Check if record exists, else insert, or update
            existing = db.execute("SELECT id FROM public.account_credits WHERE user_id = :uid", {"uid": payload.userId}).fetchone()
            if existing:
                db.execute(
                    """UPDATE public.account_credits 
                       SET balance = balance + :credits, total_purchased = total_purchased + :credits 
                       WHERE user_id = :uid""",
                    {"credits": credits_to_add, "uid": payload.userId}
                )
            else:
                db.execute(
                    """INSERT INTO public.account_credits (user_id, balance, total_purchased, total_used) 
                       VALUES (:uid, :credits, :credits, 0)""",
                    {"uid": payload.userId, "credits": credits_to_add}
                )
            db.commit()

        # Log transaction history
        db.execute(
            """INSERT INTO public.payment_transactions (user_id, razorpay_order_id, razorpay_payment_id, item_name, amount, type) 
               VALUES (:uid, :oid, :pid, :item, :amt, :type)""",
            {
                "uid": payload.userId,
                "oid": payload.razorpay_order_id,
                "pid": payload.razorpay_payment_id,
                "item": payload.itemName,
                "amt": payload.amount,
                "type": "subscription" if is_subscription else "credit"
            }
        )
        db.commit()

        return {
            "success": True,
            "message": f"Successfully processed {'Subscription' if is_subscription else 'Credits'}!"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))