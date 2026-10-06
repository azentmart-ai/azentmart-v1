const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Leave/Leave.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowDownToLine,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Download,
  FileClock,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api.js";

export default function Leave() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);

  const [status, setStatus] = useState("");

  const [search, setSearch] = useState("");

  const [date, setDate] = useState("");

  const [busy, setBusy] = useState(true);

  const [actionId, setActionId] = useState(null);


  /* =========================================================
     LOAD LEAVE
  ========================================================= */

  const load = async () => {
    setBusy(true);

    try {
      const response = await api.get("/leave", {
        params: {
          status: status || undefined,
        },
      });

      setRows(
        _optionalChain([response, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(
        "Unable to load leave requests:",
        error
      );

      setRows([]);
    } finally {
      setBusy(false);
    }
  };


  useEffect(() => {
    load();
  }, [status]);


  /* =========================================================
     FILTER DATA
  ========================================================= */

  const filteredRows = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return rows.filter((row) => {
      const employee =
        row.name ||
        row.employee ||
        "";

      const leaveType =
        row.leave_type ||
        "";

      const reason =
        row.reason ||
        "";

      const matchesSearch =
        !searchValue ||
        employee
          .toLowerCase()
          .includes(searchValue) ||
        leaveType
          .toLowerCase()
          .includes(searchValue) ||
        reason
          .toLowerCase()
          .includes(searchValue);

      const matchesDate =
        !date ||
        row.start_date === date ||
        row.end_date === date;

      return (
        matchesSearch &&
        matchesDate
      );
    });
  }, [rows, search, date]);


  /* =========================================================
     STATISTICS
  ========================================================= */

  const stats = useMemo(() => {
    const total = rows.length;

    const pending = rows.filter(
      (row) =>
        row.status === "Pending"
    ).length;

    const approved = rows.filter(
      (row) =>
        row.status === "Approved"
    ).length;

    const rejected = rows.filter(
      (row) =>
        row.status === "Rejected"
    ).length;

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }, [rows]);


  /* =========================================================
     ACTION
  ========================================================= */

  const updateStatus = async (
    id,
    nextStatus
  ) => {
    setActionId(id);

    try {
      await api.patch(
        `/leave/${id}`,
        {
          status: nextStatus,
        }
      );

      await load();
    } catch (error) {
      console.error(
        "Unable to update leave request:",
        error
      );
    } finally {
      setActionId(null);
    }
  };


  /* =========================================================
     CSV EXPORT
  ========================================================= */

  const exportReport = () => {
    if (!filteredRows.length) {
      return;
    }

    const headers = [
      "Employee",
      "Leave Type",
      "Start Date",
      "End Date",
      "Reason",
      "Status",
    ];

    const data = filteredRows.map(
      (row) => [
        row.name ||
          row.employee ||
          "",
        row.leave_type || "",
        row.start_date || "",
        row.end_date || "",
        row.reason || "",
        row.status || "",
      ]
    );

    const csv = [
      headers,
      ...data,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "leave-report.csv";

    link.click();

    URL.revokeObjectURL(url);
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}

      /* =====================================================
          HEADER
      ===================================================== */

      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}

          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}, "WORKFORCE OPERATIONS"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}, "Leave Management"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}, "Monitor employee time off, leave requests, approvals and absence activity."


          )

        )


        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}

          , React.createElement('button', {
            type: "button",
            className: "btn",
            onClick: exportReport, __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}

            , React.createElement(Download, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}} ), "Export report"

          )

          , React.createElement(Link, {
            to: "/leave/apply",
            className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}

            , React.createElement(Plus, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}} ), "Apply leave"

          )

        )

      )


      /* =====================================================
          STAT CARDS
      ===================================================== */

      , React.createElement('div', { className: "mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}

        /* TOTAL */

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}, "TOTAL REQUESTS"

              )

              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold leading-none text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}
                , stats.total
              )

              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}, "Leave requests recorded"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}
              , React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}} )
            )

          )

        )


        /* PENDING */

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 354}}, "PENDING"

              )

              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold leading-none text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}
                , stats.pending
              )

              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}, "Need HR attention"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}
              , React.createElement(Clock3, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}} )
            )

          )

        )


        /* APPROVED */

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 385}}, "APPROVED"

              )

              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold leading-none text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}
                , stats.approved
              )

              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 393}}, "Approved leave requests"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}
              , React.createElement(Check, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}} )
            )

          )

        )


        /* REJECTED */

        , React.createElement('div', { className: "card p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}, "REJECTED"

              )

              , React.createElement('p', { className: "mt-3 text-[22px] font-extrabold leading-none text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}
                , stats.rejected
              )

              , React.createElement('p', { className: "mt-2 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}, "Requests declined"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 430}}
              , React.createElement(X, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 431}} )
            )

          )

        )

      )


      /* =====================================================
          MIDDLE SECTION
      ===================================================== */

      , React.createElement('div', { className: "mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.8fr]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 445}}


        /* ===================================================
            LEAVE INSIGHT
        =================================================== */

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 454}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 456}}

              , React.createElement('span', { className: "text-[9px] font-extrabold tracking-[0.14em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}, "LEAVE INSIGHT"

              )

              , React.createElement('h2', { className: "mt-1 text-[15px] font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 462}}, "Workforce time off"

              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}, "Current leave request distribution"

              )

            )

            , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}
              , React.createElement(ArrowUpRight, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 473}} )
            )

          )


          /* DISTRIBUTION */

          , React.createElement('div', { className: "mt-5 grid grid-cols-3 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 481}}

            , React.createElement('div', { className: "rounded-xl bg-slate-50 p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 483}}

              , React.createElement('p', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 485}}, "Pending"

              )

              , React.createElement('p', { className: "mt-2 text-xl font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 489}}
                , stats.pending
              )

              , React.createElement('p', { className: "mt-1 text-[9px] text-amber-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 493}}, "Awaiting review"

              )

            )


            , React.createElement('div', { className: "rounded-xl bg-slate-50 p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}

              , React.createElement('p', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 502}}, "Approved"

              )

              , React.createElement('p', { className: "mt-2 text-xl font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 506}}
                , stats.approved
              )

              , React.createElement('p', { className: "mt-1 text-[9px] text-emerald-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 510}}, "Approved requests"

              )

            )


            , React.createElement('div', { className: "rounded-xl bg-slate-50 p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 517}}

              , React.createElement('p', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 519}}, "Rejected"

              )

              , React.createElement('p', { className: "mt-2 text-xl font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}
                , stats.rejected
              )

              , React.createElement('p', { className: "mt-1 text-[9px] text-red-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 527}}, "Declined requests"

              )

            )

          )


          /* PROGRESS */

          , React.createElement('div', { className: "mt-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 538}}

            , React.createElement('div', { className: "mb-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 540}}

              , React.createElement('span', { className: "text-[9px] font-medium text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 542}}, "Approval rate"

              )

              , React.createElement('span', { className: "text-[10px] font-bold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 546}}

                , stats.total
                  ? Math.round(
                      (stats.approved /
                        stats.total) *
                        100
                    )
                  : 0, "%"


              )

            )

            , React.createElement('div', { className: "h-2 overflow-hidden rounded-full bg-slate-100"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 561}}

              , React.createElement('div', {
                className: "h-full rounded-full bg-blue-600 transition-all"   ,
                style: {
                  width: `${
                    stats.total
                      ? Math.round(
                          (stats.approved /
                            stats.total) *
                            100
                        )
                      : 0
                  }%`,
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 563}}
              )

            )

          )

        )


        /* ===================================================
            QUICK ACTIONS
        =================================================== */

        , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 589}}

          , React.createElement('div', { className: "border-b border-slate-100 p-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 591}}

            , React.createElement('span', { className: "text-[9px] font-extrabold tracking-[0.14em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 593}}, "QUICK ACTIONS"

            )

            , React.createElement('h2', { className: "mt-1 text-[15px] font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 597}}, "Leave operations"

            )

          )


          /* APPLY */

          , React.createElement('button', {
            type: "button",
            onClick: () =>
              navigate("/leave/apply")
            ,
            className: "flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 606}}


            , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}}
              , React.createElement(Plus, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 615}} )
            )

            , React.createElement('span', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 618}}

              , React.createElement('span', { className: "block text-[11px] font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 620}}, "Apply leave"

              )

              , React.createElement('span', { className: "block text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 624}}, "Create a new leave request"

              )

            )

            , React.createElement(ChevronRight, {
              size: 15,
              className: "text-slate-300", __self: this, __source: {fileName: _jsxFileName, lineNumber: 630}}
            )

          )


          /* HISTORY */

          , React.createElement('button', {
            type: "button",
            onClick: () =>
              navigate("/leave/history")
            ,
            className: "flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 640}}


            , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 648}}
              , React.createElement(FileClock, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 649}} )
            )

            , React.createElement('span', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 652}}

              , React.createElement('span', { className: "block text-[11px] font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 654}}, "Leave history"

              )

              , React.createElement('span', { className: "block text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 658}}, "Review previous leave activity"

              )

            )

            , React.createElement(ChevronRight, {
              size: 15,
              className: "text-slate-300", __self: this, __source: {fileName: _jsxFileName, lineNumber: 664}}
            )

          )


          /* REPORT */

          , React.createElement('button', {
            type: "button",
            onClick: exportReport,
            className: "flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 674}}


            , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 680}}
              , React.createElement(Download, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 681}} )
            )

            , React.createElement('span', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 684}}

              , React.createElement('span', { className: "block text-[11px] font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 686}}, "Leave reports"

              )

              , React.createElement('span', { className: "block text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 690}}, "Download leave records"

              )

            )

            , React.createElement(ChevronRight, {
              size: 15,
              className: "text-slate-300", __self: this, __source: {fileName: _jsxFileName, lineNumber: 696}}
            )

          )

        )

      )


      /* =====================================================
          EMPLOYEE LEAVE TABLE
      ===================================================== */

      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 712}}

        /* TABLE HEADER */

        , React.createElement('div', { className: "flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 716}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 718}}

            , React.createElement('h2', { className: "text-[13px] font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 720}}, "Employee leave requests"

            )

            , React.createElement('p', { className: "mt-1 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 724}}, "Detailed leave records and approval status."

            )

          )


          /* FILTERS */

          , React.createElement('div', { className: "flex flex-wrap items-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 733}}

            /* SEARCH */

            , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 737}}

              , React.createElement(Search, {
                size: 14,
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 739}}
              )

              , React.createElement('input', {
                type: "text",
                value: search,
                onChange: (e) =>
                  setSearch(e.target.value)
                ,
                placeholder: "Search employee..." ,
                className: "h-9 w-[180px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[10px] outline-none focus:border-blue-500"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 744}}
              )

            )


            /* DATE */

            , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 759}}

              , React.createElement('input', {
                type: "date",
                value: date,
                onChange: (e) =>
                  setDate(e.target.value)
                ,
                className: "h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-600 outline-none focus:border-blue-500"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 761}}
              )

            )


            /* STATUS */

            , React.createElement('select', {
              value: status,
              onChange: (e) =>
                setStatus(e.target.value)
              ,
              className: "h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-600 outline-none focus:border-blue-500"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 775}}


              , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 783}}, "All statuses"

              )

              , React.createElement('option', { value: "Pending", __self: this, __source: {fileName: _jsxFileName, lineNumber: 787}}, "Pending"

              )

              , React.createElement('option', { value: "Approved", __self: this, __source: {fileName: _jsxFileName, lineNumber: 791}}, "Approved"

              )

              , React.createElement('option', { value: "Rejected", __self: this, __source: {fileName: _jsxFileName, lineNumber: 795}}, "Rejected"

              )

              , React.createElement('option', { value: "Cancelled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 799}}, "Cancelled"

              )

            )

          )

        )


        /* =================================================
            TABLE
        ================================================= */

        , busy ? (

          React.createElement('div', { className: "loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 816}}, "Loading leave requests…"

          )

        ) : filteredRows.length ? (

          React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 822}}

            , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 824}}

              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 826}}

                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 828}}

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 830}}, "EMPLOYEE"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 834}}, "LEAVE TYPE"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 838}}, "START DATE"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 842}}, "END DATE"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 846}}, "DAYS"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 850}}, "STATUS"

                  )

                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 854}}, "ACTION"

                  )

                )

              )


              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 863}}

                , filteredRows.map(
                  (row, index) => {

                    const employee =
                      row.name ||
                      row.employee ||
                      "Employee";

                    const rowId =
                      row.id ||
                      index;


                    /* CALCULATE DAYS */

                    let days = "—";

                    if (
                      row.start_date &&
                      row.end_date
                    ) {
                      const start =
                        new Date(
                          row.start_date
                        );

                      const end =
                        new Date(
                          row.end_date
                        );

                      const difference =
                        Math.ceil(
                          (
                            end -
                            start
                          ) /
                            (1000 *
                              60 *
                              60 *
                              24)
                        ) + 1;

                      if (
                        Number.isFinite(
                          difference
                        )
                      ) {
                        days =
                          difference;
                      }
                    }


                    return (
                      React.createElement('tr', {
                        key: rowId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 920}}


                        /* EMPLOYEE */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 926}}

                          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 928}}

                            , React.createElement('span', { className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 930}}
                              , employee
                                .slice(
                                  0,
                                  1
                                )
                                .toUpperCase()
                            )

                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 939}}

                              , React.createElement('b', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 941}}
                                , employee
                              )

                              , React.createElement('div', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 945}}
                                , row.employee_id
                                  ? `Employee #${row.employee_id}`
                                  : "Workforce record"
                              )

                            )

                          )

                        )


                        /* TYPE */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 960}}

                          , React.createElement('span', { className: "text-[10px] font-semibold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 962}}
                            , row.leave_type ||
                              "—"
                          )

                        )


                        /* START */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 972}}

                          , React.createElement('span', { className: "text-[10px] text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 974}}
                            , row.start_date ||
                              "—"
                          )

                        )


                        /* END */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 984}}

                          , React.createElement('span', { className: "text-[10px] text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 986}}
                            , row.end_date ||
                              "—"
                          )

                        )


                        /* DAYS */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 996}}

                          , React.createElement('span', { className: "text-[10px] font-semibold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 998}}
                            , days
                            , days !==
                            "—"
                              ? " day(s)"
                              : ""
                          )

                        )


                        /* STATUS */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1011}}

                          , React.createElement('span', {
                            className: `badge ${
                              row.status ===
                              "Approved"
                                ? "success"
                                : row.status ===
                                  "Rejected"
                                ? "danger"
                                : "warning"
                            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1013}}


                            , row.status ||
                              "Pending"

                          )

                        )


                        /* ACTION */

                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1035}}

                          , row.status ===
                          "Pending" ? (

                            React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1040}}

                              , React.createElement('button', {
                                type: "button",
                                disabled: 
                                  actionId ===
                                  rowId
                                ,
                                title: "Approve",
                                onClick: () =>
                                  updateStatus(
                                    rowId,
                                    "Approved"
                                  )
                                ,
                                className: "btn !min-h-8 !px-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1042}}

                                , React.createElement(Check, {
                                  size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1057}}
                                )
                              )

                              , React.createElement('button', {
                                type: "button",
                                disabled: 
                                  actionId ===
                                  rowId
                                ,
                                title: "Reject",
                                onClick: () =>
                                  updateStatus(
                                    rowId,
                                    "Rejected"
                                  )
                                ,
                                className: "btn btn-danger !min-h-8 !px-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1062}}

                                , React.createElement(X, {
                                  size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1077}}
                                )
                              )

                            )

                          ) : (

                            React.createElement('span', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1086}}, "No action"

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

          React.createElement('div', { className: "empty-state", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1107}}

            , React.createElement(CalendarDays, {
              className: "mx-auto mb-2 text-slate-300"  ,
              size: 28, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1109}}
            )

            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1114}}, "No leave requests"

            )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1118}}, "Employee leave requests will appear here when they are created."


            )

          )

        )

      )

    )
  );
}