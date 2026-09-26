import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Sparkles,
  ArrowRight,
  MapPin,
  Building2,
  Clock3,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { api } from "../../../lib/api";
import "./CreateJob.css";

export default function CreateJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Chennai, India",
    workplace_type: "Hybrid",
    employment_type: "Full-time",
    salary_range: "",
    skills_required: "Python, FastAPI, PostgreSQL, AWS",
    requirements:
      "5+ years backend experience\nAPI design and development\nCloud deployment experience",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveJob = async (continueToMatching = false) => {
    setMessage("");
    setError("");

    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!form.department.trim()) {
      setError("Department is required.");
      return;
    }

    if (!form.location.trim()) {
      setError("Location is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        workplace_type: form.workplace_type,
        employment_type: form.employment_type,
        salary_range: form.salary_range.trim(),

        skills_required: form.skills_required
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        requirements: form.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        description: form.description.trim(),

        status: "ACTIVE",
      };

      const result = await api.createJob(payload);

      setMessage("Job created successfully.");

      if (continueToMatching) {
        setTimeout(() => {
          navigate(
            `/ai-recruiter/candidate-matching?job=${result.id}`
          );
        }, 500);
      }
    } catch (err) {
      setError(
        err?.message ||
          "Unable to create job. Please check your backend connection."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-job-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="create-job-header">

        <div className="create-job-heading">

          <h1>Create Job</h1>

          <p>
            Create a new recruitment requisition and define
            the requirements for your next hire.
          </p>

        </div>

        <div className="create-job-actions">

          <Link
            to="/ai-recruiter/ai-job-description"
            className="create-job-ai-btn"
          >
            <Sparkles size={14} />
            AI Job Description
            <ArrowRight size={13} />
          </Link>

          <button
            className="create-job-save-btn"
            onClick={() => saveJob(false)}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2
                  size={14}
                  className="create-job-spinner"
                />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Save Job
              </>
            )}
          </button>

        </div>

      </div>

      {/* =====================================================
          MESSAGE
      ====================================================== */}

      {(message || error) && (
        <div
          className={`create-job-message ${
            error ? "error" : "success"
          }`}
        >
          {error ? (
            <span>!</span>
          ) : (
            <CheckCircle2 size={14} />
          )}

          <p>
            {error || message}
          </p>

        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="create-job-grid">

        {/* ===================================================
            LEFT CARD
        ==================================================== */}

        <section className="create-job-card">

          <div className="create-job-card-header">

            <div className="create-job-card-icon">
              <BriefcaseBusiness size={17} />
            </div>

            <div>
              <h2>Job Information</h2>

              <p>
                Add the core information for this position.
              </p>
            </div>

          </div>

          <div className="create-job-form">

            {/* JOB TITLE */}

            <Field
              label="Job Title"
              required
            >
              <input
                value={form.title}
                onChange={(e) =>
                  update(
                    "title",
                    e.target.value
                  )
                }
                placeholder="Senior Backend Engineer"
              />
            </Field>

            {/* DEPARTMENT */}

            <Field
              label="Department"
              required
            >
              <div className="create-job-icon-input">

                <Building2 size={14} />

                <input
                  value={form.department}
                  onChange={(e) =>
                    update(
                      "department",
                      e.target.value
                    )
                  }
                  placeholder="Engineering"
                />

              </div>
            </Field>

            {/* LOCATION */}

            <Field
              label="Location"
              required
            >
              <div className="create-job-icon-input">

                <MapPin size={14} />

                <input
                  value={form.location}
                  onChange={(e) =>
                    update(
                      "location",
                      e.target.value
                    )
                  }
                  placeholder="Chennai, India"
                />

              </div>
            </Field>

            {/* EMPLOYMENT */}

            <Field label="Employment Type">

              <select
                value={form.employment_type}
                onChange={(e) =>
                  update(
                    "employment_type",
                    e.target.value
                  )
                }
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>

            </Field>

            {/* WORKPLACE */}

            <Field label="Workplace">

              <select
                value={form.workplace_type}
                onChange={(e) =>
                  update(
                    "workplace_type",
                    e.target.value
                  )
                }
              >
                <option>Hybrid</option>
                <option>Remote</option>
                <option>On-site</option>
              </select>

            </Field>

            {/* SALARY */}

            <Field label="Salary Range">

              <input
                value={form.salary_range}
                onChange={(e) =>
                  update(
                    "salary_range",
                    e.target.value
                  )
                }
                placeholder="e.g. ₹8L - ₹14L"
              />

            </Field>

            {/* SKILLS */}

            <Field
              label="Required Skills"
              full
            >

              <input
                value={form.skills_required}
                onChange={(e) =>
                  update(
                    "skills_required",
                    e.target.value
                  )
                }
                placeholder="Python, FastAPI, PostgreSQL, AWS"
              />

              <small>
                Separate multiple skills with commas.
              </small>

            </Field>

            {/* REQUIREMENTS */}

            <Field
              label="Requirements"
              full
            >

              <textarea
                className="create-job-requirements"
                value={form.requirements}
                onChange={(e) =>
                  update(
                    "requirements",
                    e.target.value
                  )
                }
                placeholder={
                  "5+ years backend experience\nAPI design and development\nCloud deployment experience"
                }
              />

              <small>
                Add one requirement per line.
              </small>

            </Field>

            {/* DESCRIPTION */}

            <Field
              label="Description"
              full
            >

              <textarea
                className="create-job-description"
                value={form.description}
                onChange={(e) =>
                  update(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Describe the role, responsibilities and expectations..."
              />

            </Field>

          </div>

        </section>

        {/* ===================================================
            RIGHT CARD
        ==================================================== */}

        <section className="create-job-card preview-card">

          <div className="create-job-card-header">

            <div className="create-job-card-icon">
              <FilePreviewIcon />
            </div>

            <div>
              <h2>Job Preview</h2>

              <p>
                Review the position before creating it.
              </p>
            </div>

          </div>

          {/* JOB PREVIEW */}

          <div className="job-preview">

            <div className="job-preview-top">

              <div className="job-preview-icon">
                <BriefcaseBusiness size={19} />
              </div>

              <div>

                <h2>
                  {form.title ||
                    "Job title"}
                </h2>

                <p>
                  {form.department ||
                    "Department"}
                </p>

              </div>

            </div>

            {/* META */}

            <div className="job-preview-meta">

              <span>
                <MapPin size={12} />

                {form.location ||
                  "Location"}
              </span>

              <span>
                <Building2 size={12} />

                {form.workplace_type}
              </span>

              <span>
                <Clock3 size={12} />

                {form.employment_type}
              </span>

            </div>

            {/* DIVIDER */}

            <div className="preview-divider" />

            {/* SKILLS */}

            <div className="preview-section">

              <h4>
                Required Skills
              </h4>

              <div className="preview-skills">

                {form.skills_required
                  .split(",")
                  .map((skill) =>
                    skill.trim()
                  )
                  .filter(Boolean)
                  .map(
                    (skill, index) => (
                      <span
                        key={index}
                      >
                        {skill}
                      </span>
                    )
                  )}

              </div>

            </div>

            {/* REQUIREMENTS */}

            <div className="preview-section">

              <h4>
                Requirements
              </h4>

              <div className="preview-requirements">

                {form.requirements
                  .split("\n")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean)
                  .map(
                    (item, index) => (
                      <div
                        key={index}
                      >
                        <CheckCircle2
                          size={13}
                        />

                        <span>
                          {item}
                        </span>
                      </div>
                    )
                  )}

              </div>

            </div>

            {/* DESCRIPTION */}

            {form.description && (
              <div className="preview-section">

                <h4>
                  Description
                </h4>

                <p className="preview-description">
                  {form.description}
                </p>

              </div>
            )}

          </div>

          {/* FOOTER */}

          <div className="preview-footer">

            <div>

              <strong>
                Ready to create this job?
              </strong>

              <span>
                Save the requisition and continue
                to candidate matching.
              </span>

            </div>

            <button
              className="preview-continue"
              onClick={() =>
                saveJob(true)
              }
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2
                    size={14}
                    className="create-job-spinner"
                  />
                  Saving...
                </>
              ) : (
                <>
                  Save & Continue
                  <ArrowRight size={14} />
                </>
              )}
            </button>

          </div>

        </section>

      </div>

    </div>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  children,
  full = false,
  required = false,
}) {
  return (
    <div
      className={`create-job-field ${
        full ? "full" : ""
      }`}
    >
      <label>
        {label}

        {required && (
          <span>*</span>
        )}
      </label>

      {children}
    </div>
  );
}


/* =========================================================
   PREVIEW ICON
========================================================= */

function FilePreviewIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
      />

      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}