import os

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from google import genai

from ..database import get_db
from ..dependencies import current_user, is_hr, require_roles
from ..models import Ticket
from ..schemas import TicketIn


router = APIRouter(
    prefix="/support",
    tags=["HR Support"]
)


# ============================================================
# AI CHAT SCHEMA
# ============================================================

class AIChatIn(BaseModel):
    message: str


# ============================================================
# LIST SUPPORT TICKETS
# ============================================================

@router.get("")
def list_tickets(
    db: Session = Depends(get_db),
    user=Depends(current_user)
):
    q = db.query(Ticket)

    if not is_hr(user):
        q = q.filter(
            Ticket.user_id == user.id
        )

    rows = (
        q.order_by(Ticket.id.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "subject": r.subject,
            "category": r.category,
            "description": r.description,
            "priority": r.priority,
            "status": r.status,
            "assigned_to": r.assigned_to,
        }
        for r in rows
    ]


# ============================================================
# CREATE SUPPORT TICKET
# ============================================================

@router.post("")
def create_ticket(
    payload: TicketIn,
    db: Session = Depends(get_db),
    user=Depends(current_user)
):
    ticket = Ticket(
        user_id=user.id,
        **payload.model_dump()
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {
        "id": ticket.id,
        "message": "HR ticket created"
    }


# ============================================================
# UPDATE SUPPORT TICKET
# ============================================================

@router.patch("/{ticket_id}")
def update_ticket(
    ticket_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user=Depends(
        require_roles(
            "hr_admin",
            "hr_manager",
            "admin"
        )
    )
):
    ticket = db.get(
        Ticket,
        ticket_id
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    for key in (
        "status",
        "priority",
        "assigned_to"
    ):
        if key in payload:
            setattr(
                ticket,
                key,
                payload[key]
            )

    db.commit()
    db.refresh(ticket)

    return {
        "id": ticket.id,
        "status": ticket.status,
        "priority": ticket.priority,
        "assigned_to": ticket.assigned_to,
    }


# ============================================================
# 24/7 AI HR SUPPORT
# ============================================================

@router.post("/ai/chat")
def ai_hr_chat(
    payload: AIChatIn,
    db: Session = Depends(get_db),
    user=Depends(current_user)
):
    message = payload.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message is required."
        )

    # --------------------------------------------------------
    # GEMINI API KEY
    # --------------------------------------------------------

    gemini_api_key = os.getenv(
        "GEMINI_API_KEY"
    )

    if not gemini_api_key:
        return {
            "response": (
                "AzentMart AI HR Support is currently "
                "not configured. Please create an HR "
                "support ticket and the People Operations "
                "team will assist you."
            )
        }

    # --------------------------------------------------------
    # AI INSTRUCTIONS
    # --------------------------------------------------------

    system_instruction = """
You are AzentMart AI HR Support.

You are a professional 24/7 HR support assistant.

Your purpose is to help employees and HR administrators
understand HR processes and company HR information.

You can help with:

- Leave
- Attendance
- Attendance regularization
- Payroll
- Benefits
- Employee documents
- HR policies
- Onboarding
- Employee records
- HR support tickets
- General HR processes

IMPORTANT RULES:

1. Be professional, friendly and concise.

2. Give clear answers that are easy for employees
   to understand.

3. Never invent company-specific policies.

4. If company-specific information is not available,
   clearly tell the employee that HR needs to confirm it.

5. Never ask for passwords, OTPs, API keys or
   other authentication credentials.

6. Never expose private employee information.

7. For payroll, legal, disciplinary or sensitive
   HR matters, explain that the final answer should
   be confirmed by HR.

8. Never claim that you performed an action unless
   the system actually performed that action.

9. If the employee needs an action that the AI cannot
   perform, tell them to create an HR support ticket.

10. Keep normal answers short and useful.

11. You are available 24/7.

12. If the employee simply says hello, respond naturally
    and ask how you can help.

13. If the employee asks about something unrelated to HR,
    politely explain that you are the AzentMart HR assistant
    and guide them back to HR-related questions.
"""

    # --------------------------------------------------------
    # USER CONTEXT
    # --------------------------------------------------------

    user_name = getattr(
        user,
        "name",
        "Employee"
    )

    user_role = getattr(
        user,
        "role",
        "employee"
    )

    prompt = f"""
{system_instruction}

Current user:

Name: {user_name}
Role: {user_role}

Employee question:

{message}

Answer the employee's question now.
"""

    # --------------------------------------------------------
    # CALL GEMINI
    # --------------------------------------------------------

    try:

        client = genai.Client(
            api_key=gemini_api_key
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        answer = getattr(
            response,
            "text",
            None
        )

        if not answer:
            answer = (
                "I couldn't generate a response right now. "
                "Please try again or create an HR support ticket."
            )

        return {
            "response": answer.strip()
        }

    except Exception as exc:

        print(
            "AI HR Support error:",
            repr(exc)
        )

        return {
            "response": (
                "I'm temporarily unable to connect to "
                "the AI HR service. Please try again in a "
                "moment or create an HR support ticket."
            )
        }