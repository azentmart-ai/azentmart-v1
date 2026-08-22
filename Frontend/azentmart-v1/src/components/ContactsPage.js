import React, { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTimes,
  FaSave,
  FaTrash,
  FaSyncAlt,
} from "react-icons/fa";

/*
 * IMPORTANT:
 * The frontend does NOT connect directly to Supabase.
 *
 * Frontend
 *    ↓
 * http://localhost:3000/api/contacts
 *    ↓
 * Backend Next.js API
 *    ↓
 * requireRole("agent")
 *    ↓
 * Supabase
 */
const API_BASE_URL = "http://localhost:3000";

function ContactsPage() {
  // ============================================================
  // STATE
  // ============================================================

  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const [selectedContact, setSelectedContact] = useState(null);

  const [form, setForm] = useState({
    name: "",
    segment: "Customers",
    email: "",
    phone: "",
    extension: "",
    jobTitle: "",
    lifecycle: "Customer",
    status: "Active",
    company: "",
  });

  // ============================================================
  // API HELPER
  // ============================================================

  const apiRequest = async (url, options = {}) => {
    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      let message = `HTTP ${response.status}`;

      if (response.status === 401) {
        message =
          "Unauthorized. Please make sure you are logged in.";
      } else if (response.status === 403) {
        message =
          "You do not have permission to access contacts.";
      } else if (response.status === 409) {
        message =
          data?.error ||
          "A contact with this phone number already exists.";
      } else {
        message =
          data?.error ||
          data?.message ||
          message;
      }

      throw new Error(message);
    }

    return data;
  };

  // ============================================================
  // LOAD CONTACTS
  // ============================================================

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "Fetching contacts from:",
        `${API_BASE_URL}/api/contacts`
      );

      const data = await apiRequest(
        `${API_BASE_URL}/api/contacts`,
        {
          method: "GET",
        }
      );

      console.log("Contacts API response:", data);

      /*
       * Backend currently returns:
       *
       * [
       *   {
       *     id,
       *     phone,
       *     name,
       *     email,
       *     company,
       *     ...
       *   }
       * ]
       *
       * We also support object responses so the frontend
       * remains tolerant of future backend changes.
       */

      const contactsData = Array.isArray(data)
        ? data
        : data?.contacts ||
          data?.data ||
          data?.items ||
          [];

      setContacts(
        Array.isArray(contactsData)
          ? contactsData
          : []
      );
    } catch (err) {
      console.error("Failed to load contacts:", err);

      setContacts([]);

      setError(
        err?.message ||
          "Failed to fetch contacts"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadContacts();
  }, []);

  // ============================================================
  // FILTER CONTACTS
  // ============================================================

  const filteredContacts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return contacts;
    }

    return contacts.filter((contact) => {
      const name =
        contact?.name?.toLowerCase?.() || "";

      const phone =
        contact?.phone?.toLowerCase?.() || "";

      const email =
        contact?.email?.toLowerCase?.() || "";

      const company =
        contact?.company?.toLowerCase?.() || "";

      return (
        name.includes(value) ||
        phone.includes(value) ||
        email.includes(value) ||
        company.includes(value)
      );
    });
  }, [contacts, search]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalContacts = contacts.length;

  const activeContacts = contacts.filter(
    (contact) =>
      contact?.status === "Active" ||
      contact?.status === "active"
  ).length;

  const newLeads = contacts.filter(
    (contact) =>
      contact?.lifecycle === "Lead" ||
      contact?.lifecycle_stage === "Lead"
  ).length;

  // ============================================================
  // FORM HANDLERS
  // ============================================================

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      segment: "Customers",
      email: "",
      phone: "",
      extension: "",
      jobTitle: "",
      lifecycle: "Customer",
      status: "Active",
      company: "",
    });
  };

  // ============================================================
  // OPEN ADD MODAL
  // ============================================================

  const openAddModal = () => {
    setModalMode("add");
    setSelectedContact(null);
    resetForm();

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ============================================================
  // OPEN VIEW MODAL
  // ============================================================

  const openViewModal = (contact) => {
    setModalMode("view");
    setSelectedContact(contact);

    setForm({
      name: contact?.name || "",
      segment:
        contact?.segment ||
        "Customers",
      email: contact?.email || "",
      phone: contact?.phone || "",
      extension:
        contact?.extension || "",
      jobTitle:
        contact?.jobTitle ||
        contact?.job_title ||
        "",
      lifecycle:
        contact?.lifecycle ||
        contact?.lifecycle_stage ||
        "Customer",
      status:
        contact?.status ||
        "Active",
      company:
        contact?.company || "",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const openEditModal = (contact) => {
    setModalMode("edit");
    setSelectedContact(contact);

    setForm({
      name: contact?.name || "",
      segment:
        contact?.segment ||
        "Customers",
      email: contact?.email || "",
      phone: contact?.phone || "",
      extension:
        contact?.extension || "",
      jobTitle:
        contact?.jobTitle ||
        contact?.job_title ||
        "",
      lifecycle:
        contact?.lifecycle ||
        contact?.lifecycle_stage ||
        "Customer",
      status:
        contact?.status ||
        "Active",
      company:
        contact?.company || "",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setSelectedContact(null);
    resetForm();
  };

  // ============================================================
  // ADD CONTACT
  // ============================================================

  const createContact = async () => {
    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const company = form.company.trim();

    if (!phone) {
      setError("Phone number is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: name || phone,
        phone,
        email: email || undefined,
        company: company || undefined,
      };

      console.log(
        "Creating contact:",
        payload
      );

      const data = await apiRequest(
        `${API_BASE_URL}/api/contacts`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      console.log(
        "Created contact:",
        data
      );

      /*
       * Backend returns the newly-created
       * contact directly.
       */
      const createdContact = data?.data || data;

      if (createdContact?.id) {
        setContacts((previous) => [
          createdContact,
          ...previous,
        ]);
      } else {
        await loadContacts();
      }

      setSuccess(
        "Contact created successfully."
      );

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(
        "Create contact error:",
        err
      );

      setError(
        err?.message ||
          "Failed to create contact."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // UPDATE CONTACT
  // ============================================================

  const updateContact = async () => {
    if (!selectedContact?.id) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email:
          form.email.trim() || null,
        company:
          form.company.trim() || null,
      };

      const data = await apiRequest(
        `${API_BASE_URL}/api/contacts/${selectedContact.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

      const updatedContact =
        data?.data || data;

      setContacts((previous) =>
        previous.map((contact) =>
          contact.id === selectedContact.id
            ? {
                ...contact,
                ...updatedContact,
              }
            : contact
        )
      );

      setSuccess(
        "Contact updated successfully."
      );

      setShowModal(false);
      setSelectedContact(null);
      resetForm();
    } catch (err) {
      console.error(
        "Update contact error:",
        err
      );

      setError(
        err?.message ||
          "Failed to update contact."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async (event) => {
    event.preventDefault();

    if (modalMode === "add") {
      await createContact();
      return;
    }

    if (modalMode === "edit") {
      await updateContact();
      return;
    }
  };

  // ============================================================
  // DELETE CONTACT
  // ============================================================

  const deleteContact = async (contact) => {
    if (!contact?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete contact "${contact.name || contact.phone}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await apiRequest(
        `${API_BASE_URL}/api/contacts/${contact.id}`,
        {
          method: "DELETE",
        }
      );

      setContacts((previous) =>
        previous.filter(
          (item) =>
            item.id !== contact.id
        )
      );

      setSuccess(
        "Contact deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete contact error:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete contact."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="contacts-page"
      style={{
        width: "100%",
        minHeight: "100%",
      }}
    >
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div
        className="contacts-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 500,
            }}
          >
            Contacts
          </h1>

          <p
            style={{
              marginTop: "6px",
              marginBottom: 0,
              color: "#718096",
              fontSize: "14px",
            }}
          >
            Manage and organize your WhatsApp contacts
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* SEARCH */}

          <div
            style={{
              position: "relative",
            }}
          >
            <FaSearch
              size={13}
              style={{
                position: "absolute",
                left: "13px",
                top: "50%",
                transform:
                  "translateY(-50%)",
                color: "#94a3b8",
              }}
            />

            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={{
                width: "195px",
                height: "34px",
                border:
                  "1px solid #d9dee8",
                borderRadius: "6px",
                padding:
                  "0 12px 0 34px",
                outline: "none",
                fontSize: "13px",
                background: "#fff",
              }}
            />
          </div>

          {/* REFRESH */}

          <button
            type="button"
            onClick={loadContacts}
            disabled={loading}
            title="Refresh contacts"
            style={{
              width: "36px",
              height: "36px",
              border:
                "1px solid #ddd6fe",
              borderRadius: "7px",
              background: "#fff",
              color: "#7c3aed",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaSyncAlt
              size={13}
              style={{
                animation: loading
                  ? "spin 1s linear infinite"
                  : "none",
              }}
            />
          </button>

          {/* ADD CONTACT */}

          <button
            type="button"
            onClick={openAddModal}
            style={{
              height: "36px",
              padding:
                "0 16px",
              border: "none",
              borderRadius: "7px",
              background:
                "#8b5cf6",
              color: "#fff",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <FaPlus size={11} />
            Add Contact
          </button>
        </div>
      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div
          style={{
            background: "#fff1f2",
            border:
              "1px solid #fecdd3",
            color: "#dc2626",
            borderRadius: "6px",
            padding:
              "11px 13px",
            marginBottom: "16px",
            fontSize: "13px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            style={{
              border: "none",
              background: "transparent",
              color: "#dc2626",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ======================================================
          SUCCESS
      ======================================================= */}

      {success && (
        <div
          style={{
            background: "#f0fdf4",
            border:
              "1px solid #bbf7d0",
            color: "#15803d",
            borderRadius: "6px",
            padding:
              "11px 13px",
            marginBottom: "16px",
            fontSize: "13px",
          }}
        >
          {success}
        </div>
      )}

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(140px, 1fr))",
          gap: "14px",
          maxWidth: "470px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border:
              "1px solid #e2e8f0",
            borderRadius: "7px",
            padding: "13px 16px",
          }}
        >
          <div
            style={{
              color: "#718096",
              fontSize: "11px",
              marginBottom: "10px",
            }}
          >
            Total Contacts
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            {totalContacts}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border:
              "1px solid #e2e8f0",
            borderRadius: "7px",
            padding: "13px 16px",
          }}
        >
          <div
            style={{
              color: "#718096",
              fontSize: "11px",
              marginBottom: "10px",
            }}
          >
            Active
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            {activeContacts}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border:
              "1px solid #e2e8f0",
            borderRadius: "7px",
            padding: "13px 16px",
          }}
        >
          <div
            style={{
              color: "#718096",
              fontSize: "11px",
              marginBottom: "10px",
            }}
          >
            New Leads
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            {newLeads}
          </div>
        </div>
      </div>

      {/* ======================================================
          TABLE
      ======================================================= */}

      <div
        style={{
          background: "#fff",
          border:
            "1px solid #e2e8f0",
          borderRadius: "7px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "#fafafa",
                  borderBottom:
                    "1px solid #e2e8f0",
                }}
              >
                <th style={thStyle}>
                  Name
                </th>

                <th style={thStyle}>
                  Segment
                </th>

                <th style={thStyle}>
                  Email
                </th>

                <th style={thStyle}>
                  Phone
                </th>

                <th style={thStyle}>
                  Job Title
                </th>

                <th style={thStyle}>
                  Lifecycle Stage
                </th>

                <th style={thStyle}>
                  Lead Status
                </th>

                <th
                  style={{
                    ...thStyle,
                    textAlign: "center",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "35px 20px",
                      color:
                        "#718096",
                      fontSize:
                        "13px",
                    }}
                  >
                    Loading contacts...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredContacts.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "35px 20px",
                        color:
                          "#718096",
                        fontSize:
                          "13px",
                      }}
                    >
                      {search
                        ? "No contacts match your search"
                        : "No contacts found"}
                    </td>
                  </tr>
                )}

              {!loading &&
                filteredContacts.map(
                  (contact) => (
                    <tr
                      key={contact.id}
                      style={{
                        borderBottom:
                          "1px solid #edf2f7",
                      }}
                    >
                      <td
                        style={tdStyle}
                      >
                        <div
                          style={{
                            fontWeight:
                              500,
                            color:
                              "#1f2937",
                          }}
                        >
                          {contact.name ||
                            contact.phone ||
                            "—"}
                        </div>
                      </td>

                      <td
                        style={tdStyle}
                      >
                        {contact.segment ||
                          "Customers"}
                      </td>

                      <td
                        style={tdStyle}
                      >
                        {contact.email ||
                          "—"}
                      </td>

                      <td
                        style={tdStyle}
                      >
                        {contact.phone ||
                          "—"}
                      </td>

                      <td
                        style={tdStyle}
                      >
                        {contact.jobTitle ||
                          contact.job_title ||
                          "—"}
                      </td>

                      <td
                        style={tdStyle}
                      >
                        {contact.lifecycle ||
                          contact.lifecycle_stage ||
                          "Customer"}
                      </td>

                      <td
                        style={tdStyle}
                      >
                        <span
                          style={{
                            display:
                              "inline-block",
                            padding:
                              "4px 9px",
                            borderRadius:
                              "999px",
                            fontSize:
                              "11px",
                            background:
                              "#ecfdf5",
                            color:
                              "#047857",
                          }}
                        >
                          {contact.status ||
                            "Active"}
                        </span>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          textAlign:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "center",
                            gap: "7px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openViewModal(
                                contact
                              )
                            }
                            title="View"
                            style={
                              actionButtonStyle
                            }
                          >
                            <FaEye
                              size={13}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                contact
                              )
                            }
                            title="Edit"
                            style={
                              actionButtonStyle
                            }
                          >
                            <FaEdit
                              size={13}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteContact(
                                contact
                              )
                            }
                            title="Delete"
                            style={{
                              ...actionButtonStyle,
                              color:
                                "#dc2626",
                            }}
                          >
                            <FaTrash
                              size={12}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================
          FOOTER
      ======================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginTop: "16px",
          color: "#64748b",
          fontSize: "12px",
        }}
      >
        <span>
          Showing{" "}
          {filteredContacts.length}{" "}
          of {contacts.length} contacts
        </span>

        <span>
          {search
            ? `Filtered by "${search}"`
            : "20 entries"}
        </span>
      </div>

      {/* ======================================================
          MODAL
      ======================================================= */}

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,.2)",
              overflow: "hidden",
            }}
          >
            {/* MODAL HEADER */}

            <div
              style={{
                padding:
                  "18px 20px",
                borderBottom:
                  "1px solid #e2e8f0",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "18px",
                  fontWeight:
                    600,
                }}
              >
                {modalMode ===
                "add"
                  ? "Add Contact"
                  : modalMode ===
                    "edit"
                  ? "Edit Contact"
                  : "Contact Details"}
              </h2>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={saving}
                style={{
                  border: "none",
                  background:
                    "transparent",
                  cursor:
                    saving
                      ? "not-allowed"
                      : "pointer",
                  color:
                    "#64748b",
                  fontSize:
                    "18px",
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* MODAL BODY */}

            <form
              onSubmit={
                handleSave
              }
            >
              <div
                style={{
                  padding:
                    "20px",
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "16px",
                }}
              >
                {/* NAME */}

                <FormField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={
                    handleFormChange
                  }
                  disabled={
                    modalMode ===
                    "view"
                  }
                  placeholder="Enter name"
                />

                {/* PHONE */}

                <FormField
                  label="Phone *"
                  name="phone"
                  value={form.phone}
                  onChange={
                    handleFormChange
                  }
                  disabled={
                    modalMode ===
                    "view"
                  }
                  placeholder="+919XXXXXXXXX"
                  type="tel"
                />

                {/* EMAIL */}

                <FormField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={
                    handleFormChange
                  }
                  disabled={
                    modalMode ===
                    "view"
                  }
                  placeholder="example@email.com"
                  type="email"
                />

                {/* COMPANY */}

                <FormField
                  label="Company"
                  name="company"
                  value={
                    form.company
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={
                    modalMode ===
                    "view"
                  }
                  placeholder="Company name"
                />

                {/* SEGMENT */}

                <FormField
                  label="Segment"
                  name="segment"
                  value={
                    form.segment
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={
                    modalMode ===
                    "view"
                  }
                  placeholder="Customers"
                />

                {/* JOB TITLE */}

                <FormField
                  label="Job Title"
                  name="jobTitle"
                  value={
                    form.jobTitle
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={
                    modalMode ===
                    "view"
                  }
                  placeholder="Job title"
                />

                {/* LIFECYCLE */}

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    Lifecycle Stage
                  </label>

                  <select
                    name="lifecycle"
                    value={
                      form.lifecycle
                    }
                    onChange={
                      handleFormChange
                    }
                    disabled={
                      modalMode ===
                      "view"
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option value="Lead">
                      Lead
                    </option>

                    <option value="Customer">
                      Customer
                    </option>

                    <option value="Prospect">
                      Prospect
                    </option>
                  </select>
                </div>

                {/* STATUS */}

                <div>
                  <label
                    style={
                      labelStyle
                    }
                  >
                    Lead Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleFormChange
                    }
                    disabled={
                      modalMode ===
                      "view"
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                    <option value="New">
                      New
                    </option>
                  </select>
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div
                style={{
                  padding:
                    "15px 20px",
                  borderTop:
                    "1px solid #e2e8f0",
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                  style={{
                    height:
                      "36px",
                    padding:
                      "0 15px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius:
                      "6px",
                    background:
                      "#fff",
                    cursor:
                      "pointer",
                  }}
                >
                  {modalMode ===
                  "view"
                    ? "Close"
                    : "Cancel"}
                </button>

                {modalMode !==
                  "view" && (
                  <button
                    type="submit"
                    disabled={
                      saving
                    }
                    style={{
                      height:
                        "36px",
                      padding:
                        "0 16px",
                      border:
                        "none",
                      borderRadius:
                        "6px",
                      background:
                        "#8b5cf6",
                      color:
                        "#fff",
                      fontWeight:
                        600,
                      cursor:
                        saving
                          ? "not-allowed"
                          : "pointer",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "7px",
                    }}
                  >
                    <FaSave
                      size={12}
                    />

                    {saving
                      ? "Saving..."
                      : modalMode ===
                        "add"
                      ? "Create Contact"
                      : "Save Changes"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          SMALL ANIMATION
      ======================================================= */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

// ============================================================
// REUSABLE FORM FIELD
// ============================================================

function FormField({
  label,
  name,
  value,
  onChange,
  disabled,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          background: disabled
            ? "#f8fafc"
            : "#fff",
        }}
      />
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "12px",
  fontWeight: 500,
  color: "#475569",
};

const inputStyle = {
  width: "100%",
  height: "36px",
  border: "1px solid #d9dee8",
  borderRadius: "6px",
  padding: "0 10px",
  outline: "none",
  fontSize: "13px",
  color: "#1f2937",
  boxSizing: "border-box",
};

const thStyle = {
  padding: "11px 12px",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: 600,
  color: "#475569",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  fontSize: "12px",
  color: "#475569",
  whiteSpace: "nowrap",
};

const actionButtonStyle = {
  width: "30px",
  height: "30px",
  border: "1px solid #e2e8f0",
  borderRadius: "5px",
  background: "#fff",
  color: "#64748b",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// ============================================================
// EXPORT
// ============================================================

export default ContactsPage;