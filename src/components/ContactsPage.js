import React from "react";
import { FaSearch, FaPlus, FaEye, FaEdit } from "react-icons/fa";

function ContactsPage() {

  const contacts = []; // empty for now, backend will fill later

  return (

    <div className="contacts-page">

      {/* HEADER */}

      <div className="contacts-header">

        <h3>Contacts</h3>

        <div className="contacts-actions">

          <div className="contacts-search">

            <input
              type="text"
              placeholder="Search"
            />

            <button className="search-btn">
              <FaSearch />
            </button>

          </div>

          <button className="add-contact-btn">
            <FaPlus /> Add Contact
          </button>

        </div>

      </div>


      {/* TABLE */}

      <div className="contacts-table-wrapper">

        <table className="contacts-table">

          <thead>

            <tr>
              <th>Name</th>
              <th>Segment Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Extension</th>
              <th>Job Title</th>
              <th>Lifecycle Stage</th>
              <th>Lead Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {contacts.length === 0 ? (

              <tr>
                <td colSpan="9" className="no-data">
                  No contacts found
                </td>
              </tr>

            ) : (

              contacts.map((contact, index) => (

                <tr key={index}>

                  <td>{contact.name}</td>
                  <td>{contact.segment}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.extension}</td>
                  <td>{contact.jobTitle}</td>
                  <td>{contact.lifecycle}</td>
                  <td>{contact.status}</td>

                  <td className="action-icons">

                    <FaEye />

                    <FaEdit />

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* ENTRIES FOOTER */}

      <div className="table-footer">

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