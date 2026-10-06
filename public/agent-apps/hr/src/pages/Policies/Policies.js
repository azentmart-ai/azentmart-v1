const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Policies/Policies.jsx";import React, { useMemo, useState } from "react";

import {
  ArrowDownToLine,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Filter,
  LockKeyhole,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const DEFAULT_POLICIES = [
  {
    id: "leave-attendance",
    title: "Leave and Attendance Policy",
    category: "General HR",
    owner: "People Operations",
    version: "2.0",
    effectiveDate: "01 Aug 2026",
    status: "Active",
    type: "HR Policy",
    description:
      "Guidelines for employee attendance, working hours, leave management and attendance regularization.",
    icon: CalendarDays,
    sections: [
      {
        number: "01",
        title: "Purpose",
        text: "This policy establishes the organization's standards for employee attendance, working hours, leave management and attendance regularization.",
      },
      {
        number: "02",
        title: "Working Hours",
        text: "Employees are expected to follow their assigned working schedule and remain available during scheduled working hours. Any planned changes should be discussed with the reporting manager.",
      },
      {
        number: "03",
        title: "Attendance Recording",
        points: [
          "Employees must record attendance through the approved attendance system.",
          "Employees should ensure that check-in and check-out information is accurate.",
          "Attendance corrections must be submitted through the regularization workflow.",
          "Repeated attendance discrepancies may be reviewed by People Operations.",
        ],
      },
      {
        number: "04",
        title: "Leave Management",
        points: [
          "Leave requests should be submitted through the HR system.",
          "Employees should provide sufficient notice for planned leave wherever possible.",
          "Leave approval is subject to applicable company rules and manager approval.",
          "Emergency leave should be communicated to the reporting manager as soon as reasonably possible.",
        ],
      },
      {
        number: "05",
        title: "Attendance Regularization",
        text: "If an employee has missed a check-in, check-out or recorded an incorrect attendance entry, a regularization request may be submitted. The request should include a clear reason and supporting information when required.",
      },
      {
        number: "06",
        title: "Responsibilities",
        points: [
          "Employees are responsible for maintaining accurate attendance records.",
          "Managers are responsible for reviewing team attendance and leave requests.",
          "People Operations maintains attendance and leave records.",
        ],
      },
      {
        number: "07",
        title: "Compliance",
        text: "Attendance and leave records may be reviewed as part of routine HR operations. Repeated non-compliance may be handled according to applicable company procedures.",
      },
    ],
  },

  {
    id: "information-security",
    title: "Information Security Policy",
    category: "IT & Security",
    owner: "IT & Security",
    version: "1.0",
    effectiveDate: "01 Sep 2026",
    status: "Active",
    type: "IT Policy",
    description:
      "Security expectations for company systems, devices, accounts and business information.",
    icon: LockKeyhole,
    sections: [
      {
        number: "01",
        title: "Purpose",
        text: "This policy defines the basic security practices employees must follow when using company systems, applications, devices and information.",
      },
      {
        number: "02",
        title: "Account Security",
        points: [
          "Employees must keep passwords and authentication credentials confidential.",
          "Company accounts must not be shared with other individuals.",
          "Multi-factor authentication should be enabled wherever provided.",
          "Suspicious login activity should be reported to the IT or Security team.",
        ],
      },
      {
        number: "03",
        title: "Device Security",
        points: [
          "Company-managed devices should be protected with appropriate passwords or authentication.",
          "Devices should be locked when left unattended.",
          "Unauthorized software should not be installed on company-managed devices.",
          "Lost or stolen company devices must be reported immediately.",
        ],
      },
      {
        number: "04",
        title: "Data Protection",
        points: [
          "Confidential company information must only be shared with authorized individuals.",
          "Sensitive employee information must be handled carefully.",
          "Company information should not be transferred to unauthorized personal storage.",
          "Employees should verify recipients before sending confidential information.",
        ],
      },
      {
        number: "05",
        title: "Security Incidents",
        text: "Security incidents, suspected phishing messages, unauthorized access or accidental disclosure of information should be reported to the IT or Security team as soon as possible.",
      },
      {
        number: "06",
        title: "Responsibilities",
        points: [
          "Employees must protect company accounts and devices.",
          "Managers must ensure appropriate access for team members.",
          "IT maintains security controls and system access.",
          "Security teams investigate reported security incidents.",
        ],
      },
      {
        number: "07",
        title: "Compliance",
        text: "Security requirements may be reviewed periodically. Violations may be investigated according to company security procedures and applicable internal controls.",
      },
    ],
  },

  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    category: "Workplace",
    owner: "People Operations",
    version: "1.0",
    effectiveDate: "01 Jan 2026",
    status: "Active",
    type: "HR Policy",
    description:
      "Workplace behavior, professional conduct and employee responsibility guidelines.",
    icon: Users,
    sections: [
      {
        number: "01",
        title: "Purpose",
        text: "The Code of Conduct establishes expectations for professional behavior and respectful collaboration across the organization.",
      },
      {
        number: "02",
        title: "Professional Behavior",
        points: [
          "Employees are expected to communicate respectfully with colleagues, customers and partners.",
          "Employees should maintain professional behavior during meetings and workplace interactions.",
          "Company resources should be used responsibly.",
          "Employees should avoid behavior that creates an unsafe or hostile workplace.",
        ],
      },
      {
        number: "03",
        title: "Respectful Workplace",
        points: [
          "Harassment, discrimination and bullying are not acceptable.",
          "Employees should treat colleagues fairly and respectfully.",
          "Workplace concerns should be raised through appropriate HR channels.",
        ],
      },
      {
        number: "04",
        title: "Conflict of Interest",
        text: "Employees should disclose situations where personal interests could interfere with their professional responsibilities or business decisions.",
      },
      {
        number: "05",
        title: "Confidentiality",
        text: "Employees must protect confidential business, customer and employee information obtained through their work.",
      },
      {
        number: "06",
        title: "Reporting Concerns",
        text: "Employees may report workplace concerns to their reporting manager, People Operations or another approved internal channel.",
      },
    ],
  },

  {
    id: "remote-work",
    title: "Remote Work Policy",
    category: "Workplace",
    owner: "People Operations",
    version: "1.1",
    effectiveDate: "15 Jul 2026",
    status: "Active",
    type: "HR Policy",
    description:
      "Guidelines for remote, hybrid and flexible working arrangements.",
    icon: Users,
    sections: [
      {
        number: "01",
        title: "Purpose",
        text: "This policy provides a framework for employees working remotely or under approved hybrid arrangements.",
      },
      {
        number: "02",
        title: "Eligibility",
        text: "Remote or hybrid work arrangements are subject to role requirements, business needs and applicable manager approval.",
      },
      {
        number: "03",
        title: "Availability",
        points: [
          "Employees must remain available during agreed working hours.",
          "Employees should attend required meetings and collaboration sessions.",
          "Changes to working availability should be communicated to the manager.",
        ],
      },
      {
        number: "04",
        title: "Work Environment",
        text: "Employees are expected to maintain a suitable and secure work environment that supports productivity and protects company information.",
      },
      {
        number: "05",
        title: "Attendance",
        text: "Remote employees remain responsible for maintaining accurate attendance records according to the organization's attendance process.",
      },
    ],
  },

  {
    id: "employee-data-privacy",
    title: "Employee Data Privacy Policy",
    category: "Compliance",
    owner: "People Operations",
    version: "1.0",
    effectiveDate: "01 Jun 2026",
    status: "Active",
    type: "Compliance Policy",
    description:
      "Guidelines for collection, access, storage and handling of employee information.",
    icon: ShieldCheck,
    sections: [
      {
        number: "01",
        title: "Purpose",
        text: "This policy defines how employee information is handled within the People Operations environment.",
      },
      {
        number: "02",
        title: "Employee Information",
        points: [
          "Employee information should only be collected for legitimate business and HR purposes.",
          "Personal information must be accessed only by authorized personnel.",
          "Employee records should be maintained accurately.",
        ],
      },
      {
        number: "03",
        title: "Access Control",
        text: "Access to employee information should be based on job responsibilities and organizational requirements. Access permissions may be reviewed periodically.",
      },
      {
        number: "04",
        title: "Document Security",
        points: [
          "Employee documents should be stored in approved systems.",
          "Sensitive documents should not be shared through unauthorized channels.",
          "Access to confidential records should be restricted to authorized users.",
        ],
      },
      {
        number: "05",
        title: "Data Retention",
        text: "Employee records should be retained according to applicable organizational retention requirements and business processes.",
      },
    ],
  },

  {
    id: "employee-benefits",
    title: "Employee Benefits Policy",
    category: "Benefits",
    owner: "People Operations",
    version: "1.0",
    effectiveDate: "01 Apr 2026",
    status: "Active",
    type: "HR Policy",
    description:
      "Overview of employee benefits, eligibility and HR benefits administration.",
    icon: CheckCircle2,
    sections: [
      {
        number: "01",
        title: "Purpose",
        text: "This policy provides a general framework for administering employee benefits and related HR programs.",
      },
      {
        number: "02",
        title: "Eligibility",
        text: "Benefit eligibility may depend on employment status, role, tenure and applicable company benefit rules.",
      },
      {
        number: "03",
        title: "Benefits Administration",
        points: [
          "People Operations maintains employee benefit records.",
          "Employees should keep relevant personal information up to date.",
          "Changes to benefit selections should be submitted through the approved HR process.",
        ],
      },
      {
        number: "04",
        title: "Employee Responsibilities",
        text: "Employees are responsible for reviewing benefit information and providing accurate information required for benefits administration.",
      },
    ],
  },

  {
    id: "performance-management",
    title: "Performance Management Policy",
    category: "Performance",
    owner: "People Operations",
    version: "1.0",
    effectiveDate: "01 Jul 2026",
    status: "Active",
    type: "HR Policy",
    description:
      "Framework for employee goals, reviews, feedback and performance development.",
    icon: CheckCircle2,
    sections: [
      {
        number: "01",
        title: "Purpose",
        text: "The performance management process supports clear expectations, regular feedback and employee development.",
      },
      {
        number: "02",
        title: "Goal Setting",
        points: [
          "Employees and managers should establish clear role-related goals.",
          "Goals should be reviewed periodically.",
          "Changes in business priorities may require goals to be updated.",
        ],
      },
      {
        number: "03",
        title: "Performance Reviews",
        text: "Performance reviews may include goal progress, responsibilities, achievements, development areas and manager feedback.",
      },
      {
        number: "04",
        title: "Development",
        text: "Employees may work with managers and People Operations to identify learning, training and development opportunities.",
      },
    ],
  },

  {
    id: "acceptable-use",
    title: "IT Acceptable Use Policy",
    category: "IT & Security",
    owner: "IT & Security",
    version: "1.0",
    effectiveDate: "01 Sep 2026",
    status: "Active",
    type: "IT Policy",
    description:
      "Rules for responsible use of company computers, networks, applications and digital resources.",
    icon: LockKeyhole,
    sections: [
      {
        number: "01",
        title: "Purpose",
        text: "This policy defines acceptable use of company technology resources and helps protect organizational systems and information.",
      },
      {
        number: "02",
        title: "Company Systems",
        points: [
          "Company systems should primarily be used for authorized business activities.",
          "Employees must follow applicable security controls.",
          "Employees should not attempt to bypass security restrictions.",
        ],
      },
      {
        number: "03",
        title: "Software",
        points: [
          "Unauthorized software should not be installed on company-managed devices.",
          "Software should be obtained from approved sources.",
          "Employees should report suspicious applications or software behavior.",
        ],
      },
      {
        number: "04",
        title: "Internet and Email",
        text: "Company internet and email resources should be used responsibly. Employees should remain alert to phishing, malicious links and suspicious attachments.",
      },
      {
        number: "05",
        title: "Security Compliance",
        text: "Employees are expected to follow IT security instructions and cooperate with security investigations when required.",
      },
    ],
  },
];

