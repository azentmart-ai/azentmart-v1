import React from "react";
import { FileText, Upload } from "lucide-react";
import "../Page.css";

const requiredDocuments = [
  "Government identity proof",
  "Address proof",
  "Bank account details",
  "Education certificates",
  "Previous employment documents"
];

export default function Documents() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Onboarding documents</h1>
          <p>Track documents required for new employees.</p>
        </div>
      </div>

      <div className="resource-grid">
        {requiredDocuments.map((document) => (
          <div className="resource-card" key={document}>
            <FileText color="#155eef" />
            <h3>{document}</h3>
            <p>Required for onboarding verification.</p>
            <button className="btn">
              <Upload size={15} />
              Upload
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
