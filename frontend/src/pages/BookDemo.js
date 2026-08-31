import React, { useState } from "react";
import "./BookDemo.css";

function BookDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    phone: "",
    requirement: "",
    date: "",
    time: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // BACKEND URL
  // =========================================================

  const API_URL = "http://127.0.0.1:8000";

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.requirement ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // -----------------------------------------------------
      // DATA SENT TO FASTAPI
      // -----------------------------------------------------

      const payload = {
        full_name: formData.name.trim(),
        business_email: formData.email.trim(),
        designation: formData.designation.trim() || null,
        phone_number: formData.phone.trim() || null,
        demo_focus: formData.requirement,
        preferred_date: formData.date,
        preferred_time: formData.time,
      };

      console.log("Sending demo request:", payload);

      // -----------------------------------------------------
      // SAVE TO DATABASE THROUGH FASTAPI
      // -----------------------------------------------------

      const response = await fetch(
        `${API_URL}/api/demo-requests/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // -----------------------------------------------------
      // READ RESPONSE
      // -----------------------------------------------------

      const responseData = await response.json();

      console.log(
        "Demo request response:",
        responseData
      );

      // -----------------------------------------------------
      // HANDLE BACKEND ERROR
      // -----------------------------------------------------

      if (!response.ok) {
        const errorMessage =
          responseData?.detail ||
          "Failed to submit demo request.";

        throw new Error(errorMessage);
      }

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      console.log(
        "Demo request saved successfully:",
        responseData
      );

      setSubmitted(true);

    } catch (error) {
      console.error(
        "Demo request submission error:",
        error
      );

      alert(
        error.message ||
          "Unable to submit demo request. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setSubmitted(false);

    setFormData({
      name: "",
      email: "",
      designation: "",
      phone: "",
      requirement: "",
      date: "",
      time: "",
    });
  };

  return (
    <div className="demo-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="demo-header">

        <div className="demo-header-left">

          <div className="demo-header-icon">
            ◉
          </div>

          <div>

            <span className="demo-eyebrow">
              AZENTMART AI
            </span>

            <h1>
              Book a Demo
            </h1>

            <p>
              See how AzentMart AI can automate your business
              conversations.
            </p>

          </div>

        </div>

        <div className="demo-live-status">

          <span className="live-dot"></span>

          <span>
            AI Voice Platform
          </span>

          <strong>
            Online
          </strong>

        </div>

      </div>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="demo-layout">

        {/* =================================================
            LEFT INFORMATION PANEL
        ================================================= */}

        <section className="demo-intro">

          <div className="intro-badge">

            <span>
              ✦
            </span>

            PERSONALIZED DEMO

          </div>


          <h2>

            Let's build your

            <span>
              {" "}AI calling workflow.
            </span>

          </h2>


          <p className="intro-description">

            Get a personalized walkthrough of AzentMart AI's
            voice platform and discover how intelligent voice
            agents can automate your business communication.

          </p>


          {/* FEATURES */}

          <div className="demo-features">

            <div className="demo-feature">

              <div className="feature-icon">
                ☎
              </div>

              <div>

                <h3>
                  AI Voice Agents
                </h3>

                <p>
                  Make and receive intelligent voice calls
                  automatically.
                </p>

              </div>

            </div>


            <div className="demo-feature">

              <div className="feature-icon">
                ◎
              </div>

              <div>

                <h3>
                  Multilingual Conversations
                </h3>

                <p>
                  Communicate with customers in multiple
                  regional languages.
                </p>

              </div>

            </div>


            <div className="demo-feature">

              <div className="feature-icon">
                ◇
              </div>

              <div>

                <h3>
                  AI Campaigns
                </h3>

                <p>
                  Automate outbound campaigns and customer
                  follow-ups with AI.
                </p>

              </div>

            </div>


            <div className="demo-feature">

              <div className="feature-icon">
                ◷
              </div>

              <div>

                <h3>
                  Call Analytics
                </h3>

                <p>
                  Track calls, conversations, outcomes and
                  performance.
                </p>

              </div>

            </div>


            <div className="demo-feature">

              <div className="feature-icon">
                ▣
              </div>

              <div>

                <h3>
                  Knowledge Base
                </h3>

                <p>
                  Give your AI agents accurate information
                  for better conversations.
                </p>

              </div>

            </div>

          </div>


          {/* DEMO INFO */}

          <div className="demo-info-card">

            <div className="demo-info-icon">
              ⏱
            </div>

            <div>

              <strong>
                30-minute session
              </strong>

              <span>
                Personalized walkthrough of the AzentMart
                AI platform.
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            FORM PANEL
        ================================================= */}

        <section className="demo-form-card">

          {!submitted ? (

            <>

              <div className="form-top">

                <div>

                  <span className="form-step">
                    DEMO REQUEST
                  </span>

                  <h2>
                    Schedule your session
                  </h2>

                  <p>
                    Tell us about your requirements and choose
                    a convenient time for your demo.
                  </p>

                </div>

                <div className="form-number">
                  01
                </div>

              </div>


              <form onSubmit={handleSubmit}>

                {/* =================================================
                    NAME + EMAIL
                ================================================= */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Full Name
                      <span>*</span>
                    </label>

                    <div className="input-wrapper">

                      <span>
                        ◉
                      </span>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        disabled={loading}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Work Email
                      <span>*</span>
                    </label>

                    <div className="input-wrapper">

                      <span>
                        ✉
                      </span>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        disabled={loading}
                      />

                    </div>

                  </div>

                </div>


                {/* =================================================
                    DESIGNATION + PHONE
                ================================================= */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Designation
                    </label>

                    <div className="input-wrapper">

                      <span>
                        ♙
                      </span>

                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="e.g. Student, Developer, Manager"
                        disabled={loading}
                      />

                    </div>

                  </div>


                  <div className="form-group">

                    <label>
                      Phone Number
                    </label>

                    <div className="input-wrapper">

                      <span>
                        ☎
                      </span>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        disabled={loading}
                      />

                    </div>

                  </div>

                </div>


                {/* =================================================
                    REQUIREMENT
                ================================================= */}

                <div className="form-group full-width">

                  <label>
                    What do you want to automate?
                    <span>*</span>
                  </label>

                  <select
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleChange}
                    disabled={loading}
                  >

                    <option value="">
                      Select your requirement
                    </option>

                    <option value="ai-voice-agents">
                      AI Voice Agents
                    </option>

                    <option value="inbound-calling">
                      Inbound Calling
                    </option>

                    <option value="outbound-calling">
                      Outbound Calling
                    </option>

                    <option value="customer-support">
                      Customer Support
                    </option>

                    <option value="lead-generation">
                      Lead Generation
                    </option>

                    <option value="campaign-automation">
                      Campaign Automation
                    </option>

                    <option value="appointment-booking">
                      Appointment Booking
                    </option>

                    <option value="multilingual-calling">
                      Multilingual Calling
                    </option>

                    <option value="call-analytics">
                      Call Analytics
                    </option>

                    <option value="knowledge-base">
                      Knowledge Base
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>


                {/* =================================================
                    DATE + TIME
                ================================================= */}

                <div className="schedule-section">

                  <div className="schedule-title">

                    <div>

                      <span className="schedule-icon">
                        ◷
                      </span>

                      <div>

                        <strong>
                          Choose your preferred time
                        </strong>

                        <p>
                          Select a convenient date and time.
                        </p>

                      </div>

                    </div>

                  </div>


                  <div className="form-row">

                    {/* DATE */}

                    <div className="form-group">

                      <label>
                        Preferred Date
                        <span>*</span>
                      </label>

                      <div className="input-wrapper">

                        <span>
                          ▣
                        </span>

                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          disabled={loading}
                        />

                      </div>

                    </div>


                    {/* TIME */}

                    <div className="form-group">

                      <label>
                        Preferred Time
                        <span>*</span>
                      </label>

                      <div className="input-wrapper">

                        <span>
                          ◷
                        </span>

                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          disabled={loading}
                        >

                          <option value="">
                            Select time
                          </option>

                          <option value="09:00:00">
                            09:00 AM
                          </option>

                          <option value="10:00:00">
                            10:00 AM
                          </option>

                          <option value="11:00:00">
                            11:00 AM
                          </option>

                          <option value="12:00:00">
                            12:00 PM
                          </option>

                          <option value="14:00:00">
                            02:00 PM
                          </option>

                          <option value="15:00:00">
                            03:00 PM
                          </option>

                          <option value="16:00:00">
                            04:00 PM
                          </option>

                          <option value="17:00:00">
                            05:00 PM
                          </option>

                        </select>

                      </div>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    SUBMIT
                ================================================= */}

                <div className="form-footer">

                  <div className="secure-note">

                    <span>
                      ✓
                    </span>

                    <span>
                      No commitment required
                    </span>

                  </div>


                  <button
                    type="submit"
                    className="schedule-button"
                    disabled={loading}
                  >

                    {loading
                      ? "Saving..."
                      : "Schedule Demo"
                    }

                    <span>
                      {loading ? "..." : "→"}
                    </span>

                  </button>

                </div>

              </form>

            </>

          ) : (

            /* =================================================
               SUCCESS
            ================================================= */

            <div className="demo-success">

              <div className="success-icon">
                ✓
              </div>

              <span className="success-label">
                REQUEST RECEIVED
              </span>

              <h2>
                Your demo is scheduled!
              </h2>

              <p>
                Thanks, {formData.name || "there"}.
                We've received your demo request.
              </p>


              <div className="success-details">

                <div>

                  <span>
                    Date
                  </span>

                  <strong>
                    {formData.date}
                  </strong>

                </div>


                <div>

                  <span>
                    Time
                  </span>

                  <strong>
                    {formData.time}
                  </strong>

                </div>


                <div>

                  <span>
                    Designation
                  </span>

                  <strong>
                    {formData.designation || "Not provided"}
                  </strong>

                </div>


                <div>

                  <span>
                    Requirement
                  </span>

                  <strong>
                    {formData.requirement}
                  </strong>

                </div>

              </div>


              <button
                className="schedule-button"
                onClick={resetForm}
              >

                Book Another Demo

                <span>
                  →
                </span>

              </button>

            </div>

          )}

        </section>

      </div>


      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <div className="demo-bottom">

        <span>
          ● AzentMart AI Voice Platform
        </span>

        <span>
          Multilingual • Automated • Intelligent
        </span>

      </div>

    </div>
  );
}

export default BookDemo;