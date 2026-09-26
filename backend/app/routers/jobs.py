import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Job, Activity, Application, Candidate
from ..schemas import JobCreate, JobUpdate, MatchRequest
from ..security import get_current_user
from ..models import User
from ..services.ai import match_candidate


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


def job_out(j, db=None):
    apps = []

    if db:
        for a in db.query(Application).filter(
            Application.job_id == j.id
        ).all():

            c = db.get(Candidate, a.candidate_id)

            apps.append({
                "id": a.id,
                "candidate_id": a.candidate_id,
                "candidate_name": (
                    f"{c.first_name} {c.last_name}".strip()
                    if c else "Candidate"
                ),
                "stage": a.stage,
                "score": a.ai_match_score
            })

    return {
        "id": j.id,
        "title": j.title,
        "department": j.department,
        "location": j.location,
        "workplace_type": j.workplace_type,
        "employment_type": j.employment_type,
        "status": j.status,
        "description": j.description,
        "requirements": j.requirements or [],
        "skills_required": j.skills_required or [],
        "salary_range": j.salary_range,
        "created_at": j.created_at.isoformat(),
        "applications": apps
    }


# =========================================================
# CREATE JOB
# =========================================================

@router.post("")
def create_job(
    p: JobCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try:
        # Create job
        j = Job(
            id=str(uuid.uuid4()),
            creator_id=user.id,
            **p.model_dump()
        )

        db.add(j)

        # IMPORTANT:
        # Insert the job first so activities.job_id
        # can reference an existing job.
        db.flush()

        # Create activity
        activity = Activity(
            id=str(uuid.uuid4()),
            user_id=user.id,
            job_id=j.id,
            type="JOB_CREATED",
            message=f"Created job: {j.title}"
        )

        db.add(activity)

        # Commit everything
        db.commit()

        # Refresh from database
        db.refresh(j)

        return job_out(j, db)

    except Exception:
        db.rollback()
        raise


# =========================================================
# LIST JOBS
# =========================================================

@router.get("")
def list_jobs(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    rows = (
        db.query(Job)
        .filter(Job.creator_id == user.id)
        .order_by(Job.created_at.desc())
        .all()
    )

    return [job_out(j, db) for j in rows]


# =========================================================
# GET SINGLE JOB
# =========================================================

@router.get("/{job_id}")
def get_job(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    j = db.get(Job, job_id)

    if not j or j.creator_id != user.id:
        raise HTTPException(404, "Job not found")

    return job_out(j, db)


# =========================================================
# UPDATE JOB
# =========================================================

@router.put("/{job_id}")
def update_job(
    job_id: str,
    p: JobUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    j = db.get(Job, job_id)

    if not j or j.creator_id != user.id:
        raise HTTPException(404, "Job not found")

    for k, v in p.model_dump(exclude_unset=True).items():
        setattr(j, k, v)

    activity = Activity(
        id=str(uuid.uuid4()),
        user_id=user.id,
        job_id=j.id,
        type="JOB_UPDATED",
        message=f"Updated job: {j.title}"
    )

    db.add(activity)
    db.commit()
    db.refresh(j)

    return job_out(j, db)


# =========================================================
# DELETE JOB
# =========================================================

@router.delete("/{job_id}")
def delete_job(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    j = db.get(Job, job_id)

    if not j or j.creator_id != user.id:
        raise HTTPException(404, "Job not found")

    db.delete(j)
    db.commit()

    return {"ok": True}


# =========================================================
# UPDATE JOB STATUS
# =========================================================

@router.patch("/{job_id}/status")
def status(
    job_id: str,
    status: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    j = db.get(Job, job_id)

    if not j or j.creator_id != user.id:
        raise HTTPException(404, "Job not found")

    if status not in {
        "ACTIVE",
        "PAUSED",
        "CLOSED",
        "DRAFT"
    }:
        raise HTTPException(400, "Invalid job status")

    j.status = status

    db.commit()
    db.refresh(j)

    return job_out(j, db)


# =========================================================
# AI CANDIDATE MATCHING
# =========================================================

@router.post("/{job_id}/match")
def match(
    job_id: str,
    p: MatchRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    j = db.get(Job, job_id)

    if not j or j.creator_id != user.id:
        raise HTTPException(404, "Job not found")

    rows = db.query(Candidate).all()

    if p.candidate_ids:
        rows = [
            c for c in rows
            if c.id in p.candidate_ids
        ]

    results = []

    for c in rows:

        candidate = {
            "id": c.id,
            "name": f"{c.first_name} {c.last_name}".strip(),
            "email": c.email,
            "skills": c.skills or [],
            "experience": c.total_experience,
            "resume": c.parsed_resume,
            "summary": (
                (c.parsed_resume or {}).get("summary", "")
                if c.parsed_resume
                else ""
            )
        }

        result = match_candidate(
            {
                "id": j.id,
                "title": j.title,
                "skills": j.skills_required or [],
                "requirements": j.requirements or [],
                "description": j.description
            },
            candidate
        )

        # Check existing application
        a = (
            db.query(Application)
            .filter(
                Application.job_id == j.id,
                Application.candidate_id == c.id
            )
            .first()
        )

        # Create application if needed
        if not a:
            a = Application(
                id=str(uuid.uuid4()),
                job_id=j.id,
                candidate_id=c.id,
                stage="APPLIED"
            )

            db.add(a)

        # Save AI results
        a.ai_match_score = result.get("score")
        a.ai_summary = result.get("summary", "")
        a.ai_pros = result.get("strengths", [])
        a.ai_cons = result.get("gaps", [])

        # Move strong candidates into AI screening
        if (
            (a.ai_match_score or 0) >= 75
            and a.stage in (None, "APPLIED")
        ):
            a.stage = "AI_SCREENING"

        results.append({
            "application_id": a.id,
            "candidate_id": c.id,
            "candidate_name": candidate["name"],
            **result,
            "stage": a.stage
        })

    # Activity
    activity = Activity(
        id=str(uuid.uuid4()),
        user_id=user.id,
        job_id=j.id,
        type="AI_MATCHING",
        message=f"AI matching completed for {j.title}"
    )

    db.add(activity)

    db.commit()

    return {
        "job": job_out(j, db),
        "matches": sorted(
            results,
            key=lambda x: x.get("score", 0),
            reverse=True
        )
    }