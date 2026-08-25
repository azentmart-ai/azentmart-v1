import os
from typing import List, Optional

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
from app.models.document import Document

from app.schemas.document import (
    DocumentResponse,
    DocumentManualCreate,
    DocumentScrapeCreate
)


router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"]
)


# =====================================================
# GET ALL DOCUMENTS FOR A USER
# =====================================================

@router.get("/user/{user_id}", response_model=List[DocumentResponse])
def get_user_documents(
    user_id: int,
    source_type: Optional[str] = "all",
    search: Optional[str] = "",
    db: Session = Depends(get_db)
):

    query = db.query(Document).filter(
        Document.user_id == user_id
    )

    if source_type and source_type != "all":
        query = query.filter(
            Document.source_type == source_type
        )

    if search:
        query = query.filter(
            Document.title.ilike(f"%{search}%")
        )

    documents = query.order_by(
        Document.created_at.desc()
    ).all()

    return documents


# =====================================================
# UPLOAD DOCUMENT
# =====================================================

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    os.makedirs("uploads", exist_ok=True)
    
    file_location = f"uploads/{file.filename}"

    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())

    new_doc = Document(
        user_id=user_id,
        title=file.filename,
        source_type="uploaded",
        file_name=file.filename,
        file_path=file_location
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc


# =====================================================
# SCRAPE DOCUMENT FROM URL
# =====================================================

@router.post("/scrape", response_model=DocumentResponse)
def scrape_document(
    data: DocumentScrapeCreate,
    db: Session = Depends(get_db)
):

    # TODO: Add Beautifulsoup/Scrapy logic here later
    extracted_text = "Scraped content will appear here"

    new_doc = Document(
        user_id=data.user_id,
        title=data.url,
        source_type="scraped",
        content=extracted_text,
        original_url=data.url
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc


# =====================================================
# CREATE DOCUMENT MANUALLY
# =====================================================

@router.post("/manual", response_model=DocumentResponse)
def create_manual_document(
    data: DocumentManualCreate,
    db: Session = Depends(get_db)
):

    new_doc = Document(
        user_id=data.user_id,
        title=data.title,
        content=data.content,
        source_type="manual"
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc