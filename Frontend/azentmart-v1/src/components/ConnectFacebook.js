import React, { useState } from "react";

export default function ConnectFacebook() {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);

    // 👉 Replace with your backend URL
    window.location.href = "https://your-backend.com/auth/facebook";
  };

  return (
    <div className="fb-connect-page">

      <div className="fb-connect-card">

        {/* LOGO */}
        <div className="fb-logo">
  <svg viewBox="0 0 24 24" width="40" height="40" fill="#1877f2">
    <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H7.9V12h2.6V9.8c0-2.57 1.53-4 3.88-4 1.12 0 2.3.2 2.3.2v2.5h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.88h-2.4v6.99A10 10 0 0 0 22 12z"/>
  </svg>
</div>

        {/* TITLE */}
        <h2>Connect your Facebook Page</h2>

        {/* DESCRIPTION */}
        <p>
          Connect your Facebook Page to automate Messenger replies,
          respond to comments, and capture leads instantly.
        </p>

        {/* FEATURES */}
        <div className="fb-features">
          <div>✅ Auto reply in Messenger</div>
          <div>✅ Reply to post comments</div>
          <div>✅ Capture leads automatically</div>
          <div>✅ Send offers & product info</div>
        </div>

        {/* BUTTON */}
        <button
          className="fb-connect-btn"
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Continue with Facebook"}
        </button>

        {/* NOTE */}
        <p className="fb-note">
          You’ll be redirected to Meta to securely connect your Facebook account.
        </p>

      </div>

    </div>
  );
}