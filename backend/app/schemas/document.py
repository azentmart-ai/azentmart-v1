from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentScrapeRequest(BaseModel):
    user_id: int
    url: str

class DocumentManualRequest(BaseModel):
    user_id: int
    title: str
    content: str

class DocumentRenameRequest(BaseModel):
    title: str

class DocumentResponse(BaseModel):
    id: int
    user_id: int
    title: str
    source_type: str
    content: Optional[str] = None
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    original_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True