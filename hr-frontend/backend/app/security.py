import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt

load_dotenv()

SECRET = os.getenv(
    "JWT_SECRET_KEY",
    "change-this-in-production"
)

ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)

EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "1440"
    )
)


def hash_password(password: str) -> str:
    salt = os.urandom(16)

    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        120_000
    )

    return (
        f"pbkdf2_sha256$120000$"
        f"{salt.hex()}${digest.hex()}"
    )


def verify_password(
    password: str,
    stored_hash: str
) -> bool:
    try:
        scheme, iterations, salt_hex, digest_hex = (
            stored_hash.split("$")
        )

        if scheme != "pbkdf2_sha256":
            return False

        salt = bytes.fromhex(salt_hex)

        calculated = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            int(iterations)
        )

        return hmac.compare_digest(
            calculated.hex(),
            digest_hex
        )
    except (ValueError, TypeError):
        return False


def create_token(user_id: int) -> str:
    expires = (
        datetime.now(timezone.utc)
        + timedelta(minutes=EXPIRE_MINUTES)
    )

    payload = {
        "sub": str(user_id),
        "exp": expires
    }

    return jwt.encode(
        payload,
        SECRET,
        algorithm=ALGORITHM
    )


def decode_token(token: str) -> dict:
    return jwt.decode(
        token,
        SECRET,
        algorithms=[ALGORITHM]
    )
