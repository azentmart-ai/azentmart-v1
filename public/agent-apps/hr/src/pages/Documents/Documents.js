const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Documents/Documents.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useRef, useState } from "react";

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
import api from "../../services/api.js";

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
    return React.createElement(ShieldCheck, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 561}} );
  }

  if (category === "Employee Records") {
    return React.createElement(Users, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 565}} );
  }

  if (category === "Certificates" || category === "Training & Development") {
    return React.createElement(FileCheck2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 569}} );
  }

  if (category === "Payroll & Finance") {
    return React.createElement(Archive, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 573}} );
  }

  if (category === "Leave & Attendance") {
    return React.createElement(CalendarDays, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 577}} );
  }

  return React.createElement(FileText, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 580}} );
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
      const data = _optionalChain([response, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) || response.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        _optionalChain([err, 'access', _3 => _3.response, 'optionalAccess', _4 => _4.data, 'optionalAccess', _5 => _5.detail]) || "Unable to load documents."
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
        _optionalChain([document, 'access', _6 => _6.title, 'optionalAccess', _7 => _7.toLowerCase, 'call', _8 => _8(), 'access', _9 => _9.includes, 'call', _10 => _10(query)]) ||
        _optionalChain([document, 'access', _11 => _11.category, 'optionalAccess', _12 => _12.toLowerCase, 'call', _13 => _13(), 'access', _14 => _14.includes, 'call', _15 => _15(query)]) ||
        _optionalChain([document, 'access', _16 => _16.employee, 'optionalAccess', _17 => _17.toLowerCase, 'call', _18 => _18(), 'access', _19 => _19.includes, 'call', _20 => _20(query)]) ||
        _optionalChain([document, 'access', _21 => _21.description, 'optionalAccess', _22 => _22.toLowerCase, 'call', _23 => _23(), 'access', _24 => _24.includes, 'call', _25 => _25(query)]);

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
        _optionalChain([err, 'access', _26 => _26.response, 'optionalAccess', _27 => _27.data, 'optionalAccess', _28 => _28.detail]) || "Document upload failed."
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
        _optionalChain([err, 'access', _29 => _29.response, 'optionalAccess', _30 => _30.data, 'optionalAccess', _31 => _31.detail]) ||
          "Unable to download document."
      );
    }
  };

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 723}}

      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 725}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 726}}
          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 727}}, "HR KNOWLEDGE"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 731}}, "Documents")

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 733}}, "Manage employee records, HR policies, contracts, certificates and company documents."


          )
        )

        , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 739}}
          , React.createElement('input', {
            hidden: true,
            ref: fileRef,
            type: "file",
            accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png",
            onChange: (event) =>
              setFile(_optionalChain([event, 'access', _32 => _32.target, 'access', _33 => _33.files, 'optionalAccess', _34 => _34[0]]) || null)
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 740}}
          )

          , React.createElement('button', {
            type: "button",
            className: "btn",
            onClick: () => _optionalChain([fileRef, 'access', _35 => _35.current, 'optionalAccess', _36 => _36.click, 'call', _37 => _37()]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 750}}

            , React.createElement(Upload, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 755}} ), "Select file"

          )

          , React.createElement('button', {
            type: "button",
            className: "btn btn-primary" ,
            disabled: !file || uploading,
            onClick: upload, __self: this, __source: {fileName: _jsxFileName, lineNumber: 759}}

            , React.createElement(Plus, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 765}} )
            , uploading ? "Uploading..." : "Add document"
          )
        )
      )

      , error && (
        React.createElement('div', { className: "error-box mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 772}}
          , error
        )
      )

      , file && (
        React.createElement('div', { className: "card mb-4 flex items-center justify-between p-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 778}}
          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 779}}
            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 780}}
              , React.createElement(FileText, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 781}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 784}}
              , React.createElement('p', { className: "text-[9px] uppercase tracking-wide text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 785}}, "Ready to upload"

              )
              , React.createElement('p', { className: "text-xs font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 788}}
                , file.name
              )
            )
          )

          , React.createElement('button', {
            type: "button",
            className: "btn",
            onClick: () => {
              setFile(null);
              if (fileRef.current) fileRef.current.value = "";
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 794}}
, "Clear"

          )
        )
      )

      , React.createElement('div', { className: "mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 807}}

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 809}}
          , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 810}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 811}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 812}}, "TOTAL DOCUMENTS"

              )
              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 815}}
                , stats.total
              )
              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 818}}, "Documents in workspace"

              )
            )
            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 822}}
              , React.createElement(FolderOpen, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 823}} )
            )
          )
        )

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 828}}
          , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 829}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 830}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 831}}, "HR POLICIES"

              )
              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 834}}
                , stats.policies
              )
              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 837}}, "Company policy documents"

              )
            )
            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 841}}
              , React.createElement(ShieldCheck, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 842}} )
            )
          )
        )

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 847}}
          , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 848}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 849}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 850}}, "EMPLOYEE RECORDS"

              )
              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 853}}
                , stats.employeeRecords
              )
              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 856}}, "Employee-related documents"

              )
            )
            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 860}}
              , React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 861}} )
            )
          )
        )

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 866}}
          , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 867}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 868}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 869}}, "EXPIRY TRACKING"

              )
              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 872}}
                , stats.expiryTracking
              )
              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 875}}, "Documents with expiry dates"

              )
            )
            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 879}}
              , React.createElement(CalendarDays, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 880}} )
            )
          )
        )

      )

      , React.createElement('div', { className: "card mb-5 overflow-hidden"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 887}}
        , React.createElement('div', { className: "border-b border-slate-100 p-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 888}}
          , React.createElement('span', { className: "text-[9px] font-extrabold tracking-[.14em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 889}}, "DOCUMENT LIBRARY"

          )

          , React.createElement('h2', { className: "mt-1 text-[15px] font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 893}}, "HR document categories"

          )

          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 897}}, "Keep company and employee documentation organized by business function."

          )
        )

        , React.createElement('div', { className: "grid grid-cols-2 gap-3 p-4 md:grid-cols-4 xl:grid-cols-7"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 902}}
          , DOCUMENT_CATEGORIES.map((item) => {
            const count = categoryCounts[item] || 0;
            const active = category === item;

            return (
              React.createElement(Link, {
                key: item,
                to: `/documents/category/${encodeURIComponent(item)}`,
                className: `block rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-100 bg-slate-50 hover:border-blue-100 hover:bg-blue-50/40"
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 908}}

                , React.createElement('span', {
                  className: `mb-3 grid h-8 w-8 place-items-center rounded-lg ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600"
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 917}}

                  , React.createElement(CategoryIcon, { category: item, __self: this, __source: {fileName: _jsxFileName, lineNumber: 924}} )
                )

                , React.createElement('p', { className: "text-[10px] font-bold leading-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 927}}
                  , item
                )

                , React.createElement('p', { className: "mt-1 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 931}}
                  , count, " document" , count !== 1 ? "s" : ""
                )
              )
            );
          })
        )
      )

      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 940}}

        , React.createElement('div', { className: "flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 942}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 944}}
            , React.createElement('h2', { className: "text-[13px] font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 945}}, "Document records"

            )

            , React.createElement('p', { className: "mt-1 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 949}}, "Search, view and manage HR documentation."

            )
          )

          , React.createElement('div', { className: "flex flex-wrap gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 954}}

            , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 956}}
              , React.createElement(Search, {
                size: 14,
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 957}}
              )

              , React.createElement('input', {
                type: "text",
                value: search,
                onChange: (event) =>
                  setSearch(event.target.value)
                ,
                placeholder: "Search documents..." ,
                className: "h-9 w-[210px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[10px] outline-none focus:border-blue-500"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 962}}
              )
            )

            , React.createElement('select', {
              value: category,
              onChange: (event) =>
                setCategory(event.target.value)
              ,
              className: "h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-600 outline-none focus:border-blue-500"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 973}}

              , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 980}}, "All categories" )

              , DOCUMENT_CATEGORIES.map((item) => (
                React.createElement('option', { key: item, value: item, __self: this, __source: {fileName: _jsxFileName, lineNumber: 983}}
                  , item
                )
              ))
            )

          )
        )

        , busy ? (
          React.createElement('div', { className: "loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 993}}, "Loading documents…"

          )
        ) : filteredDocuments.length > 0 ? (
          React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 997}}
            , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 998}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 999}}
                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1000}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1001}}, "DOCUMENT")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1002}}, "CATEGORY")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1003}}, "EMPLOYEE")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1004}}, "STATUS")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1005}}, "EXPIRY")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1006}}, "ACTIONS")
                )
              )

              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1010}}
                , filteredDocuments.map((document) => {
                  const isDefault =
                    String(document.id).startsWith("default-");

                  return (
                    React.createElement('tr', { key: document.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1016}}

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1018}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1019}}
                          , React.createElement('span', { className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1020}}
                            , React.createElement(CategoryIcon, {
                              category: document.category, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1021}}
                            )
                          )

                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1026}}
                            , React.createElement('b', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1027}}, document.title)

                            , React.createElement('div', { className: "max-w-[340px] truncate text-[9px] text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1029}}
                              , document.description
                            )
                          )
                        )
                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1036}}
                        , React.createElement('span', { className: "text-[10px] font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1037}}
                          , document.category
                        )
                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1042}}
                        , React.createElement('span', { className: "text-[10px] text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1043}}
                          , document.employee || "Company"
                        )
                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1048}}
                        , React.createElement('span', { className: "badge success" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1049}}
                          , React.createElement(CheckCircle2, {
                            size: 10,
                            className: "mr-1 inline" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1050}}
                          )
                          , document.status || "Available"
                        )
                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1058}}
                        , React.createElement('span', { className: "text-[10px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1059}}
                          , document.expiry_date || "—"
                        )
                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1064}}
                        , React.createElement('div', { className: "flex gap-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1065}}

                          , isDefault ? (
                            React.createElement('span', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1068}}, "Reference document"

                            )
                          ) : (
                            React.createElement(React.Fragment, null
                              , React.createElement(Link, {
                                to: `/documents/${document.id}`,
                                className: "btn !min-h-8 !px-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1073}}

                                , React.createElement(Eye, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1077}} ), "View"

                              )

                              , document.file_url && (
                                React.createElement('button', {
                                  type: "button",
                                  className: "btn !min-h-8 !px-2"  ,
                                  onClick: () =>
                                    download(
                                      document.id,
                                      document.title
                                    )
                                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1082}}

                                  , React.createElement(Download, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1092}} ), "Download"

                                )
                              )
                            )
                          )

                        )
                      )

                    )
                  );
                })
              )
            )
          )
        ) : (
          React.createElement('div', { className: "empty-state", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1109}}
            , React.createElement(FileText, {
              className: "mx-auto mb-2 text-slate-300"  ,
              size: 30, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1110}}
            )

            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1115}}, "No documents found"  )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1117}}, "Change your search or category filter."

            )
          )
        )

      )

    )
  );
}
