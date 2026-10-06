const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Employees/EmployeeForm.jsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { employeeService } from "../../services/employeeService.js";
import { DEPARTMENTS } from "../../utils/constants.js";

const fields = [
  ["name", "Full name", "text"],
  ["email", "Email", "email"],
  ["phone", "Phone", "text"],
  ["designation", "Role / designation", "text"],
  ["department", "Department", "select"],
  ["location", "Location", "text"],
  ["manager", "Manager", "text"],
  ["employment_type", "Employment type", "select"],
  ["join_date", "Date of joining", "date"],
  ["date_of_birth", "Date of birth", "date"],
  ["salary", "Annual salary", "number"],
  ["bank_name", "Bank name", "text"],
  ["bank_account", "Bank account", "text"],
  ["ifsc_code", "IFSC code", "text"],
];

const empty = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  department: "",
  location: "",
  manager: "",
  employment_type: "Full-time",
  join_date: "",
  date_of_birth: "",
  salary: "",
  bank_name: "",
  bank_account: "",
  ifsc_code: "",
};

export default function EmployeeForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const nav = useNavigate();
  const [f, setF] = useState(empty);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) return;
    employeeService.get(id).then((data) => {
      setF({
        ...empty,
        ...data,
        salary: _nullishCoalesce(data.salary, () => ( "")),
        join_date: _nullishCoalesce(data.join_date, () => ( "")),
        date_of_birth: _nullishCoalesce(data.date_of_birth, () => ( "")),
      });
    }).catch((x) => setErr(_optionalChain([x, 'access', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.detail]) || "Unable to load employee."));
  }, [editing, id]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const payload = {
        ...f,
        salary: f.salary === "" ? null : Number(f.salary),
        join_date: f.join_date || null,
        date_of_birth: f.date_of_birth || null,
      };
      if (editing) {
        await employeeService.update(id, payload);
      } else {
        await employeeService.create(payload);
      }
      nav(editing ? `/employees/${id}` : "/employees");
    } catch (x) {
      setErr(_optionalChain([x, 'access', _4 => _4.response, 'optionalAccess', _5 => _5.data, 'optionalAccess', _6 => _6.detail]) || "Unable to save employee.");
    } finally {
      setBusy(false);
    }
  };

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
          , React.createElement(Link, { className: "inline-flex items-center gap-2 text-xs font-bold text-slate-500"     , to: editing ? `/employees/${id}` : "/employees", __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
            , React.createElement(ArrowLeft, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}} ), " Employees"
          )
          , React.createElement('h1', { className: "mt-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}, editing ? "Edit employee" : "Add employee")
          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}, editing ? "Update the complete employee record." : "Create a complete employee record for the HR workspace.")
        )
      )

      , React.createElement('form', { onSubmit: submit, className: "card p-5 sm:p-7"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
        , err && React.createElement('div', { className: "error-box mb-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}, err)
        , React.createElement('div', { className: "form-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
          , fields.map(([key, label, type]) => (
            React.createElement('div', { className: "form-group", key: key, __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
              , React.createElement('label', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, label)
              , type === "select" ? (
                React.createElement('select', { className: "select", value: f[key] || "", onChange: (e) => setF({ ...f, [key]: e.target.value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
                  , key === "department" ? (
                    React.createElement(React.Fragment, null
                      , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}, "Select department" )
                      , DEPARTMENTS.map((x) => React.createElement('option', { key: x, __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}, x))
                    )
                  ) : (
                    ["Full-time", "Part-time", "Contract", "Intern"].map((x) => React.createElement('option', { key: x, __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}, x))
                  )
                )
              ) : (
                React.createElement('input', {
                  className: "input",
                  type: type,
                  required: ["name", "email"].includes(key),
                  value: _nullishCoalesce(f[key], () => ( "")),
                  onChange: (e) => setF({ ...f, [key]: e.target.value }), __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
                )
              )
            )
          ))
        )
        , React.createElement('div', { className: "mt-7 flex justify-end gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
          , React.createElement(Link, { className: "btn", to: editing ? `/employees/${id}` : "/employees", __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}, "Cancel")
          , React.createElement('button', { className: "btn btn-primary" , disabled: busy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
            , React.createElement(Save, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}} )
            , busy ? "Saving…" : editing ? "Save changes" : "Create employee"
          )
        )
      )
    )
  );
}
