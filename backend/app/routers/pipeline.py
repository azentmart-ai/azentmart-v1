import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Application, Candidate, Job, Interview, Activity, User
from ..schemas import MoveStage, ScheduleRequest, InterviewStartRequest, InterviewAnswerRequest, InterviewFinishRequest
from ..security import get_current_user
from ..services.ai import interview_questions, evaluate_interview

router=APIRouter(prefix="/pipeline",tags=["Pipeline"])
STAGES=["APPLIED","AI_SCREENING","SHORTLISTED","INTERVIEW","OFFER","HIRED","REJECTED"]

@router.get("")
def pipeline(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    rows=[]
    for a in db.query(Application).order_by(Application.updated_at.desc()).all():
        j=db.get(Job,a.job_id); c=db.get(Candidate,a.candidate_id)
        if not j or j.creator_id!=user.id or not c: continue
        rows.append({"id":a.id,"candidate_id":c.id,"candidate_name":f"{c.first_name} {c.last_name}".strip(),"job_id":j.id,"job_title":j.title,"stage":a.stage,"score":a.ai_match_score,"skills":c.skills or []})
    return rows

@router.patch("/move-stage")
def move_stage(p:MoveStage,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    if p.stage not in STAGES: raise HTTPException(400,"Invalid stage")
    a=db.get(Application,p.application_id)
    if not a: raise HTTPException(404,"Application not found")
    j=db.get(Job,a.job_id)
    if not j or j.creator_id!=user.id: raise HTTPException(403,"Not allowed")
    c=db.get(Candidate,a.candidate_id)
    a.stage=p.stage
    db.add(Activity(id=str(uuid.uuid4()),user_id=user.id,candidate_id=c.id,job_id=j.id,type="STAGE_CHANGED",message=f"{c.first_name} moved to {p.stage.replace('_',' ').title()} for {j.title}"))
    db.commit()
    return {"ok":True,"application_id":a.id,"stage":a.stage}

@router.get("/interviews")
def interviews(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    rows=[]
    for i in db.query(Interview).order_by(Interview.scheduled_at.asc()).all():
        a=db.get(Application,i.application_id)
        if not a: continue
        j=db.get(Job,a.job_id); c=db.get(Candidate,a.candidate_id)
        if not j or j.creator_id!=user.id or not c: continue
        rows.append({"id":i.id,"application_id":a.id,"candidate_id":c.id,"candidate_name":f"{c.first_name} {c.last_name}".strip(),"job_title":j.title,"scheduled_at":i.scheduled_at,"status":i.status,"score":i.evaluation_score,"feedback":i.feedback})
    return rows

@router.post("/interview/start")
def start_interview(p:InterviewStartRequest,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    a=db.get(Application,p.application_id)
    if not a: raise HTTPException(404,"Application not found")
    j=db.get(Job,a.job_id); c=db.get(Candidate,a.candidate_id)
    if not j or j.creator_id!=user.id or not c: raise HTTPException(403,"Not allowed")
    i=db.query(Interview).filter(Interview.application_id==a.id).order_by(Interview.scheduled_at.desc()).first()
    if not i:
        i=Interview(id=str(uuid.uuid4()),application_id=a.id,interviewer_id=user.id,is_ai_conducted=True,scheduled_at=datetime.utcnow(),status="IN_PROGRESS")
        db.add(i)
    i.status="IN_PROGRESS"
    job={"title":j.title,"skills":j.skills_required or [],"requirements":j.requirements or [],"description":j.description}
    cand={"name":f"{c.first_name} {c.last_name}".strip(),"skills":c.skills or [],"experience":c.total_experience,"resume":c.parsed_resume}
    result=interview_questions(job,cand,6)
    i.questions=result.get("questions",[])
    a.stage="INTERVIEW"
    db.add(Activity(id=str(uuid.uuid4()),user_id=user.id,candidate_id=c.id,job_id=j.id,type="INTERVIEW_STARTED",message=f"AI interview started for {c.first_name}"))
    db.commit(); db.refresh(i)
    return {"interview_id":i.id,"questions":i.questions}

@router.post("/interview/answer")
def answer(p:InterviewAnswerRequest,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    i=db.get(Interview,p.interview_id)
    if not i: raise HTTPException(404,"Interview not found")
    i.transcript=(i.transcript or [])+[{"question":p.question,"answer":p.answer,"category":p.category}]
    db.commit(); return {"ok":True,"answers":len(i.transcript)}

@router.post("/interview/finish")
def finish(p:InterviewFinishRequest,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    i=db.get(Interview,p.interview_id)
    if not i: raise HTTPException(404,"Interview not found")
    a=db.get(Application,i.application_id); j=db.get(Job,a.job_id); c=db.get(Candidate,a.candidate_id)
    job={"title":j.title,"skills":j.skills_required or [],"requirements":j.requirements or [],"description":j.description}
    cand={"name":f"{c.first_name} {c.last_name}".strip(),"skills":c.skills or [],"experience":c.total_experience,"resume":c.parsed_resume}
    result=evaluate_interview(job,cand,i.transcript or [])
    i.evaluation_score=result.get("score"); i.feedback=result.get("summary",""); i.completed_at=datetime.utcnow(); i.status="COMPLETED"
    db.add(Activity(id=str(uuid.uuid4()),user_id=user.id,candidate_id=c.id,job_id=j.id,type="INTERVIEW_COMPLETED",message=f"AI interview completed for {c.first_name}"))
    db.commit()
    return result
