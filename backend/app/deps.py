from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from .db import get_db
from .models.models import User
from .security import decode_token


DB = Annotated[Session, Depends(get_db)]

security = HTTPBearer()


def get_current_user(
    db: DB,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    user_id = decode_token(token)

    user = db.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user