from datetime import datetime
from sqlalchemy import DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from ..base import Base
class KnowledgeChunk(Base):
    __tablename__='knowledge_chunks'
    id:Mapped[int]=mapped_column(Integer,primary_key=True)
    source_type:Mapped[str]=mapped_column(String(50),nullable=False)
    source_id:Mapped[int|None]=mapped_column(Integer,nullable=True)
    title:Mapped[str]=mapped_column(String(250),nullable=False)
    content:Mapped[str]=mapped_column(Text,nullable=False)
    embedding:Mapped[list|None]=mapped_column(Vector(1536),nullable=True)
    created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow,nullable=False)
