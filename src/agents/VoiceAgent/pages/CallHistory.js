import React, { useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaDownload,
  FaPlay,
  FaPhoneAlt,
  FaRedo,
  FaSearch,
  FaStar,
  FaArrowDown,
  FaArrowUp,
  FaRobot,
  FaTimes,
} from "react-icons/fa";

import "./CallHistory.css";

function CallHistory() {
  const [activeTab, setActiveTab] = useState("Campaigns Logs");

  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState("All Sentiments");
  const [callStatus, setCallStatus] = useState("All Call Status");
  const [type, setType] = useState("All");
  const [dateRange, setDateRange] = useState("");
  const [entries, setEntries] = useState(20);

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [selectedCall, setSelectedCall] = useState(null);

  /*
  ============================================================
  ALL CALL DATA
  ============================================================

  IMPORTANT:

  source determines which tab the call belongs to.

  campaign
  playground
  widget-call
  widget-history
  incoming
  manual
  */

  const allCallData = [
    /*
    ============================================================
    CAMPAIGN CALLS
    ============================================================
    */

    {
      id: 1,
      source: "campaign",

      name: "Bhuvaneshkumar V",
      phone: "+91 80729 61256",

      duration: "01:24",
      durationSeconds: 84,

      cost: 11.2,

      calledAt: "08/21/2026 02:49 PM",

      sentiment: "Neutral",
      status: "Completed",

      outcome: "Call Outcome",
    },

    {
      id: 2,
      source: "campaign",

      name: "Bhuvaneshkumar V",
      phone: "+91 80729 61256",

      duration: "00:46",
      durationSeconds: 46,

      cost: 6.13,

      calledAt: "08/21/2026 02:45 PM",

      sentiment: "Neutral",
      status: "Completed",

      outcome: "Call Outcome",
    },

    /*
    ============================================================
    PLAYGROUND CALLS
    ============================================================
    */

    {
      id: 3,
      source: "playground",

      name: "Bhuvaneshkumar V",
      phone: "+91 80729 61256",

      duration: "00:58",
      durationSeconds: 58,

      cost: 7.85,

      calledAt: "08/21/2026 03:15 PM",

      sentiment: "Positive",
      status: "Completed",

      outcome: "Call Outcome",
    },

    {
      id: 4,
      source: "playground",

      name: "Test Customer",
      phone: "+91 98765 43210",

      duration: "00:32",
      durationSeconds: 32,

      cost: 4.26,

      calledAt: "08/21/2026 03:10 PM",

      sentiment: "Neutral",
      status: "Completed",

      outcome: "Call Outcome",
    },

    /*
    ============================================================
    WIDGET CALLS
    ============================================================
    */

    {
      id: 5,
      source: "widget-call",

      name: "Website Visitor",
      phone: "+91 90000 12345",

      duration: "02:12",
      durationSeconds: 132,

      cost: 16.42,

      calledAt: "08/21/2026 04:05 PM",

      sentiment: "Positive",
      status: "Completed",

      outcome: "Call Outcome",
    },

    /*
    ============================================================
    WIDGET HISTORY
    ============================================================
    */

    {
      id: 6,
      source: "widget-history",

      name: "Website Visitor",
      phone: "+91 90000 54321",

      duration: "03:08",
      durationSeconds: 188,

      cost: 22.16,

      calledAt: "08/21/2026 04:20 PM",

      sentiment: "Neutral",
      status: "Completed",

      outcome: "Conversation",
    },

    /*
    ============================================================
    INCOMING CALLS
    ============================================================
    */

    {
      id: 7,
      source: "incoming",

      name: "Incoming Caller",
      phone: "+91 97890 11111",

      duration: "01:42",
      durationSeconds: 102,

      cost: 12.75,

      calledAt: "08/21/2026 05:05 PM",

      sentiment: "Positive",
      status: "Completed",

      outcome: "Call Outcome",
    },

    /*
    ============================================================
    MANUAL CALLS
    ============================================================
    */

    {
      id: 8,
      source: "manual",

      name: "Manual Customer",
      phone: "+91 98888 22222",

      duration: "00:51",
      durationSeconds: 51,

      cost: 6.82,

      calledAt: "08/21/2026 05:30 PM",

      sentiment: "Neutral",
      status: "Completed",

      outcome: "Call Outcome",
    },
  ];

  /*
  ============================================================
  TAB CONFIGURATION
  ============================================================
  */

  const tabs = [
    {
      label: "Campaigns Logs",
      source: "campaign",
    },
    {
      label: "Playground Logs",
      source: "playground",
    },
    {
      label: "Widget Call Logs",
      source: "widget-call",
    },
    {
      label: "Widget History",
      source: "widget-history",
    },
    {
      label: "Incoming Call Logs",
      source: "incoming",
    },
    {
      label: "Manual Call Logs",
      source: "manual",
    },
  ];

  /*
  ============================================================
  CURRENT TAB
  ============================================================
  */

  const currentTab = tabs.find((tab) => tab.label === activeTab);

  /*
  ============================================================
  TAB-SPECIFIC DATA
  ============================================================
  */

  const currentTabCalls = useMemo(() => {
    if (!currentTab) {
      return [];
    }

    return allCallData.filter((call) => call.source === currentTab.source);
  }, [currentTab]);

  /*
  ============================================================
  FILTER DATA
  ============================================================
  */

  const filteredCalls = useMemo(() => {
    let data = [...currentTabCalls];

    /*
    SEARCH
    */

    if (search.trim()) {
      const query = search.toLowerCase();

      data = data.filter(
        (call) =>
          call.name.toLowerCase().includes(query) ||
          call.phone.toLowerCase().includes(query),
      );
    }

    /*
    SENTIMENT
    */

    if (sentiment !== "All Sentiments") {
      data = data.filter((call) => call.sentiment === sentiment);
    }

    /*
    CALL STATUS
    */

    if (callStatus !== "All Call Status") {
      data = data.filter((call) => call.status === callStatus);
    }

    /*
    CALL TYPE
    */

    if (type !== "All") {
      if (type === "Inbound") {
        data = data.filter((call) => call.source === "incoming");
      }

      if (type === "Outbound") {
        data = data.filter((call) => call.source !== "incoming");
      }
    }

    /*
    SORT
    */

    if (sortField) {
      data.sort((a, b) => {
        let first = a[sortField];
        let second = b[sortField];

        if (typeof first === "string") {
          first = first.toLowerCase();
          second = second.toLowerCase();
        }

        if (first < second) {
          return sortDirection === "asc" ? -1 : 1;
        }

        if (first > second) {
          return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return data.slice(0, entries);
  }, [
    currentTabCalls,
    search,
    sentiment,
    callStatus,
    type,
    entries,
    sortField,
    sortDirection,
  ]);

  /*
  ============================================================
  SORT
  ============================================================
  */

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  /*
  ============================================================
  SORT ICON
  ============================================================
  */

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <span className="sort-neutral">↕</span>;
    }

    return sortDirection === "asc" ? (
      <FaArrowUp className="sort-active" />
    ) : (
      <FaArrowDown className="sort-active" />
    );
  };

  /*
  ============================================================
  RESET FILTERS
  ============================================================
  */

  const resetFilters = () => {
    setSearch("");
    setSentiment("All Sentiments");
    setCallStatus("All Call Status");
    setType("All");
    setDateRange("");
    setSortField(null);
    setSortDirection("asc");
  };

  /*
  ============================================================
  TAB CHANGE
  ============================================================
  */

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    resetFilters();
  };

  /*
  ============================================================
  TAB EMPTY MESSAGE
  ============================================================
  */

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "Campaigns Logs":
        return "No campaign call logs found.";

      case "Playground Logs":
        return "No playground calls yet.";

      case "Widget Call Logs":
        return "No widget calls yet.";

      case "Widget History":
        return "No widget conversations found.";

      case "Incoming Call Logs":
        return "No incoming calls found.";

      case "Manual Call Logs":
        return "No manual call logs found.";

      default:
        return "No call logs found.";
    }
  };

  /*
  ============================================================
  EXPORT
  ============================================================
  */

  const exportCSV = () => {
    if (!filteredCalls.length) {
      alert("There are no call records to export.");
      return;
    }

    const headers = [
      "Name",
      "Phone Number",
      "Duration",
      "Cost",
      "Called At",
      "Sentiment",
      "Call Status",
    ];

    const rows = filteredCalls.map((call) => [
      call.name,
      call.phone,
      call.duration,
      call.cost,
      call.calledAt,
      call.sentiment,
      call.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((value) => `"${value}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${activeTab.replace(/\s+/g, "-").toLowerCase()}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  /*
  ============================================================
  UI
  ============================================================
  */

  return (
    <div className="call-history-page">
      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="call-history-header">
        <div className="call-history-title-row">
          <div className="call-history-icon">
            <FaPhoneAlt />
          </div>

          <div>
            <h1>Call History</h1>

            <p>View and manage your voice call activity</p>
          </div>
        </div>

        <div className="call-history-header-actions">
          <button className="history-outline-btn" onClick={exportCSV}>
            <FaDownload />
            Export CSV
          </button>

          <button
            className="history-refresh-btn"
            onClick={() => window.location.reload()}
          >
            <FaRedo />
            Refresh
          </button>
        </div>
      </div>

      {/* ====================================================
          TABS
      ==================================================== */}

      <div className="call-history-tabs-wrapper">
        <div className="call-history-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              className={`call-history-tab ${
                activeTab === tab.label ? "active" : ""
              }`}
              onClick={() => handleTabChange(tab.label)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ====================================================
          FILTER BAR
      ==================================================== */}

      <div className="call-history-filter-card">
        <div className="history-date-field">
          <FaCalendarAlt />

          <input
            type="text"
            placeholder="YYYY-MM-DD - YYYY-MM-DD"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />
        </div>

        <div className="history-select">
          <select
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
          >
            <option>All Sentiments</option>

            <option>Positive</option>

            <option>Neutral</option>

            <option>Negative</option>
          </select>
        </div>

        <div className="history-select">
          <select
            value={callStatus}
            onChange={(e) => setCallStatus(e.target.value)}
          >
            <option>All Call Status</option>

            <option>Completed</option>

            <option>Failed</option>

            <option>Busy</option>

            <option>No Answer</option>
          </select>
        </div>

        <div className="history-select small">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>All</option>
            <option>Inbound</option>
            <option>Outbound</option>
          </select>
        </div>

        <button className="history-export-btn" onClick={exportCSV}>
          <FaDownload />
          Export CSV
        </button>
      </div>

      {/* ====================================================
          SEARCH
      ==================================================== */}

      <div className="call-history-search-row">
        <div className="history-search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="history-result-count">
          {filteredCalls.length} {filteredCalls.length === 1 ? "call" : "calls"}
        </div>
      </div>

      {/* ====================================================
          TABLE
      ==================================================== */}

      <div className="call-history-table-card">
        <div className="call-history-table-scroll">
          <table className="call-history-table">
            <thead>
              <tr>
                <th className="star-column"></th>

                <th onClick={() => handleSort("name")}>
                  <span>
                    Name
                    <SortIcon field="name" />
                  </span>
                </th>

                <th onClick={() => handleSort("phone")}>
                  <span>
                    Phone Number
                    <SortIcon field="phone" />
                  </span>
                </th>

                <th onClick={() => handleSort("durationSeconds")}>
                  <span>
                    Duration
                    <SortIcon field="durationSeconds" />
                  </span>
                </th>

                <th onClick={() => handleSort("cost")}>
                  <span>
                    Cost
                    <SortIcon field="cost" />
                  </span>
                </th>

                <th>Recording</th>

                <th onClick={() => handleSort("calledAt")}>
                  <span>
                    Called At
                    <SortIcon field="calledAt" />
                  </span>
                </th>

                <th>Sentiments</th>

                <th>Call Status</th>

                <th>Actions</th>

                <th>Call Outcome</th>
              </tr>
            </thead>

            <tbody>
              {filteredCalls.length > 0 ? (
                filteredCalls.map((call) => (
                  <tr key={call.id}>
                    <td className="star-column">
                      <button className="star-btn">
                        <FaStar />
                      </button>
                    </td>

                    <td>
                      <button
                        className="contact-name"
                        onClick={() => setSelectedCall(call)}
                      >
                        {call.name}
                      </button>
                    </td>

                    <td>
                      <div className="phone-cell">
                        <span>{call.phone}</span>

                        <FaPhoneAlt />
                      </div>
                    </td>

                    <td>{call.duration}</td>

                    <td className="cost-cell">₹{call.cost.toFixed(2)}</td>

                    <td>
                      <div className="recording-player">
                        <button
                          className="recording-play"
                          onClick={() => setSelectedCall(call)}
                        >
                          <FaPlay />
                        </button>

                        <div className="recording-wave">
                          {Array.from({ length: 12 }).map((_, index) => (
                            <span key={index}></span>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="called-at">{call.calledAt}</td>

                    <td>
                      <span
                        className={`sentiment-badge ${call.sentiment.toLowerCase()}`}
                      >
                        {call.sentiment}
                      </span>
                    </td>

                    <td>
                      <span className="status-badge">{call.status}</span>
                    </td>

                    <td>
                      <span className="action-placeholder">—</span>
                    </td>

                    <td>
                      <button
                        className="outcome-btn"
                        onClick={() => setSelectedCall(call)}
                      >
                        {call.outcome}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11">
                    <div className="history-empty-state">
                      <div className="empty-icon">
                        <FaRobot />
                      </div>

                      <h3>{getEmptyMessage()}</h3>

                      <p>
                        Call activity for <strong>{activeTab}</strong> will
                        appear here once available.
                      </p>

                      <button
                        className="empty-reset-btn"
                        onClick={resetFilters}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="call-history-footer">
          <select
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
          >
            <option value={10}>10 entries</option>

            <option value={20}>20 entries</option>

            <option value={50}>50 entries</option>

            <option value={100}>100 entries</option>
          </select>

          <span>
            Showing {filteredCalls.length} of {currentTabCalls.length}
          </span>
        </div>
      </div>

      {/* ====================================================
          DETAILS MODAL
      ==================================================== */}

      {selectedCall && (
        <div
          className="call-details-overlay"
          onClick={() => setSelectedCall(null)}
        >
          <div
            className="call-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="call-details-header">
              <div>
                <span>CALL DETAILS</span>

                <h2>{selectedCall.name}</h2>
              </div>

              <button onClick={() => setSelectedCall(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="call-details-content">
              <div className="detail-item">
                <label>Call Source</label>

                <strong>
                  {
                    tabs.find((tab) => tab.source === selectedCall.source)
                      ?.label
                  }
                </strong>
              </div>

              <div className="detail-item">
                <label>Phone Number</label>

                <strong>{selectedCall.phone}</strong>
              </div>

              <div className="detail-item">
                <label>Duration</label>

                <strong>{selectedCall.duration}</strong>
              </div>

              <div className="detail-item">
                <label>Cost</label>

                <strong>₹{selectedCall.cost.toFixed(2)}</strong>
              </div>

              <div className="detail-item">
                <label>Called At</label>

                <strong>{selectedCall.calledAt}</strong>
              </div>

              <div className="detail-item">
                <label>Sentiment</label>

                <strong>{selectedCall.sentiment}</strong>
              </div>

              <div className="detail-item">
                <label>Call Status</label>

                <strong>{selectedCall.status}</strong>
              </div>
            </div>

            <div className="call-details-footer">
              <button onClick={() => setSelectedCall(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CallHistory;
