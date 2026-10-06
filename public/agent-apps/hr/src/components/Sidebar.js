const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/components/Sidebar.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React from "react";

import { NavLink } from "react-router-dom";

import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  Home,
  LifeBuoy,
  Settings2,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.js";

/* ============================================================
   SIDEBAR NAVIGATION
============================================================ */

const groups = [
  {
    label: "Workspace",
    items: [
      ["/dashboard", "Dashboard", Home],
      ["/employees", "Employees", Users],
      ["/onboarding", "Onboarding", ClipboardCheck],
      ["/attendance", "Attendance", CalendarDays],
      ["/leave", "Leave", CalendarDays],
    ],
  },
  {
    label: "People services",
    items: [
      ["/documents", "Documents", FileText],
      ["/policies", "Policies", ShieldCheck],
      ["/benefits", "Benefits", WalletCards],
      ["/payroll", "Payroll", CreditCard],
      ["/support", "HR Support", LifeBuoy],
    ],
  },
  {
    label: "Administration",
    items: [
      ["/reports", "Reports", BarChart3],
      ["/settings", "Settings", Settings2],
    ],
  },
];

/* ============================================================
   SIDEBAR
============================================================ */

export default function Sidebar() {
  const { user } = useAuth();

  const initials =
    (_optionalChain([user, 'optionalAccess', _ => _.name]) || "HR")
      .split(" ")
      .map((word) => _optionalChain([word, 'optionalAccess', _2 => _2[0]]))
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "HR";

  return (
    React.createElement('aside', {
      className: " hidden lg:flex lg:w-64 lg:flex-shrink-0 lg:flex-col lg:h-screen lg:min-h-0 lg:overflow-hidden lg:border-r lg:border-slate-200 lg:bg-white "











      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}

      /* ======================================================
          USER / WORKSPACE HEADER

          The old AzentMart branding header has been removed.
      ====================================================== */

      , React.createElement('div', { className: "flex-shrink-0 px-4 pt-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
        , React.createElement('div', {
          className: " flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 "









          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}

          /* Avatar */

          , React.createElement('div', {
            className: " grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white "










            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}

            , initials
          )

          /* User information */

          , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
            , React.createElement('p', {
              className: " m-0 truncate text-[12px] font-bold leading-5 text-slate-900 "






              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}

              , _optionalChain([user, 'optionalAccess', _3 => _3.name]) || "HR User"
            )

            , React.createElement('p', {
              className: " m-0 truncate text-[10px] font-medium leading-4 text-slate-500 "






              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}

              , _optionalChain([user, 'optionalAccess', _4 => _4.role]) || "HR"
            )
          )
        )
      )

      /* ======================================================
          NAVIGATION

          No overflow-y-auto.
          No internal scrollbar.
      ====================================================== */

      , React.createElement('nav', {
        className: " flex min-h-0 flex-1 flex-col overflow-hidden px-3 pt-5 "







        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}

        , groups.map((group) => (
          React.createElement('div', {
            key: group.label,
            className: "mb-5 flex-shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}

            /* Section title */

            , React.createElement('p', {
              className: " mb-1 px-3 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400 "







              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}

              , group.label
            )

            /* Navigation links */

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}
              , group.items.map(([to, label, Icon]) => (
                React.createElement(NavLink, {
                  key: to,
                  to: to,
                  className: ({ isActive }) =>
                    `
                    mb-1
                    flex
                    h-9
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    text-xs
                    font-semibold
                    transition-all
                    duration-150
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                    `
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 201}}

                  , React.createElement(Icon, {
                    size: 16,
                    strokeWidth: 1.8,
                    className: "flex-shrink-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}
                  )

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}, label)
                )
              ))
            )
          )
        ))
      )

      /* ======================================================
          BOTTOM WORKSPACE CARD

          Always stays at bottom.
      ====================================================== */

      , React.createElement('div', { className: "flex-shrink-0 border-t border-slate-100 p-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}
        , React.createElement('div', {
          className: " rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 "






          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}

          , React.createElement('p', {
            className: " m-0 text-[10px] font-bold text-blue-700 "




            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
, "HR workspace"

          )

          , React.createElement('p', {
            className: " m-0 mt-1 text-[9px] leading-4 text-slate-500 "





            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}
, "All HR operations are available from the modules above."

          )
        )
      )
    )
  );
}