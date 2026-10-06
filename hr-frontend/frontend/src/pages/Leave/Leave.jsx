import React, { useEffect, useMemo, useState } from "react";

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

import api from "../../services/api";

import "../Page.css";


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
        response.data?.items ||
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
    <div className="page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">

        <div>

          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            WORKFORCE OPERATIONS
          </span>

          <h1 className="mt-1">
            Leave Management
          </h1>

          <p>
            Monitor employee time off, leave requests,
            approvals and absence activity.
          </p>

        </div>


        <div className="flex items-center gap-2">

          <button
            type="button"
            className="btn"
            onClick={exportReport}
          >
            <Download size={14} />
            Export report
          </button>

          <Link
            to="/leave/apply"
            className="btn btn-primary"
          >
            <Plus size={14} />
            Apply leave
          </Link>

        </div>

      </div>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}

        <div className="card p-4">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                TOTAL REQUESTS
              </p>

              <p className="mt-3 text-[22px] font-extrabold leading-none text-slate-900">
                {stats.total}
              </p>

              <p className="mt-2 text-[9px] text-slate-400">
                Leave requests recorded
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={17} />
            </span>

          </div>

        </div>


        {/* PENDING */}

        <div className="card p-4">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                PENDING
              </p>

              <p className="mt-3 text-[22px] font-extrabold leading-none text-slate-900">
                {stats.pending}
              </p>

              <p className="mt-2 text-[9px] text-slate-400">
                Need HR attention
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={17} />
            </span>

          </div>

        </div>


        {/* APPROVED */}

        <div className="card p-4">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                APPROVED
              </p>

              <p className="mt-3 text-[22px] font-extrabold leading-none text-slate-900">
                {stats.approved}
              </p>

              <p className="mt-2 text-[9px] text-slate-400">
                Approved leave requests
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Check size={17} />
            </span>

          </div>

        </div>


        {/* REJECTED */}

        <div className="card p-4">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                REJECTED
              </p>

              <p className="mt-3 text-[22px] font-extrabold leading-none text-slate-900">
                {stats.rejected}
              </p>

              <p className="mt-2 text-[9px] text-slate-400">
                Requests declined
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600">
              <X size={17} />
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          MIDDLE SECTION
      ===================================================== */}

      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.8fr]">


        {/* ===================================================
            LEAVE INSIGHT
        =================================================== */}

        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <span className="text-[9px] font-extrabold tracking-[0.14em] text-blue-600">
                LEAVE INSIGHT
              </span>

              <h2 className="mt-1 text-[15px] font-extrabold text-slate-900">
                Workforce time off
              </h2>

              <p className="mt-1 text-[10px] text-slate-500">
                Current leave request distribution
              </p>

            </div>

            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <ArrowUpRight size={15} />
            </span>

          </div>


          {/* DISTRIBUTION */}

          <div className="mt-5 grid grid-cols-3 gap-3">

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-[9px] text-slate-400">
                Pending
              </p>

              <p className="mt-2 text-xl font-extrabold text-slate-900">
                {stats.pending}
              </p>

              <p className="mt-1 text-[9px] text-amber-600">
                Awaiting review
              </p>

            </div>


            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-[9px] text-slate-400">
                Approved
              </p>

              <p className="mt-2 text-xl font-extrabold text-slate-900">
                {stats.approved}
              </p>

              <p className="mt-1 text-[9px] text-emerald-600">
                Approved requests
              </p>

            </div>


            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-[9px] text-slate-400">
                Rejected
              </p>

              <p className="mt-2 text-xl font-extrabold text-slate-900">
                {stats.rejected}
              </p>

              <p className="mt-1 text-[9px] text-red-600">
                Declined requests
              </p>

            </div>

          </div>


          {/* PROGRESS */}

          <div className="mt-5">

            <div className="mb-2 flex items-center justify-between">

              <span className="text-[9px] font-medium text-slate-500">
                Approval rate
              </span>

              <span className="text-[10px] font-bold text-slate-900">

                {stats.total
                  ? Math.round(
                      (stats.approved /
                        stats.total) *
                        100
                    )
                  : 0}
                %

              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    stats.total
                      ? Math.round(
                          (stats.approved /
                            stats.total) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

        </div>


        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <div className="card overflow-hidden">

          <div className="border-b border-slate-100 p-5">

            <span className="text-[9px] font-extrabold tracking-[0.14em] text-blue-600">
              QUICK ACTIONS
            </span>

            <h2 className="mt-1 text-[15px] font-extrabold text-slate-900">
              Leave operations
            </h2>

          </div>


          {/* APPLY */}

          <button
            type="button"
            onClick={() =>
              navigate("/leave/apply")
            }
            className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50"
          >

            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <Plus size={15} />
            </span>

            <span className="flex-1">

              <span className="block text-[11px] font-bold text-slate-800">
                Apply leave
              </span>

              <span className="block text-[9px] text-slate-400">
                Create a new leave request
              </span>

            </span>

            <ChevronRight
              size={15}
              className="text-slate-300"
            />

          </button>


          {/* HISTORY */}

          <button
            type="button"
            onClick={() =>
              navigate("/leave/history")
            }
            className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50"
          >

            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <FileClock size={15} />
            </span>

            <span className="flex-1">

              <span className="block text-[11px] font-bold text-slate-800">
                Leave history
              </span>

              <span className="block text-[9px] text-slate-400">
                Review previous leave activity
              </span>

            </span>

            <ChevronRight
              size={15}
              className="text-slate-300"
            />

          </button>


          {/* REPORT */}

          <button
            type="button"
            onClick={exportReport}
            className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50"
          >

            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <Download size={15} />
            </span>

            <span className="flex-1">

              <span className="block text-[11px] font-bold text-slate-800">
                Leave reports
              </span>

              <span className="block text-[9px] text-slate-400">
                Download leave records
              </span>

            </span>

            <ChevronRight
              size={15}
              className="text-slate-300"
            />

          </button>

        </div>

      </div>


      {/* =====================================================
          EMPLOYEE LEAVE TABLE
      ===================================================== */}

      <div className="card overflow-hidden">

        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <h2 className="text-[13px] font-extrabold text-slate-900">
              Employee leave requests
            </h2>

            <p className="mt-1 text-[9px] text-slate-400">
              Detailed leave records and approval status.
            </p>

          </div>


          {/* FILTERS */}

          <div className="flex flex-wrap items-center gap-2">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search employee..."
                className="h-9 w-[180px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[10px] outline-none focus:border-blue-500"
              />

            </div>


            {/* DATE */}

            <div className="relative">

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-600 outline-none focus:border-blue-500"
              />

            </div>


            {/* STATUS */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] text-slate-600 outline-none focus:border-blue-500"
            >

              <option value="">
                All statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        {busy ? (

          <div className="loading">
            Loading leave requests…
          </div>

        ) : filteredRows.length ? (

          <div className="table-wrap">

            <table>

              <thead>

                <tr>

                  <th>
                    EMPLOYEE
                  </th>

                  <th>
                    LEAVE TYPE
                  </th>

                  <th>
                    START DATE
                  </th>

                  <th>
                    END DATE
                  </th>

                  <th>
                    DAYS
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredRows.map(
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
                      <tr
                        key={rowId}
                      >

                        {/* EMPLOYEE */}

                        <td>

                          <div className="flex items-center gap-2">

                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">
                              {employee
                                .slice(
                                  0,
                                  1
                                )
                                .toUpperCase()}
                            </span>

                            <div>

                              <b>
                                {employee}
                              </b>

                              <div className="text-[9px] text-slate-400">
                                {row.employee_id
                                  ? `Employee #${row.employee_id}`
                                  : "Workforce record"}
                              </div>

                            </div>

                          </div>

                        </td>


                        {/* TYPE */}

                        <td>

                          <span className="text-[10px] font-semibold text-slate-700">
                            {row.leave_type ||
                              "—"}
                          </span>

                        </td>


                        {/* START */}

                        <td>

                          <span className="text-[10px] text-slate-700">
                            {row.start_date ||
                              "—"}
                          </span>

                        </td>


                        {/* END */}

                        <td>

                          <span className="text-[10px] text-slate-700">
                            {row.end_date ||
                              "—"}
                          </span>

                        </td>


                        {/* DAYS */}

                        <td>

                          <span className="text-[10px] font-semibold text-slate-700">
                            {days}
                            {days !==
                            "—"
                              ? " day(s)"
                              : ""}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`badge ${
                              row.status ===
                              "Approved"
                                ? "success"
                                : row.status ===
                                  "Rejected"
                                ? "danger"
                                : "warning"
                            }`}
                          >

                            {row.status ||
                              "Pending"}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          {row.status ===
                          "Pending" ? (

                            <div className="flex items-center gap-1">

                              <button
                                type="button"
                                disabled={
                                  actionId ===
                                  rowId
                                }
                                title="Approve"
                                onClick={() =>
                                  updateStatus(
                                    rowId,
                                    "Approved"
                                  )
                                }
                                className="btn !min-h-8 !px-2"
                              >
                                <Check
                                  size={13}
                                />
                              </button>

                              <button
                                type="button"
                                disabled={
                                  actionId ===
                                  rowId
                                }
                                title="Reject"
                                onClick={() =>
                                  updateStatus(
                                    rowId,
                                    "Rejected"
                                  )
                                }
                                className="btn btn-danger !min-h-8 !px-2"
                              >
                                <X
                                  size={13}
                                />
                              </button>

                            </div>

                          ) : (

                            <span className="text-[9px] text-slate-400">
                              No action
                            </span>

                          )}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="empty-state">

            <CalendarDays
              className="mx-auto mb-2 text-slate-300"
              size={28}
            />

            <strong>
              No leave requests
            </strong>

            <p>
              Employee leave requests will
              appear here when they are created.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}