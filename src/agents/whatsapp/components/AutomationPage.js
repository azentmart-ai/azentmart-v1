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

const AutomationPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Automations");

  const [showModal, setShowModal] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);

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

  const [formData, setFormData] = useState({
    name: "",
    trigger: "New Message Received",
    action: "Send WhatsApp Reply",
    description: "",
    status: "Active",
  });

  /* ============================================================
     FILTER
  ============================================================ */

  const filteredAutomations = automations.filter((automation) => {
    const matchesSearch = Object.values(automation)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All Automations" ||
      automation.status === filter;

    return matchesSearch && matchesFilter;
  });

  /* ============================================================
     COUNTS
  ============================================================ */

  const activeCount = automations.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveCount = automations.filter(
    (item) => item.status === "Inactive"
  ).length;

  /* ============================================================
     OPEN CREATE
  ============================================================ */

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

  /* ============================================================
     OPEN EDIT
  ============================================================ */

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

  /* ============================================================
     CLOSE MODAL
  ============================================================ */

  const closeModal = () => {
    setShowModal(false);
    setEditingAutomation(null);
  };

  /* ============================================================
     FORM CHANGE
  ============================================================ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================================
     SAVE
  ============================================================ */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter an automation name.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (editingAutomation) {
      setAutomations((prev) =>
        prev.map((automation) =>
          automation.id === editingAutomation.id
            ? {
                ...automation,
                name: formData.name.trim(),
                trigger: formData.trigger,
                action: formData.action,
                description: formData.description.trim(),
                status: formData.status,
              }
            : automation
        )
      );
    } else {
      const newAutomation = {
        id: Date.now(),
        name: formData.name.trim(),
        trigger: formData.trigger,
        action: formData.action,
        description: formData.description.trim(),
        status: formData.status,
      };

      setAutomations((prev) => [
        ...prev,
        newAutomation,
      ]);
    }

    closeModal();
  };

  /* ============================================================
     TOGGLE
  ============================================================ */

  const toggleAutomation = (id) => {
    setAutomations((prev) =>
      prev.map((automation) =>
        automation.id === id
          ? {
              ...automation,
              status:
                automation.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : automation
      )
    );
  };

  /* ============================================================
     DELETE
  ============================================================ */

  const deleteAutomation = (id) => {
    const automation = automations.find(
      (item) => item.id === id
    );

    if (!automation) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${automation.name}"?`
    );

    if (!confirmed) return;

    setAutomations((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <>
      <style>{`

        /* ==========================================================
           MAIN PAGE
        ========================================================== */

        .automation-page {
          width: 100% !important;
          max-width: none !important;
          min-width: 0 !important;

          margin: 0 !important;
          padding: 0 !important;

          color: #edf4f6;

          box-sizing: border-box;

          overflow-x: hidden;
        }

        .automation-page *,
        .automation-page *::before,
        .automation-page *::after {
          box-sizing: border-box;
        }


        /* ==========================================================
           HEADER
        ========================================================== */

        .automation-page-header {
          width: 100%;

          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 30px;

          margin-bottom: 30px;
        }

        .automation-page-header h2 {
          margin: 0;

          color: #f4f7f8;

          font-size: 30px;
          line-height: 38px;

          font-weight: 700;

          letter-spacing: -0.5px;
        }

        .automation-page-header p {
          margin: 6px 0 0;

          color: #8ca1aa;

          font-size: 13px;
          line-height: 19px;
        }


        /* ==========================================================
           CREATE BUTTON
        ========================================================== */

        .automation-create-btn {
          height: 44px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          padding: 0 20px;

          flex-shrink: 0;

          color: #ffffff;

          background: linear-gradient(
            135deg,
            #7438ec,
            #9850f5
          );

          border: none;

          border-radius: 8px;

          font-family: inherit;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          box-shadow:
            0 8px 24px
            rgba(124, 58, 237, 0.25);

          transition: all 0.15s ease;
        }

        .automation-create-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }


        /* ==========================================================
           STATISTICS
        ========================================================== */

        .automation-summary {
          width: 100%;

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 14px;

          margin-bottom: 18px;
        }

        .automation-stat-card {
          width: 100%;
          min-width: 0;

          min-height: 78px;

          display: flex;
          align-items: center;

          gap: 14px;

          padding: 0 18px;

          background: #101d23;

          border: 1px solid #253840;

          border-radius: 9px;
        }

        .automation-stat-icon {
          width: 40px;
          height: 40px;

          min-width: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #e2ebee;

          background: #17282f;

          border: 1px solid #2a4048;

          border-radius: 8px;

          font-size: 15px;
        }

        .automation-stat-card span {
          display: block;

          margin-bottom: 2px;

          color: #8ba0aa;

          font-size: 12px;
          line-height: 17px;
        }

        .automation-stat-card strong {
          display: block;

          color: #00c995;

          font-size: 23px;
          line-height: 26px;

          font-weight: 600;
        }


        /* ==========================================================
           TOOLBAR
        ========================================================== */

        .automation-toolbar {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 18px;

          margin-bottom: 16px;
        }

        .automation-search {
          width: 290px;
          height: 40px;

          display: flex;
          align-items: center;

          gap: 10px;

          padding: 0 13px;

          background: #1a2a31;

          border: 1px solid #2b4048;

          border-radius: 7px;
        }

        .automation-search svg {
          color: #8aa0aa;

          font-size: 12px;

          flex-shrink: 0;
        }

        .automation-search input {
          width: 100%;
          height: 100%;

          padding: 0;

          color: #e8eef0;

          background: transparent;

          border: none;
          outline: none;

          font-family: inherit;

          font-size: 12px;
        }

        .automation-search input::placeholder {
          color: #758b95;
        }

        .automation-filter {
          width: 155px;
          height: 40px;

          padding: 0 12px;

          color: #e4ebed;

          background: #1a2a31;

          border: 1px solid #2b4048;

          border-radius: 7px;

          outline: none;

          font-family: inherit;

          font-size: 11px;

          cursor: pointer;
        }


        /* ==========================================================
           LIST
        ========================================================== */

        .automation-list {
          width: 100%;

          display: flex;
          flex-direction: column;

          gap: 12px;
        }


        /* ==========================================================
           AUTOMATION CARD
        ========================================================== */

        .automation-item {
          width: 100%;
          min-width: 0;

          min-height: 132px;

          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 25px;

          padding: 17px 18px;

          background: #101d23;

          border: 1px solid #253840;

          border-radius: 9px;

          overflow: hidden;

          transition:
            border-color 0.15s ease,
            background 0.15s ease;
        }

        .automation-item:hover {
          border-color: #31505a;
        }

        .automation-item-left {
          min-width: 0;

          flex: 1;

          display: flex;
          align-items: flex-start;

          gap: 14px;
        }

        .automation-icon {
          width: 42px;
          height: 42px;

          min-width: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #7439ee;

          background: #eeeaff;

          border-radius: 8px;

          font-size: 16px;
        }

        .automation-info {
          min-width: 0;
          flex: 1;
        }


        /* ==========================================================
           TITLE
        ========================================================== */

        .automation-title-row {
          display: flex;
          align-items: center;

          gap: 9px;

          min-width: 0;
        }

        .automation-title-row h3 {
          margin: 0;

          color: #f3f7f8;

          font-size: 16px;
          line-height: 22px;

          font-weight: 700;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .automation-status {
          height: 23px;

          display: inline-flex;
          align-items: center;

          padding: 0 10px;

          flex-shrink: 0;

          border-radius: 13px;

          font-size: 10px;

          font-weight: 600;
        }

        .status-active,
        .status-inactive {
          color: #00d69b;

          background: rgba(
            0,
            201,
            149,
            0.13
          );

          border: 1px solid
            rgba(
              0,
              201,
              149,
              0.5
            );
        }


        /* ==========================================================
           DESCRIPTION
        ========================================================== */

        .automation-info > p {
          margin: 5px 0 11px;

          color: #8ca1aa;

          font-size: 11px;

          line-height: 16px;
        }


        /* ==========================================================
           FLOW
        ========================================================== */

        .automation-flow {
          display: flex;
          align-items: center;

          gap: 10px;
        }

        .automation-flow-box {
          width: 150px;
          min-width: 150px;

          height: 46px;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 7px 10px;

          background: #1b2b32;

          border: 1px solid #2d434b;

          border-radius: 7px;
        }

        .automation-flow-box > svg {
          color: #813ff1;

          font-size: 11px;

          flex-shrink: 0;
        }

        .automation-flow-box small {
          display: block;

          margin-bottom: 2px;

          color: #718792;

          font-size: 8px;

          font-weight: 700;
        }

        .automation-flow-box strong {
          display: block;

          max-width: 120px;

          color: #e3ebed;

          font-size: 10px;

          line-height: 13px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .automation-arrow {
          color: #879ba4;

          font-size: 15px;

          flex-shrink: 0;
        }


        /* ==========================================================
           ACTION BUTTONS
        ========================================================== */

        .automation-actions {
          display: flex;
          align-items: center;

          gap: 7px;

          flex-shrink: 0;

          margin-top: 9px;
        }

        .automation-action-btn {
          width: 32px;
          height: 32px;

          min-width: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #81969f;

          background: #182a32;

          border: 1px solid #2b4149;

          border-radius: 6px;

          font-size: 11px;

          cursor: pointer;

          transition: all 0.15s ease;
        }

        .automation-action-btn:hover {
          color: #ffffff;
          background: #293f48;
        }

        .automation-action-btn.delete:hover {
          color: #ff7777;

          background: rgba(
            255,
            70,
            70,
            0.1
          );
        }


        /* ==========================================================
           FOOTER
        ========================================================== */

        .automation-footer {
          margin-top: 12px;

          color: #718792;

          font-size: 10px;
        }


        /* ==========================================================
           EMPTY
        ========================================================== */

        .automation-empty {
          width: 100%;
          min-height: 250px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 9px;

          background: #101d23;

          border: 1px solid #253840;

          border-radius: 9px;
        }

        .automation-empty svg {
          color: #7e40ef;

          font-size: 28px;
        }

        .automation-empty h3 {
          margin: 0;

          color: #edf3f5;

          font-size: 18px;
        }

        .automation-empty p {
          margin: 0 0 10px;

          color: #8297a0;

          font-size: 12px;
        }


        /* ==========================================================
           MODAL OVERLAY

           IMPORTANT:
           Fully covers screen and blurs background.
        ========================================================== */

        .automation-modal-overlay {
          position: fixed !important;

          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;

          width: 100vw !important;
          height: 100vh !important;

          display: flex !important;

          align-items: center !important;
          justify-content: center !important;

          padding: 20px !important;

          background:
            rgba(
              4,
              11,
              18,
              0.78
            ) !important;

          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;

          z-index: 999999 !important;
        }


        /* ==========================================================
           MODAL

           WHITE OUTER BACKGROUND FIXED HERE
        ========================================================== */

        .automation-modal {
          width: 500px !important;

          max-width:
            calc(100vw - 40px) !important;

          max-height:
            calc(100vh - 40px) !important;

          overflow-y: auto !important;

          padding: 0 !important;

          margin: 0 !important;

          background: #08181e !important;

          border: 1px solid #2a4048 !important;

          border-radius: 14px !important;

          box-shadow:
            0 30px 80px
            rgba(
              0,
              0,
              0,
              0.65
            ) !important;

          color: #edf4f6 !important;
        }


        /* ==========================================================
           MODAL HEADER
        ========================================================== */

        .automation-modal-header {
          width: 100%;

          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 18px;

          padding: 22px 23px 19px;

          background: #08181e !important;

          border-bottom: 1px solid #2a4048 !important;
        }

        .automation-modal-header h3 {
          margin: 0;

          color: #f1f5f6 !important;

          font-size: 20px;

          line-height: 26px;

          font-weight: 700;
        }

        .automation-modal-header p {
          margin: 5px 0 0;

          color: #8499a2 !important;

          font-size: 11px;

          line-height: 16px;
        }


        /* ==========================================================
           CLOSE
        ========================================================== */

        .automation-modal-close {
          width: 32px;
          height: 32px;

          min-width: 32px;

          display: flex;

          align-items: center;
          justify-content: center;

          color: #788d96 !important;

          background: #0d2027 !important;

          border: 1px solid #344a52 !important;

          border-radius: 7px;

          font-size: 11px;

          cursor: pointer;
        }

        .automation-modal-close:hover {
          color: #ffffff !important;

          background: #193039 !important;
        }


        /* ==========================================================
           FORM
        ========================================================== */

        .automation-modal form {
          width: 100%;

          padding: 20px 23px 0;

          background: #08181e !important;

          color: #edf4f6 !important;
        }

        .automation-form-group {
          width: 100%;

          margin-bottom: 17px;
        }

        .automation-form-group label {
          display: block;

          margin-bottom: 8px;

          color: #8ca0a8 !important;

          font-size: 11px;

          line-height: 15px;

          font-weight: 600;
        }


        /* ==========================================================
           INPUTS
        ========================================================== */

        .automation-form-group input,
        .automation-form-group select,
        .automation-form-group textarea {
          width: 100% !important;

          color: #e5edef !important;

          background: #1d2c33 !important;

          border: 1px solid #2b4149 !important;

          border-radius: 7px !important;

          outline: none !important;

          font-family: inherit !important;

          font-size: 12px !important;

          box-shadow: none !important;
        }

        .automation-form-group input,
        .automation-form-group select {
          height: 40px !important;

          padding: 0 12px !important;
        }

        .automation-form-group textarea {
          min-height: 94px !important;

          padding: 11px 12px !important;

          resize: vertical;
        }

        .automation-form-group input::placeholder,
        .automation-form-group textarea::placeholder {
          color: #718690 !important;

          opacity: 1 !important;
        }

        .automation-form-group input:focus,
        .automation-form-group select:focus,
        .automation-form-group textarea:focus {
          border-color: #7541df !important;

          box-shadow:
            0 0 0 2px
            rgba(
              117,
              65,
              223,
              0.14
            ) !important;
        }


        /* ==========================================================
           SELECT
        ========================================================== */

        .automation-form-group select {
          cursor: pointer;
        }

        .automation-form-group select option {
          color: #e8eef0;

          background: #1d2c33;
        }


        /* ==========================================================
           MODAL FOOTER

           COMPLETELY DARK
        ========================================================== */

        .automation-modal-actions {
          width: auto;

          min-height: 65px;

          display: flex;

          align-items: center;

          justify-content: flex-end;

          gap: 9px;

          margin: 20px -23px 0 !important;

          padding: 13px 23px !important;

          background: #08181e !important;

          border-top: 1px solid #2a4048 !important;
        }


        /* ==========================================================
           CANCEL
        ========================================================== */

        .automation-cancel-btn {
          height: 38px;

          padding: 0 16px;

          color: #c9d3d7 !important;

          background: #08181e !important;

          border: 1px solid #4a5d65 !important;

          border-radius: 7px;

          font-family: inherit;

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;
        }

        .automation-cancel-btn:hover {
          color: #ffffff !important;

          background: #122830 !important;
        }


        /* ==========================================================
           SAVE
        ========================================================== */

        .automation-save-btn {
          height: 38px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 7px;

          padding: 0 17px;

          color: #ffffff !important;

          background:
            linear-gradient(
              135deg,
              #7538ed,
              #9851f5
            ) !important;

          border: none !important;

          border-radius: 7px;

          font-family: inherit;

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;

          box-shadow:
            0 6px 18px
            rgba(
              124,
              58,
              237,
              0.25
            );
        }

        .automation-save-btn:hover {
          filter: brightness(1.08);
        }


        /* ==========================================================
           RESPONSIVE
        ========================================================== */

        @media (max-width: 900px) {

          .automation-summary {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .automation-item {
            gap: 15px;
          }

          .automation-flow-box {
            width: 135px;
            min-width: 135px;
          }
        }


        @media (max-width: 700px) {

          .automation-page-header {
            flex-direction: column;
          }

          .automation-summary {
            grid-template-columns: 1fr;
          }

          .automation-toolbar {
            flex-direction: column;

            align-items: stretch;
          }

          .automation-search,
          .automation-filter {
            width: 100%;
          }

          .automation-item {
            flex-direction: column;
          }

          .automation-actions {
            align-self: flex-end;

            margin-top: 0;
          }
        }


        @media (max-width: 540px) {

          .automation-modal {
            width: 100% !important;

            max-width: 100% !important;
          }

          .automation-modal-header {
            padding: 18px !important;
          }

          .automation-modal form {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          .automation-modal-actions {
            margin-left: -18px !important;
            margin-right: -18px !important;

            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          .automation-flow {
            flex-direction: column;

            align-items: stretch;
          }

          .automation-flow-box {
            width: 100%;

            min-width: 0;
          }

          .automation-arrow {
            display: none;
          }
        }

      `}</style>


      {/* ==========================================================
          PAGE
      ========================================================== */}

      <div className="automation-page">

        {/* HEADER */}

        <div className="automation-page-header">

          <div>
            <h2>
              Automations
            </h2>

            <p>
              Create and manage automated workflows for your
              WhatsApp conversations.
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


        {/* ========================================================
            STATS
        ======================================================== */}

        <div className="automation-summary">

          <div className="automation-stat-card">

            <div className="automation-stat-icon">
              <FaBolt />
            </div>

            <div>
              <span>
                Total Automations
              </span>

              <strong>
                {automations.length}
              </strong>
            </div>

          </div>


          <div className="automation-stat-card">

            <div className="automation-stat-icon">
              <FaPowerOff />
            </div>

            <div>
              <span>
                Active
              </span>

              <strong>
                {activeCount}
              </strong>
            </div>

          </div>


          <div className="automation-stat-card">

            <div className="automation-stat-icon">
              <FaPowerOff />
            </div>

            <div>
              <span>
                Inactive
              </span>

              <strong>
                {inactiveCount}
              </strong>
            </div>

          </div>

        </div>


        {/* ========================================================
            SEARCH
        ======================================================== */}

        <div className="automation-toolbar">

          <div className="automation-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search automations..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <select
            className="automation-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >

            <option value="All Automations">
              All Automations
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>


        {/* ========================================================
            AUTOMATION CARDS
        ======================================================== */}

        <div className="automation-list">

          {filteredAutomations.length === 0 ? (

            <div className="automation-empty">

              <FaBolt />

              <h3>
                No automations found
              </h3>

              <p>
                Create an automation to start automating
                your WhatsApp conversations.
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

            filteredAutomations.map(
              (automation) => (

                <div
                  className="automation-item"
                  key={automation.id}
                >

                  <div className="automation-item-left">

                    <div className="automation-icon">
                      <FaBolt />
                    </div>


                    <div className="automation-info">

                      <div className="automation-title-row">

                        <h3>
                          {automation.name}
                        </h3>

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


                      <p>
                        {automation.description}
                      </p>


                      <div className="automation-flow">

                        <div className="automation-flow-box">

                          <FaCommentDots />

                          <div>

                            <small>
                              TRIGGER
                            </small>

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

                            <small>
                              ACTION
                            </small>

                            <strong>
                              {automation.action}
                            </strong>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* ACTION BUTTONS */}

                  <div className="automation-actions">

                    <button
                      className="automation-action-btn"
                      title={
                        automation.status === "Active"
                          ? "Deactivate"
                          : "Activate"
                      }
                      onClick={() =>
                        toggleAutomation(
                          automation.id
                        )
                      }
                    >
                      <FaPowerOff />
                    </button>


                    <button
                      className="automation-action-btn"
                      title="Edit"
                      onClick={() =>
                        openEditModal(
                          automation
                        )
                      }
                    >
                      <FaEdit />
                    </button>


                    <button
                      className="automation-action-btn delete"
                      title="Delete"
                      onClick={() =>
                        deleteAutomation(
                          automation.id
                        )
                      }
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

              )
            )

          )}

        </div>


        <div className="automation-footer">
          Showing {filteredAutomations.length} of{" "}
          {automations.length} automations
        </div>

      </div>


      {/* ==========================================================
          CREATE / EDIT MODAL
      ========================================================== */}

      {showModal && (

        <div
          className="automation-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="automation-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

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
                type="button"
                className="automation-modal-close"
                onClick={closeModal}
              >
                <FaTimes />
              </button>

            </div>


            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="automation-form-group">

                <label>
                  Automation Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Welcome New Customers"
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this automation does..."
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
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* FOOTER */}

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

    </>
  );
};

export default AutomationPage;