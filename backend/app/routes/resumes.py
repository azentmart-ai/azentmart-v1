import os
import shutil

from dotenv import load_dotenv
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.resume import Resume
from app.schemas.resume import (
    ResumeCreate,
    ResumeUpdate,
    ResumeResponse
)

UPLOAD_DIR = os.getenv(
    "UPLOAD_DIR",
    "uploads/resumes"
)

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)
router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"]
)
load_dotenv()




# =====================================================
# GET ALL RESUMES
# =====================================================

@router.get(
    "/",
    response_model=list[ResumeResponse]
)
def get_resumes(
    db: Session = Depends(get_db)
):

    return db.query(Resume).all()


# =====================================================
# GET USER RESUMES
# =====================================================

@router.get(
    "/user/{user_id}",
    response_model=list[ResumeResponse]
)
def get_user_resumes(
    user_id: int,
    db: Session = Depends(get_db)
):

    resumes = db.query(Resume).filter(
        Resume.user_id == user_id
    ).all()

    return resumes


# =====================================================
# GET SINGLE RESUME
# =====================================================

@router.get(
    "/{resume_id}",
    response_model=ResumeResponse
)
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return resume


# =====================================================
# CREATE RESUME
# =====================================================

@router.post(
    "/",
    response_model=ResumeResponse
)
def create_resume(
    resume_data: ResumeCreate,
    db: Session = Depends(get_db)
):

    resume = Resume(
        user_id=resume_data.user_id,

        title=resume_data.title,
        name=resume_data.name,
        email=resume_data.email,
        phone=resume_data.phone,
        linkedin=resume_data.linkedin,
        location=resume_data.location,

        summary=resume_data.summary,
        skills=resume_data.skills,
        experience=resume_data.experience,
        education=resume_data.education,
        certifications=resume_data.certifications,

        file_name=resume_data.file_name,
        file_path=resume_data.file_path,
        extracted_text=resume_data.extracted_text
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume


# =====================================================
# UPDATE RESUME
# =====================================================

@router.put(
    "/{resume_id}",
    response_model=ResumeResponse
)
def update_resume(
    resume_id: int,
    resume_data: ResumeUpdate,
    db: Session = Depends(get_db)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    update_data = resume_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            resume,
            key,
            value
        )

    db.commit()
    db.refresh(resume)

    return resume


# =====================================================
# UPLOAD RESUME FILE
# =====================================================

@router.post("/upload")
def upload_resume(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    allowed_extensions = {
        ".pdf",
        ".doc",
        ".docx"
    }

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC and DOCX files are allowed"
        )

    safe_filename = file.filename.replace(
        " ",
        "_"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        safe_filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    resume = Resume(
        user_id=user_id,
        file_name=file.filename,
        file_path=file_path
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": resume.id,
        "filename": file.filename,
        "file_path": file_path
    }


# =====================================================
# DELETE RESUME
# =====================================================

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    if resume.file_path and os.path.exists(
        resume.file_path
    ):
        os.remove(resume.file_path)

    db.delete(resume)
    db.commit()

    return {
        "message": "Resume deleted successfully"
    }