import React, { useState } from "react";

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

  const [assistants, setAssistants] = useState([
    {
      id: 1,
      name: "WhatsApp AI Assistant",
      description:
        "Automatically responds to customer messages and provides instant support.",
      channel: "WhatsApp",
      status: "Active",
      conversations: 128,
    },
    {
      id: 2,
      name: "Customer Support Assistant",
      description:
        "Helps customers with common questions and support requests.",
      channel: "WhatsApp",
      status: "Active",
      conversations: 86,
    },
    {
      id: 3,
      name: "Sales Assistant",
      description:
        "Engages leads, answers product questions and helps convert prospects.",
      channel: "WhatsApp",
      status: "Inactive",
      conversations: 42,
    },
  ]);

  // ============================================================
  // CREATE / EDIT MODAL
  // ============================================================

  const [showModal, setShowModal] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    channel: "WhatsApp",
  });

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
  // OPEN CREATE MODAL
  // ============================================================

  const openCreateModal = () => {
    setEditingAssistant(null);

    setFormData({
      name: "",
      description: "",
      channel: "WhatsApp",
    });

    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const openEditModal = (assistant) => {
    setEditingAssistant(assistant);

    setFormData({
      name: assistant.name,
      description: assistant.description,
      channel: assistant.channel,
    });

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingAssistant(null);

    setFormData({
      name: "",
      description: "",
      channel: "WhatsApp",
    });
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
  // SAVE ASSISTANT
  // ============================================================

  const saveAssistant = () => {
    if (!formData.name.trim()) {
      alert("Please enter assistant name.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter assistant description.");
      return;
    }

    // EDIT EXISTING ASSISTANT
    if (editingAssistant) {
      setAssistants((current) =>
        current.map((assistant) =>
          assistant.id === editingAssistant.id
            ? {
                ...assistant,
                name: formData.name,
                description: formData.description,
                channel: formData.channel,
              }
            : assistant
        )
      );
    }

    // CREATE NEW ASSISTANT
    else {
      const newAssistant = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        channel: formData.channel,
        status: "Active",
        conversations: 0,
      };

      setAssistants((current) => [
        ...current,
        newAssistant,
      ]);
    }

    closeModal();
  };

  // ============================================================
  // TOGGLE ASSISTANT
  // ============================================================

  const toggleAssistant = (id) => {
    setAssistants((current) =>
      current.map((assistant) =>
        assistant.id === id
          ? {
              ...assistant,
              status:
                assistant.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : assistant
      )
    );
  };

  // ============================================================
  // DELETE ASSISTANT
  // ============================================================

  const deleteAssistant = (id) => {
    const assistant = assistants.find(
      (item) => item.id === id
    );

    const confirmed = window.confirm(
      `Delete "${assistant?.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setAssistants((current) =>
      current.filter(
        (assistant) => assistant.id !== id
      )
    );
  };

  return (
    <div className="astra-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="astra-header">

        <div>
          <h2>Astra</h2>

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
              {assistants.length}
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
              {
                assistants.filter(
                  (assistant) =>
                    assistant.status === "Active"
                ).length
              }
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
              {assistants.reduce(
                (total, assistant) =>
                  total + assistant.conversations,
                0
              )}
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

        {filteredAssistants.length === 0 ? (

          <div className="astra-empty">

            <FaRobot />

            <h3>No assistants found</h3>

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


                  {/* DETAILS */}

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

                {/* POWER */}

                <button
                  className="astra-action-btn"
                  title="Toggle assistant"
                  onClick={() =>
                    toggleAssistant(assistant.id)
                  }
                >
                  <FaPowerOff />
                </button>


                {/* EDIT */}

                <button
                  className="astra-action-btn"
                  title="Edit assistant"
                  onClick={() =>
                    openEditModal(assistant)
                  }
                >
                  <FaEdit />
                </button>


                {/* DELETE */}

                <button
                  className="astra-action-btn delete"
                  title="Delete assistant"
                  onClick={() =>
                    deleteAssistant(assistant.id)
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

      <div className="astra-footer">

        Showing {filteredAssistants.length} of{" "}
        {assistants.length} assistants

      </div>


      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showModal && (

        <div className="astra-modal-overlay">

          <div className="astra-modal">

            {/* MODAL HEADER */}

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
                    : "Create an AI assistant for your WhatsApp conversations."}
                </p>
              </div>

              <button
                className="astra-modal-close"
                onClick={closeModal}
                title="Close"
              >
                <FaTimes />
              </button>

            </div>


            {/* FORM */}

            <div className="astra-form">

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

            </div>


            {/* MODAL FOOTER */}

            <div className="astra-modal-footer">

              <button
                className="astra-cancel-btn"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="astra-save-btn"
                onClick={saveAssistant}
              >
                {editingAssistant
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