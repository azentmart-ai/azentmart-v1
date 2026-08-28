import React, { useState } from "react";
import { FaCalendarAlt, FaDownload } from "react-icons/fa";

function CallLogsPage() {

  const [activeTab, setActiveTab] = useState("campaign");

  const logs = []; // backend will provide later

  return (

    <div className="calllogs-page">

      {/* TABS */}

      <div className="calllogs-tabs">

        <button
          className={activeTab === "campaign" ? "active-tab" : ""}
          onClick={() => setActiveTab("campaign")}
        >
          Campaigns Logs
        </button>

        <button
          className={activeTab === "playground" ? "active-tab" : ""}
          onClick={() => setActiveTab("playground")}
        >
          Playground Logs
        </button>

        <button
          className={activeTab === "incoming" ? "active-tab" : ""}
          onClick={() => setActiveTab("incoming")}
        >
          Incoming Call Logs
        </button>

      </div>


      {/* FILTER BAR */}

      <div className="calllogs-filters">

        <div className="date-filter">

          <input
            type="text"
            placeholder="YYYY-MM-DD - YYYY-MM-DD"
          />

          <FaCalendarAlt />

        </div>

        <select>
          <option>All Sentiments</option>
        </select>

        <select>
          <option>All Call Status</option>
        </select>

        <select>
          <option>All</option>
        </select>

        <button className="export-btn">

          <FaDownload />

          Export CSV

        </button>

      </div>


      {/* LOGS CONTAINER */}

      <div className="calllogs-container">

        {logs.length === 0 && (

          <div className="calllogs-empty">

            <div className="empty-icon">
              📇
            </div>

            <h3>No Call Logs</h3>

          </div>

        )}

      </div>

    </div>

  );

}

export default CallLogsPage;