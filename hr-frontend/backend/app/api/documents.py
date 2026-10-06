import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import current_user, require_roles
from ..models import Document, Employee

router = APIRouter(prefix="/documents", tags=["Documents"])

def upload_root():
    path = Path(os.getenv("UPLOAD_DIR", "./uploads")).resolve()
    path.mkdir(parents=True, exist_ok=True)
    return path

@router.get("")
def list_documents(db: Session = Depends(get_db), user=Depends(current_user)):
    rows = db.query(Document).order_by(Document.id.desc()).all()
    employees = {e.id: e.name for e in db.query(Employee).all()}
    return [
        {
            "id": x.id,
            "title": x.title,
            "description": x.description,
            "category": x.category,
            "status": x.status,
            "expiry_date": str(x.expires_at) if x.expires_at else None,
            "employee_id": x.employee_id,
            "employee": employees.get(x.employee_id, "Company"),
            "file_url": f"/api/documents/{x.id}/download" if x.file_url else None,
        }
        for x in rows
    ]

@router.get("/{document_id}")
def get_document(document_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    row = db.get(Document, document_id)
    if not row:
        raise HTTPException(404, "Document not found")
    return {
        "id": row.id,
        "title": row.title,
        "description": row.description,
        "category": row.category,
        "status": row.status,
        "expiry_date": str(row.expires_at) if row.expires_at else None,
        "employee_id": row.employee_id,
        "file_url": f"/api/documents/{row.id}/download" if row.file_url else None,
    }

@router.get("/{document_id}/download")
def download_document(document_id: int, db: Session = Depends(get_db), user=Depends(current_user)):
    row = db.get(Document, document_id)
    if not row or not row.file_url:
        raise HTTPException(404, "Document file not found")
    path = Path(row.file_url).resolve()
    if not path.exists() or upload_root() not in path.parents:
        raise HTTPException(404, "Document file not found")
    return FileResponse(path, filename=row.title)

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    employee_id: int | None = Form(None),
    category: str = Form("HR Document"),
    description: str | None = Form(None),
    db: Session = Depends(get_db),
    user=Depends(require_roles("hr_admin", "hr_manager", "admin")),
):
    if employee_id is not None and not db.get(Employee, employee_id):
        raise HTTPException(404, "Employee not found")

    filename = os.path.basename(file.filename or "document")
    safe = f"{uuid.uuid4().hex}_{filename}"
    path = upload_root() / safe
    with path.open("wb") as out:
        out.write(file.file.read())

    d = Document(
        employee_id=employee_id,
        title=filename,
        category=category,
        description=description,
        file_url=str(path),
        visibility="HR",
        status="Available",
    )
    db.add(d)
    db.commit()
    db.refresh(d)
    return {"id": d.id, "message": "Document uploaded", "file_url": f"/api/documents/{d.id}/download"}
