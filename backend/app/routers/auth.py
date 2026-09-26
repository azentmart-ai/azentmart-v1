import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db, settings
from ..models import User, PasswordResetRequest
from ..schemas import SignupRequest, LoginRequest, GoogleLoginRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePassword
from ..security import hash_password, verify_password, create_token, token_hash, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

def user_out(u: User):
    return {"id": u.id, "name": u.name, "email": u.email, "phone": u.phone, "location": u.location, "role": u.role, "avatar_url": u.avatar_url}

def auth_out(u: User):
    return {"access_token": create_token(u), "token_type": "bearer", "user": user_out(u)}

@router.post("/signup")
def signup(p: SignupRequest, db: Session = Depends(get_db)):
    email = p.email.lower().strip()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(409, "An account with this email already exists")
    import uuid
    u = User(id=str(uuid.uuid4()), name=p.name.strip(), email=email, password_hash=hash_password(p.password))
    db.add(u); db.commit(); db.refresh(u)
    return {"message": "Account created successfully", "user": user_out(u)}

@router.post("/login")
def login(p: LoginRequest, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == p.email.lower().strip()).first()
    if not u or not verify_password(p.password, u.password_hash):
        raise HTTPException(401, "Invalid email or password")
    return auth_out(u)

@router.post("/google")
def google_login(p: GoogleLoginRequest, db: Session = Depends(get_db)):
    if not settings.google_client_id:
        raise HTTPException(503, "Google login is not configured. Add GOOGLE_CLIENT_ID to backend/.env")
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        info = id_token.verify_oauth2_token(p.credential, google_requests.Request(), settings.google_client_id)
    except Exception:
        raise HTTPException(401, "Google authentication could not be verified")
    email = (info.get("email") or "").lower()
    if not email or not info.get("email_verified"):
        raise HTTPException(401, "A verified Google email is required")
    u = db.query(User).filter(User.email == email).first()
    import uuid
    if not u:
        u = User(id=str(uuid.uuid4()), name=info.get("name") or email.split("@")[0], email=email, google_id=info.get("sub"), avatar_url=info.get("picture"))
        db.add(u)
    else:
        u.google_id = info.get("sub") or u.google_id
        u.avatar_url = info.get("picture") or u.avatar_url
    db.commit(); db.refresh(u)
    return auth_out(u)

@router.post("/change-password")
def change_password(p: ChangePassword, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not verify_password(p.current_password, user.password_hash):
        raise HTTPException(400, "Current password is incorrect")
    user.password_hash = hash_password(p.new_password)
    db.commit()
    return {"message":"Password changed successfully"}

@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return user_out(user)

@router.post("/forgot-password")
def forgot_password(p: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Always return the same response so account existence is not exposed.
    u = db.query(User).filter(User.email == p.email.lower().strip()).first()
    response = {"message": "If an account exists, password-reset instructions have been generated."}
    if not u:
        return response
    raw = secrets.token_urlsafe(32)
    item = PasswordResetRequest(
        id=secrets.token_hex(16), user_id=u.id, token_hash=token_hash(raw),
        expires_at=datetime.utcnow() + timedelta(minutes=30)
    )
    db.add(item); db.commit()
    reset_url = f"{settings.app_base_url}/reset-password?token={raw}"
    # Email delivery is optional; in local development expose the URL in the API response.
    if settings.smtp_host and settings.smtp_user and settings.smtp_password:
        from email.message import EmailMessage
        import smtplib
        msg = EmailMessage()
        msg["Subject"] = "Reset your AzentMartAI password"
        msg["From"] = settings.smtp_from or settings.smtp_user
        msg["To"] = u.email
        msg.set_content(f"Reset your password using this link (valid for 30 minutes): {reset_url}")
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls(); server.login(settings.smtp_user, settings.smtp_password); server.send_message(msg)
    else:
        response["development_reset_url"] = reset_url
    return response

@router.post("/reset-password")
def reset_password(p: ResetPasswordRequest, db: Session = Depends(get_db)):
    item = db.query(PasswordResetRequest).filter(
        PasswordResetRequest.token_hash == token_hash(p.token),
        PasswordResetRequest.used_at.is_(None),
        PasswordResetRequest.expires_at > datetime.utcnow()
    ).first()
    if not item:
        raise HTTPException(400, "This reset link is invalid or expired")
    u = db.get(User, item.user_id)
    if not u:
        raise HTTPException(404, "User not found")
    u.password_hash = hash_password(p.password)
    item.used_at = datetime.utcnow()
    db.commit()
    return {"message": "Password updated successfully"}
