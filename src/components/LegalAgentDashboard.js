import React, { useState } from "react";
import "../Style/LegalAgent.css";

import LegalAgentSidebar from "../components/LegalAgentSidebar";
import LegalAgentResearch from "../components/LegalAgentResearch";

function LegalAgentDashboard() {
  const [activeMenu, setActiveMenu] = useState("Research");

  const renderContent = () => {
    switch (activeMenu) {
      case "Research":
        return <LegalAgentResearch />;

      case "Draft":
        return (
          <div className="legalContentPage">
            <h2>Draft</h2>
            <p>Create and manage legal drafts here.</p>
          </div>
        );

      case "Signatures":
        return (
          <div className="legalContentPage">
            <h2>Signatures</h2>
            <p>Manage digital signatures.</p>
          </div>
        );

      case "Translation":
        return (
          <div className="legalContentPage">
            <h2>Translation</h2>
            <p>Translate legal documents into multiple languages.</p>
          </div>
        );

      case "Matters":
        return (
          <div className="legalContentPage">
            <h2>Matters</h2>
            <p>View and manage your legal matters.</p>
          </div>
        );

      case "Notices":
        return (
          <div className="legalContentPage">
            <h2>Notices</h2>
            <p>Generate and manage legal notices.</p>
          </div>
        );

      case "Tasks":
        return (
          <div className="legalContentPage">
            <h2>Tasks</h2>
            <p>Track all your pending legal tasks.</p>
          </div>
        );

      case "Judgments":
        return (
          <div className="legalContentPage">
            <h2>Judgments</h2>
            <p>Search judgments from Indian courts.</p>
          </div>
        );

      case "Library":
        return (
          <div className="legalContentPage">
            <h2>Library</h2>
            <p>Access legal books, acts, and references.</p>
          </div>
        );

      case "Changelog":
        return (
          <div className="legalContentPage">
            <h2>Changelog</h2>
            <p>Latest updates and new features.</p>
          </div>
        );

      default:
        return <LegalAgentResearch />;
    }
  };

  return (
    <div className="legalAgentDashboard">

      <LegalAgentSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="legalAgentMain">
        {renderContent()}
      </div>

    </div>
  );
}

export default LegalAgentDashboard;