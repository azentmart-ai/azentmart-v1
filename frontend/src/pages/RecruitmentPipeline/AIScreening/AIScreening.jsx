import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Search,
  ArrowUpRight,
  Users,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import "./AIScreening.css";

export default function AIScreening() {
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
        console.error("AI Screening load error:", err);

        if (mounted) {
          setError(
            err?.message ||
              "Unable to load screening candidates."
          );
          setRows([]);
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

  const getCandidateName = (candidate) => {
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

  const getJobTitle = (candidate) => {
    return (
      candidate?.job_title ||
      candidate?.position ||
      candidate?.job_name ||
      candidate?.job?.title ||
      candidate?.job?.name ||
      "Position not specified"
    );
  };

  const getCandidateId = (candidate) => {
    return (
      candidate?.candidate_id ||
      candidate?.candidate?.id ||
      candidate?.id ||
      null
    );
  };

  const getScore = (candidate) => {
    const value = Number(
      candidate?.score ??
        candidate?.match_score ??
        candidate?.ai_score ??
        candidate?.matching_score ??
        0
    );

    if (Number.isNaN(value)) {
      return 0;
    }

    return Math.min(
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
        .map((skill) => skill.trim())
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
     FILTER AI SCREENING CANDIDATES
     ===================================================== */

  const screeningRows = useMemo(() => {
    const search = normalize(query);

    return rows
      .filter((candidate) => {
        const stage = getStage(candidate);

        return (
          stage === "ai_screening" ||
          stage === "ai-screening" ||
          stage === "screening" ||
          stage === "ai_screening_stage"
        );
      })
      .filter((candidate) => {
        if (!search) {
          return true;
        }

        const name = normalize(
          getCandidateName(candidate)
        );

        const email = normalize(
          getEmail(candidate)
        );

        const job = normalize(
          getJobTitle(candidate)
        );

        const id = normalize(
          getCandidateId(candidate)
        );

        const stage = normalize(
          getStage(candidate)
        );

        const skills = getSkills(candidate)
          .map((skill) => normalize(skill))
          .join(" ");

        const searchableText = [
          name,
          email,
          job,
          id,
          stage,
          skills,
        ].join(" ");

        return searchableText.includes(search);
      });
  }, [rows, query]);

  /* =====================================================
     SUMMARY
     ===================================================== */

  const totalScreening =
    screeningRows.length;

  const readyCount =
    screeningRows.filter(
      (candidate) => {
        const status = normalize(
          candidate?.screening_status ||
            candidate?.status
        );

        return (
          status === "ready" ||
          status === "pending" ||
          status === "review"
        );
      }
    ).length;

  const completedCount =
    screeningRows.filter(
      (candidate) => {
        const status = normalize(
          candidate?.screening_status ||
            candidate?.status
        );

        return (
          status === "completed" ||
          status === "complete"
        );
      }
    ).length;

  /* =====================================================
     CLEAR SEARCH
     ===================================================== */

  const clearSearch = () => {
    setQuery("");
  };

  /* =====================================================
     PIPELINE NAVIGATION
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
    <div className="workflow-page ai-screening-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="workflow-header">

        <div className="page-heading">

          <span className="page-eyebrow">
            RECRUITMENT PIPELINE
          </span>

          <h1>
            AI Screening
          </h1>

          <p>
            Review candidates using AI-powered
            screening signals before moving them
            to the shortlist.
          </p>

        </div>

        <Link
          className="btn primary"
          to="/ai-recruiter/candidate-matching"
        >
          <Sparkles size={14} />
          Candidate Matching
        </Link>

      </div>


      {/* =================================================
          PIPELINE TABS
      ================================================= */}

      <div className="stage-tabs">

        {pipelineStages.map((stage) => (

          <Link
            key={stage.key}
            to={stage.path}
            className={
              `stage-tab ${
                stage.key === "ai-screening"
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

          <Search size={15} />

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
              {screeningRows.length}
            </strong>

            {" "}
            result
            {screeningRows.length !== 1
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

      <div className="applied-summary-grid">

        {/* TOTAL */}

        <div className="summary-card">

          <div className="summary-icon">
            <Users size={17} />
          </div>

          <div className="summary-content">

            <span>
              Total Screening
            </span>

            <strong>
              {totalScreening}
            </strong>

            <small>
              Candidates in screening
            </small>

          </div>

        </div>


        {/* AI SCREENING */}

        <div className="summary-card">

          <div className="summary-icon">
            <Sparkles size={17} />
          </div>

          <div className="summary-content">

            <span>
              AI Screening
            </span>

            <strong className="summary-blue">
              {totalScreening}
            </strong>

            <small>
              AI evaluation active
            </small>

          </div>

        </div>


        {/* READY */}

        <div className="summary-card">

          <div className="summary-icon">
            <Clock3 size={17} />
          </div>

          <div className="summary-content">

            <span>
              Ready for Review
            </span>

            <strong>
              {readyCount}
            </strong>

            <small>
              Waiting for recruiter review
            </small>

          </div>

        </div>


        {/* COMPLETED */}

        <div className="summary-card">

          <div className="summary-icon">
            <CheckCircle2 size={17} />
          </div>

          <div className="summary-content">

            <span>
              Completed
            </span>

            <strong>
              {completedCount}
            </strong>

            <small>
              Screening completed
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          MAIN PANEL
      ================================================= */}

      <div className="candidate-panel">

        {/* PANEL HEADER */}

        <div className="candidate-panel-header">

          <div>

            <h3>
              AI Screening Candidates
            </h3>

            <p>
              Candidates currently being evaluated
              by the screening workflow.
            </p>

          </div>

          <span className="live-badge">

            <span className="live-dot"></span>

            Live screening

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
            SCREENING
          </div>

          <div>
            ACTION
          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="candidate-empty">

            <div className="empty-icon">
              <Sparkles size={18} />
            </div>

            <strong>
              Loading candidates
            </strong>

            <span>
              Fetching the latest screening
              pipeline.
            </span>

          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className="candidate-empty">

            <div className="empty-icon">
              <Sparkles size={18} />
            </div>

            <strong>
              {error}
            </strong>

            <span>
              Please refresh the page and try again.
            </span>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          screeningRows.length === 0 && (

            <div className="candidate-empty">

              <div className="empty-icon">
                <Users size={18} />
              </div>

              <strong>
                {query
                  ? "No candidates found"
                  : "No candidates in AI Screening"}
              </strong>

              <span>
                {query
                  ? `No screening candidate matches "${query}". Try another name, email, job or skill.`
                  : "Candidates will appear here when AI screening begins."}
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


        {/* CANDIDATES */}

        {!loading &&
          !error &&
          screeningRows.map((candidate) => {

            const candidateName =
              getCandidateName(candidate);

            const email =
              getEmail(candidate);

            const jobTitle =
              getJobTitle(candidate);

            const candidateId =
              getCandidateId(candidate);

            const score =
              getScore(candidate);

            const skills =
              getSkills(candidate);

            const status =
              candidate?.screening_status ||
              candidate?.status ||
              "Ready";

            const initials =
              candidateName
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
                  candidateId ||
                  `${candidateName}-${jobTitle}`
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
                        {candidateName}
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

                <div className="candidate-cell position-cell">

                  <strong>
                    {jobTitle}
                  </strong>

                </div>


                {/* SCREENING */}

                <div className="candidate-cell stage-cell">

                  <span className="stage-badge">

                    <Sparkles size={10} />

                    {String(status)
                      .replace(/_/g, " ")}

                  </span>

                </div>


                {/* ACTION */}

                <div className="candidate-cell action-cell">

                  {candidateId ? (

                    <Link
                      className="open-btn"
                      to={`/candidates/${candidateId}`}
                    >
                      Review
                      <ArrowUpRight size={12} />
                    </Link>

                  ) : (

                    <span className="open-btn">
                      Review
                    </span>

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
        screeningRows.length > 0 && (

          <div className="next-step-card">

            <div className="next-step-icon">
              <Sparkles size={18} />
            </div>

            <div className="next-step-content">

              <strong>
                Continue with Candidate Matching
              </strong>

              <p>
                Compare screened candidates against
                saved job requirements and generate
                matching scores.
              </p>

            </div>

            <Link
              className="btn primary"
              to="/ai-recruiter/candidate-matching"
            >
              Run Matching
              <ArrowUpRight size={13} />
            </Link>

          </div>

        )}

    </div>
  );
}