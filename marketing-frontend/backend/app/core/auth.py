from datetime import datetime, timedelta, timezone

from typing import Optional

import jwt

from fastapi import HTTPException, status

from pwdlib import PasswordHash

from app.core.config import settings


# JWT configuration
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# Password hashing configuration
password_hash = PasswordHash.recommended()


def get_jwt_secret() -> str:
    """
    Get the JWT signing secret.

    For production, this should be provided through an
    environment variable and should never be hard-coded.
    """
    secret = getattr(settings, "JWT_SECRET_KEY", None)

    if not secret:
        raise RuntimeError(
            "JWT_SECRET_KEY is not configured."
        )

    return secret


def hash_password(password: str) -> str:
    """
    Securely hash a plain-text password using Argon2.
    """
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain-text password against its stored hash.
    """
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    user_id: str,
    tenant_id: str,
) -> str:
    """
    Create a JWT access token containing the user's identity
    and the tenant they are authorized to access.
    """
    now = datetime.now(timezone.utc)

    expires_at = now + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": user_id,
        "tenant_id": tenant_id,
        "iat": now,
        "exp": expires_at,
    }

    token = jwt.encode(
        payload,
        get_jwt_secret(),
        algorithm=ALGORITHM,
    )

    return token


def decode_access_token(token: str) -> dict:
    """
    Decode and validate a JWT access token.
    """
    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")
        tenant_id = payload.get("tenant_id")

        if not user_id or not tenant_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
            )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired.",
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )


def get_user_id_from_token(token: str) -> str:
    """
    Extract the authenticated user ID from the JWT.
    """
    payload = decode_access_token(token)

    return payload["sub"]


def get_tenant_id_from_token(token: str) -> str:
    """
    Extract the authorized tenant ID from the JWT.
    """
    payload = decode_access_token(token)

    return payload["tenant_id"]