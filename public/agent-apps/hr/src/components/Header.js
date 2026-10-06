const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/components/Header.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useRef, useState } from "react";

import {
  Bell,
  ChevronDown,
  FileText,
  LogOut,
  Search,
  Settings,
  UserRound,
  Users,
  CalendarDays,
  WalletCards,
  LifeBuoy,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.js";

import api from "../services/api.js";

const icons = {
  employee: Users,
  document: FileText,
  policy: FileText,
  leave: CalendarDays,
  attendance: CalendarDays,
  payroll: WalletCards,
  ticket: LifeBuoy,
};

export default function Header() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  const profileMenuRef = useRef(null);

  /* =========================================================
     SEARCH
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (q.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        const response = await api.get("/search", {
          params: {
            q: q.trim(),
          },
        });

        setResults(_optionalChain([response, 'access', _ => _.data, 'optionalAccess', _2 => _2.results]) || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [q]);

  /* =========================================================
     CLOSE PROFILE MENU WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* =========================================================
     INITIALS
  ========================================================= */

  const initials =
    (_optionalChain([user, 'optionalAccess', _3 => _3.name]) || "U")
      .split(" ")
      .map((word) => _optionalChain([word, 'optionalAccess', _4 => _4[0]]))
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  /* =========================================================
     PROFILE NAVIGATION
  ========================================================= */

  const openProfile = () => {
    setOpen(false);
    navigate("/settings/profile");
  };

  const openSettings = () => {
    setOpen(false);
    navigate("/settings");
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  /* =========================================================
     SEARCH RESULT NAVIGATION
  ========================================================= */

  const handleSearchResult = (item) => {
    setQ("");
    setResults([]);

    navigate(_optionalChain([item, 'optionalAccess', _5 => _5.url]) || "/dashboard");
  };

  return (
    React.createElement('header', { className: "sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
      /* =====================================================
          SEARCH
      ===================================================== */

      , React.createElement('div', { className: "relative w-full max-w-2xl"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}
        , React.createElement('div', { className: "flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
          , React.createElement(Search, { size: 16, className: "shrink-0 text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}} )

          , React.createElement('input', {
            type: "text",
            className: "w-full bg-transparent text-xs outline-none placeholder:text-slate-400"    ,
            value: q,
            onChange: (event) => setQ(event.target.value),
            placeholder: "Search employees, policies, documents, leave, payroll, tickets…"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}
          )
        )

        /* =====================================================
            SEARCH RESULTS
        ===================================================== */

        , q.trim().length >= 2 && (
          React.createElement('div', { className: "absolute left-0 right-0 top-12 z-50 max-h-96 overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}
            , results.length > 0 ? (
              results.map((item) => {
                const Icon = icons[_optionalChain([item, 'optionalAccess', _6 => _6.type])] || FileText;

                return (
                  React.createElement('button', {
                    key: `${_optionalChain([item, 'optionalAccess', _7 => _7.type])}-${_optionalChain([item, 'optionalAccess', _8 => _8.id])}`,
                    type: "button",
                    onClick: () => handleSearchResult(item),
                    className: "flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}

                    , React.createElement('span', { className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
                      , React.createElement(Icon, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}} )
                    )

                    , React.createElement('span', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                      , React.createElement('b', { className: "block truncate text-xs text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}
                        , _optionalChain([item, 'optionalAccess', _9 => _9.title]) || "HR record"
                      )

                      , React.createElement('small', { className: "block truncate text-[10px] text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                        , _optionalChain([item, 'optionalAccess', _10 => _10.subtitle]) || ""
                      )
                    )
                  )
                );
              })
            ) : (
              React.createElement('div', { className: "p-5 text-center text-xs text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}, "No matching HR records."

              )
            )
          )
        )
      )

      /* =====================================================
          RIGHT SIDE
      ===================================================== */

      , React.createElement('div', { className: "flex shrink-0 items-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}
        /* ===================================================
            NOTIFICATIONS
        =================================================== */

        , React.createElement('button', {
          type: "button",
          className: "relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"           ,
          'aria-label': "Notifications", __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}

          , React.createElement(Bell, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}} )

          , React.createElement('span', { className: "absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}} )
        )

        /* ===================================================
            PROFILE MENU
        =================================================== */

        , React.createElement('div', { className: "relative", ref: profileMenuRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}
          /* PROFILE BUTTON */

          , React.createElement('button', {
            type: "button",
            onClick: () => setOpen((previous) => !previous),
            className: "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"          ,
            'aria-expanded': open,
            'aria-haspopup': "menu", __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}

            /* AVATAR */

            , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
              , initials
            )

            /* USER INFO */

            , React.createElement('span', { className: "hidden text-left sm:block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
              , React.createElement('b', { className: "block max-w-32 truncate text-[11px] text-slate-800"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}
                , _optionalChain([user, 'optionalAccess', _11 => _11.name]) || "HR User"
              )

              , React.createElement('small', { className: "block max-w-32 truncate text-[9px] text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
                , _optionalChain([user, 'optionalAccess', _12 => _12.role]) || "Employee"
              )
            )

            , React.createElement(ChevronDown, {
              size: 14,
              className: `text-slate-400 transition-transform ${
                open ? "rotate-180" : ""
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}
            )
          )

          /* =================================================
              DROPDOWN
          ================================================= */

          , open && (
            React.createElement('div', {
              className: "absolute right-0 top-12 z-[100] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"           ,
              role: "menu", __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}

              /* ACCOUNT HEADER */

              , React.createElement('div', { className: "border-b border-slate-100 px-3 py-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}
                , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}
                  , React.createElement('div', { className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}
                    , initials
                  )

                  , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
                    , React.createElement('b', { className: "block truncate text-xs font-bold text-slate-800"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}
                      , _optionalChain([user, 'optionalAccess', _13 => _13.name]) || "HR User"
                    )

                    , React.createElement('small', { className: "mt-0.5 block truncate text-[10px] text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}
                      , _optionalChain([user, 'optionalAccess', _14 => _14.email]) || "No email available"
                    )

                    , React.createElement('small', { className: "mt-1 block text-[9px] font-semibold text-blue-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
                      , _optionalChain([user, 'optionalAccess', _15 => _15.role]) || "Employee"
                    )
                  )
                )
              )

              /* =================================================
                  PROFILE
              ================================================= */

              , React.createElement('button', {
                type: "button",
                onClick: openProfile,
                role: "menuitem",
                className: "mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}

                , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
                  , React.createElement(UserRound, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}} )
                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}
                  , React.createElement('span', { className: "block", __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}, "Profile")
                  , React.createElement('span', { className: "mt-0.5 block text-[9px] font-normal text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}, "View your account profile"

                  )
                )
              )

              /* =================================================
                  SETTINGS
              ================================================= */

              , React.createElement('button', {
                type: "button",
                onClick: openSettings,
                role: "menuitem",
                className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}

                , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}
                  , React.createElement(Settings, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}} )
                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 330}}
                  , React.createElement('span', { className: "block", __self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}, "Account & Settings"  )
                  , React.createElement('span', { className: "mt-0.5 block text-[9px] font-normal text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 332}}, "Manage workspace settings"

                  )
                )
              )

              /* DIVIDER */

              , React.createElement('div', { className: "my-1 border-t border-slate-100"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}} )

              /* =================================================
                  LOGOUT
              ================================================= */

              , React.createElement('button', {
                type: "button",
                onClick: handleLogout,
                role: "menuitem",
                className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-rose-600 transition hover:bg-rose-50"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}

                , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-lg bg-rose-50"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}
                  , React.createElement(LogOut, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}} )
                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}
                  , React.createElement('span', { className: "block", __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}, "Logout")
                  , React.createElement('span', { className: "mt-0.5 block text-[9px] font-normal text-rose-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}, "Sign out of your account"

                  )
                )
              )
            )
          )
        )
      )
    )
  );
}