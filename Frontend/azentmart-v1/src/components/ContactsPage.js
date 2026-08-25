import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

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
  // DOCUMENT UPLOAD STATE
  // ============================================================

  const [showUploadModal, setShowUploadModal] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [uploadFile, setUploadFile] =
    useState(null);

  const fileInputRef = useRef(null);

  // ============================================================
  // API HELPER
  // ============================================================

  const apiRequest = async (
    url,
    options = {}
  ) => {
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
      let message =
        `HTTP ${response.status}`;

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

      const data = await apiRequest(
        `${API_BASE_URL}/api/contacts`,
        {
          method: "GET",
        }
      );

      const contactsData =
        Array.isArray(data)
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
      console.error(
        "Failed to load contacts:",
        err
      );

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
  // SEARCH
  // ============================================================

  const filteredContacts = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return contacts;
    }

    return contacts.filter(
      (contact) => {
        const name =
          contact?.name
            ?.toLowerCase?.() || "";

        const phone =
          contact?.phone
            ?.toLowerCase?.() || "";

        const email =
          contact?.email
            ?.toLowerCase?.() || "";

        const company =
          contact?.company
            ?.toLowerCase?.() || "";

        return (
          name.includes(value) ||
          phone.includes(value) ||
          email.includes(value) ||
          company.includes(value)
        );
      }
    );
  }, [contacts, search]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalContacts =
    contacts.length;

  const activeContacts =
    contacts.filter(
      (contact) =>
        contact?.status === "Active" ||
        contact?.status === "active"
    ).length;

  const newLeads =
    contacts.filter(
      (contact) =>
        contact?.lifecycle === "Lead" ||
        contact?.lifecycle_stage ===
          "Lead"
    ).length;

  // ============================================================
  // FORM
  // ============================================================

  const handleFormChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

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
  // ADD CONTACT
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
  // VIEW CONTACT
  // ============================================================

  const openViewModal = (
    contact
  ) => {
    setModalMode("view");
    setSelectedContact(contact);

    setForm({
      name:
        contact?.name || "",
      segment:
        contact?.segment ||
        "Customers",
      email:
        contact?.email || "",
      phone:
        contact?.phone || "",
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
  // EDIT CONTACT
  // ============================================================

  const openEditModal = (
    contact
  ) => {
    setModalMode("edit");
    setSelectedContact(contact);

    setForm({
      name:
        contact?.name || "",
      segment:
        contact?.segment ||
        "Customers",
      email:
        contact?.email || "",
      phone:
        contact?.phone || "",
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
  // CLOSE CONTACT MODAL
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
  // CREATE CONTACT
  // ============================================================

  const createContact = async () => {
    const name =
      form.name.trim();

    const phone =
      form.phone.trim();

    const email =
      form.email.trim();

    const company =
      form.company.trim();

    if (!phone) {
      setError(
        "Phone number is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: name || phone,
        phone,
        email:
          email || undefined,
        company:
          company || undefined,
      };

      const data =
        await apiRequest(
          `${API_BASE_URL}/api/contacts`,
          {
            method: "POST",
            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const createdContact =
        data?.data || data;

      if (
        createdContact?.id
      ) {
        setContacts(
          (previous) => [
            createdContact,
            ...previous,
          ]
        );
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

  const updateContact =
    async () => {
      if (!selectedContact?.id) {
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        const payload = {
          name:
            form.name.trim(),
          phone:
            form.phone.trim(),
          email:
            form.email.trim() ||
            null,
          company:
            form.company.trim() ||
            null,
        };

        const data =
          await apiRequest(
            `${API_BASE_URL}/api/contacts/${selectedContact.id}`,
            {
              method: "PATCH",
              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        const updatedContact =
          data?.data || data;

        setContacts(
          (previous) =>
            previous.map(
              (contact) =>
                contact.id ===
                selectedContact.id
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
  // SAVE CONTACT
  // ============================================================

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    if (
      modalMode === "add"
    ) {
      await createContact();
      return;
    }

    if (
      modalMode === "edit"
    ) {
      await updateContact();
    }
  };

  // ============================================================
  // DELETE CONTACT
  // ============================================================

  const deleteContact =
    async (contact) => {
      if (!contact?.id) {
        return;
      }

      const confirmed =
        window.confirm(
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

        setContacts(
          (previous) =>
            previous.filter(
              (item) =>
                item.id !==
                contact.id
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
  // DOCUMENT HELPERS
  // ============================================================

  const normalizeHeader = (
    value
  ) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(
        /[\s_-]+/g,
        ""
      );

  // ============================================================
  // CSV LINE PARSER
  // ============================================================

  const parseCsvLine = (
    line
  ) => {
    const values = [];

    let current = "";
    let insideQuotes = false;

    for (
      let i = 0;
      i < line.length;
      i += 1
    ) {
      const char = line[i];

      if (char === '"') {
        if (
          insideQuotes &&
          line[i + 1] === '"'
        ) {
          current += '"';
          i += 1;
        } else {
          insideQuotes =
            !insideQuotes;
        }
      } else if (
        char === "," &&
        !insideQuotes
      ) {
        values.push(
          current.trim()
        );

        current = "";
      } else {
        current += char;
      }
    }

    values.push(
      current.trim()
    );

    return values;
  };

  // ============================================================
  // CSV CONTACT PARSER
  // ============================================================

  const parseCsvContacts = (
    text
  ) => {
    const lines =
      text
        .replace(
          /^\uFEFF/,
          ""
        )
        .split(/\r?\n/)
        .filter(
          (line) =>
            line.trim()
        );

    if (lines.length < 2) {
      throw new Error(
        "CSV must contain a header row and at least one contact."
      );
    }

    const headers =
      parseCsvLine(
        lines[0]
      ).map(
        normalizeHeader
      );

    const getValue = (
      row,
      names
    ) => {
      const index =
        names
          .map(
            normalizeHeader
          )
          .map(
            (name) =>
              headers.indexOf(
                name
              )
          )
          .find(
            (value) =>
              value !== -1
          );

      return index ===
        undefined
        ? ""
        : row[index] || "";
    };

    return lines
      .slice(1)
      .map((line) => {
        const row =
          parseCsvLine(
            line
          );

        return {
          name:
            getValue(
              row,
              [
                "name",
                "fullname",
                "contactname",
              ]
            ),

          phone:
            getValue(
              row,
              [
                "phone",
                "phonenumber",
                "mobile",
                "mobilenumber",
                "whatsapp",
              ]
            ),

          email:
            getValue(
              row,
              [
                "email",
                "emailaddress",
              ]
            ),

          company:
            getValue(
              row,
              [
                "company",
                "companyname",
                "organization",
              ]
            ),

          segment:
            getValue(
              row,
              ["segment"]
            ) ||
            "Customers",

          jobTitle:
            getValue(
              row,
              [
                "jobtitle",
                "title",
                "designation",
              ]
            ),

          lifecycle:
            getValue(
              row,
              [
                "lifecycle",
                "lifecyclestage",
                "lifestage",
              ]
            ) ||
            "Customer",

          status:
            getValue(
              row,
              [
                "status",
                "leadstatus",
              ]
            ) ||
            "Active",
        };
      });
  };

  // ============================================================
  // PDF TEXT EXTRACTION
  // ============================================================

  const extractPdfText =
    async (file) => {
      const arrayBuffer =
        await file.arrayBuffer();

      const loadingTask =
        pdfjsLib.getDocument({
          data: arrayBuffer,
          disableWorker: true,
        });

      const pdf =
        await loadingTask.promise;

      const pages = [];

      for (
        let pageNumber = 1;
        pageNumber <=
        pdf.numPages;
        pageNumber += 1
      ) {
        const page =
          await pdf.getPage(
            pageNumber
          );

        const content =
          await page.getTextContent();

        const rows = {};

        for (
          const item of
            content.items
        ) {
          const value =
            String(
              item?.str || ""
            ).trim();

          if (!value) {
            continue;
          }

          const y =
            Math.round(
              item
                ?.transform?.[5] ||
                0
            );

          const rowKey =
            String(y);

          if (
            !rows[rowKey]
          ) {
            rows[rowKey] = [];
          }

          rows[rowKey].push(
            value
          );
        }

        const pageText =
          Object.keys(rows)
            .sort(
              (a, b) =>
                Number(b) -
                Number(a)
            )
            .map(
              (key) =>
                rows[key].join(
                  " "
                )
            )
            .join("\n");

        pages.push(
          pageText
        );
      }

      return pages.join(
        "\n"
      );
    };

  // ============================================================
  // PDF CONTACT PARSER
  // ============================================================

  const parsePdfContacts = (
    text
  ) => {
    const lines =
      text
        .split(/\r?\n/)
        .map((line) =>
          line
            .replace(
              /\s+/g,
              " "
            )
            .trim()
        )
        .filter(Boolean);

    const contactsFromLines =
      [];

    for (
      const line of lines
    ) {
      const emailMatch =
        line.match(
          /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );

      const phoneMatch =
        line.match(
          /(?:\+?\d[\d\s().-]{7,}\d)/
        );

      if (
        !emailMatch &&
        !phoneMatch
      ) {
        continue;
      }

      const email =
        emailMatch?.[0] ||
        "";

      const phone =
        phoneMatch?.[0]
          ? phoneMatch[0].replace(
              /[^\d+]/g,
              ""
            )
          : "";

      const cleaned =
        line
          .replace(
            emailMatch?.[0] ||
              "",
            ""
          )
          .replace(
            phoneMatch?.[0] ||
              "",
            ""
          )
          .replace(
            /\b(name|phone|email|mobile|company)\b\s*:?\s*/gi,
            ""
          )
          .replace(
            /[|,;]+/g,
            " "
          )
          .replace(
            /\s+/g,
            " "
          )
          .trim();

      const name =
        cleaned ||
        phone ||
        email;

      contactsFromLines.push(
        {
          name,
          phone,
          email,
          company: "",
          segment:
            "Customers",
          jobTitle: "",
          lifecycle:
            "Customer",
          status:
            "Active",
        }
      );
    }

    if (
      !contactsFromLines.length
    ) {
      throw new Error(
        "No contact information was found in the PDF. Please use a PDF containing names, phone numbers, or email addresses."
      );
    }

    return contactsFromLines;
  };

  // ============================================================
  // OPEN UPLOAD MODAL
  // ============================================================

  const openUploadModal =
    () => {
      setUploadFile(null);
      setError("");
      setSuccess("");
      setShowUploadModal(
        true
      );
    };

  // ============================================================
  // CLOSE UPLOAD MODAL
  // ============================================================

  const closeUploadModal =
    () => {
      if (uploading) {
        return;
      }

      setShowUploadModal(
        false
      );

      setUploadFile(null);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    };

  // ============================================================
  // FILE SELECT
  // ============================================================

  const handleFileSelect =
    (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        setUploadFile(null);
        return;
      }

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase();

      if (
        !["csv", "pdf"].includes(
          extension
        )
      ) {
        setError(
          "Please upload only a CSV or PDF file."
        );

        setUploadFile(null);

        event.target.value =
          "";

        return;
      }

      setError("");
      setUploadFile(file);
    };

  // ============================================================
  // IMPORT DOCUMENT
  // ============================================================

  const importContactsFromDocument =
    async () => {
      if (!uploadFile) {
        setError(
          "Please select a CSV or PDF file."
        );
        return;
      }

      try {
        setUploading(true);
        setError("");
        setSuccess("");

        const extension =
          uploadFile.name
            .split(".")
            .pop()
            ?.toLowerCase();

        let importedContacts =
          [];

        if (
          extension === "csv"
        ) {
          const csvText =
            await uploadFile.text();

          importedContacts =
            parseCsvContacts(
              csvText
            );
        } else {
          const pdfText =
            await extractPdfText(
              uploadFile
            );

          importedContacts =
            parsePdfContacts(
              pdfText
            );
        }

        const validContacts =
          importedContacts
            .map(
              (contact) => ({
                ...contact,

                name:
                  String(
                    contact.name ||
                      ""
                  ).trim() ||
                  String(
                    contact.phone ||
                      ""
                  ).trim(),

                phone:
                  String(
                    contact.phone ||
                      ""
                  ).trim(),

                email:
                  String(
                    contact.email ||
                      ""
                  ).trim(),

                company:
                  String(
                    contact.company ||
                      ""
                  ).trim(),
              })
            )
            .filter(
              (contact) =>
                contact.phone
            );

        if (
          !validContacts.length
        ) {
          throw new Error(
            "No valid contacts with phone numbers were found in the uploaded file."
          );
        }

        let createdCount = 0;
        let skippedCount = 0;

        const createdContacts =
          [];

        for (
          const contact of
            validContacts
        ) {
          try {
            const payload = {
              name:
                contact.name ||
                contact.phone,

              phone:
                contact.phone,

              email:
                contact.email ||
                undefined,

              company:
                contact.company ||
                undefined,
            };

            const data =
              await apiRequest(
                `${API_BASE_URL}/api/contacts`,
                {
                  method: "POST",
                  body:
                    JSON.stringify(
                      payload
                    ),
                }
              );

            const createdContact =
              data?.data ||
              data;

            if (
              createdContact?.id
            ) {
              createdContacts.push(
                createdContact
              );
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

        if (
          createdContacts.length
        ) {
          setContacts(
            (previous) => [
              ...createdContacts,
              ...previous,
            ]
          );
        } else {
          await loadContacts();
        }

        if (
          createdCount === 0
        ) {
          throw new Error(
            "No contacts were imported. Please check the phone numbers in the file."
          );
        }

        setSuccess(
          `${createdCount} contact${
            createdCount === 1
              ? ""
              : "s"
          } imported successfully${
            skippedCount
              ? `, ${skippedCount} skipped`
              : ""
          }.`
        );

        setShowUploadModal(
          false
        );

        setUploadFile(null);

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            "";
        }
      } catch (err) {
        console.error(
          "Document import error:",
          err
        );

        setError(
          err?.message ||
            "Failed to import contacts from the document."
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
    >
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="contacts-header">
        <div>
          <h1>
            Contacts
          </h1>

          <p>
            Manage and organize
            your WhatsApp contacts
          </p>
        </div>

        <div className="header-actions">

          {/* SEARCH */}

          <div className="search-wrapper">
            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          {/* REFRESH */}

          <button
            type="button"
            className="refresh-button"
            onClick={
              loadContacts
            }
            disabled={loading}
            title="Refresh contacts"
          >
            <FaSyncAlt
              className={
                loading
                  ? "spin"
                  : ""
              }
            />
          </button>

          {/* ==================================================
              ADD DOCUMENT
              SAME DESIGN AS ADD CONTACT
          ================================================== */}

          <button
            type="button"
            className="header-purple-button"
            onClick={
              openUploadModal
            }
          >
            <span className="upload-icon">
              ⇧
            </span>

            Add Doc
          </button>

          {/* ADD CONTACT */}

          <button
            type="button"
            className="header-purple-button"
            onClick={
              openAddModal
            }
          >
            <FaPlus
              size={12}
            />

            Add Contact
          </button>
        </div>
      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div className="message error-message">
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* ======================================================
          SUCCESS
      ======================================================= */}

      {success && (
        <div className="message success-message">
          <span>
            {success}
          </span>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <span>
            Total Contacts
          </span>

          <strong>
            {totalContacts}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Active
          </span>

          <strong>
            {activeContacts}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            New Leads
          </span>

          <strong>
            {newLeads}
          </strong>
        </div>

      </div>

      {/* ======================================================
          CONTACT TABLE
      ======================================================= */}

      <div className="table-card">

        <div className="table-scroll">

          <table>
            <thead>
              <tr>
                <th>
                  Name
                </th>

                <th>
                  Segment
                </th>

                <th>
                  Email
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Job Title
                </th>

                <th>
                  Lifecycle Stage
                </th>

                <th>
                  Lead Status
                </th>

                <th className="actions-column">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td
                    colSpan="8"
                    className="empty-row"
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
                      className="empty-row"
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
                      key={
                        contact.id
                      }
                    >
                      <td>
                        <strong className="contact-name">
                          {contact.name ||
                            contact.phone ||
                            "—"}
                        </strong>
                      </td>

                      <td>
                        {contact.segment ||
                          "Customers"}
                      </td>

                      <td>
                        {contact.email ||
                          "—"}
                      </td>

                      <td>
                        {contact.phone ||
                          "—"}
                      </td>

                      <td>
                        {contact.jobTitle ||
                          contact.job_title ||
                          "—"}
                      </td>

                      <td>
                        {contact.lifecycle ||
                          contact.lifecycle_stage ||
                          "Customer"}
                      </td>

                      <td>
                        <span className="status-badge">
                          {contact.status ||
                            "Active"}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">

                          <button
                            type="button"
                            title="View"
                            onClick={() =>
                              openViewModal(
                                contact
                              )
                            }
                          >
                            <FaEye />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              openEditModal(
                                contact
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            title="Delete"
                            className="delete-button"
                            onClick={() =>
                              deleteContact(
                                contact
                              )
                            }
                          >
                            <FaTrash />
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

      <div className="table-footer">

        <span>
          Showing{" "}
          {
            filteredContacts.length
          }{" "}
          of{" "}
          {contacts.length}{" "}
          contacts
        </span>

        <span>
          {search
            ? `Filtered by "${search}"`
            : `${contacts.length} entries`}
        </span>

      </div>

      {/* ======================================================
          ADD DOCUMENT MODAL
      ======================================================= */}

      {showUploadModal && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeUploadModal();
            }
          }}
        >
          <div
            className="upload-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="modal-header">

              <div>
                <h2>
                  Add Document
                </h2>

                <p>
                  Import contacts from
                  CSV or PDF
                </p>
              </div>

              <button
                type="button"
                className="close-modal-button"
                onClick={
                  closeUploadModal
                }
                disabled={
                  uploading
                }
              >
                <FaTimes />
              </button>

            </div>

            {/* BODY */}

            <div className="upload-body">

              <div className="upload-box">

                <div className="upload-file-icon">
                  📄
                </div>

                <h3>
                  Upload Contacts File
                </h3>

                <p>
                  Supported formats:
                  CSV and PDF
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.pdf,text/csv,application/pdf"
                  onChange={
                    handleFileSelect
                  }
                  id="contacts-document-upload"
                  style={{
                    display:
                      "none",
                  }}
                />

                <label
                  htmlFor="contacts-document-upload"
                  className="choose-file-button"
                >
                  Choose File
                </label>

                {uploadFile && (
                  <div className="selected-file">

                    <strong>
                      Selected:
                    </strong>{" "}
                    {uploadFile.name}

                    <div>
                      {(
                        uploadFile.size /
                        1024
                      ).toFixed(
                        1
                      )}{" "}
                      KB
                    </div>

                  </div>
                )}

              </div>

              <div className="format-help">

                <strong>
                  CSV example:
                </strong>{" "}
                Name, Phone, Email,
                Company

                <br />

                <strong>
                  PDF:
                </strong>{" "}
                The PDF should
                contain contact
                names, phone numbers,
                or email addresses.

              </div>

            </div>

            {/* FOOTER */}

            <div className="modal-footer">

              <button
                type="button"
                className="cancel-button"
                onClick={
                  closeUploadModal
                }
                disabled={
                  uploading
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="header-purple-button modal-import-button"
                onClick={
                  importContactsFromDocument
                }
                disabled={
                  uploading ||
                  !uploadFile
                }
              >
                {uploading
                  ? "Importing..."
                  : "Import Contacts"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================
          ADD / EDIT / VIEW CONTACT MODAL
      ======================================================= */}

      {showModal && (
        <div
          className="modal-overlay"
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
            className="contact-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  {modalMode ===
                  "add"
                    ? "Add Contact"
                    : modalMode ===
                      "edit"
                    ? "Edit Contact"
                    : "Contact Details"}
                </h2>

                <p>
                  {modalMode ===
                  "add"
                    ? "Create a new WhatsApp contact."
                    : modalMode ===
                      "edit"
                    ? "Update WhatsApp contact details."
                    : "View WhatsApp contact details."}
                </p>
              </div>

              <button
                type="button"
                className="close-modal-button"
                onClick={
                  closeModal
                }
                disabled={
                  saving
                }
              >
                <FaTimes />
              </button>

            </div>

            <form
              onSubmit={
                handleSave
              }
            >

              <div className="form-grid">

                <FormField
                  label="Name"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={
                    modalMode ===
                    "view"
                  }
                  placeholder="Enter name"
                />

                <FormField
                  label="Phone *"
                  name="phone"
                  value={
                    form.phone
                  }
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

                <FormField
                  label="Email"
                  name="email"
                  value={
                    form.email
                  }
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

                <div>
                  <label className="field-label">
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
                    className="form-input"
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

                <div>
                  <label className="field-label">
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
                    className="form-input"
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

              <div className="modal-footer">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
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
                    className="header-purple-button"
                    disabled={
                      saving
                    }
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
          STYLES
      ======================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .contacts-page {
          width: 100%;
          min-height: 100%;
          padding: 32px 40px 40px;
          background: #081015;
          color: #f8fafc;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* ======================================================
           HEADER
        ====================================================== */

        .contacts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 26px;
        }

        .contacts-header h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 650;
          color: #f8fafc;
        }

        .contacts-header p {
          margin: 7px 0 0;
          color: #8ea5b7;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* ======================================================
           SEARCH
        ====================================================== */

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #8ea2b0;
          pointer-events: none;
          font-size: 13px;
        }

        .search-wrapper input {
          width: 205px;
          height: 40px;
          padding: 0 12px 0 36px;
          border: 1px solid #2a3a43;
          border-radius: 7px;
          outline: none;
          background: #18262e;
          color: #f8fafc;
          font-size: 13px;
        }

        .search-wrapper input::placeholder {
          color: #7d93a2;
        }

        .search-wrapper input:focus {
          border-color: #8b5cf6;
          box-shadow:
            0 0 0 2px
            rgba(139, 92, 246, 0.12);
        }

        /* ======================================================
           COMMON PURPLE BUTTON
           ADD DOC + ADD CONTACT SAME DESIGN
        ====================================================== */

        .header-purple-button {
          height: 40px;
          min-width: max-content;
          padding: 0 16px;

          border: none;
          border-radius: 7px;

          background: #8b5cf6;
          color: #ffffff;

          font-size: 14px;
          font-weight: 650;

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          cursor: pointer;

          box-shadow:
            0 7px 18px
            rgba(124, 58, 237, 0.20);

          transition:
            background 0.15s ease,
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }

        .header-purple-button:hover {
          background: #7c3aed;

          box-shadow:
            0 9px 22px
            rgba(124, 58, 237, 0.28);
        }

        .header-purple-button:active {
          transform: translateY(1px);
        }

        .header-purple-button:disabled {
          background: #a78bfa;
          opacity: 0.65;
          cursor: not-allowed;
          box-shadow: none;
        }

        .upload-icon {
          font-size: 16px;
          line-height: 1;
          font-weight: 700;
        }

        /* ======================================================
           REFRESH
        ====================================================== */

        .refresh-button {
          width: 40px;
          height: 40px;

          border: 1px solid #2a3a43;
          border-radius: 7px;

          background: #18262e;
          color: #aab9c4;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;
        }

        .refresh-button:hover {
          color: #c4b5fd;
          border-color: #8b5cf6;
        }

        .refresh-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ======================================================
           MESSAGES
        ====================================================== */

        .message {
          border-radius: 7px;
          padding: 12px 14px;
          margin-bottom: 18px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          font-size: 13px;
        }

        .message button {
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .error-message {
          background: #2b151a;
          border: 1px solid #71323a;
          color: #fda4af;
        }

        .success-message {
          background: #09251c;
          border: 1px solid #075c42;
          color: #6ee7b7;
        }

        /* ======================================================
           STATISTICS
        ====================================================== */

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(150px, 1fr));

          gap: 14px;

          max-width: 780px;

          margin-bottom: 22px;
        }

        .stat-card {
          min-height: 82px;

          padding: 16px 18px;

          border: 1px solid #263640;
          border-radius: 9px;

          background: #0e1a20;

          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .stat-card span {
          color: #91a7b6;
          font-size: 12px;
          margin-bottom: 7px;
        }

        .stat-card strong {
          color: #00c99b;
          font-size: 23px;
          font-weight: 700;
        }

        /* ======================================================
           TABLE
        ====================================================== */

        .table-card {
          width: 100%;

          border: 1px solid #263640;
          border-radius: 9px;

          overflow: hidden;

          background: #0e1a20;
        }

        .table-scroll {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1100px;
          border-collapse: collapse;
        }

        thead {
          background: #142128;
        }

        th {
          padding: 15px 14px;

          text-align: left;

          color: #91a7b6;

          font-size: 12px;
          font-weight: 600;

          white-space: nowrap;

          border-bottom: 1px solid #263640;
        }

        td {
          padding: 15px 14px;

          color: #b6c5cf;

          font-size: 13px;

          white-space: nowrap;

          border-bottom: 1px solid #1d2b33;
        }

        tbody tr:hover {
          background: #122027;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .contact-name {
          color: #f5f7fa;
          font-weight: 650;
        }

        .actions-column {
          text-align: center;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-width: 60px;

          padding: 5px 10px;

          border-radius: 999px;

          background: #064b3a;
          color: #34d399;

          font-size: 11px;
          font-weight: 650;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
        }

        .action-buttons button {
          width: 31px;
          height: 31px;

          border: 1px solid #30414b;
          border-radius: 6px;

          background: #18262e;
          color: #9cafbb;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;
        }

        .action-buttons button:hover {
          border-color: #8b5cf6;
          color: #c4b5fd;
        }

        .action-buttons .delete-button:hover {
          border-color: #ef4444;
          color: #f87171;
        }

        .empty-row {
          text-align: center;
          padding: 45px 20px;
          color: #718797;
          font-size: 14px;
        }

        /* ======================================================
           FOOTER
        ====================================================== */

        .table-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 15px;

          color: #718797;
          font-size: 13px;
        }

        /* ======================================================
           MODAL
        ====================================================== */

        .modal-overlay {
          position: fixed;
          inset: 0;

          z-index: 9999;

          padding: 20px;

          background:
            rgba(2, 8, 12, 0.72);

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-modal,
        .contact-modal {
          width: 100%;

          background: #ffffff;

          border-radius: 10px;

          box-shadow:
            0 25px 70px
            rgba(0, 0, 0, 0.4);

          overflow: hidden;
        }

        .upload-modal {
          max-width: 520px;
        }

        .contact-modal {
          max-width: 560px;
        }

        .modal-header {
          padding: 20px;

          border-bottom:
            1px solid #e2e8f0;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .modal-header h2 {
          margin: 0;

          color: #1f2937;

          font-size: 19px;
          font-weight: 650;
        }

        .modal-header p {
          margin: 5px 0 0;

          color: #718096;

          font-size: 12px;
        }

        .close-modal-button {
          width: 34px;
          height: 34px;

          border: none;
          border-radius: 6px;

          background: transparent;

          color: #64748b;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          font-size: 16px;
        }

        .close-modal-button:hover {
          background: #f1f5f9;
        }

        /* ======================================================
           UPLOAD BODY
        ====================================================== */

        .upload-body {
          padding: 25px 20px;
        }

        .upload-box {
          border:
            2px dashed
            #a78bfa;

          border-radius: 10px;

          padding: 35px 20px;

          text-align: center;

          background: #faf8ff;
        }

        .upload-file-icon {
          font-size: 38px;
          margin-bottom: 12px;
        }

        .upload-box h3 {
          margin: 0 0 6px;

          color: #334155;

          font-size: 16px;
          font-weight: 650;
        }

        .upload-box p {
          margin: 0 0 18px;

          color: #718096;

          font-size: 12px;
        }

        .choose-file-button {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          height: 40px;

          padding: 0 17px;

          border-radius: 7px;

          background: #8b5cf6;
          color: #ffffff;

          font-size: 14px;
          font-weight: 650;

          cursor: pointer;

          box-shadow:
            0 7px 18px
            rgba(124, 58, 237, 0.20);
        }

        .choose-file-button:hover {
          background: #7c3aed;
        }

        .selected-file {
          margin-top: 18px;

          padding: 11px 13px;

          border:
            1px solid
            #ddd6fe;

          border-radius: 7px;

          background: #ffffff;

          color: #475569;

          font-size: 12px;

          text-align: left;
        }

        .selected-file div {
          margin-top: 4px;
          color: #94a3b8;
        }

        .format-help {
          margin-top: 18px;

          padding: 13px;

          background: #f8fafc;

          border-radius: 7px;

          color: #64748b;

          font-size: 12px;

          line-height: 1.6;
        }

        .format-help strong {
          color: #475569;
        }

        /* ======================================================
           MODAL FOOTER
        ====================================================== */

        .modal-footer {
          padding: 16px 20px;

          border-top:
            1px solid
            #e2e8f0;

          display: flex;

          align-items: center;

          justify-content: flex-end;

          gap: 10px;
        }

        .cancel-button {
          height: 40px;

          padding: 0 16px;

          border:
            1px solid
            #d1d5db;

          border-radius: 7px;

          background: #ffffff;

          color: #374151;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;
        }

        .cancel-button:hover {
          background: #f8fafc;
        }

        .modal-import-button {
          min-width: 150px;
        }

        /* ======================================================
           CONTACT FORM
        ====================================================== */

        .form-grid {
          padding: 22px;

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 18px;
        }

        .field-label {
          display: block;

          margin-bottom: 7px;

          color: #475569;

          font-size: 12px;
          font-weight: 600;
        }

        .form-input {
          width: 100%;

          height: 40px;

          padding: 0 11px;

          border:
            1px solid
            #d9dee8;

          border-radius: 6px;

          outline: none;

          background: #ffffff;

          color: #1f2937;

          font-size: 13px;
        }

        .form-input:focus {
          border-color: #8b5cf6;

          box-shadow:
            0 0 0 2px
            rgba(139, 92, 246, 0.12);
        }

        .form-input:disabled {
          background: #f8fafc;
          opacity: 0.7;
        }

        /* ======================================================
           ANIMATION
        ====================================================== */

        .spin {
          animation:
            spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform:
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg);
          }
        }

        /* ======================================================
           RESPONSIVE
        ====================================================== */

        @media (max-width: 1100px) {
          .contacts-page {
            padding: 28px;
          }

          .contacts-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .header-actions {
            width: 100%;
          }

          .search-wrapper {
            flex: 1;
          }

          .search-wrapper input {
            width: 100%;
          }
        }

        @media (max-width: 700px) {
          .contacts-page {
            padding: 22px 16px;
          }

          .contacts-header h1 {
            font-size: 26px;
          }

          .header-actions {
            width: 100%;
          }

          .header-purple-button {
            height: 40px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            max-width: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .table-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }

      `}</style>
    </div>
  );
}

// ============================================================
// FORM FIELD
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
      <label className="field-label">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  );
}

export default ContactsPage;