import React, { useState } from "react";
import {
  FaPlus,
  FaBullhorn,
  FaTimes,
  FaChevronDown,
  FaInfoCircle,
  FaEye,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaFilter,
  FaRobot,
  FaPhoneAlt,
  FaRedo,
  FaSave,
  FaUsers,
} from "react-icons/fa";

import "./Campaigns.css";

function Campaigns() {
  // =====================================================
  // STATE
  // =====================================================

  const [showCreate, setShowCreate] = useState(false);

  const [campaigns, setCampaigns] = useState([]);

  const [campaignName, setCampaignName] = useState("");
  const [voiceAssistant, setVoiceAssistant] = useState("");
  const [dialer, setDialer] = useState("");

  const [automation, setAutomation] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);
  const [dripMode, setDripMode] = useState(false);

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [actionName, setActionName] = useState("");
  const [batchQuantity, setBatchQuantity] = useState("");

  const [startDate, setStartDate] = useState("");
  const [timezone, setTimezone] = useState("");

  const [startTime, setStartTime] = useState("11:00");
  const [endTime, setEndTime] = useState("");

  const [selectedDays, setSelectedDays] = useState([]);

  const [filterRules, setFilterRules] = useState([
    {
      field: "Tag",
      operator: "includes any of",
      value: "",
    },
  ]);

  // =====================================================
  // ASSISTANTS
  // =====================================================

  const assistants = [
    {
      id: "course-enquiry",
      name: "Course Enquiry",
    },
    {
      id: "admission-support",
      name: "Admission Support",
    },
    {
      id: "customer-support",
      name: "Customer Support",
    },
    {
      id: "lead-qualification",
      name: "Lead Qualification",
    },
    {
      id: "billing-support",
      name: "Billing Support",
    },
    {
      id: "technical-support",
      name: "Technical Support",
    },
  ];

  // =====================================================
  // DIALERS
  // =====================================================

  const dialers = [
    {
      id: "main-dialer",
      name: "Main Dialer",
    },
    {
      id: "sales-dialer",
      name: "Sales Dialer",
    },
    {
      id: "support-dialer",
      name: "Support Dialer",
    },
  ];

  // =====================================================
  // DAYS
  // =====================================================

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // =====================================================
  // OPEN DRAWER
  // =====================================================

  const openCreateCampaign = () => {
    resetForm();
    setShowCreate(true);
  };

  // =====================================================
  // CLOSE DRAWER
  // =====================================================

  const closeCreateCampaign = () => {
    setShowCreate(false);
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setCampaignName("");
    setVoiceAssistant("");
    setDialer("");

    setAutomation(false);
    setScheduled(false);
    setRetryFailed(false);
    setDripMode(false);

    setScheduleDate("");
    setScheduleTime("");

    setActionName("");
    setBatchQuantity("");

    setStartDate("");
    setTimezone("");

    setStartTime("11:00");
    setEndTime("");

    setSelectedDays([]);

    setFilterRules([
      {
        field: "Tag",
        operator: "includes any of",
        value: "",
      },
    ]);
  };

  // =====================================================
  // ADD RULE
  // =====================================================

  const addRule = () => {
    setFilterRules([
      ...filterRules,
      {
        field: "Tag",
        operator: "includes any of",
        value: "",
      },
    ]);
  };

  // =====================================================
  // REMOVE RULE
  // =====================================================

  const removeRule = (index) => {
    if (filterRules.length === 1) return;

    setFilterRules(filterRules.filter((_, ruleIndex) => ruleIndex !== index));
  };

  // =====================================================
  // UPDATE RULE
  // =====================================================

  const updateRule = (index, key, value) => {
    const updatedRules = [...filterRules];

    updatedRules[index] = {
      ...updatedRules[index],
      [key]: value,
    };

    setFilterRules(updatedRules);
  };

  // =====================================================
  // SELECT DAY
  // =====================================================

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((item) => item !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // =====================================================
  // SAVE CAMPAIGN
  // =====================================================

  const saveCampaign = () => {
    if (!campaignName.trim()) {
      alert("Please enter campaign name.");
      return;
    }

    if (!voiceAssistant) {
      alert("Please select a voice assistant.");
      return;
    }

    if (!dialer) {
      alert("Please select a dialer.");
      return;
    }

    if (scheduled && !scheduleDate) {
      alert("Please select schedule date.");
      return;
    }

    if (dripMode) {
      if (!actionName.trim()) {
        alert("Please enter action name.");
        return;
      }

      if (!batchQuantity) {
        alert("Please enter batch quantity.");
        return;
      }

      if (!startDate) {
        alert("Please select start date.");
        return;
      }

      if (!timezone) {
        alert("Please select timezone.");
        return;
      }
    }

    const selectedAssistant = assistants.find(
      (item) => item.id === voiceAssistant,
    );

    const selectedDialer = dialers.find((item) => item.id === dialer);

    const newCampaign = {
      id: Date.now(),
      name: campaignName,
      assistant: selectedAssistant?.name || "",
      dialer: selectedDialer?.name || "",
      automation,
      scheduled,
      retryFailed,
      dripMode,
      status: "Draft",
      createdAt: new Date().toLocaleDateString(),
    };

    setCampaigns([...campaigns, newCampaign]);

    setShowCreate(false);
    resetForm();
  };

  // =====================================================
  // DELETE CAMPAIGN
  // =====================================================

  const deleteCampaign = (id) => {
    setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="campaign-page">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="campaign-header">
        <div className="campaign-heading">
          <div className="campaign-heading-icon">
            <FaBullhorn />
          </div>

          <div>
            <h1>AI Campaigns</h1>

            <p>Create and manage automated voice campaigns.</p>
          </div>
        </div>

        <button className="create-campaign-btn" onClick={openCreateCampaign}>
          <FaPlus />
          Add AI Campaign
        </button>
      </div>

      {/* =================================================
          CAMPAIGN CONTENT
      ================================================= */}

      {campaigns.length === 0 ? (
        <div className="campaign-empty">
          <div className="campaign-empty-icon">
            <FaBullhorn />
          </div>

          <h2>No AI campaigns yet</h2>

          <p>Get started by creating your first AI voice campaign.</p>

          <button className="empty-create-btn" onClick={openCreateCampaign}>
            <FaPlus />
            Add AI Campaign
          </button>
        </div>
      ) : (
        <div className="campaign-list">
          {campaigns.map((campaign) => (
            <div className="campaign-card" key={campaign.id}>
              <div className="campaign-card-top">
                <div className="campaign-card-icon">
                  <FaBullhorn />
                </div>

                <div className="campaign-card-title">
                  <h3>{campaign.name}</h3>

                  <span>{campaign.assistant}</span>
                </div>

                <div className="campaign-status">{campaign.status}</div>
              </div>

              <div className="campaign-card-info">
                <div>
                  <small>Voice Assistant</small>
                  <strong>
                    <FaRobot />
                    {campaign.assistant}
                  </strong>
                </div>

                <div>
                  <small>Dialer</small>
                  <strong>
                    <FaPhoneAlt />
                    {campaign.dialer}
                  </strong>
                </div>

                <div>
                  <small>Created</small>
                  <strong>{campaign.createdAt}</strong>
                </div>
              </div>

              <div className="campaign-card-footer">
                <div className="campaign-features">
                  {campaign.automation && <span>Automation</span>}

                  {campaign.scheduled && <span>Scheduled</span>}

                  {campaign.retryFailed && <span>Retry Enabled</span>}

                  {campaign.dripMode && <span>Drip Mode</span>}
                </div>

                <button
                  className="delete-campaign-btn"
                  onClick={() => deleteCampaign(campaign.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =================================================
          OVERLAY
      ================================================= */}

      {showCreate && (
        <div className="campaign-overlay" onClick={closeCreateCampaign} />
      )}

      {/* =================================================
          CREATE CAMPAIGN DRAWER
      ================================================= */}

      <div className={`campaign-drawer ${showCreate ? "drawer-open" : ""}`}>
        {/* Drawer Header */}

        <div className="drawer-header">
          <div>
            <h2>Create Campaign</h2>

            <p>Configure your AI voice campaign</p>
          </div>

          <button className="drawer-close" onClick={closeCreateCampaign}>
            <FaTimes />
          </button>
        </div>

        {/* Drawer Body */}

        <div className="drawer-body">
          {/* =================================================
              CAMPAIGN BASIC DETAILS
          ================================================= */}

          <section className="drawer-section">
            <div className="section-title">
              <span>01</span>
              Campaign Details
            </div>

            {/* Campaign Name */}

            <div className="form-group">
              <label>
                Campaign Name
                <span>*</span>
              </label>

              <input
                type="text"
                placeholder="Enter campaign name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>

            {/* Voice Assistant */}

            <div className="form-group">
              <label>
                Voice Assistant
                <span>*</span>
              </label>

              <div className="select-wrapper">
                <FaRobot />

                <select
                  value={voiceAssistant}
                  onChange={(e) => setVoiceAssistant(e.target.value)}
                >
                  <option value="">Select voice assistant</option>

                  {assistants.map((assistant) => (
                    <option key={assistant.id} value={assistant.id}>
                      {assistant.name}
                    </option>
                  ))}
                </select>

                <FaChevronDown />
              </div>
            </div>

            {/* Dialer */}

            <div className="form-group">
              <label>
                Dialer
                <span>*</span>
              </label>

              <div className="select-wrapper">
                <FaPhoneAlt />

                <select
                  value={dialer}
                  onChange={(e) => setDialer(e.target.value)}
                >
                  <option value="">Select dialer</option>

                  {dialers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <FaChevronDown />
              </div>
            </div>
          </section>

          {/* =================================================
              CONTACT FILTER
          ================================================= */}

          <section className="drawer-section">
            <div className="section-title">
              <span>02</span>
              Contact Filter
            </div>

            <div className="filter-box">
              <div className="filter-heading">
                <div>
                  <FaFilter />
                  Match Contacts
                </div>

                <div className="match-controls">
                  <button className="match-active">AND</button>

                  <button>OR</button>
                </div>
              </div>

              {filterRules.map((rule, index) => (
                <div className="filter-rule" key={index}>
                  <select
                    value={rule.field}
                    onChange={(e) => updateRule(index, "field", e.target.value)}
                  >
                    <option>Tag</option>
                    <option>Name</option>
                    <option>Phone</option>
                    <option>Email</option>
                    <option>Status</option>
                  </select>

                  <select
                    value={rule.operator}
                    onChange={(e) =>
                      updateRule(index, "operator", e.target.value)
                    }
                  >
                    <option>includes any of</option>

                    <option>includes all of</option>

                    <option>does not include</option>

                    <option>equals</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Enter value..."
                    value={rule.value}
                    onChange={(e) => updateRule(index, "value", e.target.value)}
                  />

                  <button
                    className="remove-rule"
                    onClick={() => removeRule(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}

              <button className="add-rule-btn" onClick={addRule}>
                <FaPlus />
                Add Rule
              </button>

              <button className="preview-btn">
                <FaEye />
                Preview Contacts
              </button>
            </div>
          </section>

          {/* =================================================
              AUTOMATION
          ================================================= */}

          <section className="drawer-section">
            <div className="section-title">
              <span>03</span>
              Automation
            </div>

            {/* Automation */}

            <div className="toggle-row">
              <div className="toggle-info">
                <strong>Automation</strong>

                <small>Automatically start campaign actions.</small>
              </div>

              <button
                className={`toggle ${automation ? "active" : ""}`}
                onClick={() => setAutomation(!automation)}
              >
                <span />
              </button>
            </div>

            {/* Scheduled */}

            <div className="toggle-row">
              <div className="toggle-info">
                <strong>Scheduled</strong>

                <small>Run campaign at a specific date and time.</small>
              </div>

              <button
                className={`toggle ${scheduled ? "active" : ""}`}
                onClick={() => setScheduled(!scheduled)}
              >
                <span />
              </button>
            </div>

            {scheduled && (
              <div className="schedule-panel">
                <div className="form-group">
                  <label>Schedule Date</label>

                  <div className="input-icon">
                    <FaCalendarAlt />

                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Schedule Time</label>

                  <div className="input-icon">
                    <FaClock />

                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Retry */}

            <div className="toggle-row">
              <div className="toggle-info">
                <strong>Retry if failed</strong>

                <small>Retry unsuccessful calls automatically.</small>
              </div>

              <button
                className={`toggle ${retryFailed ? "active" : ""}`}
                onClick={() => setRetryFailed(!retryFailed)}
              >
                <span />
              </button>
            </div>

            {/* Drip */}

            <div className="toggle-row">
              <div className="toggle-info">
                <strong>Send in drip mode</strong>

                <small>Send calls gradually in batches.</small>
              </div>

              <button
                className={`toggle ${dripMode ? "active" : ""}`}
                onClick={() => setDripMode(!dripMode)}
              >
                <span />
              </button>
            </div>
          </section>

          {/* =================================================
              DRIP MODE
          ================================================= */}

          {dripMode && (
            <section className="drawer-section drip-section">
              <div className="section-title">
                <span>04</span>
                Drip Campaign
              </div>

              <div className="form-group">
                <label>
                  Action Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  placeholder="Example: Course Follow-up"
                  value={actionName}
                  onChange={(e) => setActionName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>
                  Batch Quantity
                  <span>*</span>
                </label>

                <input
                  type="number"
                  placeholder="Example: 50"
                  value={batchQuantity}
                  onChange={(e) => setBatchQuantity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Send On</label>

                <div className="days-container">
                  {days.map((day) => (
                    <button
                      key={day}
                      className={selectedDays.includes(day) ? "day-active" : ""}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>
                  Start Date
                  <span>*</span>
                </label>

                <div className="input-icon">
                  <FaCalendarAlt />

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  Timezone
                  <span>*</span>
                </label>

                <div className="select-wrapper">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="">Select timezone</option>

                    <option value="IST">India Standard Time</option>

                    <option value="UTC">UTC</option>

                    <option value="EST">Eastern Time</option>

                    <option value="PST">Pacific Time</option>
                  </select>

                  <FaChevronDown />
                </div>
              </div>

              <div className="time-range">
                <div className="form-group">
                  <label>Start Time</label>

                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>

                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* =================================================
            DRAWER FOOTER
        ================================================= */}

        <div className="drawer-footer">
          <div className="footer-info">
            <FaUsers />

            <span>Campaign will use selected contacts.</span>
          </div>

          <div className="footer-actions">
            <button className="cancel-btn" onClick={closeCreateCampaign}>
              Cancel
            </button>

            <button className="save-campaign-btn" onClick={saveCampaign}>
              <FaSave />
              Save Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Campaigns;
