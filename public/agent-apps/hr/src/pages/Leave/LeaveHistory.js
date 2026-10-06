const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Leave/LeaveHistory.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Search,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api.js";

export default function LeaveHistory() {
  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState("");

  const [busy, setBusy] = useState(true);

  const load = async () => {
    setBusy(true);

    try {
      const response =
        await api.get("/leave");

      setRows(
        _optionalChain([response, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(
        "Unable to load leave history:",
        error
      );

      setRows([]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredRows = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) return rows;

    return rows.filter((row) => {
      const employee =
        row.name ||
        row.employee ||
        "";

      const type =
        row.leave_type ||
        "";

      return (
        employee
          .toLowerCase()
          .includes(value) ||
        type
          .toLowerCase()
          .includes(value)
      );
    });
  }, [rows, search]);

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}

      /* =====================================================
          HEADER
      ===================================================== */

      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}, "TIME OFF"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}, "Leave History"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}, "Review previous employee leave activity and request history."


          )
        )

        , React.createElement(Link, {
          className: "btn btn-primary" ,
          to: "/leave/apply", __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
, "Apply Leave"

        )

      )

      /* =====================================================
          HISTORY CARD
      ===================================================== */

      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}

        /* SEARCH */

        , React.createElement('div', { className: "border-b border-slate-100 p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}

          , React.createElement('div', { className: "relative max-w-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}

            , React.createElement(Search, {
              size: 15,
              className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
            )

            , React.createElement('input', {
              className: "h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"             ,
              placeholder: "Search employee or leave type..."    ,
              value: search,
              onChange: (e) =>
                setSearch(e.target.value)
              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
            )

          )

        )

        /* LOADING */

        , busy ? (
          React.createElement('div', { className: "loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}, "Loading leave history…"

          )
        ) : filteredRows.length ? (

          React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}

            , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}

              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}, "Employee")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}, "Leave Type" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}, "Start Date" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}, "End Date" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}, "Reason")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}, "Status")
                )
              )

              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}

                , filteredRows.map(
                  (row, index) => {

                    const employee =
                      row.name ||
                      row.employee ||
                      "Employee";

                    return (
                      React.createElement('tr', {
                        key: 
                          row.id ||
                          index
                        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}


                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}
                          , React.createElement('b', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}
                            , employee
                          )

                          , row.employee_id && (
                            React.createElement('div', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}, "Employee #"

                              , row.employee_id
                            )
                          )
                        )

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
                          , row.leave_type ||
                            "—"
                        )

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}
                          , row.start_date ||
                            "—"
                        )

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
                          , row.end_date ||
                            "—"
                        )

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}
                          , React.createElement('span', { className: "block max-w-[250px] truncate text-xs text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}
                            , row.reason ||
                              "No reason provided"
                          )
                        )

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}
                          , React.createElement('span', {
                            className: `badge ${
                              row.status ===
                              "Approved"
                                ? "success"
                                : row.status ===
                                  "Rejected"
                                ? "danger"
                                : "warning"
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}

                            , row.status ||
                              "Pending"
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

          React.createElement('div', { className: "empty-state", __self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}

            , React.createElement(CalendarDays, {
              className: "mx-auto mb-2 text-slate-300"  ,
              size: 28, __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
            )

            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}, "No leave history"

            )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}, "Historical leave requests will appear here once records are created."


            )

          )

        )

      )

    )
  );
}