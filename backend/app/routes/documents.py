import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentScrapeRequest, DocumentManualRequest, DocumentRenameRequest, DocumentResponse
from app.services.scraper_service import scrape_website_content

router = APIRouter(prefix="/api/documents", tags=["Documents"])

UPLOAD_DIR = "uploads/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/user/{user_id}", response_model=List[DocumentResponse])
def get_user_documents(
    user_id: int, 
    source_type: Optional[str] = Query("all"), 
    search: Optional[str] = Query(""), 
    db: Session = Depends(get_db)
):
    query = db.query(Document).filter(Document.user_id == user_id)
    if source_type and source_type != "all":
        query = query.filter(Document.source_type == source_type)
    if search:
        search_term = f"%{search}%"
        query = query.filter(Document.title.ilike(search_term))
    return query.order_by(Document.created_at.desc()).all()

@router.post("/upload", response_model=DocumentResponse)
def upload_document(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    title_clean = os.path.splitext(file.filename)[0]
    new_doc = Document(
        user_id=user_id,
        title=title_clean,
        source_type="uploaded",
        file_path=file_location,
        file_name=file.filename,
        content=f"Uploaded document file: {file.filename}"
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.post("/scrape", response_model=DocumentResponse)
def scrape_document(data: DocumentScrapeRequest, db: Session = Depends(get_db)):
    try:
        scraped_data = scrape_website_content(data.url)
        new_doc = Document(
            user_id=data.user_id,
            title=scraped_data["title"],
            source_type="scraped",
            content=scraped_data["content"],
            original_url=data.url
        )
        db.add(new_doc)
        db.commit()
        db.refresh(new_doc)
        return new_doc
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/manual", response_model=DocumentResponse)
def create_manual_document(data: DocumentManualRequest, db: Session = Depends(get_db)):
    new_doc = Document(
        user_id=data.user_id,
        title=data.title,
        source_type="manual",
        content=data.content
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.put("/{doc_id}", response_model=DocumentResponse)
def rename_document(doc_id: int, data: DocumentRenameRequest, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.title = data.title
    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.file_path and os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}

@router.get("/{doc_id}/download")
def download_document(
    doc_id: int, 
    download: bool = Query(False), 
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc or not doc.file_path or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
        
    filename = doc.file_name or "document.pdf"
    disposition = "attachment" if download else "inline"
    
    return FileResponse(
        path=doc.file_path, 
        filename=filename, 
        content_disposition_type=disposition
    )