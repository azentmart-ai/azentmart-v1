import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Sparkles,
  ArrowUpRight,
  Search,
  CheckCircle2,
  BriefcaseBusiness,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import "./Hired.css";

export default function Hired() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  /* =====================================================
     LOAD PIPELINE
     ===================================================== */

  useEffect(() => {
    let mounted = true;

    const loadPipeline = async () => {
      try {
        setLoading(true);
        setMsg("");

        const result = await api.pipeline();

        if (!mounted) return;

        let data = [];

        /*
         * Support different API response formats.
         */

        if (Array.isArray(result)) {
          data = result;
        } else if (Array.isArray(result?.data)) {
          data = result.data;
        } else if (Array.isArray(result?.items)) {
          data = result.items;
        } else if (Array.isArray(result?.results)) {
          data = result.results;
        } else if (Array.isArray(result?.candidates)) {
          data = result.candidates;
        }

        setRows(data);
      } catch (error) {
        console.error("Hired pipeline error:", error);

        if (mounted) {
          setRows([]);
          setMsg(
            error?.message ||
              "Unable to load hired candidates."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPipeline();

    /*
     * IMPORTANT:
     * React receives a real cleanup function here.
     * The API Promise is NOT returned from useEffect.
     */

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
    const value =
      candidate?.score ??
      candidate?.match_score ??
      candidate?.ai_score ??
      candidate?.matching_score ??
      0;

    const score = Number(value);

    if (Number.isNaN(score)) {
      return 0;
    }

    return Math.min(
      Math.max(score, 0),
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
     FILTER HIRED CANDIDATES
     ===================================================== */

  const hiredRows = useMemo(() => {
    const search = normalize(query);

    return rows
      .filter((candidate) => {
        const stage = getStage(candidate);

        /*
         * Support different backend stage values.
         */

        if (!stage) {
          return true;
        }

        return (
          stage === "hired" ||
          stage === "hire" ||
          stage === "hired_stage" ||
          stage === "joined" ||
          stage === "employee"
        );
      })
      .filter((candidate) => {
        /*
         * Show all hired candidates
         * when there is no search query.
         */

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

        /*
         * Search candidate name,
         * email, job, ID, stage and skills.
         */

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

  const totalHired = hiredRows.length;

  const highMatchCount = hiredRows.filter(
    (candidate) =>
      getScore(candidate) >= 80
  ).length;

  const joinedCount = hiredRows.filter(
    (candidate) => {
      const status = normalize(
        candidate?.hiring_status ||
        candidate?.status
      );

      return (
        status.includes("joined") ||
        status.includes("active") ||
        status.includes("employee")
      );
    }
  ).length;

  const completedCount = hiredRows.filter(
    (candidate) => {
      const status = normalize(
        candidate?.hiring_status ||
        candidate?.status
      );

      return (
        status.includes("completed") ||
        status.includes("closed")
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
     PIPELINE TABS
     ===================================================== */

  const stages = [
    {
      name: "Applied",
      path: "/pipeline/applied",
    },
    {
      name: "AI Screening",
      path: "/pipeline/ai-screening",
    },
    {
      name: "Shortlisted",
      path: "/pipeline/shortlisted",
    },
    {
      name: "Interview",
      path: "/pipeline/interview",
    },
    {
      name: "Offer",
      path: "/pipeline/offer",
    },
    {
      name: "Hired",
      path: "/pipeline/hired",
    },
  ];

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="workflow-page hired-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="workflow-header">

        <div className="page-heading">

          <span className="page-eyebrow">
            RECRUITMENT PIPELINE
          </span>

          <h1>
            Hired Candidates
          </h1>

          <p>
            Candidates who have completed the
            recruitment and hiring workflow.
          </p>

        </div>

        <div className="hired-live-badge">

          <span className="live-dot"></span>

          <Sparkles size={13} />

          Live pipeline

        </div>

      </div>


      {/* =================================================
          PIPELINE TABS
      ================================================= */}

      <div className="stage-tabs">

        {stages.map((stage) => (

          <Link
            key={stage.name}
            to={stage.path}
            className={
              "stage-tab " +
              (
                stage.name === "Hired"
                  ? "active"
                  : ""
              )
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
            onChange={(event) =>
              setQuery(event.target.value)
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
              {hiredRows.length}
            </strong>

            {" "}result
            {hiredRows.length !== 1
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

      <div className="hired-summary-grid">

        {/* TOTAL HIRED */}

        <div className="summary-card">

          <div className="summary-icon">
            <Users size={17} />
          </div>

          <div className="summary-content">

            <span>
              Total Hired
            </span>

            <strong>
              {totalHired}
            </strong>

            <small>
              Completed candidates
            </small>

          </div>

        </div>


        {/* HIGH MATCH */}

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


        {/* JOINED */}

        <div className="summary-card">

          <div className="summary-icon">
            <BriefcaseBusiness size={17} />
          </div>

          <div className="summary-content">

            <span>
              Joined
            </span>

            <strong>
              {joinedCount}
            </strong>

            <small>
              Candidates onboarded
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
              Hiring workflow completed
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && msg && (

        <div className="hired-alert">

          <Sparkles size={14} />

          <span>
            {msg}
          </span>

        </div>

      )}


      {/* =================================================
          HIRED PANEL
      ================================================= */}

      <div className="candidate-panel">

        <div className="candidate-panel-header">

          <div>

            <h3>
              Hired Candidates
            </h3>

            <p>
              Candidates who have completed
              the hiring workflow.
            </p>

          </div>

          <span className="pipeline-count">

            {hiredRows.length}

            {" "}

            candidate
            {hiredRows.length !== 1
              ? "s"
              : ""}

          </span>

        </div>


        {/* =================================================
            TABLE HEADER
        ================================================= */}

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


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="candidate-empty">

            <div className="empty-icon">
              <Sparkles size={18} />
            </div>

            <strong>
              Loading hired candidates
            </strong>

            <span>
              Fetching the latest recruitment pipeline.
            </span>

          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !msg &&
          hiredRows.length === 0 && (

            <div className="candidate-empty">

              <div className="empty-icon">
                <Users size={18} />
              </div>

              <strong>
                {query
                  ? "No candidates found"
                  : "No hired candidates"}
              </strong>

              <span>
                {query
                  ? `No hired candidate matches "${query}". Try another name, email, job or skill.`
                  : "Candidates who complete the hiring workflow will appear here."}
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


        {/* =================================================
            CANDIDATE ROWS
        ================================================= */}

        {!loading &&
          hiredRows.map((candidate) => {

            const name =
              getCandidateName(candidate);

            const email =
              getEmail(candidate);

            const job =
              getJobTitle(candidate);

            const id =
              getCandidateId(candidate);

            const score =
              getScore(candidate);

            const skills =
              getSkills(candidate);

            const initials =
              name
                .split(" ")
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

                {/* =========================================
                    CANDIDATE
                ========================================= */}

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


                {/* =========================================
                    POSITION
                ========================================= */}

                <div className="candidate-cell">

                  <span className="position-title">
                    {job}
                  </span>

                </div>


                {/* =========================================
                    AI SCORE
                ========================================= */}

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


                {/* =========================================
                    ACTION
                ========================================= */}

                <div className="candidate-cell action-cell">

                  {id ? (

                    <Link
                      className="open-btn"
                      to={`/candidates/${id}`}
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
        hiredRows.length > 0 && (

          <div className="next-step-card">

            <div className="next-step-icon">
              <CheckCircle2 size={18} />
            </div>

            <div className="next-step-content">

              <strong>
                Hiring Workflow Completed
              </strong>

              <p>
                These candidates have successfully
                completed the recruitment pipeline.
              </p>

            </div>

            <Link
              className="btn"
              to="/pipeline/offer"
            >
              View Offers
              <ArrowUpRight size={13} />
            </Link>

          </div>

        )}

    </div>
  );
}