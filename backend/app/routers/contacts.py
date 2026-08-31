import csv
import io

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import get_current_user
from ..models.models import Contact
from ..schemas.common import ContactIn

router = APIRouter(prefix="/api/contacts", tags=["Contacts"])


def out(x: Contact) -> dict:
    return {
        "id": x.id,
        "user_id": x.user_id,
        "name": x.name,
        "segment": x.segment,
        "email": x.email,
        "phone": x.phone,
        "extension": x.extension,
        "job_title": x.job_title,
        "jobTitle": x.job_title,
        "lifecycle": x.lifecycle,
        "status": x.status,
        "language": x.language,
        "source": x.source,
        "active": x.active,
        "last_call": x.last_call,
        "created_at": x.created_at,
    }


@router.get("/")
def list_contacts(db: Session = Depends(get_db), user=Depends(get_current_user)):
    rows = db.query(Contact).filter(Contact.user_id == user.id).order_by(Contact.id.desc()).all()
    return [out(x) for x in rows]


@router.post("/", status_code=201)
def create_contact(data: ContactIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    contact = Contact(**data.model_dump(), user_id=user.id)
    db.add(contact); db.commit(); db.refresh(contact)
    return out(contact)


@router.post("/import", status_code=201)
async def import_contacts(file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(get_current_user)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(400, "Please upload a CSV file")
    raw = await file.read()
    try:
        text = raw.decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(text))
    except Exception as exc:
        raise HTTPException(400, f"Invalid CSV file: {exc}")

    created = []
    for row in reader:
        name = (row.get("name") or row.get("Name") or "").strip()
        phone = (row.get("phone") or row.get("Phone") or row.get("phone_number") or "").strip()
        if not name or not phone:
            continue
        contact = Contact(
            user_id=user.id,
            name=name,
            phone=phone,
            email=(row.get("email") or row.get("Email") or "").strip(),
            segment=(row.get("segment") or row.get("Segment") or "").strip(),
            job_title=(row.get("job_title") or row.get("jobTitle") or "").strip(),
            lifecycle=(row.get("lifecycle") or "Lead").strip(),
            status=(row.get("status") or "New").strip(),
            language=(row.get("language") or "English").strip(),
            source="CSV Import",
        )
        db.add(contact)
        created.append(contact)
    db.commit()
    for contact in created:
        db.refresh(contact)
    return {"message": "Contacts imported", "count": len(created), "contacts": [out(x) for x in created]}


@router.get("/{id}")
def get_contact(id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    contact = db.query(Contact).filter(Contact.id == id, Contact.user_id == user.id).first()
    if not contact: raise HTTPException(404, "Contact not found")
    return out(contact)


@router.put("/{id}")
def update_contact(id: int, data: ContactIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    contact = db.query(Contact).filter(Contact.id == id, Contact.user_id == user.id).first()
    if not contact: raise HTTPException(404, "Contact not found")
    for key, value in data.model_dump().items(): setattr(contact, key, value)
    db.commit(); db.refresh(contact)
    return out(contact)


@router.delete("/{id}")
def delete_contact(id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    contact = db.query(Contact).filter(Contact.id == id, Contact.user_id == user.id).first()
    if not contact: raise HTTPException(404, "Contact not found")
    db.delete(contact); db.commit()
    return {"message": "Contact deleted"}
