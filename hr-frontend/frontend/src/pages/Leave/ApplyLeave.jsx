import React, { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, Send, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { leaveService } from "../../services/leaveService";
import { LEAVE_TYPES } from "../../utils/constants";
import api from "../../services/api";

export default function ApplyLeave() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/employees", {
        params: {
          page_size: 200,
        },
      })
      .then((response) => {
        setEmployees(response.data?.items || []);
      })
      .catch(() => {
        setEmployees([]);
      });
  }, []);

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.employee_id) {
      setError("Please select an employee.");
      return;
    }

    if (!form.leave_type) {
      setError("Please select a leave type.");
      return;
    }

    if (!form.start_date) {
      setError("Please select a start date.");
      return;
    }

    if (!form.end_date) {
      setError("Please select an end date.");
      return;
    }

    if (form.end_date < form.start_date) {
      setError("End date cannot be before the start date.");
      return;
    }

    setSaving(true);

    try {
      await leaveService.apply({
        ...form,
        employee_id: Number(form.employee_id),
      });

      navigate("/leave");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to submit the leave request."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page page-section">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            TIME OFF
          </span>

          <h1 className="mt-1">
            Apply Leave
          </h1>

          <p>
            Create a leave request for an employee and send it
            into the HR approval queue.
          </p>
        </div>

        <Link
          to="/leave"
          className="btn"
        >
          <ChevronLeft size={14} />
          Back to Leave
        </Link>
      </div>

      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <div className="card overflow-hidden">

        {/* CARD HEADER */}

        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">

            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={18} />
            </span>

            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Leave Request
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-500">
                Enter the leave details below and submit the
                request for approval.
              </p>
            </div>

          </div>
        </div>

        <form onSubmit={submit}>

          {/* ERROR */}

          {error && (
            <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* FORM */}

          <div className="grid gap-5 p-6 md:grid-cols-2">

            {/* EMPLOYEE */}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Employee
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <UserRound
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                  value={form.employee_id}
                  onChange={(e) =>
                    update(
                      "employee_id",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select employee
                  </option>

                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.name} · EMP-
                      {String(employee.id).padStart(5, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LEAVE TYPE */}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Leave Type
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
                value={form.leave_type}
                onChange={(e) =>
                  update(
                    "leave_type",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select leave type
                </option>

                {LEAVE_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* START DATE */}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Start Date
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="date"
                required
                value={form.start_date}
                onChange={(e) =>
                  update(
                    "start_date",
                    e.target.value
                  )
                }
              />
            </div>

            {/* END DATE */}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                End Date
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="date"
                required
                value={form.end_date}
                min={form.start_date || undefined}
                onChange={(e) =>
                  update(
                    "end_date",
                    e.target.value
                  )
                }
              />
            </div>

            {/* REASON */}

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">
                Reason
              </label>

              <textarea
                className="min-h-[120px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter the reason for leave..."
                value={form.reason}
                onChange={(e) =>
                  update(
                    "reason",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">

            <Link
              to="/leave"
              className="btn"
            >
              <ChevronLeft size={14} />
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={14} />

              {saving
                ? "Submitting..."
                : "Submit Leave Request"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}