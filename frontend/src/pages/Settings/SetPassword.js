import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheck,
} from "react-icons/fa";

import "./SetPassword.css";

function SetPassword() {
  const navigate = useNavigate();

  const API_URL = "http://127.0.0.1:8000";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =======================================================
    // VALIDATION
    // =======================================================

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // =======================================================
    // GET LOGIN TOKEN
    // =======================================================

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // CALL FASTAPI
      // =====================================================

      const response = await fetch(
        `${API_URL}/api/auth/password`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            password: password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error(
          "Unable to read password response:",
          jsonError
        );
      }

      console.log(
        "Password update status:",
        response.status
      );

      console.log(
        "Password update response:",
        data
      );

      // =====================================================
      // TOKEN EXPIRED / INVALID
      // =====================================================

      if (response.status === 401) {
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "isLoggedIn"
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      // =====================================================
      // BACKEND ERROR
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to update password."
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      setSuccess(
        "Password updated successfully."
      );

      setPassword("");
      setConfirmPassword("");

      // =====================================================
      // RETURN TO DASHBOARD
      // =====================================================

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 800);

    } catch (err) {
      console.error(
        "Password update error:",
        err
      );

      if (
        err.message?.includes(
          "Failed to fetch"
        )
      ) {
        setError(
          "Cannot connect to the backend. Make sure FastAPI is running."
        );
      } else {
        setError(
          err.message ||
            "Unable to update password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="settings-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="settings-page-header">

        <div>

          <span className="settings-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>
            Set Password
          </h1>

          <p>
            Create a new password for your account.
          </p>

        </div>

      </div>

      {/* =====================================================
          PASSWORD CARD
      ===================================================== */}

      <div className="settings-card password-card">

        {/* ===================================================
            CARD TITLE
        =================================================== */}

        <div className="settings-card-title">

          <div className="settings-icon-box">
            <FaLock />
          </div>

          <div>

            <h2>
              Change Password
            </h2>

            <p>
              Your password must contain at least 8 characters.
            </p>

          </div>

        </div>

        {/* ===================================================
            SUCCESS MESSAGE
        =================================================== */}

        {success && (
          <div className="settings-success">
            {success}
          </div>
        )}

        {/* ===================================================
            ERROR MESSAGE
        =================================================== */}

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit}>

          {/* =================================================
              NEW PASSWORD
          ================================================= */}

          <div className="settings-field">

            <label>
              New Password *
            </label>

            <div className="password-input">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(
                    e.target.value
                  );

                  setError("");
                  setSuccess("");
                }}
                minLength={8}
                required
                disabled={loading}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="settings-field">

            <label>
              Confirm Password *
            </label>

            <div className="password-input">

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                placeholder="Min. 8 characters"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(
                    e.target.value
                  );

                  setError("");
                  setSuccess("");
                }}
                minLength={8}
                required
                disabled={loading}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(
                    (prev) => !prev
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirm
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirm ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* =================================================
              PASSWORD MATCH INDICATOR
          ================================================= */}

          {confirmPassword &&
            password !== confirmPassword && (
              <div className="password-mismatch">
                Passwords do not match.
              </div>
            )}

          {confirmPassword &&
            password === confirmPassword &&
            password.length >= 8 && (
              <div className="password-match">
                Passwords match.
              </div>
            )}

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            className="primary-settings-btn"
            disabled={loading}
          >

            <FaCheck />

            <span>
              {loading
                ? "Updating..."
                : "Submit"}
            </span>

          </button>

        </form>

      </div>

    </div>
  );
}

export default SetPassword;