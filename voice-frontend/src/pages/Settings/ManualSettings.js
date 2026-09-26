import React, { useState } from "react";
import { FaSave } from "react-icons/fa";

import "./ManualSettings.css";

function ManualSetting() {
  const [analysis, setAnalysis] = useState(false);

  const [outcome, setOutcome] = useState("");

  const [summary, setSummary] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    alert("Manual settings saved successfully.");
  };

  return (
    <div className="manual-page">
      <div className="settings-page-header">
        <span className="settings-eyebrow">CALL SETTINGS</span>

        <h1>Manual Setting</h1>

        <p>Configure AI analysis for manually placed calls.</p>
      </div>

      <div className="manual-card">
        <form onSubmit={handleSave}>
          <div className="analysis-setting">
            <div>
              <h3>AI Call Analysis</h3>

              <p>
                Generate an AI outcome and summary after eligible recorded
                manual calls. Manual calling remains available when this is off.
              </p>
            </div>

            <button
              type="button"
              className={`toggle ${analysis ? "on" : ""}`}
              onClick={() => setAnalysis(!analysis)}
            >
              <span />
            </button>
          </div>

          <div className="manual-field">
            <label>Call Outcome</label>

            <textarea
              placeholder="Enter call outcome structure..."
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            />
          </div>

          <div className="manual-field">
            <label>Summary</label>

            <textarea
              placeholder="Enter summary structure..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-settings-btn">
            <FaSave />
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManualSetting;
