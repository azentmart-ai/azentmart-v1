import React, { useState } from "react";
import {
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";

import "../Style/YourAIAssistant.css";

import { registerUser, loginUser } from "../services/interviewApi";

const YourAIAuth = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const mode = searchParams.get("mode") || "login";

  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let user;

      if (isLogin) {
        user = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      } else {
        if (!formData.name.trim()) {
          setError("Name is required.");
          setLoading(false);
          return;
        }

        user = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/agents/interview/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    // Google OAuth not yet implemented — placeholder
    console.log("Google Login");
  };

  return (
    <section className="auth-page">
      <div className="auth-container">

        {/* Left Side */}

        <div className="auth-left">
          <div className="auth-overlay">

            <h1>AzentMart AI</h1>

            <h2>
              Ace Every Interview With AI
            </h2>

            <p>
              Real-time interviewer transcription,
              AI-generated answers,
              interview insights,
              analytics and much more.
            </p>

          </div>
        </div>

        {/* Right Side */}

        <div className="auth-right">

          <div className="auth-card">

            <h2>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p>
              {isLogin
                ? "Login to continue your interview journey."
                : "Create your account to get started."}
            </p>

            {/* Google Login */}

            <button
              className="google-btn"
              onClick={googleLogin}
              type="button"
            >
              <FaGoogle />
              Continue with Google
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            {/* Error */}

            {error && (
              <div
                style={{
                  color: "#ff4444",
                  fontSize: "0.875rem",
                  marginBottom: "12px",
                  padding: "8px 12px",
                  background: "rgba(255,68,68,0.1)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,68,68,0.3)",
                }}
              >
                {error}
              </div>
            )}

            {/* Form */}

            <form onSubmit={handleSubmit}>

              {!isLogin && (
                <div className="input-group">
                  <FaUser className="input-icon" />

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="input-group">
                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {isLogin && (
                <div className="forgot-password">
                  <Link to="#">
                    Forgot Password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Login"
                    : "Create Account"}
              </button>

            </form>

            {/* Bottom Switch */}

            <div className="auth-switch">

              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <Link to="/agents/interview/auth?mode=signup">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link to="/agents/interview/auth?mode=login">
                    Login
                  </Link>
                </>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default YourAIAuth;