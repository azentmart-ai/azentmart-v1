import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..db import get_db
from ..models import User, Job, Candidate, Application, Interview, Activity, Campaign
from ..schemas import ProfileUpdate, SettingsUpdate
from ..security import get_current_user

router=APIRouter(prefix="/me",tags=["Profile"])

def out(u):
    return {"id":u.id,"name":u.name,"email":u.email,"phone":u.phone,"location":u.location,"role":u.role,"avatar_url":u.avatar_url,"notifications":u.notifications or {},"preferences":u.preferences or {}}

@router.get("")
def profile(user:User=Depends(get_current_user)): return out(user)

@router.patch("")
def update_profile(p:ProfileUpdate, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    email=p.email.lower().strip()
    other=db.query(User).filter(User.email==email, User.id!=user.id).first()
    if other: raise HTTPException(409,"That email is already in use")
    user.name=p.name.strip(); user.email=email; user.phone=p.phone; user.location=p.location
    db.add(Activity(id=str(uuid.uuid4()),user_id=user.id,type="PROFILE_UPDATED",message="Profile details were updated."))
    db.commit(); db.refresh(user); return out(user)

@router.get("/settings")
def get_settings(user:User=Depends(get_current_user)):
    return {"notifications":user.notifications or {},"preferences":user.preferences or {}}

@router.patch("/settings")
def update_settings(p:SettingsUpdate,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    if p.notifications is not None: user.notifications=p.notifications
    if p.preferences is not None: user.preferences=p.preferences
    db.commit(); return {"notifications":user.notifications or {},"preferences":user.preferences or {}}

@router.get("/dashboard")
def dashboard(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    jobs=db.query(Job).filter(Job.creator_id==user.id).count()
    candidates=db.query(Candidate).count()
    shortlisted=db.query(Application).filter(Application.stage=="SHORTLISTED").count()
    interviews=db.query(Interview).filter(Interview.scheduled_at.isnot(None), Interview.scheduled_at>=func.date(func.now())).count()
    hired=db.query(Application).filter(Application.stage=="HIRED").count()
    active_campaigns=db.query(Campaign).filter(Campaign.user_id==user.id,Campaign.status=="ACTIVE").count()
    activities=db.query(Activity).filter(Activity.user_id==user.id).order_by(Activity.created_at.desc()).limit(8).all()
    recent=[{"id":a.id,"message":a.message,"type":a.type,"created_at":a.created_at.isoformat()} for a in activities]
    priority=db.query(Application).filter(Application.ai_match_score.isnot(None)).order_by(Application.ai_match_score.desc()).limit(5).all()
    priority_rows=[]
    for a in priority:
        c=db.get(Candidate,a.candidate_id); j=db.get(Job,a.job_id)
        if c: priority_rows.append({"id":c.id,"name":f"{c.first_name} {c.last_name}".strip(),"role":j.title if j else "Candidate","score":round(a.ai_match_score or 0),"stage":a.stage})
    return {"user":out(user),"stats":{"open_jobs":jobs,"active_candidates":candidates,"ai_shortlisted":shortlisted,"interviews_today":interviews,"hired":hired,"active_campaigns":active_campaigns},"activities":recent,"priority_candidates":priority_rows}
