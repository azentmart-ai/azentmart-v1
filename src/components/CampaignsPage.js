import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPlay,
  FaPause,
  FaBullhorn,
  FaTimes,
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

  /* =========================================================
     FILTER + SEARCH
     ========================================================= */

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = Object.values(campaign)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All Campaigns" || campaign.status === filter;

    return matchesSearch && matchesFilter;
  });

  /* =========================================================
     OPEN CREATE MODAL
     ========================================================= */

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

  /* =========================================================
     OPEN EDIT MODAL
     ========================================================= */

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

  /* =========================================================
     CLOSE MODAL
     ========================================================= */

  const closeModal = () => {
    setShowModal(false);
    setEditingCampaign(null);
  };

  /* =========================================================
     FORM CHANGE
     ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     CREATE / UPDATE CAMPAIGN
     ========================================================= */

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

      setCampaigns((current) => [...current, newCampaign]);
    }

    closeModal();
  };

  /* =========================================================
     TOGGLE CAMPAIGN
     ========================================================= */

  const toggleCampaign = (id) => {
    setCampaigns((current) =>
      current.map((campaign) => {
        if (campaign.id !== id) return campaign;

        return {
          ...campaign,
          status:
            campaign.status === "Active" ? "Paused" : "Active",
        };
      })
    );
  };

  /* =========================================================
     DELETE CAMPAIGN
     ========================================================= */

  const deleteCampaign = (id) => {
    const campaign = campaigns.find((item) => item.id === id);

    if (!campaign) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${campaign.name}"?`
    );

    if (!confirmed) return;

    setCampaigns((current) =>
      current.filter((campaign) => campaign.id !== id)
    );
  };

  /* =========================================================
     COUNTS
     ========================================================= */

  const activeCount = campaigns.filter(
    (campaign) => campaign.status === "Active"
  ).length;

  const draftCount = campaigns.filter(
    (campaign) => campaign.status === "Draft"
  ).length;

  const pausedCount = campaigns.filter(
    (campaign) => campaign.status === "Paused"
  ).length;

  return (
    <div className="campaigns-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="campaign-page-header">

        <div>
          <h2>Campaigns</h2>

          <p>
            Create and manage WhatsApp marketing campaigns.
          </p>
        </div>

        <button
          className="add-campaign-btn"
          onClick={openCreateModal}
        >
          <FaPlus />
          Add Campaign
        </button>

      </div>

      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <div className="campaign-summary">

        <div className="campaign-stat-card">
          <div className="campaign-stat-icon">
            <FaBullhorn />
          </div>

          <div>
            <span>Total Campaigns</span>
            <strong>{campaigns.length}</strong>
          </div>
        </div>

        <div className="campaign-stat-card">
          <div className="campaign-stat-icon campaign-active">
            <FaPlay />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="campaign-stat-card">
          <div className="campaign-stat-icon campaign-draft">
            <FaEdit />
          </div>

          <div>
            <span>Draft</span>
            <strong>{draftCount}</strong>
          </div>
        </div>

        <div className="campaign-stat-card">
          <div className="campaign-stat-icon campaign-paused">
            <FaPause />
          </div>

          <div>
            <span>Paused</span>
            <strong>{pausedCount}</strong>
          </div>
        </div>

      </div>

      {/* =====================================================
          SEARCH / FILTER
          ===================================================== */}

      <div className="campaign-toolbar">

        <div className="campaign-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="campaign-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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

      </div>

      {/* =====================================================
          CAMPAIGN LIST
          ===================================================== */}

      <div className="campaign-list">

        {filteredCampaigns.length === 0 ? (
          <div className="campaign-empty">

            <div className="campaign-icon">
              <FaBullhorn />
            </div>

            <h4>No Campaigns Found</h4>

            <p>
              Create a campaign to start reaching your WhatsApp
              contacts.
            </p>

            <button
              className="add-campaign-btn"
              onClick={openCreateModal}
            >
              <FaPlus />
              Add Campaign
            </button>

          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div
              className="campaign-card"
              key={campaign.id}
            >

              {/* LEFT */}

              <div className="campaign-card-left">

                <div className="campaign-card-icon">
                  <FaBullhorn />
                </div>

                <div className="campaign-card-info">

                  <div className="campaign-title-row">

                    <h3>{campaign.name}</h3>

                    <span
                      className={`campaign-status campaign-status-${campaign.status.toLowerCase()}`}
                    >
                      {campaign.status}
                    </span>

                  </div>

                  <p>
                    {campaign.segment} • {campaign.dialer}
                  </p>

                  <div className="campaign-details">

                    <span>
                      <strong>Assistant:</strong>{" "}
                      {campaign.assistant}
                    </span>

                    <span>
                      <strong>Segment:</strong>{" "}
                      {campaign.segment}
                    </span>

                  </div>

                  <div className="campaign-options">

                    {campaign.automation && (
                      <span>Automation</span>
                    )}

                    {campaign.scheduled && (
                      <span>Scheduled</span>
                    )}

                    {campaign.dripMode && (
                      <span>Drip Mode</span>
                    )}

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="campaign-card-actions">

                <button
                  className="campaign-action-btn"
                  title={
                    campaign.status === "Active"
                      ? "Pause campaign"
                      : "Activate campaign"
                  }
                  onClick={() =>
                    toggleCampaign(campaign.id)
                  }
                >
                  {campaign.status === "Active" ? (
                    <FaPause />
                  ) : (
                    <FaPlay />
                  )}
                </button>

                <button
                  className="campaign-action-btn"
                  title="Edit campaign"
                  onClick={() =>
                    openEditModal(campaign)
                  }
                >
                  <FaEdit />
                </button>

                <button
                  className="campaign-action-btn campaign-delete"
                  title="Delete campaign"
                  onClick={() =>
                    deleteCampaign(campaign.id)
                  }
                >
                  <FaTrash />
                </button>

              </div>

            </div>
          ))
        )}

      </div>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <div className="campaign-footer-text">
        Showing {filteredCampaigns.length} of{" "}
        {campaigns.length} campaigns
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
          ===================================================== */}

      {showModal && (
        <div
          className="campaign-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="campaign-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="campaign-modal-header">

              <div>
                <h3>
                  {editingCampaign
                    ? "Edit Campaign"
                    : "Create Campaign"}
                </h3>

                <p>
                  Configure your WhatsApp campaign.
                </p>
              </div>

              <button
                className="campaign-close-btn"
                onClick={closeModal}
                type="button"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={saveCampaign}>

              <div className="campaign-form-group">

                <label>
                  Campaign Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Summer Promotion"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>

              <div className="campaign-form-group">

                <label>
                  Voice Assistant *
                </label>

                <select
                  name="assistant"
                  value={formData.assistant}
                  onChange={handleChange}
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

              <div className="campaign-form-group">

                <label>
                  Dialer *
                </label>

                <select
                  name="dialer"
                  value={formData.dialer}
                  onChange={handleChange}
                >
                  <option>WhatsApp</option>
                  <option>WhatsApp Business</option>
                </select>

              </div>

              <div className="campaign-form-group">

                <label>
                  Segment List *
                </label>

                <select
                  name="segment"
                  value={formData.segment}
                  onChange={handleChange}
                >
                  <option>New Customers</option>
                  <option>Customers</option>
                  <option>Leads</option>
                  <option>Prospects</option>
                  <option>All Contacts</option>
                </select>

              </div>

              <div className="campaign-form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Paused</option>
                </select>

              </div>

              {/* SWITCHES */}

              <div className="campaign-switch">

                <div>
                  <strong>Automation</strong>

                  <small>
                    Enable automated workflow actions.
                  </small>
                </div>

                <input
                  type="checkbox"
                  name="automation"
                  checked={formData.automation}
                  onChange={handleChange}
                />

              </div>

              <div className="campaign-switch">

                <div>
                  <strong>Scheduled</strong>

                  <small>
                    Run this campaign at a scheduled time.
                  </small>
                </div>

                <input
                  type="checkbox"
                  name="scheduled"
                  checked={formData.scheduled}
                  onChange={handleChange}
                />

              </div>

              <div className="campaign-switch">

                <div>
                  <strong>Send in drip mode</strong>

                  <small>
                    Send messages gradually to contacts.
                  </small>
                </div>

                <input
                  type="checkbox"
                  name="dripMode"
                  checked={formData.dripMode}
                  onChange={handleChange}
                />

              </div>

              {/* FOOTER */}

              <div className="campaign-modal-footer">

                <button
                  type="button"
                  className="campaign-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="campaign-save-btn"
                >
                  <FaPlus />

                  {editingCampaign
                    ? "Update Campaign"
                    : "Save Campaign"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default CampaignsPage;