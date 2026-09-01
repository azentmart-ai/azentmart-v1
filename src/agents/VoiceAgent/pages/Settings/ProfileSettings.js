import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSettings.css";

function ProfileSettings() {
  const navigate = useNavigate();

  const API_URL = "http://127.0.0.1:8000";

  // =========================================================
  // STATE
  // =========================================================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [timeZone, setTimeZone] = useState("India Standard Time (IST)");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/agents/voice/login", {
            replace: true,
          });
          return;
        }

        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        let data = {};

        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Unable to read profile response:", jsonError);
        }

        console.log("Profile status:", response.status);

        console.log("Profile response:", data);

        // =====================================================
        // AUTH ERROR
        // =====================================================

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("isLoggedIn");

          navigate("/agents/voice/login", {
            replace: true,
          });

          return;
        }

        // =====================================================
        // OTHER BACKEND ERRORS
        // =====================================================

        if (!response.ok) {
          throw new Error(data.detail || "Unable to load profile.");
        }

        // =====================================================
        // LOAD USER INFORMATION
        // =====================================================

        setFirstName(data.first_name || "");

        setLastName(data.last_name || "");

        setEmail(data.email || "");

        // =====================================================
        // LOAD OPTIONAL LOCAL PROFILE DATA
        // =====================================================

        let savedProfile = {};

        try {
          savedProfile = JSON.parse(
            localStorage.getItem("profileSettings") || "{}",
          );
        } catch (storageError) {
          console.error("Unable to read saved profile:", storageError);
        }

        setPhone(savedProfile.phone || "");

        setLocation(savedProfile.location || "");

        setTimeZone(savedProfile.timeZone || "India Standard Time (IST)");

        // =====================================================
        // SYNC LOCAL STORAGE
        // =====================================================

        if (data.email) {
          localStorage.setItem("userEmail", data.email);
        }

        const fullName = `${data.first_name || ""} ${
          data.last_name || ""
        }`.trim();

        if (fullName) {
          localStorage.setItem("userName", fullName);

          localStorage.setItem("azentmart_user_name", fullName);
        }
      } catch (err) {
        console.error("Profile loading error:", err);

        if (err.message?.includes("Failed to fetch")) {
          setError(
            "Cannot connect to the backend. Make sure FastAPI is running.",
          );
        } else {
          setError(err.message || "Unable to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSaving(true);

      // ======================================================
      // GET TOKEN
      // ======================================================

      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/agents/voice/login", {
          replace: true,
        });

        return;
      }

      // ======================================================
      // UPDATE PROFILE IN POSTGRESQL
      // ======================================================

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          first_name: firstName.trim(),

          last_name: lastName.trim(),

          email: email.trim().toLowerCase(),
        }),
      });

      // ======================================================
      // READ RESPONSE
      // ======================================================

      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Unable to read update response:", jsonError);
      }

      console.log("Profile update status:", response.status);

      console.log("Profile update response:", data);

      // ======================================================
      // AUTH ERROR
      // ======================================================

      if (response.status === 401) {
        localStorage.removeItem("access_token");

        localStorage.removeItem("isLoggedIn");

        navigate("/agents/voice/login", {
          replace: true,
        });

        return;
      }

      // ======================================================
      // OTHER BACKEND ERRORS
      // ======================================================

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update profile.");
      }

      // ======================================================
      // UPDATED NAME / EMAIL
      // ======================================================

      const updatedName = `${firstName.trim()} ${lastName.trim()}`.trim();

      const updatedEmail = email.trim().toLowerCase();

      // ======================================================
      // UPDATE LOCAL STORAGE
      // ======================================================

      localStorage.setItem("userName", updatedName);

      localStorage.setItem("userEmail", updatedEmail);

      localStorage.setItem("azentmart_user_name", updatedName);

      localStorage.setItem("azentmart_signup_email", updatedEmail);

      // ======================================================
      // SAVE OPTIONAL PROFILE DATA
      // ======================================================

      const profileData = {
        firstName: firstName.trim(),

        lastName: lastName.trim(),

        email: updatedEmail,

        phone: phone.trim(),

        location: location.trim(),

        timeZone,
      };

      localStorage.setItem("profileSettings", JSON.stringify(profileData));

      // ======================================================
      // TELL DASHBOARD TO UPDATE
      // ======================================================

      window.dispatchEvent(new Event("profileUpdated"));

      // ======================================================
      // SUCCESS
      // ======================================================

      setSuccess("Profile updated successfully.");

      // ======================================================
      // RETURN TO DASHBOARD
      // ======================================================

      setTimeout(() => {
        navigate("/agents/voice/dashboard", {
          replace: true,
        });
      }, 500);
    } catch (err) {
      console.error("Profile update error:", err);

      if (err.message?.includes("Failed to fetch")) {
        setError(
          "Cannot connect to the backend. Make sure FastAPI is running.",
        );
      } else {
        setError(err.message || "Unable to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-heading">
          <span className="profile-eyebrow">ACCOUNT SETTINGS</span>

          <h1>Profile Settings</h1>

          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PROFILE PAGE
  // =========================================================

  return (
    <div className="profile-page">
      {/* =====================================================
          PAGE HEADING
      ===================================================== */}

      <div className="profile-heading">
        <span className="profile-eyebrow">ACCOUNT SETTINGS</span>

        <h1>Profile Settings</h1>

        <p>Manage your personal information and account preferences.</p>

        <button
          type="button"
          className="back-dashboard"
          onClick={() => navigate("/agents/voice/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      {/* =====================================================
          SETTINGS TABS
      ===================================================== */}

      <div className="settings-tabs">
        <button type="button" className="settings-tab active">
          Profile Settings
        </button>

        <button
          type="button"
          className="settings-tab"
          onClick={() => navigate("/agents/voice/dashboard/settings/password")}
        >
          Set Password
        </button>

        <button
          type="button"
          className="settings-tab"
          onClick={() => navigate("/agents/voice/dashboard/settings/teams")}
        >
          Teams
        </button>

        <button
          type="button"
          className="settings-tab"
          onClick={() => navigate("/agents/voice/dashboard/settings/block-list")}
        >
          Block List
        </button>

        <button
          type="button"
          className="settings-tab"
          onClick={() => navigate("/agents/voice/dashboard/settings/manual-setting")}
        >
          Manual Setting
        </button>
      </div>

      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <div className="profile-card">
        {/* ===================================================
            AVATAR
        =================================================== */}

        <div className="profile-avatar-area">
          <div className="profile-avatar">
            {firstName ? firstName.charAt(0).toUpperCase() : "U"}
          </div>

          <button
            type="button"
            className="avatar-edit"
            title="Edit profile image"
          >
            ✎
          </button>
        </div>

        {/* ===================================================
            SUCCESS MESSAGE
        =================================================== */}

        {success && <div className="profile-success">{success}</div>}

        {/* ===================================================
            ERROR MESSAGE
        =================================================== */}

        {error && <div className="auth-error">{error}</div>}

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSave}>
          {/* =================================================
              FIRST NAME + LAST NAME
          ================================================= */}

          <div className="profile-two-column">
            <div className="profile-field">
              <label>First Name *</label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);

                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter first name"
                autoComplete="given-name"
                required
                disabled={saving}
              />
            </div>

            <div className="profile-field">
              <label>Last Name *</label>

              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);

                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter last name"
                autoComplete="family-name"
                required
                disabled={saving}
              />
            </div>
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="profile-field">
            <label>Email Address *</label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                setError("");
                setSuccess("");
              }}
              placeholder="Enter email address"
              autoComplete="email"
              required
              disabled={saving}
            />
          </div>

          {/* =================================================
              PHONE
          ================================================= */}

          <div className="profile-field">
            <label>Phone Number</label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              autoComplete="tel"
              disabled={saving}
            />
          </div>

          {/* =================================================
              LOCATION
          ================================================= */}

          <div className="profile-field">
            <label>Location</label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              disabled={saving}
            />
          </div>

          {/* =================================================
              TIME ZONE
          ================================================= */}

          <div className="profile-field">
            <label>Time Zone</label>

            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              disabled={saving}
            >
              <option>India Standard Time (IST)</option>

              <option>Gulf Standard Time (GST)</option>

              <option>Coordinated Universal Time (UTC)</option>

              <option>Eastern Standard Time (EST)</option>

              <option>Pacific Standard Time (PST)</option>
            </select>
          </div>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          <button type="submit" className="save-profile" disabled={saving}>
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;
