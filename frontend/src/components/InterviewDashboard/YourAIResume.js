import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import {
  FiPlus,
  FiUploadCloud,
  FiSearch,
  FiGrid,
  FiList,
  FiMoreVertical,
  FiEdit3,
  FiUpload,
  FiFileText,
  FiUser,
  FiBookOpen,
  FiBriefcase,
  FiArrowLeft,
  FiTrash2,
} from "react-icons/fi";

import {
  createResume,
  updateResume,
  uploadResumeFile,
  getUserResumes,
} from "../../services/interviewApi";


/* =========================================================
   EMPTY RESUME
========================================================= */

const EMPTY_RESUME = {
  title: "",
  name: "",
  email: "",
  phone: "",
  linkedin: "",
  location: "",
  summary: "",
  skills: "",
  experience: "",
  education: "",
  certifications: "",
  other_experience: "",
};


/* =========================================================
   EMPTY EDUCATION
========================================================= */

const EMPTY_EDUCATION = {
  school: "",
  degree: "",
  field: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};


/* =========================================================
   EMPTY JOB
========================================================= */

const EMPTY_JOB = {
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};


/* =========================================================
   EMPTY OTHER EXPERIENCE
========================================================= */

const EMPTY_OTHER = {
  title: "",
  organization: "",
  startDate: "",
  endDate: "",
  description: "",
};


/* =========================================================
   COMPONENT
========================================================= */

