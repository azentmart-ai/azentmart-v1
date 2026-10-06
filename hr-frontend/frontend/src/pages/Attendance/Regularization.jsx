import React, { useState } from "react";
import { attendanceService } from "../../services/attendanceService";
import "../Page.css";

export default function Regularization() {
  const [form, setForm] = useState({
    date: "",
    reason: ""
  });
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    const result = await attendanceService.regularize(form);
    setMessage(result.message);
  };

  return (
    <div className="page page-section">
      <div className="page-header">
        <div>
          <h1>Attendance regularization</h1>
          <p>Submit a correction request for an attendance record.</p>
        </div>
      </div>

      <div className="card">
        {message ? <div className="auth-success">{message}</div> : null}

        <form className="form-grid" onSubmit={submit}>
          <div className="form-group">
            <label>Date</label>
            <input
              className="input"
              type="date"
              required
              value={form.date}
              onChange={(event) =>
                setForm({
                  ...form,
                  date: event.target.value
                })
              }
            />
          </div>

          <div className="form-group full">
            <label>Reason</label>
            <textarea
              className="textarea"
              required
              value={form.reason}
              onChange={(event) =>
                setForm({
                  ...form,
                  reason: event.target.value
                })
              }
            />
          </div>

          <button className="btn btn-primary">
            Submit request
          </button>
        </form>
      </div>
    </div>
  );
}
