import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    console.log("Password reset requested:", email);

    setError("");
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-background-glow"></div>

      <div className="simple-auth-wrapper">
        <Link to="/" className="auth-brand centered-brand">
          <div className="brand-logo">A</div>

          <div>
            <strong>AzentMart</strong>
            <span>AI VOICE</span>
          </div>
        </Link>

        <div className="auth-card simple-card">
          {!submitted ? (
            <>
              <div className="auth-icon">↗</div>

              <div className="form-heading center-heading">
                <span className="form-label">ACCOUNT RECOVERY</span>

                <h2>Forgot your password?</h2>

                <p>
                  Enter your registered email address and we'll send you a
                  secure password reset link.
                </p>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email address</label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="you@company.com"
                  />
                </div>

                <button type="submit" className="primary-auth-button">
                  Send Reset Link
                  <span>→</span>
                </button>
              </form>

              <div className="back-link">
                <Link to="/login">← Back to Sign In</Link>
              </div>
            </>
          ) : (
            <>
              <div className="success-icon">✓</div>

              <div className="form-heading center-heading">
                <span className="form-label">EMAIL SENT</span>

                <h2>Check your inbox</h2>

                <p>
                  We've sent a password reset link to
                  <strong> {email}</strong>.
                </p>
              </div>

              <div className="email-info-box">
                <span>Didn't receive the email?</span>

                <button type="button" onClick={() => setSubmitted(false)}>
                  Resend email
                </button>
              </div>

              <Link to="/login" className="primary-auth-button button-link">
                Back to Sign In
                <span>→</span>
              </Link>
            </>
          )}
        </div>

        <p className="security-note">
          Your account security is important to us.
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
