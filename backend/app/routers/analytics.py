from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..db import get_db
from ..models import User,Job,Candidate,Application,Interview,Campaign,CampaignRecipient
from ..security import get_current_user

router=APIRouter(prefix="/analytics",tags=["Analytics"])

@router.get("")
def analytics(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    jobs=db.query(Job).filter(Job.creator_id==user.id).all()
    job_ids=[j.id for j in jobs]
    apps=db.query(Application).filter(Application.job_id.in_(job_ids)).all() if job_ids else []
    interviews=db.query(Interview).join(Application,Interview.application_id==Application.id).filter(Application.job_id.in_(job_ids)).all() if job_ids else []
    campaigns=db.query(Campaign).filter(Campaign.user_id==user.id).all()
    funnel={s:len([a for a in apps if a.stage==s]) for s in ["APPLIED","AI_SCREENING","SHORTLISTED","INTERVIEW","OFFER","HIRED","REJECTED"]}
    reached=sum(db.query(CampaignRecipient).filter(CampaignRecipient.campaign_id==c.id).count() for c in campaigns)
    completed=[i for i in interviews if i.status=="COMPLETED" and i.evaluation_score is not None]
    return {"summary":{"jobs":len(jobs),"candidates":db.query(Candidate).count(),"applications":len(apps),"shortlisted":funnel["SHORTLISTED"],"interviews":len(interviews),"hired":funnel["HIRED"],"campaigns":len(campaigns),"campaign_recipients":reached},"funnel":funnel,"interviews":{"scheduled":len(interviews),"completed":len(completed),"average_score":round(sum(i.evaluation_score for i in completed)/len(completed),1) if completed else 0},"jobs":[{"id":j.id,"title":j.title,"status":j.status,"applications":len([a for a in apps if a.job_id==j.id]),"shortlisted":len([a for a in apps if a.job_id==j.id and a.stage=="SHORTLISTED"]),"hired":len([a for a in apps if a.job_id==j.id and a.stage=="HIRED"])} for j in jobs]}
