import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  CalendarCheck,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

import { authService } from "../../services/authService";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const result = await authService.forgotPassword(email);
      setMessage(result.message);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to process the request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="auth-navbar">

        <Link to="/" className="auth-logo">

          <img
            src="/agent-apps/hr/assets/logo.svg"
            alt="AzentMart AI"
            className="auth-logo-image"
          />

        </Link>


        <Link to="/" className="auth-home-link">
          <ArrowLeft size={15} />
          Back to home
        </Link>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="auth-main">

        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <section className="auth-intro">

          <div className="auth-intro-content">

            <div className="auth-eyebrow">
              <span></span>
              AZENTMART HR PLATFORM
            </div>


            <h1>
              Your people.
              <br />
              <span>One connected</span>
              <br />
              platform.
            </h1>


            <p>
              Manage your workforce, HR operations and
              employee experience from one simple,
              intelligent platform.
            </p>


            <div className="auth-features">

              <div className="auth-feature">

                <div className="auth-feature-icon blue">
                  <Users size={17} />
                </div>

                <div>
                  <strong>Employee management</strong>
                  <span>
                    Keep your entire workforce organized.
                  </span>
                </div>

              </div>


              <div className="auth-feature">

                <div className="auth-feature-icon green">
                  <CalendarCheck size={17} />
                </div>

                <div>
                  <strong>Attendance & leave</strong>
                  <span>
                    Manage everyday HR operations easily.
                  </span>
                </div>

              </div>


              <div className="auth-feature">

                <div className="auth-feature-icon purple">
                  <UserPlus size={17} />
                </div>

                <div>
                  <strong>Employee lifecycle</strong>
                  <span>
                    From onboarding to everyday operations.
                  </span>
                </div>

              </div>

            </div>


            {/* =================================================
                MINI DASHBOARD
            ================================================= */}

            <div className="auth-mini-dashboard">

              <div className="mini-dashboard-header">

                <div>
                  <span>WORKFORCE OVERVIEW</span>
                  <strong>People Operations</strong>
                </div>

                <div className="mini-live">
                  <i></i>
                  Live
                </div>

              </div>


              <div className="mini-dashboard-stats">

                <div>
                  <Users size={14} />
                  <strong>248</strong>
                  <span>Employees</span>
                </div>

                <div>
                  <CalendarCheck size={14} />
                  <strong>93.1%</strong>
                  <span>Attendance</span>
                </div>

                <div>
                  <UserPlus size={14} />
                  <strong>12</strong>
                  <span>New joiners</span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            RIGHT FORM
        =================================================== */}

        <section className="auth-form-section">

          <div className="auth-card">

            <div className="auth-card-icon">
              <ShieldCheck size={22} />
            </div>


            <div className="auth-card-heading">

              <span className="auth-card-label">
                ACCOUNT RECOVERY
              </span>

              <h2>
                Forgot your password?
              </h2>

              <p>
                Enter your work email and we'll help you
                recover access to your account.
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={submit}
            >

              {message && (
                <div className="auth-success">
                  {message}
                </div>
              )}


              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}


              <div className="form-group">

                <label htmlFor="email">
                  Work email
                </label>

                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="you@company.com"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />

              </div>


              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {loading
                  ? "Sending..."
                  : "Request password reset"
                }

                {!loading && (
                  <ArrowRight size={16} />
                )}

              </button>

            </form>


            <div className="auth-divider">
              <span></span>
              <small>OR</small>
              <span></span>
            </div>


            <Link
              to="/login"
              className="auth-back-login"
            >
              Back to sign in
            </Link>


            <p className="auth-help-text">
              Need help accessing your account?
              <Link to="/contact">
                Contact support
              </Link>
            </p>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="auth-footer">

        <span>
          © {new Date().getFullYear()} AzentMart.
          All rights reserved.
        </span>

        <div>
          <Link to="/privacy">
            Privacy
          </Link>

          <Link to="/terms">
            Terms
          </Link>

          <Link to="/security">
            Security
          </Link>
        </div>

      </footer>

    </div>
  );
}