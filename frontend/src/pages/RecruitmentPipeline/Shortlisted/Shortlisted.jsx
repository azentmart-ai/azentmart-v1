import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  ArrowUpRight,
  Users,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import "./Shortlisted.css";

export default function Shortlisted() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD CANDIDATES
     ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadCandidates = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await api.pipeline();

        if (!mounted) {
          return;
        }

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
          "Failed to load shortlisted candidates:",
          err
        );

        if (mounted) {
          setRows([]);
          setError(
            "Unable to load candidates. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCandidates();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     HELPERS
     ========================================================= */

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

  const getCandidateEmail = (candidate) => {
    return (
      candidate?.email ||
      candidate?.candidate_email ||
      candidate?.candidate?.email ||
      candidate?.contact_email ||
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

    const number = Number(value);

    if (Number.isNaN(number)) {
      return 0;
    }

    return Math.min(
      Math.max(number, 0),
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

  /* =========================================================
     FILTER SHORTLISTED + SEARCH
     ========================================================= */

  const shortlistedRows = useMemo(() => {
    const search = normalize(query);

    return rows
      .filter((candidate) => {
        const stage = normalize(
          candidate?.stage ||
            candidate?.pipeline_stage ||
            candidate?.status
        );

        if (!stage) {
          return true;
        }

        const normalizedStage = stage
          .replace(/-/g, "_")
          .replace(/\s+/g, "_");

        return (
          normalizedStage === "shortlisted" ||
          normalizedStage === "shortlist" ||
          normalizedStage === "selected" ||
          normalizedStage === "ai_shortlisted" ||
          normalizedStage === "ai_shortlist"
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
          getCandidateEmail(candidate)
        );

        const jobTitle = normalize(
          getJobTitle(candidate)
        );

        const candidateId = normalize(
          getCandidateId(candidate)
        );

        const stage = normalize(
          candidate?.stage ||
            candidate?.pipeline_stage ||
            candidate?.status ||
            ""
        );

        const skills = getSkills(candidate)
          .map((skill) => normalize(skill))
          .join(" ");

        const searchableText = [
          name,
          email,
          jobTitle,
          candidateId,
          stage,
          skills,
        ].join(" ");

        return searchableText.includes(search);
      });
  }, [rows, query]);

  /* =========================================================
     SUMMARY
     ========================================================= */

  const totalShortlisted =
    shortlistedRows.length;

  const highMatchCount =
    shortlistedRows.filter(
      (candidate) =>
        getScore(candidate) >= 80
    ).length;

  const reviewCount =
    shortlistedRows.filter((candidate) => {
      const status = normalize(
        candidate?.status
      );

      return (
        status === "pending" ||
        status === "review" ||
        status === "ready"
      );
    }).length;

  const selectedCount =
    shortlistedRows.filter((candidate) => {
      const status = normalize(
        candidate?.status
      );

      return (
        status === "selected" ||
        status === "approved" ||
        status === "hired"
      );
    }).length;

  /* =========================================================
     CLEAR SEARCH
     ========================================================= */

  const clearSearch = () => {
    setQuery("");
  };

  /* =========================================================
     PIPELINE STAGES
     ========================================================= */

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

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="workflow-page shortlisted-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="workflow-header">

        <div className="page-heading">

          <span className="page-eyebrow">
            RECRUITMENT PIPELINE
          </span>

          <h1>
            Shortlisted Candidates
          </h1>

          <p>
            Review candidates who have been
            shortlisted after AI screening and
            recruiter evaluation.
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


      {/* =====================================================
          PIPELINE NAVIGATION
          SHORTLISTED ACTIVE
          ===================================================== */}

      <div className="stage-tabs">

        {pipelineStages.map((stage) => (

          <Link
            key={stage.key}
            to={stage.path}
            className={
              `stage-tab ${
                stage.key === "shortlisted"
                  ? "active"
                  : ""
              }`
            }
          >
            {stage.name}
          </Link>

        ))}

      </div>


      {/* =====================================================
          SEARCH
          ===================================================== */}

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
              {shortlistedRows.length}
            </strong>

            {" "}result
            {shortlistedRows.length !== 1
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


      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <div className="applied-summary-grid">

        <div className="summary-card">

          <div className="summary-icon">
            <Users size={17} />
          </div>

          <div className="summary-content">

            <span>
              Total Shortlisted
            </span>

            <strong>
              {totalShortlisted}
            </strong>

            <small>
              Active candidates
            </small>

          </div>

        </div>


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


        <div className="summary-card">

          <div className="summary-icon">
            <Clock3 size={17} />
          </div>

          <div className="summary-content">

            <span>
              Pending Review
            </span>

            <strong>
              {reviewCount}
            </strong>

            <small>
              Need recruiter action
            </small>

          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon">
            <CheckCircle2 size={17} />
          </div>

          <div className="summary-content">

            <span>
              Selected
            </span>

            <strong>
              {selectedCount}
            </strong>

            <small>
              Ready for next stage
            </small>

          </div>

        </div>

      </div>


      {/* =====================================================
          CANDIDATE TABLE
          ===================================================== */}

      <div className="candidate-panel">

        <div className="candidate-panel-header">

          <div>

            <h3>
              Shortlisted Candidates
            </h3>

            <p>
              Candidates currently available
              for recruiter review.
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
              <Sparkles size={18} />
            </div>

            <strong>
              Loading candidates
            </strong>

            <span>
              Fetching the latest recruitment pipeline.
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
              Check your backend connection
              and refresh the page.
            </span>

          </div>

        )}


        {/* NO RESULTS */}

        {!loading &&
          !error &&
          shortlistedRows.length === 0 && (

            <div className="candidate-empty">

              <div className="empty-icon">
                <Users size={18} />
              </div>

              <strong>
                {query
                  ? "No candidates found"
                  : "No shortlisted candidates"}
              </strong>

              <span>
                {query
                  ? `No candidate matches "${query}". Try another name, email, job or skill.`
                  : "Candidates moved into the shortlisted stage will appear here."}
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
          shortlistedRows.map((candidate) => {

            const candidateName =
              getCandidateName(candidate);

            const candidateEmail =
              getCandidateEmail(candidate);

            const jobTitle =
              getJobTitle(candidate);

            const candidateId =
              getCandidateId(candidate);

            const score =
              getScore(candidate);

            const skills =
              getSkills(candidate);

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
                        {candidateEmail}
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

                  <span className="position-title">
                    {jobTitle}
                  </span>

                </div>


                {/* AI SCORE */}

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
                          width: `${score}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>


                {/* ACTION */}

                <div className="candidate-cell action-cell">

                  {candidateId ? (

                    <Link
                      className="open-btn"
                      to={`/candidates/${candidateId}`}
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


      {/* =====================================================
          NEXT STEP
          ===================================================== */}

      {!loading &&
        !error &&
        shortlistedRows.length > 0 && (

          <div className="next-step-card">

            <div className="next-step-icon">
              <CheckCircle2 size={18} />
            </div>

            <div className="next-step-content">

              <strong>
                Continue to Interview
              </strong>

              <p>
                Move shortlisted candidates into
                the interview stage when they are ready.
              </p>

            </div>

            <Link
              className="btn primary"
              to="/pipeline/interview"
            >
              View Interviews
              <ArrowUpRight size={13} />
            </Link>

          </div>

        )}

    </div>
  );
}