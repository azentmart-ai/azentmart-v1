import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaBalanceScale } from "react-icons/fa";

function LegalAgentLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend login goes here
    console.log(form);

    navigate("/legal-agent/dashboard");
  };

  const handleGoogleLogin = () => {
    // Google OAuth integration goes here
    console.log("Continue with Google");

    navigate("/legal-agent/dashboard");
  };

  return (
    <div className="legal-login-page">
      <div className="container">

        <div className="login-logo">

          <div className="logo-icon">
            <FaBalanceScale />
          </div>

          <h1>Legal Agent</h1>

          <p>LEGAL AI FOR ADVOCATES</p>

        </div>

        <div className="login-card">

          <h2>Sign In</h2>

          <p className="welcome-text">
            Welcome back, Advocate
          </p>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label>Email</label>

              <input
                type="email"
                className="form-control"
                placeholder="advocate@example.com"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="mb-3">

              <div className="password-label">

                <label>Password</label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>

              </div>

              <div className="password-box">

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

            <button
              type="submit"
              className="signin-btn2"
            >
              Sign In
            </button>

          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />

            Continue with Google
          </button>

          <div className="signup-link">

            No account?

            <Link to="/register">
              Create one
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default LegalAgentLogin;