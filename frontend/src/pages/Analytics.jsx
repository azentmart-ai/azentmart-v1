import React, { useEffect, useMemo, useState } from "react";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Gauge,
  Layers3,
  Megaphone,
  MoreHorizontal,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  UserRoundPlus,
  Video,
  XCircle,
  Zap,
} from "lucide-react";

import { api } from "../lib/api";
import "./Analytics.css";

/* =========================================================
   DEFAULT ANALYTICS DATA
========================================================= */

const EMPTY_ANALYTICS = {
  jobs: 0,
  candidates: 0,
  applications: 0,
  shortlisted: 0,
  interviews: 0,
  hired: 0,
  rejected: 0,
  activeJobs: 0,
  pausedJobs: 0,

  funnel: {
    applied: 0,
    screening: 0,
    shortlisted: 0,
    interview: 0,
    offer: 0,
    hired: 0,
    rejected: 0,
  },

  sources: [],
  activities: [],
  interviewList: [],
  campaigns: [],
  departments: [],
};

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toText(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function toPercent(value) {
  const n = Number(value);

  if (!Number.isFinite(n)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(n)));
}

function formatNumber(value) {
  return toNumber(value).toLocaleString("en-IN");
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return toText(value);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return toText(value);
  }
}

/* =========================================================
   GET RAW ANALYTICS OBJECT
========================================================= */

function getAnalyticsObject(result) {
  if (!result) {
    return {};
  }

  if (Array.isArray(result)) {
    return {
      activities: result,
    };
  }

  if (result.analytics && typeof result.analytics === "object") {
    return result.analytics;
  }

  if (
    result.data &&
    typeof result.data === "object" &&
    !Array.isArray(result.data)
  ) {
    return result.data;
  }

  return result;
}

/* =========================================================
   NORMALIZE SOURCES
========================================================= */

function normalizeSources(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, index) => ({
    name:
      item?.name ||
      item?.source ||
      item?.channel ||
      `Source ${index + 1}`,

    applications: toNumber(
      item?.applications ??
        item?.applicants ??
        item?.count
    ),

    shortlisted: toNumber(
      item?.shortlisted ??
        item?.selected
    ),

    hired: toNumber(
      item?.hired ??
        item?.hires
    ),

    conversion: toPercent(
      item?.conversion ??
        item?.conversion_rate ??
        item?.hire_rate
    ),
  }));
}

/* =========================================================
   NORMALIZE ACTIVITIES
========================================================= */

function normalizeActivities(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, 10).map((item, index) => ({
    id:
      item?.id ??
      item?.activity_id ??
      index,

    title:
      item?.title ||
      item?.action ||
      item?.message ||
      "Recruitment activity",

    description:
      item?.description ||
      item?.details ||
      item?.candidate_name ||
      "",

    date:
      item?.date ||
      item?.created_at ||
      item?.timestamp,

    type:
      item?.type ||
      item?.category ||
      "activity",
  }));
}

/* =========================================================
   NORMALIZE INTERVIEWS
========================================================= */

function normalizeInterviews(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, 8).map((item, index) => ({
    id:
      item?.id ??
      item?.interview_id ??
      index,

    candidate:
      item?.candidate_name ||
      item?.candidate?.name ||
      item?.name ||
      "Candidate",

    role:
      item?.job_title ||
      item?.job?.title ||
      item?.position ||
      "Interview",

    score: toNumber(
      item?.score ??
        item?.interview_score ??
        item?.rating
    ),

    status:
      item?.status ||
      item?.result ||
      "Scheduled",

    date:
      item?.date ||
      item?.scheduled_at ||
      item?.created_at,
  }));
}

/* =========================================================
   NORMALIZE CAMPAIGNS
========================================================= */

function normalizeCampaigns(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, 8).map((item, index) => ({
    id:
      item?.id ??
      item?.campaign_id ??
      index,

    name:
      item?.name ||
      item?.title ||
      `Campaign ${index + 1}`,

    recipients: toNumber(
      item?.recipients ??
        item?.recipient_count
    ),

    responses: toNumber(
      item?.responses ??
        item?.response_count
    ),

    status:
      item?.status ||
      "Active",
  }));
}

