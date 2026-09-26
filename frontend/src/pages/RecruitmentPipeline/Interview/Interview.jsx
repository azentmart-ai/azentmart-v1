import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  CalendarDays,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import "./Interview.css";

export default function Interview() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD PIPELINE
     ===================================================== */

  useEffect(() => {
    let mounted = true;

    const loadPipeline = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await api.pipeline();

        if (!mounted) return;

        let data = [];

        if (Array.isArray(result)) {
          data = result;
        } else if (Array.isArray(result?.data)) {
          data = result.data;
        } else if (Array.isArray(result?.items)) {
          data = result.items;
        } else if (Array.isArray(result?.results)) {
          data = result.results;
        } else if (Array.isArray(result?.applications)) {
          data = result.applications;
        } else if (Array.isArray(result?.candidates)) {
          data = result.candidates;
        }

        setRows(data);
      } catch (err) {
        console.error(
          "Interview pipeline error:",
          err
        );

        if (mounted) {
          setRows([]);
          setError(
            "Unable to load interview candidates."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPipeline();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     HELPERS
     ===================================================== */

  const normalize = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .trim()
      .toLowerCase();
  };

  const getName = (candidate) => {
    return (
      candidate?.candidate_name ||
      candidate?.name ||
      candidate?.full_name ||
      candidate?.candidate?.name ||
      candidate?.candidate?.full_name ||
      "Unnamed Candidate"
    );
  };

  const getEmail = (candidate) => {
    return (
      candidate?.email ||
      candidate?.candidate_email ||
      candidate?.candidate?.email ||
      "No email available"
    );
  };

  const getJob = (candidate) => {
    return (
      candidate?.job_title ||
      candidate?.position ||
      candidate?.job_name ||
      candidate?.job?.title ||
      candidate?.job?.name ||
      "Position not specified"
    );
  };

  const getId = (candidate) => {
    return (
      candidate?.candidate_id ||
      candidate?.candidate?.id ||
      candidate?.id ||
      null
    );
  };

  const getScore = (candidate) => {
    const score =
      candidate?.score ??
      candidate?.match_score ??
      candidate?.ai_score ??
      candidate?.matching_score ??
      0;

    const value = Number(score);

    return Number.isNaN(value)
      ? 0
      : Math.min(
          Math.max(value, 0),
          100
        );
  };

  const getSkills = (candidate) => {
    const skills =
      candidate?.skills ||
      candidate?.candidate?.skills ||
      [];

    if (Array.isArray(skills)) {
      return skills;
    }

    if (typeof skills === "string") {
      return skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const getStage = (candidate) => {
    return normalize(
      candidate?.stage ||
      candidate?.pipeline_stage ||
      candidate?.status ||
      ""
    )
      .replace(/-/g, "_")
      .replace(/\s+/g, "_");
  };

  /* =====================================================
     FILTER INTERVIEW CANDIDATES
     ===================================================== */

  const interviewRows = useMemo(() => {
    const search = normalize(query);

    return rows
      .filter((candidate) => {
        const stage = getStage(candidate);

        if (!stage) {
          return true;
        }

        return (
          stage === "interview" ||
          stage === "interviewing" ||
          stage === "scheduled" ||
          stage === "interview_scheduled" ||
          stage === "interview_stage"
        );
      })
      .filter((candidate) => {
        if (!search) {
          return true;
        }

        const name =
          normalize(getName(candidate));

        const email =
          normalize(getEmail(candidate));

        const job =
          normalize(getJob(candidate));

        const id =
          normalize(getId(candidate));

        const stage =
          normalize(getStage(candidate));

        const skills = getSkills(candidate)
          .map((skill) =>
            normalize(skill)
          )
          .join(" ");

        const searchableText = [
          name,
          email,
          job,
          id,
          stage,
          skills,
        ].join(" ");

        return searchableText.includes(
          search
        );
      });
  }, [rows, query]);

  /* =====================================================
     SUMMARY
     ===================================================== */

  const totalInterviews =
    interviewRows.length;

  const scheduledCount =
    interviewRows.filter((candidate) => {
      const status = normalize(
        candidate?.interview_status ||
        candidate?.status
      );

      return (
        status.includes("scheduled") ||
        status.includes("confirmed")
      );
    }).length;

  const pendingCount =
    interviewRows.filter((candidate) => {
      const status = normalize(
        candidate?.interview_status ||
        candidate?.status
      );

      return (
        status.includes("pending") ||
        status.includes("review")
      );
    }).length;

  const highMatchCount =
    interviewRows.filter(
      (candidate) =>
        getScore(candidate) >= 80
    ).length;

  /* =====================================================
     CLEAR SEARCH
     ===================================================== */

  const clearSearch = () => {
    setQuery("");
  };

  /* =====================================================
     PIPELINE STAGES
     ===================================================== */

  const pipelineStages = [
    {
      name: "Applied",
      path: "/pipeline/applied",
      key: "applied",
    },
    {
      name: "AI Screening",
      path: "/pipeline/ai-screening",
      key: "ai-screening",
    },
    {
      name: "Shortlisted",
      path: "/pipeline/shortlisted",
      key: "shortlisted",
    },
    {
      name: "Interview",
      path: "/pipeline/interview",
      key: "interview",
    },
    {
      name: "Offer",
      path: "/pipeline/offer",
      key: "offer",
    },
    {
      name: "Hired",
      path: "/pipeline/hired",
      key: "hired",
    },
  ];

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="workflow-page interview-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="workflow-header">

        <div className="page-heading">

          <span className="page-eyebrow">
            RECRUITMENT PIPELINE
          </span>

          <h1>
            Interview Candidates
          </h1>

          <p>
            Manage candidates who have progressed
            to the interview stage.
          </p>

        </div>

        <Link
          to="/pipeline/shortlisted"
          className="btn"
        >
          <Users size={14} />
          Shortlisted
        </Link>

      </div>


      {/* =================================================
          PIPELINE NAVIGATION
          INTERVIEW ACTIVE
      ================================================= */}

      <div className="stage-tabs">

        {pipelineStages.map((stage) => (

          <Link
            key={stage.key}
            to={stage.path}
            className={
              `stage-tab ${
                stage.key === "interview"
                  ? "active"
                  : ""
              }`
            }
          >
            {stage.name}
          </Link>

        ))}

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="search-panel">

        <div className="source-search-box">

          <Search
            size={16}
            className="search-icon"
          />

          <input
            type="text"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search candidate name, email, job or skill..."
            autoComplete="off"
          />

          {query && (

            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>

          )}

        </div>

        {query && (

          <div className="search-result-info">

            Showing{" "}

            <strong>
              {interviewRows.length}
            </strong>

            {" "}result
            {interviewRows.length !== 1
              ? "s"
              : ""}

            {" "}for "

            <strong>
              {query}
            </strong>

            "

          </div>

        )}

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="interview-summary-grid">

        {/* TOTAL */}

        <div className="summary-card">

          <div className="summary-icon">
            <Users size={17} />
          </div>

          <div className="summary-content">

            <span>
              Total Interviews
            </span>

            <strong>
              {totalInterviews}
            </strong>

            <small>
              Candidates in interview stage
            </small>

          </div>

        </div>


        {/* SCHEDULED */}

        <div className="summary-card">

          <div className="summary-icon">
            <CalendarDays size={17} />
          </div>

          <div className="summary-content">

            <span>
              Scheduled
            </span>

            <strong className="summary-blue">
              {scheduledCount}
            </strong>

            <small>
              Interviews scheduled
            </small>

          </div>

        </div>


        {/* PENDING */}

        <div className="summary-card">

          <div className="summary-icon">
            <Clock3 size={17} />
          </div>

          <div className="summary-content">

            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>

            <small>
              Need scheduling or review
            </small>

          </div>

        </div>


        {/* AI MATCH */}

        <div className="summary-card">

          <div className="summary-icon">
            <Sparkles size={17} />
          </div>

          <div className="summary-content">

            <span>
              High AI Match
            </span>

            <strong className="summary-blue">
              {highMatchCount}
            </strong>

            <small>
              80%+ match score
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          INTERVIEW PANEL
      ================================================= */}

      <div className="candidate-panel">

        <div className="candidate-panel-header">

          <div>

            <h3>
              Interview Pipeline
            </h3>

            <p>
              Review and manage candidates
              progressing through interviews.
            </p>

          </div>

          <span className="live-badge">

            <span className="live-dot"></span>

            Live pipeline

          </span>

        </div>


        {/* TABLE HEADER */}

        <div className="candidate-table-header">

          <div>
            CANDIDATE
          </div>

          <div>
            POSITION
          </div>

          <div>
            AI MATCH
          </div>

          <div>
            ACTION
          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="candidate-empty">

            <div className="empty-icon">
              <CalendarDays size={18} />
            </div>

            <strong>
              Loading interviews
            </strong>

            <span>
              Fetching the latest interview pipeline.
            </span>

          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="candidate-empty">

            <div className="empty-icon">
              <CalendarDays size={18} />
            </div>

            <strong>
              {error}
            </strong>

            <span>
              Check your backend connection
              and refresh the page.
            </span>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          interviewRows.length === 0 && (

            <div className="candidate-empty">

              <div className="empty-icon">
                <Users size={18} />
              </div>

              <strong>
                {query
                  ? "No candidates found"
                  : "No interview candidates"}
              </strong>

              <span>
                {query
                  ? `No interview candidate matches "${query}". Try another name, email, job or skill.`
                  : "Candidates moved into the interview stage will appear here."}
              </span>

              {query && (

                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={clearSearch}
                >
                  Clear search
                </button>

              )}

            </div>

          )}


        {/* CANDIDATE ROWS */}

        {!loading &&
          !error &&
          interviewRows.map((candidate) => {

            const name =
              getName(candidate);

            const email =
              getEmail(candidate);

            const job =
              getJob(candidate);

            const id =
              getId(candidate);

            const score =
              getScore(candidate);

            const skills =
              getSkills(candidate);

            const initials =
              name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map(
                  (part) =>
                    part.charAt(0)
                )
                .join("")
                .toUpperCase() || "C";

            return (

              <div
                className="candidate-row"
                key={
                  id ||
                  `${name}-${job}`
                }
              >

                {/* CANDIDATE */}

                <div className="candidate-cell">

                  <div className="candidate-info">

                    <div className="candidate-avatar">
                      {initials}
                    </div>

                    <div className="candidate-details">

                      <strong>
                        {name}
                      </strong>

                      <span>
                        {email}
                      </span>

                      {skills.length > 0 && (

                        <div className="candidate-skills">

                          {skills
                            .slice(0, 3)
                            .map((skill) => (

                              <span
                                className="skill-tag"
                                key={skill}
                              >
                                {skill}
                              </span>

                            ))}

                        </div>

                      )}

                    </div>

                  </div>

                </div>


                {/* POSITION */}

                <div className="candidate-cell">

                  <span className="position-title">
                    {job}
                  </span>

                </div>


                {/* SCORE */}

                <div className="candidate-cell score-cell">

                  <div className="score-wrapper">

                    <div className="score-top">

                      <span>
                        Match score
                      </span>

                      <strong>
                        {Math.round(score)}%
                      </strong>

                    </div>

                    <div className="score-progress">

                      <span
                        style={{
                          width:
                            `${score}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>


                {/* ACTION */}

                <div className="candidate-cell action-cell">

                  {id ? (

                    <Link
                      to={`/candidates/${id}`}
                      className="open-btn"
                    >
                      Review

                      <ArrowUpRight
                        size={13}
                      />

                    </Link>

                  ) : (

                    <button
                      type="button"
                      className="open-btn disabled"
                      disabled
                    >
                      Review
                    </button>

                  )}

                </div>

              </div>

            );
          })}

      </div>


      {/* =================================================
          NEXT STEP
      ================================================= */}

      {!loading &&
        !error &&
        interviewRows.length > 0 && (

          <div className="next-step-card">

            <div className="next-step-icon">
              <CheckCircle2 size={18} />
            </div>

            <div className="next-step-content">

              <strong>
                Complete Interview Evaluation
              </strong>

              <p>
                Review interview feedback and move
                selected candidates toward the offer stage.
              </p>

            </div>

            <Link
              to="/pipeline/offer"
              className="btn primary"
            >
              View Offers
              <ArrowUpRight size={13} />
            </Link>

          </div>

        )}

    </div>
  );
}