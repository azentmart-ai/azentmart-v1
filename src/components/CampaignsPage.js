import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";

function CampaignsPage() {

  const [showModal, setShowModal] = useState(false);

  return (

    <div className="campaigns-page">

      {/* HEADER */}

      <div className="campaign-header">

        <h3>Campaigns</h3>

        <div className="campaign-actions">

          <div className="campaign-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search"
            />

          </div>

          <button
            className="add-campaign-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Add Campaign
          </button>

        </div>

      </div>


      {/* EMPTY STATE */}

      <div className="campaign-empty">

        <div className="campaign-icon">
          📢
        </div>

        <h4>No Campaigns</h4>

        <p>
          Get started by creating a new campaigns.
        </p>

        <button
          className="add-campaign-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Campaign
        </button>

      </div>



      {/* MODAL */}

      {showModal && (

        <div className="campaign-modal-overlay">

          <div className="campaign-modal">

            <div className="modal-header">

              <h4>Create Campaign</h4>

              <span
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </span>

            </div>


            {/* FORM */}

            <div className="campaign-form">

              <label>Campaign Name *</label>
              <input type="text" />

              <label>Voice Assistant *</label>
              <select>
                <option>Select...</option>
              </select>

              <label>Dialer *</label>
              <select>
                <option>Select...</option>
              </select>

              <label>Segment List *</label>
              <select>
                <option>Select...</option>
              </select>


              {/* SWITCH OPTIONS */}

              <div className="campaign-switch">
                <span>Automation</span>
                <input type="checkbox" />
              </div>

              <div className="campaign-switch">
                <span>Scheduled</span>
                <input type="checkbox" />
              </div>

              <div className="campaign-switch">
                <span>Send IN drip mode</span>
                <input type="checkbox" />
              </div>

            </div>


            {/* FOOTER */}

            <div className="campaign-footer">

              <button className="save-btn">
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default CampaignsPage;