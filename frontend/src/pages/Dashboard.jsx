import React, { useEffect, useMemo, useState } from "react";

import {
  BriefcaseBusiness,
  Users,
  UserPlus,
  UserCheck,
  Sparkles,
  CalendarDays,
  FileText,
  Activity,
  RefreshCw,
} from "lucide-react";

import { api, storedUser } from "../lib/api";

import "./Dashboard.css";


/* =========================================================
   PIPELINE STAGES
========================================================= */

const PIPELINE_STAGES = [
  {
    key: "APPLIED",
    label: "Applied",
    icon: UserPlus,
  },
  {
    key: "AI_SCREENING",
    label: "AI Screening",
    icon: Sparkles,
  },
  {
    key: "SHORTLISTED",
    label: "Shortlisted",
    icon: UserCheck,
  },
  {
    key: "INTERVIEW",
    label: "Interview",
    icon: CalendarDays,
  },
  {
    key: "OFFER",
    label: "Offer",
    icon: FileText,
  },
  {
    key: "HIRED",
    label: "Hired",
    icon: Users,
  },
];


/* =========================================================
   HELPERS
========================================================= */

function getInitials(name = "") {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "B";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}


function formatActivityDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function normalizeDashboardResponse(data) {
  if (!data) {
    return {};
  }

  /*
   * Supports:
   *
   * {
   *   open_jobs,
   *   active_candidates,
   *   ai_shortlisted,
   *   interviews_today,
   *   pipeline,
   *   recent_activity,
   *   priority_candidates
   * }
   *
   * and nested:
   *
   * {
   *   metrics: {...},
   *   pipeline: {...}
   * }
   */

  return {
    ...data,
    metrics: data.metrics || data.stats || {},
    pipeline: data.pipeline || {},
    recent_activity:
      data.recent_activity ||
      data.activities ||
      [],
    priority_candidates:
      data.priority_candidates ||
      data.priorityCandidates ||
      [],
  };
}


