import React, { useEffect, useMemo, useRef, useState } from "react";
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
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

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
  // DOCUMENT UPLOAD
  // ============================================================

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const fileInputRef = useRef(null);

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
        message = "Unauthorized. Please make sure you are logged in.";
      } else if (response.status === 403) {
        message = "You do not have permission to access contacts.";
      } else if (response.status === 409) {
        message =
          data?.error || "A contact with this phone number already exists.";
      } else {
        message = data?.error || data?.message || message;
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

      console.log("Fetching contacts from:", `${API_BASE_URL}/api/contacts`);

      const data = await apiRequest(`${API_BASE_URL}/api/contacts`, {
        method: "GET",
      });

      console.log("Contacts API response:", data);

      const contactsData = Array.isArray(data)
        ? data
        : data?.contacts || data?.data || data?.items || [];

      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } catch (err) {
      console.error("Failed to load contacts:", err);
      setContacts([]);
      setError(err?.message || "Failed to fetch contacts");
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
      const name = contact?.name?.toLowerCase?.() || "";
      const phone = contact?.phone?.toLowerCase?.() || "";
      const email = contact?.email?.toLowerCase?.() || "";
      const company = contact?.company?.toLowerCase?.() || "";

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
    (contact) => contact?.status === "Active" || contact?.status === "active"
  ).length;

  const newLeads = contacts.filter(
    (contact) =>
      contact?.lifecycle === "Lead" || contact?.lifecycle_stage === "Lead"
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
      segment: contact?.segment || "Customers",
      email: contact?.email || "",
      phone: contact?.phone || "",
      extension: contact?.extension || "",
      jobTitle: contact?.jobTitle || contact?.job_title || "",
      lifecycle: contact?.lifecycle || contact?.lifecycle_stage || "Customer",
      status: contact?.status || "Active",
      company: contact?.company || "",
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
      segment: contact?.segment || "Customers",
      email: contact?.email || "",
      phone: contact?.phone || "",
      extension: contact?.extension || "",
      jobTitle: contact?.jobTitle || contact?.job_title || "",
      lifecycle: contact?.lifecycle || contact?.lifecycle_stage || "Customer",
      status: contact?.status || "Active",
      company: contact?.company || "",
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

      console.log("Creating contact:", payload);

      const data = await apiRequest(`${API_BASE_URL}/api/contacts`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Created contact:", data);

      const createdContact = data?.data || data;

      if (createdContact?.id) {
        setContacts((previous) => [createdContact, ...previous]);
      } else {
        await loadContacts();
      }

      setSuccess("Contact created successfully.");
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Create contact error:", err);
      setError(err?.message || "Failed to create contact.");
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
        email: form.email.trim() || null,
        company: form.company.trim() || null,
      };

      const data = await apiRequest(
        `${API_BASE_URL}/api/contacts/${selectedContact.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

      const updatedContact = data?.data || data;

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

      setSuccess("Contact updated successfully.");
      setShowModal(false);
      setSelectedContact(null);
      resetForm();
    } catch (err) {
      console.error("Update contact error:", err);
      setError(err?.message || "Failed to update contact.");
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

      await apiRequest(`${API_BASE_URL}/api/contacts/${contact.id}`, {
        method: "DELETE",
      });

      setContacts((previous) =>
        previous.filter((item) => item.id !== contact.id)
      );

      setSuccess("Contact deleted successfully.");
    } catch (err) {
      console.error("Delete contact error:", err);
      setError(err?.message || "Failed to delete contact.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // DOCUMENT UPLOAD HELPERS
  // ============================================================

  const normalizeHeader = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "");

  const parseCsvLine = (line) => {
    const values = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  };

  const parseCsvContacts = (text) => {
    const lines = text
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter((line) => line.trim());

    if (lines.length < 2) {
      throw new Error(
        "CSV must contain a header row and at least one contact."
      );
    }

    const headers = parseCsvLine(lines[0]).map(normalizeHeader);

    const getValue = (row, names) => {
      const index = names
        .map(normalizeHeader)
        .map((name) => headers.indexOf(name))
        .find((value) => value !== -1);

      return index === undefined ? "" : row[index] || "";
    };

    return lines.slice(1).map((line) => {
      const row = parseCsvLine(line);

      return {
        name: getValue(row, ["name", "fullname", "contactname"]),
        phone: getValue(row, [
          "phone",
          "phonenumber",
          "mobile",
          "mobilenumber",
          "whatsapp",
        ]),
        email: getValue(row, ["email", "emailaddress"]),
        company: getValue(row, ["company", "companyname", "organization"]),
        segment: getValue(row, ["segment"]) || "Customers",
        jobTitle: getValue(row, ["jobtitle", "title", "designation"]),
        lifecycle:
          getValue(row, [
            "lifecycle",
            "lifecyclestage",
            "lifestage",
          ]) || "Customer",
        status: getValue(row, ["status", "leadstatus"]) || "Active",
      };
    });
  };

  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      disableWorker: true,
    });

    const pdf = await loadingTask.promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const rows = {};

      for (const item of content.items) {
        const value = String(item?.str || "").trim();
        if (!value) {
          continue;
        }

        const y = Math.round(item?.transform?.[5] || 0);
        const rowKey = String(y);

        if (!rows[rowKey]) {
          rows[rowKey] = [];
        }

        rows[rowKey].push(value);
      }

      const pageText = Object.keys(rows)
        .sort((a, b) => Number(b) - Number(a))
        .map((key) => rows[key].join(" "))
        .join("\n");

      pages.push(pageText);
    }

    return pages.join("\n");
  };

  const parsePdfContacts = (text) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const contactsFromLines = [];

    for (const line of lines) {
      const emailMatch = line.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      const phoneMatch = line.match(/(?:\+?\d[\d\s().-]{7,}\d)/);

      if (!emailMatch && !phoneMatch) {
        continue;
      }

      const email = emailMatch?.[0] || "";
      const phone = phoneMatch?.[0]
        ? phoneMatch[0].replace(/[^\d+]/g, "")
        : "";

      let cleaned = line
        .replace(emailMatch?.[0] || "", "")
        .replace(phoneMatch?.[0] || "", "")
        .replace(/\b(name|phone|email|mobile|company)\b\s*:?\s*/gi, "")
        .replace(/[|,;]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const name = cleaned || phone || email;

      contactsFromLines.push({
        name,
        phone,
        email,
        company: "",
        segment: "Customers",
        jobTitle: "",
        lifecycle: "Customer",
        status: "Active",
      });
    }

    if (!contactsFromLines.length) {
      throw new Error(
        "No contact information was found in the PDF. Please use a PDF containing names, phone numbers, or email addresses."
      );
    }

    return contactsFromLines;
  };

  const openUploadModal = () => {
    setUploadFile(null);
    setError("");
    setSuccess("");
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    if (uploading) {
      return;
    }

    setShowUploadModal(false);
    setUploadFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setUploadFile(null);
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["csv", "pdf"].includes(extension)) {
      setError("Please upload only a CSV or PDF file.");
      setUploadFile(null);
      event.target.value = "";
      return;
    }

    setError("");
    setUploadFile(file);
  };

  const importContactsFromDocument = async () => {
    if (!uploadFile) {
      setError("Please select a CSV or PDF file.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const extension = uploadFile.name.split(".").pop()?.toLowerCase();
      let importedContacts = [];

      if (extension === "csv") {
        const csvText = await uploadFile.text();
        importedContacts = parseCsvContacts(csvText);
      } else {
        const pdfText = await extractPdfText(uploadFile);
        importedContacts = parsePdfContacts(pdfText);
      }

      const validContacts = importedContacts
        .map((contact) => ({
          ...contact,
          name:
            String(contact.name || "").trim() ||
            String(contact.phone || "").trim(),
          phone: String(contact.phone || "").trim(),
          email: String(contact.email || "").trim(),
          company: String(contact.company || "").trim(),
        }))
        .filter((contact) => contact.phone);

      if (!validContacts.length) {
        throw new Error(
          "No valid contacts with phone numbers were found in the uploaded file."
        );
      }

      let createdCount = 0;
      let skippedCount = 0;
      const createdContacts = [];

      for (const contact of validContacts) {
        try {
          const payload = {
            name: contact.name || contact.phone,
            phone: contact.phone,
            email: contact.email || undefined,
            company: contact.company || undefined,
          };

          const data = await apiRequest(`${API_BASE_URL}/api/contacts`, {
            method: "POST",
            body: JSON.stringify(payload),
          });

          const createdContact = data?.data || data;

          if (createdContact?.id) {
            createdContacts.push(createdContact);
          }

          createdCount += 1;
        } catch (err) {
          skippedCount += 1;
          console.warn(
            "Skipping contact during document import:",
            contact,
            err
          );
        }
      }

      if (createdContacts.length) {
        setContacts((previous) => [...createdContacts, ...previous]);
      } else {
        await loadContacts();
      }

      if (createdCount === 0) {
        throw new Error(
          "No contacts were imported. Please check the phone numbers in the file."
        );
      }

      setSuccess(
        `${createdCount} contact${
          createdCount === 1 ? "" : "s"
        } imported successfully${
          skippedCount ? `, ${skippedCount} skipped` : ""
        }.`
      );

      setShowUploadModal(false);
      setUploadFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Document import error:", err);
      setError(
        err?.message || "Failed to import contacts from the document."
      );
    } finally {
      setUploading(false);
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
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />

            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{
                width: "195px",
                height: "34px",
                border: "1px solid #d9dee8",
                borderRadius: "6px",
                padding: "0 12px 0 34px",
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
              border: "1px solid #ddd6fe",
              borderRadius: "7px",
              background: "#fff",
              color: "#7c3aed",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaSyncAlt
              size={13}
              style={{
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
          </button>

          {/* ADD DOCUMENT */}
          <button
            type="button"
            onClick={openUploadModal}
            style={{
              height: "36px",
              padding: "0 14px",
              border: "1px solid #8b5cf6",
              borderRadius: "7px",
              background: "#fff",
              color: "#7c3aed",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <span style={{ fontSize: "14px" }}>⇧</span>
            Add Doc
          </button>

          {/* ADD CONTACT */}
          <button
            type="button"
            onClick={openAddModal}
            style={{
              height: "36px",
              padding: "0 16px",
              border: "none",
              borderRadius: "7px",
              background: "#8b5cf6",
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
            border: "1px solid #fecdd3",
            color: "#dc2626",
            borderRadius: "6px",
            padding: "11px 13px",
            marginBottom: "16px",
            fontSize: "13px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
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
            border: "1px solid #bbf7d0",
            color: "#15803d",
            borderRadius: "6px",
            padding: "11px 13px",
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
          gridTemplateColumns: "repeat(3, minmax(140px, 1fr))",
          gap: "14px",
          maxWidth: "470px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
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
            border: "1px solid #e2e8f0",
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
            border: "1px solid #e2e8f0",
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
          border: "1px solid #e2e8f0",
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
              borderCollapse: "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#fafafa",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Segment</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Job Title</th>
                <th style={thStyle}>Lifecycle Stage</th>
                <th style={thStyle}>Lead Status</th>
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
                      textAlign: "center",
                      padding: "35px 20px",
                      color: "#718096",
                      fontSize: "13px",
                    }}
                  >
                    Loading contacts...
                  </td>
                </tr>
              )}

              {!loading && filteredContacts.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "35px 20px",
                      color: "#718096",
                      fontSize: "13px",
                    }}
                  >
                    {search
                      ? "No contacts match your search"
                      : "No contacts found"}
                  </td>
                </tr>
              )}

              {!loading &&
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    style={{
                      borderBottom: "1px solid #edf2f7",
                    }}
                  >
                    <td style={tdStyle}>
                      <div
                        style={{
                          fontWeight: 500,
                          color: "#1f2937",
                        }}
                      >
                        {contact.name || contact.phone || "—"}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {contact.segment || "Customers"}
                    </td>

                    <td style={tdStyle}>{contact.email || "—"}</td>

                    <td style={tdStyle}>{contact.phone || "—"}</td>

                    <td style={tdStyle}>
                      {contact.jobTitle || contact.job_title || "—"}
                    </td>

                    <td style={tdStyle}>
                      {contact.lifecycle ||
                        contact.lifecycle_stage ||
                        "Customer"}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 9px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          background: "#ecfdf5",
                          color: "#047857",
                        }}
                      >
                        {contact.status || "Active"}
                      </span>
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "7px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => openViewModal(contact)}
                          title="View"
                          style={actionButtonStyle}
                        >
                          <FaEye size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(contact)}
                          title="Edit"
                          style={actionButtonStyle}
                        >
                          <FaEdit size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteContact(contact)}
                          title="Delete"
                          style={{
                            ...actionButtonStyle,
                            color: "#dc2626",
                          }}
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
          color: "#64748b",
          fontSize: "12px",
        }}
      >
        <span>
          Showing {filteredContacts.length} of {contacts.length} contacts
        </span>

        <span>
          {search ? `Filtered by "${search}"` : `${contacts.length} entries`}
        </span>
      </div>

      {/* ======================================================
          ADD DOCUMENT MODAL
      ======================================================= */}

      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "20px",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeUploadModal();
            }
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 20px 50px rgba(0,0,0,.2)",
              overflow: "hidden",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                padding: "18px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  Add Document
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#718096",
                    fontSize: "12px",
                  }}
                >
                  Import contacts from CSV or PDF
                </p>
              </div>

              <button
                type="button"
                onClick={closeUploadModal}
                disabled={uploading}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: uploading ? "not-allowed" : "pointer",
                  color: "#64748b",
                  fontSize: "18px",
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* MODAL BODY */}
            <div style={{ padding: "25px 20px" }}>
              <div
                style={{
                  border: "2px dashed #c4b5fd",
                  borderRadius: "10px",
                  padding: "35px 20px",
                  textAlign: "center",
                  background: "#faf8ff",
                }}
              >
                <div style={{ fontSize: "35px", marginBottom: "12px" }}>
                  📄
                </div>

                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Upload Contacts File
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#718096",
                    marginBottom: "18px",
                  }}
                >
                  Supported formats: CSV and PDF
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.pdf,text/csv,application/pdf"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  id="contacts-document-upload"
                />

                <label
                  htmlFor="contacts-document-upload"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "36px",
                    padding: "0 16px",
                    borderRadius: "7px",
                    background: "#8b5cf6",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Choose File
                </label>

                {uploadFile && (
                  <div
                    style={{
                      marginTop: "18px",
                      padding: "10px 12px",
                      border: "1px solid #ddd6fe",
                      borderRadius: "7px",
                      background: "#fff",
                      color: "#475569",
                      fontSize: "12px",
                      textAlign: "left",
                    }}
                  >
                    <strong>Selected:</strong> {uploadFile.name}
                    <div
                      style={{
                        marginTop: "4px",
                        color: "#94a3b8",
                      }}
                    >
                      {(uploadFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                )}
              </div>

              {/* FILE FORMAT HELP */}
              <div
                style={{
                  marginTop: "18px",
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "7px",
                  fontSize: "12px",
                  color: "#64748b",
                  lineHeight: "1.6",
                }}
              >
                <strong style={{ color: "#475569" }}>CSV example:</strong> Name,
                Phone, Email, Company
                <br />
                <strong style={{ color: "#475569" }}>PDF:</strong> The PDF should
                contain contact names, phone numbers, or email addresses.
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div
              style={{
                padding: "15px 20px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={closeUploadModal}
                disabled={uploading}
                style={{
                  height: "36px",
                  padding: "0 15px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: "#fff",
                  color: "#374151",
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={importContactsFromDocument}
                disabled={uploading || !uploadFile}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  border: "none",
                  borderRadius: "6px",
                  background:
                    uploading || !uploadFile ? "#c4b5fd" : "#8b5cf6",
                  color: "#fff",
                  fontWeight: 600,
                  cursor:
                    uploading || !uploadFile ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                {uploading ? "Importing..." : "Import Contacts"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          CONTACT MODAL
      ======================================================= */}

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
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
              boxShadow: "0 20px 50px rgba(0,0,0,.2)",
              overflow: "hidden",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                padding: "18px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {modalMode === "add"
                  ? "Add Contact"
                  : modalMode === "edit"
                  ? "Edit Contact"
                  : "Contact Details"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: saving ? "not-allowed" : "pointer",
                  color: "#64748b",
                  fontSize: "18px",
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* MODAL BODY */}
            <form onSubmit={handleSave}>
              <div
                style={{
                  padding: "20px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                {/* NAME */}
                <FormField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  placeholder="Enter name"
                />

                {/* PHONE */}
                <FormField
                  label="Phone *"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  placeholder="+919XXXXXXXXX"
                  type="tel"
                />

                {/* EMAIL */}
                <FormField
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  placeholder="example@email.com"
                  type="email"
                />

                {/* COMPANY */}
                <FormField
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  placeholder="Company name"
                />

                {/* SEGMENT */}
                <FormField
                  label="Segment"
                  name="segment"
                  value={form.segment}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  placeholder="Customers"
                />

                {/* JOB TITLE */}
                <FormField
                  label="Job Title"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleFormChange}
                  disabled={modalMode === "view"}
                  placeholder="Job title"
                />

                {/* LIFECYCLE */}
                <div>
                  <label style={labelStyle}>Lifecycle Stage</label>
                  <select
                    name="lifecycle"
                    value={form.lifecycle}
                    onChange={handleFormChange}
                    disabled={modalMode === "view"}
                    style={inputStyle}
                  >
                    <option value="Lead">Lead</option>
                    <option value="Customer">Customer</option>
                    <option value="Prospect">Prospect</option>
                  </select>
                </div>

                {/* STATUS */}
                <div>
                  <label style={labelStyle}>Lead Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    disabled={modalMode === "view"}
                    style={inputStyle}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="New">New</option>
                  </select>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div
                style={{
                  padding: "15px 20px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  style={{
                    height: "36px",
                    padding: "0 15px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>

                {modalMode !== "view" && (
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      height: "36px",
                      padding: "0 16px",
                      border: "none",
                      borderRadius: "6px",
                      background: "#8b5cf6",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: saving ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                    }}
                  >
                    <FaSave size={12} />
                    {saving
                      ? "Saving..."
                      : modalMode === "add"
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
          ANIMATION STYLE
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
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          background: disabled ? "#f8fafc" : "#fff",
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

export default ContactsPage;