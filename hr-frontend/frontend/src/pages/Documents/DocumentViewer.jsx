import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Archive,
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  FileCheck2,
  FileText,
  FolderOpen,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  Users,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";


/* =========================================================
   DOCUMENT CATEGORIES
========================================================= */

const DOCUMENT_CATEGORIES = [
  "Employee Records",
  "Identity & Compliance",
  "Employment",
  "Payroll & Finance",
  "Benefits",
  "Leave & Attendance",
  "Performance",
  "Training & Development",
  "Policies",
  "Recruitment",
  "Company Documents",
  "Certificates",
  "Other",
];


/* =========================================================
   REFERENCE HR DOCUMENTS
========================================================= */

const DEFAULT_DOCUMENTS = [
  {
    id: "demo-1",
    title: "Employee Handbook",
    category: "Policies",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Company handbook containing workplace guidelines, employee responsibilities and organizational standards.",
    file_url: null,
  },

  {
    id: "demo-2",
    title: "Code of Conduct",
    category: "Policies",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Workplace conduct, ethics and professional behaviour guidelines.",
    file_url: null,
  },

  {
    id: "demo-3",
    title: "Information Security Policy",
    category: "Policies",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Security requirements for systems, company information and employee access.",
    file_url: null,
  },

  {
    id: "demo-4",
    title: "Leave & Attendance Policy",
    category: "Leave & Attendance",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Leave eligibility, attendance, working hours and regularization guidelines.",
    file_url: null,
  },

  {
    id: "demo-5",
    title: "Remote Work Policy",
    category: "Policies",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Guidelines for remote and hybrid working arrangements.",
    file_url: null,
  },

  {
    id: "demo-6",
    title: "Offer Letter Template",
    category: "Recruitment",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Standard employment offer letter used during recruitment.",
    file_url: null,
  },

  {
    id: "demo-7",
    title: "Employment Agreement",
    category: "Employment",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employment agreement containing role, responsibilities and employment terms.",
    file_url: null,
  },

  {
    id: "demo-8",
    title: "Joining Letter",
    category: "Employment",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee joining confirmation and initial employment documentation.",
    file_url: null,
  },

  {
    id: "demo-9",
    title: "Government Identity Proof",
    category: "Identity & Compliance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "2030-12-31",
    description:
      "Government-issued identity verification document.",
    file_url: null,
  },

  {
    id: "demo-10",
    title: "Address Proof",
    category: "Identity & Compliance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "2029-06-30",
    description:
      "Employee residential address verification record.",
    file_url: null,
  },

  {
    id: "demo-11",
    title: "Bank Account Details",
    category: "Payroll & Finance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Banking information required for salary and payroll processing.",
    file_url: null,
  },

  {
    id: "demo-12",
    title: "Salary Structure",
    category: "Payroll & Finance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee salary and compensation structure document.",
    file_url: null,
  },

  {
    id: "demo-13",
    title: "Benefits Enrollment Form",
    category: "Benefits",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee benefits enrollment and coverage selection document.",
    file_url: null,
  },

  {
    id: "demo-14",
    title: "Education Certificate",
    category: "Certificates",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Academic qualification and education verification document.",
    file_url: null,
  },

  {
    id: "demo-15",
    title: "Previous Employment Certificate",
    category: "Certificates",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Previous employment and experience verification document.",
    file_url: null,
  },

  {
    id: "demo-16",
    title: "Performance Review Form",
    category: "Performance",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Standard employee performance appraisal and review document.",
    file_url: null,
  },

  {
    id: "demo-17",
    title: "Training Completion Certificate",
    category: "Training & Development",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Record confirming completion of required employee training.",
    file_url: null,
  },

  {
    id: "demo-18",
    title: "Background Verification Report",
    category: "Recruitment",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Background verification and employment screening record.",
    file_url: null,
  },

  {
    id: "demo-19",
    title: "Experience Letter",
    category: "Employment",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee experience and previous role confirmation document.",
    file_url: null,
  },

  {
    id: "demo-20",
    title: "Employee Exit Clearance",
    category: "Employee Records",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee exit, asset return and clearance documentation.",
    file_url: null,
  },
];


