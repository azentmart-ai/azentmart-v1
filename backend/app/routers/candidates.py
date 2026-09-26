import uuid
from pathlib import Path
from datetime import datetime
from typing import Any

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Body,
)

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..db import get_db
from ..models import (
    Candidate,
    Activity,
    User,
    Application,
    Job,
    Interview,
)
from ..security import get_current_user


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"],
)


# =========================================================
# HELPERS
# =========================================================

def normalize_email(email: str | None) -> str | None:
    if not email:
        return None

    email = email.strip().lower()

    return email if email else None


def candidate_name(candidate: Candidate) -> str:
    return (
        f"{candidate.first_name or ''} "
        f"{candidate.last_name or ''}"
    ).strip()


def serialize_candidate(
    candidate: Candidate,
    db: Session,
) -> dict[str, Any]:

    applications = (
        db.query(Application)
        .filter(
            Application.candidate_id
            == candidate.id
        )
        .all()
    )

    application_data = []

    for application in applications:

        job = (
            db.query(Job)
            .filter(
                Job.id
                == application.job_id
            )
            .first()
        )

        application_data.append(
            {
                "id": application.id,
                "job_id": application.job_id,
                "job_title": (
                    job.title
                    if job
                    else None
                ),
                "stage": (
                    application.stage
                    or "APPLIED"
                ),
                "ai_match_score": (
                    application.ai_match_score
                ),
                "ai_summary": (
                    application.ai_summary
                ),
                "ai_pros": (
                    application.ai_pros
                    or []
                ),
                "ai_cons": (
                    application.ai_cons
                    or []
                ),
                "created_at": (
                    application.created_at
                ),
            }
        )

    shortlisted = any(
        (
            application.stage
            or ""
        ).upper()
        == "SHORTLISTED"
        for application
        in applications
    )

    interviews = (
        db.query(Interview)
        .join(
            Application,
            Interview.application_id
            == Application.id,
        )
        .filter(
            Application.candidate_id
            == candidate.id
        )
        .all()
    )

    return {
        "id": candidate.id,

        "first_name":
            candidate.first_name,

        "last_name":
            candidate.last_name or "",

        "name":
            candidate_name(candidate),

        "email":
            candidate.email,

        "phone":
            candidate.phone,

        "location":
            candidate.location,

        "linkedin_url":
            candidate.linkedin_url,

        "github_url":
            candidate.github_url,

        "portfolio_url":
            candidate.portfolio_url,

        "resume_filename":
            candidate.resume_filename,

        "resume_text":
            candidate.resume_text,

        "skills":
            candidate.skills or [],

        "experience":
            candidate.total_experience,

        "total_experience":
            candidate.total_experience,

        "talent_pool":
            bool(candidate.talent_pool),

        "parsed_resume":
            candidate.parsed_resume or {},

        "summary": (
            (candidate.parsed_resume or {})
            .get("summary", "")
        ),

        "applications":
            application_data,

        "application_count":
            len(applications),

        "shortlisted":
            shortlisted,

        "interview_count":
            len(interviews),

        "created_at":
            candidate.created_at,

        "updated_at":
            candidate.updated_at,
    }


# =========================================================
# GET ALL CANDIDATES
# =========================================================

