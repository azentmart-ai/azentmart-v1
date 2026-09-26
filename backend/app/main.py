from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine, settings
from .routers import auth, users, jobs, candidates, pipeline, campaigns, analytics, ai

Base.metadata.create_all(bind=engine)
app=FastAPI(title="AzentMartAI Recruiting Agent API",version="2.0.0")
origins=[x.strip() for x in settings.frontend_origin.split(",") if x.strip()]
app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
app.include_router(auth.router,prefix="/api")
app.include_router(users.router,prefix="/api")
app.include_router(jobs.router,prefix="/api")
app.include_router(candidates.router,prefix="/api")
app.include_router(pipeline.router,prefix="/api")
app.include_router(campaigns.router,prefix="/api")
app.include_router(analytics.router,prefix="/api")
app.include_router(ai.router,prefix="/api")

@app.get("/")
def root(): return {"name":"AzentMartAI Recruiting Agent API","status":"ok"}
@app.get("/api/health")
def health(): return {"status":"healthy","database":"postgresql"}
