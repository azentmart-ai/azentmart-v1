from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])


class AIChatRequest(BaseModel):
    message: str
    context: Optional[str] = "hr"
    employee_id: Optional[str] = None


class AIChatResponse(BaseModel):
    answer: str
    success: bool = True


@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(request: AIChatRequest):

    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message is required"
        )

    try:
        # TEMPORARY TEST RESPONSE
        #
        # Replace this section with your actual
        # LLM + RAG service.

        text = message.lower()

        if "onboarding" in text:
            answer = (
                "I can help with employee onboarding. "
                "The onboarding process includes personal information, "
                "contact details, employment details, education and experience, "
                "documents and final review."
            )

        elif "payroll" in text:
            answer = (
                "I can help with payroll information such as gross salary, "
                "deductions, PF, TDS, claims and net pay."
            )

        elif "leave" in text:
            answer = (
                "I can help with employee leave requests, leave balances "
                "and leave policies."
            )

        elif "attendance" in text:
            answer = (
                "I can help with attendance records, working hours, "
                "late marks and attendance-related HR information."
            )

        elif "employee" in text:
            answer = (
                "I can help you find authorized employee information "
                "and HR records."
            )

        else:
            answer = (
                "I am connected to the AzentMart HR workspace. "
                "I can help with employees, onboarding, attendance, "
                "leave, payroll, policies, documents and HR support."
            )

        return AIChatResponse(
            answer=answer,
            success=True
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"AI assistant error: {str(exc)}"
        )