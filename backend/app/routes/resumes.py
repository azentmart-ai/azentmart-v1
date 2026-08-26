import os
import shutil
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeRename, ResumeResponse
from app.services.pdf_service import parse_pdf_resume

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/user/{user_id}", response_model=List[ResumeResponse])
def get_user_resumes(user_id: int, db: Session = Depends(get_db)):
    return db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.created_at.desc()).all()

@router.post("/", response_model=ResumeResponse)
def create_resume(data: ResumeCreate, db: Session = Depends(get_db)):
    new_resume = Resume(**data.dict())
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume

@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(resume_id: int, data: ResumeUpdate, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(resume, key, value)
        
    db.commit()
    db.refresh(resume)
    return resume

@router.post("/upload", response_model=dict)
def upload_resume_file(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    title_clean = os.path.splitext(file.filename)[0]
    
    # Parse PDF text to populate form summary automatically
    parsed_data = parse_pdf_resume(file_location)

    new_resume = Resume(
        user_id=user_id,
        title=title_clean,
        file_path=file_location,
        file_name=file.filename,
        summary=parsed_data.get("summary")
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    
    return {
        "resume_id": new_resume.id, 
        "filename": file.filename,
        "summary": new_resume.summary
    }

@router.put("/{resume_id}/rename", response_model=ResumeResponse)
def rename_resume(resume_id: int, data: ResumeRename, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume.title = data.title
    db.commit()
    db.refresh(resume)
    return resume

@router.delete("/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    if resume.file_path and os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except Exception:
            pass
            
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}

@router.get("/{resume_id}/download")
def download_resume(
    resume_id: int, 
    download: bool = Query(False), 
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume or not resume.file_path or not os.path.exists(resume.file_path):
        raise HTTPException(status_code=404, detail="PDF file not found on server")
    
    filename = resume.file_name or "resume.pdf"
    disposition = "attachment" if download else "inline"
    
    return FileResponse(
        path=resume.file_path, 
        filename=filename, 
        content_disposition_type=disposition
    )

    @router.post("/upload", response_model=dict)
    def upload_resume_file(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
    ):
     file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    title_clean = os.path.splitext(file.filename)[0]
    
    # Parse PDF contents
    parsed_data = parse_pdf_resume(file_location)

    new_resume = Resume(
        user_id=user_id,
        title=title_clean,
        file_path=file_location,
        file_name=file.filename,
        summary=parsed_data.get("summary"),
        email=parsed_data.get("email"),
        phone=parsed_data.get("phone")
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    
    return {
        "resume_id": new_resume.id, 
        "filename": file.filename,
        "summary": new_resume.summary,
        "email": new_resume.email,
        "phone": new_resume.phone
    }