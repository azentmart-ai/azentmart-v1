const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Benefits/Benefits.jsx";import React, { useMemo, useState } from "react";

import {
  ArrowDownToLine,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Filter,
  GraduationCap,
  HeartPulse,
  LifeBuoy,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const BENEFITS = [
  {
    id: "health-insurance",
    name: "Health Insurance",
    category: "Health & Wellness",
    provider: "People Operations",
    eligibility: "All eligible employees",
    status: "Active",
    effectiveDate: "01 Jan 2026",
    description:
      "Medical insurance support for eligible employees under the company health plan.",
    icon: HeartPulse,
    details: [
      "Employee medical insurance coverage is available to eligible employees.",
      "Hospitalization and eligible medical expenses are covered according to the applicable plan.",
      "Employees can contact People Operations for enrollment and claims support.",
      "Coverage is subject to the terms and conditions of the applicable insurance plan.",
    ],
  },

  {
    id: "family-health",
    name: "Family Health Coverage",
    category: "Health & Wellness",
    provider: "People Operations",
    eligibility: "Eligible employees",
    status: "Active",
    effectiveDate: "01 Jan 2026",
    description:
      "Health coverage options supporting eligible dependents and family members.",
    icon: HeartPulse,
    details: [
      "Eligible employees may enroll approved dependents under available family coverage.",
      "Dependent eligibility is determined by the applicable benefit plan.",
      "Employees must maintain accurate dependent information with HR.",
      "People Operations can assist with enrollment and documentation.",
    ],
  },

  {
    id: "learning-development",
    name: "Learning & Development",
    category: "Learning",
    provider: "People Operations",
    eligibility: "All employees",
    status: "Active",
    effectiveDate: "01 Jan 2026",
    description:
      "Training and professional development programs supporting employee growth.",
    icon: GraduationCap,
    details: [
      "Employees may participate in approved technical and professional training programs.",
      "Learning programs can include technical skills, workplace skills and role-specific training.",
      "Managers may recommend development programs based on role requirements.",
      "Training participation may be tracked through the HR system.",
    ],
  },

  {
    id: "employee-assistance",
    name: "Employee Assistance",
    category: "Wellness",
    provider: "People Operations",
    eligibility: "All employees",
    status: "Active",
    effectiveDate: "01 Feb 2026",
    description:
      "Workplace wellbeing resources and employee support services.",
    icon: LifeBuoy,
    details: [
      "Employees can contact People Operations for workplace support.",
      "Available support programs may include wellbeing and employee assistance resources.",
      "Employees can request guidance regarding workplace-related concerns.",
      "Specific services depend on the programs currently offered by the organization.",
    ],
  },

  {
    id: "paid-time-off",
    name: "Paid Time Off",
    category: "Leave & Attendance",
    provider: "People Operations",
    eligibility: "Eligible employees",
    status: "Active",
    effectiveDate: "01 Jan 2026",
    description:
      "Leave benefits supporting annual, personal and approved employee time off.",
    icon: BriefcaseBusiness,
    details: [
      "Eligible employees can apply for leave through the HR system.",
      "Leave balances are maintained according to applicable company rules.",
      "Planned leave should be requested in advance whenever possible.",
      "Emergency leave should be communicated to the reporting manager promptly.",
    ],
  },

  {
    id: "retirement",
    name: "Retirement & Savings",
    category: "Payroll & Finance",
    provider: "People Operations",
    eligibility: "Eligible employees",
    status: "Active",
    effectiveDate: "01 Apr 2026",
    description:
      "Payroll-linked savings and statutory contribution support.",
    icon: ShieldCheck,
    details: [
      "Eligible employee and employer contributions are maintained through payroll.",
      "Applicable statutory contributions are processed according to company requirements.",
      "Employees can review relevant payroll information through the HR system.",
      "People Operations can assist with contribution-related questions.",
    ],
  },

  {
    id: "performance-rewards",
    name: "Performance Rewards",
    category: "Recognition",
    provider: "People Operations",
    eligibility: "Eligible employees",
    status: "Active",
    effectiveDate: "01 Apr 2026",
    description:
      "Recognition programs supporting employee achievements and contributions.",
    icon: Sparkles,
    details: [
      "Employees may be recognized for project contributions and achievements.",
      "Recognition may be provided through formal or informal programs.",
      "Eligibility and reward types may vary by program.",
      "Managers and HR may nominate employees for applicable recognition programs.",
    ],
  },

  {
    id: "employee-discounts",
    name: "Employee Discounts",
    category: "Lifestyle",
    provider: "People Operations",
    eligibility: "Eligible employees",
    status: "Active",
    effectiveDate: "01 May 2026",
    description:
      "Approved employee offers, partner discounts and lifestyle benefits.",
    icon: Users,
    details: [
      "Employees may receive access to approved partner offers.",
      "Discount availability depends on participating programs.",
      "Individual offers may have separate eligibility requirements.",
      "Employees can contact HR for currently available programs.",
    ],
  },
];

function downloadBenefit(benefit) {
  const content = `
AZENTMART PEOPLE OPERATIONS
========================================

${benefit.name.toUpperCase()}

Category: ${benefit.category}
Provider: ${benefit.provider}
Eligibility: ${benefit.eligibility}
Status: ${benefit.status}
Effective Date: ${benefit.effectiveDate}

DESCRIPTION
----------------------------------------
${benefit.description}

BENEFIT DETAILS
----------------------------------------

${benefit.details
  .map((detail, index) => `${index + 1}. ${detail}`)
  .join("\n")}

SUPPORT
----------------------------------------
Contact People Operations for additional information,
eligibility questions and benefit support.

Maintained by People Operations.
`;

  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${benefit.name
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()}.txt`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}

function BenefitViewer({ benefit, onClose }) {
  if (!benefit) return null;

  const Icon = benefit.icon || HeartPulse;

  return (
    React.createElement('div', {
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"        ,
      onMouseDown: (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}

      , React.createElement('div', { className: "flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}}

        /* HEADER */
        , React.createElement('div', { className: "flex items-start justify-between border-b border-slate-200 px-6 py-5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}

          , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}

            , React.createElement('span', { className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}
              , React.createElement(Icon, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 247}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
              , React.createElement('span', { className: "text-[9px] font-extrabold uppercase tracking-[0.16em] text-blue-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}, "BENEFIT PROGRAM"

              )

              , React.createElement('h2', { className: "mt-1 text-base font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}
                , benefit.name
              )

              , React.createElement('p', { className: "mt-1 text-[11px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}
                , benefit.description
              )
            )

          )

          , React.createElement('button', {
            type: "button",
            onClick: onClose,
            className: "grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}

            , React.createElement(X, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}} )
          )

        )

        /* BODY */
        , React.createElement('div', { className: "min-h-0 flex-1 overflow-y-auto bg-slate-50 p-5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}

          /* INFORMATION */
          , React.createElement('div', { className: "grid gap-3 md:grid-cols-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}

            , React.createElement('div', { className: "rounded-xl border border-slate-200 bg-white p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}
              , React.createElement('span', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}, "Category"

              )

              , React.createElement('p', { className: "mt-2 text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
                , benefit.category
              )
            )

            , React.createElement('div', { className: "rounded-xl border border-slate-200 bg-white p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}
              , React.createElement('span', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}, "Provider"

              )

              , React.createElement('p', { className: "mt-2 text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}
                , benefit.provider
              )
            )

            , React.createElement('div', { className: "rounded-xl border border-slate-200 bg-white p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
              , React.createElement('span', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}, "Eligibility"

              )

              , React.createElement('p', { className: "mt-2 text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}
                , benefit.eligibility
              )
            )

            , React.createElement('div', { className: "rounded-xl border border-slate-200 bg-white p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}
              , React.createElement('span', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}, "Effective"

              )

              , React.createElement('p', { className: "mt-2 text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}
                , benefit.effectiveDate
              )
            )

          )

          /* OVERVIEW */
          , React.createElement('div', { className: "mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}

            , React.createElement('div', { className: "flex gap-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}

              , React.createElement(FileText, {
                size: 17,
                className: "mt-0.5 shrink-0 text-blue-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 334}}

                , React.createElement('h3', { className: "text-xs font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 336}}, "Benefit Overview"

                )

                , React.createElement('p', { className: "mt-2 text-[11px] leading-5 text-slate-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}
                  , benefit.description
                )

              )

            )

          )

          /* DETAILS */
          , React.createElement('div', { className: "mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}

            , React.createElement('div', { className: "border-b border-slate-100 px-5 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}

              , React.createElement('span', { className: "text-[9px] font-extrabold uppercase tracking-[0.16em] text-blue-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}, "PROGRAM DETAILS"

              )

              , React.createElement('h3', { className: "mt-1 text-sm font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}}, "Benefit information"

              )

            )

            , React.createElement('div', { className: "divide-y divide-slate-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}

              , benefit.details.map((detail, index) => (

                React.createElement('div', {
                  key: index,
                  className: "flex gap-3 px-5 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}


                  , React.createElement('span', { className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-[9px] font-extrabold text-slate-500"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}
                    , String(index + 1).padStart(2, "0")
                  )

                  , React.createElement('p', { className: "text-[11px] leading-5 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}
                    , detail
                  )

                )

              ))

            )

          )

          /* SUPPORT */
          , React.createElement('div', { className: "mt-4 rounded-xl border border-slate-200 bg-white p-5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}

            , React.createElement('div', { className: "flex gap-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 393}}

              , React.createElement(LifeBuoy, {
                size: 16,
                className: "mt-0.5 text-blue-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}

                , React.createElement('h3', { className: "text-xs font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}, "HR Support"

                )

                , React.createElement('p', { className: "mt-1 text-[11px] leading-5 text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}, "Contact People Operations for eligibility, enrollment, documentation or benefit-related questions."


                )

              )

            )

          )

        )

        /* FOOTER */
        , React.createElement('div', { className: "flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-5 py-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}

          , React.createElement('div', { className: "hidden items-center gap-2 text-[10px] text-slate-400 sm:flex"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 422}}
            , React.createElement(ShieldCheck, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}} ), "Maintained by People Operations"

          )

          , React.createElement('div', { className: "ml-auto flex gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 427}}

            , React.createElement('button', {
              type: "button",
              className: "btn",
              onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}
, "Close"

            )

            , React.createElement('button', {
              type: "button",
              className: "btn btn-primary" ,
              onClick: () => downloadBenefit(benefit), __self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}

              , React.createElement(ArrowDownToLine, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 442}} ), "Download"

            )

          )

        )

      )
    )
  );
}

export default function Benefits() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [selectedBenefit, setSelectedBenefit] = useState(null);

  const categories = [
    "All categories",
    "Health & Wellness",
    "Learning",
    "Wellness",
    "Leave & Attendance",
    "Payroll & Finance",
    "Recognition",
    "Lifestyle",
  ];

  const filteredBenefits = useMemo(() => {

    const query = search.trim().toLowerCase();

    return BENEFITS.filter((benefit) => {

      const matchesSearch =
        !query ||
        benefit.name.toLowerCase().includes(query) ||
        benefit.description.toLowerCase().includes(query) ||
        benefit.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "All categories" ||
        benefit.category === category;

      return matchesSearch && matchesCategory;
    });

  }, [search, category]);

  const total = BENEFITS.length;

  const active = BENEFITS.filter(
    (benefit) => benefit.status === "Active"
  ).length;

  const health = BENEFITS.filter(
    (benefit) => benefit.category === "Health & Wellness"
  ).length;

  const learning = BENEFITS.filter(
    (benefit) => benefit.category === "Learning"
  ).length;

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 507}}

      /* PAGE HEADER */
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 510}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 512}}

          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}, "TOTAL REWARDS"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 518}}, "Benefits"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 522}}, "Manage employee benefits, health coverage, learning programs, wellness and workplace support."


          )

        )

      )

      /* SUMMARY CARDS */
      , React.createElement('div', { className: "mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 532}}

        /* TOTAL */
        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 535}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 539}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 541}}, "Total Benefits"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 545}}
                , total
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 549}}, "Benefit programs"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 555}}
              , React.createElement(FileText, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 556}} )
            )

          )

        )

        /* ACTIVE */
        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 564}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 566}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 568}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 570}}, "Active"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}
                , active
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 578}}, "Currently available"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 584}}
              , React.createElement(CheckCircle2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 585}} )
            )

          )

        )

        /* HEALTH */
        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 593}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 595}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 597}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 599}}, "Health Programs"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 603}}
                , health
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 607}}, "Health & wellness"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-500"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 613}}
              , React.createElement(HeartPulse, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}} )
            )

          )

        )

        /* LEARNING */
        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 624}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 626}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 628}}, "Learning"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 632}}
                , learning
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 636}}, "Development programs"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-violet-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 642}}
              , React.createElement(GraduationCap, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}} )
            )

          )

        )

      )

      /* BENEFIT CATEGORIES */
      , React.createElement('div', { className: "card mb-4 overflow-hidden"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}

        , React.createElement('div', { className: "border-b border-slate-100 px-5 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 655}}

          , React.createElement('span', { className: "text-[9px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 657}}, "BENEFIT LIBRARY"

          )

          , React.createElement('h2', { className: "mt-1 text-sm font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 661}}, "Employee benefit categories"

          )

          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 665}}, "Browse employee programs organized by HR service area."

          )

        )

        , React.createElement('div', { className: "grid grid-cols-2 gap-3 p-4 md:grid-cols-4 xl:grid-cols-7"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 671}}

          , [
            {
              name: "Health & Wellness",
              icon: HeartPulse,
              count: BENEFITS.filter(
                (x) => x.category === "Health & Wellness"
              ).length,
            },

            {
              name: "Learning",
              icon: GraduationCap,
              count: BENEFITS.filter(
                (x) => x.category === "Learning"
              ).length,
            },

            {
              name: "Wellness",
              icon: LifeBuoy,
              count: BENEFITS.filter(
                (x) => x.category === "Wellness"
              ).length,
            },

            {
              name: "Leave & Attendance",
              icon: BriefcaseBusiness,
              count: BENEFITS.filter(
                (x) => x.category === "Leave & Attendance"
              ).length,
            },

            {
              name: "Payroll & Finance",
              icon: ShieldCheck,
              count: BENEFITS.filter(
                (x) => x.category === "Payroll & Finance"
              ).length,
            },

            {
              name: "Recognition",
              icon: Sparkles,
              count: BENEFITS.filter(
                (x) => x.category === "Recognition"
              ).length,
            },

            {
              name: "Lifestyle",
              icon: Users,
              count: BENEFITS.filter(
                (x) => x.category === "Lifestyle"
              ).length,
            },
          ].map((item) => {

            const Icon = item.icon;

            return (
              React.createElement('button', {
                type: "button",
                key: item.name,
                onClick: () => setCategory(item.name),
                className: `rounded-xl border p-3 text-left transition ${
                  category === item.name
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-100 bg-slate-50 hover:border-blue-100 hover:bg-white"
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 734}}


                , React.createElement('span', {
                  className: `grid h-8 w-8 place-items-center rounded-lg ${
                    category === item.name
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600"
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 745}}

                  , React.createElement(Icon, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 752}} )
                )

                , React.createElement('p', { className: "mt-3 text-[10px] font-extrabold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 755}}
                  , item.name
                )

                , React.createElement('p', { className: "mt-1 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 759}}
                  , item.count, " " , item.count === 1 ? "program" : "programs"
                )

              )
            );

          })

        )

      )

      /* BENEFIT RECORDS */
      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 773}}

        , React.createElement('div', { className: "border-b border-slate-100 px-5 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 775}}

          , React.createElement('div', { className: "flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 777}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 779}}

              , React.createElement('h2', { className: "text-sm font-extrabold text-slate-950"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 781}}, "Benefit records"

              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 785}}, "Search, view and download employee benefit information."

              )

            )

            , React.createElement('div', { className: "flex flex-col gap-2 sm:flex-row"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 791}}

              /* SEARCH */
              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 794}}

                , React.createElement(Search, {
                  size: 13,
                  className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 796}}
                )

                , React.createElement('input', {
                  className: "input h-9 w-full pl-8 sm:w-[230px]"    ,
                  placeholder: "Search benefits..." ,
                  value: search,
                  onChange: (e) => setSearch(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 801}}
                )

              )

              /* CATEGORY */
              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 811}}

                , React.createElement(Filter, {
                  size: 12,
                  className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 813}}
                )

                , React.createElement('select', {
                  className: "select h-9 w-full pl-8 sm:w-[180px]"    ,
                  value: category,
                  onChange: (e) => setCategory(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 818}}

                  , categories.map((item) => (
                    React.createElement('option', { key: item, __self: this, __source: {fileName: _jsxFileName, lineNumber: 824}}
                      , item
                    )
                  ))
                )

              )

            )

          )

        )

        /* TABLE */
        , React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 839}}

          , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 841}}

            , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 843}}

              , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 845}}
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 846}}, "Benefit")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 847}}, "Category")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 848}}, "Provider")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 849}}, "Eligibility")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 850}}, "Effective Date" )
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 851}}, "Status")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 852}}, "Actions")
              )

            )

            , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 857}}

              , filteredBenefits.map((benefit) => {

                const Icon = benefit.icon;

                return (
                  React.createElement('tr', { key: benefit.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 864}}

                    /* BENEFIT */
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 867}}

                      , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 869}}

                        , React.createElement('span', { className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 871}}
                          , React.createElement(Icon, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 872}} )
                        )

                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 875}}

                          , React.createElement('p', { className: "text-[11px] font-extrabold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 877}}
                            , benefit.name
                          )

                          , React.createElement('p', { className: "mt-0.5 max-w-[300px] truncate text-[9px] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 881}}
                            , benefit.description
                          )

                        )

                      )

                    )

                    /* CATEGORY */
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 892}}
                      , React.createElement('span', { className: "text-[10px] text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 893}}
                        , benefit.category
                      )
                    )

                    /* PROVIDER */
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 899}}
                      , React.createElement('span', { className: "text-[10px] text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 900}}
                        , benefit.provider
                      )
                    )

                    /* ELIGIBILITY */
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 906}}
                      , React.createElement('span', { className: "text-[10px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 907}}
                        , benefit.eligibility
                      )
                    )

                    /* DATE */
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 913}}
                      , React.createElement('span', { className: "text-[10px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 914}}
                        , benefit.effectiveDate
                      )
                    )

                    /* STATUS */
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 920}}

                      , React.createElement('span', { className: "badge success" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 922}}
                        , React.createElement(CheckCircle2, { size: 10, __self: this, __source: {fileName: _jsxFileName, lineNumber: 923}} ), "Available"

                      )

                    )

                    /* ACTIONS */
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 930}}

                      , React.createElement('div', { className: "flex gap-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 932}}

                        , React.createElement('button', {
                          type: "button",
                          className: "btn !min-h-8 !px-2.5"  ,
                          onClick: () => setSelectedBenefit(benefit), __self: this, __source: {fileName: _jsxFileName, lineNumber: 934}}

                          , React.createElement(FileText, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 939}} ), "View"

                        )

                        , React.createElement('button', {
                          type: "button",
                          className: "btn !min-h-8 !px-2.5"  ,
                          onClick: () => downloadBenefit(benefit), __self: this, __source: {fileName: _jsxFileName, lineNumber: 943}}

                          , React.createElement(ArrowDownToLine, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 948}} ), "Download"

                        )

                      )

                    )

                  )
                );

              })

            )

          )

          , !filteredBenefits.length && (

            React.createElement('div', { className: "empty-state", __self: this, __source: {fileName: _jsxFileName, lineNumber: 967}}

              , React.createElement(FileText, { className: "mx-auto mb-2 text-slate-300"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 969}} )

              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 971}}, "No benefits found"

              )

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 975}}, "Try another search or category."

              )

            )

          )

        )

      )

      /* VIEW MODAL */
      , React.createElement(BenefitViewer, {
        benefit: selectedBenefit,
        onClose: () => setSelectedBenefit(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 988}}
      )

    )
  );
}