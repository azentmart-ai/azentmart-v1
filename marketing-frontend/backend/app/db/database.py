from sqlalchemy import create_engine, text
from app.core.config import settings
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

def execute(sql, params=None):
    with engine.begin() as conn:
        return conn.execute(text(sql), params or {})

def fetchall(sql, params=None):
    with engine.begin() as conn:
        return conn.execute(text(sql), params or {}).mappings().all()
