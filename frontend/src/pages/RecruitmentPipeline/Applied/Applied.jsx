import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Briefcase,
  Sparkles,
  Calendar,
  ArrowRight,
  UserCheck,
  Clock,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import "./Applied.css";

export default function Applied() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* =====================================================
     LOAD APPLICATIONS
     ===================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadApplications() {
      try {
        setLoading(true);

        const response = await api.pipeline();

        if (!mounted) {
          return;
        }

        let data = [];

        if (Array.isArray(response)) {
          data = response;
        } else if (Array.isArray(response?.data)) {
          data = response.data;
        } else if (Array.isArray(response?.applications)) {
          data = response.applications;
        } else if (Array.isArray(response?.rows)) {
          data = response.rows;
        } else if (Array.isArray(response?.results)) {
          data = response.results;
        } else if (Array.isArray(response?.candidates)) {
          data = response.candidates;
        }

        const appliedCandidates = data.filter(
          (candidate) => {
            const stage = String(
              candidate?.stage ||
                candidate?.status ||
                candidate?.pipeline_stage ||
                ""
            )
              .toLowerCase()
              .replace(/-/g, "_")
              .replace(/\s+/g, "_");

            return (
              stage === "applied" ||
              stage === "application" ||
              stage === "new"
            );
          }
        );

        setRows(appliedCandidates);
      } catch (error) {
        console.error(
          "Failed to load applied candidates:",
          error
        );

        if (mounted) {
          setRows([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     HELPERS
     ===================================================== */

  const getCandidateName = (candidate) => {
    return (
      candidate?.candidate_name ||
      candidate?.name ||
      candidate?.full_name ||
      candidate?.candidate?.name ||
      candidate?.candidate?.full_name ||
      "Unknown Candidate"
    );
  };

  const getCandidateEmail = (candidate) => {
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
      candidate?.title ||
      candidate?.position ||
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

  const getInitials = (name) => {
    if (!name) {
      return "C";
    }

    const words = String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`
      .toUpperCase();
  };

  /* =====================================================
     SEARCH
     ===================================================== */

  const filteredRows = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((candidate) => {
      const name =
        getCandidateName(candidate)
          .toLowerCase();

      const email =
        getCandidateEmail(candidate)
          .toLowerCase();

      const job =
        getJobTitle(candidate)
          .toLowerCase();

      const id = String(
        getCandidateId(candidate) || ""
      ).toLowerCase();

      const skills = getSkills(candidate)
        .join(" ")
        .toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        job.includes(query) ||
        id.includes(query) ||
        skills.includes(query)
      );
    });
  }, [rows, search]);

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
     CLEAR SEARCH
     ===================================================== */

  const clearSearch = () => {
    setSearch("");
  };

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="workflow-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="workflow-header">

        <div className="page-heading">

          <div className="page-eyebrow">
            RECRUITMENT PIPELINE
          </div>

          <h1>
            Applied Candidates
          </h1>

          <p>
            Review candidates who have applied
            to your open positions.
          </p>

        </div>

        <Link
          to="/ai-recruiter/candidate-matching"
          className="btn primary"
        >
          <Sparkles size={14} />
          Candidate Matching
        </Link>

      </div>


      {/* =================================================
          PIPELINE NAVIGATION
      ================================================= */}

      <div className="stage-tabs">

        {pipelineStages.map((stage) => (

          <Link
            key={stage.key}
            to={stage.path}
            className={
              `stage-tab ${
                stage.key === "applied"
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

          <Search size={16} />

          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search candidate name, email, job or skill..."
            autoComplete="off"
          />

          {search && (

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

        {search && (

          <div className="search-result-info">

            Showing{" "}

            <strong>
              {filteredRows.length}
            </strong>

            {" "}result
            {filteredRows.length !== 1
              ? "s"
              : ""}

            {" "}for "

            <strong>
              {search}
            </strong>

            "

          </div>

        )}

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="applied-summary-grid">

        {/* TOTAL APPLIED */}

        <div className="summary-card">

          <div className="summary-icon">
            <Users size={17} />
          </div>

          <div className="summary-content">

            <span>
              Total Applied
            </span>

            <strong>
              {rows.length}
            </strong>

            <small>
              Candidates in applied stage
            </small>

          </div>

        </div>


        {/* ACTIVE APPLICATIONS */}

        <div className="summary-card">

          <div className="summary-icon">
            <Briefcase size={17} />
          </div>

          <div className="summary-content">

            <span>
              Active Applications
            </span>

            <strong>
              {filteredRows.length}
            </strong>

            <small>
              Matching current search
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
              Ready
            </strong>

            <small>
              Next recruitment stage
            </small>

          </div>

        </div>


        {/* NEXT STAGE */}

        <div className="summary-card">

          <div className="summary-icon">
            <Calendar size={17} />
          </div>

          <div className="summary-content">

            <span>
              Next Stage
            </span>

            <strong>
              Screening
            </strong>

            <small>
              AI candidate evaluation
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          CANDIDATE TABLE
      ================================================= */}

      <div className="candidate-panel">

        {/* PANEL HEADER */}

        <div className="candidate-panel-header">

          <div>

            <h3>
              Applied Candidates
            </h3>

            <p>
              Candidates currently in the
              applied stage.
            </p>

          </div>

          <span className="live-badge">

            <span className="live-dot"></span>

            Live pipeline

          </span>

        </div>


        {/* COLUMN HEADINGS */}

        {!loading &&
          filteredRows.length > 0 && (

            <div className="candidate-table-header">

              <div>
                Candidate
              </div>

              <div>
                Position
              </div>

              <div>
                Stage
              </div>

              <div>
                Action
              </div>

            </div>

          )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="candidate-empty">

            <div className="empty-icon">
              <Clock size={20} />
            </div>

            <strong>
              Loading candidates
            </strong>

            <span>
              Fetching the latest applications...
            </span>

          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          filteredRows.length === 0 && (

            <div className="candidate-empty">

              <div className="empty-icon">
                <Users size={20} />
              </div>

              <strong>
                {search
                  ? "No candidates found"
                  : "No applied candidates found"}
              </strong>

              <span>
                {search
                  ? `No candidate matches "${search}". Try another name, email, job or skill.`
                  : "Candidates will appear here when they apply to a position."}
              </span>

              {search && (

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
            CANDIDATES
        ================================================= */}

        {!loading &&
          filteredRows.map(
            (candidate, index) => {

              const name =
                getCandidateName(candidate);

              const email =
                getCandidateEmail(candidate);

              const jobTitle =
                getJobTitle(candidate);

              const candidateId =
                getCandidateId(candidate);

              return (

                <div
                  className="candidate-row"
                  key={
                    candidateId ||
                    `${name}-${index}`
                  }
                >

                  {/* =======================================
                      CANDIDATE
                  ======================================= */}

                  <div className="candidate-cell candidate-info">

                    <div className="candidate-avatar">
                      {getInitials(name)}
                    </div>

                    <div className="candidate-details">

                      <strong>
                        {name}
                      </strong>

                      <span>
                        {email}
                      </span>

                    </div>

                  </div>


                  {/* =======================================
                      POSITION
                  ======================================= */}

                  <div className="candidate-cell position-cell">

                    <span className="position-label">
                      Position
                    </span>

                    <strong>
                      {jobTitle}
                    </strong>

                  </div>


                  {/* =======================================
                      STAGE
                  ======================================= */}

                  <div className="candidate-cell stage-cell">

                    <span className="stage-label">
                      Current stage
                    </span>

                    <span className="stage-badge">

                      <UserCheck size={11} />

                      Applied

                    </span>

                  </div>


                  {/* =======================================
                      ACTION
                  ======================================= */}

                  <div className="candidate-cell action-cell">

                    {candidateId ? (

                      <Link
                        to={`/candidates/${candidateId}`}
                        className="open-btn"
                      >
                        Open
                        <ArrowRight size={13} />
                      </Link>

                    ) : (

                      <button
                        type="button"
                        className="open-btn disabled"
                        disabled
                      >
                        Open
                      </button>

                    )}

                  </div>

                </div>

              );
            }
          )}

      </div>


      {/* =================================================
          NEXT STEP
      ================================================= */}

      {!loading &&
        rows.length > 0 && (

          <div className="next-step-card">

            <div className="next-step-icon">
              <Sparkles size={18} />
            </div>

            <div className="next-step-content">

              <strong>
                Ready for AI Screening?
              </strong>

              <p>
                Move applied candidates into AI
                Screening to evaluate skills,
                experience and job-match signals.
              </p>

            </div>

            <Link
              to="/pipeline/ai-screening"
              className="btn primary"
            >
              Start Screening
              <ArrowRight size={13} />
            </Link>

          </div>

        )}

    </div>
  );
}