@router.get("")
def get_candidates(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Return all candidates from PostgreSQL.

    This is the endpoint used by:
        GET /api/candidates
    """

    try:

        candidates = (
            db.query(Candidate)
            .order_by(
                Candidate.created_at.desc()
            )
            .all()
        )

        data = [
            serialize_candidate(
                candidate,
                db,
            )
            for candidate in candidates
        ]

        total = len(data)

        ai_matched = sum(
            1
            for candidate in data
            if any(
                app.get(
                    "ai_match_score"
                ) is not None
                for app
                in candidate[
                    "applications"
                ]
            )
        )

        shortlisted = sum(
            1
            for candidate in data
            if candidate[
                "shortlisted"
            ]
        )

        interviews = sum(
            candidate[
                "interview_count"
            ]
            for candidate in data
        )

        return {
            "success": True,

            "candidates":
                data,

            "total":
                total,

            "stats": {
                "total_candidates":
                    total,

                "ai_matched":
                    ai_matched,

                "shortlisted":
                    shortlisted,

                "interviews":
                    interviews,
            },
        }

    except Exception as e:

        print(
            "GET CANDIDATES ERROR:"
        )

        print(
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to load candidates."
            ),
        )


# =========================================================
# GET SINGLE CANDIDATE
# =========================================================

@router.get("/{candidate_id}")
def get_candidate(
    candidate_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id
            == candidate_id
        )
        .first()
    )

    if not candidate:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found.",
        )

    return {
        "success": True,
        "candidate":
            serialize_candidate(
                candidate,
                db,
            ),
    }


# =========================================================
# CREATE CANDIDATE MANUALLY
# =========================================================

@router.post("")
def create_candidate(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Create candidate manually.

    Expected payload:

    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "+91...",
        "location": "Chennai, India",
        "skills": ["Python", "FastAPI"],
        "experience_years": 5,
        "summary": "..."
    }
    """

    first_name = (
        payload.get("first_name")
        or payload.get("firstName")
        or ""
    ).strip()

    last_name = (
        payload.get("last_name")
        or payload.get("lastName")
        or ""
    ).strip()

    email = normalize_email(
        payload.get("email")
    )

    phone = (
        payload.get("phone")
        or ""
    ).strip()

    location = (
        payload.get("location")
        or ""
    ).strip()

    role = (
        payload.get("role")
        or payload.get("job_title")
        or ""
    ).strip()

    summary = (
        payload.get("summary")
        or ""
    ).strip()

    skills = payload.get(
        "skills"
    ) or []

    experience = (
        payload.get(
            "experience_years"
        )
        if payload.get(
            "experience_years"
        ) is not None
        else payload.get(
            "total_experience"
        )
    )

    # ---------------------------------------------------------
    # Validation
    # ---------------------------------------------------------

    if not first_name:

        raise HTTPException(
            status_code=400,
            detail="First name is required.",
        )

    if not email:

        raise HTTPException(
            status_code=400,
            detail="Email is required.",
        )

    # ---------------------------------------------------------
    # Normalize skills
    # ---------------------------------------------------------

    if isinstance(
        skills,
        str,
    ):

        skills = [
            item.strip()
            for item
            in skills.split(",")
            if item.strip()
        ]

    if not isinstance(
        skills,
        list,
    ):

        skills = []

    # ---------------------------------------------------------
    # Normalize experience
    # ---------------------------------------------------------

    try:

        if experience is not None:

            experience = float(
                experience
            )

    except (
        TypeError,
        ValueError,
    ):

        experience = None

    # ---------------------------------------------------------
    # Duplicate check
    # ---------------------------------------------------------

    existing = (
        db.query(Candidate)
        .filter(
            Candidate.email
            == email
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=409,
            detail=(
                f"A candidate with the email "
                f"{email} already exists."
            ),
        )

    # ---------------------------------------------------------
    # Parsed candidate data
    # ---------------------------------------------------------

    parsed_resume = {
        "source":
            "manual",

        "candidate": {
            "first_name":
                first_name,

            "last_name":
                last_name,

            "email":
                email,

            "phone":
                phone,

            "location":
                location,

            "skills":
                skills,

            "total_experience":
                experience,

            "summary":
                summary,
        },

        "summary":
            summary,
    }

    # ---------------------------------------------------------
    # Create
    # ---------------------------------------------------------

    candidate = Candidate(
        id=str(
            uuid.uuid4()
        ),

        first_name=
            first_name,

        last_name=
            last_name,

        email=
            email,

        phone=
            phone or None,

        location=
            location or None,

        skills=
            skills,

        total_experience=
            experience,

        parsed_resume=
            parsed_resume,
    )

    try:

        db.add(
            candidate
        )

        db.flush()

        # -----------------------------------------------------
        # Activity
        # -----------------------------------------------------

        activity = Activity(
            id=str(
                uuid.uuid4()
            ),

            user_id=
                user.id,

            candidate_id=
                candidate.id,

            job_id=None,

            type=
                "CANDIDATE_CREATED",

            message=(
                f"Candidate created manually: "
                f"{candidate_name(candidate)}"
            ),
        )

        db.add(
            activity
        )

        db.commit()

        db.refresh(
            candidate
        )

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=409,
            detail=(
                "A candidate with this "
                "email already exists."
            ),
        )

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to create candidate."
            ),
        )

    return {
        "success": True,
        "message":
            "Candidate created successfully.",
        "candidate":
            serialize_candidate(
                candidate,
                db,
            ),
    }


