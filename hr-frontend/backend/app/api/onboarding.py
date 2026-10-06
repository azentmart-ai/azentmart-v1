from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import current_user, require_roles
from ..models import Employee, Onboarding, OnboardingTask

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

DEFAULT_TASKS = [
    ("Candidate & offer", "Confirm offer, joining date and pre-joining information", "Pre-joining"),
    ("Employee record", "Create and verify the employee master record", "HR"),
    ("Documents", "Collect and verify required employee documents", "Documents"),
    ("Background verification", "Complete background verification", "Verification"),
    ("IT access", "Provision required systems and access", "IT"),
    ("HR orientation", "Complete HR policies and orientation", "Orientation"),
    ("Manager introduction", "Introduce the employee to the reporting manager", "Manager"),
    ("Training", "Assign and complete initial training", "Training"),
    ("Final review", "Complete HR review and close onboarding", "Completion"),
]

class OnboardingCreate(BaseModel):
    employee_id: int
    details: dict | None = None

class OnboardingDetails(BaseModel):
    details: dict

class TaskUpdate(BaseModel):
    completed: bool


def ensure_tasks(db: Session, onboarding: Onboarding):
    tasks = db.query(OnboardingTask).filter(OnboardingTask.onboarding_id == onboarding.id).order_by(OnboardingTask.id).all()
    if tasks:
        return tasks
    for title, description, category in DEFAULT_TASKS:
        db.add(OnboardingTask(onboarding_id=onboarding.id, title=title, description=description, category=category, completed=False))
    db.flush()
    return db.query(OnboardingTask).filter(OnboardingTask.onboarding_id == onboarding.id).order_by(OnboardingTask.id).all()


def recalculate(db: Session, onboarding: Onboarding):
    tasks = db.query(OnboardingTask).filter(OnboardingTask.onboarding_id == onboarding.id).all()
    total = len(tasks)
    completed = sum(1 for t in tasks if t.completed)
    onboarding.progress = round((completed / total) * 100) if total else 0
    onboarding.status = "Completed" if total and completed == total else ("In Progress" if completed else "Not Started")
    return tasks


def serialize(db: Session, row: Onboarding):
    employee = db.get(Employee, row.employee_id)
    tasks = ensure_tasks(db, row)
    return {
        "id": row.id,
        "employee_id": row.employee_id,
        "employee": {
            "id": employee.id if employee else None,
            "employee_code": f"EMP-{employee.id:05d}" if employee else None,
            "name": employee.name if employee else "Employee",
            "email": employee.email if employee else None,
            "phone": employee.phone if employee else None,
            "department": employee.department if employee else None,
            "designation": employee.designation if employee else None,
            "location": employee.location if employee else None,
            "manager": employee.manager if employee else None,
            "employment_type": employee.employment_type if employee else None,
            "join_date": str(employee.join_date) if employee and employee.join_date else None,
        },
        "name": employee.name if employee else "Employee",
        "department": employee.department if employee else None,
        "joining_date": str(employee.join_date) if employee and employee.join_date else None,
        "progress": row.progress,
        "status": row.status,
        "details": row.details or {},
        "tasks": [{
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "category": t.category,
            "completed": t.completed,
        } for t in tasks],
    }


@router.get("")
def list_onboarding(db: Session = Depends(get_db), user=Depends(current_user)):
    rows = db.query(Onboarding).order_by(Onboarding.id.desc()).all()
    return [serialize(db, row) for row in rows]


@router.post("")
def create_onboarding(payload: OnboardingCreate, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    employee = db.get(Employee, payload.employee_id)
    if not employee:
        raise HTTPException(404, "Employee not found")
    existing = db.query(Onboarding).filter(Onboarding.employee_id == employee.id).first()
    if existing:
        if payload.details:
            existing.details = payload.details
        ensure_tasks(db, existing)
        db.commit()
        return serialize(db, existing)
    row = Onboarding(employee_id=employee.id, progress=0, status="Not Started", details=payload.details or {})
    db.add(row)
    db.flush()
    ensure_tasks(db, row)
    db.commit()
    db.refresh(row)
    return serialize(db, row)


@router.get("/employee/{employee_id}")
def get_employee_onboarding(employee_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    row = db.query(Onboarding).filter(Onboarding.employee_id == employee_id).first()
    if not row:
        raise HTTPException(404, "Onboarding journey not found")
    return serialize(db, row)


@router.patch("/{onboarding_id}/details")
def update_details(onboarding_id: int, payload: OnboardingDetails, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    row = db.get(Onboarding, onboarding_id)
    if not row:
        raise HTTPException(404, "Onboarding journey not found")
    row.details = payload.details
    db.commit()
    db.refresh(row)
    return serialize(db, row)


@router.patch("/tasks/{task_id}")
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    task = db.get(OnboardingTask, task_id)
    if not task:
        raise HTTPException(404, "Onboarding task not found")
    task.completed = payload.completed
    onboarding = db.get(Onboarding, task.onboarding_id)
    recalculate(db, onboarding)
    db.commit()
    db.refresh(onboarding)
    return serialize(db, onboarding)


@router.post("/{onboarding_id}/complete")
def complete_onboarding(onboarding_id: int, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    row = db.get(Onboarding, onboarding_id)
    if not row:
        raise HTTPException(404, "Onboarding journey not found")
    tasks = ensure_tasks(db, row)
    for task in tasks:
        task.completed = True
    recalculate(db, row)
    db.commit()
    return serialize(db, row)


@router.post("/ai/analyze")
def analyze_onboarding(payload: dict, db: Session = Depends(get_db), user=Depends(current_user)):
    employee_id = payload.get("employee_id")
    employee_name = payload.get("employee_name")
    query = db.query(Onboarding)
    row = None
    if employee_id:
        row = query.filter(Onboarding.employee_id == int(employee_id)).first()
    elif employee_name:
        row = query.join(Employee, Employee.id == Onboarding.employee_id).filter(Employee.name.ilike(f"%{employee_name}%")).first()
    else:
        row = query.order_by(Onboarding.id.desc()).first()
    if not row:
        return {"summary": "No onboarding journey was found.", "completion": 0, "completed": [], "pending": [], "recommendations": []}
    tasks = ensure_tasks(db, row)
    completed = [t.title for t in tasks if t.completed]
    pending = [t.title for t in tasks if not t.completed]
    return {
        "employee_id": row.employee_id,
        "summary": f"{row.progress}% complete with {len(pending)} pending task(s).",
        "completion": row.progress,
        "completed": completed,
        "pending": pending,
        "recommendations": [f"Complete {title}." for title in pending[:5]],
        "onboarding": serialize(db, row),
    }

@router.get("/{onboarding_id}")
def get_onboarding(onboarding_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    row = db.get(Onboarding, onboarding_id)
    if not row:
        raise HTTPException(404, "Onboarding journey not found")
    return serialize(db, row)

