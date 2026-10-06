import React from "react";
import { Link } from "react-router-dom";
import "../Page.css";

export default function MyAttendance() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My attendance</h1>
          <p>Review your personal attendance history.</p>
        </div>

        <Link className="btn" to="/attendance/regularization">
          Request regularization
        </Link>
      </div>

      <div className="card">
        <h3>This month</h3>
        <div className="grid grid-3">
          <div>
            <span className="muted">Present</span>
            <h2>20 days</h2>
          </div>
          <div>
            <span className="muted">Remote</span>
            <h2>3 days</h2>
          </div>
          <div>
            <span className="muted">Absent</span>
            <h2>0 days</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
