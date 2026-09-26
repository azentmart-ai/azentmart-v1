import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { api } from "../lib/api";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.signup({
        name,
        email,
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="signup-header">

        <Link to="/" className="signup-logo">
          <img
            src="/company-logo.png"
            alt="AzentMart AI"
          />
        </Link>

      

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="signup-main">

        <div className="signup-wrapper">

          {/* =================================================
              LEFT INTRO
          ================================================= */}

          <section className="signup-intro">

            <div className="signup-kicker">
              <span className="signup-kicker-line" />
              RECRUITING AGENT
            </div>

            <h1>
              Build your
              <span> hiring flow.</span>
            </h1>

            <p>
              Create your recruiter account and bring
              sourcing, screening, interviews and candidate
              engagement into one intelligent workspace.
            </p>

            <div className="signup-benefits">

              <div className="signup-benefit">
                <div className="signup-benefit-icon">
                  <User size={16} />
                </div>

                <div>
                  <strong>AI-powered recruiting</strong>
                  <span>Find and screen candidates faster</span>
                </div>
              </div>

              <div className="signup-benefit">
                <div className="signup-benefit-icon">
                  <ShieldCheck size={16} />
                </div>

                <div>
                  <strong>One connected workspace</strong>
                  <span>Manage your hiring workflow in one place</span>
                </div>
              </div>

            </div>

          </section>


          {/* =================================================
              SIGNUP CARD
          ================================================= */}

          <section className="signup-card">

            <div className="signup-card-glow" />

            <div className="signup-card-content">

              {/* Card Header */}

              <div className="signup-card-header">

                <div className="signup-card-icon">
                  <User size={18} />
                </div>

                <div>
                  <h2>Create account</h2>
                  <p>Start your recruiting workspace</p>
                </div>

              </div>


              {/* Error */}

              {error && (
                <div className="signup-error">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}


              {/* Form */}

              <form
                className="signup-form"
                onSubmit={submit}
              >

                {/* Name */}

                <div className="signup-field">

                  <label htmlFor="signup-name">
                    Full name
                  </label>

                  <div className="signup-input">

                    <User size={16} />

                    <input
                      id="signup-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      disabled={loading}
                    />

                  </div>

                </div>


                {/* Email */}

                <div className="signup-field">

                  <label htmlFor="signup-email">
                    Email address
                  </label>

                  <div className="signup-input">

                    <Mail size={16} />

                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      autoComplete="email"
                      disabled={loading}
                    />

                  </div>

                </div>


                {/* Password */}

                <div className="signup-field">

                  <label htmlFor="signup-password">
                    Password
                  </label>

                  <div className="signup-input">

                    <Lock size={16} />

                    <input
                      id="signup-password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="signup-password-toggle"
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

                  <span className="signup-helper">
                    Use at least 6 characters.
                  </span>

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  className="signup-submit"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span className="signup-spinner" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={16} />
                    </>
                  )}

                </button>

              </form>


              {/* Login */}

              <div className="signup-login">

                <span>
                  Already have an account?
                </span>

                <Link to="/login">
                  Sign in
                  <ArrowRight size={13} />
                </Link>

              </div>

            </div>


            {/* Security */}

            <div className="signup-security">

              <ShieldCheck size={14} />

              <span>
                Your account information is securely protected
              </span>

            </div>

          </section>

        </div>


        {/* Footer */}

        <footer className="signup-footer">

          <span>
            © 2026 AzentMart AI
          </span>

          <span className="signup-footer-dot">
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