const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/components/StatCard.jsx";import React from "react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  tone = "blue"
}) {
  return (
    React.createElement('div', { className: `stat-card stat-${tone}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}
      , React.createElement('div', { className: "stat-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
        , React.createElement(Icon, { size: 20, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}} )
      )
      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}, label)
        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}, value)
        , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}, trend)
      )
    )
  );
}
