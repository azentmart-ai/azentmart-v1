import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db, settings
from ..models import Campaign, CampaignRecipient, Candidate, Job, Activity, User
from ..schemas import CampaignCreate, CampaignUpdate
from ..security import get_current_user
from ..services.ai import campaign_content

router=APIRouter(prefix="/campaigns",tags=["Campaigns"])

def out(c,db):
    rec=db.query(CampaignRecipient).filter(CampaignRecipient.campaign_id==c.id).all()
    return {"id":c.id,"name":c.name,"job_id":c.job_id,"subject":c.subject,"body":c.body,"status":c.status,"created_at":c.created_at.isoformat(),"recipients":[{"id":r.id,"candidate_id":r.candidate_id,"status":r.status,"sent_at":r.sent_at} for r in rec],"recipient_count":len(rec)}

@router.get("")
def list_campaigns(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    return [out(c,db) for c in db.query(Campaign).filter(Campaign.user_id==user.id).order_by(Campaign.created_at.desc()).all()]

@router.post("")
def create(p:CampaignCreate,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    j=db.get(Job,p.job_id) if p.job_id else None
    if j and j.creator_id!=user.id: raise HTTPException(403,"Not allowed")
    content={"subject":p.subject,"body":p.body}
    if not content["subject"] or not content["body"]:
        content=campaign_content({"title":j.title if j else "open role"},len(p.candidate_ids))
    c=Campaign(id=str(uuid.uuid4()),user_id=user.id,job_id=p.job_id,name=p.name,subject=content["subject"],body=content["body"])
    db.add(c)
    for cid in p.candidate_ids:
        if db.get(Candidate,cid): db.add(CampaignRecipient(id=str(uuid.uuid4()),campaign_id=c.id,candidate_id=cid))
    db.add(Activity(id=str(uuid.uuid4()),user_id=user.id,type="CAMPAIGN_CREATED",message=f"Created campaign: {c.name}")); db.commit(); db.refresh(c)
    return out(c,db)

@router.put("/{campaign_id}")
def update(campaign_id:str,p:CampaignUpdate,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    c=db.get(Campaign,campaign_id)
    if not c or c.user_id!=user.id: raise HTTPException(404,"Campaign not found")
    for k in ["name","job_id","subject","body","status"]: setattr(c,k,getattr(p,k))
    current={x.candidate_id for x in db.query(CampaignRecipient).filter(CampaignRecipient.campaign_id==c.id).all()}
    for cid in p.candidate_ids:
        if cid not in current and db.get(Candidate,cid): db.add(CampaignRecipient(id=str(uuid.uuid4()),campaign_id=c.id,candidate_id=cid))
    db.commit(); db.refresh(c); return out(c,db)

@router.delete("/{campaign_id}")
def delete(campaign_id:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    c=db.get(Campaign,campaign_id)
    if not c or c.user_id!=user.id: raise HTTPException(404,"Campaign not found")
    db.delete(c); db.commit(); return {"ok":True}

@router.post("/{campaign_id}/generate")
def generate(campaign_id:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    c=db.get(Campaign,campaign_id)
    if not c or c.user_id!=user.id: raise HTTPException(404,"Campaign not found")
    j=db.get(Job,c.job_id) if c.job_id else None
    x=campaign_content({"title":j.title if j else "open role"},db.query(CampaignRecipient).filter(CampaignRecipient.campaign_id==c.id).count())
    c.subject=x["subject"]; c.body=x["body"]; db.commit(); return out(c,db)

@router.post("/{campaign_id}/launch")
def launch(campaign_id:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    c=db.get(Campaign,campaign_id)
    if not c or c.user_id!=user.id: raise HTTPException(404,"Campaign not found")
    rec=db.query(CampaignRecipient).filter(CampaignRecipient.campaign_id==c.id).all()
    # Send when SMTP is configured; otherwise keep the launch as a persisted queue action.
    sent_count=0
    if settings.smtp_host and settings.smtp_user and settings.smtp_password:
        from email.message import EmailMessage
        import smtplib
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls(); server.login(settings.smtp_user, settings.smtp_password)
            for r in rec:
                cand=db.get(Candidate,r.candidate_id)
                if not cand: continue
                msg=EmailMessage()
                msg["Subject"]=c.subject
                msg["From"]=settings.smtp_from or settings.smtp_user
                msg["To"]=cand.email
                msg.set_content(c.body.replace("{candidate_name}", cand.first_name))
                server.send_message(msg)
                r.status="SENT"; r.sent_at=datetime.utcnow(); sent_count += 1
    else:
        for r in rec: r.status="QUEUED"; r.sent_at=datetime.utcnow()
    c.status="ACTIVE"
    db.add(Activity(id=str(uuid.uuid4()),user_id=user.id,type="CAMPAIGN_LAUNCHED",message=f"Launched campaign: {c.name} to {len(rec)} recipients"))
    db.commit(); return {**out(c,db),"sent_count":sent_count}
