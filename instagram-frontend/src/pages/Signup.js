import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        /*
         * IMPORTANT:
         * After creating the account, do NOT go directly
         * to the Instagram dashboard.
         *
         * Sign the user out and send them to the Sign In page.
         * They must login using the credentials they just created.
         */
        await supabase.auth.signOut();

        navigate("/instagram-signin");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to create account. Please try again.");
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

        <h1>Create Account</h1>

        <p className="instagram-auth-subtitle">
          Create your Instagram AI Agent account
        </p>

        {error && (
          <div className="instagram-auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="instagram-auth-field">
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="instagram-auth-field">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="instagram-auth-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="instagram-auth-footer">
          Already have an account?{" "}
          <Link to="/instagram-signin">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;