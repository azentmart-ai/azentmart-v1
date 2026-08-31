import React from "react";
import {
  FaPhone,
  FaAddressBook,
  FaBullhorn,
  FaHeadset
} from "react-icons/fa";

function AgentDashboardContent() {

  return (

    <div className="dashboard-content">

      {/* METRIC CARDS */}

      <div className="row g-4 mb-4">

        <div className="col-12 col-md-6">
          <div className="dashboard-card">

            <div className="card-header">
              <h6>Total Calls</h6>
              <FaPhone />
            </div>

            <h2>3</h2>

            <div className="card-stats">

              <div>
                <p>Today</p>
                <span>0.00 mins</span>
              </div>

              <div>
                <p>Last 7 Days</p>
                <span>0.00 mins</span>
              </div>

              <div>
                <p>Last 30 Days</p>
                <span>0.38 mins</span>
              </div>

            </div>

          </div>
        </div>


        <div className="col-12 col-md-6">
          <div className="dashboard-card">

            <div className="card-header">
              <h6>Call Limit</h6>
              <FaHeadset />
            </div>

            <h2>10000 mins</h2>

            <div className="card-stats">

              <div>
                <p>Today</p>
                <span>0.00 mins</span>
              </div>

              <div>
                <p>Last 7 Days</p>
                <span>0.00 mins</span>
              </div>

              <div>
                <p>Last 30 Days</p>
                <span>0.38 mins</span>
              </div>

            </div>

          </div>
        </div>


        <div className="col-12 col-md-6">
          <div className="dashboard-card">

            <div className="card-header">
              <h6>Total Contacts</h6>
              <FaAddressBook />
            </div>

            <h2>1</h2>

            <div className="card-stats">

              <div>
                <p>Active Contacts</p>
                <span>1</span>
              </div>

              <div>
                <p>Inactive Contacts</p>
                <span>0</span>
              </div>

            </div>

          </div>
        </div>


        <div className="col-12 col-md-6">
          <div className="dashboard-card">

            <div className="card-header">
              <h6>Total Campaigns</h6>
              <FaBullhorn />
            </div>

            <h2>0</h2>

            <div className="card-stats">

              <div>
                <p>Active Campaigns</p>
                <span>0</span>
              </div>

              <div>
                <p>Inactive Campaigns</p>
                <span>0</span>
              </div>

            </div>

          </div>
        </div>

      </div>



      {/* ANALYTICS */}

      <div className="row g-4 mb-4">

        <div className="col-12 col-lg-4">
          <div className="analytics-box">
            <h6>Call Metrics</h6>
            <div className="analytics-placeholder">
              Chart Area
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="analytics-box">
            <h6>Campaign Performance</h6>
            <div className="analytics-placeholder">
              Total Pages 0
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="analytics-box">
            <h6>Call Sentiment Analysis</h6>
            <div className="analytics-placeholder">
              Total 0
            </div>
          </div>
        </div>

      </div>



      {/* TABLES */}

      <div className="row g-4">

        <div className="col-12 col-xl-6">

          <div className="table-box">

            <div className="table-header">

              <h6>Latest Call Recordings</h6>

              <button className="btn btn-light btn-sm">
                See All
              </button>

            </div>

            <div className="table-responsive">

              <table className="table">

                <thead>
                  <tr>
                    <th>Phone</th>
                    <th>Sentiment</th>
                    <th>Duration</th>
                    <th>Recording</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Call Recording Found
                    </td>
                  </tr>
                </tbody>

              </table>

            </div>

          </div>

        </div>


        <div className="col-12 col-xl-6">

          <div className="table-box">

            <div className="table-header">

              <h6>Campaign Lists</h6>

              <button className="btn btn-light btn-sm">
                See All
              </button>

            </div>

            <div className="table-responsive">

              <table className="table">

                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Assistant</th>
                    <th>Contact</th>
                    <th>Dialer</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Campaign Available
                    </td>
                  </tr>
                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AgentDashboardContent;