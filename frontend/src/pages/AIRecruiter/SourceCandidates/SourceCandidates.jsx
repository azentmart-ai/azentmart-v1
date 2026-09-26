import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { api } from "../../../lib/api";
import { Link } from "react-router-dom";
import "./SourceCandidates.css";

export default function SourceCandidates() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD CANDIDATES
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadCandidates = async () => {
      try {
        setLoading(true);

        const response = await api.candidates();

        /*
          Backend may return:

          1. [...]
          2. { candidates: [...] }
          3. { data: [...] }
          4. { items: [...] }
        */

        let candidateList = [];

        if (Array.isArray(response)) {
          candidateList = response;
        } else if (Array.isArray(response?.candidates)) {
          candidateList = response.candidates;
        } else if (Array.isArray(response?.data)) {
          candidateList = response.data;
        } else if (Array.isArray(response?.items)) {
          candidateList = response.items;
        }

        if (mounted) {
          setRows(candidateList);
        }
      } catch (error) {
        console.error("Failed to load candidates:", error);

        if (mounted) {
          setRows([]);
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
     NORMALIZE SKILLS
  ========================================================= */

  const getSkills = (candidate) => {
    if (Array.isArray(candidate?.skills)) {
      return candidate.skills;
    }

    if (typeof candidate?.skills === "string") {
      return candidate.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filtered = rows.filter((candidate) => {
    const skills = getSkills(candidate);

    const searchableText = `
      ${candidate?.name || ""}
      ${candidate?.email || ""}
      ${skills.join(" ")}
    `.toLowerCase();

    return searchableText.includes(q.toLowerCase());
  });

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="workflow-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="workflow-header">

        <div>
          <h1>Source Candidates</h1>

          <p>
            Search the live candidate database and prepare
            profiles for matching.
          </p>
        </div>

        <Link
          className="btn primary"
          to="/candidates"
        >
          <Users size={14} />

          Manage candidates
        </Link>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="workflow-card">

        <div className="source-search-box">

          <Search size={15} />

          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email or skill..."
          />

        </div>

      </div>


      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div
        className="workflow-grid"
        style={{ marginTop: 18 }}
      >

        {/* ===================================================
            CANDIDATE SOURCE
        =================================================== */}

        <div className="workflow-card">

          <div className="result-head">

            <div>

              <h3>
                Candidate source
              </h3>

              <small>
                {loading
                  ? "Loading profiles..."
                  : `${filtered.length} live profiles`}
              </small>

            </div>

          

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="workflow-empty">

              <Sparkles size={18} />

              <span>
                Loading candidates...
              </span>

            </div>
          )}


          {/* =================================================
              CANDIDATES
          ================================================= */}

          {!loading &&
            filtered.map((candidate, index) => {

              const skills = getSkills(candidate);

              return (
                <div
                  className="workflow-item"
                  key={
                    candidate?.id ??
                    candidate?.email ??
                    index
                  }
                >

                  {/* ICON */}

                  <div className="workflow-icon">
                    <Users size={16} />
                  </div>


                  {/* CONTENT */}

                  <div className="workflow-item-main">

                    <strong>
                      {candidate?.name || "Unnamed Candidate"}
                    </strong>

                    <small>
                      {candidate?.email || "No email"}{" "}
                      ·{" "}
                      {candidate?.experience || 0} yrs
                    </small>


                    {/* SKILLS */}

                    <div className="workflow-chips">

                      {skills
                        .slice(0, 5)
                        .map((skill, skillIndex) => (
                          <span
                            className="workflow-chip"
                            key={`${skill}-${skillIndex}`}
                          >
                            {skill}
                          </span>
                        ))}

                    </div>

                  </div>


                  {/* OPEN */}

                  {candidate?.id && (
                    <Link
                      className="btn"
                      to={`/candidates/${candidate.id}`}
                    >
                      Open
                    </Link>
                  )}

                </div>
              );
            })}


          {/* =================================================
              EMPTY SEARCH RESULT
          ================================================= */}

          {!loading &&
            rows.length > 0 &&
            filtered.length === 0 && (
              <div className="workflow-empty">

                <Search size={18} />

                <span>
                  No candidate profiles match this search.
                </span>

              </div>
            )}


          {/* =================================================
              NO CANDIDATES
          ================================================= */}

          {!loading &&
            rows.length === 0 && (
              <div className="workflow-empty">

                <Users size={18} />

                <span>
                  No candidate profiles are available.
                </span>

              </div>
            )}

        </div>


        {/* ===================================================
            SOURCING WORKFLOW
        =================================================== */}

        <div className="workflow-card">

          <h3>
            Sourcing workflow
          </h3>

          <p>
            Add candidates manually or upload resumes,
            then use Candidate Matching to create
            applications.
          </p>


          {/* STEP 1 */}

          <div className="workflow-row">

            <div>

              <strong>
                1. Build pool
              </strong>

              <small>
                Upload resumes or add candidate details.
              </small>

            </div>

          </div>


          {/* STEP 2 */}

          <div className="workflow-row">

            <div>

              <strong>
                2. Match to job
              </strong>

              <small>
                AI compares skills, experience and evidence.
              </small>

            </div>

          </div>


          {/* STEP 3 */}

          <div className="workflow-row">

            <div>

              <strong>
                3. Advance pipeline
              </strong>

              <small>
                Recruiter controls every stage transition.
              </small>

            </div>

          </div>


          {/* MATCH BUTTON */}

          <Link
            className="btn primary"
            style={{ marginTop: 14 }}
            to="/ai-recruiter/candidate-matching"
          >

            Run Candidate Matching

            <ArrowRight size={13} />

          </Link>

        </div>

      </div>

    </div>
  );
}