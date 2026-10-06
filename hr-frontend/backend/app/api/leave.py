from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import current_user, require_roles
from ..models import Employee, Leave

router = APIRouter(prefix="/leave", tags=["Leave"])

@router.get("")
def list_leave(status: str | None = None, db: Session = Depends(get_db), user=Depends(current_user)):
    q = db.query(Leave)
    if status:
        q = q.filter(Leave.status == status)
    employees = {e.id: e.name for e in db.query(Employee).all()}
    return [
        {
            "id": x.id,
            "employee_id": x.employee_id,
            "name": employees.get(x.employee_id, "Employee"),
            "leave_type": x.leave_type,
            "start_date": str(x.start_date),
            "end_date": str(x.end_date),
            "reason": x.reason,
            "status": x.status,
        }
        for x in q.order_by(Leave.id.desc()).all()
    ]

@router.post("")
def apply_leave(payload: dict, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    from datetime import date
    employee_id = int(payload.get("employee_id", 0))
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(404, "Employee not found")

    start_date = date.fromisoformat(str(payload.get("start_date")))
    end_date = date.fromisoformat(str(payload.get("end_date")))
    if end_date < start_date:
        raise HTTPException(400, "End date cannot be before start date")

    leave = Leave(
        employee_id=employee.id,
        leave_type=str(payload.get("leave_type") or "Casual Leave"),
        start_date=start_date,
        end_date=end_date,
        reason=payload.get("reason"),
        status="Pending",
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return {"id": leave.id, "message": "Leave request submitted"}

@router.patch("/{leave_id}")
def update_leave(leave_id: int, payload: dict, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    leave = db.get(Leave, leave_id)
    if not leave:
        raise HTTPException(404, "Leave request not found")
    next_status = payload.get("status")
    if next_status not in {"Pending", "Approved", "Rejected", "Cancelled"}:
        raise HTTPException(400, "Invalid leave status")
    leave.status = next_status
    db.commit()
    return {"id": leave.id, "status": leave.status}
