import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Upload,
  UserPlus,
  X,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Sparkles,
  Users,
  UserCheck,
  CalendarDays,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { api } from "../lib/api";
import "./Candidates.css";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("ALL");

  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState(null);

  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCandidates = async () => {
    try {
      setLoading(true);

      const result = await api.candidates();

      setCandidates(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(
        err?.message || "Unable to load candidates."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const name = `${candidate.first_name || ""} ${
        candidate.last_name || ""
      }`.trim();

      const skills = Array.isArray(candidate.skills)
        ? candidate.skills.join(" ")
        : candidate.skills || "";

      const matchesSearch =
        !query ||
        name.toLowerCase().includes(query) ||
        (candidate.email || "")
          .toLowerCase()
          .includes(query) ||
        (candidate.role || "")
          .toLowerCase()
          .includes(query) ||
        skills.toLowerCase().includes(query);

      const matchesStage =
        stage === "ALL" ||
        candidate.stage === stage;

      return matchesSearch && matchesStage;
    });
  }, [candidates, search, stage]);

  const stats = {
    total: candidates.length,

    matched: candidates.filter(
      (c) =>
        Number(c.ai_match_score || c.match_score || 0) > 0
    ).length,

    shortlisted: candidates.filter(
      (c) =>
        c.stage === "SHORTLISTED"
    ).length,

    interviews: candidates.filter(
      (c) =>
        c.stage === "INTERVIEW"
    ).length,
  };

  const openAddModal = () => {
    setModal(true);
    setMode(null);
    setMessage("");
    setError("");
  };

  const closeModal = () => {
    setModal(false);
    setMode(null);
  };

  const deleteCandidate = async (candidate) => {
    const confirmed = window.confirm(
      `Delete ${candidate.first_name || "this candidate"}?`
    );

    if (!confirmed) return;

    try {
      await api.deleteCandidate(candidate.id);

      setMessage("Candidate deleted successfully.");

      await loadCandidates();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to delete candidate."
      );
    }
  };

  return (
    <div className="candidates-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="candidates-header">

        <div>
          <div className="candidates-breadcrumb">
            RECRUITING WORKSPACE
            <span>/</span>
            CANDIDATES
          </div>

          <h1>Candidates</h1>

          <p>
            Manage your candidate database and track
            candidates throughout the hiring process.
          </p>
        </div>

        <button
          className="candidates-add-btn"
          onClick={openAddModal}
        >
          <Plus size={15} />
          Add Candidate
        </button>

      </div>

      {/* =====================================================
          ALERTS
      ====================================================== */}

      {(message || error) && (
        <div
          className={`candidate-alert ${
            error ? "error" : "success"
          }`}
        >
          {error ? (
            <span className="alert-error-icon">
              !
            </span>
          ) : (
            <CheckCircle2 size={14} />
          )}

          <span>
            {error || message}
          </span>

          <button
            onClick={() => {
              setError("");
              setMessage("");
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="candidate-stats">

        <StatCard
          icon={<Users size={17} />}
          label="Total Candidates"
          value={stats.total}
        />

        <StatCard
          icon={<Sparkles size={17} />}
          label="AI Matched"
          value={stats.matched}
        />

        <StatCard
          icon={<UserCheck size={17} />}
          label="Shortlisted"
          value={stats.shortlisted}
        />

        <StatCard
          icon={<CalendarDays size={17} />}
          label="Interviews"
          value={stats.interviews}
        />

      </div>

      {/* =====================================================
          CANDIDATE LIST
      ====================================================== */}

      <div className="candidate-list-card">

        {/* TOOLBAR */}

        <div className="candidate-toolbar">

          <div className="candidate-search">

            <Search size={15} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search candidates, roles or skills..."
            />

            {search && (
              <button
                onClick={() => setSearch("")}
              >
                <X size={13} />
              </button>
            )}

          </div>

          <select
            className="candidate-filter"
            value={stage}
            onChange={(e) =>
              setStage(e.target.value)
            }
          >
            <option value="ALL">
              All stages
            </option>

            <option value="APPLIED">
              Applied
            </option>

            <option value="SCREENING">
              Screening
            </option>

            <option value="SHORTLISTED">
              Shortlisted
            </option>

            <option value="INTERVIEW">
              Interview
            </option>

            <option value="OFFER">
              Offer
            </option>

            <option value="HIRED">
              Hired
            </option>
          </select>

        </div>

        {/* TABLE HEADER */}

        <div className="candidate-table-head">

          <div className="candidate-col candidate-main-col">
            Candidate
          </div>

          <div className="candidate-col">
            Role
          </div>

          <div className="candidate-col">
            Experience
          </div>

          <div className="candidate-col">
            Skills
          </div>

          <div className="candidate-col">
            AI Match
          </div>

          <div className="candidate-col">
            Stage
          </div>

          <div className="candidate-col candidate-action-col">
            Action
          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="candidate-empty">

            <Loader2
              size={22}
              className="candidate-loading"
            />

            <strong>
              Loading candidates...
            </strong>

          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================== */}

        {!loading &&
          filteredCandidates.length === 0 && (
            <div className="candidate-empty">

              <div className="candidate-empty-icon">
                <Users size={21} />
              </div>

              <strong>
                {search
                  ? "No candidates found"
                  : "No candidates yet"}
              </strong>

              <p>
                {search
                  ? "Try changing your search or filter."
                  : "Add a candidate manually or upload a resume to get started."}
              </p>

              {!search && (
                <button
                  className="candidate-empty-btn"
                  onClick={openAddModal}
                >
                  <Plus size={14} />
                  Add Candidate
                </button>
              )}

            </div>
          )}

        {/* =================================================
            ROWS
        ================================================== */}

        {!loading &&
          filteredCandidates.map((candidate) => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              onView={() =>
                setSelectedCandidate(candidate)
              }
              onDelete={() =>
                deleteCandidate(candidate)
              }
            />
          ))}

      </div>

      {/* =====================================================
          ADD CANDIDATE MODAL
      ====================================================== */}

      {modal && (
        <AddCandidateModal
          mode={mode}
          setMode={setMode}
          onClose={closeModal}
          onSuccess={async () => {
            closeModal();
            setMessage(
              "Candidate added successfully."
            );
            await loadCandidates();
          }}
          onError={(msg) =>
            setError(msg)
          }
        />
      )}

      {/* =====================================================
          VIEW CANDIDATE MODAL
      ====================================================== */}

      {selectedCandidate && (
        <CandidateDetails
          candidate={selectedCandidate}
          onClose={() =>
            setSelectedCandidate(null)
          }
        />
      )}

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="candidate-stat-card">

      <div className="candidate-stat-icon">
        {icon}
      </div>

      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>
      </div>

    </div>
  );
}


/* =========================================================
   CANDIDATE ROW
========================================================= */

function CandidateRow({
  candidate,
  onView,
  onDelete,
}) {
  const firstName =
    candidate.first_name || "";

  const lastName =
    candidate.last_name || "";

  const name =
    `${firstName} ${lastName}`.trim() ||
    candidate.name ||
    "Unnamed Candidate";

  const initials =
    name
      .split(" ")
      .map((x) => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const skills = Array.isArray(
    candidate.skills
  )
    ? candidate.skills
    : Array.isArray(
        candidate.skills_required
      )
    ? candidate.skills_required
    : [];

  const score = Number(
    candidate.ai_match_score ||
      candidate.match_score ||
      0
  );

  const stage =
    candidate.stage || "APPLIED";

  return (
    <div className="candidate-row">

      {/* CANDIDATE */}

      <div className="candidate-person">

        <div className="candidate-avatar">
          {initials || "C"}
        </div>

        <div className="candidate-person-info">

          <strong>
            {name}
          </strong>

          <small>
            {candidate.email ||
              "No email available"}
          </small>

          {candidate.location && (
            <small className="candidate-location">
              <MapPin size={10} />
              {candidate.location}
            </small>
          )}

        </div>

      </div>

      {/* ROLE */}

      <div className="candidate-role">

        <strong>
          {candidate.role ||
            candidate.job_title ||
            "Candidate"}
        </strong>

      </div>

      {/* EXPERIENCE */}

      <div className="candidate-experience">

        {candidate.experience_years != null
          ? `${candidate.experience_years} years`
          : candidate.experience
          ? candidate.experience
          : "—"}

      </div>

      {/* SKILLS */}

      <div className="candidate-skills">

        {skills.length > 0 ? (
          <>
            {skills
              .slice(0, 2)
              .map((skill, index) => (
                <span key={index}>
                  {skill}
                </span>
              ))}

            {skills.length > 2 && (
              <em>
                +{skills.length - 2}
              </em>
            )}
          </>
        ) : (
          <span className="no-skills">
            No skills
          </span>
        )}

      </div>

      {/* MATCH */}

      <div className="candidate-match">

        {score > 0 ? (
          <>
            <strong>
              {Math.round(score)}%
            </strong>

            <div className="match-progress">
              <span
                style={{
                  width: `${Math.min(
                    score,
                    100
                  )}%`,
                }}
              />
            </div>
          </>
        ) : (
          <span className="match-pending">
            Not matched
          </span>
        )}

      </div>

      {/* STAGE */}

      <div>
        <StageBadge stage={stage} />
      </div>

      {/* ACTION */}

      <div className="candidate-actions">

        <button
          title="View candidate"
          onClick={onView}
        >
          <Eye size={14} />
        </button>

        <button
          title="Delete candidate"
          onClick={onDelete}
        >
          <Trash2 size={14} />
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   STAGE BADGE
========================================================= */

function StageBadge({ stage }) {
  const labels = {
    APPLIED: "Applied",
    SCREENING: "Screening",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    HIRED: "Hired",
  };

  return (
    <span
      className={`candidate-stage ${stage.toLowerCase()}`}
    >
      {labels[stage] || stage}
    </span>
  );
}


/* =========================================================
   ADD CANDIDATE MODAL
========================================================= */

function AddCandidateModal({
  mode,
  setMode,
  onClose,
  onSuccess,
  onError,
}) {
  return (
    <div
      className="candidate-modal-overlay"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="candidate-modal">

        {/* HEADER */}

        <div className="candidate-modal-header">

          <div>

            <h2>
              Add Candidate
            </h2>

            <p>
              Add a candidate to your recruitment database.
            </p>

          </div>

          <button
            onClick={onClose}
            className="modal-close"
          >
            <X size={16} />
          </button>

        </div>

        {!mode && (
          <div className="candidate-add-options">

            {/* UPLOAD */}

            <button
              className="candidate-add-option"
              onClick={() =>
                setMode("UPLOAD")
              }
            >

              <div className="candidate-option-icon upload">
                <Upload size={22} />
              </div>

              <div>

                <strong>
                  Upload Resume
                </strong>

                <p>
                  Upload a PDF or DOCX resume.
                  Candidate details will be extracted automatically.
                </p>

                <span>
                  AI resume parsing →
                </span>

              </div>

            </button>

            {/* MANUAL */}

            <button
              className="candidate-add-option"
              onClick={() =>
                setMode("MANUAL")
              }
            >

              <div className="candidate-option-icon manual">
                <UserPlus size={22} />
              </div>

              <div>

                <strong>
                  Add Manually
                </strong>

                <p>
                  Enter candidate information,
                  skills and experience yourself.
                </p>

                <span>
                  Enter candidate details →
                </span>

              </div>

            </button>

          </div>
        )}

        {mode === "MANUAL" && (
          <ManualCandidateForm
            onBack={() =>
              setMode(null)
            }
            onSuccess={onSuccess}
            onError={onError}
          />
        )}

        {mode === "UPLOAD" && (
          <ResumeUploadForm
            onBack={() =>
              setMode(null)
            }
            onSuccess={onSuccess}
            onError={onError}
          />
        )}

      </div>

    </div>
  );
}


/* =========================================================
   MANUAL FORM
========================================================= */

function ManualCandidateForm({
  onBack,
  onSuccess,
  onError,
}) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    experience_years: "",
    skills: "",
    summary: "",
  });

  const [saving, setSaving] =
    useState(false);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.first_name.trim()) {
      onError("First name is required.");
      return;
    }

    if (!form.email.trim()) {
      onError("Email is required.");
      return;
    }

    try {
      setSaving(true);

      await api.createCandidate({
        ...form,

        experience_years:
          form.experience_years
            ? Number(
                form.experience_years
              )
            : 0,

        skills: form.skills
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),

        stage: "APPLIED",
      });

      onSuccess();
    } catch (err) {
      onError(
        err?.message ||
          "Unable to create candidate."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="candidate-form"
      onSubmit={submit}
    >

      <div className="candidate-form-grid">

        <CandidateField label="First Name">
          <input
            value={form.first_name}
            onChange={(e) =>
              update(
                "first_name",
                e.target.value
              )
            }
            placeholder="Bhuvanesh"
          />
        </CandidateField>

        <CandidateField label="Last Name">
          <input
            value={form.last_name}
            onChange={(e) =>
              update(
                "last_name",
                e.target.value
              )
            }
            placeholder="Kumar"
          />
        </CandidateField>

        <CandidateField label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              update(
                "email",
                e.target.value
              )
            }
            placeholder="candidate@email.com"
          />
        </CandidateField>

        <CandidateField label="Phone">
          <input
            value={form.phone}
            onChange={(e) =>
              update(
                "phone",
                e.target.value
              )
            }
            placeholder="+91 XXXXX XXXXX"
          />
        </CandidateField>

        <CandidateField label="Location">
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
        </CandidateField>

        <CandidateField label="Current Role">
          <input
            value={form.role}
            onChange={(e) =>
              update(
                "role",
                e.target.value
              )
            }
            placeholder="Backend Engineer"
          />
        </CandidateField>

        <CandidateField label="Experience">
          <input
            type="number"
            min="0"
            value={
              form.experience_years
            }
            onChange={(e) =>
              update(
                "experience_years",
                e.target.value
              )
            }
            placeholder="5"
          />
        </CandidateField>

        <CandidateField
          label="Skills"
          full
        >
          <input
            value={form.skills}
            onChange={(e) =>
              update(
                "skills",
                e.target.value
              )
            }
            placeholder="Python, FastAPI, PostgreSQL, AWS"
          />

          <small>
            Separate skills using commas.
          </small>
        </CandidateField>

        <CandidateField
          label="Candidate Summary"
          full
        >
          <textarea
            value={form.summary}
            onChange={(e) =>
              update(
                "summary",
                e.target.value
              )
            }
            placeholder="Experience, background and relevant information..."
          />
        </CandidateField>

      </div>

      <div className="candidate-form-footer">

        <button
          type="button"
          className="candidate-secondary-btn"
          onClick={onBack}
        >
          Back
        </button>

        <button
          type="submit"
          className="candidate-primary-btn"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2
                size={14}
                className="candidate-spinner"
              />
              Saving...
            </>
          ) : (
            <>
              <UserPlus size={14} />
              Save Candidate
            </>
          )}
        </button>

      </div>

    </form>
  );
}


