import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:8000";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // ============================
    // VALIDATION
    // ============================

    if (!formData.fullName.trim()) {
      setError("Please enter your first name.");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Please enter your last name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your work email.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the terms and privacy policy.");
      return;
    }

    try {
      setLoading(true);

      // ============================
      // REGISTER USER
      // ============================

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: `${formData.fullName.trim()} ${formData.lastName.trim()}`.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: "user",
        }),
      });

      // ============================
      // READ RESPONSE
      // ============================

      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Unable to read signup response:", jsonError);
      }

      console.log("Signup status:", response.status);
      console.log("Signup response:", data);

      // ============================
      // BACKEND ERROR
      // ============================

      if (!response.ok) {
        let errorMessage = "Unable to create your account.";

        if (typeof data?.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data?.detail)) {
          errorMessage = data.detail
            .map((item) => item.msg)
            .join(", ");
        }

        throw new Error(errorMessage);
      }

      // ============================
      // STORE USER INFORMATION
      // ============================

      const fullName = `${formData.fullName.trim()} ${formData.lastName.trim()}`.trim();
      const normalizedEmail = formData.email.trim().toLowerCase();

      localStorage.setItem(
        "azentmart_user_name",
        fullName
      );

      localStorage.setItem(
        "azentmart_signup_email",
        normalizedEmail
      );

      // ============================
      // CLEAR FORM
      // ============================

      setFormData({
        fullName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setAgreeTerms(false);

      // ============================
      // ACCOUNT CREATED
      // ============================

      console.log("Account created successfully.");

      navigate("/agents/voice/login", {
        replace: true,
      });

    } catch (err) {
      console.error("Signup error:", err);

      if (err.message?.includes("Failed to fetch")) {
        setError(
          "Cannot connect to the backend. Make sure FastAPI is running."
        );
      } else {
        setError(
          err.message ||
            "Unable to create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background-glow"></div>

      <div className="auth-container">

        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <section className="auth-intro">

          <Link to="/" className="auth-brand">
            <div className="brand-logo">A</div>

            <div>
              <strong>AzentMart</strong>
              <span>AI VOICE</span>
            </div>
          </Link>

          <div className="intro-content">

            <span className="intro-label">
              VOICE AI FOR BUSINESS
            </span>

            <h1>
              Start every
              <br />
              <span>conversation</span>
              <br />
              with confidence.
            </h1>

            <p>
              Build better customer conversations with voice AI
              for lead qualification, customer support, admission
              enquiries and customer follow-ups.
            </p>

            <div className="intro-points">

              <div>
                <span>✓</span>
                <p>Lead Qualification</p>
              </div>

              <div>
                <span>✓</span>
                <p>Customer Support</p>
              </div>

              <div>
                <span>✓</span>
                <p>Admission Enquiries</p>
              </div>

              <div>
                <span>✓</span>
                <p>Customer Follow-ups</p>
              </div>

            </div>
          </div>

          <div className="auth-footer-note">
            Intelligent voice conversations for modern businesses.
          </div>

        </section>

        {/* =================================================
            SIGNUP FORM
        ================================================= */}

        <section className="auth-form-area">

          <div className="auth-card signup-card">

            {/* HEADER */}

            <div className="form-heading">

              <span className="form-label">
                CREATE ACCOUNT
              </span>

              <h2>
                Create your
                <br />
                <span>AzentMart account.</span>
              </h2>

              <p>
                Get started with AI-powered voice conversations
                for your business.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSignup}>

              {/* FIRST NAME + LAST NAME */}

              <div className="two-column">

                <div className="form-group">

                  <label htmlFor="fullName">
                    First name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="given-name"
                    disabled={loading}
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="lastName">
                    Last name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    autoComplete="family-name"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="email">
                  Work email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

              {/* PASSWORD */}

              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="password-field">

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="form-group">

                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <div className="password-field">

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    disabled={loading}
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* TERMS */}

              <label className="terms-check">

                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) =>
                    setAgreeTerms(e.target.checked)
                  }
                  disabled={loading}
                />

                <span>
                  I agree to the{" "}
                  <a
                    href="#terms"
                    onClick={(e) =>
                      e.preventDefault()
                    }
                  >
                    terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="#privacy"
                    onClick={(e) =>
                      e.preventDefault()
                    }
                  >
                    privacy policy
                  </a>
                  .
                </span>

              </label>

              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                className="primary-auth-button"
                disabled={loading}
              >

                {loading
                  ? "Creating account..."
                  : "Create new account"}

                {!loading && (
                  <span>→</span>
                )}

              </button>

            </form>

            {/* LOGIN */}

            <div className="switch-auth">

              <span>
                Already have an account?
              </span>

              <Link to="/agents/voice/login">
                Sign in →
              </Link>

            </div>

            {/* BACK HOME */}

            <div className="back-link">

              <Link to="/">
                ← Back to AzentMart AI
              </Link>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Signup;