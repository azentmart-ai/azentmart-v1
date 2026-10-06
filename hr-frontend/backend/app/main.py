import os
from datetime import date

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import SessionLocal, engine
from .db.base import Base
from .models import (
    Attendance,
    Benefit,
    Document,
    Employee,
    Leave,
    Onboarding,
    Payroll,
    Policy,
    User,
    KnowledgeChunk,
    OnboardingTask
)
from .security import hash_password
from .knowledge import ingest
from .api import (
    ai_agent,
    attendance,
    auth,
    benefits,
    documents,
    employees,
    leave,
    mcp,
    onboarding,
    payroll,
    policies,
    reports,
    search,
    support,
    users
)

load_dotenv()

def ensure_schema_columns():
    """Add non-breaking columns for existing PostgreSQL installations."""
    statements = [
        "ALTER TABLE employees ADD COLUMN IF NOT EXISTS location VARCHAR(120)",
        "ALTER TABLE employees ADD COLUMN IF NOT EXISTS manager VARCHAR(150)",
        "ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_type VARCHAR(50) DEFAULT 'Full-time'",
        "ALTER TABLE employees ADD COLUMN IF NOT EXISTS salary DOUBLE PRECISION",
        "ALTER TABLE employees ADD COLUMN IF NOT EXISTS date_of_birth DATE",
        "ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_name VARCHAR(120)",
        "ALTER TABLE employees ADD COLUMN IF NOT EXISTS bank_account VARCHAR(40)",
        "ALTER TABLE employees ADD COLUMN IF NOT EXISTS ifsc_code VARCHAR(20)",
        "ALTER TABLE attendance ADD COLUMN IF NOT EXISTS break_minutes INTEGER DEFAULT 0",
        "ALTER TABLE attendance ADD COLUMN IF NOT EXISTS working_hours DOUBLE PRECISION",
        "ALTER TABLE attendance ADD COLUMN IF NOT EXISTS overtime_hours DOUBLE PRECISION DEFAULT 0",
        "ALTER TABLE attendance ADD COLUMN IF NOT EXISTS remarks VARCHAR(500)",
        "ALTER TABLE attendance ADD COLUMN IF NOT EXISTS source VARCHAR(40) DEFAULT 'system'",
        "ALTER TABLE documents ADD COLUMN IF NOT EXISTS employee_id INTEGER",
        "ALTER TABLE documents ADD COLUMN IF NOT EXISTS category VARCHAR(80) DEFAULT 'HR Document'",
        "ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_url VARCHAR(500)",
        "ALTER TABLE documents ADD COLUMN IF NOT EXISTS expires_at DATE",
        "ALTER TABLE documents ADD COLUMN IF NOT EXISTS visibility VARCHAR(40) DEFAULT 'HR'",
        "ALTER TABLE policies ADD COLUMN IF NOT EXISTS version VARCHAR(30) DEFAULT '1.0'",
        "ALTER TABLE policies ADD COLUMN IF NOT EXISTS effective_date DATE",
        "ALTER TABLE policies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "ALTER TABLE benefits ADD COLUMN IF NOT EXISTS category VARCHAR(80) DEFAULT 'Employee Benefit'",
        "ALTER TABLE benefits ADD COLUMN IF NOT EXISTS coverage VARCHAR(250)",
        "ALTER TABLE payroll ADD COLUMN IF NOT EXISTS gross_pay DOUBLE PRECISION DEFAULT 0",
        "ALTER TABLE payroll ADD COLUMN IF NOT EXISTS pf DOUBLE PRECISION DEFAULT 0",
        "ALTER TABLE payroll ADD COLUMN IF NOT EXISTS tds DOUBLE PRECISION DEFAULT 0",
        "ALTER TABLE payroll ADD COLUMN IF NOT EXISTS claims DOUBLE PRECISION DEFAULT 0",
        "ALTER TABLE payroll ADD COLUMN IF NOT EXISTS professional_tax DOUBLE PRECISION DEFAULT 0",
        "ALTER TABLE payroll ADD COLUMN IF NOT EXISTS other_deductions DOUBLE PRECISION DEFAULT 0",
        "ALTER TABLE tickets ADD COLUMN IF NOT EXISTS priority VARCHAR(30) DEFAULT 'Normal'",
        "ALTER TABLE tickets ADD COLUMN IF NOT EXISTS assigned_to INTEGER",
        "ALTER TABLE onboarding ADD COLUMN IF NOT EXISTS personal_information_completed BOOLEAN DEFAULT FALSE",
        "ALTER TABLE onboarding ADD COLUMN IF NOT EXISTS contact_details_completed BOOLEAN DEFAULT FALSE",
        "ALTER TABLE onboarding ADD COLUMN IF NOT EXISTS employment_details_completed BOOLEAN DEFAULT FALSE",
        "ALTER TABLE onboarding ADD COLUMN IF NOT EXISTS education_experience_completed BOOLEAN DEFAULT FALSE",
        "ALTER TABLE onboarding ADD COLUMN IF NOT EXISTS documents_completed BOOLEAN DEFAULT FALSE",
        "ALTER TABLE onboarding ADD COLUMN IF NOT EXISTS review_completed BOOLEAN DEFAULT FALSE",
        "ALTER TABLE onboarding ADD COLUMN IF NOT EXISTS details JSONB"
    ]
    with engine.begin() as conn:
        for statement in statements:
            conn.exec_driver_sql(statement)