/* =========================================================
   RESUME UPLOAD
========================================================= */

function ResumeUploadForm({
  onBack,
  onSuccess,
  onError,
}) {
  const fileRef = useRef(null);

  const [file, setFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const chooseFile = (selected) => {
    if (!selected) return;

    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (
      !allowed.includes(
        selected.type
      )
    ) {
      onError(
        "Please upload a PDF or DOCX resume."
      );
      return;
    }

    setFile(selected);
  };

  const upload = async () => {
    if (!file) {
      onError(
        "Please select a resume first."
      );
      return;
    }

    try {
      setUploading(true);

      /*
       * This assumes your API exposes:
       *
       * api.uploadResume(file)
       *
       * If your existing api.js uses a different
       * method name, keep the same UI and change
       * only this API call.
       */

      await api.uploadResume(file);

      onSuccess();
    } catch (err) {
      onError(
        err?.message ||
          "Unable to upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="resume-upload">

      <button
        className="candidate-back-link"
        onClick={onBack}
      >
        ← Back to options
      </button>

      <div
        className={`resume-dropzone ${
          file ? "has-file" : ""
        }`}
        onClick={() =>
          fileRef.current?.click()
        }
      >

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          onChange={(e) =>
            chooseFile(
              e.target.files?.[0]
            )
          }
        />

        {!file ? (
          <>
            <div className="resume-upload-icon">
              <Upload size={23} />
            </div>

            <strong>
              Upload candidate resume
            </strong>

            <p>
              Drag and drop your resume here,
              or click to browse.
            </p>

            <span>
              PDF or DOCX · Max 10 MB
            </span>
          </>
        ) : (
          <>
            <div className="resume-upload-icon success">
              <FileText size={23} />
            </div>

            <strong>
              {file.name}
            </strong>

            <p>
              Resume ready for AI parsing.
            </p>

            <span>
              Click to choose another file
            </span>
          </>
        )}

      </div>

      <div className="resume-ai-info">

        <Sparkles size={15} />

        <div>

          <strong>
            AI Resume Parsing
          </strong>

          <p>
            Candidate name, email, phone,
            experience, skills and profile
            information will be extracted
            automatically.
          </p>

        </div>

      </div>

      <div className="candidate-form-footer">

        <button
          className="candidate-secondary-btn"
          onClick={onBack}
        >
          Back
        </button>

        <button
          className="candidate-primary-btn"
          onClick={upload}
          disabled={
            uploading || !file
          }
        >
          {uploading ? (
            <>
              <Loader2
                size={14}
                className="candidate-spinner"
              />
              Processing...
            </>
          ) : (
            <>
              <Upload size={14} />
              Upload & Parse
            </>
          )}
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   FIELD
========================================================= */

function CandidateField({
  label,
  children,
  full = false,
}) {
  return (
    <div
      className={`candidate-field ${
        full ? "full" : ""
      }`}
    >
      <label>
        {label}
      </label>

      {children}
    </div>
  );
}


/* =========================================================
   CANDIDATE DETAILS
========================================================= */

function CandidateDetails({
  candidate,
  onClose,
}) {
  const name =
    `${candidate.first_name || ""} ${
      candidate.last_name || ""
    }`.trim() ||
    candidate.name ||
    "Candidate";

  const skills = Array.isArray(
    candidate.skills
  )
    ? candidate.skills
    : [];

  return (
    <div
      className="candidate-modal-overlay"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="candidate-details-modal">

        <div className="candidate-modal-header">

          <div>
            <h2>
              Candidate Profile
            </h2>

            <p>
              Candidate information and recruitment details.
            </p>
          </div>

          <button
            onClick={onClose}
            className="modal-close"
          >
            <X size={16} />
          </button>

        </div>

        <div className="candidate-details-hero">

          <div className="candidate-details-avatar">
            {name
              .split(" ")
              .map((x) => x[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          <div>

            <h3>
              {name}
            </h3>

            <p>
              {candidate.role ||
                "Candidate"}
            </p>

          </div>

        </div>

        <div className="candidate-details-grid">

          <DetailItem
            icon={<Mail size={14} />}
            label="Email"
            value={
              candidate.email || "—"
            }
          />

          <DetailItem
            icon={<Phone size={14} />}
            label="Phone"
            value={
              candidate.phone || "—"
            }
          />

          <DetailItem
            icon={<MapPin size={14} />}
            label="Location"
            value={
              candidate.location || "—"
            }
          />

          <DetailItem
            icon={
              <BriefcaseBusiness
                size={14}
              />
            }
            label="Experience"
            value={
              candidate.experience_years != null
                ? `${candidate.experience_years} years`
                : "—"
            }
          />

        </div>

        <div className="candidate-detail-section">

          <h4>
            Skills
          </h4>

          <div className="detail-skills">

            {skills.length ? (
              skills.map(
                (skill, index) => (
                  <span key={index}>
                    {skill}
                  </span>
                )
              )
            ) : (
              <small>
                No skills available.
              </small>
            )}

          </div>

        </div>

        {candidate.summary && (
          <div className="candidate-detail-section">

            <h4>
              Summary
            </h4>

            <p>
              {candidate.summary}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}


function DetailItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="candidate-detail-item">

      <div>
        {icon}
      </div>

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}