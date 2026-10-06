from io import BytesIO, StringIO
from datetime import date
import csv
import os
import zipfile
import json
import urllib.request

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, Response
from sqlalchemy.orm import Session
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

from ..database import get_db
from ..dependencies import current_user, require_roles
from ..models import Employee, Payroll, Attendance, Leave
from ..knowledge import retrieve

router = APIRouter(prefix="/payroll", tags=["Payroll"])


def serialize(row, employee):
    return {
        "id": row.id,
        "employee_id": employee.id if employee else row.employee_id,
        "employee_code": f"EMP-{employee.id:05d}" if employee else None,
        "employee": employee.name if employee else "Employee",
        "email": employee.email if employee else None,
        "phone": employee.phone if employee else None,
        "role": employee.designation if employee else None,
        "designation": employee.designation if employee else None,
        "department": employee.department if employee else None,
        "location": employee.location if employee else None,
        "date_joined": str(employee.join_date) if employee and employee.join_date else None,
        "employment_type": employee.employment_type if employee else None,
        "manager": employee.manager if employee else None,
        "month": row.month,
        "gross_pay": row.gross_pay,
        "pf": row.pf,
        "tds": row.tds,
        "claims": row.claims,
        "professional_tax": getattr(row, "professional_tax", 0) or 0,
        "other_deductions": getattr(row, "other_deductions", 0) or 0,
        "net_pay": row.net_pay,
        "status": row.status,
    }


