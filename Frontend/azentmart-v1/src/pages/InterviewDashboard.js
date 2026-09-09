import React, { useState } from "react";

import YourAIDashboardSidebar from "../components/InterviewDashboard/YourAIDashboardSidebar";
import YourAIInterviewSessions from "../components/InterviewDashboard/YourAIInterviewSessions ";
import YourAIResume from "../components/InterviewDashboard/YourAIResume";


const InterviewDashboard = () => {

  const [activePage, setActivePage] = useState("sessions");

  return (

    <div className="dashboard-layout">

      <YourAIDashboardSidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="dashboard-content">

        {activePage === "sessions" && (
          <YourAIInterviewSessions />
        )}

       {activePage === "resume" && <YourAIResume />}

        {activePage === "documents" && (
          <h2 style={{ padding: "40px" }}>
            Documents
          </h2>
        )}

        {activePage === "tutorials" && (
          <h2 style={{ padding: "40px" }}>
            Tutorials
          </h2>
        )}

        {activePage === "support" && (
          <h2 style={{ padding: "40px" }}>
            Support Chat
          </h2>
        )}

      </div>

    </div>

  );

};

export default InterviewDashboard;