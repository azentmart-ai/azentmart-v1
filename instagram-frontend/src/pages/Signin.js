import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

      if (signInError) {
        console.error("Supabase signin error:", signInError);
        setError(signInError.message);
        return;
      }

      navigate("/instagram-dashboard");
    } catch (err) {
      console.error("Signin error:", err);
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="instagram-auth-page">
      <div className="instagram-auth-card">

        <div className="instagram-auth-logo">
          <span>✦</span>
        </div>

        <h1>Welcome Back</h1>

        <p className="instagram-auth-subtitle">
          Sign in to your Instagram AI Agent
        </p>

        {error && (
          <div className="instagram-auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="instagram-auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="instagram-auth-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="instagram-auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

        <div className="instagram-auth-footer">
          Don't have an account?{" "}
          <Link to="/instagram-signup">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Signin;