import React from "react";
import {
  FiPlus,
  FiSearch,
  FiGrid,
  FiList,
} from "react-icons/fi";

const YourAIInterviewSessions = () => {
  return (
    <div className="yourai-sessions-page">

      {/* Header */}

      <div className="yourai-session-header">

        <div>

          <h2>Interview Sessions</h2>

          <p>
            Prepare for interviews and review your previous AI interview
            sessions.
          </p>

        </div>

        <button className="yourai-create-session-btn">

          <FiPlus />

          <span>Create Session</span>

        </button>

      </div>

      {/* Tabs */}

      <div className="yourai-session-tabs">

        <div className="yourai-tabs-left">

          <button className="active">
            All
          </button>

          <button>
            Active
          </button>

          <button>
            Ended
          </button>

        </div>

        <span className="yourai-total-sessions">

          0 Sessions

        </span>

      </div>

      {/* Search */}

      <div className="yourai-session-toolbar">

        <div className="yourai-search-box">

          <FiSearch />

          <input
            type="text"
            placeholder="Search by title or description"
          />

        </div>

        <button className="yourai-sort-btn">

          ⇅

        </button>

        <div className="yourai-view-buttons">

          <button className="active">

            <FiGrid />

          </button>

          <button>

            <FiList />

          </button>

        </div>

      </div>

      {/* Empty State */}

      <div className="yourai-empty-state">

        <h2>

          You have no upcoming sessions

        </h2>

        <p>

          Your upcoming interview sessions will appear here once you create
          one.

        </p>

        <button className="yourai-create-session-btn">

          <FiPlus />

          <span>Create Session</span>

        </button>

      </div>

    </div>
  );
};

export default YourAIInterviewSessions;