import React from "react";
import { FaSyncAlt, FaPlus } from "react-icons/fa";

function PlaygroundPage() {

  return (

    <div className="playground-page">

      {/* HEADER */}

      <div className="playground-header">

        <h3>Playground</h3>

        <div className="playground-actions">

          <select className="filter-select">
            <option>All Sentiments</option>
          </select>

          <select className="filter-select">
            <option>All Call Status</option>
          </select>

          <select className="filter-select">
            <option>All</option>
          </select>

          <button className="refresh-btn">
            <FaSyncAlt /> Refresh
          </button>

          <button className="add-btn">
            <FaPlus /> Add Playground
          </button>

        </div>

      </div>


      {/* TABLE */}

      <div className="playground-table-container">

        <table className="playground-table">

          <thead>

            <tr>
              <th></th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Duration</th>
              <th>Cost</th>
              <th>Called At</th>
              <th>Created At</th>
              <th>Sentiments</th>
              <th>Call Status</th>
              <th>Actions</th>
              <th>Call Outcome</th>
              <th>Feedback</th>
            </tr>

          </thead>

          <tbody>

            {/* No records state */}

            <tr>

              <td colSpan="7" className="no-records">
                No Records Found
              </td>

            </tr>

          </tbody>

        </table>

      </div>


      {/* PAGINATION */}

      <div className="table-footer">

        <select className="entries-select">
          <option>0 entries</option>
        </select>

      </div>

    </div>

  );

}

export default PlaygroundPage;