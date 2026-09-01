import React, { useMemo, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPlay,
  FaPause,
  FaBullhorn,
  FaTimes,
  FaChevronDown,
  FaCheckCircle,
  FaCalendarAlt,
  FaRobot,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";

function CampaignsPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Campaigns");
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Welcome Campaign",
      assistant: "WhatsApp AI Assistant",
      dialer: "WhatsApp",
      segment: "New Customers",
      status: "Active",
      automation: true,
      scheduled: false,
      dripMode: false,
    },
    {
      id: 2,
      name: "Lead Follow-up",
      assistant: "Sales Assistant",
      dialer: "WhatsApp",
      segment: "Leads",
      status: "Draft",
      automation: true,
      scheduled: true,
      dripMode: false,
    },
    {
      id: 3,
      name: "Customer Promotion",
      assistant: "Marketing Assistant",
      dialer: "WhatsApp",
      segment: "Customers",
      status: "Paused",
      automation: false,
      scheduled: true,
      dripMode: true,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    assistant: "WhatsApp AI Assistant",
    dialer: "WhatsApp",
    segment: "New Customers",
    status: "Active",
    automation: false,
    scheduled: false,
    dripMode: false,
  });

  /* =====================================================
     FILTER + SEARCH
  ===================================================== */

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const searchText = Object.values(campaign)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesFilter =
        filter === "All Campaigns" ||
        campaign.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [campaigns, search, filter]);

  /* =====================================================
     COUNTS
  ===================================================== */

  const activeCount = campaigns.filter(
    (campaign) => campaign.status === "Active"
  ).length;

  const draftCount = campaigns.filter(
    (campaign) => campaign.status === "Draft"
  ).length;

  const pausedCount = campaigns.filter(
    (campaign) => campaign.status === "Paused"
  ).length;

  /* =====================================================
     CREATE
  ===================================================== */

  const openCreateModal = () => {
    setEditingCampaign(null);

    setFormData({
      name: "",
      assistant: "WhatsApp AI Assistant",
      dialer: "WhatsApp",
      segment: "New Customers",
      status: "Active",
      automation: false,
      scheduled: false,
      dripMode: false,
    });

    setShowModal(true);
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);

    setFormData({
      name: campaign.name,
      assistant: campaign.assistant,
      dialer: campaign.dialer,
      segment: campaign.segment,
      status: campaign.status,
      automation: campaign.automation,
      scheduled: campaign.scheduled,
      dripMode: campaign.dripMode,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCampaign(null);
  };

  /* =====================================================
     FORM
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const saveCampaign = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a campaign name.");
      return;
    }

    if (editingCampaign) {
      setCampaigns((current) =>
        current.map((campaign) =>
          campaign.id === editingCampaign.id
            ? {
                ...campaign,
                ...formData,
                name: formData.name.trim(),
              }
            : campaign
        )
      );
    } else {
      const newCampaign = {
        id: Date.now(),
        ...formData,
        name: formData.name.trim(),
      };

      setCampaigns((current) => [
        ...current,
        newCampaign,
      ]);
    }

    closeModal();
  };

  /* =====================================================
     PLAY / PAUSE
  ===================================================== */

  const toggleCampaign = (id) => {
    setCampaigns((current) =>
      current.map((campaign) => {
        if (campaign.id !== id) {
          return campaign;
        }

        return {
          ...campaign,
          status:
            campaign.status === "Active"
              ? "Paused"
              : "Active",
        };
      })
    );
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteCampaign = (id) => {
    const campaign = campaigns.find(
      (item) => item.id === id
    );

    if (!campaign) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${campaign.name}"?`
    );

    if (!confirmed) return;

    setCampaigns((current) =>
      current.filter(
        (campaign) => campaign.id !== id
      )
    );
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const getStatusStyle = (status) => {
    if (status === "Active") {
      return {
        background: "rgba(16, 185, 129, 0.14)",
        color: "#34d399",
        border:
          "1px solid rgba(16, 185, 129, 0.28)",
      };
    }

    if (status === "Draft") {
      return {
        background: "rgba(139, 92, 246, 0.14)",
        color: "#a78bfa",
        border:
          "1px solid rgba(139, 92, 246, 0.28)",
      };
    }

    return {
      background: "rgba(100, 116, 139, 0.16)",
      color: "#94a3b8",
      border:
        "1px solid rgba(100, 116, 139, 0.28)",
    };
  };

  /* =====================================================
     STAT CARD
  ===================================================== */

  const StatCard = ({
    icon,
    title,
    value,
    iconClass,
  }) => {
    return (
      <div style={styles.statCard}>
        <div
          style={{
            ...styles.statIcon,
            ...styles[iconClass],
          }}
        >
          {icon}
        </div>

        <div style={styles.statContent}>
          <span style={styles.statTitle}>
            {title}
          </span>

          <strong style={styles.statValue}>
            {value}
          </strong>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="campaign-page"
        style={styles.page}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="campaign-header"
          style={styles.header}
        >
          <div>
            <h1 style={styles.pageTitle}>
              Campaigns
            </h1>

            <p style={styles.pageSubtitle}>
              Create and manage WhatsApp marketing campaigns.
            </p>
          </div>

          <button
            style={styles.primaryButton}
            onClick={openCreateModal}
          >
            <FaPlus size={14} />
            Add Campaign
          </button>
        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div
          className="campaign-stats-grid"
          style={styles.statsGrid}
        >
          <StatCard
            icon={<FaBullhorn />}
            title="Total Campaigns"
            value={campaigns.length}
            iconClass="blueIcon"
          />

          <StatCard
            icon={<FaPlay />}
            title="Active"
            value={activeCount}
            iconClass="greenIcon"
          />

          <StatCard
            icon={<FaEdit />}
            title="Draft"
            value={draftCount}
            iconClass="purpleIcon"
          />

          <StatCard
            icon={<FaPause />}
            title="Paused"
            value={pausedCount}
            iconClass="grayIcon"
          />
        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div
          className="campaign-toolbar"
          style={styles.toolbar}
        >
          <div style={styles.searchBox}>
            <FaSearch
              size={17}
              color="#7890a0"
            />

            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={styles.searchInput}
            />
          </div>

          {/* IMPORTANT:
              wrapper is explicitly transparent
          */}

          <div
            className="campaign-filter"
            style={styles.filterWrapper}
          >
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              style={styles.filterSelect}
            >
              <option value="All Campaigns">
                All Campaigns
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Draft">
                Draft
              </option>

              <option value="Paused">
                Paused
              </option>
            </select>

            <FaChevronDown
              size={12}
              style={styles.filterArrow}
            />
          </div>
        </div>

        {/* =================================================
            CAMPAIGN LIST
        ================================================= */}

        <div style={styles.campaignList}>

          {filteredCampaigns.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <FaBullhorn />
              </div>

              <h3 style={styles.emptyTitle}>
                No Campaigns Found
              </h3>

              <p style={styles.emptyText}>
                Create a campaign to start reaching
                your WhatsApp contacts.
              </p>

              <button
                style={styles.primaryButton}
                onClick={openCreateModal}
              >
                <FaPlus size={14} />
                Add Campaign
              </button>
            </div>
          ) : (
            filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="campaign-card"
                style={{
                  ...styles.campaignCard,
                  ...(campaign.status === "Active"
                    ? styles.activeCard
                    : {}),
                }}
              >

                {/* =================================================
                    LEFT
                ================================================= */}

                <div style={styles.campaignLeft}>

                  <div style={styles.campaignIcon}>
                    <FaBullhorn />
                  </div>

                  <div style={styles.campaignInfo}>

                    <div style={styles.titleRow}>

                      <h3
                        className="campaign-title"
                        style={styles.campaignTitle}
                      >
                        {campaign.name}
                      </h3>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(
                            campaign.status
                          ),
                        }}
                      >
                        <span
                          style={styles.statusDot}
                        />

                        {campaign.status}
                      </span>

                    </div>

                    <div style={styles.channelRow}>

                      <span>
                        {campaign.segment}
                      </span>

                      <span style={styles.separator}>
                        •
                      </span>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <FaWhatsapp size={13} />
                        {campaign.dialer}
                      </span>

                    </div>

                    <div
                      className="campaign-details"
                      style={styles.detailsRow}
                    >

                      <span style={styles.detailItem}>
                        <FaRobot size={13} />

                        <strong>
                          Assistant:
                        </strong>

                        {campaign.assistant}
                      </span>

                      <span style={styles.detailItem}>
                        <FaUsers size={13} />

                        <strong>
                          Segment:
                        </strong>

                        {campaign.segment}
                      </span>

                    </div>

                    <div style={styles.optionsRow}>

                      {campaign.automation && (
                        <span
                          style={styles.optionBadge}
                        >
                          <FaCheckCircle
                            size={10}
                          />

                          Automation
                        </span>
                      )}

                      {campaign.scheduled && (
                        <span
                          style={styles.optionBadge}
                        >
                          <FaCalendarAlt
                            size={10}
                          />

                          Scheduled
                        </span>
                      )}

                      {campaign.dripMode && (
                        <span
                          style={styles.optionBadge}
                        >
                          Drip Mode
                        </span>
                      )}

                    </div>

                  </div>
                </div>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div
                  className="campaign-actions"
                  style={styles.actionContainer}
                >
                  <button
                    type="button"
                    title={
                      campaign.status === "Active"
                        ? "Pause campaign"
                        : "Activate campaign"
                    }
                    onClick={() =>
                      toggleCampaign(
                        campaign.id
                      )
                    }
                    style={styles.actionButton}
                  >
                    {campaign.status === "Active" ? (
                      <FaPause />
                    ) : (
                      <FaPlay />
                    )}
                  </button>

                  <button
                    type="button"
                    title="Edit campaign"
                    onClick={() =>
                      openEditModal(campaign)
                    }
                    style={styles.actionButton}
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    title="Delete campaign"
                    onClick={() =>
                      deleteCampaign(
                        campaign.id
                      )
                    }
                    style={{
                      ...styles.actionButton,
                      ...styles.deleteButton,
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>

              </div>
            ))
          )}

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div style={styles.footer}>
          Showing{" "}
          <strong>
            {filteredCampaigns.length}
          </strong>{" "}
          of{" "}
          <strong>
            {campaigns.length}
          </strong>{" "}
          campaigns
        </div>

      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {showModal && (
        <div
          style={styles.modalOverlay}
          onClick={closeModal}
        >
          <div
            style={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  {editingCampaign
                    ? "Edit Campaign"
                    : "Create Campaign"}
                </h2>

                <p style={styles.modalSubtitle}>
                  Configure your WhatsApp campaign.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                style={styles.closeButton}
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={saveCampaign}
              style={styles.form}
            >

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Campaign Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Summer Promotion"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.formInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Voice Assistant *
                </label>

                <select
                  name="assistant"
                  value={formData.assistant}
                  onChange={handleChange}
                  style={styles.formInput}
                >
                  <option>
                    WhatsApp AI Assistant
                  </option>

                  <option>
                    Sales Assistant
                  </option>

                  <option>
                    Marketing Assistant
                  </option>

                  <option>
                    Customer Support Assistant
                  </option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Dialer *
                </label>

                <select
                  name="dialer"
                  value={formData.dialer}
                  onChange={handleChange}
                  style={styles.formInput}
                >
                  <option>
                    WhatsApp
                  </option>

                  <option>
                    WhatsApp Business
                  </option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Segment List *
                </label>

                <select
                  name="segment"
                  value={formData.segment}
                  onChange={handleChange}
                  style={styles.formInput}
                >
                  <option>
                    New Customers
                  </option>

                  <option>
                    Customers
                  </option>

                  <option>
                    Leads
                  </option>

                  <option>
                    Prospects
                  </option>

                  <option>
                    All Contacts
                  </option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={styles.formInput}
                >
                  <option>
                    Active
                  </option>

                  <option>
                    Draft
                  </option>

                  <option>
                    Paused
                  </option>
                </select>
              </div>

              {/* AUTOMATION */}

              <div style={styles.switchGroup}>
                <div>
                  <strong style={styles.switchTitle}>
                    Automation
                  </strong>

                  <small
                    style={styles.switchDescription}
                  >
                    Enable automated workflow actions.
                  </small>
                </div>

                <input
                  type="checkbox"
                  name="automation"
                  checked={formData.automation}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
              </div>

              {/* SCHEDULED */}

              <div style={styles.switchGroup}>
                <div>
                  <strong style={styles.switchTitle}>
                    Scheduled
                  </strong>

                  <small
                    style={styles.switchDescription}
                  >
                    Run this campaign at a scheduled time.
                  </small>
                </div>

                <input
                  type="checkbox"
                  name="scheduled"
                  checked={formData.scheduled}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
              </div>

              {/* DRIP */}

              <div style={styles.switchGroup}>
                <div>
                  <strong style={styles.switchTitle}>
                    Send in drip mode
                  </strong>

                  <small
                    style={styles.switchDescription}
                  >
                    Send messages gradually to contacts.
                  </small>
                </div>

                <input
                  type="checkbox"
                  name="dripMode"
                  checked={formData.dripMode}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
              </div>

              {/* MODAL FOOTER */}

              <div style={styles.modalFooter}>

                <button
                  type="button"
                  onClick={closeModal}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  <FaPlus size={13} />

                  {editingCampaign
                    ? "Update Campaign"
                    : "Save Campaign"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          background: #071014 !important;
        }

        button,
        input,
        select {
          font-family: inherit;
        }

        button {
          transition:
            transform 0.15s ease,
            opacity 0.15s ease,
            border-color 0.15s ease,
            background 0.15s ease,
            box-shadow 0.15s ease;
        }

        button:hover {
          opacity: 0.94;
        }

        button:active {
          transform: scale(0.98);
        }

        /* =========================================
           FIX WHITE FILTER BACKGROUND
        ========================================= */

        .campaign-filter {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
        }

        .campaign-filter select {
          background: #1b2a31 !important;
          color: #dbeafe !important;
          border: 1px solid #293d46 !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .campaign-filter select:focus {
          background: #1b2a31 !important;
          color: #f8fafc !important;
          border-color: #3c5966 !important;
          outline: none !important;
          box-shadow: 0 0 0 2px
            rgba(124, 58, 237, 0.12) !important;
        }

        .campaign-filter select:hover {
          background: #1f3038 !important;
        }

        /* Browser option styling */

        .campaign-filter option {
          background: #17262d !important;
          color: #f8fafc !important;
        }

        /* =========================================
           SEARCH
        ========================================= */

        .campaign-page input::placeholder {
          color: #7890a0;
          opacity: 1;
        }

        /* =========================================
           CARD HOVER
        ========================================= */

        .campaign-card:hover {
          background: #1a2b33 !important;
          border-color: #31505b !important;
        }

        .campaign-card:hover
        .campaign-actions button {
          border-color: #49616c;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 1200px) {

          .campaign-stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr)) !important;
          }

        }

        @media (max-width: 850px) {

          .campaign-toolbar {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .campaign-filter {
            width: 100% !important;
          }

          .campaign-card {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .campaign-actions {
            justify-content: flex-end !important;
            padding-top: 16px;
            border-top: 1px solid #263c45;
          }

        }

        @media (max-width: 650px) {

          .campaign-stats-grid {
            grid-template-columns: 1fr !important;
          }

          .campaign-details {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }

        }

        @media (max-width: 500px) {

          .campaign-page {
            padding: 28px 20px 45px !important;
          }

          .campaign-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .campaign-header button {
            width: 100%;
          }

          .campaign-title {
            font-size: 19px !important;
          }

        }

      `}</style>
    </>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = {

  /* =====================================================
     PAGE
  ===================================================== */

  page: {
    width: "100%",
    minHeight: "100vh",
    padding: "48px 62px 70px",
    background: "#071014",
    color: "#f8fafc",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    marginBottom: "38px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "34px",
    lineHeight: 1.2,
    fontWeight: 750,
    letterSpacing: "-0.7px",
    color: "#f8fafc",
  },

  pageSubtitle: {
    margin: "10px 0 0",
    color: "#8fa7b9",
    fontSize: "15px",
    lineHeight: 1.5,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    border: "none",
    borderRadius: "8px",
    padding: "14px 21px",
    minHeight: "46px",
    background:
      "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    color: "#fff",
    fontWeight: 650,
    fontSize: "14px",
    cursor: "pointer",
    boxShadow:
      "0 8px 26px rgba(124, 58, 237, 0.20)",
  },

  /* =====================================================
     STATS
  ===================================================== */

  statsGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    minHeight: "100px",
    display: "flex",
    alignItems: "center",
    gap: "17px",
    padding: "20px",
    background: "#0d191e",
    border: "1px solid #203038",
    borderRadius: "10px",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    fontSize: "18px",
  },

  blueIcon: {
    background:
      "rgba(59, 130, 246, 0.13)",
    color: "#60a5fa",
  },

  greenIcon: {
    background:
      "rgba(16, 185, 129, 0.13)",
    color: "#10b981",
  },

  purpleIcon: {
    background:
      "rgba(139, 92, 246, 0.13)",
    color: "#a78bfa",
  },

  grayIcon: {
    background:
      "rgba(100, 116, 139, 0.13)",
    color: "#94a3b8",
  },

  statContent: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  statTitle: {
    color: "#91a8b9",
    fontSize: "14px",
    lineHeight: 1.2,
  },

  statValue: {
    color: "#10b981",
    fontSize: "26px",
    lineHeight: 1,
    fontWeight: 750,
  },

  /* =====================================================
     TOOLBAR
  ===================================================== */

  toolbar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    marginBottom: "18px",
  },

  searchBox: {
    flex: 1,
    maxWidth: "560px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px",
    background: "#1b2a31",
    border: "1px solid #293d46",
    borderRadius: "8px",
    boxShadow: "none",
  },

  searchInput: {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#f8fafc",
    fontSize: "15px",
  },

  /* THIS FIXES THE WHITE AREA */

  filterWrapper: {
    position: "relative",
    minWidth: "190px",
    height: "48px",
    background: "transparent",
    border: "none",
    padding: 0,
    margin: 0,
    boxShadow: "none",
  },

  filterSelect: {
    width: "100%",
    height: "48px",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    padding: "0 42px 0 16px",
    borderRadius: "8px",
    border:
      "1px solid #293d46",
    background: "#1b2a31",
    color: "#dbeafe",
    outline: "none",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "none",
  },

  filterArrow: {
    position: "absolute",
    right: "16px",
    top: "18px",
    color: "#94a3b8",
    pointerEvents: "none",
  },

  /* =====================================================
     CAMPAIGN LIST
  ===================================================== */

  campaignList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
  },

  campaignCard: {
    width: "100%",
    minHeight: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    padding: "22px 24px",
    background: "#17262d",
    border:
      "1px solid #263c45",
    borderRadius: "10px",
    transition:
      "background 0.15s ease, border-color 0.15s ease",
  },

  activeCard: {
    borderColor: "#008f83",
  },

  campaignLeft: {
    minWidth: 0,
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    gap: "18px",
  },

  campaignIcon: {
    width: "44px",
    height: "44px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    background: "#0e2428",
    border:
      "1px solid #28454a",
    color: "#dbeafe",
    fontSize: "17px",
  },

  campaignInfo: {
    minWidth: 0,
    flex: 1,
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },

  campaignTitle: {
    margin: 0,
    fontSize: "19px",
    lineHeight: 1.25,
    fontWeight: 700,
    color: "#f8fafc",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "5px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 650,
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "currentColor",
  },

  channelRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "9px",
    marginTop: "9px",
    color: "#8da3b8",
    fontSize: "14px",
  },

  separator: {
    color: "#526873",
  },

  detailsRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "32px",
    marginTop: "15px",
    color: "#a4b6c1",
    fontSize: "13px",
  },

  detailItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
  },

  optionsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "14px",
  },

  optionBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 10px",
    borderRadius: "6px",
    background: "#f1f5f9",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 550,
  },

  /* =====================================================
     ACTIONS
  ===================================================== */

  actionContainer: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  actionButton: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "1px solid #d8dee3",
    borderRadius: "7px",
    background: "#fff",
    color: "#334155",
    cursor: "pointer",
    fontSize: "14px",
  },

  deleteButton: {
    color: "#ef4444",
  },

  /* =====================================================
     FOOTER
  ===================================================== */

  footer: {
    padding: "20px 5px",
    color: "#718895",
    fontSize: "14px",
  },

  /* =====================================================
     EMPTY
  ===================================================== */

  emptyState: {
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "45px",
    border:
      "1px solid #203038",
    borderRadius: "10px",
    background: "#0d191e",
    textAlign: "center",
  },

  emptyIcon: {
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "13px",
    background:
      "rgba(139, 92, 246, 0.12)",
    color: "#a78bfa",
    fontSize: "23px",
    marginBottom: "17px",
  },

  emptyTitle: {
    margin: "0 0 9px",
    fontSize: "20px",
  },

  emptyText: {
    margin: "0 0 22px",
    color: "#8196a4",
    fontSize: "14px",
  },

  /* =====================================================
     MODAL
  ===================================================== */

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background:
      "rgba(2, 8, 12, 0.78)",
    backdropFilter: "blur(5px)",
  },

  modal: {
    width: "100%",
    maxWidth: "650px",
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#0d191e",
    border:
      "1px solid #29404a",
    borderRadius: "13px",
    boxShadow:
      "0 25px 80px rgba(0,0,0,0.5)",
  },

  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "25px 27px",
    borderBottom:
      "1px solid #203038",
  },

  modalTitle: {
    margin: 0,
    fontSize: "23px",
    fontWeight: 700,
  },

  modalSubtitle: {
    margin: "7px 0 0",
    color: "#8196a4",
    fontSize: "14px",
  },

  closeButton: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border:
      "1px solid #293d46",
    borderRadius: "7px",
    background: "#14232a",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
  },

  form: {
    padding: "26px 27px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
    marginBottom: "19px",
  },

  formLabel: {
    color: "#dbe4ea",
    fontSize: "14px",
    fontWeight: 650,
  },

  formInput: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    borderRadius: "8px",
    border:
      "1px solid #293d46",
    background: "#14232a",
    color: "#f8fafc",
    outline: "none",
    fontSize: "14px",
  },

  switchGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "17px",
    marginBottom: "10px",
    border:
      "1px solid #22353d",
    borderRadius: "9px",
    background: "#101e23",
  },

  switchTitle: {
    display: "block",
    color: "#e5edf2",
    fontSize: "14px",
  },

  switchDescription: {
    display: "block",
    marginTop: "5px",
    color: "#738894",
    fontSize: "12px",
  },

  checkbox: {
    width: "20px",
    height: "20px",
    accentColor: "#8b5cf6",
    cursor: "pointer",
  },

  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "11px",
    marginTop: "24px",
    paddingTop: "20px",
    borderTop:
      "1px solid #203038",
  },

  cancelButton: {
    height: "44px",
    padding: "0 19px",
    borderRadius: "8px",
    border:
      "1px solid #30444d",
    background: "#14232a",
    color: "#b8c7cf",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  saveButton: {
    height: "44px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "0 20px",
    border: "none",
    borderRadius: "8px",
    background:
      "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 650,
    cursor: "pointer",
  },
};

export default CampaignsPage;