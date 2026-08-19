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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace this with your backend API later
    console.log("Authentication Successful");
    console.log(formData);

    // Redirect to Dashboard
    navigate("/interview-dashboard");
  };

  const googleLogin = () => {
    console.log("Google Login");

    // Redirect after Google Login
    navigate("/interview-dashboard");
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
            >
              <FaGoogle />
              Continue with Google
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

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
              >
                {isLogin
                  ? "Login"
                  : "Create Account"}
              </button>

            </form>

            {/* Bottom Switch */}

            <div className="auth-switch">

              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <Link to="/auth?mode=signup">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link to="/auth?mode=login">
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