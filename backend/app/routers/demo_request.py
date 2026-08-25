from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user
from ..models.demo_request import DemoRequest
from ..schemas.demo_request import (
    DemoRequestCreate,
    DemoRequestResponse,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/demo-requests",
    tags=["Demo Requests"],
)


# =========================================================
# CREATE DEMO REQUEST
# =========================================================

@router.post(
    "/",
    response_model=DemoRequestResponse,
    status_code=201,
)
def create_demo_request(
    request: DemoRequestCreate,
    db: Session = Depends(get_db),
):
    try:
        demo = DemoRequest(
            full_name=request.full_name,
            business_email=str(request.business_email),
            designation=request.designation,
            phone_number=request.phone_number,
            demo_focus=request.demo_focus,
            preferred_date=request.preferred_date,
            preferred_time=request.preferred_time,
            status="pending",
        )

        db.add(demo)
        db.commit()
        db.refresh(demo)

        return demo

    except Exception as exc:
        db.rollback()

        print(
            "Failed to save demo request:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to save demo request.",
        )


# =========================================================
# GET ALL DEMO REQUESTS
# ADMIN / OWNER ONLY
# =========================================================

@router.get(
    "/",
    response_model=list[DemoRequestResponse],
)
def get_demo_requests(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # Make sure the logged-in user has permission
    user_role = getattr(user, "role", "")

    if user_role.lower() not in {
        "admin",
        "owner",
    }:
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return (
        db.query(DemoRequest)
        .order_by(DemoRequest.created_at.desc())
        .all()
    )