/* =========================================================
   COMPONENT
========================================================= */

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");


  /* =======================================================
     STORED USER
  ======================================================= */

  const user = useMemo(() => {
    return storedUser() || {};
  }, []);


  const displayName =
    user?.name ||
    user?.full_name ||
    user?.first_name ||
    "Bhuvanesh";


  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  async function loadDashboard(isRefresh = false) {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.dashboard();

      setDashboard(
        normalizeDashboardResponse(response)
      );
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);


  /* =======================================================
     METRICS
  ======================================================= */

  const metrics =
    dashboard?.metrics || {};

  const openJobs =
    metrics.open_jobs ??
    dashboard?.open_jobs ??
    dashboard?.jobs_count ??
    0;

  const activeCandidates =
    metrics.active_candidates ??
    dashboard?.active_candidates ??
    dashboard?.candidates_count ??
    0;

  const aiShortlisted =
    metrics.ai_shortlisted ??
    dashboard?.ai_shortlisted ??
    dashboard?.shortlisted ??
    0;

  const interviewsToday =
    metrics.interviews_today ??
    dashboard?.interviews_today ??
    0;


  /* =======================================================
     PIPELINE COUNTS
  ======================================================= */

  const rawPipeline =
    dashboard?.pipeline || {};

  const pipelineCounts = {};

  PIPELINE_STAGES.forEach((stage) => {
    const lowerKey =
      stage.key.toLowerCase();

    pipelineCounts[stage.key] =
      rawPipeline[stage.key] ??
      rawPipeline[lowerKey] ??
      rawPipeline[
        stage.key.replace(
          "_",
          ""
        )
      ] ??
      0;
  });


  /* =======================================================
     ACTIVITY
  ======================================================= */

  const activities =
    Array.isArray(
      dashboard?.recent_activity
    )
      ? dashboard.recent_activity
      : [];


  /* =======================================================
     PRIORITY CANDIDATES
  ======================================================= */

  const priorityCandidates =
    Array.isArray(
      dashboard?.priority_candidates
    )
      ? dashboard.priority_candidates
      : [];


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="dashboard-page">

      {/* =================================================
          MAIN DASHBOARD
      ================================================= */}

      <main className="dashboard-main">

        <div className="dashboard-container">


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="dashboard-page-header">

            <div className="dashboard-heading">

              <div className="dashboard-eyebrow">
                RECRUITING WORKSPACE
              </div>

              <h1>
                Recruiting Dashboard
              </h1>

              <p>
                Welcome back, {displayName}. Here's what's
                happening across your hiring pipeline.
              </p>

            </div>


            <button
              type="button"
              className="dashboard-refresh-button"
              onClick={() =>
                loadDashboard(true)
              }
              disabled={
                loading || refreshing
              }
            >

              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "dashboard-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </section>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="dashboard-error">

              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  loadDashboard()
                }
              >
                Try again
              </button>

            </div>
          )}


          {/* =================================================
              HIRING OVERVIEW
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>
                <h2>
                  Hiring Overview
                </h2>

                <p>
                  A quick view of your current recruiting activity.
                </p>
              </div>

            </div>


            <div className="metrics">


              {/* OPEN JOBS */}

              <article className="metric-card">

                <div className="metric-card-top">

                  <span>
                    Open Jobs
                  </span>

                  <div className="metric-icon">
                    <BriefcaseBusiness
                      size={17}
                    />
                  </div>

                </div>


                <strong>
                  {loading
                    ? "—"
                    : openJobs}
                </strong>


                <small>
                  Active job openings
                </small>

              </article>


              {/* ACTIVE CANDIDATES */}

              <article className="metric-card">

                <div className="metric-card-top">

                  <span>
                    Active Candidates
                  </span>

                  <div className="metric-icon">
                    <Users
                      size={17}
                    />
                  </div>

                </div>


                <strong>
                  {loading
                    ? "—"
                    : activeCandidates}
                </strong>


                <small>
                  Candidate profiles
                </small>

              </article>


              {/* AI SHORTLISTED */}

              <article className="metric-card">

                <div className="metric-card-top">

                  <span>
                    AI Shortlisted
                  </span>

                  <div className="metric-icon">
                    <Sparkles
                      size={17}
                    />
                  </div>

                </div>


                <strong>
                  {loading
                    ? "—"
                    : aiShortlisted}
                </strong>


                <small>
                  AI matched candidates
                </small>

              </article>


              {/* INTERVIEWS */}

              <article className="metric-card">

                <div className="metric-card-top">

                  <span>
                    Interviews Today
                  </span>

                  <div className="metric-icon">
                    <CalendarDays
                      size={17}
                    />
                  </div>

                </div>


                <strong>
                  {loading
                    ? "—"
                    : interviewsToday}
                </strong>


                <small>
                  Scheduled interviews
                </small>

              </article>


            </div>

          </section>


          {/* =================================================
              RECRUITMENT PIPELINE
          ================================================= */}

          <section className="dashboard-section pipeline-section">

            <div className="section-heading pipeline-heading">

              <div>

                <h2>
                  Recruitment Pipeline
                </h2>

                <p>
                  Track candidates through every stage of the hiring process.
                </p>

              </div>


              <button
                type="button"
                className="pipeline-link"
                onClick={() =>
                  window.location.href =
                    "/recruitment-pipeline"
                }
              >
                View pipeline
              </button>

            </div>


            {/* IMPORTANT:
                NO CHEVRON / > ICONS HERE
            */}

            <div className="pipeline-card">

              <div className="pipeline-flow">

                {PIPELINE_STAGES.map(
                  (stage) => {

                    const Icon =
                      stage.icon;

                    return (
                      <div
                        className="pipeline-stage"
                        key={stage.key}
                      >

                        <div className="pipeline-stage-icon">
                          <Icon
                            size={16}
                          />
                        </div>


                        <strong>
                          {loading
                            ? "—"
                            : pipelineCounts[
                                stage.key
                              ]}
                        </strong>


                        <span>
                          {stage.label}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </section>


          {/* =================================================
              ACTIVITY + PRIORITY
          ================================================= */}

          <section className="dashboard-bottom-grid">


            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <article className="dashboard-panel activity-panel">

              <div className="panel-heading">

                <div>

                  <h2>
                    Recent Activity
                  </h2>

                  <p>
                    Latest recruiting actions
                  </p>

                </div>


                <div className="live-status">

                  <span />

                  Live

                </div>

              </div>


              <div className="activity-list">

                {loading ? (

                  <div className="empty-state">
                    Loading recent activity...
                  </div>

                ) : activities.length === 0 ? (

                  <div className="empty-state">

                    <Activity
                      size={20}
                    />

                    <span>
                      No recent recruiting activity.
                    </span>

                  </div>

                ) : (

                  activities
                    .slice(0, 8)
                    .map(
                      (item, index) => {

                        const message =
                          item.message ||
                          item.description ||
                          item.title ||
                          "Recruiting activity";


                        const date =
                          item.created_at ||
                          item.timestamp ||
                          item.date;


                        return (
                          <div
                            className="activity-item"
                            key={
                              item.id ||
                              `${message}-${index}`
                            }
                          >

                            <div className="activity-icon">

                              <Sparkles
                                size={14}
                              />

                            </div>


                            <div className="activity-content">

                              <p>
                                {message}
                              </p>

                              {date && (
                                <small>
                                  {formatActivityDate(
                                    date
                                  )}
                                </small>
                              )}

                            </div>

                          </div>
                        );
                      }
                    )

                )}

              </div>

            </article>


            {/* =================================================
                PRIORITY CANDIDATES
            ================================================= */}

            <article className="dashboard-panel priority-panel">

              <div className="panel-heading">

                <div>

                  <h2>
                    Priority Candidates
                  </h2>

                  <p>
                    Candidates requiring attention
                  </p>

                </div>


                <button
                  type="button"
                  className="panel-link"
                  onClick={() =>
                    window.location.href =
                      "/candidates"
                  }
                >
                  View all
                </button>

              </div>


              <div className="priority-list">

                {loading ? (

                  <div className="empty-state">
                    Loading candidates...
                  </div>

                ) : priorityCandidates.length === 0 ? (

                  <div className="empty-state">

                    <Users
                      size={20}
                    />

                    <span>
                      No priority candidates.
                    </span>

                  </div>

                ) : (

                  priorityCandidates
                    .slice(0, 5)
                    .map(
                      (candidate, index) => {

                        const firstName =
                          candidate.first_name ||
                          "";

                        const lastName =
                          candidate.last_name ||
                          "";

                        const candidateName =
                          candidate.name ||
                          `${firstName} ${lastName}`.trim() ||
                          "Candidate";


                        const jobTitle =
                          candidate.job_title ||
                          candidate.job ||
                          candidate.position ||
                          "Candidate";


                        const stage =
                          candidate.stage ||
                          candidate.status ||
                          "APPLIED";


                        const score =
                          candidate.ai_match_score ??
                          candidate.match_score ??
                          candidate.score;


                        return (
                          <div
                            className="priority-item"
                            key={
                              candidate.id ||
                              `${candidateName}-${index}`
                            }
                          >

                            <div className="priority-rank">
                              {index + 1}
                            </div>


                            <div className="candidate-avatar">
                              {getInitials(
                                candidateName
                              )}
                            </div>


                            <div className="candidate-info">

                              <strong>
                                {candidateName}
                              </strong>

                              <span>
                                {jobTitle}
                                {" · "}
                                {stage}
                              </span>

                            </div>


                            <div className="candidate-score">

                              {score !==
                              undefined &&
                              score !== null
                                ? `${Math.round(
                                    Number(score)
                                  )}%`
                                : "—"}

                            </div>

                          </div>
                        );
                      }
                    )

                )}

              </div>

            </article>


          </section>


          {/* =================================================
              BOTTOM ACTION
          ================================================= */}

          <section className="continue-card">

            <div className="continue-content">

              <div className="continue-icon">
                <Sparkles
                  size={18}
                />
              </div>


              <div>

                <h3>
                  Continue recruiting
                </h3>

                <p>
                  Create jobs, match candidates,
                  move candidates through the pipeline
                  and prepare interviews.
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                window.location.href =
                  "/ai-recruiter"
              }
              className="continue-button"
            >
              Launch AI Recruiter
            </button>

          </section>


        </div>

      </main>

    </div>
  );
}