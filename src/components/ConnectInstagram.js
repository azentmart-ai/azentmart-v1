import React, { useState } from "react";

export default function ConnectInstagram() {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);

    // 👉 Replace this with your backend URL
    window.location.href = "https://your-backend.com/auth/instagram";
  };

  return (
    <div className="insta-connect-page">

      <div className="insta-connect-card">

        {/* LOGO */}
        <div className="insta-logo">
  <svg viewBox="0 0 24 24" width="40" height="40">
    <defs>
      <linearGradient id="instaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f58529"/>
        <stop offset="30%" stopColor="#dd2a7b"/>
        <stop offset="60%" stopColor="#8134af"/>
        <stop offset="100%" stopColor="#515bd4"/>
      </linearGradient>
    </defs>
    <path
      fill="url(#instaGradient)"
      d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5c2.07 0 3.75 1.68 3.75 3.75v8.5c0 2.07-1.68 3.75-3.75 3.75h-8.5C5.68 20 4 18.32 4 16.25v-8.5C4 5.68 5.68 4 7.75 4zm8.75 1.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
    />
  </svg>
</div>

        {/* TITLE */}
        <h2>Connect your Instagram account</h2>

        {/* DESCRIPTION */}
        <p>
          Connect your Instagram Business account to start automating replies,
          capturing leads, and engaging your audience instantly.
        </p>

        {/* FEATURES */}
        <div className="insta-features">
          <div>✅ Auto reply to DMs</div>
          <div>✅ Reply to comments</div>
          <div>✅ Capture leads</div>
          <div>✅ Recommend products</div>
        </div>

        {/* BUTTON */}
        <button
          className="insta-connect-btn"
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Continue with Instagram"}
        </button>

        {/* NOTE */}
        <p className="insta-note">
          You’ll be redirected to Meta (Facebook) to securely connect your account.
        </p>

      </div>

    </div>
  );
}