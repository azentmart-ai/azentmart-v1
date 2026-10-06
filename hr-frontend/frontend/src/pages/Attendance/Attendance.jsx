import React, { useEffect, useMemo, useState } from "react";
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
import api from "../../services/api";
import "../Page.css";

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

      setRows(response.data?.items || response.data || []);
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
    <div className="page">
      {/* HEADER */}

      <div className="page-header">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            WORKFORCE OPERATIONS
          </span>

          <h1 className="mt-1">Attendance Center</h1>

          <p>
            Monitor workforce presence, working hours, overtime and attendance
            exceptions.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="btn" onClick={exportAttendance}>
            <Download size={14} />
            Export report
          </button>

          <button className="btn btn-primary">
            <UserCheck size={14} />
            Mark attendance
          </button>
        </div>
      </div>

      {/* OVERVIEW */}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard
          icon={<Users size={18} />}
          label="Present today"
          value={stats.present}
          detail="Employees checked in"
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          icon={<Clock3 size={18} />}
          label="Late arrivals"
          value={stats.late}
          detail="Need attention"
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          icon={<XCircle size={18} />}
          label="Absent"
          value={stats.absent}
          detail="No attendance marked"
          iconClass="bg-rose-50 text-rose-600"
        />

        <StatCard
          icon={<Zap size={18} />}
          label="Overtime"
          value={`${stats.overtime}h`}
          detail="Recorded overtime"
          iconClass="bg-blue-50 text-blue-600"
        />
      </section>

      {/* INSIGHT AREA */}

      <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr] mb-5">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold tracking-[0.14em] text-blue-600">
                ATTENDANCE INSIGHT
              </span>

              <h2 className="mt-1 text-base font-extrabold text-slate-900">
                Workforce activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current attendance distribution
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <ArrowUpRight size={17} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <AttendanceMetric
              value={stats.present}
              label="Present"
              type="present"
            />

            <AttendanceMetric value={stats.late} label="Late" type="late" />

            <AttendanceMetric
              value={stats.absent}
              label="Absent"
              type="absent"
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between">
              <span className="text-[10px] font-semibold text-slate-500">
                Presence rate
              </span>

              <span className="text-[10px] font-bold text-slate-800">
                {rows.length
                  ? Math.round((stats.present / rows.length) * 100)
                  : 0}
                %
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    rows.length
                      ? Math.round((stats.present / rows.length) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <span className="text-[10px] font-extrabold tracking-[0.14em] text-blue-600">
              QUICK ACTIONS
            </span>

            <h2 className="mt-1 text-base font-extrabold">
              Attendance operations
            </h2>
          </div>

          <QuickAction
            icon={<CalendarDays size={17} />}
            title="Daily attendance"
            text="Review today's workforce"
          />

          <QuickAction
            icon={<Clock3 size={17} />}
            title="Regularization"
            text="Review attendance corrections"
          />

          <QuickAction
            icon={<ArrowDownToLine size={17} />}
            title="Attendance reports"
            text="Download workforce reports"
          />
        </div>
      </section>

      {/* ATTENDANCE TABLE */}

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Employee attendance
              </h2>

              <p className="mt-1 text-[10px] text-slate-500">
                Detailed attendance records and working hours.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  className="input !w-52 pl-9"
                  placeholder="Search employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <input
                className="input !w-auto"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <select
                className="select !w-auto"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
                <option value="Half-day">Half-day</option>
              </select>
            </div>
          </div>
        </div>

        {busy ? (
          <div className="loading">Loading attendance...</div>
        ) : filteredRows.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Check in</th>
                  <th>Check out</th>
                  <th>Hours</th>
                  <th>Overtime</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row, index) => {
                  const meta = STATUS_META[row.status] || {
                    label: row.status || "Unknown",
                    className: "bg-slate-50 text-slate-600",
                  };

                  return (
                    <tr key={row.id || `${row.name}-${index}`}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-600">
                            {(row.name || row.employee || "E")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className="font-bold text-slate-800">
                              {row.name || row.employee || "Employee"}
                            </div>

                            <div className="text-[10px] text-slate-400">
                              Workforce record
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>{row.date || row.work_date || "—"}</td>

                      <td>
                        <span className="font-semibold text-slate-700">
                          {row.check_in || "—"}
                        </span>
                      </td>

                      <td>{row.check_out || "—"}</td>

                      <td>{row.working_hours || row.hours || "—"}</td>

                      <td>{row.overtime || row.overtime_hours || "—"}</td>

                      <td>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold ${meta.className}`}
                        >
                          <CheckCircle2 size={10} />
                          {meta.label}
                        </span>
                      </td>

                      <td>
                        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Filter size={20} />
            </div>

            <h3 className="text-sm font-extrabold text-slate-800">
              No attendance records
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Try changing your filters or date.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function StatCard({ icon, label, value, detail, iconClass }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>

          <p className="mt-1 text-[10px] text-slate-500">{detail}</p>
        </div>

        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function AttendanceMetric({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-xl font-extrabold text-slate-900">{value}</div>

      <div className="mt-1 text-[10px] font-semibold text-slate-500">
        {label}
      </div>
    </div>
  );
}

function QuickAction({ icon, title, text }) {
  return (
    <button className="flex w-full items-center gap-3 border-b border-slate-100 p-5 text-left transition hover:bg-slate-50">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="flex-1">
        <div className="text-xs font-bold text-slate-800">{title}</div>

        <div className="mt-1 text-[10px] text-slate-500">{text}</div>
      </div>

      <ChevronRight size={15} className="text-slate-300" />
    </button>
  );
}
