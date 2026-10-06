const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Attendance/MyAttendance.jsx";import React from "react";
import { Link } from "react-router-dom";
export default function MyAttendance() {
  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5}}
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7}}
          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}, "My attendance" )
          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}, "Review your personal attendance history."    )
        )

        , React.createElement(Link, { className: "btn", to: "/attendance/regularization", __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}, "Request regularization"

        )
      )

      , React.createElement('div', { className: "card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
        , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}, "This month" )
        , React.createElement('div', { className: "grid grid-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
            , React.createElement('span', { className: "muted", __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}, "Present")
            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, "20 days" )
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
            , React.createElement('span', { className: "muted", __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "Remote")
            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}, "3 days" )
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
            , React.createElement('span', { className: "muted", __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}, "Absent")
            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}, "0 days" )
          )
        )
      )
    )
  );
}
