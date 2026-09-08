import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Style/LandingAuth.css";

function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Sign-in is ready. Connect this form to the landing authentication API when the backend endpoint is available.");
  };

  return (
    <div className="az-auth-app">
      <Navbar />
      <main className="az-auth-page">
        <div className="az-auth-glow az-auth-glow-one" />
        <div className="az-auth-glow az-auth-glow-two" />
        <div className="az-auth-shell">
          <section className="az-auth-brand-panel">
            <span className="az-section-kicker">AZENTMART AI</span>
            <h1>One workspace for your AI workforce.</h1>
            <p>Sign in to your AzentMart account and continue exploring, managing and connecting AI-powered workflows.</p>
            <div className="az-auth-points">
              <span><b>01</b> Discover purpose-built AI agents</span>
              <span><b>02</b> Connect workflows and business systems</span>
              <span><b>03</b> Keep visibility and control in one place</span>
            </div>
          </section>

          <section className="az-auth-card">
            <div className="az-auth-card-head">
              <span className="az-auth-mini-label">WELCOME BACK</span>
              <h2>Sign in</h2>
              <p>Access your AzentMart account.</p>
            </div>

            <button type="button" className="az-auth-google" onClick={() => setMessage("Google sign-in is ready to connect to your authentication provider.")}>
              <FaGoogle />
              Continue with Google
            </button>

            <div className="az-auth-divider"><span>OR</span></div>

            <form onSubmit={handleSubmit} className="az-auth-form">
              <label>Email address
                <div className="az-auth-input-wrap">
                  <FaEnvelope />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
                </div>
              </label>

              <label>Password
                <div className="az-auth-input-wrap">
                  <FaLock />
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" required />
                </div>
              </label>

              <div className="az-auth-row">
                <span />
                <button type="button" className="az-auth-text-button" onClick={() => setMessage("Password recovery is ready to connect to your authentication provider.")}>Forgot password?</button>
              </div>

              {message && <div className="az-auth-message" role="status">{message}</div>}

              <button type="submit" className="az-auth-submit">Sign in <FaArrowRight /></button>
            </form>

            <p className="az-auth-switch">Don't have an account? <Link to="/create-account">Create account</Link></p>
            <Link className="az-auth-back" to="/">← Back to AzentMart</Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SignIn;