function PolicyModal({ policy, onClose, onDownload }) {
  if (!policy) return null;

  const Icon = policy.icon || FileText;

  return (
    React.createElement('div', {
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"        ,
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 441}}

      , React.createElement('div', { className: "flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 449}}
        /* Modal Header */
        , React.createElement('div', { className: "flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-5"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}
          , React.createElement('div', { className: "flex items-start gap-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}
            , React.createElement('div', { className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 453}}
              , React.createElement(Icon, { size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 454}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 457}}
              , React.createElement('div', { className: "mb-1 flex flex-wrap items-center gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}
                , React.createElement('span', { className: "text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 459}}
                  , policy.type
                )

                , React.createElement('span', { className: "rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 463}}
                  , policy.status
                )
              )

              , React.createElement('h2', { className: "text-lg font-extrabold tracking-tight text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 468}}
                , policy.title
              )

              , React.createElement('p', { className: "mt-1 max-w-2xl text-xs leading-5 text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}
                , policy.description
              )
            )
          )

          , React.createElement('button', {
            type: "button",
            onClick: onClose,
            className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 478}}

            , React.createElement(X, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 483}} )
          )
        )

        /* Modal Body */
        , React.createElement('div', { className: "min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-5 py-5 sm:px-7"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 488}}
          /* Metadata */
          , React.createElement('div', { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}
            , React.createElement('div', { className: "rounded-xl border border-slate-200 bg-white p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 491}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 492}}, "Category"

              )
              , React.createElement('p', { className: "mt-2 text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 495}}
                , policy.category
              )
            )

            , React.createElement('div', { className: "rounded-xl border border-slate-200 bg-white p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 501}}, "Policy Owner"

              )
              , React.createElement('p', { className: "mt-2 text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 504}}
                , policy.owner
              )
            )

            , React.createElement('div', { className: "rounded-xl border border-slate-200 bg-white p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 509}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 510}}, "Version"

              )
              , React.createElement('p', { className: "mt-2 text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 513}}, "v"
                , policy.version
              )
            )

            , React.createElement('div', { className: "rounded-xl border border-slate-200 bg-white p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 518}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 519}}, "Effective Date"

              )
              , React.createElement('p', { className: "mt-2 text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 522}}
                , policy.effectiveDate
              )
            )
          )

          /* Overview */
          , React.createElement('section', { className: "mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 529}}
            , React.createElement('div', { className: "flex gap-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 530}}
              , React.createElement('div', { className: "mt-0.5 text-blue-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}
                , React.createElement(BookOpen, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 532}} )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 535}}
                , React.createElement('h3', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 536}}, "Policy Overview"

                )

                , React.createElement('p', { className: "mt-2 text-xs leading-6 text-slate-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 540}}
                  , policy.description
                )
              )
            )
          )

          /* Policy Content */
          , React.createElement('div', { className: "mt-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 548}}
            , React.createElement('div', { className: "mb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 549}}
              , React.createElement('p', { className: "text-[9px] font-extrabold uppercase tracking-[0.18em] text-blue-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 550}}, "Policy Document"

              )

              , React.createElement('h3', { className: "mt-1 text-sm font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 554}}
                , policy.title
              )
            )

            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 559}}
              , policy.sections.map((section) => (
                React.createElement('section', {
                  key: `${policy.id}-${section.number}`,
                  className: "rounded-xl border border-slate-200 bg-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 561}}

                  , React.createElement('div', { className: "flex items-center gap-3 border-b border-slate-100 px-5 py-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 565}}
                    , React.createElement('span', { className: "grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-[9px] font-extrabold text-slate-500"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 566}}
                      , section.number
                    )

                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 570}}
                      , React.createElement('h4', { className: "text-xs font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 571}}
                        , section.title
                      )

                      , React.createElement('p', { className: "mt-0.5 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 575}}, "Policy requirements and guidelines"

                      )
                    )
                  )

                  , React.createElement('div', { className: "px-5 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 581}}
                    , section.text && (
                      React.createElement('p', { className: "text-xs leading-6 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 583}}
                        , section.text
                      )
                    )

                    , section.points && (
                      React.createElement('div', { className: "grid gap-2 sm:grid-cols-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 589}}
                        , section.points.map((point, index) => (
                          React.createElement('div', {
                            key: index,
                            className: "flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 591}}

                            , React.createElement(CheckCircle2, {
                              size: 14,
                              className: "mt-0.5 shrink-0 text-emerald-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 595}}
                            )

                            , React.createElement('span', { className: "text-[11px] leading-5 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 600}}
                              , point
                            )
                          )
                        ))
                      )
                    )
                  )
                )
              ))
            )
          )

          /* Document Control */
          , React.createElement('section', { className: "mt-4 rounded-xl border border-slate-200 bg-white p-5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}}
            , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 615}}, "Document Control"

            )

            , React.createElement('div', { className: "mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-slate-500"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 619}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 620}}, "Owner:"
                , " "
                , React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}
                  , policy.owner
                )
              )

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 627}}, "Version:"
                , " "
                , React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}, "v"
                  , policy.version
                )
              )

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 634}}, "Status:"
                , " "
                , React.createElement('strong', { className: "text-emerald-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 636}}
                  , policy.status
                )
              )

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 641}}, "Effective:"
                , " "
                , React.createElement('strong', { className: "text-slate-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}}
                  , policy.effectiveDate
                )
              )
            )
          )
        )

        /* Modal Footer - ONLY ONE DOWNLOAD BUTTON */
        , React.createElement('div', { className: "flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 652}}
          , React.createElement('div', { className: "hidden items-center gap-2 text-[10px] text-slate-400 sm:flex"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}
            , React.createElement(ShieldCheck, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 654}} ), "Maintained by People Operations"

          )

          , React.createElement('div', { className: "ml-auto flex gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 658}}
            , React.createElement('button', {
              type: "button",
              className: "btn",
              onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 659}}
, "Close"

            )

            , React.createElement('button', {
              type: "button",
              className: "btn btn-primary" ,
              onClick: () => onDownload(policy), __self: this, __source: {fileName: _jsxFileName, lineNumber: 667}}

              , React.createElement(ArrowDownToLine, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 672}} ), "Download"

            )
          )
        )
      )
    )
  );
}

