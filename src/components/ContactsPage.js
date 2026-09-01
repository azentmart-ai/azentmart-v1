import React, { useState } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit } from "react-icons/fa";

function ContactsPage() {
  const [search, setSearch] = useState("");

  // Temporary frontend data.
  // Later this can be replaced with backend data.
  const contacts = [
    {
      name: "BHUVANESHKUMAR V",
      segment: "Customers",
      email: "bhuvanesh@example.com",
      phone: "+91 918072961256",
      extension: "-",
      jobTitle: "Customer",
      lifecycle: "Customer",
      status: "Active",
    },
    {
      name: "Anu",
      segment: "Leads",
      email: "anu@example.com",
      phone: "+91 919941012695",
      extension: "-",
      jobTitle: "Business Lead",
      lifecycle: "Lead",
      status: "New",
    },
    {
      name: "Sricharan",
      segment: "Prospects",
      email: "sricharan@example.com",
      phone: "+91 918040247513",
      extension: "-",
      jobTitle: "Manager",
      lifecycle: "Prospect",
      status: "Contacted",
    },
    {
      name: "Akhil Meesala",
      segment: "Customers",
      email: "akhil@example.com",
      phone: "+91 9876543210",
      extension: "-",
      jobTitle: "Business Owner",
      lifecycle: "Customer",
      status: "Active",
    },
  ];

  const filteredContacts = contacts.filter((contact) =>
    Object.values(contact)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="contacts-page">

      {/* PAGE HEADER */}
      <div className="contacts-header">
        <div>
          <h2>Contacts</h2>
          <p>Manage and organize your WhatsApp contacts</p>
        </div>

        <div className="contacts-actions">

          {/* SEARCH */}
          <div className="contacts-search">
            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ADD CONTACT */}
          <button className="add-contact-btn">
            <FaPlus />
            Add Contact
          </button>

        </div>
      </div>

      {/* CONTACT SUMMARY */}
      <div className="contacts-summary">

        <div className="contact-stat">
          <span>Total Contacts</span>
          <strong>{contacts.length}</strong>
        </div>

        <div className="contact-stat">
          <span>Active</span>
          <strong>
            {contacts.filter((c) => c.status === "Active").length}
          </strong>
        </div>

        <div className="contact-stat">
          <span>New Leads</span>
          <strong>
            {contacts.filter((c) => c.status === "New").length}
          </strong>
        </div>

      </div>

      {/* TABLE */}
      <div className="contacts-table-wrapper">

        <table className="contacts-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Segment</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Job Title</th>
              <th>Lifecycle Stage</th>
              <th>Lead Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredContacts.length === 0 ? (

              <tr>
                <td colSpan="8" className="no-data">
                  No contacts found
                </td>
              </tr>

            ) : (

              filteredContacts.map((contact, index) => (

                <tr key={index}>

                  <td>
                    <div className="contact-name">
                      <div className="contact-avatar">
                        {contact.name.charAt(0)}
                      </div>

                      <strong>{contact.name}</strong>
                    </div>
                  </td>

                  <td>{contact.segment}</td>

                  <td>{contact.email}</td>

                  <td>{contact.phone}</td>

                  <td>{contact.jobTitle}</td>

                  <td>
                    <span className="lifecycle-badge">
                      {contact.lifecycle}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${contact.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {contact.status}
                    </span>
                  </td>

                  <td>

                    <div className="action-icons">

                      <button title="View">
                        <FaEye />
                      </button>

                      <button title="Edit">
                        <FaEdit />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}
      <div className="table-footer">

        <span>
          Showing {filteredContacts.length} of {contacts.length} contacts
        </span>

        <select>
          <option>20 entries</option>
          <option>50 entries</option>
          <option>100 entries</option>
        </select>

      </div>

    </div>
  );
}

export default ContactsPage;