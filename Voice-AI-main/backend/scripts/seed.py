from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db import Base, engine, SessionLocal
from app.models.models import User, Assistant, Segment, KnowledgeBase, Dialer
from app.security import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

LANGUAGES = "English, Tamil, Hindi, Telugu, Malayalam, Kannada"

try:
    admin = db.query(User).filter(User.email == "admin@azentmart.ai").first()
    if not admin:
        admin = User(
            email="admin@azentmart.ai",
            password_hash=hash_password("Admin@123"),
            name="AzentMart Admin",
            role="Admin",
        )
        db.add(admin)
        db.flush()

    # Attach older unowned seed records to the seeded user.
    assistants = [
        ("Course Enquiry", "INBOUND", "EDUCATION", "Answer course enquiries, explain programs, fees, eligibility and admission requirements."),
        ("Admission Support", "INBOUND", "EDUCATION", "Guide students through admissions, application procedures, eligibility and important dates."),
        ("Customer Support", "INBOUND", "SUPPORT", "Handle customer questions, complaints and service requests with quick helpful responses."),
        ("Lead Qualification", "OUTBOUND", "SALES", "Identify prospects, understand requirements and qualify leads for the sales team."),
        ("Billing Support", "INBOUND", "SUPPORT", "Answer billing questions, explain invoices and assist customers with payment issues."),
        ("Technical Support", "INBOUND", "SUPPORT", "Help users troubleshoot common technical issues and escalate complex problems."),
    ]

    for name, direction, category, description in assistants:
        item = db.query(Assistant).filter(Assistant.user_id == admin.id, Assistant.name == name).first()
        if not item:
            item = db.query(Assistant).filter(Assistant.name == name, Assistant.user_id.is_(None)).first()
        if not item:
            item = Assistant(name=name, user_id=admin.id)
            db.add(item)
        item.user_id = admin.id
        item.language = "Multilingual"
        item.languages = LANGUAGES
        item.company = "AzentMart"
        item.assistant_type = direction
        item.description = description
        item.system_prompt = (
            f"You are the AzentMart {name} voice assistant. "
            "Speak naturally and concisely. Support multilingual conversations. "
            "Never invent prices, dates, policies or availability. "
            "If information is missing, say a human team member can confirm it."
        )
        item.knowledge_enabled = True
        item.active = True

    for name, description in [
        ("New Course Leads", "Customers who recently showed interest."),
        ("Admission Enquiries", "Customers asking about admissions."),
        ("Existing Students", "Currently enrolled students."),
    ]:
        item = db.query(Segment).filter(Segment.name == name, Segment.user_id == admin.id).first()
        if not item:
            item = db.query(Segment).filter(Segment.name == name, Segment.user_id.is_(None)).first()
        if not item:
            item = Segment(name=name, user_id=admin.id)
            db.add(item)
        item.user_id = admin.id
        item.description = description
        item.status = "ACTIVE"

    dialer = db.query(Dialer).filter(Dialer.user_id == admin.id, Dialer.name == "AzentMart Voice Dialer").first()
    if not dialer:
        dialer = Dialer(
            user_id=admin.id,
            name="AzentMart Voice Dialer",
            type="VOICE",
            phone_number="+91 00000 00000",
            status="Active",
            description="Primary voice dialer for AI campaigns.",
        )
        db.add(dialer)

    kb = db.query(KnowledgeBase).filter(KnowledgeBase.user_id == admin.id, KnowledgeBase.title == "AzentMart FAQ").first()
    if not kb:
        kb = KnowledgeBase(user_id=admin.id, title="AzentMart FAQ")
        db.add(kb)
    kb.language = "Multilingual"
    kb.source_type = "FAQ"
    kb.active = True
    kb.content = (
        "AzentMart provides AI voice-agent solutions. "
        "Only answer with configured company information. "
        "If a fee, date, policy or availability is not configured, "
        "tell the customer that the human team can confirm it."
    )

    db.commit()
finally:
    db.close()

print("Seed completed.")
print("Demo login: admin@azentmart.ai / Admin@123")
print("Seeded: 6 multilingual assistants, 3 segments, 1 dialer and 1 knowledge base.")