export default function Policies() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const categories = useMemo(() => {
    return [
      "All categories",
      ...Array.from(
        new Set(DEFAULT_POLICIES.map((policy) => policy.category))
      ),
    ];
  }, []);

  const filteredPolicies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return DEFAULT_POLICIES.filter((policy) => {
      const matchesSearch =
        !query ||
        policy.title.toLowerCase().includes(query) ||
        policy.category.toLowerCase().includes(query) ||
        policy.owner.toLowerCase().includes(query) ||
        policy.description.toLowerCase().includes(query);

      const matchesCategory =
        category === "All categories" || policy.category === category;

      const matchesStatus =
        status === "All statuses" || policy.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const downloadPolicy = (policy) => {
    const lines = [];

    lines.push("AZENTMART PEOPLE OPERATIONS");
    lines.push("========================================");
    lines.push("");
    lines.push(policy.title.toUpperCase());
    lines.push("----------------------------------------");
    lines.push(`Category: ${policy.category}`);
    lines.push(`Policy Owner: ${policy.owner}`);
    lines.push(`Version: ${policy.version}`);
    lines.push(`Effective Date: ${policy.effectiveDate}`);
    lines.push(`Status: ${policy.status}`);
    lines.push("");

    lines.push("POLICY OVERVIEW");
    lines.push("----------------------------------------");
    lines.push(policy.description);
    lines.push("");

    policy.sections.forEach((section) => {
      lines.push(`${section.number}. ${section.title.toUpperCase()}`);
      lines.push("");

      if (section.text) {
        lines.push(section.text);
        lines.push("");
      }

      if (section.points) {
        section.points.forEach((point, index) => {
          lines.push(`${index + 1}. ${point}`);
        });

        lines.push("");
      }
    });

    lines.push("DOCUMENT CONTROL");
    lines.push("----------------------------------------");
    lines.push(`Owner: ${policy.owner}`);
    lines.push(`Version: ${policy.version}`);
    lines.push(`Status: ${policy.status}`);
    lines.push(`Effective Date: ${policy.effectiveDate}`);
    lines.push("");
    lines.push("Maintained by People Operations.");
    lines.push("Generated from AzentMart HR People Operations.");

    const content = lines.join("\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${policy.title
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()}.txt`;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.URL.revokeObjectURL(url);
  };

  const totalPolicies = DEFAULT_POLICIES.length;
  const activePolicies = DEFAULT_POLICIES.filter(
    (policy) => policy.status === "Active"
  ).length;
  const hrPolicies = DEFAULT_POLICIES.filter(
    (policy) =>
      policy.category === "General HR" ||
      policy.category === "Workplace" ||
      policy.category === "Benefits" ||
      policy.category === "Performance"
  ).length;
  const itPolicies = DEFAULT_POLICIES.filter(
    (policy) =>
      policy.category === "IT & Security" ||
      policy.category === "Compliance"
  ).length;

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 806}}
      /* Header */
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 808}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 809}}
          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 810}}, "HR GOVERNANCE"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 814}}, "Policy Management"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 818}}, "Manage company policies, workplace guidelines, IT standards and employee compliance documentation."


          )
        )
      )

      /* Summary Cards */
      , React.createElement('div', { className: "mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 826}}
        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 827}}
          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 828}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 829}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 830}}, "Total Policies"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 834}}
                , totalPolicies
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 838}}, "Policy records"

              )
            )

            , React.createElement('div', { className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 843}}
              , React.createElement(BookOpen, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 844}} )
            )
          )
        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 849}}
          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 850}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 851}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 852}}, "Active"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 856}}
                , activePolicies
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 860}}, "Currently active"

              )
            )

            , React.createElement('div', { className: "grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 865}}
              , React.createElement(CheckCircle2, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 866}} )
            )
          )
        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 871}}
          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 872}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 873}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 874}}, "HR Policies"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 878}}
                , hrPolicies
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 882}}, "People operations"

              )
            )

            , React.createElement('div', { className: "grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 887}}
              , React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 888}} )
            )
          )
        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 893}}
          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 894}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 895}}
              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 896}}, "IT & Compliance"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 900}}
                , itPolicies
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 904}}, "Security and compliance"

              )
            )

            , React.createElement('div', { className: "grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 909}}
              , React.createElement(ShieldCheck, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 910}} )
            )
          )
        )
      )

      /* Policy Records */
      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 917}}
        /* Section Header */
        , React.createElement('div', { className: "border-b border-slate-100 px-5 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 919}}
          , React.createElement('div', { className: "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 920}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 921}}
              , React.createElement('p', { className: "text-[9px] font-extrabold uppercase tracking-[0.16em] text-blue-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 922}}, "POLICY LIBRARY"

              )

              , React.createElement('h2', { className: "mt-1 text-sm font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 926}}, "Policy records"

              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 930}}, "Search, filter, view and download company policies."

              )
            )

            /* Filters */
            , React.createElement('div', { className: "flex flex-col gap-2 sm:flex-row"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 936}}
              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 937}}
                , React.createElement(Search, {
                  size: 14,
                  className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 938}}
                )

                , React.createElement('input', {
                  className: "input h-10 w-full pl-9 sm:w-[240px]"    ,
                  placeholder: "Search policies..." ,
                  value: search,
                  onChange: (event) => setSearch(event.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 943}}
                )
              )

              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 951}}
                , React.createElement(Filter, {
                  size: 13,
                  className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 952}}
                )

                , React.createElement('select', {
                  className: "select h-10 w-full pl-8 sm:w-[170px]"    ,
                  value: category,
                  onChange: (event) => setCategory(event.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 957}}

                  , categories.map((item) => (
                    React.createElement('option', { key: item, __self: this, __source: {fileName: _jsxFileName, lineNumber: 963}}, item)
                  ))
                )
              )

              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 968}}
                , React.createElement('select', {
                  className: "select h-10 w-full sm:w-[145px]"   ,
                  value: status,
                  onChange: (event) => setStatus(event.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 969}}

                  , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 974}}, "All statuses" )
                  , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 975}}, "Active")
                  , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 976}}, "Inactive")
                )
              )
            )
          )
        )

        /* Table */
        , React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 984}}
          , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 985}}
            , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 986}}
              , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 987}}
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 988}}, "Policy")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 989}}, "Category")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 990}}, "Owner")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 991}}, "Version")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 992}}, "Effective Date" )
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 993}}, "Status")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 994}}, "Actions")
              )
            )

            , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 998}}
              , filteredPolicies.map((policy) => {
                const Icon = policy.icon || FileText;

                return (
                  React.createElement('tr', { key: policy.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1003}}
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1004}}
                      , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1005}}
                        , React.createElement('span', { className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1006}}
                          , React.createElement(Icon, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1007}} )
                        )

                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1010}}
                          , React.createElement('p', { className: "text-xs font-extrabold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1011}}
                            , policy.title
                          )

                          , React.createElement('p', { className: "mt-0.5 max-w-[360px] truncate text-[10px] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1015}}
                            , policy.description
                          )
                        )
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1022}}
                      , React.createElement('span', { className: "text-[11px] font-medium text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1023}}
                        , policy.category
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1028}}
                      , React.createElement('span', { className: "text-[11px] text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1029}}
                        , policy.owner
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1034}}
                      , React.createElement('span', { className: "badge", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1035}}, "v"
                        , policy.version
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1040}}
                      , React.createElement('div', { className: "flex items-center gap-1.5 text-[10px] text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1041}}
                        , React.createElement(CalendarDays, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1042}} )
                        , policy.effectiveDate
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1047}}
                      , React.createElement('span', { className: "badge success" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1048}}
                        , React.createElement(CheckCircle2, { size: 11, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1049}} )
                        , policy.status
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1054}}
                      , React.createElement('div', { className: "flex gap-1.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1055}}
                        , React.createElement('button', {
                          type: "button",
                          className: "btn !min-h-8 !px-3"  ,
                          onClick: () => setSelectedPolicy(policy), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1056}}

                          , React.createElement(BookOpen, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1061}} ), "View"

                        )

                        , React.createElement('button', {
                          type: "button",
                          className: "btn btn-primary !min-h-8 !px-3"   ,
                          onClick: () => downloadPolicy(policy), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1065}}

                          , React.createElement(ArrowDownToLine, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1070}} ), "Download"

                        )
                      )
                    )
                  )
                );
              })
            )
          )

          , !filteredPolicies.length && (
            React.createElement('div', { className: "empty-state", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1082}}
              , React.createElement(Search, { className: "mx-auto mb-2 text-slate-300"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1083}} )

              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1085}}, "No policies found"  )

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1087}}, "Try changing your search or policy filters."

              )
            )
          )
        )
      )

      /* Bottom Information Cards */
      , React.createElement('div', { className: "mt-4 grid gap-3 md:grid-cols-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1096}}
        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1097}}
          , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1098}}
            , React.createElement('div', { className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1099}}
              , React.createElement(FileText, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1100}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1103}}
              , React.createElement('p', { className: "text-xs font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1104}}, "Policy library"

              )

              , React.createElement('p', { className: "mt-1 text-[10px] leading-5 text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1108}}, "Centralized HR and IT policy documentation is available for employees and administrators."


              )
            )
          )
        )

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1116}}
          , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1117}}
            , React.createElement('div', { className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1118}}
              , React.createElement(ShieldCheck, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1119}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1122}}
              , React.createElement('p', { className: "text-xs font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1123}}, "Governance"

              )

              , React.createElement('p', { className: "mt-1 text-[10px] leading-5 text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1127}}, "Policy ownership, version information and effective dates are maintained for reference."


              )
            )
          )
        )

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1135}}
          , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1136}}
            , React.createElement('div', { className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1137}}
              , React.createElement(Clock3, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1138}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1141}}
              , React.createElement('p', { className: "text-xs font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1142}}, "Policy updates"

              )

              , React.createElement('p', { className: "mt-1 text-[10px] leading-5 text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1146}}, "Employees should refer to the latest active version when reviewing company guidelines."


              )
            )
          )
        )
      )

      /* Policy View Modal */
      , React.createElement(PolicyModal, {
        policy: selectedPolicy,
        onClose: () => setSelectedPolicy(null),
        onDownload: downloadPolicy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1156}}
      )
    )
  );
}