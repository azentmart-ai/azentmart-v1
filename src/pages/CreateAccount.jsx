import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaUser, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Style/LandingAuth.css";

function CreateAccount() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Account creation is ready. Connect this form to the landing authentication API when the backend endpoint is available.");
  };

  return (
    <div className="az-auth-app">
      <Navbar />
      <main className="az-auth-page">
        <div className="az-auth-glow az-auth-glow-one" />
        <div className="az-auth-glow az-auth-glow-two" />
        <div className="az-auth-shell">
          <section className="az-auth-brand-panel">
            <span className="az-section-kicker">START WITH AZENTMART</span>
            <h1>Build your AI workforce, your way.</h1>
            <p>Create your AzentMart account and discover the agents, workflows and tools built to move everyday work forward.</p>
            <div className="az-auth-points">
              <span><b>01</b> Start with a focused AI agent</span>
              <span><b>02</b> Expand into connected workflows</span>
              <span><b>03</b> Scale when your team is ready</span>
            </div>
          </section>

          <section className="az-auth-card">
            <div className="az-auth-card-head">
              <span className="az-auth-mini-label">GET STARTED</span>
              <h2>Create account</h2>
              <p>Set up your AzentMart account.</p>
            </div>

            <button type="button" className="az-auth-google" onClick={() => setMessage("Google sign-up is ready to connect to your authentication provider.")}>
              <FaGoogle />
              Continue with Google
            </button>

            <div className="az-auth-divider"><span>OR</span></div>

            <form onSubmit={handleSubmit} className="az-auth-form">
              <label>Full name
                <div className="az-auth-input-wrap">
                  <FaUser />
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" autoComplete="name" required />
                </div>
              </label>

              <label>Email address
                <div className="az-auth-input-wrap">
                  <FaEnvelope />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
                </div>
              </label>

              <label>Password
                <div className="az-auth-input-wrap">
                  <FaLock />
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a password" autoComplete="new-password" minLength="6" required />
                </div>
              </label>

              {message && <div className="az-auth-message" role="status">{message}</div>}

              <button type="submit" className="az-auth-submit">Create account <FaArrowRight /></button>
            </form>

            <p className="az-auth-switch">Already have an account? <Link to="/signin">Sign in</Link></p>
            <Link className="az-auth-back" to="/">← Back to AzentMart</Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CreateAccount;
