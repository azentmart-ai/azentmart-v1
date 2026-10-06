const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Documents/DocumentCategory.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DEFAULT_DOCUMENTS } from "./Documents.js";

const categoryDescriptions = {
  "Employee Records": "Employee personal, contact and emergency information.",
  "Identity & Compliance": "Identity verification and compliance records.",
  Employment: "Offer letters, employment agreements and role documentation.",
  "Payroll & Finance": "Salary, bank, tax and payroll-related records.",
  Benefits: "Benefits enrollment, insurance and dependent information.",
  "Leave & Attendance": "Leave, attendance and regularization records.",
  Performance: "Performance reviews, goals and manager feedback.",
  "Training & Development": "Training, orientation and development records.",
  Policies: "Company policies, conduct and information security documents.",
  Recruitment: "Candidate and interview-related recruitment documents.",
  "Company Documents": "Company-wide HR guides and organizational documents.",
  Certificates: "Education, experience and professional certificates.",
  Other: "Other employee, IT and exit-related HR documents.",
};

function CategoryIcon({ category }) {
  if (category === "Policies" || category === "Identity & Compliance") {
    return React.createElement(ShieldCheck, { size: 22, __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}} );
  }
  if (category === "Employee Records") return React.createElement(Users, { size: 22, __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}} );
  if (category === "Certificates" || category === "Training & Development") {
    return React.createElement(FileCheck2, { size: 22, __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}} );
  }
  if (category === "Leave & Attendance") return React.createElement(CalendarDays, { size: 22, __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}} );
  return React.createElement(FileText, { size: 22, __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}} );
}

export default function DocumentCategory() {
  const { category: encodedCategory } = useParams();
  const navigate = useNavigate();
  const category = decodeURIComponent(encodedCategory || "");

  const [search, setSearch] = useState("");

  const documents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return DEFAULT_DOCUMENTS.filter((document) => {
      const matchesCategory = document.category === category;
      const matchesSearch =
        !query ||
        _optionalChain([document, 'access', _ => _.title, 'optionalAccess', _2 => _2.toLowerCase, 'call', _3 => _3(), 'access', _4 => _4.includes, 'call', _5 => _5(query)]) ||
        _optionalChain([document, 'access', _6 => _6.employee, 'optionalAccess', _7 => _7.toLowerCase, 'call', _8 => _8(), 'access', _9 => _9.includes, 'call', _10 => _10(query)]) ||
        _optionalChain([document, 'access', _11 => _11.description, 'optionalAccess', _12 => _12.toLowerCase, 'call', _13 => _13(), 'access', _14 => _14.includes, 'call', _15 => _15(query)]);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const exists = Boolean(categoryDescriptions[category]);

  if (!exists) {
    return (
      React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}
        , React.createElement('button', { className: "btn", onClick: () => navigate("/documents"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
          , React.createElement(ArrowLeft, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}} ), "Documents"

        )

        , React.createElement('div', { className: "card mt-4 p-8 text-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
          , React.createElement(FileText, { className: "mx-auto mb-3 text-slate-300"  , size: 38, __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}} )
          , React.createElement('h2', { className: "text-lg font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}, "Category not found"  )
          , React.createElement('p', { className: "mt-2 text-sm text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}, "The requested document category does not exist."

          )
        )
      )
    );
  }

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
          , React.createElement('button', {
            type: "button",
            className: "mb-3 flex items-center gap-2 text-[11px] font-bold text-blue-600 hover:text-blue-700"       ,
            onClick: () => navigate("/documents"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}

            , React.createElement(ArrowLeft, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}} ), "Back to document library"

          )

          , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
            , React.createElement('span', { className: "grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
              , React.createElement(CategoryIcon, { category: category, __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
              , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, "DOCUMENT CATEGORY"

              )

              , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}, category)

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, categoryDescriptions[category])
            )
          )
        )
      )

      , React.createElement('div', { className: "mb-5 grid grid-cols-1 gap-4 md:grid-cols-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}
          , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "TOTAL DOCUMENTS"

          )
          , React.createElement('p', { className: "mt-2 text-2xl font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}, documents.length)
          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}, "Available in this category"

          )
        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
          , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}, "AVAILABLE"

          )
          , React.createElement('p', { className: "mt-2 text-2xl font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}
            , documents.filter((x) => x.status === "Available").length
          )
          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, "Reference documents" )
        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}
          , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "VERIFIED / ACTIVE"

          )
          , React.createElement('p', { className: "mt-2 text-2xl font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
            , 
              documents.filter(
                (x) =>
                  x.status === "Verified" ||
                  x.status === "Active" ||
                  x.status === "Completed",
              ).length
            
          )
          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}, "Completed or verified records"

          )
        )
      )

      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}
        , React.createElement('div', { className: "flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}
            , React.createElement('h2', { className: "text-[14px] font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}, category, " documents" )
            , React.createElement('p', { className: "mt-1 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}, "Select a document to view its details."

            )
          )

          , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}
            , React.createElement(Search, {
              size: 14,
              className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
            )
            , React.createElement('input', {
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: `Search ${category.toLowerCase()}...`,
              className: "h-9 w-[240px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[10px] outline-none focus:border-blue-500"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
            )
          )
        )

        , documents.length ? (
          React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}
            , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}, "DOCUMENT")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}, "EMPLOYEE")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}, "STATUS")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}, "EXPIRY")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}, "ACTION")
                )
              )

              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
                , documents.map((document) => (
                  React.createElement('tr', { key: document.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}
                      , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}
                        , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 201}}
                          , React.createElement(FileText, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}} )
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
                          , React.createElement('p', { className: "text-[11px] font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
                            , document.title
                          )
                          , React.createElement('p', { className: "max-w-[520px] text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}
                            , document.description
                          )
                        )
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
                      , React.createElement('span', { className: "text-[10px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
                        , document.employee || "Company"
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
                      , React.createElement('span', { className: "badge success" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}
                        , React.createElement(CheckCircle2, { size: 10, className: "mr-1 inline" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}} )
                        , document.status
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
                      , React.createElement('span', { className: "text-[10px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}
                        , document.expiry_date || "—"
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}
                      , React.createElement(Link, {
                        to: `/documents/default/${document.id}`,
                        state: { document },
                        className: "btn !min-h-8 !px-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}

                        , React.createElement(Eye, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}} ), "View"

                      )
                    )
                  )
                ))
              )
            )
          )
        ) : (
          React.createElement('div', { className: "empty-state", __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
            , React.createElement(FileText, { className: "mx-auto mb-2 text-slate-300"  , size: 30, __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}} )
            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}, "No documents found"  )
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}, "Try a different search."   )
          )
        )
      )
    )
  );
}
