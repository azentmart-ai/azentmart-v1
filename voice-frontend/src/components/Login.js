import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  // =========================================================
  // FORM STATE
  // =========================================================

  const [email, setEmail] = useState(() => {
    return localStorage.getItem("azentmart_signup_email") || "";
  });

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });

  // =========================================================
  // BACKEND API
  // =========================================================

  const API_URL = "http://127.0.0.1:8000";

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // -------------------------------------------------------
    // FRONTEND VALIDATION
    // -------------------------------------------------------

    if (!email.trim()) {
      setError("Please enter your work email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // -------------------------------------------------------
    // START LOADING
    // -------------------------------------------------------

    setLoading(true);

    try {
      // -----------------------------------------------------
      // CALL FASTAPI LOGIN
      // -----------------------------------------------------

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      // -----------------------------------------------------
      // READ RESPONSE
      // -----------------------------------------------------

      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Unable to read backend response:", jsonError);
      }

      console.log("Login status:", response.status);
      console.log("Login response:", data);

      // -----------------------------------------------------
      // BACKEND ERROR
      // -----------------------------------------------------

      if (!response.ok) {
        let errorMessage = "Login failed.";

        if (typeof data?.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data?.detail)) {
          errorMessage = data.detail.map((item) => item.msg).join(", ");
        }

        throw new Error(errorMessage);
      }

      // -----------------------------------------------------
      // MAKE SURE JWT EXISTS
      // -----------------------------------------------------

      if (!data.access_token) {
        throw new Error("Login succeeded but no access token was received.");
      }

      // -----------------------------------------------------
      // STORE AUTHENTICATION INFORMATION
      // -----------------------------------------------------

      localStorage.setItem("access_token", data.access_token);

      localStorage.setItem("isLoggedIn", "true");

      // -----------------------------------------------------
      // STORE USER ID
      // -----------------------------------------------------

      if (data.user_id !== undefined && data.user_id !== null) {
        localStorage.setItem("userId", String(data.user_id));
      }

      // -----------------------------------------------------
      // STORE USER NAME
      // -----------------------------------------------------

      if (data.name) {
        localStorage.setItem("userName", data.name);
      }

      // -----------------------------------------------------
      // STORE USER ROLE
      // -----------------------------------------------------

      if (data.role) {
        localStorage.setItem("userRole", data.role);
      }

      // -----------------------------------------------------
      // STORE USER EMAIL
      // -----------------------------------------------------

      localStorage.setItem("userEmail", email.trim());

      // -----------------------------------------------------
      // REMEMBER ME
      // -----------------------------------------------------

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");

        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberMe");

        localStorage.removeItem("rememberedEmail");
      }

      // -----------------------------------------------------
      // REMOVE TEMPORARY SIGNUP EMAIL
      // -----------------------------------------------------

      localStorage.removeItem("azentmart_signup_email");

      // -----------------------------------------------------
      // LOGIN SUCCESS
      // -----------------------------------------------------

      console.log("Login successful. Redirecting to dashboard...");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);

      // -----------------------------------------------------
      // DISPLAY ERROR
      // -----------------------------------------------------

      if (err.message?.includes("Failed to fetch")) {
        setError(
          "Cannot connect to the backend. Make sure FastAPI is running.",
        );
      } else {
        setError(err.message || "Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  const handleGoogleLogin = () => {
    setError("Google login will be connected with Google OAuth.");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="auth-page">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="auth-glow auth-glow-one"></div>

      <div className="auth-glow auth-glow-two"></div>

      <div className="auth-layout">
        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div className="auth-intro">
          <Link to="/" className="auth-brand">
            <div className="auth-brand-icon">A</div>

            <div>
              <strong>AzentMart</strong>

              <span>AI VOICE</span>
            </div>
          </Link>

          <div className="auth-intro-content">
            <span className="auth-eyebrow">AI VOICE FOR BUSINESS</span>

            <h2>
              Turn every conversation
              <br />
              into an opportunity.
            </h2>

            <p>
              Manage voice AI conversations for lead qualification, customer
              support, admission enquiries and customer follow-ups.
            </p>

            <div className="auth-feature-list">
              <div>
                <span>✓</span>
                Lead Qualification
              </div>

              <div>
                <span>✓</span>
                Customer Support
              </div>

              <div>
                <span>✓</span>
                Admission Enquiries
              </div>

              <div>
                <span>✓</span>
                Customer Follow-ups
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            LOGIN CARD
        =================================================== */}

        <div className="auth-card">
          <div className="auth-card-header">
            <span className="auth-label">WELCOME BACK</span>

            <h1>Sign in to AzentMart.</h1>

            <p>Access your voice AI dashboard and manage your conversations.</p>
          </div>

          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form onSubmit={handleLogin} className="auth-form">
            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="form-group">
              <label htmlFor="email">Work email</label>

              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>

                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && <div className="auth-error">{error}</div>}

            {/* =================================================
                REMEMBER ME
            ================================================= */}

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />

                <span>Remember me</span>
              </label>
            </div>

            {/* =================================================
                SIGN IN BUTTON
            ================================================= */}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* =================================================
              GOOGLE
          ================================================= */}

          <button
            type="button"
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          {/* =================================================
              SIGNUP
          ================================================= */}

          <p className="auth-bottom">
            Don't have an account? <Link to="/signup">Create an account</Link>
          </p>

          {/* =================================================
              HOME
          ================================================= */}

          <Link to="/" className="back-home">
            ← Back to AzentMart AI
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
