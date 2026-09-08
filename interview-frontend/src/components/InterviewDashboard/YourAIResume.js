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
  FiDownload,
  FiEdit2,
  FiChevronDown,
} from "react-icons/fi";

import {
  createResume,
  updateResume,
  uploadResumeFile,
  getUserResumes,
} from "../../services/interviewApi";

const API_URL = "http://localhost:8000";

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

const EMPTY_EDUCATION = {
  school: "",
  degree: "",
  field: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};

const EMPTY_JOB = {
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};

const EMPTY_OTHER = {
  title: "",
  organization: "",
  startDate: "",
  endDate: "",
  description: "",
};

const YourAIResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameItem, setRenameItem] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const [currentView, setCurrentView] = useState("list");
  const [editorTab, setEditorTab] = useState("edit");
  const [hasPdf, setHasPdf] = useState(false);

  const [resumeData, setResumeData] = useState(EMPTY_RESUME);
  const [resumeId, setResumeId] = useState(null);

  const [educationEntries, setEducationEntries] = useState([]);
  const [jobEntries, setJobEntries] = useState([]);
  const [otherEntries, setOtherEntries] = useState([]);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualResumeTitle, setManualResumeTitle] = useState("My Resume");

  const fileInputRef = useRef(null);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  };

  const loadResumes = useCallback(async () => {
    setLoading(true);
    const user = getUser();
    if (user?.id) {
      try {
        const data = await getUserResumes(user.id);
        setResumes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading resumes:", err);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
      setShowSortDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSaveMessage("");
    const user = getUser();

    try {
      if (user) {
        const result = await uploadResumeFile(user.id, file);
        setResumeId(result.resume_id || result.id);

        // Auto-populate form data (Title, Summary, Email, Phone) from parsed PDF result
        setResumeData((prev) => ({
          ...prev,
          title: result.filename?.replace(/\.[^/.]+$/, "") || file.name.replace(/\.[^/.]+$/, ""),
          summary: result.summary || prev.summary,
          email: result.email || prev.email,
          phone: result.phone || prev.phone,
        }));
      } else {
        setResumeData((prev) => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, ""),
        }));
      }

      await loadResumes();
      setHasPdf(true);
      setCurrentView("edit");
      setEditorTab("edit");
      setSaveMessage("✓ Resume uploaded & details extracted! Verify and save.");
    } catch (err) {
      setSaveMessage("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateManually = () => {
    setManualResumeTitle("My Resume");
    setShowManualModal(true);
  };

  const handleConfirmManualCreate = () => {
    const title = manualResumeTitle.trim() || "My Resume";
    setResumeData({ ...EMPTY_RESUME, title });
    setEducationEntries([]);
    setJobEntries([]);
    setOtherEntries([]);
    setResumeId(null);
    setSaveMessage("");
    setHasPdf(false);
    setShowManualModal(false);
    setCurrentView("edit");
    setEditorTab("edit");
  };

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
      certifications: res.certifications || "",
      other_experience: res.other_experience || "",
    });

    setEducationEntries(Array.isArray(res.education_entries) ? res.education_entries : []);
    setJobEntries(Array.isArray(res.job_entries) ? res.job_entries : []);
    setOtherEntries(Array.isArray(res.other_entries) ? res.other_entries : []);

    setResumeId(res.id);

    const isFileUploaded = Boolean(res.file_path || res.file_name || res.file_url || res.type === "uploaded");
    setHasPdf(isFileUploaded);

    setCurrentView("edit");
    setEditorTab(isFileUploaded ? "pdf" : "edit");
  };

  const handleDeleteResume = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/resumes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete resume");
      await loadResumes();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleRenameSubmit = async () => {
    if (!newTitle.trim()) return;
    try {
      const response = await fetch(`${API_URL}/api/resumes/${renameItem.id}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!response.ok) throw new Error("Failed to rename resume");
      await loadResumes();
      setRenameModalOpen(false);
      setRenameItem(null);
    } catch (err) {
      alert("Rename failed: " + err.message);
    }
  };

  const handleDownloadResume = (res) => {
    if (res.file_path || res.type === "uploaded") {
      window.open(`${API_URL}/api/resumes/${res.id}/download?download=true`, "_blank");
    } else {
      const content = `Title: ${res.title}\nName: ${res.name || ""}\nEmail: ${res.email || ""}\nPhone: ${res.phone || ""}\nLocation: ${res.location || ""}\n\nSummary:\n${res.summary || ""}\n\nExperience:\n${res.experience || ""}\n\nEducation:\n${res.education || ""}`;
      const element = document.createElement("a");
      const file = new Blob([content], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${res.title || "Resume"}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleChange = (e) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const addEducation = () => setEducationEntries((prev) => [...prev, { ...EMPTY_EDUCATION }]);
  const updateEducation = (index, field, value) => {
    setEducationEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const removeEducation = (index) => setEducationEntries((prev) => prev.filter((_, i) => i !== index));

  const addJob = () => setJobEntries((prev) => [...prev, { ...EMPTY_JOB }]);
  const updateJob = (index, field, value) => {
    setJobEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const removeJob = (index) => setJobEntries((prev) => prev.filter((_, i) => i !== index));

  const addOther = () => setOtherEntries((prev) => [...prev, { ...EMPTY_OTHER }]);
  const updateOther = (index, field, value) => {
    setOtherEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const removeOther = (index) => setOtherEntries((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    const user = getUser();

    if (!user) {
      setSaveMessage("You must be logged in to save a resume.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...resumeData,
        user_id: user.id,
        education_entries: educationEntries,
        job_entries: jobEntries,
        other_entries: otherEntries,
      };

      let saved;
      if (resumeId) {
        saved = await updateResume(resumeId, payload);
      } else {
        saved = await createResume(payload);
        setResumeId(saved.id);
      }

      setSaveMessage("✓ Resume saved successfully!");
      await loadResumes();
    } catch (err) {
      setSaveMessage("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "RECENT";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "RECENT";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).toUpperCase();
  };

  const filteredResumes = resumes.filter((item) => {
    const matchesSearch =
      (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "uploaded") {
      return matchesSearch && (item.file_url || item.file_path || item.type === "uploaded");
    }
    if (activeTab === "manual") {
      return matchesSearch && !item.file_url && !item.file_path && item.type !== "uploaded";
    }
    return matchesSearch;
  });

  const sortedResumes = [...filteredResumes].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    } else if (sortOption === "oldest") {
      return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    } else if (sortOption === "az") {
      return (a.title || "").localeCompare(b.title || "");
    } else if (sortOption === "za") {
      return (b.title || "").localeCompare(a.title || "");
    }
    return 0;
  });

  if (currentView === "list") {
    return (
      <div className="yourai-resume-page">
        <div className="resume-header">
          <div>
            <h2>CVs &amp; Resumes</h2>
            <p>Create or upload resumes to personalize AI answers.</p>
          </div>

          <div className="resume-header-actions">
            <button
              type="button"
              className="resume-create-manual-btn"
              onClick={handleCreateManually}
            >
              <FiPlus />
              <span>Create Manually</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleUpload}
            />

            <button
              type="button"
              className="resume-upload-header-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <FiUploadCloud />
              <span>{uploading ? "Uploading..." : "Upload Resume"}</span>
            </button>
          </div>
        </div>

        <div className="resume-tabs-row">
          <div className="resume-tabs-left">
            <button
              type="button"
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              type="button"
              className={activeTab === "uploaded" ? "active" : ""}
              onClick={() => setActiveTab("uploaded")}
            >
              Uploaded
            </button>
            <button
              type="button"
              className={activeTab === "manual" ? "active" : ""}
              onClick={() => setActiveTab("manual")}
            >
              Created Manually
            </button>
          </div>
          <span className="resume-count-tag">{sortedResumes.length} Resumes</span>
        </div>

        <div className="resume-toolbar-row">
          <div className="resume-search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search CVs or resumes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="doc-sort-wrapper">
            <button
              type="button"
              className="resume-sort-btn"
              title="Sort"
              onClick={(e) => {
                e.stopPropagation();
                setShowSortDropdown(!showSortDropdown);
                setActiveMenuId(null);
              }}
            >
              <span>⇅</span> <FiChevronDown size={12} />
            </button>

            {showSortDropdown && (
              <div className="doc-sort-dropdown" onClick={(e) => e.stopPropagation()}>
                <button
                  className={`doc-sort-item ${sortOption === "newest" ? "active" : ""}`}
                  onClick={() => { setSortOption("newest"); setShowSortDropdown(false); }}
                >
                  Newest First
                </button>
                <button
                  className={`doc-sort-item ${sortOption === "oldest" ? "active" : ""}`}
                  onClick={() => { setSortOption("oldest"); setShowSortDropdown(false); }}
                >
                  Oldest First
                </button>
                <button
                  className={`doc-sort-item ${sortOption === "az" ? "active" : ""}`}
                  onClick={() => { setSortOption("az"); setShowSortDropdown(false); }}
                >
                  A to Z
                </button>
                <button
                  className={`doc-sort-item ${sortOption === "za" ? "active" : ""}`}
                  onClick={() => { setSortOption("za"); setShowSortDropdown(false); }}
                >
                  Z to A
                </button>
              </div>
            )}
          </div>

          <div className="resume-view-switcher">
            <button
              type="button"
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              <FiGrid />
            </button>
            <button
              type="button"
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
            >
              <FiList />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="resume-upload-empty"><p>Loading resumes...</p></div>
        ) : sortedResumes.length > 0 ? (
          <div className={`resume-cards-container ${viewMode === "list" ? "list-mode" : "grid-mode"}`}>
            {sortedResumes.map((res) => {
              const isUploaded = Boolean(res.file_url || res.file_path || res.type === "uploaded");

              return (
                <div
                  key={res.id}
                  className="resume-item-card"
                  onClick={() => handleEditResume(res)}
                >
                  <div className="resume-item-top">
                    <div className="resume-item-date">{formatDate(res.created_at)}</div>

                    <div className="doc-menu-wrapper" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="resume-item-menu"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === res.id ? null : res.id);
                          setShowSortDropdown(false);
                        }}
                      >
                        <FiMoreVertical />
                      </button>

                      {activeMenuId === res.id && (
                        <div
                          className="doc-dropdown-menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="doc-dropdown-item"
                            onClick={() => {
                              setActiveMenuId(null);
                              handleDownloadResume(res);
                            }}
                          >
                            <FiDownload size={14} /> Download
                          </button>

                          <button
                            className="doc-dropdown-item"
                            onClick={() => {
                              setActiveMenuId(null);
                              setRenameItem(res);
                              setNewTitle(res.title || "My Resume");
                              setRenameModalOpen(true);
                            }}
                          >
                            <FiEdit2 size={14} /> Rename
                          </button>

                          <button
                            className="doc-dropdown-item text-danger"
                            onClick={() => {
                              setActiveMenuId(null);
                              handleDeleteResume(res.id);
                            }}
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h5 className="resume-item-title">{res.title || "My Resume"}</h5>

                  <div className="resume-item-badge-wrap">
                    <span className="resume-item-badge">
                      {isUploaded ? <><FiUpload size={13} /> Uploaded</> : <><FiEdit3 size={13} /> Created Manually</>}
                    </span>
                  </div>

                  <div className="resume-item-footer">
                    <span>{isUploaded ? "PDF · Document" : "Text"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="resume-upload-empty">
            <h2>No resumes found</h2>
            <p>Upload a resume or create one manually to personalize your AI responses.</p>
            <div className="resume-empty-actions">
              <button
                type="button"
                className="resume-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUploadCloud />
                <span>Upload Resume</span>
              </button>
              <button
                type="button"
                className="resume-manual-btn"
                onClick={handleCreateManually}
              >
                <FiEdit3 />
                <span>Create Manually</span>
              </button>
            </div>
          </div>
        )}

        {showManualModal && (
          <div className="resume-manual-modal-overlay" onClick={() => setShowManualModal(false)}>
            <div className="resume-manual-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="resume-manual-modal-close"
                onClick={() => setShowManualModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h2>Create Manually</h2>
              <p>Give your resume a title, then fill in the details.</p>
              <div className="resume-manual-title-field">
                <label htmlFor="manual-resume-title">Title</label>
                <input
                  id="manual-resume-title"
                  type="text"
                  value={manualResumeTitle}
                  onChange={(e) => setManualResumeTitle(e.target.value)}
                  placeholder="My Resume"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleConfirmManualCreate()}
                />
              </div>
              <button
                type="button"
                className="resume-manual-modal-submit"
                onClick={handleConfirmManualCreate}
              >
                Create Manually
              </button>
            </div>
          </div>
        )}

        {renameModalOpen && (
          <div className="resume-manual-modal-overlay" onClick={() => setRenameModalOpen(false)}>
            <div className="resume-manual-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="resume-manual-modal-close"
                onClick={() => setRenameModalOpen(false)}
              >
                ×
              </button>
              <h2>Rename Resume</h2>
              <div className="resume-manual-title-field" style={{ marginTop: "20px" }}>
                <label>Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="resume-back-btn"
                  onClick={() => setRenameModalOpen(false)}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="resume-manual-modal-submit"
                  onClick={handleRenameSubmit}
                  style={{ flex: 1, marginTop: 0 }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="resume-editor-page">
      <div className="resume-back-container">
        <button
          type="button"
          className="resume-back-btn"
          onClick={() => setCurrentView("list")}
        >
          <FiArrowLeft />
          <span>Back to Resumes</span>
        </button>
      </div>

      <div className="resume-editor-tabs">
        <button
          type="button"
          className={editorTab === "edit" ? "active" : ""}
          onClick={() => setEditorTab("edit")}
        >
          Edit
        </button>

        {hasPdf && (
          <button
            type="button"
            className={editorTab === "pdf" ? "active" : ""}
            onClick={() => setEditorTab("pdf")}
          >
            Original PDF
          </button>
        )}
      </div>

      <p className="resume-editor-note">
        The contents of the resume will be used to generate interview answers.
      </p>

      {editorTab === "edit" && (
        <div className="resume-edit-card">
          <div className="resume-section">
            <h2><FiFileText /> Title</h2>
            <input
              type="text"
              name="title"
              value={resumeData.title}
              onChange={handleChange}
              placeholder="e.g. Full Stack Developer Resume"
            />
          </div>

          <div className="resume-section">
            <h2><FiUser /> Personal Details</h2>
            <div className="resume-grid">
              <div>
                <label>Full Name</label>
                <input type="text" name="name" value={resumeData.name} onChange={handleChange} />
              </div>
              <div>
                <label>Email</label>
                <input type="email" name="email" value={resumeData.email} onChange={handleChange} />
              </div>
              <div>
                <label>Phone</label>
                <input type="text" name="phone" value={resumeData.phone} onChange={handleChange} />
              </div>
              <div>
                <label>Location</label>
                <input type="text" name="location" value={resumeData.location} onChange={handleChange} />
              </div>
              <div className="resume-full-width">
                <label>LinkedIn</label>
                <input type="text" name="linkedin" value={resumeData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>
          </div>

          <div className="resume-section">
            <h2><FiBookOpen /> Introduction</h2>
            <textarea
              rows="6"
              name="summary"
              value={resumeData.summary}
              onChange={handleChange}
              placeholder="Write a short introduction about yourself..."
            />
          </div>

          <div className="resume-section">
            <div className="resume-repeatable-header">
              <h2><FiBookOpen /> Education</h2>
              <button type="button" className="resume-add-entry-btn" onClick={addEducation}>
                <FiPlus /> Add Education
              </button>
            </div>
            {educationEntries.map((education, index) => (
              <div className="resume-repeatable-card" key={index}>
                <div className="resume-repeatable-card-header">
                  <strong>Education {index + 1}</strong>
                  <button type="button" className="resume-remove-entry-btn" onClick={() => removeEducation(index)}>
                    Remove
                  </button>
                </div>
                <div className="resume-grid">
                  <div>
                    <label>School / University</label>
                    <input type="text" value={education.school} onChange={(e) => updateEducation(index, "school", e.target.value)} placeholder="University or school" />
                  </div>
                  <div>
                    <label>Degree</label>
                    <input type="text" value={education.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} placeholder="Bachelor's, Master's..." />
                  </div>
                  <div>
                    <label>Field of Study</label>
                    <input type="text" value={education.field} onChange={(e) => updateEducation(index, "field", e.target.value)} placeholder="Computer Science" />
                  </div>
                  <div>
                    <label>Location</label>
                    <input type="text" value={education.location} onChange={(e) => updateEducation(index, "location", e.target.value)} placeholder="Chennai, India" />
                  </div>
                  <div>
                    <label>Start Date</label>
                    <input type="text" value={education.startDate} onChange={(e) => updateEducation(index, "startDate", e.target.value)} placeholder="Jun 2022" />
                  </div>
                  <div>
                    <label>End Date</label>
                    <input type="text" value={education.endDate} onChange={(e) => updateEducation(index, "endDate", e.target.value)} placeholder="May 2026" />
                  </div>
                  <div className="resume-full-width">
                    <label>Description</label>
                    <textarea rows="4" value={education.description} onChange={(e) => updateEducation(index, "description", e.target.value)} placeholder="Add relevant education details..." />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="resume-section">
            <div className="resume-repeatable-header">
              <h2><FiBriefcase /> Job Experience</h2>
              <button type="button" className="resume-add-entry-btn" onClick={addJob}>
                <FiPlus /> Add Job
              </button>
            </div>
            {jobEntries.map((job, index) => (
              <div className="resume-repeatable-card" key={index}>
                <div className="resume-repeatable-card-header">
                  <strong>Job {index + 1}</strong>
                  <button type="button" className="resume-remove-entry-btn" onClick={() => removeJob(index)}>
                    Remove
                  </button>
                </div>
                <div className="resume-grid">
                  <div>
                    <label>Job Title</label>
                    <input type="text" value={job.position} onChange={(e) => updateJob(index, "position", e.target.value)} placeholder="Frontend Developer" />
                  </div>
                  <div>
                    <label>Company</label>
                    <input type="text" value={job.company} onChange={(e) => updateJob(index, "company", e.target.value)} placeholder="Company name" />
                  </div>
                  <div>
                    <label>Location</label>
                    <input type="text" value={job.location} onChange={(e) => updateJob(index, "location", e.target.value)} placeholder="Chennai, India" />
                  </div>
                  <div>
                    <label>Start Date</label>
                    <input type="text" value={job.startDate} onChange={(e) => updateJob(index, "startDate", e.target.value)} placeholder="Jun 2024" />
                  </div>
                  <div>
                    <label>End Date</label>
                    <input type="text" value={job.endDate} onChange={(e) => updateJob(index, "endDate", e.target.value)} placeholder="Present" />
                  </div>
                  <div className="resume-full-width">
                    <label>Description</label>
                    <textarea rows="6" value={job.description} onChange={(e) => updateJob(index, "description", e.target.value)} placeholder="Describe your responsibilities..." />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="resume-section">
            <div className="resume-repeatable-header">
              <h2>🎉 <span>Other Experience</span></h2>
              <button type="button" className="resume-add-entry-btn" onClick={addOther}>
                <FiPlus /> Add Other
              </button>
            </div>
            {otherEntries.map((item, index) => (
              <div className="resume-repeatable-card" key={index}>
                <div className="resume-repeatable-card-header">
                  <strong>Other Experience {index + 1}</strong>
                  <button type="button" className="resume-remove-entry-btn" onClick={() => removeOther(index)}>
                    Remove
                  </button>
                </div>
                <div className="resume-grid">
                  <div>
                    <label>Title</label>
                    <input type="text" value={item.title} onChange={(e) => updateOther(index, "title", e.target.value)} placeholder="Project, Volunteer Work..." />
                  </div>
                  <div>
                    <label>Organization</label>
                    <input type="text" value={item.organization} onChange={(e) => updateOther(index, "organization", e.target.value)} placeholder="Organization name" />
                  </div>
                  <div>
                    <label>Start Date</label>
                    <input type="text" value={item.startDate} onChange={(e) => updateOther(index, "startDate", e.target.value)} placeholder="Jan 2025" />
                  </div>
                  <div>
                    <label>End Date</label>
                    <input type="text" value={item.endDate} onChange={(e) => updateOther(index, "endDate", e.target.value)} placeholder="Present" />
                  </div>
                  <div className="resume-full-width">
                    <label>Description</label>
                    <textarea rows="6" value={item.description} onChange={(e) => updateOther(index, "description", e.target.value)} placeholder="Describe this experience..." />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="resume-save-area">
            {saveMessage && (
              <span
                style={{
                  fontSize: "15px",
                  color: saveMessage.startsWith("✓") ? "#16a34a" : "#ef4444",
                  marginRight: "16px",
                  fontWeight: 600,
                }}
              >
                {saveMessage}
              </span>
            )}
            <button
              type="button"
              className="resume-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Resume"}
            </button>
          </div>
        </div>
      )}

      {editorTab === "pdf" && hasPdf && (
        <div className="resume-pdf-view">
          <iframe
            title="Resume PDF Preview"
            src={`${API_URL}/api/resumes/${resumeId}/download`}
            className="resume-pdf-frame"
            style={{
              width: "100%",
              height: "80vh",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default YourAIResume;