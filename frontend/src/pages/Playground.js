import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaStar,
  FaPhone,
  FaSyncAlt,
  FaTimes,
  FaChevronDown,
  FaExclamationTriangle,
  FaSave,
  FaPlay,
  FaCheck,
} from "react-icons/fa";

import "./Playground.css";

function Playground() {
  /* =========================================================
     STATE
  ========================================================= */

  const [showCreate, setShowCreate] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);

  const [selectedPlayground, setSelectedPlayground] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [entries, setEntries] = useState(20);

  const [filters, setFilters] = useState({
    sentiment: "All Sentiments",
    status: "All Call Status",
    period: "All",
  });

  const [form, setForm] = useState({
    firstName: "BHUVANESHKUMAR",
    lastName: "V",
    email: "vbhuvanesh14@gmail.com",
    description: "",
    phone: "+91 80729 61256",
    extension: "",
    assistant: "",
    dialer: "Default Dialer",
  });

  const [outcome, setOutcome] = useState({
    result: "",
    notes: "",
  });

  const [playgrounds, setPlaygrounds] = useState([
    {
      id: 1,
      name: "BHUVANESHKUMAR V",
      phone: "+91 80729 61256",
      duration: "01:24",
      cost: "₹11.20",
      calledAt: "08/21/2026 02:49 PM",
      sentiment: "Neutral",
      status: "Completed",
      favorite: false,
      outcome: "",
      notes: "",
    },
    {
      id: 2,
      name: "BHUVANESHKUMAR V",
      phone: "+91 80729 61256",
      duration: "00:46",
      cost: "₹6.13",
      calledAt: "08/21/2026 02:45 PM",
      sentiment: "Neutral",
      status: "Completed",
      favorite: false,
      outcome: "",
      notes: "",
    },
  ]);

  /* =========================================================
     ASSISTANTS
  ========================================================= */

  const assistants = [
    "Admission Support",
    "Customer Support",
    "Lead Qualification",
    "AI Receptionist",
    "Billing Support",
    "Technical Support",
  ];

  /* =========================================================
     OUTCOME OPTIONS
  ========================================================= */

  const outcomeOptions = [
    "Interested",
    "Not Interested",
    "Follow Up",
    "Callback Requested",
    "Converted",
    "Wrong Number",
    "No Answer",
    "Other",
  ];

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     FILTER CHANGE
  ========================================================= */

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     FILTERED DATA
  ========================================================= */

  const filteredPlaygrounds = useMemo(() => {
    return playgrounds.filter((item) => {
      const sentimentMatch =
        filters.sentiment === "All Sentiments" ||
        item.sentiment === filters.sentiment;

      const statusMatch =
        filters.status === "All Call Status" || item.status === filters.status;

      return sentimentMatch && statusMatch;
    });
  }, [playgrounds, filters]);

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = () => {
    if (refreshing) return;

    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  /* =========================================================
     OPEN CREATE
  ========================================================= */

  const openCreatePanel = () => {
    setShowCreate(true);
  };

  /* =========================================================
     CLOSE CREATE
  ========================================================= */

  const closeCreatePanel = () => {
    setShowCreate(false);
  };

  /* =========================================================
     CREATE PLAYGROUND
  ========================================================= */

  const handleCreate = () => {
    if (!form.firstName.trim()) {
      alert("First Name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      alert("Last Name is required.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Phone Number is required.");
      return;
    }

    if (!form.assistant) {
      alert("Please select an assistant.");
      return;
    }

    const newPlayground = {
      id: Date.now(),

      name: `${form.firstName.trim()} ${form.lastName.trim()}`,

      phone: form.phone,

      duration: "00:00",

      cost: "₹0.00",

      calledAt: "Not started",

      sentiment: "Pending",

      status: "Ready",

      favorite: false,

      outcome: "",

      notes: "",
    };

    setPlaygrounds((previous) => [newPlayground, ...previous]);

    setShowCreate(false);

    setForm({
      firstName: "BHUVANESHKUMAR",
      lastName: "V",
      email: "vbhuvanesh14@gmail.com",
      description: "",
      phone: "+91 80729 61256",
      extension: "",
      assistant: "",
      dialer: "Default Dialer",
    });
  };

  /* =========================================================
     FAVORITE
  ========================================================= */

  const toggleFavorite = (id) => {
    setPlaygrounds((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite: !item.favorite,
            }
          : item,
      ),
    );
  };

  /* =========================================================
     OPEN OUTCOME
  ========================================================= */

  const openOutcome = (item) => {
    setSelectedPlayground(item);

    setOutcome({
      result: item.outcome || "",
      notes: item.notes || "",
    });

    setShowOutcome(true);
  };

  /* =========================================================
     CLOSE OUTCOME
  ========================================================= */

  const closeOutcome = () => {
    setShowOutcome(false);
    setSelectedPlayground(null);
  };

  /* =========================================================
     SAVE OUTCOME
  ========================================================= */

  const saveOutcome = () => {
    if (!selectedPlayground) return;

    if (!outcome.result) {
      alert("Please select a call outcome.");
      return;
    }

    setPlaygrounds((previous) =>
      previous.map((item) =>
        item.id === selectedPlayground.id
          ? {
              ...item,
              outcome: outcome.result,
              notes: outcome.notes,
            }
          : item,
      ),
    );

    closeOutcome();
  };

  /* =========================================================
     SIMULATE CALL
  ========================================================= */

  const handleTestCall = (item) => {
    setPlaygrounds((previous) =>
      previous.map((row) =>
        row.id === item.id
          ? {
              ...row,
              status: "In Progress",
              calledAt: "Calling...",
            }
          : row,
      ),
    );

    setTimeout(() => {
      setPlaygrounds((previous) =>
        previous.map((row) =>
          row.id === item.id
            ? {
                ...row,
                status: "Completed",
                duration: "00:35",
                cost: "₹4.50",
                calledAt: new Date().toLocaleString(),
                sentiment: "Neutral",
              }
            : row,
        ),
      );
    }, 2500);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="playground-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="playground-page-header">
        <div className="playground-title">
          <h1>Playground</h1>
        </div>

        <div className="playground-actions">
          {/* SENTIMENT */}

          <div className="playground-select">
            <select
              name="sentiment"
              value={filters.sentiment}
              onChange={handleFilterChange}
            >
              <option>All Sentiments</option>
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
              <option>Pending</option>
            </select>

            <FaChevronDown />
          </div>

          {/* STATUS */}

          <div className="playground-select">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option>All Call Status</option>
              <option>Completed</option>
              <option>Ready</option>
              <option>In Progress</option>
              <option>Failed</option>
            </select>

            <FaChevronDown />
          </div>

          {/* PERIOD */}

          <div className="playground-select small-select">
            <select
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
            >
              <option>All</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>

            <FaChevronDown />
          </div>

          {/* REFRESH */}

          <button
            type="button"
            className={`refresh-btn ${refreshing ? "refreshing" : ""}`}
            onClick={handleRefresh}
          >
            <FaSyncAlt />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          {/* ADD */}

          <button
            type="button"
            className="add-playground-btn"
            onClick={openCreatePanel}
          >
            <FaPlus />
            Add Playground
          </button>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="playground-table-wrapper">
        <div className="playground-table-scroll">
          <table className="playground-table">
            <thead>
              <tr>
                <th className="star-column"></th>

                <th>
                  Name
                  <span className="sort-icon">↕</span>
                </th>

                <th>
                  Phone Number
                  <span className="sort-icon">↕</span>
                </th>

                <th>
                  Duration
                  <span className="sort-icon">↕</span>
                </th>

                <th>
                  Cost
                  <span className="sort-icon">↕</span>
                </th>

                <th>
                  Called At
                  <span className="sort-icon">↕</span>
                </th>

                <th>Sentiments</th>

                <th>Call Status</th>

                <th>Actions</th>

                <th>Call Outcome</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlaygrounds.slice(0, entries).map((item) => (
                <tr key={item.id}>
                  {/* FAVORITE */}

                  <td className="star-column">
                    <button
                      type="button"
                      className="star-button"
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <FaStar
                        className={item.favorite ? "star-active" : "star-icon"}
                      />
                    </button>
                  </td>

                  {/* NAME */}

                  <td>
                    <button
                      type="button"
                      className="name-button"
                      onClick={() => openOutcome(item)}
                    >
                      {item.name}
                    </button>
                  </td>

                  {/* PHONE */}

                  <td>
                    <div className="phone-cell">
                      <span>{item.phone}</span>

                      <button
                        type="button"
                        className="phone-action"
                        onClick={() => handleTestCall(item)}
                        title="Test call"
                      >
                        <FaPhone />
                      </button>
                    </div>
                  </td>

                  {/* DURATION */}

                  <td>{item.duration}</td>

                  {/* COST */}

                  <td>{item.cost}</td>

                  {/* CALLED AT */}

                  <td>{item.calledAt}</td>

                  {/* SENTIMENT */}

                  <td>
                    <span
                      className={`sentiment ${item.sentiment
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.sentiment}
                    </span>
                  </td>

                  {/* STATUS */}

                  <td>
                    <span
                      className={`call-status ${item.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* ACTION */}

                  <td>
                    {item.status === "Ready" ? (
                      <button
                        type="button"
                        className="test-call-btn"
                        onClick={() => handleTestCall(item)}
                      >
                        <FaPlay />
                        Test
                      </button>
                    ) : (
                      <span className="action-dash">-</span>
                    )}
                  </td>

                  {/* OUTCOME */}

                  <td>
                    <button
                      type="button"
                      className="outcome-btn"
                      onClick={() => openOutcome(item)}
                    >
                      {item.outcome ? item.outcome : "Call Outcome"}
                    </button>
                  </td>
                </tr>
              ))}

              {/* EMPTY */}

              {filteredPlaygrounds.length === 0 && (
                <tr>
                  <td colSpan="10" className="empty-table">
                    <div className="empty-content">
                      <FaPhone />

                      <h3>No playgrounds found</h3>

                      <p>
                        Try changing your filters or create a new playground.
                      </p>

                      <button type="button" onClick={openCreatePanel}>
                        <FaPlus />
                        Add Playground
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="playground-table-footer">
          <select
            value={entries}
            onChange={(event) => setEntries(Number(event.target.value))}
          >
            <option value="20">20 entries</option>

            <option value="50">50 entries</option>

            <option value="100">100 entries</option>
          </select>

          <span className="footer-count">
            Showing {Math.min(filteredPlaygrounds.length, entries)} of{" "}
            {filteredPlaygrounds.length}
          </span>
        </div>
      </div>

      {/* =====================================================
          CREATE PANEL
      ===================================================== */}

      {showCreate && (
        <div className="playground-overlay">
          <div className="create-playground-panel">
            {/* HEADER */}

            <div className="create-panel-header">
              <h2>Create Playground</h2>

              <button
                type="button"
                className="close-panel-btn"
                onClick={closeCreatePanel}
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}

            <div className="create-panel-body">
              {/* FIRST NAME */}

              <div className="form-field">
                <label>
                  First Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>

              {/* LAST NAME */}

              <div className="form-field">
                <label>
                  Last Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}

              <div className="form-field">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              {/* DESCRIPTION */}

              <div className="form-field">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Add notes about this playground..."
                />
              </div>

              {/* PHONE */}

              <div className="phone-row">
                <div className="form-field phone-field">
                  <label>
                    Phone Number <span>*</span>
                  </label>

                  <div className="phone-input">
                    <div className="country-code">🇮🇳</div>

                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field extension-field">
                  <label>Extension</label>

                  <input
                    type="text"
                    name="extension"
                    value={form.extension}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ASSISTANT */}

              <div className="form-field">
                <label>
                  Assistant <span>*</span>
                </label>

                <select
                  name="assistant"
                  value={form.assistant}
                  onChange={handleChange}
                >
                  <option value="">Select assistant...</option>

                  {assistants.map((assistant) => (
                    <option key={assistant} value={assistant}>
                      {assistant}
                    </option>
                  ))}
                </select>
              </div>

              {/* DIALER */}

              <div className="form-field">
                <label>Dialer</label>

                <select
                  name="dialer"
                  value={form.dialer}
                  onChange={handleChange}
                >
                  <option>Default Dialer</option>

                  <option>Custom Dialer</option>

                  <option>Twilio</option>

                  <option>Exotel</option>
                </select>
              </div>

              {/* WARNING */}

              <div className="dialer-warning">
                <FaExclamationTriangle />

                <span>
                  The default dialer works for US and Canadian numbers only. For
                  other countries, please use your own dialer.
                </span>
              </div>
            </div>

            {/* FOOTER */}

            <div className="create-panel-footer">
              <button
                type="button"
                className="create-btn cancel"
                onClick={closeCreatePanel}
              >
                Cancel
              </button>

              <button
                type="button"
                className="create-btn primary"
                onClick={handleCreate}
              >
                <FaPlus />
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CALL OUTCOME MODAL
      ===================================================== */}

      {showOutcome && selectedPlayground && (
        <div className="outcome-overlay">
          <div className="outcome-modal">
            <div className="outcome-header">
              <div>
                <span>CALL OUTCOME</span>

                <h2>{selectedPlayground.name}</h2>
              </div>

              <button type="button" onClick={closeOutcome}>
                <FaTimes />
              </button>
            </div>

            <div className="outcome-body">
              <div className="outcome-info">
                <div>
                  <small>Phone Number</small>

                  <strong>{selectedPlayground.phone}</strong>
                </div>

                <div>
                  <small>Duration</small>

                  <strong>{selectedPlayground.duration}</strong>
                </div>

                <div>
                  <small>Status</small>

                  <strong>{selectedPlayground.status}</strong>
                </div>
              </div>

              <div className="form-field">
                <label>Call Outcome</label>

                <select
                  value={outcome.result}
                  onChange={(event) =>
                    setOutcome((previous) => ({
                      ...previous,
                      result: event.target.value,
                    }))
                  }
                >
                  <option value="">Select outcome...</option>

                  {outcomeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Notes</label>

                <textarea
                  value={outcome.notes}
                  onChange={(event) =>
                    setOutcome((previous) => ({
                      ...previous,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Add notes about the call..."
                />
              </div>
            </div>

            <div className="outcome-footer">
              <button
                type="button"
                className="create-btn cancel"
                onClick={closeOutcome}
              >
                Cancel
              </button>

              <button
                type="button"
                className="create-btn primary"
                onClick={saveOutcome}
              >
                <FaSave />
                Save Outcome
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Playground;
