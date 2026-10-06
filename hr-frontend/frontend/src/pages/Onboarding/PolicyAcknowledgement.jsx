import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import "../Page.css";

const policies = [
  "Code of conduct",
  "Information security",
  "Leave and attendance policy",
  "Remote work policy"
];

export default function PolicyAcknowledgement() {
  const [acknowledged, setAcknowledged] = useState([]);

  const toggle = (policy) => {
    setAcknowledged((current) =>
      current.includes(policy)
        ? current.filter((item) => item !== policy)
        : [...current, policy]
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Policy acknowledgement</h1>
          <p>Review and acknowledge onboarding policies.</p>
        </div>
      </div>

      <div className="card">
        {policies.map((policy) => {
          const checked = acknowledged.includes(policy);

          return (
            <button
              key={policy}
              className="nav-link"
              onClick={() => toggle(policy)}
              style={{
                minHeight: "58px",
                borderBottom: "1px solid #eef0f4"
              }}
            >
              <CheckCircle2 color={checked ? "#12b76a" : "#98a2b3"} />
              <span>{policy}</span>
              <span style={{ marginLeft: "auto" }}>
                {checked ? "Acknowledged" : "Acknowledge"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