/* =========================================================
   CATEGORY ICON
========================================================= */

function CategoryIcon({ category }) {
  if (
    category === "Policies"
  ) {
    return <ShieldCheck size={15} />;
  }

  if (
    category === "Employee Records" ||
    category === "Identity & Compliance"
  ) {
    return <Users size={15} />;
  }

  if (
    category === "Certificates" ||
    category === "Training & Development"
  ) {
    return <FileCheck2 size={15} />;
  }

  if (
    category === "Payroll & Finance"
  ) {
    return <Archive size={15} />;
  }

  if (
    category === "Leave & Attendance"
  ) {
    return <CalendarDays size={15} />;
  }

  return <FileText size={15} />;
}


/* =========================================================
   DOCUMENTS
========================================================= */

export default function Documents() {
  const [items, setItems] = useState([]);

  const [file, setFile] = useState(null);

  const [busy, setBusy] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const fileRef = useRef(null);


  /* =========================================================
     LOAD BACKEND DOCUMENTS
  ========================================================= */

  const load = async () => {
    setBusy(true);
    setError("");

    try {
      const response =
        await api.get("/documents");

      const backendDocuments =
        response.data?.items ||
        response.data ||
        [];

      setItems(
        Array.isArray(backendDocuments)
          ? backendDocuments
          : []
      );
    } catch (err) {
      console.error(
        "Documents load error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load documents."
      );

      setItems([]);
    } finally {
      setBusy(false);
    }
  };


  useEffect(() => {
    load();
  }, []);


  /* =========================================================
     ALWAYS COMBINE REAL + REFERENCE DOCUMENTS
  ========================================================= */

  const allDocuments = useMemo(() => {
    const backendDocuments =
      Array.isArray(items)
        ? items
        : [];

    return [
      ...backendDocuments,
      ...DEFAULT_DOCUMENTS,
    ];
  }, [items]);


  /* =========================================================
     FILTER DOCUMENTS
  ========================================================= */

  const filteredDocuments =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return allDocuments.filter(
        (document) => {
          const matchesSearch =
            !query ||
            document.title
              ?.toLowerCase()
              .includes(query) ||
            document.category
              ?.toLowerCase()
              .includes(query) ||
            document.employee
              ?.toLowerCase()
              .includes(query);

          const matchesCategory =
            !category ||
            document.category ===
              category;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      allDocuments,
      search,
      category,
    ]);


  /* =========================================================
     STATISTICS
  ========================================================= */

  const stats = useMemo(() => {
    const total =
      allDocuments.length;

    const policies =
      allDocuments.filter(
        (item) =>
          item.category ===
          "Policies"
      ).length;

    const employeeRecords =
      allDocuments.filter(
        (item) =>
          item.employee &&
          item.employee !== "Company"
      ).length;

    const expiryTracking =
      allDocuments.filter(
        (item) =>
          item.expiry_date &&
          item.expiry_date !== "—"
      ).length;

    return {
      total,
      policies,
      employeeRecords,
      expiryTracking,
    };
  }, [allDocuments]);


  /* =========================================================
     UPLOAD DOCUMENT
  ========================================================= */

  const upload = async () => {
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      await api.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      await load();
    } catch (err) {
      console.error(
        "Document upload error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Document upload failed."
      );
    } finally {
      setUploading(false);
    }
  };


  /* =========================================================
     DOWNLOAD DOCUMENT
  ========================================================= */

  const download = async (
    id,
    title
  ) => {
    try {
      const response =
        await api.get(
          `/documents/${id}/download`,
          {
            responseType: "blob",
          }
        );

      const url =
        URL.createObjectURL(
          response.data
        );

      const anchor =
        document.createElement("a");

      anchor.href = url;

      anchor.download =
        title || "document";

      document.body.appendChild(
        anchor
      );

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to download document."
      );
    }
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">

        <div>

          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            HR KNOWLEDGE
          </span>

          <h1 className="mt-1">
            Documents
          </h1>

          <p>
            Manage employee records, HR policies,
            contracts, certificates and company documents.
          </p>

        </div>


        <div className="flex gap-2">

          <input
            ref={fileRef}
            hidden
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={(event) =>
              setFile(
                event.target.files?.[0] ||
                  null
              )
            }
          />

          <button
            type="button"
            className="btn"
            onClick={() =>
              fileRef.current?.click()
            }
          >
            <Upload size={14} />
            Select file
          </button>

          <button
            type="button"
            className="btn btn-primary"
            disabled={
              !file ||
              uploading
            }
            onClick={upload}
          >
            <Plus size={14} />

            {uploading
              ? "Uploading..."
              : "Add document"}
          </button>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-box mb-4">
          {error}
        </div>
      )}


      {/* =====================================================
          SELECTED FILE
      ===================================================== */}

      {file && (
        <div className="card mb-4 flex items-center justify-between p-4">

          <div className="flex items-center gap-3">

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <FileText size={15} />
            </span>

            <div>

              <p className="text-[9px] uppercase tracking-wide text-slate-400">
                Ready to upload
              </p>

              <p className="text-xs font-bold text-slate-800">
                {file.name}
              </p>

            </div>

          </div>


          <button
            type="button"
            className="btn"
            onClick={() => {
              setFile(null);

              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }}
          >
            <X size={13} />
            Clear
          </button>

        </div>
      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">


        {/* TOTAL */}

        <div className="card p-4">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                TOTAL DOCUMENTS
              </p>

              <p className="mt-3 text-[22px] font-extrabold leading-none text-slate-900">
                {stats.total}
              </p>

              <p className="mt-2 text-[9px] text-slate-400">
                Documents in workspace
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <FolderOpen size={17} />
            </span>

          </div>

        </div>


        {/* POLICIES */}

        <div className="card p-4">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                HR POLICIES
              </p>

              <p className="mt-3 text-[22px] font-extrabold leading-none text-slate-900">
                {stats.policies}
              </p>

              <p className="mt-2 text-[9px] text-slate-400">
                Company policy documents
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={17} />
            </span>

          </div>

        </div>


        {/* EMPLOYEE */}

        <div className="card p-4">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                EMPLOYEE RECORDS
              </p>

              <p className="mt-3 text-[22px] font-extrabold leading-none text-slate-900">
                {stats.employeeRecords}
              </p>

              <p className="mt-2 text-[9px] text-slate-400">
                Employee-related documents
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Users size={17} />
            </span>

          </div>

        </div>


        {/* EXPIRY */}

        <div className="card p-4">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                EXPIRY TRACKING
              </p>

              <p className="mt-3 text-[22px] font-extrabold leading-none text-slate-900">
                {stats.expiryTracking}
              </p>

              <p className="mt-2 text-[9px] text-slate-400">
                Documents with expiry dates
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <CalendarDays size={17} />
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          DOCUMENT LIBRARY
      ===================================================== */}

      <div className="card mb-5 overflow-hidden">

        <div className="border-b border-slate-100 p-5">

          <span className="text-[9px] font-extrabold tracking-[0.14em] text-blue-600">
            DOCUMENT LIBRARY
          </span>

          <h2 className="mt-1 text-[15px] font-extrabold text-slate-900">
            HR document categories
          </h2>

          <p className="mt-1 text-[10px] text-slate-500">
            Keep company and employee documentation
            organized by business function.
          </p>

        </div>


        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4 xl:grid-cols-7">

          {DOCUMENT_CATEGORIES.map(
            (item) => {

              const count =
                allDocuments.filter(
                  (document) =>
                    document.category ===
                    item
                ).length;

              const active =
                category === item;

              return (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    setCategory(
                      active
                        ? ""
                        : item
                    )
                  }
                  className={`rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-blue-200 bg-blue-50"
                      : "border-slate-100 bg-slate-50 hover:border-blue-100 hover:bg-blue-50/40"
                  }`}
                >

                  <span
                    className={`mb-3 grid h-8 w-8 place-items-center rounded-lg ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600"
                    }`}
                  >
                    <CategoryIcon
                      category={item}
                    />
                  </span>

                  <p className="text-[10px] font-bold leading-4 text-slate-800">
                    {item}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    {count} document
                    {count !== 1
                      ? "s"
                      : ""}
                  </p>

                </button>
              );
            }
          )}

        </div>

      </div>


      {/* =====================================================
          DOCUMENT RECORDS
      ===================================================== */}

      <div className="card overflow-hidden">


        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <h2 className="text-[13px] font-extrabold text-slate-900">
              Document records
            </h2>

            <p className="mt-1 text-[9px] text-slate-400">
              Search, view and manage HR documentation.
            </p>

          </div>


          {/* FILTERS */}

          <div className="flex flex-wrap items-center gap-2">

            <div className="relative">

              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search documents..."
                className="h-9 w-[210px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[10px] outline-none focus:border-blue-500"
              />

            </div>


            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-600 outline-none focus:border-blue-500"
            >

              <option value="">
                All categories
              </option>

              {DOCUMENT_CATEGORIES.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

        </div>


        {/* ===================================================
            TABLE
        =================================================== */}

        {busy ? (

          <div className="loading">
            Loading documents…
          </div>

        ) : filteredDocuments.length ? (

          <div className="table-wrap">

            <table>

              <thead>

                <tr>

                  <th>
                    DOCUMENT
                  </th>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    EMPLOYEE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    EXPIRY
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredDocuments.map(
                  (document) => {

                    const isReference =
                      String(
                        document.id
                      ).startsWith(
                        "demo-"
                      );

                    return (
                      <tr
                        key={
                          document.id
                        }
                      >


                        {/* DOCUMENT */}

                        <td>

                          <div className="flex items-center gap-2">

                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">

                              <CategoryIcon
                                category={
                                  document.category
                                }
                              />

                            </span>


                            <div>

                              <b>
                                {
                                  document.title
                                }
                              </b>

                              <div className="max-w-[300px] truncate text-[9px] text-slate-400">
                                {
                                  document.description ||
                                  "HR document"
                                }
                              </div>

                            </div>

                          </div>

                        </td>


                        {/* CATEGORY */}

                        <td>

                          <span className="text-[10px] font-semibold text-slate-600">
                            {
                              document.category ||
                              "General"
                            }
                          </span>

                        </td>


                        {/* EMPLOYEE */}

                        <td>

                          <span className="text-[10px] text-slate-600">
                            {
                              document.employee ||
                              "Company"
                            }
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span className="badge success">

                            <CheckCircle2
                              size={10}
                              className="mr-1 inline"
                            />

                            {
                              document.status ||
                              "Available"
                            }

                          </span>

                        </td>


                        {/* EXPIRY */}

                        <td>

                          <span className="text-[10px] text-slate-500">
                            {
                              document.expiry_date ||
                              "—"
                            }
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="flex gap-1">

                            {isReference ? (

                              <span className="text-[9px] text-slate-400">
                                Reference document
                              </span>

                            ) : (

                              <>

                                <Link
                                  to={`/documents/${document.id}`}
                                  className="btn !min-h-8 !px-2"
                                >
                                  <Eye
                                    size={13}
                                  />
                                  View
                                </Link>


                                {document.file_url && (
                                  <button
                                    type="button"
                                    className="btn !min-h-8 !px-2"
                                    onClick={() =>
                                      download(
                                        document.id,
                                        document.title
                                      )
                                    }
                                  >
                                    <Download
                                      size={13}
                                    />
                                    Download
                                  </button>
                                )}

                              </>

                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="empty-state">

            <FileText
              className="mx-auto mb-2 text-slate-300"
              size={30}
            />

            <strong>
              No documents found
            </strong>

            <p>
              Change your search or category
              filter.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}