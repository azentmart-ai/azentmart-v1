import React, { useMemo, useState } from "react";

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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-start gap-3">

            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Icon size={17} />
            </span>

            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-blue-600">
                BENEFIT PROGRAM
              </span>

              <h2 className="mt-1 text-base font-extrabold text-slate-950">
                {benefit.name}
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                {benefit.description}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} />
          </button>

        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-5">

          {/* INFORMATION */}
          <div className="grid gap-3 md:grid-cols-4">

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Category
              </span>

              <p className="mt-2 text-xs font-bold text-slate-800">
                {benefit.category}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Provider
              </span>

              <p className="mt-2 text-xs font-bold text-slate-800">
                {benefit.provider}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Eligibility
              </span>

              <p className="mt-2 text-xs font-bold text-slate-800">
                {benefit.eligibility}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Effective
              </span>

              <p className="mt-2 text-xs font-bold text-slate-800">
                {benefit.effectiveDate}
              </p>
            </div>

          </div>

          {/* OVERVIEW */}
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex gap-3">

              <FileText
                size={17}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <h3 className="text-xs font-extrabold text-slate-900">
                  Benefit Overview
                </h3>

                <p className="mt-2 text-[11px] leading-5 text-slate-600">
                  {benefit.description}
                </p>

              </div>

            </div>

          </div>

          {/* DETAILS */}
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">

            <div className="border-b border-slate-100 px-5 py-4">

              <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-blue-600">
                PROGRAM DETAILS
              </span>

              <h3 className="mt-1 text-sm font-extrabold text-slate-950">
                Benefit information
              </h3>

            </div>

            <div className="divide-y divide-slate-100">

              {benefit.details.map((detail, index) => (

                <div
                  key={index}
                  className="flex gap-3 px-5 py-4"
                >

                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-[9px] font-extrabold text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-[11px] leading-5 text-slate-600">
                    {detail}
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* SUPPORT */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex gap-3">

              <LifeBuoy
                size={16}
                className="mt-0.5 text-blue-600"
              />

              <div>

                <h3 className="text-xs font-extrabold text-slate-900">
                  HR Support
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Contact People Operations for eligibility, enrollment,
                  documentation or benefit-related questions.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-5 py-4">

          <div className="hidden items-center gap-2 text-[10px] text-slate-400 sm:flex">
            <ShieldCheck size={13} />
            Maintained by People Operations
          </div>

          <div className="ml-auto flex gap-2">

            <button
              type="button"
              className="btn"
              onClick={onClose}
            >
              Close
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => downloadBenefit(benefit)}
            >
              <ArrowDownToLine size={13} />
              Download
            </button>

          </div>

        </div>

      </div>
    </div>
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
    <div className="page">

      {/* PAGE HEADER */}
      <div className="page-header">

        <div>

          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            TOTAL REWARDS
          </span>

          <h1 className="mt-1">
            Benefits
          </h1>

          <p>
            Manage employee benefits, health coverage, learning programs,
            wellness and workplace support.
          </p>

        </div>

      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}
        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Total Benefits
              </p>

              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {total}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Benefit programs
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <FileText size={15} />
            </span>

          </div>

        </div>

        {/* ACTIVE */}
        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Active
              </p>

              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {active}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Currently available
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={15} />
            </span>

          </div>

        </div>

        {/* HEALTH */}
        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Health Programs
              </p>

              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {health}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Health & wellness
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-500">
              <HeartPulse size={15} />
            </span>

          </div>

        </div>

        {/* LEARNING */}
        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Learning
              </p>

              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {learning}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Development programs
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-violet-600">
              <GraduationCap size={15} />
            </span>

          </div>

        </div>

      </div>

      {/* BENEFIT CATEGORIES */}
      <div className="card mb-4 overflow-hidden">

        <div className="border-b border-slate-100 px-5 py-4">

          <span className="text-[9px] font-extrabold tracking-[0.16em] text-blue-600">
            BENEFIT LIBRARY
          </span>

          <h2 className="mt-1 text-sm font-extrabold text-slate-950">
            Employee benefit categories
          </h2>

          <p className="mt-1 text-[10px] text-slate-400">
            Browse employee programs organized by HR service area.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4 xl:grid-cols-7">

          {[
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
              <button
                type="button"
                key={item.name}
                onClick={() => setCategory(item.name)}
                className={`rounded-xl border p-3 text-left transition ${
                  category === item.name
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-100 bg-slate-50 hover:border-blue-100 hover:bg-white"
                }`}
              >

                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg ${
                    category === item.name
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600"
                  }`}
                >
                  <Icon size={14} />
                </span>

                <p className="mt-3 text-[10px] font-extrabold text-slate-800">
                  {item.name}
                </p>

                <p className="mt-1 text-[9px] text-slate-400">
                  {item.count} {item.count === 1 ? "program" : "programs"}
                </p>

              </button>
            );

          })}

        </div>

      </div>

      {/* BENEFIT RECORDS */}
      <div className="card overflow-hidden">

        <div className="border-b border-slate-100 px-5 py-4">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <h2 className="text-sm font-extrabold text-slate-950">
                Benefit records
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                Search, view and download employee benefit information.
              </p>

            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              {/* SEARCH */}
              <div className="relative">

                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  className="input h-9 w-full pl-8 sm:w-[230px]"
                  placeholder="Search benefits..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

              {/* CATEGORY */}
              <div className="relative">

                <Filter
                  size={12}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  className="select h-9 w-full pl-8 sm:w-[180px]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item}>
                      {item}
                    </option>
                  ))}
                </select>

              </div>

            </div>

          </div>

        </div>

        {/* TABLE */}
        <div className="table-wrap">

          <table>

            <thead>

              <tr>
                <th>Benefit</th>
                <th>Category</th>
                <th>Provider</th>
                <th>Eligibility</th>
                <th>Effective Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredBenefits.map((benefit) => {

                const Icon = benefit.icon;

                return (
                  <tr key={benefit.id}>

                    {/* BENEFIT */}
                    <td>

                      <div className="flex items-center gap-3">

                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                          <Icon size={14} />
                        </span>

                        <div>

                          <p className="text-[11px] font-extrabold text-slate-800">
                            {benefit.name}
                          </p>

                          <p className="mt-0.5 max-w-[300px] truncate text-[9px] text-slate-400">
                            {benefit.description}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}
                    <td>
                      <span className="text-[10px] text-slate-600">
                        {benefit.category}
                      </span>
                    </td>

                    {/* PROVIDER */}
                    <td>
                      <span className="text-[10px] text-slate-600">
                        {benefit.provider}
                      </span>
                    </td>

                    {/* ELIGIBILITY */}
                    <td>
                      <span className="text-[10px] text-slate-500">
                        {benefit.eligibility}
                      </span>
                    </td>

                    {/* DATE */}
                    <td>
                      <span className="text-[10px] text-slate-500">
                        {benefit.effectiveDate}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>

                      <span className="badge success">
                        <CheckCircle2 size={10} />
                        Available
                      </span>

                    </td>

                    {/* ACTIONS */}
                    <td>

                      <div className="flex gap-1">

                        <button
                          type="button"
                          className="btn !min-h-8 !px-2.5"
                          onClick={() => setSelectedBenefit(benefit)}
                        >
                          <FileText size={12} />
                          View
                        </button>

                        <button
                          type="button"
                          className="btn !min-h-8 !px-2.5"
                          onClick={() => downloadBenefit(benefit)}
                        >
                          <ArrowDownToLine size={12} />
                          Download
                        </button>

                      </div>

                    </td>

                  </tr>
                );

              })}

            </tbody>

          </table>

          {!filteredBenefits.length && (

            <div className="empty-state">

              <FileText className="mx-auto mb-2 text-slate-300" />

              <strong>
                No benefits found
              </strong>

              <p>
                Try another search or category.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* VIEW MODAL */}
      <BenefitViewer
        benefit={selectedBenefit}
        onClose={() => setSelectedBenefit(null)}
      />

    </div>
  );
}