# =========================================================
# UPLOAD RESUME
# =========================================================

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Upload PDF, DOCX or TXT resume.
    Parse using existing AI parser.
    Save candidate in PostgreSQL.
    """

    allowed_extensions = {
        ".pdf",
        ".docx",
        ".txt",
    }

    filename = (
        file.filename
        or "resume"
    )

    extension = Path(
        filename
    ).suffix.lower()

    # ---------------------------------------------------------
    # Validate extension
    # ---------------------------------------------------------

    if extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only PDF, DOCX and TXT "
                "resume files are supported."
            ),
        )

    try:

        # -----------------------------------------------------
        # Read file
        # -----------------------------------------------------

        file_bytes = await file.read()

        if not file_bytes:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Uploaded resume is empty."
                ),
            )

        # -----------------------------------------------------
        # Extract text
        # -----------------------------------------------------

        resume_text = ""

        # TXT
        if extension == ".txt":

            resume_text = (
                file_bytes.decode(
                    "utf-8",
                    errors="ignore",
                )
            )

        # PDF
        elif extension == ".pdf":

            try:

                import io
                import pypdf

                reader = pypdf.PdfReader(
                    io.BytesIO(
                        file_bytes
                    )
                )

                pages = []

                for page in reader.pages:

                    pages.append(
                        page.extract_text()
                        or ""
                    )

                resume_text = (
                    "\n".join(pages)
                )

            except ImportError:

                raise HTTPException(
                    status_code=500,
                    detail=(
                        "PDF parser is not installed. "
                        "Run: pip install pypdf"
                    ),
                )

        # DOCX
        elif extension == ".docx":

            try:

                import io

                from docx import Document

                document = Document(
                    io.BytesIO(
                        file_bytes
                    )
                )

                paragraphs = [
                    paragraph.text
                    for paragraph
                    in document.paragraphs
                    if paragraph.text.strip()
                ]

                resume_text = (
                    "\n".join(
                        paragraphs
                    )
                )

            except ImportError:

                raise HTTPException(
                    status_code=500,
                    detail=(
                        "DOCX parser is not installed. "
                        "Run: pip install python-docx"
                    ),
                )

        # -----------------------------------------------------
        # Validate text
        # -----------------------------------------------------

        resume_text = (
            resume_text.strip()
        )

        if not resume_text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract text from this resume. "
                    "Please upload a text-based PDF, DOCX or TXT file."
                ),
            )

        # -----------------------------------------------------
        # AI parsing
        # -----------------------------------------------------

        first_name = ""
        last_name = ""
        email = ""
        phone = ""
        location = ""
        skills = []
        total_experience = None
        summary = ""

        parsed_resume = {
            "raw_text":
                resume_text,

            "filename":
                filename,
        }

        try:

            from ..services.ai import parse_resume

            parsed = parse_resume(
                resume_text
            )

            if isinstance(
                parsed,
                dict,
            ):

                parsed_resume.update(
                    parsed
                )

                first_name = (
                    parsed.get(
                        "first_name"
                    )
                    or parsed.get(
                        "firstName"
                    )
                    or ""
                )

                last_name = (
                    parsed.get(
                        "last_name"
                    )
                    or parsed.get(
                        "lastName"
                    )
                    or ""
                )

                email = (
                    parsed.get(
                        "email"
                    )
                    or ""
                )

                phone = (
                    parsed.get(
                        "phone"
                    )
                    or ""
                )

                location = (
                    parsed.get(
                        "location"
                    )
                    or ""
                )

                skills = (
                    parsed.get(
                        "skills"
                    )
                    or []
                )

                total_experience = (
                    parsed.get(
                        "total_experience"
                    )
                    or parsed.get(
                        "experience"
                    )
                )

                summary = (
                    parsed.get(
                        "summary"
                    )
                    or parsed.get(
                        "professional_summary"
                    )
                    or ""
                )

        except ImportError:

            pass

        except Exception as e:

            print(
                "AI RESUME PARSER ERROR:"
            )

            print(
                repr(e)
            )

        # -----------------------------------------------------
        # Fallback parsing
        # -----------------------------------------------------

        lines = [
            line.strip()
            for line
            in resume_text.splitlines()
            if line.strip()
        ]

        # Name
        if not first_name and lines:

            name_parts = (
                lines[0].split()
            )

            if len(name_parts) >= 2:

                first_name = (
                    name_parts[0]
                )

                last_name = (
                    " ".join(
                        name_parts[1:]
                    )
                )

            else:

                first_name = (
                    name_parts[0]
                )

        # Email
        if not email:

            import re

            email_match = re.search(
                r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
                resume_text,
            )

            if email_match:

                email = (
                    email_match.group(0)
                )

        # Phone
        if not phone:

            import re

            phone_match = re.search(
                r"(?:\+91[\s-]?)?[6-9]\d{9}",
                resume_text,
            )

            if phone_match:

                phone = (
                    phone_match.group(0)
                )

        # Summary
        if not summary:

            summary = (
                resume_text[:1000]
            )

        # -----------------------------------------------------
        # Normalize email
        # -----------------------------------------------------

        email = normalize_email(
            email
        )

        if not email:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not find an email address "
                    "in this resume. Please upload a resume "
                    "containing a valid email address."
                ),
            )

        # -----------------------------------------------------
        # DUPLICATE CHECK
        # -----------------------------------------------------

        existing = (
            db.query(Candidate)
            .filter(
                Candidate.email
                == email
            )
            .first()
        )

        if existing:

            raise HTTPException(
                status_code=409,
                detail=(
                    f"A candidate with the email "
                    f"{email} already exists."
                ),
            )

        # -----------------------------------------------------
        # Skills
        # -----------------------------------------------------

        if isinstance(
            skills,
            str,
        ):

            skills = [
                item.strip()
                for item
                in skills.split(",")
                if item.strip()
            ]

        if not isinstance(
            skills,
            list,
        ):

            skills = []

        # -----------------------------------------------------
        # Experience
        # -----------------------------------------------------

        try:

            if total_experience is not None:

                total_experience = float(
                    total_experience
                )

        except (
            TypeError,
            ValueError,
        ):

            total_experience = None

        # -----------------------------------------------------
        # Parsed resume
        # -----------------------------------------------------

        parsed_resume[
            "summary"
        ] = summary or ""

        parsed_resume[
            "candidate"
        ] = {

            "first_name":
                first_name,

            "last_name":
                last_name,

            "email":
                email,

            "phone":
                phone,

            "location":
                location,

            "skills":
                skills,

            "total_experience":
                total_experience,

            "summary":
                summary or "",
        }

        # -----------------------------------------------------
        # Create candidate
        # -----------------------------------------------------

        candidate = Candidate(

            id=str(
                uuid.uuid4()
            ),

            first_name=(
                first_name
                or "Unknown"
            ),

            last_name=(
                last_name
                or ""
            ),

            email=
                email,

            phone=(
                phone
                or None
            ),

            location=(
                location
                or None
            ),

            resume_filename=
                filename,

            resume_text=
                resume_text,

            skills=
                skills,

            total_experience=
                total_experience,

            parsed_resume=
                parsed_resume,

            talent_pool=False,
        )

        db.add(
            candidate
        )

        # -----------------------------------------------------
        # Flush first
        # -----------------------------------------------------

        try:

            db.flush()

        except IntegrityError:

            db.rollback()

            raise HTTPException(
                status_code=409,
                detail=(
                    "A candidate with this "
                    "email already exists."
                ),
            )

        # -----------------------------------------------------
        # Activity
        # -----------------------------------------------------

        activity = Activity(

            id=str(
                uuid.uuid4()
            ),

            user_id=
                user.id,

            candidate_id=
                candidate.id,

            job_id=None,

            type=
                "RESUME_UPLOADED",

            message=(
                f"Processed resume: "
                f"{filename}"
            ),
        )

        db.add(
            activity
        )

        # -----------------------------------------------------
        # Commit
        # -----------------------------------------------------

        try:

            db.commit()

        except IntegrityError:

            db.rollback()

            raise HTTPException(
                status_code=409,
                detail=(
                    "A candidate with this "
                    "email already exists."
                ),
            )

        db.refresh(
            candidate
        )

        return {
            "success": True,

            "message": (
                "Resume processed and "
                "candidate saved successfully."
            ),

            "candidate":
                serialize_candidate(
                    candidate,
                    db,
                ),
        }

    except HTTPException:

        db.rollback()

        raise

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=409,
            detail=(
                "A candidate with this "
                "email already exists."
            ),
        )

    except Exception as e:

        db.rollback()

        print(
            "======================================"
        )

        print(
            "UPLOAD RESUME ERROR"
        )

        print(
            "======================================"
        )

        print(
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to process the resume. "
                "Please try again."
            ),
        )


# =========================================================
# DELETE CANDIDATE
# =========================================================

@router.delete("/{candidate_id}")
def delete_candidate(
    candidate_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):

    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id
            == candidate_id
        )
        .first()
    )

    if not candidate:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found.",
        )

    try:

        name = candidate_name(
            candidate
        )

        # Remove related activities
        db.query(Activity).filter(
            Activity.candidate_id
            == candidate_id
        ).delete(
            synchronize_session=False
        )

        # Remove related interviews
        application_ids = [
            app.id
            for app
            in db.query(Application)
            .filter(
                Application.candidate_id
                == candidate_id
            )
            .all()
        ]

        if application_ids:

            db.query(Interview).filter(
                Interview.application_id.in_(
                    application_ids
                )
            ).delete(
                synchronize_session=False
            )

        # Remove applications
        db.query(Application).filter(
            Application.candidate_id
            == candidate_id
        ).delete(
            synchronize_session=False
        )

        db.delete(
            candidate
        )

        db.commit()

        return {
            "success": True,
            "message": (
                f"{name} was deleted successfully."
            ),
        }

    except Exception as e:

        db.rollback()

        print(
            "DELETE CANDIDATE ERROR:"
        )

        print(
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to delete candidate."
            ),
        )


# =========================================================
# CONTACT CANDIDATE
# =========================================================

@router.post("/{candidate_id}/contact")
def contact_candidate(
    candidate_id: str,
    payload: dict = Body(default={}),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):

    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id
            == candidate_id
        )
        .first()
    )

    if not candidate:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found.",
        )

    message = (
        payload.get(
            "message"
        )
        or payload.get(
            "body"
        )
        or "Contacted candidate."
    )

    try:

        activity = Activity(
            id=str(
                uuid.uuid4()
            ),

            user_id=
                user.id,

            candidate_id=
                candidate.id,

            job_id=
                payload.get(
                    "job_id"
                ),

            type=
                "CANDIDATE_CONTACTED",

            message=
                message,
        )

        db.add(
            activity
        )

        db.commit()

        return {
            "success": True,

            "message": (
                "Candidate contact activity "
                "recorded successfully."
            ),

            "candidate_id":
                candidate.id,
        }

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to record candidate contact."
            ),
        )


# =========================================================
# SCHEDULE CANDIDATE
# =========================================================

@router.post("/{candidate_id}/schedule")
def schedule_candidate(
    candidate_id: str,
    payload: dict = Body(default={}),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):

    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id
            == candidate_id
        )
        .first()
    )

    if not candidate:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found.",
        )

    job_id = payload.get(
        "job_id"
    )

    scheduled_at = payload.get(
        "scheduled_at"
    )

    if not scheduled_at:

        raise HTTPException(
            status_code=400,
            detail=(
                "scheduled_at is required."
            ),
        )

    # ---------------------------------------------------------
    # Find application
    # ---------------------------------------------------------

    application = None

    if job_id:

        application = (
            db.query(Application)
            .filter(
                Application.job_id
                == job_id,

                Application.candidate_id
                == candidate_id,
            )
            .first()
        )

    else:

        application = (
            db.query(Application)
            .filter(
                Application.candidate_id
                == candidate_id
            )
            .order_by(
                Application.updated_at.desc()
            )
            .first()
        )

    if not application:

        raise HTTPException(
            status_code=400,
            detail=(
                "This candidate is not associated "
                "with a job yet. Match the candidate "
                "to a job before scheduling an interview."
            ),
        )

    # ---------------------------------------------------------
    # Parse scheduled date
    # ---------------------------------------------------------

    try:

        if isinstance(
            scheduled_at,
            str,
        ):

            scheduled_datetime = (
                datetime.fromisoformat(
                    scheduled_at.replace(
                        "Z",
                        "+00:00",
                    )
                )
            )

        else:

            scheduled_datetime = (
                scheduled_at
            )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid scheduled_at value."
            ),
        )

    try:

        interview = Interview(

            id=str(
                uuid.uuid4()
            ),

            application_id=
                application.id,

            interviewer_id=
                user.id,

            is_ai_conducted=
                payload.get(
                    "is_ai_conducted",
                    True,
                ),

            scheduled_at=
                scheduled_datetime,

            status=
                "SCHEDULED",

            questions=
                payload.get(
                    "questions"
                ),
        )

        db.add(
            interview
        )

        application.stage = (
            "INTERVIEW"
        )

        activity = Activity(

            id=str(
                uuid.uuid4()
            ),

            user_id=
                user.id,

            candidate_id=
                candidate.id,

            job_id=
                application.job_id,

            type=
                "INTERVIEW_SCHEDULED",

            message=(
                f"Interview scheduled for "
                f"{candidate_name(candidate)}."
            ),
        )

        db.add(
            activity
        )

        db.commit()

        db.refresh(
            interview
        )

        return {

            "success": True,

            "message": (
                "Interview scheduled successfully."
            ),

            "interview": {

                "id":
                    interview.id,

                "candidate_id":
                    candidate.id,

                "application_id":
                    application.id,

                "job_id":
                    application.job_id,

                "scheduled_at":
                    interview.scheduled_at,

                "status":
                    interview.status,
            },
        }

    except Exception as e:

        db.rollback()

        print(
            "SCHEDULE CANDIDATE ERROR:"
        )

        print(
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to schedule the interview."
            ),
        )