def seed_database():
    """Bootstrap only an explicitly configured administrator; never create demo HR records."""
    email=os.getenv("BOOTSTRAP_ADMIN_EMAIL")
    password=os.getenv("BOOTSTRAP_ADMIN_PASSWORD")
    name=os.getenv("BOOTSTRAP_ADMIN_NAME","HR Administrator")
    if not email or not password:
        return
    db=SessionLocal()
    try:
        existing=db.query(User).filter(User.email==email).first()
        if existing:
            return
        user=User(name=name,email=email,password_hash=hash_password(password),role="hr_admin",department="Human Resources")
        db.add(user)
        db.commit()
    finally:
        db.close()

def seed_default_hr_content():
    """Create safe starter HR content without creating demo employee accounts."""
    db = SessionLocal()
    try:
        if db.query(Policy).count() == 0:
            db.add_all([
                Policy(title="Leave & Attendance Policy", description="Rules for working hours, attendance, leave requests, approvals and regularization.", version="1.0", status="Active"),
                Policy(title="Code of Conduct", description="Expected professional conduct, workplace behaviour, confidentiality and respectful communication.", version="1.0", status="Active"),
                Policy(title="Information Security Policy", description="Password, access, device, data protection and information security responsibilities.", version="1.0", status="Active"),
                Policy(title="Employee Handbook", description="Core HR guidance covering workplace practices, benefits and employee responsibilities.", version="1.0", status="Active"),
            ])
        if db.query(Benefit).count() == 0:
            db.add_all([
                Benefit(title="Health Insurance", description="Employee medical insurance and eligible dependent coverage.", status="Active"),
                Benefit(title="Learning & Development", description="Learning resources, training programs and professional development support.", status="Active"),
                Benefit(title="Employee Wellness", description="Wellness resources and employee support programs.", status="Active"),
            ])
        if db.query(Document).count() == 0:
            db.add_all([
                Document(title="Employee Handbook.pdf", category="HR Policy", description="Starter employee handbook reference.", visibility="HR", status="Available"),
                Document(title="Leave & Attendance Policy.pdf", category="Policy", description="Leave, attendance and regularization guidelines.", visibility="HR", status="Available"),
                Document(title="Code of Conduct.pdf", category="Policy", description="Workplace conduct and professional behaviour guidelines.", visibility="HR", status="Available"),
            ])
        db.commit()

        # Repair onboarding for employees that were created before this version.
        for employee in db.query(Employee).all():
            onboarding = db.query(Onboarding).filter(Onboarding.employee_id == employee.id).first()
            if not onboarding:
                onboarding = Onboarding(employee_id=employee.id, progress=0, status="Not Started")
                db.add(onboarding)
                db.flush()
                for title, category in [
                    ("Candidate & offer", "Pre-joining"),
                    ("Employee record", "HR"),
                    ("Documents", "Documents"),
                    ("Background verification", "Verification"),
                    ("IT access", "IT"),
                    ("HR orientation", "Orientation"),
                    ("Manager & training", "Training"),
                    ("Completion", "Completion"),
                ]:
                    db.add(OnboardingTask(onboarding_id=onboarding.id, title=title, category=category, completed=False))
        db.commit()
    finally:
        db.close()


app = FastAPI(title="AzentMart People Operations API",version="4.0.0")
os.makedirs(os.getenv("UPLOAD_DIR","./uploads"),exist_ok=True)

try:
    if os.getenv("ENABLE_PGVECTOR", "false").lower() == "true":
        try:
            with engine.begin() as conn:
                conn.exec_driver_sql("CREATE EXTENSION IF NOT EXISTS vector")
        except Exception as rag_exc:
            print(f"RAG vector extension unavailable; lexical fallback remains active: {rag_exc}")
    Base.metadata.create_all(bind=engine,tables=[t for t in Base.metadata.sorted_tables if t.name != "knowledge_chunks"])
    ensure_schema_columns()
    if os.getenv("ENABLE_PGVECTOR", "false").lower() == "true":
        try:
            KnowledgeChunk.__table__.create(bind=engine, checkfirst=True)
        except Exception as rag_exc:
            print(f"RAG vector table unavailable; lexical fallback remains active: {rag_exc}")
    seed_database()
    seed_default_hr_content()
    if os.getenv("ENABLE_PGVECTOR", "false").lower() == "true" and os.getenv("OPENAI_API_KEY"):
        db=SessionLocal()
        try:
            for model,kind in [(Policy,"policy"),(Document,"document"),(Benefit,"benefit")]:
                for row in db.query(model).all():
                    content=(getattr(row,"description",None) or getattr(row,"title","")).strip()
                    if content: ingest(db,kind,getattr(row,"title",kind),content,row.id)
        except Exception as rag_ingest_exc:
            db.rollback(); print(f"RAG ingestion warning: {rag_ingest_exc}")
        finally: db.close()
except Exception as exc:
    print(f"Database initialization warning: {exc}")

origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGIN",
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

routers = [
    auth.router,
    users.router,
    employees.router,
    onboarding.router,
    attendance.router,
    leave.router,
    documents.router,
    policies.router,
    benefits.router,
    payroll.router,
    support.router,
    mcp.router,
    reports.router,
    search.router,
    ai_agent.router,
    payroll.ai_router
]

for router in routers:
    app.include_router(
        router,
        prefix="/api"
    )


@app.get("/")
def root():
    return {
        "name": "AzentMart People Operations API",
        "status": "ok",
        "version": "4.0.0"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }
