import React from "react";
import {
  FaSearch,
  FaGlobe,
  FaPhoneAlt,
  FaEllipsisH
} from "react-icons/fa";

function AssistantsPage() {

  const assistants = [
    {
      name: "Outbound voice Agent_Test",
      language: "English",
      description: "Lead Generation and Qualification",
      company: "addresser estates"
    },
    {
      name: "Outbound voice Agent",
      language: "English",
      description: "Sales and Upselling/Cross-Selling",
      company: "addresser estates"
    }
  ];

  return (

    <div className="assistants-page">

      {/* HEADER */}

      <div className="assistants-header">

        <h3>Assistants</h3>

        <div className="assistants-actions">

          {/* SEARCH */}

          <div className="assistant-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search"
            />

          </div>

          {/* CREATE BUTTON */}

          <button className="create-btn">
            + Create Assistant
          </button>

        </div>

      </div>


      {/* ASSISTANT CARDS */}

      <div className="row g-4">

        {assistants.map((assistant,index)=>(

          <div className="col-lg-6 col-12" key={index}>

            <div className="assistant-card">

              {/* TOP */}

              <div className="assistant-top">

                <div className="assistant-info">

                  <div className="assistant-avatar">
                    👨
                  </div>

                  <div>

                    <h5>
                      {assistant.name}
                      <span> ({assistant.language})</span>
                    </h5>

                    <span className="assistant-tag">
                      OUTBOUND
                    </span>

                    <p className="assistant-desc">
                      {assistant.description}
                    </p>

                    <div className="assistant-company">
                      🧳 {assistant.company}
                    </div>

                  </div>

                </div>

                <FaEllipsisH className="assistant-menu"/>

              </div>


              {/* DIVIDER */}

              <hr/>


              {/* BUTTONS */}

              <div className="assistant-actions">

                <button className="role-btn">

                  <FaGlobe/> Role Play

                </button>

                <button className="test-btn">

                  <FaPhoneAlt/> Test

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}

export default AssistantsPage;