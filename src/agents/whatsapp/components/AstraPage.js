import React, { useEffect, useState } from "react";

import {
  FaSearch,
  FaPlus,
  FaRobot,
  FaWhatsapp,
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaBolt,
  FaTimes,
} from "react-icons/fa";

function AstraPage() {
  const [search, setSearch] = useState("");

  const [assistants, setAssistants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState(null);

  const [formData, setFormData] = useState({
    name: "WhatsApp AI Assistant",
    description:
      "Automatically responds to customer messages and provides instant support.",
    channel: "WhatsApp",

    provider: "openai",
    model: "gpt-4o-mini",
    system_prompt:
      "You are a helpful WhatsApp customer support assistant.",
    is_active: true,
    auto_reply_enabled: true,
    auto_reply_max_per_conversation: 3,
  });

  // ============================================================
  // LOAD EXISTING AI CONFIG
  // ============================================================

  const loadAssistant = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/ai/config", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Please login again to manage your AI assistant."
          );
        }

        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || "Failed to load AI configuration."
        );
      }

      const data = await response.json();

      // No AI configured yet
      if (!data.configured) {
        setAssistants([]);
        setLoading(false);
        return;
      }

      // Existing real AI configuration
      const assistant = {
        id: "ai-config",
        name: "WhatsApp AI Assistant",
        description:
          data.system_prompt ||
          "Automatically responds to customer messages and provides instant support.",
        channel: "WhatsApp",
        status: data.is_active ? "Active" : "Inactive",
        conversations: 0,

        provider: data.provider,
        model: data.model,
        system_prompt: data.system_prompt || "",
        is_active: data.is_active === true,
        auto_reply_enabled:
          data.auto_reply_enabled === true,
        auto_reply_max_per_conversation:
          data.auto_reply_max_per_conversation || 3,
      };

      setAssistants([assistant]);

      setFormData({
        name: "WhatsApp AI Assistant",
        description:
          data.system_prompt ||
          "Automatically responds to customer messages and provides instant support.",
        channel: "WhatsApp",

        provider: data.provider || "openai",
        model: data.model || "gpt-4o-mini",
        system_prompt:
          data.system_prompt ||
          "You are a helpful WhatsApp customer support assistant.",
        is_active: data.is_active === true,
        auto_reply_enabled:
          data.auto_reply_enabled === true,
        auto_reply_max_per_conversation:
          data.auto_reply_max_per_conversation || 3,
      });
    } catch (err) {
      console.error("AI config load error:", err);
      setError(err.message || "Failed to load assistant.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssistant();
  }, []);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredAssistants = assistants.filter((assistant) =>
    Object.values(assistant)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ============================================================
  // OPEN CREATE
  // ============================================================

  const openCreateModal = () => {
    setEditingAssistant(null);

    setFormData({
      name: "WhatsApp AI Assistant",
      description:
        "Automatically responds to customer messages and provides instant support.",
      channel: "WhatsApp",

      provider: "openai",
      model: "gpt-4o-mini",
      system_prompt:
        "You are a helpful WhatsApp customer support assistant.",
      is_active: true,
      auto_reply_enabled: true,
      auto_reply_max_per_conversation: 3,
    });

    setError("");
    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT
  // ============================================================

  const openEditModal = (assistant) => {
    setEditingAssistant(assistant);

    setFormData({
      name: assistant.name,
      description: assistant.description,
      channel: assistant.channel,

      provider: assistant.provider || "openai",
      model: assistant.model || "gpt-4o-mini",
      system_prompt:
        assistant.system_prompt ||
        assistant.description ||
        "You are a helpful WhatsApp customer support assistant.",
      is_active: assistant.is_active === true,
      auto_reply_enabled:
        assistant.auto_reply_enabled === true,
      auto_reply_max_per_conversation:
        assistant.auto_reply_max_per_conversation || 3,
    });

    setError("");
    setShowModal(true);
  };

  // ============================================================
  // CLOSE
  // ============================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingAssistant(null);
    setError("");
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
  // SAVE EXISTING AI CONFIG
  // ============================================================

  const saveAssistant = async () => {
    if (!formData.name.trim()) {
      setError("Please enter assistant name.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter assistant description.");
      return;
    }

    if (!formData.provider) {
      setError("Please select an AI provider.");
      return;
    }

    if (!formData.model.trim()) {
      setError("Please enter an AI model.");
      return;
    }

    if (!formData.system_prompt.trim()) {
      setError("Please enter a system prompt.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      /*
       * IMPORTANT:
       * Existing backend requires API key when no ai_configs
       * record exists.
       *
       * We intentionally do NOT invent/send an API key here.
       * If configuration already exists, the backend reuses
       * the encrypted existing key.
       */

      const payload = {
        provider: formData.provider,
        model: formData.model,

        system_prompt: formData.system_prompt,

        is_active: formData.is_active === true,

        auto_reply_enabled:
          formData.auto_reply_enabled === true,

        auto_reply_max_per_conversation: Math.min(
          20,
          Math.max(
            1,
            Number(
              formData.auto_reply_max_per_conversation || 3
            )
          )
        ),
      };

      const response = await fetch("/api/ai/config", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to save AI configuration."
        );
      }

      await loadAssistant();

      setShowModal(false);
      setEditingAssistant(null);
    } catch (err) {
      console.error("AI config save error:", err);

      setError(
        err.message ||
          "Failed to save assistant."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // TOGGLE ASSISTANT
  // ============================================================

  const toggleAssistant = async (assistant) => {
    try {
      setError("");

      const response = await fetch("/api/ai/config", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: assistant.provider,
          model: assistant.model,
          system_prompt:
            assistant.system_prompt || null,

          is_active:
            assistant.status !== "Active",

          auto_reply_enabled:
            assistant.auto_reply_enabled === true,

          auto_reply_max_per_conversation:
            assistant.auto_reply_max_per_conversation || 3,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to update assistant status."
        );
      }

      await loadAssistant();
    } catch (err) {
      console.error("Toggle assistant error:", err);

      setError(
        err.message ||
          "Failed to update assistant."
      );
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const deleteAssistant = async () => {
    const confirmed = window.confirm(
      "Delete the AI configuration? This will disable/remove the existing AI assistant."
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch("/api/ai/config", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete AI configuration."
        );
      }

      setAssistants([]);
    } catch (err) {
      console.error("Delete assistant error:", err);

      setError(
        err.message ||
          "Failed to delete assistant."
      );
    }
  };

  // ============================================================
  // SUMMARY
  // ============================================================

  const activeCount = assistants.filter(
    (assistant) =>
      assistant.status === "Active"
  ).length;

  const totalConversations =
    assistants.reduce(
      (total, assistant) =>
        total + Number(assistant.conversations || 0),
      0
    );

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="astra-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="astra-header">

        <div>
          <h2>Agents</h2>

          <p>
            Create and manage AI assistants for your WhatsApp
            conversations.
          </p>
        </div>

        <button
          className="astra-create-btn"
          onClick={openCreateModal}
        >
          <FaPlus />
          Create Assistant
        </button>

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && !showModal && (
        <div
          style={{
            marginBottom: "14px",
            padding: "11px 14px",
            borderRadius: "7px",
            background: "#3a1d24",
            border: "1px solid #71323f",
            color: "#ffb8c2",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="astra-summary">

        <div className="astra-stat-card">

          <div className="astra-stat-icon">
            <FaRobot />
          </div>

          <div>
            <span>Total Assistants</span>

            <strong>
              {loading ? "..." : assistants.length}
            </strong>
          </div>

        </div>

        <div className="astra-stat-card">

          <div className="astra-stat-icon active">
            <FaPowerOff />
          </div>

          <div>
            <span>Active</span>

            <strong>
              {loading ? "..." : activeCount}
            </strong>
          </div>

        </div>

        <div className="astra-stat-card">

          <div className="astra-stat-icon conversations">
            <FaWhatsapp />
          </div>

          <div>
            <span>Conversations</span>

            <strong>
              {loading
                ? "..."
                : totalConversations}
            </strong>
          </div>

        </div>

      </div>

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div className="astra-toolbar">

        <div className="astra-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search assistants..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* ======================================================
          ASSISTANT LIST
      ====================================================== */}

      <div className="astra-list">

        {loading ? (

          <div className="astra-empty">
            <FaRobot />

            <h3>
              Loading assistant...
            </h3>
          </div>

        ) : filteredAssistants.length === 0 ? (

          <div className="astra-empty">

            <FaRobot />

            <h3>
              No assistant configured
            </h3>

            <p>
              Create an AI assistant to start automating
              your WhatsApp conversations.
            </p>

            <button
              className="astra-create-btn"
              onClick={openCreateModal}
            >
              <FaPlus />
              Create Assistant
            </button>

          </div>

        ) : (

          filteredAssistants.map((assistant) => (

            <div
              className="astra-item"
              key={assistant.id}
            >

              {/* LEFT */}

              <div className="astra-item-left">

                <div className="astra-avatar">
                  <FaRobot />
                </div>

                <div className="astra-info">

                  <div className="astra-title-row">

                    <h3>
                      {assistant.name}
                    </h3>

                    <span
                      className={`astra-status ${
                        assistant.status === "Active"
                          ? "astra-status-active"
                          : "astra-status-inactive"
                      }`}
                    >
                      {assistant.status}
                    </span>

                  </div>

                  <p>
                    {assistant.description}
                  </p>

                  <div className="astra-details">

                    <span>
                      <FaWhatsapp />
                      {assistant.channel}
                    </span>

                    <span>
                      <FaBolt />
                      {assistant.conversations} conversations
                    </span>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="astra-actions">

                <button
                  className="astra-action-btn"
                  title="Toggle assistant"
                  onClick={() =>
                    toggleAssistant(assistant)
                  }
                >
                  <FaPowerOff />
                </button>

                <button
                  className="astra-action-btn"
                  title="Edit assistant"
                  onClick={() =>
                    openEditModal(assistant)
                  }
                >
                  <FaEdit />
                </button>

                <button
                  className="astra-action-btn delete"
                  title="Delete assistant"
                  onClick={deleteAssistant}
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

      <div className="astra-footer">

        Showing {filteredAssistants.length} of{" "}
        {assistants.length} assistants

      </div>

      {/* ======================================================
          POPUP DESIGN
      ====================================================== */}

      <style>{`

        .astra-page .astra-modal-overlay {
          position: fixed !important;
          inset: 0 !important;

          width: 100vw !important;
          height: 100vh !important;

          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          padding: 20px !important;

          background: rgba(3, 10, 15, 0.76) !important;

          backdrop-filter: blur(5px) !important;
          -webkit-backdrop-filter: blur(5px) !important;

          z-index: 99999 !important;
        }

        .astra-page .astra-modal-overlay .astra-modal {
          width: 480px !important;
          max-width: calc(100vw - 40px) !important;

          max-height: calc(100vh - 40px) !important;

          margin: 0 !important;
          padding: 0 !important;

          display: flex !important;
          flex-direction: column !important;

          overflow: hidden !important;

          background: #0b181e !important;

          border: 1px solid #29404a !important;

          border-radius: 10px !important;

          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.55) !important;
        }

        .astra-page .astra-modal-header {
          width: 100% !important;

          min-height: 88px !important;

          margin: 0 !important;

          padding: 20px 22px 17px !important;

          display: flex !important;

          align-items: flex-start !important;

          justify-content: space-between !important;

          gap: 15px !important;

          background: #0b181e !important;

          border: 0 !important;

          border-bottom: 1px solid #2a3c44 !important;
        }

        .astra-page .astra-modal-header h3 {
          margin: 0 !important;

          padding: 0 !important;

          color: #edf3f5 !important;

          font-size: 19px !important;

          font-weight: 700 !important;

          line-height: 1.3 !important;
        }

        .astra-page .astra-modal-header p {
          margin: 5px 0 0 !important;

          padding: 0 !important;

          color: #8196a0 !important;

          font-size: 12px !important;

          line-height: 1.45 !important;
        }

        .astra-page .astra-modal-close {
          width: 31px !important;
          height: 31px !important;

          min-width: 31px !important;

          margin: 0 !important;
          padding: 0 !important;

          display: flex !important;

          align-items: center !important;
          justify-content: center !important;

          background: #111f26 !important;

          color: #8da2ac !important;

          border: 1px solid #3b4f58 !important;

          border-radius: 6px !important;

          cursor: pointer !important;

          font-size: 13px !important;
        }

        .astra-page .astra-modal-close:hover {
          background: #1b2b33 !important;
          color: #ffffff !important;
          border-color: #60747d !important;
        }

        .astra-page .astra-form {
          width: 100% !important;

          margin: 0 !important;

          padding: 22px !important;

          display: flex !important;

          flex-direction: column !important;

          gap: 18px !important;

          background: #0b181e !important;

          border: 0 !important;

          overflow-y: auto !important;
        }

        .astra-page .astra-form-group {
          width: 100% !important;

          margin: 0 !important;

          padding: 0 !important;

          display: flex !important;

          flex-direction: column !important;

          gap: 7px !important;

          background: transparent !important;

          border: 0 !important;
        }

        .astra-page .astra-form-group label {
          margin: 0 !important;

          padding: 0 !important;

          color: #8da2ac !important;

          font-size: 12px !important;

          font-weight: 600 !important;

          line-height: 1.3 !important;
        }

        .astra-page .astra-form-group input,
        .astra-page .astra-form-group textarea,
        .astra-page .astra-form-group select {
          width: 100% !important;

          margin: 0 !important;

          color: #e7eef1 !important;

          background: #1d2b32 !important;

          border: 1px solid #263d46 !important;

          border-radius: 7px !important;

          outline: none !important;

          box-shadow: none !important;

          font-family: inherit !important;

          font-size: 13px !important;
        }

        .astra-page .astra-form-group input {
          height: 40px !important;

          min-height: 40px !important;

          padding: 0 12px !important;
        }

        .astra-page .astra-form-group textarea {
          min-height: 94px !important;

          padding: 11px 12px !important;

          resize: vertical !important;

          line-height: 1.5 !important;
        }

        .astra-page .astra-form-group select {
          height: 40px !important;

          min-height: 40px !important;

          padding: 0 12px !important;

          cursor: pointer !important;
        }

        .astra-page .astra-form-group input::placeholder,
        .astra-page .astra-form-group textarea::placeholder {
          color: #708691 !important;
          opacity: 1 !important;
        }

        .astra-page .astra-form-group input:focus,
        .astra-page .astra-form-group textarea:focus,
        .astra-page .astra-form-group select:focus {
          background: #1d2b32 !important;

          border-color: #7c3aed !important;

          box-shadow:
            0 0 0 2px rgba(124, 58, 237, 0.14) !important;
        }

        .astra-page .astra-form-group select option {
          background: #1d2b32 !important;
          color: #edf3f5 !important;
        }

        .astra-page .astra-modal-footer {
          width: 100% !important;

          min-height: 67px !important;

          margin: 0 !important;

          padding: 13px 22px !important;

          display: flex !important;

          align-items: center !important;

          justify-content: flex-end !important;

          gap: 10px !important;

          background: #0b181e !important;

          border: 0 !important;

          border-top: 1px solid #2a3c44 !important;
        }

        .astra-page .astra-cancel-btn {
          height: 38px !important;

          min-height: 38px !important;

          padding: 0 15px !important;

          margin: 0 !important;

          background: #0b181e !important;

          color: #dce5e8 !important;

          border: 1px solid #536771 !important;

          border-radius: 7px !important;

          font-size: 13px !important;

          font-weight: 600 !important;

          cursor: pointer !important;
        }

        .astra-page .astra-cancel-btn:hover {
          background: #17272f !important;
          color: #ffffff !important;
        }

        .astra-page .astra-save-btn {
          height: 38px !important;

          min-height: 38px !important;

          padding: 0 17px !important;

          margin: 0 !important;

          display: inline-flex !important;

          align-items: center !important;

          justify-content: center !important;

          gap: 6px !important;

          background:
            linear-gradient(
              135deg,
              #7838ed,
              #8d55f5
            ) !important;

          color: #ffffff !important;

          border: 0 !important;

          border-radius: 7px !important;

          font-size: 13px !important;

          font-weight: 600 !important;

          cursor: pointer !important;

          box-shadow:
            0 7px 18px rgba(
              124,
              58,
              237,
              0.18
            ) !important;
        }

        .astra-page .astra-save-btn:hover {
          background:
            linear-gradient(
              135deg,
              #6c2fd9,
              #7d43e5
            ) !important;
        }

        @media (max-width: 600px) {

          .astra-page .astra-modal-overlay {
            padding: 12px !important;
          }

          .astra-page .astra-modal-overlay .astra-modal {
            width: 100% !important;

            max-width: 100% !important;

            max-height: calc(100vh - 24px) !important;
          }

          .astra-page .astra-modal-header {
            padding: 17px !important;
          }

          .astra-page .astra-form {
            padding: 18px !important;
          }

          .astra-page .astra-modal-footer {
            padding: 12px 17px !important;
          }

        }

      `}</style>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showModal && (

        <div className="astra-modal-overlay">

          <div className="astra-modal">

            <div className="astra-modal-header">

              <div>

                <h3>
                  {editingAssistant
                    ? "Edit Assistant"
                    : "Create Assistant"}
                </h3>

                <p>
                  {editingAssistant
                    ? "Update your AI assistant details."
                    : "Configure your AI assistant for WhatsApp conversations."}
                </p>

              </div>

              <button
                className="astra-modal-close"
                onClick={closeModal}
                title="Close"
                disabled={saving}
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <div className="astra-form">

              {/* ERROR */}

              {error && (
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "7px",
                    background: "#3a1d24",
                    border:
                      "1px solid #71323f",
                    color: "#ffb8c2",
                    fontSize: "12px",
                    lineHeight: "1.4",
                  }}
                >
                  {error}
                </div>
              )}

              {/* NAME */}

              <div className="astra-form-group">

                <label>
                  Assistant Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Customer Support Assistant"
                  value={formData.name}
                  onChange={handleFormChange}
                />

              </div>

              {/* DESCRIPTION */}

              <div className="astra-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe what this assistant does..."
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                />

              </div>

              {/* CHANNEL */}

              <div className="astra-form-group">

                <label>
                  Channel
                </label>

                <select
                  name="channel"
                  value={formData.channel}
                  onChange={handleFormChange}
                >
                  <option value="WhatsApp">
                    WhatsApp
                  </option>
                </select>

              </div>

              {/* PROVIDER */}

              <div className="astra-form-group">

                <label>
                  AI Provider
                </label>

                <select
                  name="provider"
                  value={formData.provider}
                  onChange={handleFormChange}
                >
                  <option value="openai">
                    OpenAI
                  </option>

                  <option value="anthropic">
                    Anthropic
                  </option>
                </select>

              </div>

              {/* MODEL */}

              <div className="astra-form-group">

                <label>
                  Model
                </label>

                <input
                  type="text"
                  name="model"
                  placeholder="Example: gpt-4o-mini"
                  value={formData.model}
                  onChange={handleFormChange}
                />

              </div>

              {/* SYSTEM PROMPT */}

              <div className="astra-form-group">

                <label>
                  System Prompt
                </label>

                <textarea
                  name="system_prompt"
                  placeholder="Tell the AI how it should behave..."
                  value={formData.system_prompt}
                  onChange={handleFormChange}
                  rows="5"
                />

              </div>

              {/* AUTO REPLY */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "15px",
                  padding: "12px",
                  borderRadius: "7px",
                  background: "#101f26",
                  border:
                    "1px solid #263d46",
                }}
              >

                <div>

                  <div
                    style={{
                      color: "#edf3f5",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Auto Reply
                  </div>

                  <div
                    style={{
                      color: "#8196a0",
                      fontSize: "11px",
                      marginTop: "3px",
                    }}
                  >
                    Automatically respond to WhatsApp messages.
                  </div>

                </div>

                <input
                  type="checkbox"
                  checked={
                    formData.auto_reply_enabled
                  }
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      auto_reply_enabled:
                        e.target.checked,
                    }))
                  }
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#7c3aed",
                    cursor: "pointer",
                  }}
                />

              </div>

              {/* ACTIVE */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "15px",
                  padding: "12px",
                  borderRadius: "7px",
                  background: "#101f26",
                  border:
                    "1px solid #263d46",
                }}
              >

                <div>

                  <div
                    style={{
                      color: "#edf3f5",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Assistant Active
                  </div>

                  <div
                    style={{
                      color: "#8196a0",
                      fontSize: "11px",
                      marginTop: "3px",
                    }}
                  >
                    Enable or disable the AI assistant.
                  </div>

                </div>

                <input
                  type="checkbox"
                  checked={
                    formData.is_active
                  }
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      is_active:
                        e.target.checked,
                    }))
                  }
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#7c3aed",
                    cursor: "pointer",
                  }}
                />

              </div>

            </div>

            {/* FOOTER */}

            <div className="astra-modal-footer">

              <button
                className="astra-cancel-btn"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="astra-save-btn"
                onClick={saveAssistant}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingAssistant
                  ? "Save Changes"
                  : "Create Assistant"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AstraPage;