import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function ResetPassword() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Password reset");

    setSuccess(true);
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
          {!success ? (
            <>
              <div className="auth-icon">🔒</div>

              <div className="form-heading center-heading">
                <span className="form-label">SECURE YOUR ACCOUNT</span>

                <h2>Create a new password</h2>

                <p>Choose a strong password for your AzentMart AI account.</p>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>New password</label>

                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm new password</label>

                  <div className="password-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="password-rules">
                  <p>Password requirements</p>

                  <span>✓ At least 8 characters</span>

                  <span>✓ One uppercase letter</span>

                  <span>✓ One number</span>

                  <span>✓ One special character</span>
                </div>

                <button type="submit" className="primary-auth-button">
                  Reset Password
                  <span>→</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="success-icon">✓</div>

              <div className="form-heading center-heading">
                <span className="form-label">PASSWORD UPDATED</span>

                <h2>Password changed</h2>

                <p>
                  Your password has been successfully updated. You can now sign
                  in using your new password.
                </p>
              </div>

              <button
                className="primary-auth-button"
                onClick={() => navigate("/agents/voice/login")}
              >
                Continue to Sign In
                <span>→</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
