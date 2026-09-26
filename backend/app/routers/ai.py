from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..security import get_current_user
from ..models import User, Candidate
from ..schemas import JDRequest, ChatRequest
from ..services.ai import generate_jd, candidate_chat

router=APIRouter(prefix="/ai",tags=["AI"])

@router.post("/generate-jd")
def generate_jd_route(p:JDRequest,user:User=Depends(get_current_user)):
    return {"data":generate_jd(p.title,p.seniority,p.skills,p.workplace_type,p.requirements,p.department),"mode":"llm_or_local_fallback"}

@router.post("/candidate-agent/chat")
def candidate_agent(p:ChatRequest,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    context={}
    if p.candidate_id:
        c=db.get(Candidate,p.candidate_id)
        if c: context={"candidate_id":c.id,"name":f"{c.first_name} {c.last_name}".strip(),"email":c.email,"skills":c.skills or [],"experience":c.total_experience,"resume":c.parsed_resume}
    return {"reply":candidate_chat(p.message,context),"mode":"llm_or_local_fallback"}
