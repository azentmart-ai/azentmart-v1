const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Support/Tickets.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Ticket as TicketIcon,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api.js";

export default function Tickets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");

  const load = async () => {
    setLoading(true);

    try {
      const response = await api.get("/support");

      setItems(
        _optionalChain([response, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) ||
          response.data ||
          []
      );
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {

      const matchesSearch =
        !query ||
        String(item.id || "")
          .toLowerCase()
          .includes(query) ||
        String(item.subject || "")
          .toLowerCase()
          .includes(query) ||
        String(item.category || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "All statuses" ||
        item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  const getStatusClass = (value) => {

    if (
      value === "Resolved" ||
      value === "Closed"
    ) {
      return "badge success";
    }

    if (value === "Pending") {
      return "badge warning";
    }

    if (value === "Rejected") {
      return "badge danger";
    }

    return "badge";
  };

  const total = items.length;

  const open = items.filter(
    (item) =>
      !["Resolved", "Closed"].includes(
        item.status
      )
  ).length;

  const resolved = items.filter(
    (item) =>
      item.status === "Resolved" ||
      item.status === "Closed"
  ).length;

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}

      /* HEADER */

      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}

          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}, "HR SERVICE DESK"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "Support Tickets"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}, "View and track employee HR support requests."

          )

        )

        , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}

          , React.createElement('button', {
            type: "button",
            className: "btn",
            onClick: load, __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}

            , React.createElement(RefreshCw, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}} ), "Refresh"

          )

          , React.createElement(Link, {
            className: "btn btn-primary" ,
            to: "/support/tickets/new", __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}

            , React.createElement(Plus, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}} ), "New ticket"

          )

        )

      )

      /* SUMMARY */

      , React.createElement('div', { className: "mb-4 grid gap-3 md:grid-cols-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}, "Total Tickets"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
                , total
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}, "All HR requests"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}
              , React.createElement(TicketIcon, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}} )
            )

          )

        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}, "Open"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
                , open
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}, "Requests requiring attention"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}
              , React.createElement(Clock3, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}} )
            )

          )

        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}, "Resolved"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}
                , resolved
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}, "Completed requests"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}
              , React.createElement(CheckCircle2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}} )
            )

          )

        )

      )

      /* RECORDS */

      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}

        , React.createElement('div', { className: "border-b border-slate-100 px-5 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}

          , React.createElement('div', { className: "flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}

              , React.createElement('h2', { className: "text-sm font-extrabold text-slate-950"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}, "Ticket records"

              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}, "Search and review HR service desk requests."

              )

            )

            , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}

              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}

                , React.createElement(Search, {
                  size: 13,
                  className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}
                )

                , React.createElement('input', {
                  className: "input h-9 w-[220px] pl-8"   ,
                  placeholder: "Search tickets..." ,
                  value: search,
                  onChange: (event) =>
                    setSearch(event.target.value)
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}
                )

              )

              , React.createElement('select', {
                className: "select h-9 w-[145px]"  ,
                value: status,
                onChange: (event) =>
                  setStatus(event.target.value)
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}

                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}, "All statuses" )
                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}, "Open")
                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}, "Pending")
                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}, "Resolved")
                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}, "Closed")
              )

            )

          )

        )

        , loading ? (

          React.createElement('div', { className: "loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}, "Loading support tickets..."

          )

        ) : (

          React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}

            , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}

              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}

                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 318}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}, "Ticket")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}, "Subject")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}, "Category")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}, "Status")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}, "Created")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 324}}, "Action")
                )

              )

              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}

                , filteredItems.map((item) => (

                  React.createElement('tr', { key: item.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 335}}

                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}

                        , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
                          , React.createElement(TicketIcon, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}} )
                        )

                        , React.createElement('span', { className: "text-[10px] font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}, "#"
                          , item.id
                        )

                      )

                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}

                        , React.createElement('p', { className: "text-[11px] font-extrabold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}
                          , item.subject ||
                            "Untitled request"
                        )

                        , item.description && (
                          React.createElement('p', { className: "mt-0.5 max-w-[320px] truncate text-[9px] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}
                            , item.description
                          )
                        )

                      )

                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}
                      , React.createElement('span', { className: "text-[10px] text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 371}}
                        , item.category ||
                          "General HR"
                      )
                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}

                      , React.createElement('span', {
                        className: getStatusClass(
                          item.status
                        ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}

                        , item.status || "Open"
                      )

                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}

                      , React.createElement('span', { className: "text-[10px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}
                        , item.created_at
                          ? String(
                              item.created_at
                            ).slice(0, 10)
                          : "—"
                      )

                    )

                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 401}}

                      , React.createElement('button', {
                        type: "button",
                        className: "btn !min-h-8 !px-2.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}

                        , React.createElement(Eye, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}} ), "View"

                      )

                    )

                  )

                ))

              )

            )

            , !filteredItems.length && (

              React.createElement('div', { className: "empty-state py-14" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}

                , React.createElement(TicketIcon, { className: "mx-auto mb-3 text-slate-300"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}} )

                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 427}}, "No support tickets found"

                )

                , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 431}}, "Create a new HR request to get started."

                )

                , React.createElement(Link, {
                  to: "/support/tickets/new",
                  className: "btn btn-primary mt-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}

                  , React.createElement(Plus, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}} ), "New ticket"

                )

              )

            )

          )

        )

      )

    )
  );
}