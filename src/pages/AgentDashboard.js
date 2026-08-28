import React, { useState } from "react";

import AgentSidebar from "../components/AgentSidebar";
import AgentDashboardContent from "../components/AgentDashboardContent";
import AssistantsPage from "../components/AssistantsPage";
import PlaygroundPage from "../components/PlaygroundPage";
import CampaignsPage from "../components/CampaignsPage";
import ContactsPage from "../components/ContactsPage";
import SegmentsPage from "../components/SegmentsPage";
import CallLogsPage from "../components/CallLogsPage";
import KnowledgeBasePage from "../components/KnowledgeBasePage";





function AgentDashboard() {

  const [activeTab, setActiveTab] = useState("dashboard");

  return (

    <div className="agent-dashboard-layout">

      <AgentSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="agent-dashboard-main">

        {activeTab === "dashboard" && <AgentDashboardContent />}
        {activeTab === "assistants" && <AssistantsPage />}
        {activeTab === "playground" && <PlaygroundPage />}
        {activeTab === "campaigns" && <CampaignsPage />}
        {activeTab === "contacts" && <ContactsPage />}
        {activeTab === "segments" && <SegmentsPage />}
        {activeTab === "logs" && <CallLogsPage />}
        {activeTab === "knowledge" && <KnowledgeBasePage />}






      </div>

    </div>

  );

}

export default AgentDashboard;