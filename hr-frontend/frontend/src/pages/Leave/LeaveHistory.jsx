import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Search,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";

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
        response.data?.items ||
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
    <div className="page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">

        <div>
          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            TIME OFF
          </span>

          <h1 className="mt-1">
            Leave History
          </h1>

          <p>
            Review previous employee leave activity
            and request history.
          </p>
        </div>

        <Link
          className="btn btn-primary"
          to="/leave/apply"
        >
          Apply Leave
        </Link>

      </div>

      {/* =====================================================
          HISTORY CARD
      ===================================================== */}

      <div className="card overflow-hidden">

        {/* SEARCH */}

        <div className="border-b border-slate-100 p-4">

          <div className="relative max-w-sm">

            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search employee or leave type..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* LOADING */}

        {busy ? (
          <div className="loading">
            Loading leave history…
          </div>
        ) : filteredRows.length ? (

          <div className="table-wrap">

            <table>

              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredRows.map(
                  (row, index) => {

                    const employee =
                      row.name ||
                      row.employee ||
                      "Employee";

                    return (
                      <tr
                        key={
                          row.id ||
                          index
                        }
                      >

                        <td>
                          <b>
                            {employee}
                          </b>

                          {row.employee_id && (
                            <div className="text-[9px] text-slate-400">
                              Employee #
                              {row.employee_id}
                            </div>
                          )}
                        </td>

                        <td>
                          {row.leave_type ||
                            "—"}
                        </td>

                        <td>
                          {row.start_date ||
                            "—"}
                        </td>

                        <td>
                          {row.end_date ||
                            "—"}
                        </td>

                        <td>
                          <span className="block max-w-[250px] truncate text-xs text-slate-500">
                            {row.reason ||
                              "No reason provided"}
                          </span>
                        </td>

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
              No leave history
            </strong>

            <p>
              Historical leave requests will
              appear here once records are created.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}