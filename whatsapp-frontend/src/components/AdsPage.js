import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaBullhorn,
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaPlay,
  FaPause,
  FaChartLine,
} from "react-icons/fa";

function AdsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Ads");

  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  const [ads, setAds] = useState([
    {
      id: 1,
      name: "WhatsApp Summer Promotion",
      description:
        "Promote our premium WhatsApp automation package to new customers.",
      platform: "WhatsApp",
      budget: 15000,
      clicks: 342,
      status: "Active",
    },
    {
      id: 2,
      name: "AI Customer Support Ad",
      description:
        "Reach businesses looking for AI-powered customer support solutions.",
      platform: "Facebook",
      budget: 25000,
      clicks: 518,
      status: "Active",
    },
    {
      id: 3,
      name: "Marketing Automation Campaign",
      description:
        "Promote automated marketing solutions for small businesses.",
      platform: "Instagram",
      budget: 10000,
      clicks: 176,
      status: "Draft",
    },
    {
      id: 4,
      name: "Lead Generation Promotion",
      description:
        "Generate qualified leads through WhatsApp advertising.",
      platform: "WhatsApp",
      budget: 12000,
      clicks: 289,
      status: "Paused",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platform: "WhatsApp",
    budget: "",
    status: "Draft",
  });

  // ============================================================
  // OPEN CREATE MODAL
  // ============================================================
  const openCreateModal = () => {
    setEditingAd(null);

    setFormData({
      name: "",
      description: "",
      platform: "WhatsApp",
      budget: "",
      status: "Draft",
    });

    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================
  const openEditModal = (ad) => {
    setEditingAd(ad);

    setFormData({
      name: ad.name,
      description: ad.description,
      platform: ad.platform,
      budget: ad.budget,
      status: ad.status,
    });

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================
  const closeModal = () => {
    setShowModal(false);
    setEditingAd(null);

    setFormData({
      name: "",
      description: "",
      platform: "WhatsApp",
      budget: "",
      status: "Draft",
    });
  };

  // ============================================================
  // FORM CHANGE
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ============================================================
  // SAVE / UPDATE AD
  // ============================================================
  const saveAd = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.budget
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingAd) {
      // UPDATE EXISTING AD
      setAds((current) =>
        current.map((ad) =>
          ad.id === editingAd.id
            ? {
                ...ad,
                name: formData.name,
                description: formData.description,
                platform: formData.platform,
                budget: Number(formData.budget),
                status: formData.status,
              }
            : ad
        )
      );
    } else {
      // CREATE NEW AD
      const newAd = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        platform: formData.platform,
        budget: Number(formData.budget),
        clicks: 0,
        status: formData.status,
      };

      setAds((current) => [...current, newAd]);
    }

    closeModal();
  };

  // ============================================================
  // TOGGLE ACTIVE / PAUSED
  // ============================================================
  const toggleAd = (id) => {
    setAds((current) =>
      current.map((ad) =>
        ad.id === id
          ? {
              ...ad,
              status:
                ad.status === "Active"
                  ? "Paused"
                  : "Active",
            }
          : ad
      )
    );
  };

  // ============================================================
  // DELETE AD
  // ============================================================
  const deleteAd = (id) => {
    const ad = ads.find((item) => item.id === id);

    const confirmed = window.confirm(
      `Delete "${ad?.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setAds((current) =>
      current.filter((ad) => ad.id !== id)
    );
  };

  // ============================================================
  // SEARCH + FILTER
  // ============================================================
  const filteredAds = ads.filter((ad) => {
    const matchesSearch = Object.values(ad)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All Ads" ||
      ad.status === filter;

    return matchesSearch && matchesFilter;
  });

  // ============================================================
  // SUMMARY
  // ============================================================
  const activeAds = ads.filter(
    (ad) => ad.status === "Active"
  ).length;

  const draftAds = ads.filter(
    (ad) => ad.status === "Draft"
  ).length;

  const pausedAds = ads.filter(
    (ad) => ad.status === "Paused"
  ).length;

  const totalClicks = ads.reduce(
    (total, ad) => total + ad.clicks,
    0
  );

  // ============================================================
  // STATUS CLASS
  // ============================================================
  const getStatusClass = (status) => {
    if (status === "Active") {
      return "ads-status-active";
    }

    if (status === "Draft") {
      return "ads-status-draft";
    }

    return "ads-status-paused";
  };

  // ============================================================
  // PAGE
  // ============================================================
  return (
    <div className="ads-page">

      {/* ========================================================
          HEADER
      ======================================================== */}
      <div className="ads-header">

        <div>
          <h2>Ads</h2>

          <p>
            Create and manage advertising campaigns for your
            WhatsApp business.
          </p>
        </div>

        <button
          className="ads-create-btn"
          onClick={openCreateModal}
        >
          <FaPlus />
          Create Ad
        </button>

      </div>

      {/* ========================================================
          SUMMARY CARDS
      ======================================================== */}
      <div className="ads-summary">

        {/* TOTAL */}
        <div className="ads-stat-card">

          <div className="ads-stat-icon">
            <FaBullhorn />
          </div>

          <div>
            <span>Total Ads</span>
            <strong>{ads.length}</strong>
          </div>

        </div>

        {/* ACTIVE */}
        <div className="ads-stat-card">

          <div className="ads-stat-icon active">
            <FaPlay />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeAds}</strong>
          </div>

        </div>

        {/* DRAFT */}
        <div className="ads-stat-card">

          <div className="ads-stat-icon draft">
            <FaEdit />
          </div>

          <div>
            <span>Draft</span>
            <strong>{draftAds}</strong>
          </div>

        </div>

        {/* PAUSED */}
        <div className="ads-stat-card">

          <div className="ads-stat-icon paused">
            <FaPause />
          </div>

          <div>
            <span>Paused</span>
            <strong>{pausedAds}</strong>
          </div>

        </div>

      </div>

      {/* ========================================================
          SEARCH + FILTER
      ======================================================== */}
      <div className="ads-toolbar">

        <div className="ads-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search ads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          className="ads-filter"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option value="All Ads">
            All Ads
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

      {/* ========================================================
          ADS LIST
      ======================================================== */}
      <div className="ads-list">

        {filteredAds.length === 0 ? (

          <div className="ads-empty">

            <FaBullhorn />

            <h3>No ads found</h3>

            <p>
              Try changing your search or filter.
            </p>

            <button
              className="ads-create-btn"
              onClick={openCreateModal}
            >
              <FaPlus />
              Create Ad
            </button>

          </div>

        ) : (

          filteredAds.map((ad) => (

            <div
              className="ads-item"
              key={ad.id}
            >

              {/* ==================================================
                  LEFT
              ================================================== */}
              <div className="ads-item-left">

                <div className="ads-avatar">
                  <FaBullhorn />
                </div>

                <div className="ads-info">

                  <div className="ads-title-row">

                    <h3>
                      {ad.name}
                    </h3>

                    <span
                      className={`ads-status ${getStatusClass(
                        ad.status
                      )}`}
                    >
                      {ad.status}
                    </span>

                  </div>

                  <p>
                    {ad.description}
                  </p>

                  <div className="ads-details">

                    <span>
                      <strong>Platform:</strong>{" "}
                      {ad.platform}
                    </span>

                    <span>
                      <strong>Budget:</strong>{" "}
                      ₹
                      {Number(
                        ad.budget
                      ).toLocaleString("en-IN")}
                    </span>

                    <span>
                      <FaChartLine />
                      <strong>Clicks:</strong>{" "}
                      {ad.clicks}
                    </span>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  ACTIONS
              ================================================== */}
              <div className="ads-actions">

                <button
                  className="ads-action-btn"
                  title={
                    ad.status === "Active"
                      ? "Pause ad"
                      : "Activate ad"
                  }
                  onClick={() =>
                    toggleAd(ad.id)
                  }
                >
                  {ad.status === "Active" ? (
                    <FaPause />
                  ) : (
                    <FaPowerOff />
                  )}
                </button>

                <button
                  className="ads-action-btn"
                  title="Edit ad"
                  onClick={() =>
                    openEditModal(ad)
                  }
                >
                  <FaEdit />
                </button>

                <button
                  className="ads-action-btn delete"
                  title="Delete ad"
                  onClick={() =>
                    deleteAd(ad.id)
                  }
                >
                  <FaTrash />
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      {/* ========================================================
          FOOTER
      ======================================================== */}
      <div className="ads-footer">

        Showing {filteredAds.length} of{" "}
        {ads.length} ads

        <span className="ads-click-summary">
          Total Clicks: {totalClicks}
        </span>

      </div>

      {/* ========================================================
          CREATE / EDIT MODAL
      ======================================================== */}
      {showModal && (

        <div
          className="ads-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="ads-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ==================================================
                MODAL HEADER
            ================================================== */}
            <div className="ads-modal-header">

              <div>

                <h3>
                  {editingAd
                    ? "Edit Ad"
                    : "Create Ad"}
                </h3>

                <p>
                  {editingAd
                    ? "Update your advertisement details."
                    : "Create a new advertisement campaign."}
                </p>

              </div>

              <button
                className="ads-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* ==================================================
                FORM
            ================================================== */}
            <div className="ads-form">

              <label>
                Ad Name *
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter ad name"
                value={formData.name}
                onChange={handleChange}
              />

              <label>
                Description *
              </label>

              <textarea
                name="description"
                placeholder="Enter ad description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />

              <div className="ads-form-row">

                <div>

                  <label>
                    Platform *
                  </label>

                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                  >

                    <option value="WhatsApp">
                      WhatsApp
                    </option>

                    <option value="Facebook">
                      Facebook
                    </option>

                    <option value="Instagram">
                      Instagram
                    </option>

                  </select>

                </div>

                <div>

                  <label>
                    Budget *
                  </label>

                  <input
                    type="number"
                    name="budget"
                    placeholder="Enter budget"
                    value={formData.budget}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Draft">
                  Draft
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Paused">
                  Paused
                </option>

              </select>

            </div>

            {/* ==================================================
                MODAL FOOTER
            ================================================== */}
            <div className="ads-modal-footer">

              <button
                className="ads-cancel-btn"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="ads-save-btn"
                onClick={saveAd}
              >
                {editingAd
                  ? "Update Ad"
                  : "Save Ad"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ========================================================
          POPUP THEME ONLY
          REST OF PAGE IS NOT CHANGED
      ======================================================== */}
      <style>
        {`

          /* ====================================================
             MODAL OVERLAY
          ==================================================== */

          .ads-modal-overlay {
            position: fixed !important;
            inset: 0 !important;

            width: 100vw !important;
            height: 100vh !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            background: rgba(3, 10, 18, 0.72) !important;

            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;

            z-index: 99999 !important;

            padding: 24px !important;

            box-sizing: border-box !important;
          }


          /* ====================================================
             WHITE OUTER BORDER / FRAME
          ==================================================== */

          .ads-modal {
            width: 540px !important;

            max-width: calc(100vw - 48px) !important;

            max-height: calc(100vh - 48px) !important;

            box-sizing: border-box !important;

            /* WHITE FRAME */
            border: 12px solid #ffffff !important;

            border-radius: 18px !important;

            background: #071c21 !important;

            overflow: hidden !important;

            box-shadow:
              0 30px 80px rgba(0, 0, 0, 0.65),
              0 10px 35px rgba(0, 0, 0, 0.35) !important;

            animation: adsModalIn 0.18s ease-out !important;
          }


          @keyframes adsModalIn {

            from {
              opacity: 0;
              transform: translateY(8px) scale(0.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }

          }


          /* ====================================================
             MODAL HEADER
          ==================================================== */

          .ads-modal-header {
            background: #071c21 !important;

            padding: 20px 20px 18px !important;

            border-bottom: 1px solid #18343b !important;

            display: flex !important;

            align-items: flex-start !important;

            justify-content: space-between !important;

            gap: 16px !important;
          }


          .ads-modal-header h3 {
            margin: 0 !important;

            color: #f8fafc !important;

            font-size: 20px !important;

            font-weight: 700 !important;

            line-height: 1.25 !important;
          }


          .ads-modal-header p {
            margin: 6px 0 0 !important;

            color: #91a4ad !important;

            font-size: 12px !important;

            line-height: 1.5 !important;
          }


          /* ====================================================
             CLOSE BUTTON
          ==================================================== */

          .ads-modal-close {
            width: 34px !important;
            height: 34px !important;

            min-width: 34px !important;

            display: flex !important;

            align-items: center !important;
            justify-content: center !important;

            border: 1px solid #ffffff !important;

            border-radius: 7px !important;

            background: #ffffff !important;

            color: #071c21 !important;

            font-size: 20px !important;

            font-weight: 600 !important;

            line-height: 1 !important;

            cursor: pointer !important;

            transition: 0.15s ease !important;
          }


          .ads-modal-close:hover {
            background: #f1f5f9 !important;

            transform: scale(1.03) !important;
          }


          /* ====================================================
             FORM
          ==================================================== */

          .ads-form {
            background: #071c21 !important;

            padding: 20px !important;
          }


          .ads-form label {
            display: block !important;

            margin: 0 0 7px !important;

            color: #91a4ad !important;

            font-size: 12px !important;

            font-weight: 600 !important;
          }


          .ads-form input,
          .ads-form textarea,
          .ads-form select {
            width: 100% !important;

            box-sizing: border-box !important;

            border: 1px solid #29434a !important;

            border-radius: 7px !important;

            background: #1d3037 !important;

            color: #e5edf0 !important;

            outline: none !important;

            font-size: 13px !important;

            font-family: inherit !important;

            transition:
              border-color 0.15s ease,
              box-shadow 0.15s ease !important;
          }


          .ads-form input {
            height: 40px !important;

            padding: 0 12px !important;

            margin-bottom: 16px !important;
          }


          .ads-form textarea {
            min-height: 92px !important;

            padding: 11px 12px !important;

            resize: vertical !important;

            margin-bottom: 16px !important;
          }


          .ads-form select {
            height: 40px !important;

            padding: 0 12px !important;

            margin-bottom: 0 !important;

            cursor: pointer !important;
          }


          .ads-form input::placeholder,
          .ads-form textarea::placeholder {
            color: #71848c !important;
          }


          .ads-form input:focus,
          .ads-form textarea:focus,
          .ads-form select:focus {
            border-color: #8b5cf6 !important;

            box-shadow:
              0 0 0 2px rgba(
                139,
                92,
                246,
                0.15
              ) !important;
          }


          /* ====================================================
             PLATFORM + BUDGET
          ==================================================== */

          .ads-form-row {
            display: grid !important;

            grid-template-columns:
              1fr 1fr !important;

            gap: 12px !important;

            margin-bottom: 16px !important;
          }


          .ads-form-row > div {
            min-width: 0 !important;
          }


          .ads-form-row input {
            margin-bottom: 0 !important;
          }


          .ads-form-row select {
            margin-bottom: 0 !important;
          }


          /* ====================================================
             MODAL FOOTER
          ==================================================== */

          .ads-modal-footer {
            background: #071c21 !important;

            border-top: 1px solid #18343b !important;

            padding: 14px 20px !important;

            display: flex !important;

            align-items: center !important;

            justify-content: flex-end !important;

            gap: 10px !important;
          }


          /* ====================================================
             CANCEL BUTTON
          ==================================================== */

          .ads-cancel-btn {
            height: 38px !important;

            padding: 0 16px !important;

            border: 1px solid #dbe4e8 !important;

            border-radius: 7px !important;

            background: #ffffff !important;

            color: #334155 !important;

            font-size: 12px !important;

            font-weight: 600 !important;

            cursor: pointer !important;

            transition: 0.15s ease !important;
          }


          .ads-cancel-btn:hover {
            background: #f1f5f9 !important;
          }


          /* ====================================================
             SAVE AD BUTTON
          ==================================================== */

          .ads-save-btn {
            height: 38px !important;

            padding: 0 18px !important;

            border: none !important;

            border-radius: 7px !important;

            background:
              linear-gradient(
                135deg,
                #8b5cf6,
                #7c3aed
              ) !important;

            color: #ffffff !important;

            font-size: 12px !important;

            font-weight: 700 !important;

            cursor: pointer !important;

            box-shadow:
              0 6px 18px
              rgba(
                124,
                58,
                237,
                0.25
              ) !important;

            transition: 0.15s ease !important;
          }


          .ads-save-btn:hover {
            transform: translateY(-1px) !important;

            box-shadow:
              0 8px 22px
              rgba(
                124,
                58,
                237,
                0.35
              ) !important;
          }


          .ads-save-btn:active {
            transform: translateY(0) !important;
          }


          /* ====================================================
             MOBILE
          ==================================================== */

          @media (max-width: 600px) {

            .ads-modal-overlay {
              padding: 14px !important;
            }

            .ads-modal {
              width: 100% !important;

              max-width: 100% !important;

              border-width: 8px !important;

              border-radius: 14px !important;
            }

            .ads-modal-header {
              padding: 16px !important;
            }

            .ads-form {
              padding: 16px !important;
            }

            .ads-modal-footer {
              padding: 12px 16px !important;
            }

            .ads-form-row {
              grid-template-columns: 1fr !important;

              gap: 0 !important;
            }

          }

        `}
      </style>

    </div>
  );
}

export default AdsPage;