import React, { useState } from "react";
import { FaSearch, FaPlus, FaArrowLeft } from "react-icons/fa";

function KnowledgeBasePage() {

  const [createMode, setCreateMode] = useState(false);
  const [activeTab, setActiveTab] = useState("faq");

  if (createMode) {

    return (

      <div className="knowledge-create">

        {/* HEADER */}

        <div className="knowledge-create-header">

          <h3>Create Knowledge Base</h3>

          <button
            className="back-btn"
            onClick={() => setCreateMode(false)}
          >
            <FaArrowLeft /> Go Back
          </button>

        </div>


        {/* TABS */}

        <div className="kb-tabs">

          <button
            className={activeTab === "faq" ? "kb-active" : ""}
            onClick={() => setActiveTab("faq")}
          >
            FAQ Mode
          </button>

          <button
            className={activeTab === "doc" ? "kb-active" : ""}
            onClick={() => setActiveTab("doc")}
          >
            Document Upload
          </button>

          <button
            className={activeTab === "scrape" ? "kb-active" : ""}
            onClick={() => setActiveTab("scrape")}
          >
            Website Scrape
          </button>

        </div>


        {/* FORM */}

        <div className="kb-form">

          <div className="kb-row">

            <div className="kb-field">

              <label>Title</label>

              <input placeholder="Enter Title" />

            </div>


            <div className="kb-field">

              <label>Language</label>

              <select>
                <option>English</option>
              </select>

            </div>

          </div>


          {/* UPLOAD BOX */}

          <div className="kb-upload-box">

            <div className="upload-icon">⬆</div>

            <p>Add To Knowledge Base</p>

          </div>

        </div>


        {/* FOOTER */}

        <div className="kb-submit">

          <button className="submit-btn">
            Submit
          </button>

        </div>

      </div>

    );

  }

  return (

    <div className="knowledge-page">

      {/* HEADER */}

      <div className="knowledge-header">

        <h3>Knowledge Base</h3>

        <div className="knowledge-actions">

          <div className="knowledge-search">

            <input placeholder="Search"/>

            <FaSearch/>

          </div>

          <button
            className="new-kb-btn"
            onClick={() => setCreateMode(true)}
          >
            <FaPlus/> New Knowledge Base
          </button>

        </div>

      </div>


      {/* EMPTY STATE */}

      <div className="knowledge-empty">

        <div className="kb-icon">📖</div>

        <h3>No Knowledge Base</h3>

        <p>
          Get started by creating a new Knowledge Base.
        </p>

        <button
          className="new-kb-btn"
          onClick={() => setCreateMode(true)}
        >
          <FaPlus/> New Knowledge Base
        </button>

      </div>

    </div>

  );

}

export default KnowledgeBasePage;