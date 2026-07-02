import React, { useState } from "react";
import WhatsAppSidebar from "../components/WhatsAppSidebar";
import WAAnalytics from "../components/WAAnalytics";

const WhatsappDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <WAAnalytics />;

      case "inbox":
        return <h1>Inbox Page</h1>;

      case "chat":
        return <h1>AI Chat Page</h1>;

      case "campaigns":
        return <h1>Campaigns Page</h1>;

      case "broadcast":
        return <h1>Broadcast Page</h1>;

      default:
        return <WAAnalytics />;
    }
  };

  return (
    <div className="layout-container">

      {/* SIDEBAR */}
      <WhatsAppSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* CONTENT */}
      <div className="layout-content">
        {renderContent()}
      </div>

    </div>
  );
};

export default WhatsappDashboard;