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
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../../services/api";

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

/* Default HR reference documents. */

export const DEFAULT_DOCUMENTS = [
  /* =====================================================
     EMPLOYEE RECORDS
  ===================================================== */

  {
    id: "default-emp-001",
    title: "Employee Personal Information",
    category: "Employee Records",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee personal information including name, date of birth, gender, marital status and blood group.",
  },
  {
    id: "default-emp-002",
    title: "Employee Contact Details",
    category: "Employee Records",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee email address, phone number, current address, permanent address and emergency contact details.",
  },
  {
    id: "default-emp-003",
    title: "Emergency Contact Record",
    category: "Employee Records",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Emergency contact information maintained by HR for employee safety and emergency communication.",
  },


  /* =====================================================
     IDENTITY & COMPLIANCE
  ===================================================== */

  {
    id: "default-id-001",
    title: "Government Identity Proof",
    category: "Identity & Compliance",
    employee: "Employee Record",
    status: "Verified",
    expiry_date: "2030-12-31",
    description:
      "Government-issued identity document used for employee identity verification.",
  },
  {
    id: "default-id-002",
    title: "Address Proof",
    category: "Identity & Compliance",
    employee: "Employee Record",
    status: "Verified",
    expiry_date: "2029-12-31",
    description:
      "Employee residential address verification document maintained for compliance purposes.",
  },
  {
    id: "default-id-003",
    title: "Background Verification Report",
    category: "Identity & Compliance",
    employee: "Employee Record",
    status: "Verified",
    expiry_date: "—",
    description:
      "Background verification report covering employment and identity verification.",
  },


  /* =====================================================
     EMPLOYMENT
  ===================================================== */

  {
    id: "default-employment-001",
    title: "Offer Letter",
    category: "Employment",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Formal employment offer containing position, compensation and joining information.",
  },
  {
    id: "default-employment-002",
    title: "Employment Agreement",
    category: "Employment",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employment agreement defining employee responsibilities, terms and conditions.",
  },
  {
    id: "default-employment-003",
    title: "Joining Letter",
    category: "Employment",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee joining confirmation containing date of joining and employment details.",
  },
  {
    id: "default-employment-004",
    title: "Job Description",
    category: "Employment",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Role responsibilities, required skills, reporting structure and position expectations.",
  },


  /* =====================================================
     PAYROLL & FINANCE
  ===================================================== */

  {
    id: "default-payroll-001",
    title: "Bank Account Details",
    category: "Payroll & Finance",
    employee: "Employee Record",
    status: "Verified",
    expiry_date: "—",
    description:
      "Employee bank account information required for monthly salary processing.",
  },
  {
    id: "default-payroll-002",
    title: "Salary Structure",
    category: "Payroll & Finance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee compensation structure including basic salary, allowances and deductions.",
  },
  {
    id: "default-payroll-003",
    title: "Monthly Payslip",
    category: "Payroll & Finance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Monthly salary statement containing earnings, deductions, taxes and net pay.",
  },
  {
    id: "default-payroll-004",
    title: "Tax Declaration",
    category: "Payroll & Finance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "2027-03-31",
    description:
      "Employee tax declaration and supporting information used for payroll processing.",
  },


  /* =====================================================
     BENEFITS
  ===================================================== */

  {
    id: "default-benefit-001",
    title: "Benefits Enrollment Form",
    category: "Benefits",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee selection and enrollment information for available company benefits.",
  },
  {
    id: "default-benefit-002",
    title: "Health Insurance Details",
    category: "Benefits",
    employee: "Employee Record",
    status: "Active",
    expiry_date: "2027-03-31",
    description:
      "Employee medical insurance coverage and policy information.",
  },
  {
    id: "default-benefit-003",
    title: "Dependent Information",
    category: "Benefits",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee dependent information used for applicable company benefit programs.",
  },


  /* =====================================================
     LEAVE & ATTENDANCE
  ===================================================== */

  {
    id: "default-leave-001",
    title: "Leave & Attendance Policy",
    category: "Leave & Attendance",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Company rules covering working hours, attendance, leave requests and holidays.",
  },
  {
    id: "default-leave-002",
    title: "Leave Balance Statement",
    category: "Leave & Attendance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Current leave balances including annual leave, sick leave and other leave types.",
  },
  {
    id: "default-leave-003",
    title: "Attendance Summary",
    category: "Leave & Attendance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee attendance summary including present days, absences, late arrivals and overtime.",
  },
  {
    id: "default-leave-004",
    title: "Attendance Regularization Form",
    category: "Leave & Attendance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Request form for correcting missing check-ins, check-outs or attendance records.",
  },


  /* =====================================================
     PERFORMANCE
  ===================================================== */

  {
    id: "default-performance-001",
    title: "Performance Review - 2026",
    category: "Performance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Annual employee performance evaluation covering goals, achievements and feedback.",
  },
  {
    id: "default-performance-002",
    title: "Performance Goals",
    category: "Performance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee performance goals, objectives and measurable outcomes.",
  },
  {
    id: "default-performance-003",
    title: "Manager Feedback",
    category: "Performance",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Manager feedback covering strengths, development areas and employee progress.",
  },


  /* =====================================================
     TRAINING & DEVELOPMENT
  ===================================================== */

  {
    id: "default-training-001",
    title: "Company Orientation",
    category: "Training & Development",
    employee: "Employee Record",
    status: "Completed",
    expiry_date: "—",
    description:
      "New employee orientation covering company culture, teams and workplace processes.",
  },
  {
    id: "default-training-002",
    title: "Security Awareness Training",
    category: "Training & Development",
    employee: "Employee Record",
    status: "Completed",
    expiry_date: "—",
    description:
      "Mandatory security training covering passwords, phishing, data protection and safe system usage.",
  },
  {
    id: "default-training-003",
    title: "Workplace Conduct Training",
    category: "Training & Development",
    employee: "Employee Record",
    status: "Completed",
    expiry_date: "—",
    description:
      "Training covering workplace behaviour, professionalism and employee responsibilities.",
  },
  {
    id: "default-training-004",
    title: "HR Systems Introduction",
    category: "Training & Development",
    employee: "Employee Record",
    status: "Completed",
    expiry_date: "—",
    description:
      "Introduction to HR systems including attendance, leave, documents and employee services.",
  },


  /* =====================================================
     POLICIES
  ===================================================== */

  {
    id: "default-policy-001",
    title: "Code of Conduct",
    category: "Policies",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Guidelines covering professional behaviour, ethics, workplace conduct and employee responsibilities.",
  },
  {
    id: "default-policy-002",
    title: "Information Security Policy",
    category: "Policies",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Policy covering confidential information, system access, passwords and data security.",
  },
  {
    id: "default-policy-003",
    title: "Remote Work Policy",
    category: "Policies",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Guidelines for employees working remotely or under hybrid work arrangements.",
  },
  {
    id: "default-policy-004",
    title: "Employee Privacy Policy",
    category: "Policies",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Policy explaining employee data handling, privacy and information protection practices.",
  },


  /* =====================================================
     RECRUITMENT
  ===================================================== */

  {
    id: "default-recruitment-001",
    title: "Candidate Resume",
    category: "Recruitment",
    employee: "Candidate",
    status: "Available",
    expiry_date: "—",
    description:
      "Candidate resume containing education, professional experience and technical skills.",
  },
  {
    id: "default-recruitment-002",
    title: "Interview Evaluation Form",
    category: "Recruitment",
    employee: "Candidate",
    status: "Available",
    expiry_date: "—",
    description:
      "Structured interviewer feedback and candidate evaluation record.",
  },
  {
    id: "default-recruitment-003",
    title: "Candidate Offer Approval",
    category: "Recruitment",
    employee: "Candidate",
    status: "Available",
    expiry_date: "—",
    description:
      "Internal approval record for candidate selection and employment offer.",
  },


  /* =====================================================
     COMPANY DOCUMENTS
  ===================================================== */

  {
    id: "default-company-001",
    title: "Employee Handbook",
    category: "Company Documents",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Company handbook covering workplace practices, employee services and HR procedures.",
  },
  {
    id: "default-company-002",
    title: "HR Process Guide",
    category: "Company Documents",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Internal HR process guide covering employee lifecycle and People Operations workflows.",
  },
  {
    id: "default-company-003",
    title: "Company Organization Structure",
    category: "Company Documents",
    employee: "Company",
    status: "Available",
    expiry_date: "—",
    description:
      "Organization structure showing departments, teams and reporting relationships.",
  },


  /* =====================================================
     CERTIFICATES
  ===================================================== */

  {
    id: "default-certificate-001",
    title: "Education Certificate",
    category: "Certificates",
    employee: "Employee Record",
    status: "Verified",
    expiry_date: "—",
    description:
      "Academic qualification and education verification certificate.",
  },
  {
    id: "default-certificate-002",
    title: "Experience Certificate",
    category: "Certificates",
    employee: "Employee Record",
    status: "Verified",
    expiry_date: "—",
    description:
      "Previous employment experience verification certificate.",
  },
  {
    id: "default-certificate-003",
    title: "Training Certificate",
    category: "Certificates",
    employee: "Employee Record",
    status: "Verified",
    expiry_date: "—",
    description:
      "Certificate confirming successful completion of professional training.",
  },


  /* =====================================================
     OTHER
  ===================================================== */

  {
    id: "default-other-001",
    title: "Employee Asset Acknowledgement",
    category: "Other",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Record confirming company assets issued to an employee.",
  },
  {
    id: "default-other-002",
    title: "IT Access Request",
    category: "Other",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Request and approval record for employee access to company systems.",
  },
  {
    id: "default-other-003",
    title: "Exit Clearance Form",
    category: "Other",
    employee: "Employee Record",
    status: "Available",
    expiry_date: "—",
    description:
      "Employee exit clearance covering assets, access, payroll and HR closure.",
  },
];

