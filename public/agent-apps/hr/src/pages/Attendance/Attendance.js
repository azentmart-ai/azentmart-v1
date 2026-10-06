const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Attendance/Attendance.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  UserCheck,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import api from "../../services/api.js";
const STATUS_META = {
  Present: {
    label: "Present",
    className: "bg-emerald-50 text-emerald-700",
  },
  Late: {
    label: "Late",
    className: "bg-amber-50 text-amber-700",
  },
  Absent: {
    label: "Absent",
    className: "bg-rose-50 text-rose-700",
  },
  "Half-day": {
    label: "Half-day",
    className: "bg-blue-50 text-blue-700",
  },
};

export default function Attendance() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(true);

  const loadAttendance = async () => {
    setBusy(true);

    try {
      const response = await api.get("/attendance", {
        params: {
          status: status || undefined,
          date_filter: date || undefined,
        },
      });

      setRows(_optionalChain([response, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) || response.data || []);
    } catch (error) {
      console.error("Attendance loading failed:", error);
      setRows([]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [status, date]);

  const filteredRows = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return rows;

    return rows.filter((row) => {
      const employee = String(row.name || row.employee || "").toLowerCase();

      return employee.includes(value);
    });
  }, [rows, search]);

  const stats = useMemo(() => {
    const present = rows.filter((x) => x.status === "Present").length;

    const late = rows.filter((x) => x.status === "Late").length;

    const absent = rows.filter((x) => x.status === "Absent").length;

    const overtime = rows.reduce(
      (total, row) => total + Number(row.overtime || row.overtime_hours || 0),
      0,
    );

    return {
      present,
      late,
      absent,
      overtime: overtime.toFixed(1),
    };
  }, [rows]);

  const exportAttendance = () => {
    if (!filteredRows.length) return;

    const headers = [
      "Employee",
      "Date",
      "Check In",
      "Check Out",
      "Hours",
      "Overtime",
      "Status",
    ];

    const data = filteredRows.map((row) => [
      row.name || row.employee || "",
      row.date || row.work_date || "",
      row.check_in || "",
      row.check_out || "",
      row.working_hours || row.hours || "",
      row.overtime || row.overtime_hours || "",
      row.status || "",
    ]);

    const csv = [headers, ...data]
      .map((line) =>
        line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}
      /* HEADER */

      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}, "WORKFORCE OPERATIONS"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}, "Attendance Center" )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}, "Monitor workforce presence, working hours, overtime and attendance exceptions."


          )
        )

        , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}
          , React.createElement('button', { className: "btn", onClick: exportAttendance, __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
            , React.createElement(Download, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}} ), "Export report"

          )

          , React.createElement('button', { className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
            , React.createElement(UserCheck, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}} ), "Mark attendance"

          )
        )
      )

      /* OVERVIEW */

      , React.createElement('section', { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
        , React.createElement(StatCard, {
          icon: React.createElement(Users, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}} ),
          label: "Present today" ,
          value: stats.present,
          detail: "Employees checked in"  ,
          iconClass: "bg-emerald-50 text-emerald-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}
        )

        , React.createElement(StatCard, {
          icon: React.createElement(Clock3, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}} ),
          label: "Late arrivals" ,
          value: stats.late,
          detail: "Need attention" ,
          iconClass: "bg-amber-50 text-amber-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
        )

        , React.createElement(StatCard, {
          icon: React.createElement(XCircle, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}} ),
          label: "Absent",
          value: stats.absent,
          detail: "No attendance marked"  ,
          iconClass: "bg-rose-50 text-rose-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}
        )

        , React.createElement(StatCard, {
          icon: React.createElement(Zap, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}} ),
          label: "Overtime",
          value: `${stats.overtime}h`,
          detail: "Recorded overtime" ,
          iconClass: "bg-blue-50 text-blue-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
        )
      )

      /* INSIGHT AREA */

      , React.createElement('section', { className: "grid gap-5 lg:grid-cols-[1.5fr_1fr] mb-5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}
        , React.createElement('div', { className: "card p-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}
          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
              , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.14em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "ATTENDANCE INSIGHT"

              )

              , React.createElement('h2', { className: "mt-1 text-base font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}, "Workforce activity"

              )

              , React.createElement('p', { className: "mt-1 text-xs text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}, "Current attendance distribution"

              )
            )

            , React.createElement('div', { className: "rounded-xl bg-blue-50 p-2 text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}
              , React.createElement(ArrowUpRight, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}} )
            )
          )

          , React.createElement('div', { className: "mt-6 grid grid-cols-3 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}
            , React.createElement(AttendanceMetric, {
              value: stats.present,
              label: "Present",
              type: "present", __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}
            )

            , React.createElement(AttendanceMetric, { value: stats.late, label: "Late", type: "late", __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}} )

            , React.createElement(AttendanceMetric, {
              value: stats.absent,
              label: "Absent",
              type: "absent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}
            )
          )

          , React.createElement('div', { className: "mt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}
            , React.createElement('div', { className: "mb-2 flex justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}
              , React.createElement('span', { className: "text-[10px] font-semibold text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}, "Presence rate"

              )

              , React.createElement('span', { className: "text-[10px] font-bold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}
                , rows.length
                  ? Math.round((stats.present / rows.length) * 100)
                  : 0, "%"

              )
            )

            , React.createElement('div', { className: "h-2 overflow-hidden rounded-full bg-slate-100"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}
              , React.createElement('div', {
                className: "h-full rounded-full bg-blue-600 transition-all"   ,
                style: {
                  width: `${
                    rows.length
                      ? Math.round((stats.present / rows.length) * 100)
                      : 0
                  }%`,
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}
              )
            )
          )
        )

        , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
          , React.createElement('div', { className: "border-b border-slate-100 p-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}
            , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.14em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}, "QUICK ACTIONS"

            )

            , React.createElement('h2', { className: "mt-1 text-base font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}, "Attendance operations"

            )
          )

          , React.createElement(QuickAction, {
            icon: React.createElement(CalendarDays, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}} ),
            title: "Daily attendance" ,
            text: "Review today's workforce"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
          )

          , React.createElement(QuickAction, {
            icon: React.createElement(Clock3, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}} ),
            title: "Regularization",
            text: "Review attendance corrections"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}
          )

          , React.createElement(QuickAction, {
            icon: React.createElement(ArrowDownToLine, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}} ),
            title: "Attendance reports" ,
            text: "Download workforce reports"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}
          )
        )
      )

      /* ATTENDANCE TABLE */

      , React.createElement('section', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}
        , React.createElement('div', { className: "border-b border-slate-100 p-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}
          , React.createElement('div', { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}
              , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}, "Employee attendance"

              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}, "Detailed attendance records and working hours."

              )
            )

            , React.createElement('div', { className: "flex flex-wrap gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}
              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}
                , React.createElement(Search, {
                  size: 14,
                  className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
                )

                , React.createElement('input', {
                  className: "input !w-52 pl-9"  ,
                  placeholder: "Search employee..." ,
                  value: search,
                  onChange: (e) => setSearch(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}
                )
              )

              , React.createElement('input', {
                className: "input !w-auto" ,
                type: "date",
                value: date,
                onChange: (e) => setDate(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}
              )

              , React.createElement('select', {
                className: "select !w-auto" ,
                value: status,
                onChange: (e) => setStatus(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}

                , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}, "All statuses" )
                , React.createElement('option', { value: "Present", __self: this, __source: {fileName: _jsxFileName, lineNumber: 354}}, "Present")
                , React.createElement('option', { value: "Late", __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}, "Late")
                , React.createElement('option', { value: "Absent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}, "Absent")
                , React.createElement('option', { value: "Half-day", __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}, "Half-day")
              )
            )
          )
        )

        , busy ? (
          React.createElement('div', { className: "loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}, "Loading attendance..." )
        ) : filteredRows.length ? (
          React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}
            , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 367}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}
                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}, "Employee")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 371}}, "Date")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}, "Check in" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}, "Check out" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}, "Hours")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}, "Overtime")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}, "Status")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 377}} )
                )
              )

              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}
                , filteredRows.map((row, index) => {
                  const meta = STATUS_META[row.status] || {
                    label: row.status || "Unknown",
                    className: "bg-slate-50 text-slate-600",
                  };

                  return (
                    React.createElement('tr', { key: row.id || `${row.name}-${index}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}
                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}
                        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}
                          , React.createElement('div', { className: "grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-600"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}
                            , (row.name || row.employee || "E")
                              .charAt(0)
                              .toUpperCase()
                          )

                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}
                            , React.createElement('div', { className: "font-bold text-slate-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}
                              , row.name || row.employee || "Employee"
                            )

                            , React.createElement('div', { className: "text-[10px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}, "Workforce record"

                            )
                          )
                        )
                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}, row.date || row.work_date || "—")

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}
                        , React.createElement('span', { className: "font-semibold text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}
                          , row.check_in || "—"
                        )
                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}, row.check_out || "—")

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}, row.working_hours || row.hours || "—")

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 422}}, row.overtime || row.overtime_hours || "—")

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
                        , React.createElement('span', {
                          className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${meta.className}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}

                          , React.createElement(CheckCircle2, { size: 10, __self: this, __source: {fileName: _jsxFileName, lineNumber: 428}} )
                          , meta.label
                        )
                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}
                        , React.createElement('button', { className: "rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}
                          , React.createElement(MoreHorizontal, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}} )
                        )
                      )
                    )
                  );
                })
              )
            )
          )
        ) : (
          React.createElement('div', { className: "py-16 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 445}}
            , React.createElement('div', { className: "mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 446}}
              , React.createElement(Filter, { size: 20, __self: this, __source: {fileName: _jsxFileName, lineNumber: 447}} )
            )

            , React.createElement('h3', { className: "text-sm font-extrabold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 450}}, "No attendance records"

            )

            , React.createElement('p', { className: "mt-1 text-xs text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 454}}, "Try changing your filters or date."

            )
          )
        )
      )
    )
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function StatCard({ icon, label, value, detail, iconClass }) {
  return (
    React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 470}}
      , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}
          , React.createElement('p', { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 473}}
            , label
          )

          , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 477}}, value)

          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 479}}, detail)
        )

        , React.createElement('div', {
          className: `grid h-10 w-10 place-items-center rounded-xl ${iconClass}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 482}}

          , icon
        )
      )
    )
  );
}

function AttendanceMetric({ value, label }) {
  return (
    React.createElement('div', { className: "rounded-xl border border-slate-100 bg-slate-50 p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 494}}
      , React.createElement('div', { className: "text-xl font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 495}}, value)

      , React.createElement('div', { className: "mt-1 text-[10px] font-semibold text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 497}}
        , label
      )
    )
  );
}

function QuickAction({ icon, title, text }) {
  return (
    React.createElement('button', { className: "flex w-full items-center gap-3 border-b border-slate-100 p-5 text-left transition hover:bg-slate-50"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 506}}
      , React.createElement('div', { className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 507}}
        , icon
      )

      , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 511}}
        , React.createElement('div', { className: "text-xs font-bold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 512}}, title)

        , React.createElement('div', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}, text)
      )

      , React.createElement(ChevronRight, { size: 15, className: "text-slate-300", __self: this, __source: {fileName: _jsxFileName, lineNumber: 517}} )
    )
  );
}
