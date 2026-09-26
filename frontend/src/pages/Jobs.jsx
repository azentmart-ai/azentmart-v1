import React, { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Users,
  UserCheck,
  Search,
  ChevronRight,
  MoreVertical,
  Pause,
  Play,
  Trash2,
  AlertTriangle,
  Plus,
  RefreshCw,
  X,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { api } from "../lib/api";
import "./Jobs.css";

export default function Jobs() {
  /* =========================================================
     STATE
  ========================================================= */

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [deleteJob, setDeleteJob] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  /* =========================================================
     RESPONSE NORMALIZER
  ========================================================= */

  const normalizeJobs = (result) => {
    if (Array.isArray(result)) {
      return result;
    }

    if (Array.isArray(result?.data)) {
      return result.data;
    }

    if (Array.isArray(result?.jobs)) {
      return result.jobs;
    }

    if (Array.isArray(result?.items)) {
      return result.items;
    }

    if (Array.isArray(result?.results)) {
      return result.results;
    }

    if (Array.isArray(result?.data?.jobs)) {
      return result.data.jobs;
    }

    if (Array.isArray(result?.data?.items)) {
      return result.data.items;
    }

    return [];
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const getId = (job) => {
    return (
      job?.id ??
      job?.job_id ??
      job?.jobId ??
      ""
    );
  };

  const getTitle = (job) => {
    return String(
      job?.title ??
        job?.job_title ??
        job?.jobTitle ??
        job?.position ??
        job?.name ??
        "Untitled Position"
    );
  };

  const getDepartment = (job) => {
    return String(
      job?.department ??
        job?.team ??
        job?.division ??
        "Engineering"
    );
  };

  const getLocation = (job) => {
    return String(
      job?.location ??
        job?.city ??
        job?.workplace_location ??
        "Chennai, India"
    );
  };

  const getStatus = (job) => {
    return String(
      job?.status ??
        job?.job_status ??
        job?.jobStatus ??
        "ACTIVE"
    ).toUpperCase();
  };

  const getApplicants = (job) => {
    const value =
      job?.applicants ??
      job?.applicant_count ??
      job?.applicantCount ??
      job?.applications_count ??
      job?.applicationsCount ??
      job?.applications?.length ??
      0;

    const number = Number(value);

    return Number.isNaN(number)
      ? 0
      : number;
  };

  const getShortlisted = (job) => {
    const value =
      job?.shortlisted ??
      job?.shortlisted_count ??
      job?.shortlistedCount ??
      job?.shortlist_count ??
      job?.shortlistCount ??
      0;

    const number = Number(value);

    return Number.isNaN(number)
      ? 0
      : number;
  };

  const getCreatedDate = (job) => {
    const date =
      job?.created_at ??
      job?.createdAt ??
      job?.date_created ??
      job?.dateCreated;

    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  };

  /* =========================================================
     LOAD JOBS
  ========================================================= */

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      /*
        Use your existing API method.
      */

      const result = await api.jobs();

      console.log(
        "JOBS API RESPONSE:",
        result
      );

      const data =
        normalizeJobs(result);

      console.log(
        "NORMALIZED JOBS:",
        data
      );

      setJobs(data);
    } catch (err) {
      console.error(
        "LOAD JOBS ERROR:",
        err
      );

      setJobs([]);

      setError(
        err?.message ||
          "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await api.jobs();

        console.log(
          "JOBS API RESPONSE:",
          result
        );

        const data =
          normalizeJobs(result);

        if (!mounted) return;

        setJobs(data);
      } catch (err) {
        console.error(
          "LOAD JOBS ERROR:",
          err
        );

        if (!mounted) return;

        setJobs([]);

        setError(
          err?.message ||
            "Unable to load jobs."
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

  /* =========================================================
     FILTER JOBS
  ========================================================= */

  const filteredJobs = useMemo(() => {
    const query =
      search
        .trim()
        .toLowerCase();

    return jobs.filter((job) => {
      const status =
        getStatus(job);

      if (
        statusFilter !== "ALL" &&
        status !== statusFilter
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        getTitle(job),
        getDepartment(job),
        getLocation(job),
        getStatus(job),
        String(getId(job)),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [
    jobs,
    search,
    statusFilter,
  ]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalJobs =
    jobs.length;

  const activeJobs =
    jobs.filter(
      (job) =>
        getStatus(job) ===
        "ACTIVE"
    ).length;

  const pausedJobs =
    jobs.filter(
      (job) =>
        getStatus(job) ===
        "PAUSED"
    ).length;

  const totalApplicants =
    jobs.reduce(
      (total, job) =>
        total +
        getApplicants(job),
      0
    );

  const totalShortlisted =
    jobs.reduce(
      (total, job) =>
        total +
        getShortlisted(job),
      0
    );

  /* =========================================================
     UPDATE JOB STATUS
  ========================================================= */

  const updateJobStatus = async (
    job
  ) => {
    const id =
      getId(job);

    if (!id) {
      alert(
        "Job ID is missing."
      );
      return;
    }

    const currentStatus =
      getStatus(job);

    const newStatus =
      currentStatus ===
      "PAUSED"
        ? "ACTIVE"
        : "PAUSED";

    try {
      setActionLoading(true);

      /*
        IMPORTANT:
        If your backend uses a different
        endpoint/API function, only this
        api.updateJobStatus(...) part needs
        changing.
      */

      if (
        typeof api.updateJobStatus ===
        "function"
      ) {
        await api.updateJobStatus(
          id,
          newStatus
        );
      } else if (
        typeof api.updateJob ===
        "function"
      ) {
        await api.updateJob(
          id,
          {
            status:
              newStatus,
          }
        );
      } else {
        /*
          Temporary frontend fallback.
          Remove this fallback when backend
          API is available.
        */
        console.warn(
          "No updateJobStatus/updateJob API found. Updating UI only."
        );
      }

      setJobs(
        (current) =>
          current.map(
            (item) =>
              String(
                getId(item)
              ) ===
              String(id)
                ? {
                    ...item,
                    status:
                      newStatus,
                  }
                : item
          )
      );

      setOpenMenu(null);
    } catch (err) {
      console.error(
        "UPDATE JOB STATUS ERROR:",
        err
      );

      alert(
        err?.message ||
          "Unable to update job status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     DELETE JOB
  ========================================================= */

  const deleteJobNow = async () => {
    if (!deleteJob) {
      return;
    }

    const id =
      getId(deleteJob);

    if (!id) {
      alert(
        "Job ID is missing."
      );
      return;
    }

    try {
      setActionLoading(true);

      /*
        Use existing API if available.
      */

      if (
        typeof api.deleteJob ===
        "function"
      ) {
        await api.deleteJob(
          id
        );
      } else if (
        typeof api.removeJob ===
        "function"
      ) {
        await api.removeJob(
          id
        );
      } else {
        /*
          Temporary frontend fallback.
        */
        console.warn(
          "No deleteJob/removeJob API found. Removing from UI only."
        );
      }

      setJobs(
        (current) =>
          current.filter(
            (job) =>
              String(
                getId(job)
              ) !==
              String(id)
          )
      );

      setDeleteJob(null);
      setOpenMenu(null);
    } catch (err) {
      console.error(
        "DELETE JOB ERROR:",
        err
      );

      alert(
        err?.message ||
          "Unable to delete job."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     CLOSE MENU WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const closeMenu = () => {
      setOpenMenu(null);
    };

    if (openMenu !== null) {
      document.addEventListener(
        "click",
        closeMenu
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        closeMenu
      );
    };
  }, [openMenu]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="jobs-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="jobs-header">

        <div>

          <div className="jobs-eyebrow">
            <BriefcaseBusiness
              size={13}
            />

            RECRUITING WORKSPACE
          </div>

          <h1>
            Jobs
          </h1>

          <p>
            Manage your hiring requirements,
            job status and recruitment activity.
          </p>

        </div>

        <button
          type="button"
          className="create-job-btn"
          onClick={() => {
            window.location.href =
              "/ai-recruiter/create-job";
          }}
        >
          <Plus size={15} />
          Create Job
        </button>

      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="jobs-summary">

        <div className="jobs-summary-card">

          <div className="summary-icon">
            <BriefcaseBusiness
              size={17}
            />
          </div>

          <div>
            <span>
              Total Jobs
            </span>

            <strong>
              {totalJobs}
            </strong>
          </div>

        </div>

        <div className="jobs-summary-card">

          <div className="summary-icon green">
            <CheckCircle2
              size={17}
            />
          </div>

          <div>
            <span>
              Active Jobs
            </span>

            <strong>
              {activeJobs}
            </strong>
          </div>

        </div>

        <div className="jobs-summary-card">

          <div className="summary-icon orange">
            <Clock3
              size={17}
            />
          </div>

          <div>
            <span>
              Paused Jobs
            </span>

            <strong>
              {pausedJobs}
            </strong>
          </div>

        </div>

        <div className="jobs-summary-card">

          <div className="summary-icon purple">
            <Users
              size={17}
            />
          </div>

          <div>
            <span>
              Applicants
            </span>

            <strong>
              {totalApplicants}
            </strong>
          </div>

        </div>

        <div className="jobs-summary-card">

          <div className="summary-icon blue">
            <UserCheck
              size={17}
            />
          </div>

          <div>
            <span>
              Shortlisted
            </span>

            <strong>
              {totalShortlisted}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="jobs-error">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadJobs}
          >
            <RefreshCw
              size={13}
            />
            Retry
          </button>

        </div>
      )}

      {/* =====================================================
          REQUISITIONS CARD
      ===================================================== */}

      <section className="requisitions-card">

        {/* HEADER */}

        <div className="requisitions-header">

          <div>

            <h2>
              Requisitions
            </h2>

            <p>
              Your current hiring requirements.
            </p>

          </div>

          <div className="requisitions-controls">

            {/* SEARCH */}

            <div className="jobs-search">

              <Search
                size={14}
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search jobs..."
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={12} />
                </button>
              )}

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="status-filter"
            >
              <option value="ALL">
                All Status
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="PAUSED">
                Paused
              </option>

              <option value="DRAFT">
                Draft
              </option>

              <option value="CLOSED">
                Closed
              </option>
            </select>

          </div>

        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="jobs-table-wrapper">

          <table className="jobs-table">

            <thead>

              <tr>

                <th>
                  POSITION
                </th>

                <th>
                  TEAM
                </th>

                <th>
                  LOCATION
                </th>

                <th>
                  APPLICANTS
                </th>

                <th>
                  SHORTLISTED
                </th>

                <th>
                  STATUS
                </th>

                <th>
                  ACTIONS
                </th>

              </tr>

            </thead>

            <tbody>

              {/* LOADING */}

              {loading && (
                <tr>

                  <td
                    colSpan="7"
                    className="jobs-empty"
                  >

                    <div className="loading-box">

                      <RefreshCw
                        size={18}
                        className="spin"
                      />

                      Loading jobs...

                    </div>

                  </td>

                </tr>
              )}

              {/* EMPTY */}

              {!loading &&
                filteredJobs.length ===
                  0 && (
                  <tr>

                    <td
                      colSpan="7"
                      className="jobs-empty"
                    >

                      <div className="empty-box">

                        <BriefcaseBusiness
                          size={22}
                        />

                        <strong>
                          No jobs found
                        </strong>

                        <span>
                          Try changing your
                          search or status filter.
                        </span>

                      </div>

                    </td>

                  </tr>
                )}

              {/* JOBS */}

              {!loading &&
                filteredJobs.map(
                  (job, index) => {

                    const id =
                      getId(job) ||
                      `job-${index}`;

                    const title =
                      getTitle(job);

                    const department =
                      getDepartment(
                        job
                      );

                    const location =
                      getLocation(
                        job
                      );

                    const status =
                      getStatus(job);

                    const applicants =
                      getApplicants(
                        job
                      );

                    const shortlisted =
                      getShortlisted(
                        job
                      );

                    return (
                      <tr
                        key={id}
                        className={
                          openMenu === id
                            ? "menu-open-row"
                            : ""
                        }
                      >

                        {/* POSITION */}

                        <td>

                          <div className="position-cell">

                            <div className="job-icon">
                              <BriefcaseBusiness
                                size={15}
                              />
                            </div>

                            <div>

                              <strong>
                                {title}
                              </strong>

                              <small>
                                ID{" "}
                                {String(id).slice(
                                  0,
                                  10
                                )}
                              </small>

                            </div>

                          </div>

                        </td>

                        {/* TEAM */}

                        <td>

                          <div className="table-info">

                            <Building2
                              size={14}
                            />

                            <span>
                              {department}
                            </span>

                          </div>

                        </td>

                        {/* LOCATION */}

                        <td>

                          <div className="table-info">

                            <MapPin
                              size={14}
                            />

                            <span>
                              {location}
                            </span>

                          </div>

                        </td>

                        {/* APPLICANTS */}

                        <td>

                          <strong className="number-cell">
                            {applicants}
                          </strong>

                        </td>

                        {/* SHORTLISTED */}

                        <td>

                          <strong className="number-cell">
                            {shortlisted}
                          </strong>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`job-status ${status.toLowerCase()}`}
                          >

                            {status}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div
                            className="job-actions"
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                          >

                            <button
                              type="button"
                              className="job-menu-button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    id
                                    ? null
                                    : id
                                )
                              }
                            >

                              <MoreVertical
                                size={16}
                              />

                            </button>

                            {openMenu ===
                              id && (
                              <div className="job-menu">

                                {/* VIEW */}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenu(
                                      null
                                    );

                                    /*
                                      Change this route
                                      if your job details
                                      route is different.
                                    */

                                    window.location.href =
                                      `/jobs/${id}`;
                                  }}
                                >
                                  <ChevronRight
                                    size={14}
                                  />

                                  View Job

                                </button>

                                {/* PAUSE / ACTIVATE */}

                                {status ===
                                "PAUSED" ? (
                                  <button
                                    type="button"
                                    disabled={
                                      actionLoading
                                    }
                                    onClick={() =>
                                      updateJobStatus(
                                        job
                                      )
                                    }
                                  >

                                    <Play
                                      size={14}
                                    />

                                    Activate Job

                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={
                                      actionLoading ||
                                      status ===
                                        "CLOSED"
                                    }
                                    onClick={() =>
                                      updateJobStatus(
                                        job
                                      )
                                    }
                                  >

                                    <Pause
                                      size={14}
                                    />

                                    Pause Job

                                  </button>
                                )}

                                {/* DELETE */}

                                <button
                                  type="button"
                                  className="delete-menu-item"
                                  onClick={() => {
                                    setDeleteJob(
                                      job
                                    );

                                    setOpenMenu(
                                      null
                                    );
                                  }}
                                >

                                  <Trash2
                                    size={14}
                                  />

                                  Delete Job

                                </button>

                              </div>
                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

            </tbody>

          </table>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        {!loading &&
          filteredJobs.length >
            0 && (
            <div className="jobs-footer">

              <span>
                Showing{" "}
                <strong>
                  {filteredJobs.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {jobs.length}
                </strong>{" "}
                jobs
              </span>

              <span>
                {activeJobs} active
                {" · "}
                {pausedJobs} paused
              </span>

            </div>
          )}

      </section>

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteJob && (
        <div
          className="delete-modal-overlay"
          onClick={() =>
            !actionLoading &&
            setDeleteJob(null)
          }
        >

          <div
            className="delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setDeleteJob(null)
              }
              disabled={actionLoading}
            >
              <X size={16} />
            </button>

            <div className="delete-icon">
              <AlertTriangle
                size={21}
              />
            </div>

            <h3>
              Delete this job?
            </h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {getTitle(deleteJob)}
              </strong>
              ?
              <br />
              This action cannot be undone.
            </p>

            <div className="delete-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  setDeleteJob(null)
                }
                disabled={
                  actionLoading
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-button"
                onClick={
                  deleteJobNow
                }
                disabled={
                  actionLoading
                }
              >

                <Trash2
                  size={14}
                />

                {actionLoading
                  ? "Deleting..."
                  : "Delete Job"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}