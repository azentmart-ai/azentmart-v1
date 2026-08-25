from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine

# Import models so SQLAlchemy knows them
from app.models import User
from app.models import InterviewSession
from app.models import Resume
from app.models.document import Document


from app.routes.users import router as users_router
from app.routes.interviews import router as interviews_router
from app.routes.resumes import router as resumes_router
from app.routes.copilot import router as copilot_router
from app.routes.documents import router as documents_router




# =====================================================
# CREATE DATABASE TABLES
# =====================================================

Base.metadata.create_all(
    bind=engine
)


# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI(
    title="Azentmart Interview Copilot API",
    version="1.0.0"
)


# =====================================================
# CORS
# =====================================================

origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# ROUTES
# =====================================================

app.include_router(
    users_router
)

app.include_router(
    interviews_router
)

app.include_router(
    resumes_router
)

app.include_router(
    copilot_router
)

app.include_router(
    documents_router
)


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():

    return {
        "message": "Azentmart Interview Copilot API is running"
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }