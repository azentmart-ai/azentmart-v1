import React, { useEffect, useState } from "react";
import { Sparkles, ArrowUpRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import "./AIShortlisted.css";
export default function AIShortlisted() {
  const [rows, setRows] = useState([]),
    [min, setMin] = useState(70);
  useEffect(() => {
    api
      .pipeline()
      .then((x) =>
        setRows(
          x.filter((a) => a.score != null).sort((a, b) => b.score - a.score),
        ),
      );
  }, []);
  const data = rows.filter((x) => x.score >= min);
  return (
    <div className="workflow-page">
      <div className="workflow-header">
        <div>
          <h1>AI Shortlisted</h1>
          <p>
            Live candidates with strong job-matching signals. Talent Pool
            content has been removed from this workflow.
          </p>
        </div>
        <span className="badge blue">
          <Sparkles size={12} /> AI ranked
        </span>
      </div>
      <div className="workflow-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Filter size={15} />
          <label>Minimum AI match</label>
          <input
            type="range"
            min="0"
            max="100"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
          />
          <strong>{min}%</strong>
        </div>
      </div>
      <div className="workflow-grid three" style={{ marginTop: 18 }}>
        {data.map((c) => (
          <div className="workflow-card short-card" key={c.id}>
            <div className="short-top">
              <div className="workflow-icon">
                <Sparkles size={16} />
              </div>
              <strong>{Math.round(c.score)}%</strong>
            </div>
            <h3>{c.candidate_name}</h3>
            <p>
              {c.job_title} · {c.stage.replace("_", " ")}
            </p>
            <div>
              {(c.skills || []).map((s) => (
                <span className="workflow-chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="workflow-progress">
              <span style={{ width: c.score + "%" }} />
            </div>
            <Link
              className="btn"
              style={{ marginTop: 15 }}
              to={`/candidates/${c.candidate_id}`}
            >
              Review profile <ArrowUpRight size={13} />
            </Link>
          </div>
        ))}
        {!data.length && (
          <div className="workflow-card">
            <div className="workflow-empty">
              <strong>No candidates meet the current threshold</strong>Run
              Candidate Matching from a saved job to generate AI shortlist
              signals.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
