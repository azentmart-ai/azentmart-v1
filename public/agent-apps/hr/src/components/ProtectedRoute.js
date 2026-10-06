const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/components/ProtectedRoute.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

const HR_ROLES = new Set(["hr_admin", "hr_manager", "admin"]);

export default function ProtectedRoute({ children }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return React.createElement('div', { className: "loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}, "Checking your HR session..."   );
  }

  if (!token) {
    return React.createElement(Navigate, { to: "/login", replace: true, state: { from: location.pathname }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}} );
  }

  if (!HR_ROLES.has(_optionalChain([user, 'optionalAccess', _ => _.role]))) {
    return React.createElement(Navigate, { to: "/login", replace: true, state: { message: "Only authorized HR users can access this workspace." }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}} );
  }

  return children;
}
