import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  Sparkles,
} from "lucide-react";

import { api, setAuth } from "../lib/api";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const successMessage = location.state?.message || "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = form.email.trim();
    const password = form.password;

    /* ==========================================
       VALIDATION
    ========================================== */

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // FIXED EMAIL REGEX
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      console.log("================================");
      console.log("LOGIN START");
      console.log("EMAIL:", email);
      console.log("================================");

      /* ==========================================
         CALL BACKEND LOGIN API
      ========================================== */

      const response = await api.login({
        email,
        password,
      });

      console.log("LOGIN API RESPONSE:", response);

      /* ==========================================
         SAVE TOKEN + USER
         
         THIS WAS MISSING IN YOUR CODE
      ========================================== */

      setAuth(response);

      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("azentmart_token")
      );

      console.log(
        "USER SAVED:",
        localStorage.getItem("azentmart_user")
      );

      /* ==========================================
         VERIFY TOKEN
      ========================================== */

      const savedToken = localStorage.getItem(
        "azentmart_token"
      );

      if (!savedToken) {
        setError(
          "Login succeeded, but authentication token was not saved."
        );

        return;
      }

      /* ==========================================
         GO TO DASHBOARD
      ========================================== */

      console.log("LOGIN SUCCESS");
      console.log("REDIRECTING TO DASHBOARD...");

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error("================================");
      console.error("LOGIN ERROR:", err);
      console.error("MESSAGE:", err?.message);
      console.error("================================");

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="login-header">

        <Link to="/" className="login-logo">
          <img
            src="/company-logo.png"
            alt="AzentMart AI"
          />
        </Link>

        
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="login-main">

        <div className="login-wrapper">

          {/* =================================================
              LEFT INTRO
          ================================================= */}

          <section className="login-intro">

            <div className="login-kicker">
              <span className="login-kicker-line" />
              RECRUITING AGENT
            </div>

            <h1>
              Welcome
              <span>back.</span>
            </h1>

            <p>
              Continue to your intelligent recruiting workspace
              and manage your hiring workflow from one connected
              platform.
            </p>

            {/* BENEFITS */}

            <div className="login-benefits">

              <div className="login-benefit">

                <div className="login-benefit-icon">
                  <UserCheck size={16} />
                </div>

                <div>
                  <strong>
                    Your recruiting workspace
                  </strong>

                  <span>
                    Continue where you left off
                  </span>
                </div>

              </div>

              <div className="login-benefit">

                <div className="login-benefit-icon">
                  <Sparkles size={16} />
                </div>

                <div>
                  <strong>
                    AI-assisted hiring
                  </strong>

                  <span>
                    Source, screen and interview smarter
                  </span>
                </div>

              </div>

              <div className="login-benefit">

                <div className="login-benefit-icon">
                  <ShieldCheck size={16} />
                </div>

                <div>
                  <strong>
                    Secure workspace
                  </strong>

                  <span>
                    Your recruiting data stays protected
                  </span>
                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <section className="login-card">

            <div className="login-card-glow" />

            <div className="login-card-content">

              {/* CARD HEADER */}

              <div className="login-card-header">

                <div className="login-card-icon">
                  <Lock size={18} />
                </div>

                <div>
                  <h2>Welcome back</h2>

                  <p>
                    Sign in to your recruiting workspace
                  </p>
                </div>

              </div>

              {/* SUCCESS */}

              {successMessage && (
                <div className="login-success">

                  <ShieldCheck size={15} />

                  <span>
                    {successMessage}
                  </span>

                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="login-error">

                  <AlertCircle size={15} />

                  <span>
                    {error}
                  </span>

                </div>
              )}

              {/* FORM */}

              <form
                className="login-form"
                onSubmit={handleSubmit}
              >

                {/* EMAIL */}

                <div className="login-field">

                  <label htmlFor="login-email">
                    Email address
                  </label>

                  <div className="login-input">

                    <Mail size={16} />

                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      disabled={loading}
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div className="login-field">

                  <div className="login-label-row">

                    <label htmlFor="login-password">
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="login-forgot"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="login-input">

                    <Lock size={16} />

                    <input
                      id="login-password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="login-password-toggle"
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
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="login-submit"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span className="login-spinner" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={16} />
                    </>
                  )}

                </button>

              </form>

              {/* SIGNUP */}

              <div className="login-create">

                <span>
                  New to Recruiting Agent?
                </span>

                <Link to="/signup">

                  Create an account

                  <ArrowRight size={13} />

                </Link>

              </div>

            </div>

            {/* SECURITY */}

            <div className="login-security">

              <ShieldCheck size={14} />

              <span>
                Your account information is securely protected
              </span>

            </div>

          </section>

        </div>

        {/* FOOTER */}

        <footer className="login-footer">

          <span>
            © 2026 AzentMart AI
          </span>

          <span className="login-footer-dot">
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