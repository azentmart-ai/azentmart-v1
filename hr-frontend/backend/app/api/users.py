from fastapi import APIRouter, Depends

from ..dependencies import current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/ping")
def ping(user=Depends(current_user)):
    return {
        "message": "users service ready",
        "user_id": user.id
    }