/* =========================================================
   NORMALIZE DEPARTMENTS
========================================================= */

function normalizeDepartments(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, index) => ({
    name:
      item?.name ||
      item?.department ||
      `Department ${index + 1}`,

    openings: toNumber(
      item?.openings ??
        item?.jobs ??
        item?.positions
    ),

    candidates: toNumber(
      item?.candidates ??
        item?.applicants
    ),

    hired: toNumber(item?.hired),
  }));
}

/* =========================================================
   MAIN NORMALIZER

   IMPORTANT:
   interviews appears ONLY ONCE here.
========================================================= */

function normalizeAnalytics(result) {
  const raw = getAnalyticsObject(result);

  const funnelSource =
    raw?.funnel ||
    raw?.pipeline ||
    raw?.stages ||
    {};

  return {
    jobs: toNumber(
      raw?.jobs ??
        raw?.total_jobs ??
        raw?.job_count
    ),

    candidates: toNumber(
      raw?.candidates ??
        raw?.total_candidates ??
        raw?.candidate_count
    ),

    applications: toNumber(
      raw?.applications ??
        raw?.total_applications ??
        raw?.application_count
    ),

    shortlisted: toNumber(
      raw?.shortlisted ??
        raw?.shortlisted_candidates
    ),

    interviews: toNumber(
      raw?.interviews ??
        raw?.total_interviews ??
        raw?.interview_count
    ),

    hired: toNumber(
      raw?.hired ??
        raw?.total_hired ??
        raw?.hired_candidates
    ),

    rejected: toNumber(
      raw?.rejected ??
        raw?.rejected_candidates
    ),

    activeJobs: toNumber(
      raw?.active_jobs ??
        raw?.active
    ),

    pausedJobs: toNumber(
      raw?.paused_jobs ??
        raw?.paused
    ),

    funnel: {
      applied: toNumber(
        funnelSource?.applied ??
          funnelSource?.application ??
          raw?.applications
      ),

      screening: toNumber(
        funnelSource?.screening ??
          funnelSource?.ai_screening ??
          funnelSource?.aiScreening
      ),

      shortlisted: toNumber(
        funnelSource?.shortlisted ??
          raw?.shortlisted
      ),

      interview: toNumber(
        funnelSource?.interview ??
          funnelSource?.interviews ??
          raw?.interviews
      ),

      offer: toNumber(
        funnelSource?.offer ??
          funnelSource?.offers
      ),

      hired: toNumber(
        funnelSource?.hired ??
          raw?.hired
      ),

      rejected: toNumber(
        funnelSource?.rejected ??
          raw?.rejected
      ),
    },

    sources: normalizeSources(
      raw?.sources ||
        raw?.candidate_sources ||
        raw?.source_performance
    ),

    activities: normalizeActivities(
      raw?.activities ||
        raw?.recent_activity ||
        raw?.recent_activities
    ),

    interviewList: normalizeInterviews(
      raw?.interviews_list ||
        raw?.interviews ||
        raw?.recent_interviews
    ),

    campaigns: normalizeCampaigns(
      raw?.campaigns ||
        raw?.campaign_performance
    ),

    departments: normalizeDepartments(
      raw?.departments ||
        raw?.department_stats
    ),
  };
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  trend,
  trendType = "neutral",
}) {
  return (
    <div className="analytics-stat-card">
      <div className="analytics-stat-top">
        <div className="analytics-stat-icon">
          <Icon size={18} strokeWidth={2} />
        </div>

        {trend !== undefined && trend !== null && (
          <span
            className={`analytics-trend ${trendType}`}
          >
            {trendType === "up" && (
              <ArrowUp size={11} />
            )}

            {trendType === "down" && (
              <ArrowDown size={11} />
            )}

            {trend}
          </span>
        )}
      </div>

      <div className="analytics-stat-label">
        {label}
      </div>

      <div className="analytics-stat-value">
        {formatNumber(value)}
      </div>

      {detail && (
        <div className="analytics-stat-detail">
          {detail}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}) {
  return (
    <div className="analytics-section-header">
      <div className="analytics-section-title-wrap">
        <div className="analytics-section-icon">
          <Icon size={16} />
        </div>

        <div>
          <h2>{title}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon = BarChart3,
  title,
  text: description,
}) {
  return (
    <div className="analytics-empty">
      <div className="analytics-empty-icon">
        <Icon size={20} />
      </div>

      <strong>{title}</strong>

      <span>{description}</span>
    </div>
  );
}

/* =========================================================
   ANALYTICS PAGE
========================================================= */

export default function Analytics() {
  const [analytics, setAnalytics] =
    useState(EMPTY_ANALYTICS);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [period, setPeriod] =
    useState("30d");

  const [search, setSearch] =
    useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadAnalytics = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result =
        await api.analytics();

      const normalized =
        normalizeAnalytics(result);

      setAnalytics(normalized);
    } catch (err) {
      console.error(
        "ANALYTICS LOAD ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await api.analytics();

        if (!mounted) {
          return;
        }

        setAnalytics(
          normalizeAnalytics(result)
        );
      } catch (err) {
        if (!mounted) {
          return;
        }

        console.error(
          "ANALYTICS LOAD ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load analytics."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     FUNNEL
  ======================================================= */

  const funnel = useMemo(() => {
    const stages = [
      {
        key: "applied",
        label: "Applied",
        value: toNumber(
          analytics.funnel?.applied
        ),
      },
      {
        key: "screening",
        label: "AI Screening",
        value: toNumber(
          analytics.funnel?.screening
        ),
      },
      {
        key: "shortlisted",
        label: "Shortlisted",
        value: toNumber(
          analytics.funnel?.shortlisted
        ),
      },
      {
        key: "interview",
        label: "Interview",
        value: toNumber(
          analytics.funnel?.interview
        ),
      },
      {
        key: "offer",
        label: "Offer",
        value: toNumber(
          analytics.funnel?.offer
        ),
      },
      {
        key: "hired",
        label: "Hired",
        value: toNumber(
          analytics.funnel?.hired
        ),
      },
    ];

    const max = Math.max(
      ...stages.map(
        (item) => item.value
      ),
      1
    );

    return stages.map(
      (item, index) => {
        const previous =
          index === 0
            ? item.value
            : stages[index - 1].value;

        const conversion =
          previous > 0
            ? Math.round(
                (item.value /
                  previous) *
                  100
              )
            : 0;

        return {
          ...item,

          width:
            item.value > 0
              ? Math.max(
                  7,
                  Math.round(
                    (item.value /
                      max) *
                      100
                  )
                )
              : 0,

          conversion,
        };
      }
    );
  }, [analytics.funnel]);

  /* =======================================================
     OVERALL CONVERSION
  ======================================================= */

  const overallConversion =
    useMemo(() => {
      const applied =
        toNumber(
          analytics.funnel?.applied
        );

      const hired =
        toNumber(
          analytics.funnel?.hired
        );

      if (applied <= 0) {
        return 0;
      }

      return Math.round(
        (hired / applied) * 100
      );
    }, [
      analytics.funnel?.applied,
      analytics.funnel?.hired,
    ]);

  /* =======================================================
     INTERVIEW SCORE
  ======================================================= */

  const interviewScore =
    useMemo(() => {
      const interviews =
        Array.isArray(
          analytics.interviewList
        )
          ? analytics.interviews
          : [];

      const scored =
        interviews.filter(
          (item) =>
            toNumber(item.score) > 0
        );

      if (!scored.length) {
        return 0;
      }

      return Math.round(
        scored.reduce(
          (sum, item) =>
            sum +
            toNumber(item.score),
          0
        ) / scored.length
      );
    }, [analytics.interviewList]);

  /* =======================================================
     FILTER ACTIVITIES
  ======================================================= */

  const filteredActivities =
    useMemo(() => {
      const activities =
        Array.isArray(
          analytics.activities
        )
          ? analytics.activities
          : [];

      const query =
        search.trim().toLowerCase();

      if (!query) {
        return activities;
      }

      return activities.filter(
        (item) =>
          `${toText(
            item.title
          )} ${toText(
            item.description
          )}`
            .toLowerCase()
            .includes(query)
      );
    }, [
      analytics.activities,
      search,
    ]);

  /* =======================================================
     SOURCE DATA
  ======================================================= */

  const topSource =
    analytics.sources.length > 0
      ? [...analytics.sources].sort(
          (a, b) =>
            toNumber(
              b.applications
            ) -
            toNumber(
              a.applications
            )
        )[0]
      : null;

  const maxSourceApplications =
    Math.max(
      ...analytics.sources.map(
        (item) =>
          toNumber(
            item.applications
          )
      ),
      1
    );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          <div className="analytics-spinner">
            <RefreshCw size={22} />
          </div>

          <h2>
            Building recruiting insights
          </h2>

          <p>
            Loading jobs, candidates,
            interviews and pipeline data...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-header">
        <div>
          <div className="analytics-eyebrow">
            RECRUITING INTELLIGENCE
          </div>

          <h1>
            Hiring performance
          </h1>

          <p>
            A live view of your recruitment
            pipeline, candidate flow and
            hiring activity.
          </p>
        </div>

        <div className="analytics-header-actions">

          <div className="analytics-period">
            <CalendarDays size={14} />

            <select
              value={period}
              onChange={(e) =>
                setPeriod(
                  e.target.value
                )
              }
            >
              <option value="7d">
                Last 7 days
              </option>

              <option value="30d">
                Last 30 days
              </option>

              <option value="90d">
                Last 90 days
              </option>

              <option value="all">
                All time
              </option>
            </select>
          </div>

          <button
            type="button"
            className="analytics-refresh"
            onClick={() =>
              loadAnalytics(true)
            }
            disabled={refreshing}
          >
            <RefreshCw
              size={14}
              className={
                refreshing
                  ? "analytics-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="analytics-error">
          <XCircle size={16} />

          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              loadAnalytics()
            }
          >
            Retry
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="analytics-stats-grid">

        <StatCard
          icon={BriefcaseBusiness}
          label="Open requisitions"
          value={analytics.activeJobs}
          detail={`${formatNumber(
            analytics.pausedJobs
          )} paused`}
        />

        <StatCard
          icon={Users}
          label="Talent pool"
          value={analytics.candidates}
          detail="Candidate profiles"
        />

        <StatCard
          icon={UserRoundPlus}
          label="Applications"
          value={analytics.applications}
          detail="Across active roles"
        />

        <StatCard
          icon={Target}
          label="Shortlisted"
          value={analytics.shortlisted}
          detail="Moved forward"
        />

        <StatCard
          icon={Video}
          label="Interviews"
          value={analytics.interviews}
          detail={
            interviewScore
              ? `Avg. score ${interviewScore}`
              : "No scored interviews"
          }
        />

        <StatCard
          icon={UserCheck}
          label="Hired"
          value={analytics.hired}
          detail={
            overallConversion
              ? `${overallConversion}% application-to-hire`
              : "Hiring conversion"
          }
        />

      </div>

      {/* FUNNEL + HEALTH */}

      <div className="analytics-main-grid">

        {/* FUNNEL */}

        <section className="analytics-card analytics-funnel-card">

          <SectionHeader
            icon={Layers3}
            title="Hiring funnel"
            subtitle="Candidate movement across recruitment stages."
            action={
              <span className="analytics-live-pill">
                <span />
                Live
              </span>
            }
          />

          <div className="funnel-summary">

            <div>
              <span>
                Application volume
              </span>

              <strong>
                {formatNumber(
                  analytics.funnel.applied
                )}
              </strong>
            </div>

            <div>
              <span>
                Overall conversion
              </span>

              <strong>
                {overallConversion}%
              </strong>
            </div>

            <div>
              <span>
                Hired
              </span>

              <strong>
                {formatNumber(
                  analytics.funnel.hired
                )}
              </strong>
            </div>

          </div>

          <div className="funnel-list">

            {funnel.map(
              (stage, index) => (
                <div
                  className="funnel-row"
                  key={stage.key}
                >

                  <div className="funnel-label">
                    <span className="funnel-index">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <span>
                      {stage.label}
                    </span>
                  </div>

                  <div className="funnel-track">
                    <div
                      className={`funnel-fill funnel-${stage.key}`}
                      style={{
                        width: `${stage.width}%`,
                      }}
                    />
                  </div>

                  <strong className="funnel-value">
                    {formatNumber(
                      stage.value
                    )}
                  </strong>

                  <span className="funnel-conversion">
                    {index === 0
                      ? "100%"
                      : `${stage.conversion}%`}
                  </span>

                </div>
              )
            )}

          </div>

        </section>

        {/* PIPELINE HEALTH */}

        <section className="analytics-card health-card">

          <SectionHeader
            icon={Gauge}
            title="Pipeline health"
            subtitle="Current recruitment balance."
          />

          <div className="health-score">
            <div className="health-ring">
              <div>
                <strong>
                  {overallConversion}%
                </strong>

                <span>
                  conversion
                </span>
              </div>
            </div>
          </div>

          <div className="health-items">

            <div className="health-item">
              <div className="health-item-icon blue">
                <Zap size={14} />
              </div>

              <div>
                <strong>
                  {formatNumber(
                    analytics.funnel.screening
                  )}
                </strong>

                <span>
                  In AI screening
                </span>
              </div>

              <ChevronRight size={14} />
            </div>

            <div className="health-item">
              <div className="health-item-icon purple">
                <UserCheck size={14} />
              </div>

              <div>
                <strong>
                  {formatNumber(
                    analytics.funnel.shortlisted
                  )}
                </strong>

                <span>
                  Shortlisted
                </span>
              </div>

              <ChevronRight size={14} />
            </div>

            <div className="health-item">
              <div className="health-item-icon orange">
                <Video size={14} />
              </div>

              <div>
                <strong>
                  {formatNumber(
                    analytics.funnel.interview
                  )}
                </strong>

                <span>
                  At interview
                </span>
              </div>

              <ChevronRight size={14} />
            </div>

            <div className="health-item">
              <div className="health-item-icon green">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>
                  {formatNumber(
                    analytics.funnel.offer
                  )}
                </strong>

                <span>
                  Offers in progress
                </span>
              </div>

              <ChevronRight size={14} />
            </div>

          </div>

        </section>

      </div>

      {/* SOURCES + INTERVIEWS */}

      <div className="analytics-two-column">

        {/* SOURCES */}

        <section className="analytics-card">

          <SectionHeader
            icon={TrendingUp}
            title="Candidate sources"
            subtitle="Where applications are coming from."
            action={
              <button
                type="button"
                className="analytics-icon-button"
              >
                <MoreHorizontal size={17} />
              </button>
            }
          />

          {analytics.sources.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No source data"
              text="Candidate source performance will appear here."
            />
          ) : (
            <div className="source-list">

              {analytics.sources
                .slice(0, 6)
                .map(
                  (source, index) => (
                    <div
                      className="source-row"
                      key={`${source.name}-${index}`}
                    >

                      <div className="source-name">

                        <div className="source-avatar">
                          {toText(
                            source.name,
                            "S"
                          )
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {source.name}
                          </strong>

                          <span>
                            {formatNumber(
                              source.applications
                            )}{" "}
                            applications
                          </span>
                        </div>

                      </div>

                      <div className="source-progress">

                        <div className="source-progress-track">
                          <span
                            style={{
                              width: `${
                                source.applications > 0
                                  ? Math.max(
                                      5,
                                      Math.round(
                                        (source.applications /
                                          maxSourceApplications) *
                                          100
                                      )
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>

                        <small>
                          {source.conversion
                            ? `${source.conversion}%`
                            : `${source.hired} hired`}
                        </small>

                      </div>

                    </div>
                  )
                )}

            </div>
          )}

          {topSource && (
            <div className="source-highlight">

              <div className="source-highlight-icon">
                <TrendingUp size={15} />
              </div>

              <div>
                <strong>
                  Highest application volume
                </strong>

                <span>
                  {topSource.name} generated{" "}
                  {formatNumber(
                    topSource.applications
                  )}{" "}
                  applications.
                </span>
              </div>

            </div>
          )}

        </section>

        {/* INTERVIEWS */}

        <section className="analytics-card">

          <SectionHeader
            icon={Video}
            title="Interview performance"
            subtitle="Latest interview activity and scores."
            action={
              <span className="analytics-mini-value">
                {interviewScore || "—"}

                <small>
                  avg score
                </small>
              </span>
            }
          />

          {analytics.interviewList.length === 0 ? (
            <EmptyState
              icon={Video}
              title="No interview data"
              text="Interview results will appear after interviews are completed."
            />
          ) : (
            <div className="interview-list">

              {analytics.interviewList.map(
                (item, index) => (
                  <div
                    className="interview-row"
                    key={`${item.id}-${index}`}
                  >

                    <div className="candidate-mini-avatar">
                      {toText(
                        item.candidate,
                        "C"
                      )
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>

                    <div className="interview-main">

                      <strong>
                        {item.candidate}
                      </strong>

                      <span>
                        {item.role}
                      </span>

                    </div>

                    <div className="interview-result">

                      {toNumber(
                        item.score
                      ) > 0 ? (
                        <strong>
                          {item.score}
                        </strong>
                      ) : (
                        <span>
                          {item.status}
                        </span>
                      )}

                      {item.date && (
                        <small>
                          {formatDate(
                            item.date
                          )}
                        </small>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>

      {/* VELOCITY + DEPARTMENTS + CAMPAIGNS */}

      <div className="analytics-three-column">

        {/* VELOCITY */}

        <section className="analytics-card compact-card">

          <SectionHeader
            icon={Clock3}
            title="Recruitment velocity"
            subtitle="Current pipeline movement."
          />

          <div className="velocity-main">

            <div className="velocity-number">
              {formatNumber(
                analytics.interviews
              )}
            </div>

            <div>
              <strong>
                interview touchpoints
              </strong>

              <span>
                recorded in the current
                reporting period
              </span>
            </div>

          </div>

          <div className="velocity-bars">

            <div>
              <span>Applied</span>
              <strong>
                {formatNumber(
                  analytics.funnel.applied
                )}
              </strong>
            </div>

            <div>
              <span>Screening</span>
              <strong>
                {formatNumber(
                  analytics.funnel.screening
                )}
              </strong>
            </div>

            <div>
              <span>Interview</span>
              <strong>
                {formatNumber(
                  analytics.funnel.interview
                )}
              </strong>
            </div>

            <div>
              <span>Hired</span>
              <strong>
                {formatNumber(
                  analytics.funnel.hired
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* DEPARTMENTS */}

        <section className="analytics-card compact-card">

          <SectionHeader
            icon={BriefcaseBusiness}
            title="Hiring by team"
            subtitle="Openings and candidate volume."
          />

          {analytics.departments.length === 0 ? (
            <EmptyState
              icon={BriefcaseBusiness}
              title="No department data"
              text="Department-level recruitment metrics will appear here."
            />
          ) : (
            <div className="department-list">

              {analytics.departments
                .slice(0, 5)
                .map(
                  (department, index) => (
                    <div
                      className="department-row"
                      key={`${department.name}-${index}`}
                    >

                      <div>
                        <strong>
                          {department.name}
                        </strong>

                        <span>
                          {formatNumber(
                            department.candidates
                          )}{" "}
                          candidates
                        </span>
                      </div>

                      <div className="department-count">
                        <strong>
                          {formatNumber(
                            department.openings
                          )}
                        </strong>

                        <span>
                          openings
                        </span>
                      </div>

                    </div>
                  )
                )}

            </div>
          )}

        </section>

        {/* CAMPAIGNS */}

        <section className="analytics-card compact-card">

          <SectionHeader
            icon={Megaphone}
            title="Campaign activity"
            subtitle="Recent sourcing campaigns."
          />

          {analytics.campaigns.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="No campaign data"
              text="Campaign performance will appear once campaigns are active."
            />
          ) : (
            <div className="campaign-list">

              {analytics.campaigns.map(
                (campaign, index) => {
                  const responseRate =
                    campaign.recipients > 0
                      ? Math.round(
                          (campaign.responses /
                            campaign.recipients) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      className="campaign-row"
                      key={`${campaign.id}-${index}`}
                    >

                      <div className="campaign-icon">
                        <Megaphone size={14} />
                      </div>

                      <div className="campaign-main">
                        <strong>
                          {campaign.name}
                        </strong>

                        <span>
                          {formatNumber(
                            campaign.recipients
                          )}{" "}
                          recipients
                        </span>
                      </div>

                      <div className="campaign-rate">
                        <strong>
                          {responseRate}%
                        </strong>

                        <span>
                          response
                        </span>
                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

      </div>

      {/* ACTIVITY + INSIGHTS */}

      <div className="analytics-bottom-grid">

        {/* ACTIVITY */}

        <section className="analytics-card activity-card">

          <SectionHeader
            icon={Activity}
            title="Recruitment activity"
            subtitle="Latest events across your workspace."
            action={
              <div className="activity-search">

                <Search size={13} />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search activity"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    <XCircle size={13} />
                  </button>
                )}

              </div>
            }
          />

          {filteredActivities.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No recent activity"
              text={
                search
                  ? "No activity matches your search."
                  : "Recruitment events will appear here as your team works."
              }
            />
          ) : (
            <div className="activity-list">

              {filteredActivities.map(
                (item, index) => (
                  <div
                    className="activity-row"
                    key={`${item.id}-${index}`}
                  >

                    <div className="activity-dot">
                      <CheckCircle2 size={14} />
                    </div>

                    <div className="activity-content">

                      <strong>
                        {item.title}
                      </strong>

                      {item.description && (
                        <span>
                          {item.description}
                        </span>
                      )}

                      <small>
                        {formatDate(
                          item.date
                        )}
                      </small>

                    </div>

                    <ChevronRight
                      size={15}
                      className="activity-arrow"
                    />

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* INSIGHTS */}

        <section className="analytics-card insights-card">

          <SectionHeader
            icon={Target}
            title="Hiring insights"
            subtitle="Signals from current recruitment data."
          />

          <div className="insight-list">

            <div className="insight-item">

              <div className="insight-icon blue">
                <Users size={15} />
              </div>

              <div>
                <strong>
                  Candidate pipeline
                </strong>

                <p>
                  {formatNumber(
                    analytics.funnel.applied
                  )}{" "}
                  candidates currently
                  entered the application
                  funnel.
                </p>
              </div>

            </div>

            <div className="insight-item">

              <div className="insight-icon purple">
                <Zap size={15} />
              </div>

              <div>
                <strong>
                  AI screening
                </strong>

                <p>
                  {formatNumber(
                    analytics.funnel.screening
                  )}{" "}
                  candidates are currently
                  represented in the screening
                  stage.
                </p>
              </div>

            </div>

            <div className="insight-item">

              <div className="insight-icon orange">
                <Video size={15} />
              </div>

              <div>
                <strong>
                  Interview pipeline
                </strong>

                <p>
                  {formatNumber(
                    analytics.funnel.interview
                  )}{" "}
                  candidates have reached
                  interviews.
                </p>
              </div>

            </div>

            <div className="insight-item">

              <div className="insight-icon green">
                <UserCheck size={15} />
              </div>

              <div>
                <strong>
                  Hiring outcome
                </strong>

                <p>
                  {formatNumber(
                    analytics.hired
                  )}{" "}
                  candidates have been recorded
                  as hired.
                </p>
              </div>

            </div>

          </div>

          <div className="analytics-footer-note">
            <FileText size={13} />

            <span>
              Metrics are calculated from
              connected recruiting data.
            </span>
          </div>

        </section>

      </div>

    </div>
  );
}