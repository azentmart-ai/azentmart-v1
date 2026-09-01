import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaCloudUploadAlt,
  FaDownload,
  FaPlus,
  FaChevronDown,
  FaEye,
  FaEdit,
  FaTrash,
  FaPhoneAlt,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import { apiRequest } from "../api";

import "./Contacts.css";

function Contacts() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    extension: "",
    jobTitle: "",
    tag: "",
    lifecycle: "Lead",
    leadStatus: "New",
  });

  // =========================================================
  // ERROR MESSAGE HELPER
  // =========================================================

  const getErrorMessage = (err, fallback) => {
    const responseData = err?.response?.data ?? err?.data ?? err;

    if (typeof responseData === "string") {
      return responseData;
    }

    if (responseData?.detail) {
      if (typeof responseData.detail === "string") {
        return responseData.detail;
      }

      try {
        return JSON.stringify(responseData.detail);
      } catch {
        return fallback;
      }
    }

    if (responseData?.message) {
      if (typeof responseData.message === "string") {
        return responseData.message;
      }

      try {
        return JSON.stringify(responseData.message);
      } catch {
        return fallback;
      }
    }

    if (err?.message) {
      return err.message;
    }

    if (responseData && typeof responseData === "object") {
      try {
        return JSON.stringify(responseData);
      } catch {
        return fallback;
      }
    }

    return fallback;
  };

  // =========================================================
  // LOAD CONTACTS FROM DATABASE
  // =========================================================

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/api/contacts/");

      console.log("Contacts API response:", response);

      const data = Array.isArray(response)
        ? response
        : response?.contacts || response?.data || [];

      const formattedContacts = data.map((contact) => {
        const nameParts = (contact.name || "")
          .trim()
          .split(/\s+/);

        return {
          id: contact.id,

          firstName: nameParts[0] || "",

          lastName:
            nameParts.slice(1).join(" ") || "",

          email: contact.email || "",

          phone: contact.phone || "",

          extension:
            contact.extension || "-",

          jobTitle:
            contact.job_title ||
            contact.jobTitle ||
            "",

          tag:
            contact.segment || "-",

          lifecycle:
            contact.lifecycle || "Lead",

          leadStatus:
            contact.status || "New",

          userId:
            contact.user_id,

          language:
            contact.language,

          source:
            contact.source,

          active:
            contact.active,
        };
      });

      setContacts(formattedContacts);

    } catch (err) {
      console.error(
        "Failed to load contacts:",
        err
      );

      const message = getErrorMessage(
        err,
        "Unable to load contacts from the database."
      );

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD DB CONTACTS WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    loadContacts();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredContacts = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    if (!value) {
      return contacts;
    }

    return contacts.filter((contact) =>
      [
        contact.firstName,
        contact.lastName,
        contact.email,
        contact.phone,
        contact.jobTitle,
        contact.tag,
        contact.lifecycle,
        contact.leadStatus,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [contacts, search]);

  // =========================================================
  // CREATE
  // =========================================================

  const openCreate = () => {
    setEditingId(null);

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      extension: "",
      jobTitle: "",
      tag: "",
      lifecycle: "Lead",
      leadStatus: "New",
    });

    setShowCreateMenu(false);
    setShowDrawer(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const openEdit = (contact) => {
    setEditingId(contact.id);

    setForm({
      firstName:
        contact.firstName || "",

      lastName:
        contact.lastName || "",

      email:
        contact.email || "",

      phone:
        (contact.phone || "")
          .replace("+91 ", "")
          .replace("+91", "")
          .trim(),

      extension:
        contact.extension === "-"
          ? ""
          : contact.extension || "",

      jobTitle:
        contact.jobTitle || "",

      tag:
        contact.tag === "-"
          ? ""
          : contact.tag || "",

      lifecycle:
        contact.lifecycle || "Lead",

      leadStatus:
        contact.leadStatus || "New",
    });

    setShowCreateMenu(false);
    setShowDrawer(true);
  };

  // =========================================================
  // CLOSE DRAWER
  // =========================================================

  const closeDrawer = () => {
    if (saving) {
      return;
    }

    setShowDrawer(false);
    setEditingId(null);
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE / UPDATE CONTACT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName.trim()) {
      alert("First Name is required.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Phone Number is required.");
      return;
    }

    const fullName =
      `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

    const payload = {
      name: fullName,

      segment:
        form.tag.trim() || "",

      email:
        form.email.trim() || "",

      phone:
        form.phone.trim(),

      extension:
        form.extension.trim() || "",

      job_title:
        form.jobTitle.trim() || "",

      lifecycle:
        form.lifecycle || "Lead",

      status:
        form.leadStatus || "New",

      language:
        "English",
    };

    try {
      setSaving(true);
      setError("");

      // =====================================================
      // UPDATE
      // =====================================================

      if (editingId) {
        const updated = await apiRequest(
          `/api/contacts/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        console.log(
          "Updated contact:",
          updated
        );

        const nameParts =
          (updated.name || fullName)
            .trim()
            .split(/\s+/);

        const updatedContact = {
          id: updated.id,

          firstName:
            nameParts[0] || "",

          lastName:
            nameParts
              .slice(1)
              .join(" ") || "",

          email:
            updated.email || "",

          phone:
            updated.phone || "",

          extension:
            updated.extension || "-",

          jobTitle:
            updated.job_title ||
            updated.jobTitle ||
            "",

          tag:
            updated.segment || "-",

          lifecycle:
            updated.lifecycle || "Lead",

          leadStatus:
            updated.status || "New",

          userId:
            updated.user_id,
        };

        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === editingId
              ? updatedContact
              : contact
          )
        );

        closeDrawer();

        alert(
          "Contact updated successfully."
        );

        return;
      }

      // =====================================================
      // CREATE
      // =====================================================

      const created = await apiRequest(
        "/api/contacts/",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      console.log(
        "Created contact:",
        created
      );

      const nameParts =
        (created.name || fullName)
          .trim()
          .split(/\s+/);

      const newContact = {
        id: created.id,

        firstName:
          nameParts[0] || "",

        lastName:
          nameParts
            .slice(1)
            .join(" ") || "",

        email:
          created.email || "",

        phone:
          created.phone || "",

        extension:
          created.extension || "-",

        jobTitle:
          created.job_title ||
          created.jobTitle ||
          "",

        tag:
          created.segment || "-",

        lifecycle:
          created.lifecycle || "Lead",

        leadStatus:
          created.status || "New",

        userId:
          created.user_id,
      };

      setContacts((prev) => [
        newContact,
        ...prev,
      ]);

      closeDrawer();

      alert(
        "Contact created successfully."
      );

    } catch (err) {
      console.error(
        "Contact save error:",
        err
      );

      const message =
        getErrorMessage(
          err,
          "Failed to save contact. Please check backend."
        );

      setError(message);

      alert(message);

    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this contact?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await apiRequest(
        `/api/contacts/${id}`,
        {
          method: "DELETE",
        }
      );

      setContacts((prev) =>
        prev.filter(
          (contact) =>
            contact.id !== id
        )
      );

      alert(
        "Contact deleted successfully."
      );

    } catch (err) {
      console.error(
        "Delete contact error:",
        err
      );

      const message =
        getErrorMessage(
          err,
          "Failed to delete contact."
        );

      setError(message);

      alert(message);
    }
  };

  // =========================================================
  // VIEW CONTACT HISTORY
  // =========================================================

  const handleView = (contact) => {
    navigate(
      `/agents/voice/dashboard/contacts/${contact.id}/history`,
      {
        state: {
          contact,
        },
      }
    );
  };

  // =========================================================
  // BULK CSV UPLOAD
  // =========================================================

  const handleBulkUpload = () => {
    setShowCreateMenu(false);

    const input =
      document.createElement("input");

    input.type = "file";
    input.accept = ".csv,text/csv";

    input.onchange = async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      // Check extension
      if (
        !file.name
          .toLowerCase()
          .endsWith(".csv")
      ) {
        alert(
          "Please select a CSV file."
        );
        return;
      }

      console.log(
        "Uploading CSV:",
        file.name,
        file.size
      );

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      try {
        setLoading(true);
        setError("");

        // ===================================================
        // SEND CSV TO FASTAPI
        // ===================================================

        const response =
          await apiRequest(
            "/api/contacts/import",
            {
              method: "POST",
              body: formData,
            }
          );

        console.log(
          "Bulk contacts import response:",
          response
        );

        // ===================================================
        // RELOAD FROM POSTGRESQL
        // ===================================================

        await loadContacts();

        const importedCount =
          response?.count ??
          response?.data?.count ??
          response?.contacts?.length ??
          response?.data?.contacts?.length ??
          0;

        if (importedCount > 0) {
          alert(
            `${importedCount} contacts imported successfully.`
          );
        } else {
          alert(
            "Contacts imported successfully."
          );
        }

      } catch (err) {
        console.error(
          "CSV import error:",
          err
        );

        const message =
          getErrorMessage(
            err,
            "Failed to import CSV contacts."
          );

        setError(message);

        alert(message);

      } finally {
        setLoading(false);
      }
    };

    input.click();
  };

  // =========================================================
  // EXPORT CSV
  // =========================================================

  const handleExport = () => {
    if (!contacts.length) {
      alert(
        "No contacts available to export."
      );
      return;
    }

    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Extension",
      "Job Title",
      "Tag",
      "Lifecycle Stage",
      "Lead Status",
    ];

    const rows =
      contacts.map((contact) => [
        contact.firstName,
        contact.lastName,
        contact.email,
        contact.phone,
        contact.extension,
        contact.jobTitle,
        contact.tag,
        contact.lifecycle,
        contact.leadStatus,
      ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(
              value || ""
            ).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "contacts.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="contacts-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="contacts-page-header">

        <div className="contacts-heading">

          <h1>
            Contacts
          </h1>

          <p>
            Manage your contacts and customer information
          </p>

        </div>

        <div className="contacts-toolbar">

          {/* SEARCH */}

          <div className="contacts-search-box">

            <FaSearch className="contacts-search-icon" />

            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          {/* BULK UPLOAD */}

          <button
            type="button"
            className="contacts-toolbar-btn"
            onClick={
              handleBulkUpload
            }
          >

            <FaCloudUploadAlt />

            Upload Bulk

          </button>

          {/* EXPORT */}

          <button
            type="button"
            className="contacts-toolbar-btn"
            onClick={
              handleExport
            }
          >

            <FaDownload />

            Export CSV

          </button>

          {/* CREATE */}

          <div className="contacts-create-wrapper">

            <button
              type="button"
              className="contacts-create-btn"
              onClick={() =>
                setShowCreateMenu(
                  (prev) => !prev
                )
              }
            >

              <FaPlus />

              Create

              <FaChevronDown
                className={
                  showCreateMenu
                    ? "rotate-arrow"
                    : ""
                }
              />

            </button>

            {showCreateMenu && (
              <div className="contacts-create-menu">

                <button
                  type="button"
                  onClick={
                    openCreate
                  }
                >

                  <span className="create-menu-icon">
                    <FaPlus />
                  </span>

                  <span>

                    <strong>
                      Create Contact
                    </strong>

                    <small>
                      Add a new contact
                    </small>

                  </span>

                </button>

                <button
                  type="button"
                  onClick={
                    handleBulkUpload
                  }
                >

                  <span className="create-menu-icon">
                    <FaCloudUploadAlt />
                  </span>

                  <span>

                    <strong>
                      Bulk Contacts
                    </strong>

                    <small>
                      Import multiple contacts
                    </small>

                  </span>

                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#3b1515",
            color: "#ff8f8f",
            border:
              "1px solid #6b2525",
            whiteSpace:
              "pre-wrap",
            wordBreak:
              "break-word",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="contacts-card">

        <div className="contacts-table-scroll">

          <table className="contacts-table">

            <thead>

              <tr>

                <th className="check-column">
                  <input
                    type="checkbox"
                    aria-label="Select all contacts"
                  />
                </th>

                <th>
                  NAME
                </th>

                <th>
                  TAG NAME
                </th>

                <th>
                  EMAIL
                </th>

                <th>
                  PHONE
                </th>

                <th>
                  EXTENSION
                </th>

                <th>
                  JOB TITLE
                </th>

                <th>
                  LIFECYCLE STAGE
                </th>

                <th>
                  LEAD STATUS
                </th>

                <th>
                  ACTIONS
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="10"
                    className="contacts-empty-row"
                  >
                    Loading contacts...
                  </td>

                </tr>

              ) : filteredContacts.length === 0 ? (

                <tr>

                  <td
                    colSpan="10"
                    className="contacts-empty-row"
                  >
                    No contacts found.
                  </td>

                </tr>

              ) : (

                filteredContacts.map(
                  (contact) => (

                    <tr
                      key={
                        contact.id
                      }
                    >

                      {/* CHECKBOX */}

                      <td className="check-column">

                        <input
                          type="checkbox"
                          aria-label={`Select ${contact.firstName}`}
                        />

                      </td>

                      {/* NAME */}

                      <td>

                        <div className="contact-name-cell">

                          <div className="contact-avatar">

                            {contact.firstName
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <strong>

                            {contact.firstName}{" "}

                            {contact.lastName}

                          </strong>

                        </div>

                      </td>

                      {/* TAG */}

                      <td>

                        <span className="contact-muted">
                          {contact.tag}
                        </span>

                      </td>

                      {/* EMAIL */}

                      <td>

                        <span className="contact-email">

                          {contact.email ||
                            "-"}

                        </span>

                      </td>

                      {/* PHONE */}

                      <td>

                        <div className="contact-phone-cell">

                          <FaPhoneAlt />

                          {contact.phone}

                        </div>

                      </td>

                      {/* EXTENSION */}

                      <td>

                        <span className="contact-muted">

                          {contact.extension}

                        </span>

                      </td>

                      {/* JOB */}

                      <td>

                        {contact.jobTitle ||
                          "-"}

                      </td>

                      {/* LIFECYCLE */}

                      <td>

                        <span className="lifecycle-text">

                          {contact.lifecycle}

                        </span>

                      </td>

                      {/* LEAD STATUS */}

                      <td>

                        <span
                          className={`lead-status ${(
                            contact.leadStatus ||
                            ""
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >

                          {contact.leadStatus}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="contact-row-actions">

                          {/* VIEW */}

                          <button
                            type="button"
                            title="View Contact History"
                            onClick={() =>
                              handleView(
                                contact
                              )
                            }
                          >
                            <FaEye />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            title="Edit Contact"
                            onClick={() =>
                              openEdit(
                                contact
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            title="Delete Contact"
                            className="delete-action"
                            onClick={() =>
                              handleDelete(
                                contact.id
                              )
                            }
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="contacts-footer">

          <select defaultValue="20">

            <option value="10">
              10 entries
            </option>

            <option value="20">
              20 entries
            </option>

            <option value="50">
              50 entries
            </option>

            <option value="100">
              100 entries
            </option>

          </select>

          <span>

            Showing{" "}
            {filteredContacts.length}{" "}
            of{" "}
            {contacts.length}

          </span>

        </div>

      </div>

      {/* =====================================================
          CREATE / EDIT DRAWER
      ===================================================== */}

      {showDrawer && (

        <div
          className="contact-drawer-overlay"
          onClick={closeDrawer}
        >

          <div
            className="contact-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="contact-drawer-header">

              <div>

                <span className="drawer-eyebrow">
                  CONTACT MANAGEMENT
                </span>

                <h2>

                  {editingId
                    ? "Edit Contact"
                    : "Create Contact"}

                </h2>

                <p>
                  Add contact information to your workspace.
                </p>

              </div>

              <button
                type="button"
                className="drawer-close-btn"
                onClick={
                  closeDrawer
                }
                disabled={
                  saving
                }
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              className="contact-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="drawer-content">

                {/* PERSONAL INFORMATION */}

                <div className="form-section">

                  <h3>
                    PERSONAL INFORMATION
                  </h3>

                  <div className="form-grid two-columns">

                    <div className="form-group">

                      <label>
                        First Name{" "}
                        <span>*</span>
                      </label>

                      <input
                        type="text"
                        name="firstName"
                        value={
                          form.firstName
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter first name"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Last Name
                      </label>

                      <input
                        type="text"
                        name="lastName"
                        value={
                          form.lastName
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter last name"
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        form.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="example@email.com"
                    />

                  </div>

                  <div className="form-grid two-columns">

                    <div className="form-group">

                      <label>
                        Phone Number{" "}
                        <span>*</span>
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={
                          form.phone
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="8072961256"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Extension
                      </label>

                      <input
                        type="text"
                        name="extension"
                        value={
                          form.extension
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Optional"
                      />

                    </div>

                  </div>

                </div>

                {/* CONTACT DETAILS */}

                <div className="form-section">

                  <h3>
                    CONTACT DETAILS
                  </h3>

                  <div className="form-group">

                    <label>
                      Job Title
                    </label>

                    <input
                      type="text"
                      name="jobTitle"
                      value={
                        form.jobTitle
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. AI Developer"
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Tag
                    </label>

                    <input
                      type="text"
                      name="tag"
                      value={
                        form.tag
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Customer"
                    />

                  </div>

                  <div className="form-grid two-columns">

                    <div className="form-group">

                      <label>
                        Lifecycle Stage
                      </label>

                      <select
                        name="lifecycle"
                        value={
                          form.lifecycle
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="Lead">
                          Lead
                        </option>

                        <option value="Prospect">
                          Prospect
                        </option>

                        <option value="Customer">
                          Customer
                        </option>

                        <option value="Inactive">
                          Inactive
                        </option>

                      </select>

                    </div>

                    <div className="form-group">

                      <label>
                        Lead Status
                      </label>

                      <select
                        name="leadStatus"
                        value={
                          form.leadStatus
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="New">
                          New
                        </option>

                        <option value="Contacted">
                          Contacted
                        </option>

                        <option value="Qualified">
                          Qualified
                        </option>

                        <option value="Converted">
                          Converted
                        </option>

                        <option value="Lost">
                          Lost
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="contact-form-footer">

                <button
                  type="button"
                  className="drawer-cancel-btn"
                  onClick={
                    closeDrawer
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="drawer-save-btn"
                  disabled={
                    saving
                  }
                >

                  <FaSave />

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Create Contact"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Contacts;