const YourAIResume = () => {
  /* -------------------------------------------------------
     RESUME LIST
  ------------------------------------------------------- */

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");


  /* -------------------------------------------------------
     EDITOR
  ------------------------------------------------------- */

  const [currentView, setCurrentView] = useState("list");
  const [editorTab, setEditorTab] = useState("edit");

  const [resumeData, setResumeData] =
    useState(EMPTY_RESUME);

  const [resumeId, setResumeId] = useState(null);

  const [selectedFile, setSelectedFile] =
    useState(null);


  /* -------------------------------------------------------
     REPEATABLE RESUME SECTIONS
  ------------------------------------------------------- */

  const [educationEntries, setEducationEntries] =
    useState([]);

  const [jobEntries, setJobEntries] =
    useState([]);

  const [otherEntries, setOtherEntries] =
    useState([]);


  /* -------------------------------------------------------
     STATUS
  ------------------------------------------------------- */

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");


  /* -------------------------------------------------------
     MANUAL CREATE POPUP
  ------------------------------------------------------- */

  const [showManualModal, setShowManualModal] =
    useState(false);

  const [manualResumeTitle, setManualResumeTitle] =
    useState("My Resume");


  const fileInputRef = useRef(null);


  /* =========================================================
     USER
  ========================================================= */

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  };


  /* =========================================================
     LOAD RESUMES
  ========================================================= */

  const loadResumes = useCallback(async () => {
    setLoading(true);

    const user = getUser();

    if (user?.id) {
      try {
        const data = await getUserResumes(user.id);

        setResumes(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Error loading resumes:",
          err
        );
      }
    }

    setLoading(false);
  }, []);


  useEffect(() => {
    loadResumes();
  }, [loadResumes]);


  /* =========================================================
     UPLOAD RESUME
  ========================================================= */

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setUploading(true);
    setSaveMessage("");

    const user = getUser();

    try {
      if (user) {
        const result =
          await uploadResumeFile(
            user.id,
            file
          );

        setResumeId(
          result.resume_id || result.id
        );

        setResumeData((prev) => ({
          ...prev,

          title:
            result.filename?.replace(
              /\.[^/.]+$/,
              ""
            ) ||
            file.name.replace(
              /\.[^/.]+$/,
              ""
            ),
        }));
      } else {
        setResumeData((prev) => ({
          ...prev,

          title: file.name.replace(
            /\.[^/.]+$/,
            ""
          ),
        }));
      }

      await loadResumes();

      setCurrentView("edit");
      setEditorTab("edit");

      setSaveMessage(
        "File uploaded! Verify your details and save."
      );
    } catch (err) {
      setSaveMessage(
        "Upload failed: " + err.message
      );
    } finally {
      setUploading(false);
    }
  };


  /* =========================================================
     CREATE MANUALLY
  ========================================================= */

  const handleCreateManually = () => {
    setManualResumeTitle("My Resume");
    setShowManualModal(true);
  };


  /* =========================================================
     CONFIRM MANUAL CREATE
  ========================================================= */

  const handleConfirmManualCreate = () => {
    const title =
      manualResumeTitle.trim() ||
      "My Resume";

    setResumeData({
      ...EMPTY_RESUME,
      title,
    });

    setEducationEntries([]);
    setJobEntries([]);
    setOtherEntries([]);

    setSelectedFile(null);
    setResumeId(null);
    setSaveMessage("");

    setShowManualModal(false);

    setCurrentView("edit");
    setEditorTab("edit");
  };


  /* =========================================================
     EDIT EXISTING RESUME
  ========================================================= */

  const handleEditResume = (res) => {
    setResumeData({
      title: res.title || "Untitled Resume",

      name: res.name || "",
      email: res.email || "",
      phone: res.phone || "",
      linkedin: res.linkedin || "",
      location: res.location || "",

      summary: res.summary || "",
      skills: res.skills || "",

      experience: res.experience || "",
      education: res.education || "",

      certifications:
        res.certifications || "",

      other_experience:
        res.other_experience || "",
    });


    /* -------------------------------------------------------
       EDUCATION
    ------------------------------------------------------- */

    if (Array.isArray(res.education_entries)) {
      setEducationEntries(
        res.education_entries
      );
    } else if (res.education) {
      setEducationEntries([
        {
          ...EMPTY_EDUCATION,
          description: res.education,
        },
      ]);
    } else {
      setEducationEntries([]);
    }


    /* -------------------------------------------------------
       JOB EXPERIENCE
    ------------------------------------------------------- */

    if (Array.isArray(res.job_entries)) {
      setJobEntries(res.job_entries);
    } else if (res.experience) {
      setJobEntries([
        {
          ...EMPTY_JOB,
          description: res.experience,
        },
      ]);
    } else {
      setJobEntries([]);
    }


    /* -------------------------------------------------------
       OTHER EXPERIENCE
    ------------------------------------------------------- */

    if (Array.isArray(res.other_entries)) {
      setOtherEntries(res.other_entries);
    } else if (res.other_experience) {
      setOtherEntries([
        {
          ...EMPTY_OTHER,
          description: res.other_experience,
        },
      ]);
    } else {
      setOtherEntries([]);
    }


    setResumeId(res.id);

    setCurrentView("edit");
    setEditorTab("edit");
  };


  /* =========================================================
     NORMAL INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    setResumeData({
      ...resumeData,
      [e.target.name]: e.target.value,
    });
  };


  /* =========================================================
     EDUCATION
  ========================================================= */

  const addEducation = () => {
    setEducationEntries((prev) => [
      ...prev,
      {
        ...EMPTY_EDUCATION,
      },
    ]);
  };


  const updateEducation = (
    index,
    field,
    value
  ) => {
    setEducationEntries((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };


  const removeEducation = (index) => {
    setEducationEntries((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };


  /* =========================================================
     JOB EXPERIENCE
  ========================================================= */

  const addJob = () => {
    setJobEntries((prev) => [
      ...prev,
      {
        ...EMPTY_JOB,
      },
    ]);
  };


  const updateJob = (
    index,
    field,
    value
  ) => {
    setJobEntries((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };


  const removeJob = (index) => {
    setJobEntries((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };


  /* =========================================================
     OTHER EXPERIENCE
  ========================================================= */

  const addOther = () => {
    setOtherEntries((prev) => [
      ...prev,
      {
        ...EMPTY_OTHER,
      },
    ]);
  };


  const updateOther = (
    index,
    field,
    value
  ) => {
    setOtherEntries((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };


  const removeOther = (index) => {
    setOtherEntries((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };


  /* =========================================================
     FORMAT EDUCATION FOR EXISTING BACKEND
  ========================================================= */

  const formatEducationForSave = () => {
    return educationEntries
      .map((item) => {
        const parts = [];

        if (item.degree) {
          parts.push(item.degree);
        }

        if (item.field) {
          parts.push(item.field);
        }

        if (item.school) {
          parts.push(
            `at ${item.school}`
          );
        }

        if (item.location) {
          parts.push(
            `(${item.location})`
          );
        }

        if (
          item.startDate ||
          item.endDate
        ) {
          parts.push(
            `${item.startDate || ""} - ${item.endDate || ""
            }`
          );
        }

        if (item.description) {
          parts.push(
            item.description
          );
        }

        return parts.join(" | ");
      })
      .filter(Boolean)
      .join("\n\n");
  };


  /* =========================================================
     FORMAT JOB EXPERIENCE FOR SAVE
  ========================================================= */

  const formatJobsForSave = () => {
    return jobEntries
      .map((item) => {
        const parts = [];

        if (item.position) {
          parts.push(item.position);
        }

        if (item.company) {
          parts.push(
            `at ${item.company}`
          );
        }

        if (item.location) {
          parts.push(
            `(${item.location})`
          );
        }

        if (
          item.startDate ||
          item.endDate
        ) {
          parts.push(
            `${item.startDate || ""} - ${item.endDate || ""
            }`
          );
        }

        if (item.description) {
          parts.push(
            item.description
          );
        }

        return parts.join(" | ");
      })
      .filter(Boolean)
      .join("\n\n");
  };


  /* =========================================================
     FORMAT OTHER EXPERIENCE
  ========================================================= */

  const formatOtherForSave = () => {
    return otherEntries
      .map((item) => {
        const parts = [];

        if (item.title) {
          parts.push(item.title);
        }

        if (item.organization) {
          parts.push(
            `at ${item.organization}`
          );
        }

        if (
          item.startDate ||
          item.endDate
        ) {
          parts.push(
            `${item.startDate || ""} - ${item.endDate || ""
            }`
          );
        }

        if (item.description) {
          parts.push(
            item.description
          );
        }

        return parts.join(" | ");
      })
      .filter(Boolean)
      .join("\n\n");
  };


  /* =========================================================
     SAVE RESUME
  ========================================================= */

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");

    const user = getUser();

    if (!user) {
      setSaveMessage(
        "You must be logged in to save a resume."
      );

      setSaving(false);

      return;
    }


    try {
      const educationText =
        formatEducationForSave();

      const experienceText =
        formatJobsForSave();

      const otherExperienceText =
        formatOtherForSave();


      const payload = {
        ...resumeData,

        user_id: user.id,

        education:
          educationText ||
          resumeData.education,

        experience:
          experienceText ||
          resumeData.experience,

        other_experience:
          otherExperienceText ||
          resumeData.other_experience,

        education_entries:
          educationEntries,

        job_entries:
          jobEntries,

        other_entries:
          otherEntries,
      };


      let saved;


      if (resumeId) {
        saved =
          await updateResume(
            resumeId,
            payload
          );
      } else {
        saved =
          await createResume(
            payload
          );

        setResumeId(saved.id);
      }


      setSaveMessage(
        "✓ Resume saved successfully!"
      );

      await loadResumes();
    } catch (err) {
      setSaveMessage(
        "Save failed: " +
        err.message
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (
    dateString
  ) => {
    if (!dateString) {
      return "AUG 24, 2026";
    }

    const d =
      new Date(dateString);

    return d
      .toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      )
      .toUpperCase();
  };


  /* =========================================================
     FILTER RESUMES
  ========================================================= */

  const filteredResumes =
    resumes.filter((item) => {
      const matchesSearch =
        (item.title || "")
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||
        (item.name || "")
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          );


      if (
        activeTab ===
        "uploaded"
      ) {
        return (
          matchesSearch &&
          (
            item.file_url ||
            item.type ===
            "uploaded"
          )
        );
      }


      if (
        activeTab ===
        "manual"
      ) {
        return (
          matchesSearch &&
          !item.file_url &&
          item.type !==
          "uploaded"
        );
      }


      return matchesSearch;
    });


  /* =========================================================
     LIST PAGE
  ========================================================= */

  if (
    currentView === "list"
  ) {
    return (
      <div className="yourai-resume-page">

        {/* HEADER */}

        <div className="resume-header">

          <div>
            <h2>
              CVs &amp; Resumes
            </h2>

            <p>
              Create or upload resumes
              to personalize AI answers.
            </p>
          </div>


          <div className="resume-header-actions">

            <button
              type="button"
              className="resume-create-manual-btn"
              onClick={
                handleCreateManually
              }
            >
              <FiPlus />

              <span>
                Create Manually
              </span>
            </button>


            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              style={{
                display: "none",
              }}
              onChange={
                handleUpload
              }
            />


            <button
              type="button"
              className="resume-upload-header-btn"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
            >
              <FiUploadCloud />

              <span>
                {uploading
                  ? "Uploading..."
                  : "Upload Resume"}
              </span>
            </button>

          </div>

        </div>


        {/* TABS */}

        <div className="resume-tabs-row">

          <div className="resume-tabs-left">

            <button
              type="button"
              className={
                activeTab === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("all")
              }
            >
              All
            </button>


            <button
              type="button"
              className={
                activeTab ===
                  "uploaded"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(
                  "uploaded"
                )
              }
            >
              Uploaded
            </button>


            <button
              type="button"
              className={
                activeTab ===
                  "manual"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab(
                  "manual"
                )
              }
            >
              Created Manually
            </button>

          </div>


          <span className="resume-count-tag">
            {filteredResumes.length}{" "}
            Resumes
          </span>

        </div>


        {/* TOOLBAR */}

        <div className="resume-toolbar-row">

          <div className="resume-search-box">

            <FiSearch />

            <input
              type="text"
              placeholder="Search CVs or resumes"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
            />

          </div>


          <button
            type="button"
            className="resume-sort-btn"
            title="Sort"
          >
            ⇅
          </button>


          <div className="resume-view-switcher">

            <button
              type="button"
              className={
                viewMode ===
                  "grid"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setViewMode(
                  "grid"
                )
              }
            >
              <FiGrid />
            </button>


            <button
              type="button"
              className={
                viewMode ===
                  "list"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setViewMode(
                  "list"
                )
              }
            >
              <FiList />
            </button>

          </div>

        </div>


        {/* RESUME CARDS */}

        {loading ? (

          <div className="resume-upload-empty">
            <p>
              Loading resumes...
            </p>
          </div>

        ) : filteredResumes.length >
          0 ? (

          <div
            className={`resume-cards-container ${viewMode ===
              "list"
              ? "list-mode"
              : "grid-mode"
              }`}
          >

            {filteredResumes.map(
              (res) => {

                const isUploaded =
                  res.file_url ||
                  res.type ===
                  "uploaded";

                return (

                  <div
                    key={res.id}
                    className="resume-item-card"
                    onClick={() =>
                      handleEditResume(
                        res
                      )
                    }
                  >

                    <div className="resume-item-top">

                      <div className="resume-item-date">
                        {formatDate(
                          res.created_at
                        )}
                      </div>


                      <button
                        type="button"
                        className="resume-item-menu"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        <FiMoreVertical />
                      </button>

                    </div>


                    <h5 className="resume-item-title">
                      {res.title ||
                        "My Resume"}
                    </h5>


                    <div className="resume-item-badge-wrap">

                      <span className="resume-item-badge">

                        {isUploaded ? (
                          <>
                            <FiUpload
                              size={13}
                            />

                            Uploaded
                          </>
                        ) : (
                          <>
                            <FiEdit3
                              size={13}
                            />

                            Created
                            Manually
                          </>
                        )}

                      </span>

                    </div>


                    <div className="resume-item-footer">

                      <span>
                        {isUploaded
                          ? "PDF · Document"
                          : "Text"}
                      </span>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          <div className="resume-upload-empty">

            <h2>
              No resumes found
            </h2>

            <p>
              Upload a resume or
              create one manually
              to personalize your
              AI responses.
            </p>


            <div className="resume-empty-actions">

              <button
                type="button"
                className="resume-upload-btn"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <FiUploadCloud />

                <span>
                  Upload Resume
                </span>
              </button>


              <button
                type="button"
                className="resume-manual-btn"
                onClick={
                  handleCreateManually
                }
              >
                <FiEdit3 />

                <span>
                  Create Manually
                </span>
              </button>

            </div>

          </div>
        )}


        {/* =====================================================
            CREATE MANUALLY POPUP
        ===================================================== */}

        {showManualModal && (

          <div
            className="resume-manual-modal-overlay"
            onClick={() =>
              setShowManualModal(false)
            }
          >

            <div
              className="resume-manual-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="resume-manual-modal-close"
                onClick={() =>
                  setShowManualModal(false)
                }
                aria-label="Close"
              >
                ×
              </button>


              <h2>
                Create Manually
              </h2>


              <p>
                Give your resume a title,
                then fill in the details.
              </p>


              <div className="resume-manual-title-field">

                <label
                  htmlFor="manual-resume-title"
                >
                  Title
                </label>


                <input
                  id="manual-resume-title"
                  type="text"
                  value={
                    manualResumeTitle
                  }
                  onChange={(e) =>
                    setManualResumeTitle(
                      e.target.value
                    )
                  }
                  placeholder="My Resume"
                  autoFocus
                  onKeyDown={(e) => {

                    if (
                      e.key ===
                      "Enter"
                    ) {
                      handleConfirmManualCreate();
                    }

                  }}
                />

              </div>


              <button
                type="button"
                className="resume-manual-modal-submit"
                onClick={
                  handleConfirmManualCreate
                }
              >
                Create Manually
              </button>

            </div>

          </div>
        )}

      </div>
    );
  }


  /* =========================================================
     EDITOR
  ========================================================= */

  return (

    <div className="resume-editor-page">

      {/* BACK */}

      <div className="resume-back-container">

        <button
          type="button"
          className="resume-back-btn"
          onClick={() =>
            setCurrentView("list")
          }
        >
          <FiArrowLeft />

          <span>
            Back to Resumes
          </span>
        </button>

      </div>


      {/* EDITOR TABS */}

      <div className="resume-editor-tabs">

        <button
          type="button"
          className={
            editorTab ===
              "edit"
              ? "active"
              : ""
          }
          onClick={() =>
            setEditorTab("edit")
          }
        >
          Edit
        </button>


        <button
          type="button"
          className={
            editorTab ===
              "pdf"
              ? "active"
              : ""
          }
          onClick={() =>
            setEditorTab("pdf")
          }
        >
          Original PDF
        </button>

      </div>


      <p className="resume-editor-note">
        The contents of the resume
        will be used to generate
        interview answers.
      </p>


      {/* =====================================================
          EDIT TAB
      ===================================================== */}

      {editorTab ===
        "edit" && (

          <div className="resume-edit-card">


            {/* =================================================
              TITLE
          ================================================= */}

            <div className="resume-section">

              <h2>
                <FiFileText />

                Title
              </h2>


              <input
                type="text"
                name="title"
                value={
                  resumeData.title
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Full Stack Developer Resume"
              />

            </div>


            {/* =================================================
              PERSONAL DETAILS
          ================================================= */}

            <div className="resume-section">

              <h2>
                <FiUser />

                Personal Details
              </h2>


              <div className="resume-grid">

                <div>

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      resumeData.name
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div>

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      resumeData.email
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div>

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      resumeData.phone
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div>

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={
                      resumeData.location
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="resume-full-width">

                  <label>
                    LinkedIn
                  </label>

                  <input
                    type="text"
                    name="linkedin"
                    value={
                      resumeData.linkedin
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://linkedin.com/in/..."
                  />

                </div>

              </div>

            </div>


            {/* =================================================
              INTRODUCTION
          ================================================= */}

            <div className="resume-section">

              <h2>
                <FiBookOpen />

                Introduction
              </h2>


              <textarea
                rows="6"
                name="summary"
                value={
                  resumeData.summary
                }
                onChange={
                  handleChange
                }
                placeholder="Write a short introduction about yourself..."
              />

            </div>


            {/* =================================================
              EDUCATION
          ================================================= */}

            <div className="resume-section">

              <div className="resume-repeatable-header">

                <h2>
                  <FiBookOpen />

                  Education
                </h2>


                <button
                  type="button"
                  className="resume-add-entry-btn"
                  onClick={
                    addEducation
                  }
                >
                  <FiPlus />

                  Add Education
                </button>

              </div>


              {educationEntries.length ===
                0 ? (

                <div className="resume-empty-entry">

                  <p>
                    Add your educational
                    background.
                  </p>


                  <button
                    type="button"
                    className="resume-add-entry-btn"
                    onClick={
                      addEducation
                    }
                  >
                    <FiPlus />

                    Add Education
                  </button>

                </div>

              ) : (

                <div className="resume-entry-list">

                  {educationEntries.map(
                    (
                      education,
                      index
                    ) => (

                      <div
                        className="resume-repeatable-card"
                        key={index}
                      >

                        <div className="resume-repeatable-card-header">

                          <strong>
                            Education{" "}
                            {index + 1}
                          </strong>


                          <button
                            type="button"
                            className="resume-remove-entry-btn"
                            onClick={() =>
                              removeEducation(
                                index
                              )
                            }
                            aria-label="Remove education"
                          >
                            <FiTrash2 />
                          </button>

                        </div>


                        <div className="resume-grid">

                          <div>

                            <label>
                              School /
                              University
                            </label>

                            <input
                              type="text"
                              value={
                                education.school
                              }
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "school",
                                  e.target.value
                                )
                              }
                              placeholder="University or school"
                            />

                          </div>


                          <div>

                            <label>
                              Degree
                            </label>

                            <input
                              type="text"
                              value={
                                education.degree
                              }
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                              placeholder="Bachelor's, Master's..."
                            />

                          </div>


                          <div>

                            <label>
                              Field of Study
                            </label>

                            <input
                              type="text"
                              value={
                                education.field
                              }
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "field",
                                  e.target.value
                                )
                              }
                              placeholder="Computer Science"
                            />

                          </div>


                          <div>

                            <label>
                              Location
                            </label>

                            <input
                              type="text"
                              value={
                                education.location
                              }
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                              placeholder="Chennai, India"
                            />

                          </div>


                          <div>

                            <label>
                              Start Date
                            </label>

                            <input
                              type="text"
                              value={
                                education.startDate
                              }
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              placeholder="Jun 2022"
                            />

                          </div>


                          <div>

                            <label>
                              End Date
                            </label>

                            <input
                              type="text"
                              value={
                                education.endDate
                              }
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              placeholder="May 2026"
                            />

                          </div>


                          <div className="resume-full-width">

                            <label>
                              Description
                            </label>

                            <textarea
                              rows="4"
                              value={
                                education.description
                              }
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Add relevant education details..."
                            />

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>
              )}

            </div>


            {/* =================================================
              JOB EXPERIENCE
          ================================================= */}

            <div className="resume-section">

              <div className="resume-repeatable-header">

                <h2>
                  <FiBriefcase />

                  Job Experience
                </h2>


                <button
                  type="button"
                  className="resume-add-entry-btn"
                  onClick={
                    addJob
                  }
                >
                  <FiPlus />

                  Add Job
                </button>

              </div>


              {jobEntries.length ===
                0 ? (

                <div className="resume-empty-entry">

                  <p>
                    Add your professional
                    work experience.
                  </p>


                  <button
                    type="button"
                    className="resume-add-entry-btn"
                    onClick={
                      addJob
                    }
                  >
                    <FiPlus />

                    Add Job
                  </button>

                </div>

              ) : (

                <div className="resume-entry-list">

                  {jobEntries.map(
                    (
                      job,
                      index
                    ) => (

                      <div
                        className="resume-repeatable-card"
                        key={index}
                      >

                        <div className="resume-repeatable-card-header">

                          <strong>
                            Job{" "}
                            {index + 1}
                          </strong>


                          <button
                            type="button"
                            className="resume-remove-entry-btn"
                            onClick={() =>
                              removeJob(
                                index
                              )
                            }
                            aria-label="Remove job"
                          >
                            <FiTrash2 />
                          </button>

                        </div>


                        <div className="resume-grid">

                          <div>

                            <label>
                              Job Title
                            </label>

                            <input
                              type="text"
                              value={
                                job.position
                              }
                              onChange={(e) =>
                                updateJob(
                                  index,
                                  "position",
                                  e.target.value
                                )
                              }
                              placeholder="Frontend Developer"
                            />

                          </div>


                          <div>

                            <label>
                              Company
                            </label>

                            <input
                              type="text"
                              value={
                                job.company
                              }
                              onChange={(e) =>
                                updateJob(
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                              placeholder="Company name"
                            />

                          </div>


                          <div>

                            <label>
                              Location
                            </label>

                            <input
                              type="text"
                              value={
                                job.location
                              }
                              onChange={(e) =>
                                updateJob(
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                              placeholder="Chennai, India"
                            />

                          </div>


                          <div>

                            <label>
                              Start Date
                            </label>

                            <input
                              type="text"
                              value={
                                job.startDate
                              }
                              onChange={(e) =>
                                updateJob(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              placeholder="Jun 2024"
                            />

                          </div>


                          <div>

                            <label>
                              End Date
                            </label>

                            <input
                              type="text"
                              value={
                                job.endDate
                              }
                              onChange={(e) =>
                                updateJob(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              placeholder="Present"
                            />

                          </div>


                          <div className="resume-full-width">

                            <label>
                              Description
                            </label>

                            <textarea
                              rows="6"
                              value={
                                job.description
                              }
                              onChange={(e) =>
                                updateJob(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe your responsibilities, achievements and impact..."
                            />

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>
              )}

            </div>


            {/* =================================================
              OTHER EXPERIENCE
          ================================================= */}

            <div className="resume-section">

              <div className="resume-repeatable-header">

                <h2>
                  🎉

                  <span>
                    Other Experience
                  </span>
                </h2>


                <button
                  type="button"
                  className="resume-add-entry-btn"
                  onClick={
                    addOther
                  }
                >
                  <FiPlus />

                  Add Other
                </button>

              </div>


              {otherEntries.length ===
                0 ? (

                <div className="resume-empty-entry">

                  <p>
                    Add projects, volunteer
                    work, internships,
                    achievements or other
                    relevant experience.
                  </p>


                  <button
                    type="button"
                    className="resume-add-entry-btn"
                    onClick={
                      addOther
                    }
                  >
                    <FiPlus />

                    Add Other
                  </button>

                </div>

              ) : (

                <div className="resume-entry-list">

                  {otherEntries.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className="resume-repeatable-card"
                        key={index}
                      >

                        <div className="resume-repeatable-card-header">

                          <strong>
                            Other Experience{" "}
                            {index + 1}
                          </strong>


                          <button
                            type="button"
                            className="resume-remove-entry-btn"
                            onClick={() =>
                              removeOther(
                                index
                              )
                            }
                            aria-label="Remove other experience"
                          >
                            <FiTrash2 />
                          </button>

                        </div>


                        <div className="resume-grid">

                          <div>

                            <label>
                              Title
                            </label>

                            <input
                              type="text"
                              value={
                                item.title
                              }
                              onChange={(e) =>
                                updateOther(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Project, Volunteer Work..."
                            />

                          </div>


                          <div>

                            <label>
                              Organization
                            </label>

                            <input
                              type="text"
                              value={
                                item.organization
                              }
                              onChange={(e) =>
                                updateOther(
                                  index,
                                  "organization",
                                  e.target.value
                                )
                              }
                              placeholder="Organization name"
                            />

                          </div>


                          <div>

                            <label>
                              Start Date
                            </label>

                            <input
                              type="text"
                              value={
                                item.startDate
                              }
                              onChange={(e) =>
                                updateOther(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              placeholder="Jan 2025"
                            />

                          </div>


                          <div>

                            <label>
                              End Date
                            </label>

                            <input
                              type="text"
                              value={
                                item.endDate
                              }
                              onChange={(e) =>
                                updateOther(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              placeholder="Present"
                            />

                          </div>


                          <div className="resume-full-width">

                            <label>
                              Description
                            </label>

                            <textarea
                              rows="6"
                              value={
                                item.description
                              }
                              onChange={(e) =>
                                updateOther(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe this experience..."
                            />

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>
              )}

            </div>


            {/* =================================================
              SAVE
          ================================================= */}

            <div className="resume-save-area">

              {saveMessage && (

                <span
                  style={{
                    fontSize:
                      "15px",

                    color:
                      saveMessage.startsWith(
                        "✓"
                      )
                        ? "#16a34a"
                        : "#ef4444",

                    marginRight:
                      "16px",

                    fontWeight:
                      600,
                  }}
                >
                  {saveMessage}
                </span>

              )}


              <button
                type="button"
                className="resume-save-btn"
                onClick={
                  handleSave
                }
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Resume"}
              </button>

            </div>

          </div>
        )}


      {/* =====================================================
          PDF TAB
      ===================================================== */}

      {editorTab ===
        "pdf" && (

          <div className="resume-pdf-view">

            {selectedFile ? (

              <iframe
                title="Resume Preview"
                src={URL.createObjectURL(
                  selectedFile
                )}
                className="resume-pdf-frame"
              />

            ) : (

              <div className="resume-no-pdf">

                <FiFileText
                  size={70}
                />

                <h2>
                  No Resume PDF Uploaded
                </h2>

                <p>
                  Upload a PDF document
                  to view it here.
                </p>

              </div>

            )}

          </div>

        )}

    </div>
  );
};


export default YourAIResume;