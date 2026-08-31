from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from pwdlib import PasswordHash
from fastapi import HTTPException, status
from .config import settings

password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    return password_hash.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return password_hash.verify(password, hashed)

def create_access_token(user_id: int):
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode({"sub": str(user_id), "exp": expire}, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError()
        return int(user_id)
    except (JWTError, ValueError, TypeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
