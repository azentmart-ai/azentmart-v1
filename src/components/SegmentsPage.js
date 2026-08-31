import React, { useState } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

function SegmentsPage() {

  const [segments, setSegments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {

    if (!form.name || !form.description) return;

    const newSegment = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      contacts: 0
    };

    setSegments([...segments, newSegment]);

    setForm({
      name: "",
      description: ""
    });

    setShowModal(false);
  };

  return (

    <div className="segments-page">

      {/* HEADER */}

      <div className="segments-header">

        <h3>Segments</h3>

        <div className="segments-actions">

          <div className="segments-search">

            <input placeholder="Search"/>

            <button className="search-btn">
              <FaSearch/>
            </button>

          </div>

          <button
            className="add-segment-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus/> Add Segment
          </button>

        </div>

      </div>


      {/* SEGMENTS GRID */}

      <div className="segments-grid">

        {segments.length === 0 && (

          <p className="no-data">
            No segments available
          </p>

        )}

        {segments.map((segment) => (

          <div className="segment-card" key={segment.id}>

            <div className="segment-card-top">

              <div>

                <h4>{segment.name}</h4>

                <p>{segment.description}</p>

              </div>

              <span className="segment-count">
                {segment.contacts}
              </span>

            </div>


            <div className="segment-actions">

              <button className="view-btn">
                <FaEye/>
              </button>

              <button className="edit-btn">
                <FaEdit/>
              </button>

              <button className="delete-btn">
                <FaTrash/>
              </button>

            </div>

          </div>

        ))}

      </div>


      {/* ENTRIES */}

      <div className="entries-footer">

        <select>

          <option>10 entries</option>
          <option>20 entries</option>

        </select>

      </div>


      {/* ADD SEGMENT MODAL */}

      {showModal && (

        <div className="segment-modal-overlay">

          <div className="segment-modal">

            <div className="modal-header">

              <h4>Add Segment</h4>

              <span
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </span>

            </div>


            <div className="segment-form">

              <label>Name *</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <label>Description *</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />

            </div>


            <div className="modal-footer">

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="create-btn"
                onClick={handleSubmit}
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default SegmentsPage;