function CategoryIcon({ category }) {
  if (category === "Policies" || category === "Identity & Compliance") {
    return <ShieldCheck size={15} />;
  }

  if (category === "Employee Records") {
    return <Users size={15} />;
  }

  if (category === "Certificates" || category === "Training & Development") {
    return <FileCheck2 size={15} />;
  }

  if (category === "Payroll & Finance") {
    return <Archive size={15} />;
  }

  if (category === "Leave & Attendance") {
    return <CalendarDays size={15} />;
  }

  return <FileText size={15} />;
}

export default function Documents() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const fileRef = useRef(null);

  const load = async () => {
    setBusy(true);
    setError("");

    try {
      const response = await api.get("/documents");
      const data = response.data?.items || response.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Unable to load documents."
      );
      setItems([]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const allDocuments = useMemo(() => {
    const realDocuments = Array.isArray(items) ? items : [];
    return [...realDocuments, ...DEFAULT_DOCUMENTS];
  }, [items]);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allDocuments.filter((document) => {
      const matchesSearch =
        !query ||
        document.title?.toLowerCase().includes(query) ||
        document.category?.toLowerCase().includes(query) ||
        document.employee?.toLowerCase().includes(query) ||
        document.description?.toLowerCase().includes(query);

      const matchesCategory =
        !category || document.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [allDocuments, search, category]);

  const stats = useMemo(
    () => ({
      total: allDocuments.length,
      policies: allDocuments.filter(
        (item) => item.category === "Policies"
      ).length,
      employeeRecords: allDocuments.filter(
        (item) => item.category === "Employee Records"
      ).length,
      expiryTracking: allDocuments.filter(
        (item) => item.expiry_date && item.expiry_date !== "—"
      ).length,
    }),
    [allDocuments]
  );

  const categoryCounts = useMemo(() => {
    const result = {};

    DOCUMENT_CATEGORIES.forEach((name) => {
      result[name] = allDocuments.filter(
        (document) => document.category === name
      ).length;
    });

    return result;
  }, [allDocuments]);

  const upload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      await load();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Document upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const download = async (id, title) => {
    try {
      const response = await api.get(
        `/documents/${id}/download`,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = title || "document";
      document.body.appendChild(anchor);
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

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <span className="text-[10px] font-extrabold tracking-[.16em] text-blue-600">
            HR KNOWLEDGE
          </span>

          <h1 className="mt-1">Documents</h1>

          <p>
            Manage employee records, HR policies, contracts,
            certificates and company documents.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            hidden
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={(event) =>
              setFile(event.target.files?.[0] || null)
            }
          />

          <button
            type="button"
            className="btn"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={14} />
            Select file
          </button>

          <button
            type="button"
            className="btn btn-primary"
            disabled={!file || uploading}
            onClick={upload}
          >
            <Plus size={14} />
            {uploading ? "Uploading..." : "Add document"}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-box mb-4">
          {error}
        </div>
      )}

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
              <p className="text-xs font-bold">
                {file.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn"
            onClick={() => {
              setFile(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
          >
            Clear
          </button>
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="card p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.08em] text-slate-400">
                TOTAL DOCUMENTS
              </p>
              <p className="mt-3 text-[22px] font-extrabold">
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

        <div className="card p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.08em] text-slate-400">
                HR POLICIES
              </p>
              <p className="mt-3 text-[22px] font-extrabold">
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

        <div className="card p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.08em] text-slate-400">
                EMPLOYEE RECORDS
              </p>
              <p className="mt-3 text-[22px] font-extrabold">
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

        <div className="card p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.08em] text-slate-400">
                EXPIRY TRACKING
              </p>
              <p className="mt-3 text-[22px] font-extrabold">
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

      <div className="card mb-5 overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <span className="text-[9px] font-extrabold tracking-[.14em] text-blue-600">
            DOCUMENT LIBRARY
          </span>

          <h2 className="mt-1 text-[15px] font-extrabold">
            HR document categories
          </h2>

          <p className="mt-1 text-[10px] text-slate-500">
            Keep company and employee documentation organized by business function.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4 xl:grid-cols-7">
          {DOCUMENT_CATEGORIES.map((item) => {
            const count = categoryCounts[item] || 0;
            const active = category === item;

            return (
              <Link
                key={item}
                to={`/documents/category/${encodeURIComponent(item)}`}
                className={`block rounded-xl border p-3 text-left transition ${
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
                  <CategoryIcon category={item} />
                </span>

                <p className="text-[10px] font-bold leading-4">
                  {item}
                </p>

                <p className="mt-1 text-[9px] text-slate-400">
                  {count} document{count !== 1 ? "s" : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="card overflow-hidden">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">

          <div>
            <h2 className="text-[13px] font-extrabold">
              Document records
            </h2>

            <p className="mt-1 text-[9px] text-slate-400">
              Search, view and manage HR documentation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search documents..."
                className="h-9 w-[210px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[10px] outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-600 outline-none focus:border-blue-500"
            >
              <option value="">All categories</option>

              {DOCUMENT_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>
        </div>

        {busy ? (
          <div className="loading">
            Loading documents…
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>DOCUMENT</th>
                  <th>CATEGORY</th>
                  <th>EMPLOYEE</th>
                  <th>STATUS</th>
                  <th>EXPIRY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredDocuments.map((document) => {
                  const isDefault =
                    String(document.id).startsWith("default-");

                  return (
                    <tr key={document.id}>

                      <td>
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                            <CategoryIcon
                              category={document.category}
                            />
                          </span>

                          <div>
                            <b>{document.title}</b>

                            <div className="max-w-[340px] truncate text-[9px] text-slate-400">
                              {document.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="text-[10px] font-semibold">
                          {document.category}
                        </span>
                      </td>

                      <td>
                        <span className="text-[10px] text-slate-600">
                          {document.employee || "Company"}
                        </span>
                      </td>

                      <td>
                        <span className="badge success">
                          <CheckCircle2
                            size={10}
                            className="mr-1 inline"
                          />
                          {document.status || "Available"}
                        </span>
                      </td>

                      <td>
                        <span className="text-[10px] text-slate-500">
                          {document.expiry_date || "—"}
                        </span>
                      </td>

                      <td>
                        <div className="flex gap-1">

                          {isDefault ? (
                            <span className="text-[9px] text-slate-400">
                              Reference document
                            </span>
                          ) : (
                            <>
                              <Link
                                to={`/documents/${document.id}`}
                                className="btn !min-h-8 !px-2"
                              >
                                <Eye size={13} />
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
                                  <Download size={13} />
                                  Download
                                </button>
                              )}
                            </>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <FileText
              className="mx-auto mb-2 text-slate-300"
              size={30}
            />

            <strong>No documents found</strong>

            <p>
              Change your search or category filter.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
