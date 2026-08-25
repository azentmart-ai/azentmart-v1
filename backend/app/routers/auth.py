from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Depends, Request

from sqlalchemy.orm import Session

from ..db import get_db

from ..models.models import User, LoginHistory

from ..schemas.common import RegisterIn, LoginIn, TokenOut

from ..security import (
    hash_password,
    verify_password,
    create_access_token,
)

from ..deps import get_current_user


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# =========================================================
# REGISTER
# =========================================================

@router.post("/register", response_model=TokenOut)
def register(
    data: RegisterIn,
    db: Session = Depends(get_db),
):
    email = data.email.strip().lower()

    # -----------------------------------------------------
    # Check whether email already exists
    # -----------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    # -----------------------------------------------------
    # Create user
    # -----------------------------------------------------

    user = User(
        email=email,
        password_hash=hash_password(data.password),
        name=data.name.strip(),
        role=data.role.strip() if data.role else "user",
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to create user",
        )

    # -----------------------------------------------------
    # Create JWT
    # -----------------------------------------------------

    access_token = create_access_token(user.id)

    # -----------------------------------------------------
    # Return response
    # -----------------------------------------------------

    return TokenOut(
        access_token=access_token,
        user_id=user.id,
        name=user.name,
        role=user.role,
    )


# =========================================================
# LOGIN
# =========================================================

@router.post("/login", response_model=TokenOut)
def login(
    data: LoginIn,
    request: Request,
    db: Session = Depends(get_db),
):
    # -----------------------------------------------------
    # Normalize email
    # -----------------------------------------------------

    email = data.email.strip().lower()

    # -----------------------------------------------------
    # Request information
    # -----------------------------------------------------

    ip_address = ""

    if request.client:
        ip_address = request.client.host

    user_agent = request.headers.get(
        "user-agent",
        "",
    )

    login_time = datetime.now(timezone.utc)

    # -----------------------------------------------------
    # Find user
    # -----------------------------------------------------

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # -----------------------------------------------------
    # INVALID LOGIN
    # -----------------------------------------------------

    if not user or not verify_password(
        data.password,
        user.password_hash,
    ):
        failed_login = LoginHistory(
            user_id=user.id if user else None,
            email=email,
            login_at=login_time,
            ip_address=ip_address,
            status="FAILED",
            user_agent=user_agent,
        )

        try:
            db.add(failed_login)
            db.commit()
            db.refresh(failed_login)

        except Exception:
            db.rollback()

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    # -----------------------------------------------------
    # Check active status
    # -----------------------------------------------------

    if (
        hasattr(user, "is_active")
        and user.is_active is False
    ):
        raise HTTPException(
            status_code=403,
            detail="Account is inactive",
        )

    # -----------------------------------------------------
    # SUCCESSFUL LOGIN
    # -----------------------------------------------------

    successful_login = LoginHistory(
        user_id=user.id,
        email=user.email,
        login_at=login_time,
        ip_address=ip_address,
        status="SUCCESS",
        user_agent=user_agent,
    )

    try:
        db.add(successful_login)
        db.commit()
        db.refresh(successful_login)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Login history could not be saved",
        )

    # -----------------------------------------------------
    # Create JWT
    # -----------------------------------------------------

    access_token = create_access_token(user.id)

    # -----------------------------------------------------
    # Return login response
    # -----------------------------------------------------

    return TokenOut(
        access_token=access_token,
        user_id=user.id,
        name=user.name,
        role=user.role,
    )


# =========================================================
# CURRENT USER
# =========================================================

@router.get("/me")
def me(
    user=Depends(get_current_user),
):
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
    }


# =========================================================
# GET PROFILE
# =========================================================

@router.get("/profile")
def get_profile(
    user=Depends(get_current_user),
):
    # -----------------------------------------------------
    # Split stored name into first and last name
    # -----------------------------------------------------

    full_name = (user.name or "").strip()

    name_parts = full_name.split(" ", 1)

    first_name = (
        name_parts[0]
        if len(name_parts) >= 1
        else ""
    )

    last_name = (
        name_parts[1]
        if len(name_parts) >= 2
        else ""
    )

    return {
        "id": user.id,
        "first_name": first_name,
        "last_name": last_name,
        "email": user.email,
        "role": user.role,
    }


# =========================================================
# UPDATE PROFILE
# =========================================================

@router.put("/profile")
def update_profile(
    data: dict,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # -----------------------------------------------------
    # Get values
    # -----------------------------------------------------

    first_name = str(
        data.get("first_name", "")
    ).strip()

    last_name = str(
        data.get("last_name", "")
    ).strip()

    email = str(
        data.get("email", "")
    ).strip().lower()

    role = str(
        data.get("role", "")
    ).strip()

    # -----------------------------------------------------
    # Validate first name
    # -----------------------------------------------------

    if not first_name:
        raise HTTPException(
            status_code=400,
            detail="First name is required",
        )

    # -----------------------------------------------------
    # Validate email
    # -----------------------------------------------------

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required",
        )

    # -----------------------------------------------------
    # Check duplicate email
    # -----------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == email,
            User.id != user.id,
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    # -----------------------------------------------------
    # Build full name
    # -----------------------------------------------------

    full_name = (
        f"{first_name} {last_name}"
    ).strip()

    # -----------------------------------------------------
    # Update user
    # -----------------------------------------------------

    user.name = full_name
    user.email = email

    if role:
        user.role = role

    try:
        db.commit()
        db.refresh(user)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update profile",
        )

    # -----------------------------------------------------
    # Return updated profile
    # -----------------------------------------------------

    return {
        "message": "Profile updated successfully",

        "user": {
            "id": user.id,
            "first_name": first_name,
            "last_name": last_name,
            "email": user.email,
            "role": user.role,
        },
    }


# =========================================================
# CHANGE PASSWORD
# =========================================================

@router.put("/password")
def change_password(
    data: dict,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # -----------------------------------------------------
    # Get new password
    # -----------------------------------------------------

    new_password = str(
        data.get("password", "")
    ).strip()

    # -----------------------------------------------------
    # Validate password
    # -----------------------------------------------------

    if not new_password:
        raise HTTPException(
            status_code=400,
            detail="Password is required",
        )

    if len(new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 8 characters",
        )

    # -----------------------------------------------------
    # Hash new password
    # -----------------------------------------------------

    user.password_hash = hash_password(
        new_password
    )

    # -----------------------------------------------------
    # Save to PostgreSQL
    # -----------------------------------------------------

    try:
        db.commit()
        db.refresh(user)

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update password",
        )

    # -----------------------------------------------------
    # Return response
    # -----------------------------------------------------

    return {
        "message": "Password updated successfully"
    }