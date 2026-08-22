import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaBolt,
  FaEnvelope,
  FaCommentDots,
  FaTimes,
} from "react-icons/fa";

function AutomationPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Automations");

  // Controls the Create/Edit modal
  const [showModal, setShowModal] = useState(false);

  // Stores the automation currently being edited
  const [editingAutomation, setEditingAutomation] = useState(null);

  // Temporary frontend data.
  // Backend integration can be added later.
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: "Welcome New Customers",
      trigger: "New Message Received",
      action: "Send WhatsApp Reply",
      description:
        "Automatically welcome customers when they send their first message.",
      status: "Active",
    },
    {
      id: 2,
      name: "Lead Follow-up",
      trigger: "Keyword Match",
      action: "Send Follow-up Message",
      description:
        "Send a follow-up message when a customer mentions a specific keyword.",
      status: "Active",
    },
    {
      id: 3,
      name: "Customer Support",
      trigger: "New Message Received",
      action: "AI Assistant Reply",
      description:
        "Let the AI assistant respond automatically to incoming customer messages.",
      status: "Inactive",
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    trigger: "New Message Received",
    action: "Send WhatsApp Reply",
    description: "",
    status: "Active",
  });

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredAutomations = automations.filter((automation) => {
    const matchesSearch = Object.values(automation)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All Automations" || automation.status === filter;

    return matchesSearch && matchesFilter;
  });

  // ============================================================
  // OPEN CREATE MODAL
  // ============================================================

  const openCreateModal = () => {
    setEditingAutomation(null);

    setFormData({
      name: "",
      trigger: "New Message Received",
      action: "Send WhatsApp Reply",
      description: "",
      status: "Active",
    });

    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const openEditModal = (automation) => {
    setEditingAutomation(automation);

    setFormData({
      name: automation.name,
      trigger: automation.trigger,
      action: automation.action,
      description: automation.description,
      status: automation.status,
    });

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingAutomation(null);
  };

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ============================================================
  // CREATE / UPDATE AUTOMATION
  // ============================================================

  const saveAutomation = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter an automation name.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    // EDIT EXISTING AUTOMATION
    if (editingAutomation) {
      setAutomations((current) =>
        current.map((automation) =>
          automation.id === editingAutomation.id
            ? {
                ...automation,
                ...formData,
              }
            : automation
        )
      );
    }

    // CREATE NEW AUTOMATION
    else {
      const newAutomation = {
        id: Date.now(),
        name: formData.name.trim(),
        trigger: formData.trigger,
        action: formData.action,
        description: formData.description.trim(),
        status: formData.status,
      };

      setAutomations((current) => [...current, newAutomation]);
    }

    closeModal();
  };

  // ============================================================
  // TOGGLE ACTIVE / INACTIVE
  // ============================================================

  const toggleStatus = (id) => {
    setAutomations((current) =>
      current.map((automation) =>
        automation.id === id
          ? {
              ...automation,
              status:
                automation.status === "Active" ? "Inactive" : "Active",
            }
          : automation
      )
    );
  };

  // ============================================================
  // DELETE AUTOMATION
  // ============================================================

  const deleteAutomation = (id) => {
    const automation = automations.find((item) => item.id === id);

    if (!automation) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${automation.name}"?`
    );

    if (!confirmed) return;

    setAutomations((current) =>
      current.filter((automation) => automation.id !== id)
    );
  };

  return (
    <div className="automation-page">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="automation-page-header">
        <div>
          <h2>Automations</h2>

          <p>
            Create and manage automated workflows for your WhatsApp
            conversations.
          </p>
        </div>

        <button
          className="automation-create-btn"
          onClick={openCreateModal}
        >
          <FaPlus />
          Create Automation
        </button>
      </div>

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="automation-summary">

        <div className="automation-stat-card">
          <div className="automation-stat-icon">
            <FaBolt />
          </div>

          <div>
            <span>Total Automations</span>

            <strong>{automations.length}</strong>
          </div>
        </div>

        <div className="automation-stat-card">
          <div className="automation-stat-icon active">
            <FaPowerOff />
          </div>

          <div>
            <span>Active</span>

            <strong>
              {
                automations.filter(
                  (automation) => automation.status === "Active"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="automation-stat-card">
          <div className="automation-stat-icon inactive">
            <FaPowerOff />
          </div>

          <div>
            <span>Inactive</span>

            <strong>
              {
                automations.filter(
                  (automation) => automation.status === "Inactive"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>

      {/* ======================================================
          SEARCH / FILTER BAR
      ====================================================== */}

      <div className="automation-toolbar">

        <div className="automation-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search automations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="automation-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All Automations">All Automations</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

      </div>

      {/* ======================================================
          AUTOMATION LIST
      ====================================================== */}

      <div className="automation-list">

        {filteredAutomations.length === 0 ? (
          <div className="automation-empty">

            <FaBolt />

            <h3>No automations found</h3>

            <p>
              Create an automation to start automating your WhatsApp
              conversations.
            </p>

            <button
              className="automation-create-btn"
              onClick={openCreateModal}
            >
              <FaPlus />
              Create Automation
            </button>

          </div>
        ) : (
          filteredAutomations.map((automation) => (
            <div
              className="automation-item"
              key={automation.id}
            >

              {/* ==================================================
                  LEFT SIDE
              ================================================== */}

              <div className="automation-item-left">

                <div className="automation-icon">
                  <FaBolt />
                </div>

                <div className="automation-info">

                  <div className="automation-title-row">

                    <h3>{automation.name}</h3>

                    <span
                      className={`automation-status ${
                        automation.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {automation.status}
                    </span>

                  </div>

                  <p>{automation.description}</p>

                  {/* TRIGGER → ACTION */}

                  <div className="automation-flow">

                    <div className="automation-flow-box">

                      <FaCommentDots />

                      <div>
                        <small>TRIGGER</small>

                        <strong>
                          {automation.trigger}
                        </strong>
                      </div>

                    </div>

                    <span className="automation-arrow">
                      →
                    </span>

                    <div className="automation-flow-box">

                      <FaEnvelope />

                      <div>
                        <small>ACTION</small>

                        <strong>
                          {automation.action}
                        </strong>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  RIGHT SIDE ACTIONS
              ================================================== */}

              <div className="automation-actions">

                {/* TOGGLE */}

                <button
                  className="automation-action-btn"
                  title={
                    automation.status === "Active"
                      ? "Deactivate automation"
                      : "Activate automation"
                  }
                  onClick={() =>
                    toggleStatus(automation.id)
                  }
                >
                  <FaPowerOff />
                </button>

                {/* EDIT */}

                <button
                  className="automation-action-btn"
                  title="Edit automation"
                  onClick={() =>
                    openEditModal(automation)
                  }
                >
                  <FaEdit />
                </button>

                {/* DELETE */}

                <button
                  className="automation-action-btn delete"
                  title="Delete automation"
                  onClick={() =>
                    deleteAutomation(automation.id)
                  }
                >
                  <FaTrash />
                </button>

              </div>

            </div>
          ))
        )}

      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="automation-footer">
        Showing {filteredAutomations.length} of{" "}
        {automations.length} automations
      </div>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="automation-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="automation-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="automation-modal-header">

              <div>
                <h3>
                  {editingAutomation
                    ? "Edit Automation"
                    : "Create Automation"}
                </h3>

                <p>
                  Configure your WhatsApp automation workflow.
                </p>
              </div>

              <button
                className="automation-modal-close"
                onClick={closeModal}
                type="button"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={saveAutomation}>

              {/* NAME */}

              <div className="automation-form-group">

                <label>
                  Automation Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Welcome New Customers"
                  value={formData.name}
                  onChange={handleFormChange}
                />

              </div>

              {/* TRIGGER */}

              <div className="automation-form-group">

                <label>
                  Trigger
                </label>

                <select
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleFormChange}
                >
                  <option value="New Message Received">
                    New Message Received
                  </option>

                  <option value="Keyword Match">
                    Keyword Match
                  </option>

                  <option value="New Contact Created">
                    New Contact Created
                  </option>

                  <option value="Conversation Assigned">
                    Conversation Assigned
                  </option>
                </select>

              </div>

              {/* ACTION */}

              <div className="automation-form-group">

                <label>
                  Action
                </label>

                <select
                  name="action"
                  value={formData.action}
                  onChange={handleFormChange}
                >
                  <option value="Send WhatsApp Reply">
                    Send WhatsApp Reply
                  </option>

                  <option value="Send Follow-up Message">
                    Send Follow-up Message
                  </option>

                  <option value="AI Assistant Reply">
                    AI Assistant Reply
                  </option>

                  <option value="Assign to Agent">
                    Assign to Agent
                  </option>
                </select>

              </div>

              {/* DESCRIPTION */}

              <div className="automation-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe what this automation does..."
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                />

              </div>

              {/* STATUS */}

              <div className="automation-form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

              </div>

              {/* BUTTONS */}

              <div className="automation-modal-actions">

                <button
                  type="button"
                  className="automation-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="automation-save-btn"
                >
                  <FaPlus />

                  {editingAutomation
                    ? "Update Automation"
                    : "Create Automation"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default AutomationPage;