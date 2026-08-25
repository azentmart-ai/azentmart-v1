from datetime import date, time
from typing import Optional

from pydantic import (
    AliasChoices,
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


# =========================================================
# CREATE DEMO REQUEST
# =========================================================

class DemoRequestCreate(BaseModel):

    model_config = ConfigDict(
        populate_by_name=True
    )

    # Full Name
    full_name: str = Field(
        ...,
        validation_alias=AliasChoices(
            "full_name",
            "fullName",
        ),
    )

    # Business / Work Email
    business_email: EmailStr = Field(
        ...,
        validation_alias=AliasChoices(
            "business_email",
            "workEmail",
            "businessEmail",
            "email",
        ),
    )

    # Designation
    designation: Optional[str] = Field(
        None,
        validation_alias=AliasChoices(
            "designation",
            "role",
            "jobTitle",
        ),
    )

    # Phone Number
    phone_number: Optional[str] = Field(
        None,
        validation_alias=AliasChoices(
            "phone_number",
            "phoneNumber",
            "phone",
        ),
    )

    # What the customer wants to automate
    demo_focus: Optional[str] = Field(
        None,
        validation_alias=AliasChoices(
            "demo_focus",
            "demoFocus",
            "requirement",
            "requirementType",
            "whatToAutomate",
        ),
    )

    # Preferred Demo Date
    preferred_date: Optional[date] = Field(
        None,
        validation_alias=AliasChoices(
            "preferred_date",
            "preferredDate",
            "date",
        ),
    )

    # Preferred Demo Time
    preferred_time: Optional[time] = Field(
        None,
        validation_alias=AliasChoices(
            "preferred_time",
            "preferredTime",
            "time",
        ),
    )


# =========================================================
# DEMO REQUEST RESPONSE
# =========================================================

class DemoRequestResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    full_name: str

    business_email: str

    designation: Optional[str] = None

    phone_number: Optional[str] = None

    demo_focus: Optional[str] = None

    preferred_date: Optional[date] = None

    preferred_time: Optional[time] = None

    status: str