def build_payslip_pdf(payroll, employee):
    buffer = BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    title = ParagraphStyle("Title", parent=styles["Heading1"], fontSize=20, alignment=TA_CENTER, textColor=colors.HexColor("#0f172a"))
    sub = ParagraphStyle("Sub", parent=styles["Normal"], fontSize=9, alignment=TA_CENTER, textColor=colors.HexColor("#64748b"), spaceAfter=18)
    section = ParagraphStyle("Section", parent=styles["Heading2"], fontSize=11, textColor=colors.HexColor("#0f172a"), spaceBefore=5, spaceAfter=8)
    story = [Paragraph("AZENTMART", title), Paragraph("PEOPLE OPERATIONS · SALARY PAYSLIP", sub), Paragraph("Employee Information", section)]
    info = Table([
        ["Employee", employee.name or "-", "Employee ID", str(employee.id)],
        ["Email", employee.email or "-", "Department", employee.department or "-"],
        ["Designation", employee.designation or "-", "Location", employee.location or "-"],
        ["Joining Date", str(employee.join_date or "-"), "Employment", employee.employment_type or "-"],
    ], colWidths=[85,155,85,155])
    info.setStyle(TableStyle([("GRID", (0,0), (-1,-1), .4, colors.HexColor("#dbe3ec")), ("BACKGROUND", (0,0),(0,-1), colors.HexColor("#f8fafc")), ("BACKGROUND", (2,0),(2,-1), colors.HexColor("#f8fafc")), ("FONTNAME", (0,0),(0,-1),"Helvetica-Bold"), ("FONTNAME", (2,0),(2,-1),"Helvetica-Bold"), ("PADDING",(0,0),(-1,-1),7)]))
    story += [info, Spacer(1, 18), Paragraph(f"Payroll · {payroll.month}", section)]
    deductions = (payroll.pf or 0) + (payroll.tds or 0) + (getattr(payroll, "professional_tax", 0) or 0) + (getattr(payroll, "other_deductions", 0) or 0)
    table = Table([
        ["Component", "Amount"],
        ["Gross Pay", f"₹ {float(payroll.gross_pay or 0):,.2f}"],
        ["Claims / Reimbursements", f"₹ {float(payroll.claims or 0):,.2f}"],
        ["Provident Fund", f"₹ {float(payroll.pf or 0):,.2f}"],
        ["TDS", f"₹ {float(payroll.tds or 0):,.2f}"],
        ["Professional Tax", f"₹ {float(getattr(payroll, 'professional_tax', 0) or 0):,.2f}"],
        ["Other Deductions", f"₹ {float(getattr(payroll, 'other_deductions', 0) or 0):,.2f}"],
        ["Total Deductions", f"₹ {float(deductions):,.2f}"],
        ["NET PAY", f"₹ {float(payroll.net_pay or 0):,.2f}"],
    ], colWidths=[330,150])
    table.setStyle(TableStyle([("GRID",(0,0),(-1,-1),.4,colors.HexColor("#dbe3ec")), ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#eff6ff")), ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("ALIGN",(1,1),(1,-1),"RIGHT"), ("BACKGROUND",(0,-1),(-1,-1),colors.HexColor("#0f172a")), ("TEXTCOLOR",(0,-1),(-1,-1),colors.white), ("FONTNAME",(0,-1),(-1,-1),"Helvetica-Bold"), ("PADDING",(0,0),(-1,-1),7)]))
    story += [table, Spacer(1, 18), Paragraph(f"Status: {payroll.status}", sub)]
    document.build(story)
    buffer.seek(0)
    return buffer


@router.get("")
def list_payroll(month: str | None = None, db: Session = Depends(get_db), user=Depends(current_user)):
    query = db.query(Payroll).order_by(Payroll.id.desc())
    if month:
        query = query.filter(Payroll.month == month)
    rows = query.all()
    employees = {e.id: e for e in db.query(Employee).all()}
    return [serialize(row, employees.get(row.employee_id)) for row in rows]


@router.get("/summary")
def payroll_summary(month: str, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    rows = db.query(Payroll).filter(Payroll.month == month).all()
    return {"month": month, "employees": len(rows), "gross": sum(r.gross_pay or 0 for r in rows), "net": sum(r.net_pay or 0 for r in rows), "tds": sum(r.tds or 0 for r in rows), "pf": sum(r.pf or 0 for r in rows), "claims": sum(r.claims or 0 for r in rows)}


@router.post("/generate")
def generate_payroll(payload: dict, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    month = str(payload.get("month") or date.today().strftime("%Y-%m"))
    employees = db.query(Employee).filter(Employee.status == "Active").all()
    created = 0
    updated = 0
    for employee in employees:
        if employee.salary is None:
            continue
        existing = db.query(Payroll).filter(Payroll.employee_id == employee.id, Payroll.month == month).first()
        gross = round(float(employee.salary) / 12, 2)
        pf = round(gross * 0.12, 2)
        professional_tax = 200.0 if gross > 21000 else 0.0
        tds = 0.0
        claims = 0.0
        net = round(gross + claims - pf - tds - professional_tax, 2)
        if existing:
            if existing.status not in {"Approved", "Locked"}:
                existing.gross_pay, existing.pf, existing.tds, existing.claims = gross, pf, tds, claims
                existing.professional_tax, existing.other_deductions, existing.net_pay = professional_tax, 0.0, net
                updated += 1
            continue
        db.add(Payroll(employee_id=employee.id, month=month, gross_pay=gross, pf=pf, tds=tds, claims=claims, professional_tax=professional_tax, other_deductions=0, net_pay=net, status="Draft"))
        created += 1
    db.commit()
    return {"message": "Draft payroll generated", "month": month, "created": created, "updated": updated}


@router.patch("/{payroll_id}/approve")
def approve_payroll(payroll_id: int, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    row = db.get(Payroll, payroll_id)
    if not row: raise HTTPException(404, "Payroll record not found")
    if row.status == "Locked": raise HTTPException(409, "Payroll is already locked")
    row.status = "Approved"
    db.commit()
    return {"id": row.id, "status": row.status}


@router.patch("/{payroll_id}/lock")
def lock_payroll(payroll_id: int, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "admin"))):
    row = db.get(Payroll, payroll_id)
    if not row: raise HTTPException(404, "Payroll record not found")
    row.status = "Locked"
    db.commit()
    return {"id": row.id, "status": row.status}


@router.patch("/{payroll_id}/approve-lock")
def approve_lock_payroll(payroll_id: int, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    row = db.get(Payroll, payroll_id)
    if not row: raise HTTPException(404, "Payroll record not found")
    row.status = "Locked"
    db.commit()
    return {"id": row.id, "status": row.status}


@router.get("/{payroll_id}/payslip")
def download_payslip(payroll_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    payroll = db.get(Payroll, payroll_id)
    if not payroll: raise HTTPException(404, "Payroll record not found")
    employee = db.get(Employee, payroll.employee_id)
    if not employee: raise HTTPException(404, "Employee not found")
    buffer = build_payslip_pdf(payroll, employee)
    filename = f"{employee.name.replace(' ', '_')}_{payroll.month}_Payslip.pdf"
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{filename}"'})


@router.get("/bank-file")
def bank_file(month: str, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    rows = db.query(Payroll).filter(Payroll.month == month).order_by(Payroll.id).all()
    out = StringIO()
    writer = csv.writer(out)
    writer.writerow(["Employee ID", "Employee Name", "Bank Name", "Account Number", "IFSC", "Amount", "Narration"])
    for row in rows:
        e = db.get(Employee, row.employee_id)
        if not e: continue
        writer.writerow([e.id, e.name, e.bank_name or "", e.bank_account or "", e.ifsc_code or "", f"{float(row.net_pay or 0):.2f}", f"Salary {month}"])
    return Response(content=out.getvalue(), media_type="text/csv", headers={"Content-Disposition": f'attachment; filename="Bank-NEFT-{month}.csv"'})


@router.get("/payslips.zip")
def payslips_zip(month: str, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    rows = db.query(Payroll).filter(Payroll.month == month).order_by(Payroll.id).all()
    archive = BytesIO()
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as z:
        for row in rows:
            e = db.get(Employee, row.employee_id)
            if not e: continue
            pdf = build_payslip_pdf(row, e).read()
            z.writestr(f"{e.name.replace(' ', '_')}_{month}_Payslip.pdf", pdf)
    archive.seek(0)
    return StreamingResponse(archive, media_type="application/zip", headers={"Content-Disposition": f'attachment; filename="Payslips-{month}.zip"'})


@router.get("/export")
def export_payroll(month: str, db: Session = Depends(get_db), user=Depends(require_roles("hr_admin", "hr_manager", "admin"))):
    rows = db.query(Payroll).filter(Payroll.month == month).order_by(Payroll.id).all()
    out = StringIO()
    writer = csv.writer(out)
    writer.writerow(["Employee ID","Employee","Email","Department","Gross","PF","TDS","Claims","Professional Tax","Other Deductions","Net Pay","Status","Month"])
    for row in rows:
        e = db.get(Employee, row.employee_id)
        writer.writerow([e.id if e else row.employee_id, e.name if e else "Employee", e.email if e else "", e.department if e else "", row.gross_pay, row.pf, row.tds, row.claims, getattr(row,"professional_tax",0), getattr(row,"other_deductions",0), row.net_pay, row.status, row.month])
    return Response(content=out.getvalue(), media_type="text/csv", headers={"Content-Disposition": f'attachment; filename="Payroll-{month}.csv"'})


@router.get("/{payroll_id}")
def get_payroll(payroll_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    row = db.get(Payroll, payroll_id)
    if not row: raise HTTPException(404, "Payroll record not found")
    employee = db.get(Employee, row.employee_id)
    return serialize(row, employee)


def _openai_answer(message, context):
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        return None
    body = json.dumps({"model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"), "messages": [
        {"role":"system","content":"You are AzentMart Payroll AI. Answer only from the supplied HR/payroll context. Never invent employee or salary facts. If context is insufficient, say so."},
        {"role":"user","content":f"Context:\n{context}\n\nQuestion:\n{message}"}
    ], "temperature": 0.1}).encode()
    req = urllib.request.Request("https://api.openai.com/v1/chat/completions", data=body, headers={"Authorization":f"Bearer {key}","Content-Type":"application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            data = json.loads(r.read())
            return data["choices"][0]["message"]["content"].strip()
    except Exception:
        return None


ai_router = APIRouter(prefix="/ai/payroll", tags=["Payroll AI"])

@ai_router.post("/chat")
def payroll_ai(payload: dict, db: Session = Depends(get_db), user=Depends(current_user)):
    message = str(payload.get("message") or "").strip()
    month = payload.get("month")
    employee_id = payload.get("employee_id")
    if not message: raise HTTPException(400, "AI question is required")
    context_parts = []
    if employee_id:
        row = db.get(Payroll, int(employee_id))
        if row:
            e = db.get(Employee, row.employee_id)
            context_parts.append(json.dumps(serialize(row,e)))
    if month:
        rows = db.query(Payroll).filter(Payroll.month == str(month)).all()
        for row in rows[:50]:
            e = db.get(Employee, row.employee_id)
            context_parts.append(json.dumps(serialize(row,e)))
    for r in retrieve(db, message, 5):
        context_parts.append(f"Knowledge: {r.title}: {r.content}")
    if not context_parts:
        context_parts.append("No matching payroll records or approved knowledge were found.")
    context = "\n".join(context_parts)
    answer = _openai_answer(message, context)
    if not answer:
        lower = message.lower()
        if "summary" in lower or "total" in lower:
            rows = db.query(Payroll).filter(Payroll.month == str(month)).all() if month else db.query(Payroll).all()
            answer = f"I found {len(rows)} payroll record(s). Gross ₹{sum(r.gross_pay or 0 for r in rows):,.2f}, net ₹{sum(r.net_pay or 0 for r in rows):,.2f}, TDS ₹{sum(r.tds or 0 for r in rows):,.2f}."
        else:
            answer = "I can answer from the payroll records and approved HR knowledge available to your account. An LLM key is not configured, so I returned only grounded system information."
    return {"answer": answer, "sources": [{"title":"Payroll records","type":"database"}] if context_parts else [], "grounded": True}
