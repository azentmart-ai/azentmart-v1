const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Leave/ApplyLeave.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, Send, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { leaveService } from "../../services/leaveService.js";
import { LEAVE_TYPES } from "../../utils/constants.js";
import api from "../../services/api.js";

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
        setEmployees(_optionalChain([response, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) || []);
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
        _optionalChain([err, 'optionalAccess', _3 => _3.response, 'optionalAccess', _4 => _4.data, 'optionalAccess', _5 => _5.detail]) ||
          "Unable to submit the leave request."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    React.createElement('div', { className: "page page-section" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}

      /* =====================================================
          HEADER
      ===================================================== */

      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}, "TIME OFF"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}, "Apply Leave"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}, "Create a leave request for an employee and send it into the HR approval queue."


          )
        )

        , React.createElement(Link, {
          to: "/leave",
          className: "btn", __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}

          , React.createElement(ChevronLeft, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}} ), "Back to Leave"

        )
      )

      /* =====================================================
          FORM CARD
      ===================================================== */

      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}

        /* CARD HEADER */

        , React.createElement('div', { className: "border-b border-slate-100 px-6 py-5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}

            , React.createElement('span', { className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}
              , React.createElement(CalendarDays, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
              , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}, "Leave Request"

              )

              , React.createElement('p', { className: "mt-0.5 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}, "Enter the leave details below and submit the request for approval."


              )
            )

          )
        )

        , React.createElement('form', { onSubmit: submit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}

          /* ERROR */

          , error && (
            React.createElement('div', { className: "mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
              , error
            )
          )

          /* FORM */

          , React.createElement('div', { className: "grid gap-5 p-6 md:grid-cols-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}

            /* EMPLOYEE */

            , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
              , React.createElement('label', { className: "block text-xs font-semibold text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}, "Employee"

                , React.createElement('span', { className: "ml-1 text-red-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}, "*")
              )

              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
                , React.createElement(UserRound, {
                  size: 15,
                  className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                )

                , React.createElement('select', {
                  className: "h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"               ,
                  required: true,
                  value: form.employee_id,
                  onChange: (e) =>
                    update(
                      "employee_id",
                      e.target.value
                    )
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}

                  , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}, "Select employee"

                  )

                  , employees.map((employee) => (
                    React.createElement('option', {
                      key: employee.id,
                      value: employee.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}

                      , employee.name, " · EMP-"
                      , String(employee.id).padStart(5, "0")
                    )
                  ))
                )
              )
            )

            /* LEAVE TYPE */

            , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
              , React.createElement('label', { className: "block text-xs font-semibold text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "Leave Type"

                , React.createElement('span', { className: "ml-1 text-red-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}, "*")
              )

              , React.createElement('select', {
                className: "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"             ,
                required: true,
                value: form.leave_type,
                onChange: (e) =>
                  update(
                    "leave_type",
                    e.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}

                , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}, "Select leave type"

                )

                , LEAVE_TYPES.map((type) => (
                  React.createElement('option', {
                    key: type,
                    value: type, __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}

                    , type
                  )
                ))
              )
            )

            /* START DATE */

            , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
              , React.createElement('label', { className: "block text-xs font-semibold text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}, "Start Date"

                , React.createElement('span', { className: "ml-1 text-red-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}, "*")
              )

              , React.createElement('input', {
                className: "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"             ,
                type: "date",
                required: true,
                value: form.start_date,
                onChange: (e) =>
                  update(
                    "start_date",
                    e.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
              )
            )

            /* END DATE */

            , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}
              , React.createElement('label', { className: "block text-xs font-semibold text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}, "End Date"

                , React.createElement('span', { className: "ml-1 text-red-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}, "*")
              )

              , React.createElement('input', {
                className: "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"             ,
                type: "date",
                required: true,
                value: form.end_date,
                min: form.start_date || undefined,
                onChange: (e) =>
                  update(
                    "end_date",
                    e.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
              )
            )

            /* REASON */

            , React.createElement('div', { className: "space-y-1.5 md:col-span-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}
              , React.createElement('label', { className: "block text-xs font-semibold text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}, "Reason"

              )

              , React.createElement('textarea', {
                className: "min-h-[120px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"                ,
                placeholder: "Enter the reason for leave..."    ,
                value: form.reason,
                onChange: (e) =>
                  update(
                    "reason",
                    e.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}
              )
            )
          )

          /* =================================================
              FOOTER
          ================================================= */

          , React.createElement('div', { className: "flex items-center justify-between border-t border-slate-100 px-6 py-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}}

            , React.createElement(Link, {
              to: "/leave",
              className: "btn", __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}

              , React.createElement(ChevronLeft, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 324}} ), "Cancel"

            )

            , React.createElement('button', {
              type: "submit",
              disabled: saving,
              className: "btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}

              , React.createElement(Send, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}} )

              , saving
                ? "Submitting..."
                : "Submit Leave Request"
            )

          )

        )
      )
    )
  );
}