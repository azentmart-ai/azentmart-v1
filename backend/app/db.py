from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .config import settings


# =========================================================
# DATABASE ENGINE
# =========================================================

connect_args = {}

if settings.database_url.startswith("sqlite"):
    connect_args = {
        "check_same_thread": False
    }


engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    connect_args=connect_args,
)


# =========================================================
# SESSION
# =========================================================

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


# =========================================================
# BASE
# =========================================================

class Base(DeclarativeBase):
    pass


# =========================================================
# DATABASE DEPENDENCY
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()