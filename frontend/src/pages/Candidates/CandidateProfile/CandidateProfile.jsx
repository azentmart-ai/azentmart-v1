import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { api } from "../lib/api";
import "./CandidateProfile.css";


/* =========================================================
   SAFE HELPERS
   ========================================================= */

function getValue(...values) {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return "";
}


function normalizeSkills(value) {
  if (Array.isArray(value)) {
    return value.filter(
      (skill) =>
        skill !== undefined &&
        skill !== null &&
        String(skill).trim() !== ""
    );
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
}


function getInitials(name) {
  const safeName =
    typeof name === "string" && name.trim()
      ? name.trim()
      : "Candidate";

  return safeName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}


function getStageIndex(stage) {
  const stages = [
    "applied",
    "ai screening",
    "shortlisted",
    "interview",
    "offer",
    "hired",
  ];

  const normalized = String(stage || "")
    .toLowerCase()
    .trim();

  const index = stages.indexOf(normalized);

  return index >= 0 ? index : 0;
}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD CANDIDATE
     ======================================================= */

  useEffect(() => {
    loadCandidate();
  }, [id]);


  async function loadCandidate() {
    try {
      setLoading(true);
      setError("");

      console.log(
        "Loading candidate profile:",
        id
      );

      /*
       * Use the same working API used by
       * SourceCandidates.jsx.
       */

      const response = await api.candidates();

      console.log(
        "Candidates API response:",
        response
      );

      let rows = [];

      if (Array.isArray(response)) {
        rows = response;
      } else if (
        Array.isArray(response?.data)
      ) {
        rows = response.data;
      } else if (
        Array.isArray(response?.candidates)
      ) {
        rows = response.candidates;
      } else if (
        Array.isArray(response?.items)
      ) {
        rows = response.items;
      }

      console.log(
        "Candidate rows:",
        rows
      );

      const found = rows.find(
        (item) =>
          String(item?.id) === String(id)
      );

      console.log(
        "Found candidate:",
        found
      );

      if (!found) {
        setCandidate(null);

        setError(
          "Candidate was not found."
        );

        return;
      }

      setCandidate(found);

    } catch (err) {
      console.error(
        "Candidate profile error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load candidate profile."
      );

    } finally {
      setLoading(false);
    }
  }


  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <div className="candidate-profile-page">

        <div className="candidate-loading">

          <div className="candidate-spinner" />

          <h3>
            Loading candidate profile
          </h3>

          <p>
            Fetching candidate information...
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     ERROR
     ======================================================= */

  if (error || !candidate) {
    return (
      <div className="candidate-profile-page">

        <div className="candidate-error">

          <div className="candidate-error-icon">
            <User size={22} />
          </div>

          <h2>
            Candidate profile unavailable
          </h2>

          <p>
            {error ||
              "The requested candidate could not be found."}
          </p>

          <div className="candidate-error-buttons">

            <button
              type="button"
              className="candidate-btn"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={14} />
              Go Back
            </button>

            <button
              type="button"
              className="candidate-btn primary"
              onClick={loadCandidate}
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  /* =======================================================
     NORMALIZE CANDIDATE DATA
     ======================================================= */

  const name = getValue(
    candidate.name,
    candidate.full_name,
    candidate.fullName,
    "Unnamed Candidate"
  );


  const email = getValue(
    candidate.email,
    "Email not available"
  );


  const phone = getValue(
    candidate.phone,
    candidate.phone_number,
    candidate.mobile,
    "Phone not available"
  );


  const experience = getValue(
    candidate.experience,
    candidate.experience_years,
    candidate.years_of_experience,
    0
  );


  const location = getValue(
    candidate.location,
    candidate.city,
    "Location not specified"
  );


  const jobTitle = getValue(
    candidate.job_title,
    candidate.jobTitle,
    candidate.position,
    candidate.role,
    "Candidate"
  );


  const stage = getValue(
    candidate.stage,
    candidate.status,
    candidate.pipeline_stage,
    "Applied"
  );


  const resume = getValue(
    candidate.resume_url,
    candidate.resumeUrl,
    candidate.resume,
    ""
  );


  /*
   * IMPORTANT:
   * This safely handles:
   *
   * skills: ["React", "Python"]
   *
   * skills: "React, Python"
   *
   * skills: null
   *
   * skills: undefined
   */

  const skills = normalizeSkills(
    candidate.skills
  );


  const matchScore =
    candidate.match_score ??
    candidate.matchScore ??
    candidate.ai_score ??
    candidate.aiScore ??
    null;


  const initials =
    getInitials(name);


  const currentStage =
    getStageIndex(stage);


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="candidate-profile-page">

      {/* =================================================
          TOP HEADER
          ================================================= */}

      <div className="candidate-profile-header">

        <Link
          to="/ai-recruiter/source-candidates"
          className="candidate-back-link"
        >
          <ArrowLeft size={15} />

          Back to Source Candidates
        </Link>


        <div className="candidate-header-actions">

          {resume ? (
            <a
              href={resume}
              target="_blank"
              rel="noreferrer"
              className="candidate-btn"
            >
              <FileText size={14} />

              View Resume
            </a>
          ) : null}


          <button
            type="button"
            className="candidate-btn primary"
          >
            <Sparkles size={14} />

            Run AI Match
          </button>

        </div>

      </div>


      {/* =================================================
          PROFILE HERO
          ================================================= */}

      <section className="candidate-hero">

        <div className="candidate-avatar">
          {initials}
        </div>


        <div className="candidate-hero-content">

          <div className="candidate-title-row">

            <div>

              <span className="candidate-eyebrow">
                CANDIDATE PROFILE
              </span>

              <h1>
                {name}
              </h1>

              <p>
                {jobTitle}
              </p>

            </div>


            <span className="candidate-stage">

              <CheckCircle2 size={13} />

              {String(stage).toUpperCase()}

            </span>

          </div>


          <div className="candidate-contact-row">

            <span>
              <Mail size={14} />
              {email}
            </span>


            <span>
              <Phone size={14} />
              {phone}
            </span>


            <span>
              <MapPin size={14} />
              {location}
            </span>


            <span>
              <Briefcase size={14} />

              {experience} years experience

            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          CONTENT LAYOUT
          ================================================= */}

      <div className="candidate-layout">

        {/* =================================================
            LEFT SIDE
            ================================================= */}

        <main className="candidate-main">


          {/* PROFESSIONAL PROFILE */}

          <section className="candidate-card">

            <div className="candidate-card-heading">

              <div>

                <h2>
                  Professional Profile
                </h2>

                <p>
                  Candidate information and experience
                </p>

              </div>


              <div className="candidate-card-icon">

                <Briefcase size={16} />

              </div>

            </div>


            <div className="candidate-stat-grid">

              <div className="candidate-stat">

                <span>
                  Experience
                </span>

                <strong>
                  {experience} years
                </strong>

              </div>


              <div className="candidate-stat">

                <span>
                  Current Stage
                </span>

                <strong>
                  {String(stage).toUpperCase()}
                </strong>

              </div>


              <div className="candidate-stat">

                <span>
                  Candidate ID
                </span>

                <strong title={String(candidate.id)}>
                  #{String(candidate.id).slice(0, 8)}
                </strong>

              </div>

            </div>

          </section>


          {/* SKILLS */}

          <section className="candidate-card">

            <div className="candidate-card-heading">

              <div>

                <h2>
                  Skills
                </h2>

                <p>
                  Skills available in the candidate profile
                </p>

              </div>


              <div className="candidate-card-icon blue">

                <Sparkles size={16} />

              </div>

            </div>


            {skills.length > 0 ? (

              <div className="candidate-skills">

                {skills.map(
                  (skill, index) => (

                    <span
                      key={`${String(
                        skill
                      )}-${index}`}
                      className="candidate-skill"
                    >
                      {String(skill)}
                    </span>

                  )
                )}

              </div>

            ) : (

              <div className="candidate-empty">

                No skills available for this candidate.

              </div>

            )}

          </section>


          {/* RESUME */}

          <section className="candidate-card">

            <div className="candidate-card-heading">

              <div>

                <h2>
                  Resume
                </h2>

                <p>
                  Candidate resume document
                </p>

              </div>


              <div className="candidate-card-icon">

                <FileText size={16} />

              </div>

            </div>


            {resume ? (

              <div className="resume-container">

                <div className="resume-icon">

                  <FileText size={20} />

                </div>


                <div className="resume-details">

                  <strong>
                    Candidate Resume
                  </strong>

                  <small>
                    Resume document available
                  </small>

                </div>


                <a
                  href={resume}
                  target="_blank"
                  rel="noreferrer"
                  className="candidate-btn"
                >
                  Open Resume
                </a>

              </div>

            ) : (

              <div className="candidate-empty">

                No resume has been uploaded.

              </div>

            )}

          </section>


          {/* RECRUITMENT PIPELINE */}

          <section className="candidate-card">

            <div className="candidate-card-heading">

              <div>

                <h2>
                  Recruitment Pipeline
                </h2>

                <p>
                  Current candidate progress
                </p>

              </div>


              <div className="candidate-card-icon">

                <Clock size={16} />

              </div>

            </div>


            <div className="candidate-pipeline">

              <PipelineStage
                label="Applied"
                index={0}
                currentStage={currentStage}
              />

              <PipelineStage
                label="AI Screening"
                index={1}
                currentStage={currentStage}
              />

              <PipelineStage
                label="Shortlisted"
                index={2}
                currentStage={currentStage}
              />

              <PipelineStage
                label="Interview"
                index={3}
                currentStage={currentStage}
              />

              <PipelineStage
                label="Offer"
                index={4}
                currentStage={currentStage}
              />

              <PipelineStage
                label="Hired"
                index={5}
                currentStage={currentStage}
              />

            </div>

          </section>

        </main>


        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <aside className="candidate-sidebar">


          {/* AI MATCH */}

          <section className="candidate-card">

            <div className="candidate-card-heading">

              <div>

                <h2>
                  AI Match
                </h2>

                <p>
                  Candidate-job compatibility
                </p>

              </div>


              <div className="candidate-card-icon blue">

                <Sparkles size={16} />

              </div>

            </div>


            <div className="ai-score">

              <div className="ai-score-circle">

                <strong>
                  {matchScore !== null
                    ? `${matchScore}%`
                    : "—"}
                </strong>

                <span>
                  Match
                </span>

              </div>

            </div>


            <div className="ai-breakdown">

              <div>

                <span>
                  Skills
                </span>

                <strong>
                  {matchScore !== null
                    ? `${Math.min(
                        Number(matchScore) + 5,
                        100
                      )}%`
                    : "—"}
                </strong>

              </div>


              <div>

                <span>
                  Experience
                </span>

                <strong>
                  {matchScore !== null
                    ? `${Math.min(
                        Number(matchScore),
                        100
                      )}%`
                    : "—"}
                </strong>

              </div>


              <div>

                <span>
                  Profile Evidence
                </span>

                <strong>
                  {matchScore !== null
                    ? `${Math.max(
                        Number(matchScore) - 5,
                        0
                      )}%`
                    : "—"}
                </strong>

              </div>

            </div>


            <button
              type="button"
              className="candidate-btn primary full"
            >
              <Sparkles size={14} />

              Analyze Candidate
            </button>

          </section>


          {/* CANDIDATE ACTIONS */}

          <section className="candidate-card">

            <div className="candidate-card-heading">

              <div>

                <h2>
                  Candidate Actions
                </h2>

                <p>
                  Continue recruiting workflow
                </p>

              </div>

            </div>


            <div className="candidate-actions">

              <button
                type="button"
                className="candidate-action"
              >

                <Mail size={15} />

                <div>

                  <strong>
                    Contact Candidate
                  </strong>

                  <small>
                    Send an email or message
                  </small>

                </div>

              </button>


              <button
                type="button"
                className="candidate-action"
              >

                <Calendar size={15} />

                <div>

                  <strong>
                    Schedule Interview
                  </strong>

                  <small>
                    Create an interview slot
                  </small>

                </div>

              </button>


              <button
                type="button"
                className="candidate-action"
              >

                <Briefcase size={15} />

                <div>

                  <strong>
                    Move in Pipeline
                  </strong>

                  <small>
                    Change candidate stage
                  </small>

                </div>

              </button>

            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}


/* =========================================================
   PIPELINE STAGE
   ========================================================= */

function PipelineStage({
  label,
  index,
  currentStage,
}) {
  const active =
    index <= currentStage;

  const current =
    index === currentStage;

  return (
    <div
      className={`pipeline-stage ${
        active ? "active" : ""
      } ${current ? "current" : ""}`}
    >

      <div className="pipeline-dot">

        {active ? (
          <CheckCircle2 size={14} />
        ) : (
          <span />
        )}

      </div>


      <span>
        {label}
      </span>

    </div>
  );
}