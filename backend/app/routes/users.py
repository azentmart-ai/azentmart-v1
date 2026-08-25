from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse


router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


# =====================================================
# REGISTER
# =====================================================

@router.post(
    "/register",
    response_model=UserResponse
)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=user_data.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =====================================================
# LOGIN
# =====================================================

@router.post(
    "/login",
    response_model=UserResponse
)
def login_user(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if user.password != user_data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return user