import React, { useState } from "react";
import {
  FaHeadset,
  FaEnvelope,
  FaPhoneAlt,
  FaQuestionCircle,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";

import "./Support.css";

function Support() {
  const [form, setForm] = useState({
    subject: "",
    category: "General Support",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.message.trim()) {
      return;
    }

    setSubmitted(true);

    setForm({
      subject: "",
      category: "General Support",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="support-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="support-header">
        <div className="support-eyebrow">HELP CENTER</div>

        <h1>Support</h1>

        <p>
          Get assistance with your AzentMart AI account, voice agents, calls,
          and platform services.
        </p>
      </div>

      {/* =====================================================
          SUPPORT INFO
      ===================================================== */}

      <div className="support-overview">
        <div className="support-info-card">
          <div className="support-info-icon">
            <FaEnvelope />
          </div>

          <div className="support-info-content">
            <span className="support-card-label">EMAIL SUPPORT</span>

            <h3>support@azentmart.ai</h3>

            <p>
              Send us your questions and our support team will get back to you.
            </p>
          </div>
        </div>

        <div className="support-info-card">
          <div className="support-info-icon">
            <FaPhoneAlt />
          </div>

          <div className="support-info-content">
            <span className="support-card-label">PHONE SUPPORT</span>

            <h3>Talk to our team</h3>

            <p>
              Get help with voice calling, agents, campaigns, and account
              issues.
            </p>
          </div>
        </div>

        <div className="support-info-card">
          <div className="support-info-icon">
            <FaHeadset />
          </div>

          <div className="support-info-content">
            <span className="support-card-label">SUPPORT HOURS</span>

            <h3>Monday – Friday</h3>

            <p>Our team is available during regular business hours.</p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="support-main-grid">
        {/* ===================================================
            CONTACT FORM
        =================================================== */}

        <div className="support-form-card">
          <div className="support-section-heading">
            <div className="support-heading-icon">
              <FaPaperPlane />
            </div>

            <div>
              <h2>Contact Support</h2>

              <p>Tell us what you need help with.</p>
            </div>
          </div>

          {submitted && (
            <div className="support-success">
              <FaCheckCircle />

              <span>Your support request has been submitted successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="support-field">
              <label htmlFor="subject">Subject</label>

              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder="What do you need help with?"
              />
            </div>

            <div className="support-field">
              <label htmlFor="category">Category</label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="General Support">General Support</option>

                <option value="Account">Account & Login</option>

                <option value="Voice AI">Voice AI</option>

                <option value="Calling">Calling & Telephony</option>

                <option value="Billing">Billing & Credits</option>

                <option value="Technical">Technical Issue</option>
              </select>
            </div>

            <div className="support-field">
              <label htmlFor="message">Message</label>

              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Describe your issue or question..."
              />
            </div>

            <button type="submit" className="support-submit-btn">
              <FaPaperPlane />
              <span>Submit Request</span>
            </button>
          </form>
        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="support-side">
          <div className="support-side-card">
            <div className="support-side-icon">
              <FaQuestionCircle />
            </div>

            <h3>How can we help?</h3>

            <p>
              Our support team can help you with account access, AI voice
              agents, telephony, campaigns, billing, and technical issues.
            </p>

            <div className="support-topics">
              <div className="support-topic">
                <span />
                Account & Login
              </div>

              <div className="support-topic">
                <span />
                AI Voice Agents
              </div>

              <div className="support-topic">
                <span />
                Calling & Telephony
              </div>

              <div className="support-topic">
                <span />
                Billing & Credits
              </div>
            </div>
          </div>

          <div className="support-side-card support-response-card">
            <div className="support-response-icon">
              <FaHeadset />
            </div>

            <div>
              <span className="support-card-label">SUPPORT RESPONSE</span>

              <h3>We're here to help</h3>

              <p>
                Provide as much detail as possible so our team can resolve your
                issue quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
