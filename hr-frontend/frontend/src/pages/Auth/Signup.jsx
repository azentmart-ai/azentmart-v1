import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
  CalendarDays,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./Signup.css";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "HR account created successfully. Please sign in.",
        },
      });
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to create HR account. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="signup-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="signup-header">
        <div className="signup-header-inner">

          <Link to="/" className="signup-brand">
  <img
    src={logo}
    alt="AzentMart AI"
    className="signup-brand-logo"
  />
</Link>

          <div className="signup-header-right">

            <ShieldCheck size={14} />

            <span>
              Secure workspace
            </span>

          </div>

        </div>
      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="signup-main">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <section className="signup-left">

          <div className="signup-form-wrapper">

            <div className="signup-eyebrow">
              <Users size={13} />
              PEOPLE OPERATIONS
            </div>

            <h1>
              Create your
              <br />
              <span>HR workspace.</span>
            </h1>

            <p className="signup-intro">
              Set up your account to manage employees,
              attendance, leave, onboarding and everyday
              HR operations in one connected workspace.
            </p>


            {/* FORM */}

            <form
              className="signup-form"
              onSubmit={submit}
            >

              {/* FULL NAME */}

              <SignupField
                label="Full name"
                icon={UserRound}
              >

                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) =>
                    update("name", e.target.value)
                  }
                />

              </SignupField>


              {/* EMAIL */}

              <SignupField
                label="Work email"
                icon={Mail}
              >

                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) =>
                    update("email", e.target.value)
                  }
                />

              </SignupField>


              {/* PASSWORD */}

              <SignupField
                label="Password"
                icon={LockKeyhole}
              >

                <div className="signup-password-wrapper">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Create a secure password"
                    value={form.password}
                    onChange={(e) =>
                      update(
                        "password",
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </SignupField>


              {/* CONFIRM PASSWORD */}

              <SignupField
                label="Confirm password"
                icon={LockKeyhole}
              >

                <div className="signup-password-wrapper">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      update(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </SignupField>


              {/* PASSWORD INFO */}

              <div className="signup-password-info">

                <div>
                  <Check size={13} />
                  Minimum 6 characters
                </div>

                <div>
                  <Check size={13} />
                  Secure account protection
                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="signup-error">

                  <div className="signup-error-icon">
                    !
                  </div>

                  <div>
                    <strong>
                      Account creation failed
                    </strong>

                    <span>
                      {error}
                    </span>
                  </div>

                </div>
              )}


              {/* SECURITY */}

              <div className="signup-security">

                <div className="signup-security-icon">
                  <ShieldCheck size={17} />
                </div>

                <div>

                  <strong>
                    Protected HR access
                  </strong>

                  <span>
                    Your account information is protected
                    and used only for authorized HR access.
                  </span>

                </div>

              </div>


              {/* BUTTON */}

              <button
                type="submit"
                className="signup-button"
                disabled={busy}
              >

                <span>
                  {busy
                    ? "Creating account..."
                    : "Create HR account"}
                </span>

                {!busy && (
                  <ArrowRight size={17} />
                )}

              </button>


              {/* LOGIN */}

              <div className="signup-login">

                <span>
                  Already have an account?
                </span>

                <Link to="/login">
                  Sign in
                </Link>

              </div>

            </form>

          </div>

        </section>


        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <section className="signup-right">

          <div className="signup-right-content">

            <div className="signup-right-eyebrow">
              <Sparkles size={13} />
              PEOPLE OPERATIONS
            </div>

            <h2>
              Everything your
              <br />
              <span>people need.</span>
            </h2>

            <p>
              Connect employees, HR workflows and
              intelligent assistance in one secure
              workspace.
            </p>


            {/* DASHBOARD MOCKUP */}

            <div className="signup-dashboard">

              {/* Dashboard header */}

              <div className="signup-dashboard-header">

                <div>

                  <span>
                    WORKFORCE OVERVIEW
                  </span>

                  <strong>
                    People Operations
                  </strong>

                </div>

                <div className="signup-live">
                  <i />
                  Live
                </div>

              </div>


              {/* Stats */}

              <div className="signup-stats">

                <DashboardStat
                  icon={Users}
                  value="248"
                  label="Employees"
                />

                <DashboardStat
                  icon={CalendarDays}
                  value="94%"
                  label="Attendance"
                />

                <DashboardStat
                  icon={BriefcaseBusiness}
                  value="18"
                  label="Active workflows"
                />

              </div>


              {/* Lower dashboard */}

              <div className="signup-dashboard-lower">

                <div className="signup-chart">

                  <div className="signup-chart-title">

                    <div>
                      <span>
                        WORKFORCE ACTIVITY
                      </span>

                      <strong>
                        Attendance this week
                      </strong>
                    </div>

                    <Sparkles size={15} />

                  </div>


                  <div className="signup-bars">

                    <i style={{ height: "42%" }} />
                    <i style={{ height: "58%" }} />
                    <i style={{ height: "50%" }} />
                    <i style={{ height: "70%" }} />
                    <i style={{ height: "61%" }} />
                    <i style={{ height: "78%" }} />
                    <i style={{ height: "67%" }} />
                    <i style={{ height: "82%" }} />

                  </div>

                </div>


                {/* AI CARD */}

                <div className="signup-ai-card">

                  <div className="signup-ai-icon">
                    <Sparkles size={16} />
                  </div>

                  <span>
                    AI HR SUPPORT
                  </span>

                  <strong>
                    Available 24/7
                  </strong>

                  <p>
                    Ask about leave, attendance,
                    policies or employee processes.
                  </p>

                  <div className="signup-ai-input">
                    How can I help today?
                  </div>

                </div>

              </div>

            </div>


            {/* FLOATING CARDS */}

            <div className="signup-floating signup-floating-one">

              <div className="floating-icon green">
                <Check size={15} />
              </div>

              <div>
                <strong>
                  HR workflows connected
                </strong>

                <span>
                  Employee lifecycle synced
                </span>
              </div>

            </div>


            <div className="signup-floating signup-floating-two">

              <div className="floating-icon blue">
                <Sparkles size={14} />
              </div>

              <div>
                <strong>
                  AI HR Assistant
                </strong>

                <span>
                  System operational
                </span>
              </div>

            </div>


            {/* Bottom features */}

            <div className="signup-right-features">

              <div>
                <strong>
                  Employee lifecycle
                </strong>

                <span>
                  From onboarding to exit
                </span>
              </div>

              <div>
                <strong>
                  HR automation
                </strong>

                <span>
                  Less manual administration
                </span>
              </div>

              <div>
                <strong>
                  AI assistance
                </strong>

                <span>
                  Instant HR guidance
                </span>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================================================
   FIELD
========================================================= */

function SignupField({
  label,
  icon: Icon,
  children,
}) {
  return (
    <label className="signup-field">

      <span className="signup-field-label">
        {label}
        <b>*</b>
      </span>

      <div className="signup-input">

        <Icon size={16} />

        {children}

      </div>

    </label>
  );
}


/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({
  icon: Icon,
  value,
  label,
}) {
  return (
    <div className="signup-stat">

      <div className="signup-stat-icon">
        <Icon size={14} />
      </div>

      <div className="signup-stat-value">
        {value}
      </div>

      <span>
        {label}
      </span>

    </div>
  );
}