from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from .security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

HR_ROLES = {"hr_admin", "hr_manager", "admin"}

def current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = decode_token(token)
        user_id = int(payload["sub"])
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if user.role not in HR_ROLES:
        raise HTTPException(
            status_code=403,
            detail="This HR workspace is restricted to authorized HR users.",
        )

    return user

def require_roles(*roles):
    def dependency(user=Depends(current_user)):
        if user.role not in set(roles):
            raise HTTPException(
                status_code=403,
                detail="You do not have permission for this action.",
            )
        return user
    return dependency

def is_hr(user):
    return user.role in HR_ROLES
