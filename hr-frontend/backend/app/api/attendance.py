from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import current_user, require_roles
from ..models import Attendance, AttendanceRegularization, Employee

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.get("")
def list_attendance(status: str | None = None, date_filter: date | None = None, db: Session = Depends(get_db), user=Depends(current_user)):
    q = db.query(Attendance)
    if status:
        q = q.filter(Attendance.status == status)
    if date_filter:
        q = q.filter(Attendance.work_date == date_filter)
    names = {e.id: e.name for e in db.query(Employee).all()}
    return [
        {
            "id": x.id,
            "employee_id": x.employee_id,
            "name": names.get(x.employee_id, "Employee"),
            "date": str(x.work_date),
            "check_in": x.check_in,
            "check_out": x.check_out,
            "breaks": x.break_minutes,
            "working_hours": x.working_hours,
            "overtime": x.overtime_hours,
            "status": x.status,
            "remarks": x.remarks,
        }
        for x in q.order_by(Attendance.work_date.desc(), Attendance.id.desc()).limit(1000).all()
    ]

@router.post("")
def mark_attendance(payload: dict, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    required = ["employee_id", "work_date", "status"]
    if any(payload.get(k) in (None, "") for k in required):
        raise HTTPException(400, "employee_id, work_date and status are required")

    work_date = date.fromisoformat(str(payload["work_date"]))
    existing = db.query(Attendance).filter(
        Attendance.employee_id == int(payload["employee_id"]),
        Attendance.work_date == work_date,
    ).first()

    values = {
        "check_in": payload.get("check_in") or None,
        "check_out": payload.get("check_out") or None,
        "break_minutes": int(payload.get("break_minutes", 0) or 0),
        "working_hours": float(payload["working_hours"]) if payload.get("working_hours") not in (None, "") else None,
        "overtime_hours": float(payload.get("overtime_hours", 0) or 0),
        "status": payload["status"],
        "remarks": payload.get("remarks") or None,
        "source": "hr",
    }

    if existing:
        for key, value in values.items():
            setattr(existing, key, value)
        row = existing
    else:
        row = Attendance(employee_id=int(payload["employee_id"]), work_date=work_date, **values)
        db.add(row)

    db.commit()
    db.refresh(row)
    return {"id": row.id, "message": "Attendance saved"}

@router.post("/regularization")
def regularization(payload: dict, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    employee_id = int(payload.get("employee_id", 0))
    if not db.get(Employee, employee_id):
        raise HTTPException(404, "Employee not found")
    reason = str(payload.get("reason", "")).strip()
    if not reason:
        raise HTTPException(400, "Reason is required")
    row = AttendanceRegularization(
        employee_id=employee_id,
        attendance_id=payload.get("attendance_id"),
        requested_check_in=payload.get("check_in"),
        requested_check_out=payload.get("check_out"),
        reason=reason,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"id": row.id, "message": "Attendance regularization request saved"}
