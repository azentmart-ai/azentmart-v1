const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Documents/DocumentViewer.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useRef, useState } from "react";

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

import api from "../../services/api.js";


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
    return React.createElement(ShieldCheck, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}} );
  }

  if (
    category === "Employee Records" ||
    category === "Identity & Compliance"
  ) {
    return React.createElement(Users, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}} );
  }

  if (
    category === "Certificates" ||
    category === "Training & Development"
  ) {
    return React.createElement(FileCheck2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}} );
  }

  if (
    category === "Payroll & Finance"
  ) {
    return React.createElement(Archive, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}} );
  }

  if (
    category === "Leave & Attendance"
  ) {
    return React.createElement(CalendarDays, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}} );
  }

  return React.createElement(FileText, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 330}} );
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
        _optionalChain([response, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) ||
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
        _optionalChain([err, 'access', _3 => _3.response, 'optionalAccess', _4 => _4.data, 'optionalAccess', _5 => _5.detail]) ||
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
            _optionalChain([document, 'access', _6 => _6.title
, 'optionalAccess', _7 => _7.toLowerCase, 'call', _8 => _8()
, 'access', _9 => _9.includes, 'call', _10 => _10(query)]) ||
            _optionalChain([document, 'access', _11 => _11.category
, 'optionalAccess', _12 => _12.toLowerCase, 'call', _13 => _13()
, 'access', _14 => _14.includes, 'call', _15 => _15(query)]) ||
            _optionalChain([document, 'access', _16 => _16.employee
, 'optionalAccess', _17 => _17.toLowerCase, 'call', _18 => _18()
, 'access', _19 => _19.includes, 'call', _20 => _20(query)]);

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
        _optionalChain([err, 'access', _21 => _21.response, 'optionalAccess', _22 => _22.data, 'optionalAccess', _23 => _23.detail]) ||
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
        _optionalChain([err, 'access', _24 => _24.response, 'optionalAccess', _25 => _25.data, 'optionalAccess', _26 => _26.detail]) ||
          "Unable to download document."
      );
    }
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 607}}


      /* =====================================================
          HEADER
      ===================================================== */

      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 616}}

          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 618}}, "HR KNOWLEDGE"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}, "Documents"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 626}}, "Manage employee records, HR policies, contracts, certificates and company documents."


          )

        )


        , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 634}}

          , React.createElement('input', {
            ref: fileRef,
            hidden: true,
            type: "file",
            accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png",
            onChange: (event) =>
              setFile(
                _optionalChain([event, 'access', _27 => _27.target, 'access', _28 => _28.files, 'optionalAccess', _29 => _29[0]]) ||
                  null
              )
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 636}}
          )

          , React.createElement('button', {
            type: "button",
            className: "btn",
            onClick: () =>
              _optionalChain([fileRef, 'access', _30 => _30.current, 'optionalAccess', _31 => _31.click, 'call', _32 => _32()])
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 649}}

            , React.createElement(Upload, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 656}} ), "Select file"

          )

          , React.createElement('button', {
            type: "button",
            className: "btn btn-primary" ,
            disabled: 
              !file ||
              uploading
            ,
            onClick: upload, __self: this, __source: {fileName: _jsxFileName, lineNumber: 660}}

            , React.createElement(Plus, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 669}} )

            , uploading
              ? "Uploading..."
              : "Add document"
          )

        )

      )


      /* =====================================================
          ERROR
      ===================================================== */

      , error && (
        React.createElement('div', { className: "error-box mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 686}}
          , error
        )
      )


      /* =====================================================
          SELECTED FILE
      ===================================================== */

      , file && (
        React.createElement('div', { className: "card mb-4 flex items-center justify-between p-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 697}}

          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 699}}

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 701}}
              , React.createElement(FileText, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 702}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 705}}

              , React.createElement('p', { className: "text-[9px] uppercase tracking-wide text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 707}}, "Ready to upload"

              )

              , React.createElement('p', { className: "text-xs font-bold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 711}}
                , file.name
              )

            )

          )


          , React.createElement('button', {
            type: "button",
            className: "btn",
            onClick: () => {
              setFile(null);

              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 720}}

            , React.createElement(X, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 731}} ), "Clear"

          )

        )
      )


      /* =====================================================
          STATISTICS
      ===================================================== */

      , React.createElement('div', { className: "mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 743}}


        /* TOTAL */

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 748}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 750}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 752}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 754}}, "TOTAL DOCUMENTS"

              )

              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold leading-none text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 758}}
                , stats.total
              )

              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 762}}, "Documents in workspace"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 768}}
              , React.createElement(FolderOpen, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 769}} )
            )

          )

        )


        /* POLICIES */

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 779}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 781}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 783}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 785}}, "HR POLICIES"

              )

              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold leading-none text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 789}}
                , stats.policies
              )

              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 793}}, "Company policy documents"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 799}}
              , React.createElement(ShieldCheck, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 800}} )
            )

          )

        )


        /* EMPLOYEE */

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 810}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 812}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 814}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 816}}, "EMPLOYEE RECORDS"

              )

              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold leading-none text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 820}}
                , stats.employeeRecords
              )

              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 824}}, "Employee-related documents"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 830}}
              , React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 831}} )
            )

          )

        )


        /* EXPIRY */

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 841}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 843}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 845}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 847}}, "EXPIRY TRACKING"

              )

              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold leading-none text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 851}}
                , stats.expiryTracking
              )

              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 855}}, "Documents with expiry dates"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 861}}
              , React.createElement(CalendarDays, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 862}} )
            )

          )

        )

      )


      /* =====================================================
          DOCUMENT LIBRARY
      ===================================================== */

      , React.createElement('div', { className: "card mb-5 overflow-hidden"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 876}}

        , React.createElement('div', { className: "border-b border-slate-100 p-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 878}}

          , React.createElement('span', { className: "text-[9px] font-extrabold tracking-[0.14em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 880}}, "DOCUMENT LIBRARY"

          )

          , React.createElement('h2', { className: "mt-1 text-[15px] font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 884}}, "HR document categories"

          )

          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 888}}, "Keep company and employee documentation organized by business function."


          )

        )


        , React.createElement('div', { className: "grid grid-cols-2 gap-3 p-4 md:grid-cols-4 xl:grid-cols-7"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 896}}

          , DOCUMENT_CATEGORIES.map(
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
                React.createElement('button', {
                  type: "button",
                  key: item,
                  onClick: () =>
                    setCategory(
                      active
                        ? ""
                        : item
                    )
                  ,
                  className: `rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-blue-200 bg-blue-50"
                      : "border-slate-100 bg-slate-50 hover:border-blue-100 hover:bg-blue-50/40"
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 912}}


                  , React.createElement('span', {
                    className: `mb-3 grid h-8 w-8 place-items-center rounded-lg ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600"
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 929}}

                    , React.createElement(CategoryIcon, {
                      category: item, __self: this, __source: {fileName: _jsxFileName, lineNumber: 936}}
                    )
                  )

                  , React.createElement('p', { className: "text-[10px] font-bold leading-4 text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 941}}
                    , item
                  )

                  , React.createElement('p', { className: "mt-1 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 945}}
                    , count, " document"
                    , count !== 1
                      ? "s"
                      : ""
                  )

                )
              );
            }
          )

        )

      )


      /* =====================================================
          DOCUMENT RECORDS
      ===================================================== */

      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 966}}


        /* TABLE HEADER */

        , React.createElement('div', { className: "flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 971}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 973}}

            , React.createElement('h2', { className: "text-[13px] font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 975}}, "Document records"

            )

            , React.createElement('p', { className: "mt-1 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 979}}, "Search, view and manage HR documentation."

            )

          )


          /* FILTERS */

          , React.createElement('div', { className: "flex flex-wrap items-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 988}}

            , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 990}}

              , React.createElement(Search, {
                size: 14,
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 992}}
              )

              , React.createElement('input', {
                type: "text",
                value: search,
                onChange: (event) =>
                  setSearch(
                    event.target.value
                  )
                ,
                placeholder: "Search documents..." ,
                className: "h-9 w-[210px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[10px] outline-none focus:border-blue-500"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 997}}
              )

            )


            , React.createElement('select', {
              value: category,
              onChange: (event) =>
                setCategory(
                  event.target.value
                )
              ,
              className: "h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-600 outline-none focus:border-blue-500"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1012}}


              , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1022}}, "All categories"

              )

              , DOCUMENT_CATEGORIES.map(
                (item) => (
                  React.createElement('option', {
                    key: item,
                    value: item, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1028}}

                    , item
                  )
                )
              )

            )

          )

        )


        /* ===================================================
            TABLE
        =================================================== */

        , busy ? (

          React.createElement('div', { className: "loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1050}}, "Loading documents…"

          )

        ) : filteredDocuments.length ? (

          React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1056}}

            , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1058}}

              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1060}}

                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1062}}

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1064}}, "DOCUMENT"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1068}}, "CATEGORY"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1072}}, "EMPLOYEE"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1076}}, "STATUS"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1080}}, "EXPIRY"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1084}}, "ACTIONS"

                  )

                )

              )


              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1093}}

                , filteredDocuments.map(
                  (document) => {

                    const isReference =
                      String(
                        document.id
                      ).startsWith(
                        "demo-"
                      );

                    return (
                      React.createElement('tr', {
                        key: 
                          document.id
                        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1106}}



                        /* DOCUMENT */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1115}}

                          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1117}}

                            , React.createElement('span', { className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1119}}

                              , React.createElement(CategoryIcon, {
                                category: 
                                  document.category
                                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1121}}
                              )

                            )


                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1130}}

                              , React.createElement('b', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1132}}
                                , 
                                  document.title
                                
                              )

                              , React.createElement('div', { className: "max-w-[300px] truncate text-[9px] text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1138}}
                                , 
                                  document.description ||
                                  "HR document"
                                
                              )

                            )

                          )

                        )


                        /* CATEGORY */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1154}}

                          , React.createElement('span', { className: "text-[10px] font-semibold text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1156}}
                            , 
                              document.category ||
                              "General"
                            
                          )

                        )


                        /* EMPLOYEE */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1168}}

                          , React.createElement('span', { className: "text-[10px] text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1170}}
                            , 
                              document.employee ||
                              "Company"
                            
                          )

                        )


                        /* STATUS */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1182}}

                          , React.createElement('span', { className: "badge success" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1184}}

                            , React.createElement(CheckCircle2, {
                              size: 10,
                              className: "mr-1 inline" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1186}}
                            )

                            , 
                              document.status ||
                              "Available"
                            

                          )

                        )


                        /* EXPIRY */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1203}}

                          , React.createElement('span', { className: "text-[10px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1205}}
                            , 
                              document.expiry_date ||
                              "—"
                            
                          )

                        )


                        /* ACTIONS */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1217}}

                          , React.createElement('div', { className: "flex gap-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1219}}

                            , isReference ? (

                              React.createElement('span', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1223}}, "Reference document"

                              )

                            ) : (

                              React.createElement(React.Fragment, null

                                , React.createElement(Link, {
                                  to: `/documents/${document.id}`,
                                  className: "btn !min-h-8 !px-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1231}}

                                  , React.createElement(Eye, {
                                    size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1235}}
                                  ), "View"

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
                                    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1243}}

                                    , React.createElement(Download, {
                                      size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1253}}
                                    ), "Download"

                                  )
                                )

                              )

                            )

                          )

                        )

                      )
                    );
                  }
                )

              )

            )

          )

        ) : (

          React.createElement('div', { className: "empty-state", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1281}}

            , React.createElement(FileText, {
              className: "mx-auto mb-2 text-slate-300"  ,
              size: 30, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1283}}
            )

            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1288}}, "No documents found"

            )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1292}}, "Change your search or category filter."


            )

          )

        )

      )

    )
  );
}