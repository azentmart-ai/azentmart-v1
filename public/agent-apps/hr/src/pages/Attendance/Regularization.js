const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Attendance/Regularization.jsx";import React, { useState } from "react";
import { attendanceService } from "../../services/attendanceService.js";
export default function Regularization() {
  const [form, setForm] = useState({
    date: "",
    reason: ""
  });
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    const result = await attendanceService.regularize(form);
    setMessage(result.message);
  };

  return (
    React.createElement('div', { className: "page page-section" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}, "Attendance regularization" )
          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, "Submit a correction request for an attendance record."       )
        )
      )

      , React.createElement('div', { className: "card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
        , message ? React.createElement('div', { className: "auth-success", __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}, message) : null

        , React.createElement('form', { className: "form-grid", onSubmit: submit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
          , React.createElement('div', { className: "form-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
            , React.createElement('label', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}, "Date")
            , React.createElement('input', {
              className: "input",
              type: "date",
              required: true,
              value: form.date,
              onChange: (event) =>
                setForm({
                  ...form,
                  date: event.target.value
                })
              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}
            )
          )

          , React.createElement('div', { className: "form-group full" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
            , React.createElement('label', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}, "Reason")
            , React.createElement('textarea', {
              className: "textarea",
              required: true,
              value: form.reason,
              onChange: (event) =>
                setForm({
                  ...form,
                  reason: event.target.value
                })
              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}
            )
          )

          , React.createElement('button', { className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}, "Submit request"

          )
        )
      )
    )
  );
}
