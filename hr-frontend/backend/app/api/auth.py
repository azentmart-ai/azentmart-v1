from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import current_user, HR_ROLES
from ..models import Employee, User
from ..schemas import LoginIn, SignupIn
from ..security import create_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        department="Human Resources",
        role="hr_admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "HR account created successfully"}

@router.post("/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.role not in HR_ROLES:
        raise HTTPException(
            status_code=403,
            detail="Only authorized HR users can access this application.",
        )

    return {
        "access_token": create_token(user.id),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
        },
    }

@router.get("/me")
def me(user=Depends(current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "department": user.department,
    }

@router.post("/forgot-password")
def forgot(payload: dict, db: Session = Depends(get_db)):
    email = str(payload.get("email", "")).strip().lower()
    user = db.query(User).filter(User.email == email).first()
    return {
        "message": "If the HR account exists, contact the HR system administrator to reset the password.",
        "account_exists": bool(user),
    }

@router.post("/reset-password")
def reset(payload: dict, db: Session = Depends(get_db)):
    email = str(payload.get("email", "")).strip().lower()
    new_password = str(payload.get("new_password", ""))
    if not email or len(new_password) < 6:
        raise HTTPException(400, "Email and a password of at least 6 characters are required.")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(404, "HR account not found.")
    user.password_hash = hash_password(new_password)
    db.commit()
    return {"message": "Password reset successfully. Please sign in again."}
