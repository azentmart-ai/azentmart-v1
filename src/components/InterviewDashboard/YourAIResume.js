import React, { useState } from "react";
import {
  FiUpload,
  FiEdit3,
  FiFileText,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiCode
} from "react-icons/fi";

const YourAIResume = () => {

  const [resumeUploaded, setResumeUploaded] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [activeTab, setActiveTab] = useState("edit");

  const [resumeData, setResumeData] = useState({

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

    certifications: ""

  });

  const handleUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    // Fake parsed data
    // Replace later with AI Resume Parser API

    setResumeData({

      title: file.name.replace(/\.[^/.]+$/, ""),

      name: "Nischita V",

      email: "nischitav702@gmail.com",

      phone: "+91 9008401064",

      linkedin: "https://linkedin.com/in/nischita",

      location: "Bangalore",

      summary:
        "Software Engineer passionate about AI, React and Python.",

      skills:
        "React, JavaScript, Python, SQL, Laravel, PHP, Azure, Git",

      experience:
        "Software Engineer\nCompany XYZ\n2 Years Experience",

      education:
        "B.E Computer Science\nXYZ Engineering College",

      certifications:
        "Azure Data Engineer\nPython Bootcamp"

    });

    setResumeUploaded(true);

  };

  const handleChange = (e) => {

    setResumeData({

      ...resumeData,

      [e.target.name]: e.target.value

    });

  };
    if (!resumeUploaded) {

    return (

      <div className="yourai-resume-page">

        <div className="resume-header">

          <div>

            <h2>CVs & Resumes</h2>

            <p>
              Create or upload resumes to personalize AI answers.
            </p>

          </div>

        </div>

        <div className="resume-upload-empty">

          <input
            type="file"
            id="resumeUpload"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={handleUpload}
          />

          <label
            htmlFor="resumeUpload"
            className="resume-upload-btn"
          >

            <FiUpload />

            Upload Resume

          </label>

          <span className="resume-or">
            OR
          </span>

          <button className="resume-manual-btn">

            <FiEdit3 />

            Create Manually

          </button>

        </div>

      </div>

    );

  }

  return (

    <div className="resume-editor-page">

      {/* Tabs */}

      <div className="resume-editor-tabs">

        <button
          className={
            activeTab === "edit"
              ? "active"
              : ""
          }
          onClick={() => setActiveTab("edit")}
        >

          Edit

        </button>

        <button
          className={
            activeTab === "pdf"
              ? "active"
              : ""
          }
          onClick={() => setActiveTab("pdf")}
        >

          Original PDF

        </button>

      </div>

      <p className="resume-editor-note">

        The contents of the resume will be used to generate interview answers.

      </p>

      {activeTab === "edit" && (

        <div className="resume-edit-card">
            {/* Resume Title */}

<div className="resume-section">

  <h2>

    <FiFileText />

    Title

  </h2>

  <input
    type="text"
    name="title"
    value={resumeData.title}
    onChange={handleChange}
  />

</div>

{/* Personal Details */}

<div className="resume-section">

  <h2>

    <FiUser />

    Personal Details

  </h2>

  <div className="resume-grid">

    <div>

      <label>Name</label>

      <input
        type="text"
        name="name"
        value={resumeData.name}
        onChange={handleChange}
      />

    </div>

    <div>

      <label>Location</label>

      <input
        type="text"
        name="location"
        value={resumeData.location}
        onChange={handleChange}
      />

    </div>

    <div>

      <label>Email</label>

      <input
        type="email"
        name="email"
        value={resumeData.email}
        onChange={handleChange}
      />

    </div>

    <div>

      <label>Phone</label>

      <input
        type="text"
        name="phone"
        value={resumeData.phone}
        onChange={handleChange}
      />

    </div>

    <div className="resume-full-width">

      <label>LinkedIn URL</label>

      <input
        type="text"
        name="linkedin"
        value={resumeData.linkedin}
        onChange={handleChange}
      />

    </div>

  </div>

</div>

{/* Professional Summary */}

<div className="resume-section">

  <h2>

    <FiBookOpen />

    Professional Summary

  </h2>

  <textarea
    rows="5"
    name="summary"
    value={resumeData.summary}
    onChange={handleChange}
  />

</div>

{/* Skills */}

<div className="resume-section">

  <h2>

    <FiCode />

    Skills

  </h2>

  <textarea
    rows="5"
    name="skills"
    value={resumeData.skills}
    onChange={handleChange}
  />

</div>
{/* Experience */}

<div className="resume-section">

  <h2>

    <FiBriefcase />

    Experience

  </h2>

  <textarea
    rows="7"
    name="experience"
    value={resumeData.experience}
    onChange={handleChange}
  />

</div>

{/* Education */}

<div className="resume-section">

  <h2>

    <FiBookOpen />

    Education

  </h2>

  <textarea
    rows="6"
    name="education"
    value={resumeData.education}
    onChange={handleChange}
  />

</div>

{/* Certifications */}

<div className="resume-section">

  <h2>

    <FiAward />

    Certifications

  </h2>

  <textarea
    rows="5"
    name="certifications"
    value={resumeData.certifications}
    onChange={handleChange}
  />

</div>

{/* Save Button */}

<div className="resume-save-area">

  <button
    className="resume-save-btn"
    onClick={() => alert("Resume Saved Successfully!")}
  >

    Save Resume

  </button>

</div>

</div>

)}

{/* ================= PDF VIEW ================= */}

{

activeTab === "pdf" && (

<div className="resume-pdf-view">

  {

  selectedFile ? (

    <iframe

      title="Resume Preview"

      src={URL.createObjectURL(selectedFile)}

      className="resume-pdf-frame"

    />

  ) : (

    <div className="resume-no-pdf">

      <FiFileText size={70} />

      <h2>No Resume Uploaded</h2>

    </div>

  )

  }

</div>

)

}

</div>

);

};

export default YourAIResume;