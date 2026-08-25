from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import Base, engine

# =========================================================
# IMPORT MODELS
# =========================================================
# Import models before create_all() so SQLAlchemy knows
# about all database tables.
from .models import models


# =========================================================
# ROUTERS
# =========================================================
from .routers import (
    auth,
    dashboard,
    assistants,
    contacts,
    segments,
    campaigns,
    dialers,
    logs,
    knowledge,
    live_voice,
    chat,
    billing,
    razorpay,
)

from .routers.demo_request import (
    router as demo_requests_router,
)

from .routers.bolna import (
    router as bolna_router,
)


# =========================================================
# DATABASE
# =========================================================
# Create tables that do not already exist.
Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APPLICATION
# =========================================================
app = FastAPI(
    title=settings.app_name,
    version="2.0.0",
    description="AzentMart multilingual AI voice-agent backend",
)


# =========================================================
# CORS
# =========================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# API ROUTERS
# =========================================================

# ---------------------------------------------------------
# Authentication
# ---------------------------------------------------------
app.include_router(auth.router)


# ---------------------------------------------------------
# Dashboard
# ---------------------------------------------------------
app.include_router(dashboard.router)


# ---------------------------------------------------------
# Assistants
# ---------------------------------------------------------
app.include_router(assistants.router)


# ---------------------------------------------------------
# Contacts
# ---------------------------------------------------------
app.include_router(contacts.router)


# ---------------------------------------------------------
# Segments
# ---------------------------------------------------------
app.include_router(segments.router)


# ---------------------------------------------------------
# Campaigns
# ---------------------------------------------------------
app.include_router(campaigns.router)


# ---------------------------------------------------------
# Dialers
# ---------------------------------------------------------
app.include_router(dialers.router)


# ---------------------------------------------------------
# Call Logs
# ---------------------------------------------------------
app.include_router(logs.router)


# ---------------------------------------------------------
# Knowledge Base
# ---------------------------------------------------------
app.include_router(knowledge.router)


# ---------------------------------------------------------
# Browser Live Voice
# ---------------------------------------------------------
app.include_router(live_voice.router)


# ---------------------------------------------------------
# AI Chat
# ---------------------------------------------------------
app.include_router(chat.router)


# ---------------------------------------------------------
# Billing & Credits
# ---------------------------------------------------------

app.include_router(billing.router)


# ---------------------------------------------------------
# Razorpay
# ---------------------------------------------------------

app.include_router(razorpay.router)


# ---------------------------------------------------------
# Demo Requests
# ---------------------------------------------------------

app.include_router(demo_requests_router)

# ---------------------------------------------------------
# BOLNA AI VOICE
# ---------------------------------------------------------
app.include_router(bolna_router)


# =========================================================
# ROOT
# =========================================================
@app.get("/")
def root():
    return {
        "name": settings.app_name,
        "status": "running",
        "docs": "/docs",
    }


# =========================================================
# HEALTH CHECK
# =========================================================
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "database": "connected",

        # -------------------------------------------------
        # AI SERVICES
        # -------------------------------------------------
        "gemini_configured": bool(
            settings.gemini_api_key
        ),

        "sarvam_configured": bool(
            settings.sarvam_api_key
        ),

        # -------------------------------------------------
        # BOLNA
        # -------------------------------------------------
        "bolna_configured": bool(
            settings.bolna_api_key
        ),

        "bolna_base_url": (
            settings.bolna_base_url
        ),

        # -------------------------------------------------
        # GEMINI LIVE
        # -------------------------------------------------
        "live_voice_model": (
            settings.gemini_live_model
        ),
    }