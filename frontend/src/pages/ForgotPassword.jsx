import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import { api } from "../lib/api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.forgotPassword({
        email: cleanEmail,
      });

      setMessage(
        response?.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="forgot-header">

        <Link to="/" className="forgot-logo">
          <img
            src="/company-logo.png"
            alt="AzentMart AI"
          />
        </Link>

        <div className="forgot-header-status">
          <span className="forgot-status-dot" />
          Recruiting Workspace
        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="forgot-main">

        <div className="forgot-wrapper">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <section className="forgot-intro">

            <div className="forgot-kicker">
              <span className="forgot-kicker-line" />
              ACCOUNT RECOVERY
            </div>

            <h1>
              Get back to
              <span> your workspace.</span>
            </h1>

            <p>
              Enter the email address associated with your
              Recruiting Agent account and we'll help you
              reset your password.
            </p>


            <div className="forgot-benefits">

              <div className="forgot-benefit">

                <div className="forgot-benefit-icon">
                  <Mail size={16} />
                </div>

                <div>
                  <strong>
                    Enter your email
                  </strong>

                  <span>
                    Use the email linked to your account
                  </span>
                </div>

              </div>


              <div className="forgot-benefit">

                <div className="forgot-benefit-icon">
                  <LockKeyhole size={16} />
                </div>

                <div>
                  <strong>
                    Create a new password
                  </strong>

                  <span>
                    Set a secure password from the reset link
                  </span>
                </div>

              </div>


              <div className="forgot-benefit">

                <div className="forgot-benefit-icon">
                  <ShieldCheck size={16} />
                </div>

                <div>
                  <strong>
                    Secure recovery
                  </strong>

                  <span>
                    Your account information stays protected
                  </span>
                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              CARD
          ================================================= */}

          <section className="forgot-card">

            <div className="forgot-card-glow" />

            <div className="forgot-card-content">

              {/* CARD HEADER */}

              <div className="forgot-card-header">

                <div className="forgot-card-icon">
                  <LockKeyhole size={18} />
                </div>

                <div>
                  <h2>
                    Forgot password?
                  </h2>

                  <p>
                    Reset your Recruiting Agent password
                  </p>
                </div>

              </div>


              {/* SUCCESS */}

              {message && (
                <div className="forgot-success">

                  <CheckCircle2 size={15} />

                  <span>
                    {message}
                  </span>

                </div>
              )}


              {/* ERROR */}

              {error && (
                <div className="forgot-error">

                  <AlertCircle size={15} />

                  <span>
                    {error}
                  </span>

                </div>
              )}


              {/* FORM */}

              <form
                className="forgot-form"
                onSubmit={submit}
              >

                <div className="forgot-field">

                  <label htmlFor="forgot-email">
                    Email address
                  </label>

                  <div className="forgot-input">

                    <Mail size={16} />

                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);

                        if (error) {
                          setError("");
                        }
                      }}
                      placeholder="name@company.com"
                      autoComplete="email"
                      disabled={loading}
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  className="forgot-submit"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span className="forgot-spinner" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight size={16} />
                    </>
                  )}

                </button>

              </form>


              {/* LOGIN */}

              <div className="forgot-login">

                <span>
                  Remember your password?
                </span>

                <Link to="/login">
                  Back to sign in
                  <ArrowRight size={13} />
                </Link>

              </div>

            </div>


            {/* SECURITY */}

            <div className="forgot-security">

              <ShieldCheck size={14} />

              <span>
                Your account information is securely protected
              </span>

            </div>

          </section>

        </div>


        {/* FOOTER */}

        <footer className="forgot-footer">

          <span>
            © 2026 AzentMart AI
          </span>

          <span className="forgot-footer-dot">
            •
          </span>

          <span>
            Recruiting Agent
          </span>

        </footer>

      </main>

    </div>
  );
}