import React, { useEffect, useRef, useState } from "react";

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

import { useAuth } from "../context/AuthContext";

import api from "../services/api";

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

        setResults(response.data?.results || []);
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
    (user?.name || "U")
      .split(" ")
      .map((word) => word?.[0])
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

    navigate(item?.url || "/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="relative w-full max-w-2xl">
        <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
          <Search size={16} className="shrink-0 text-slate-400" />

          <input
            type="text"
            className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search employees, policies, documents, leave, payroll, tickets…"
          />
        </div>

        {/* =====================================================
            SEARCH RESULTS
        ===================================================== */}

        {q.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-12 z-50 max-h-96 overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            {results.length > 0 ? (
              results.map((item) => {
                const Icon = icons[item?.type] || FileText;

                return (
                  <button
                    key={`${item?.type}-${item?.id}`}
                    type="button"
                    onClick={() => handleSearchResult(item)}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon size={15} />
                    </span>

                    <span className="min-w-0">
                      <b className="block truncate text-xs text-slate-800">
                        {item?.title || "HR record"}
                      </b>

                      <small className="block truncate text-[10px] text-slate-500">
                        {item?.subtitle || ""}
                      </small>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-5 text-center text-xs text-slate-500">
                No matching HR records.
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="flex shrink-0 items-center gap-2">
        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell size={17} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        {/* ===================================================
            PROFILE MENU
        =================================================== */}

        <div className="relative" ref={profileMenuRef}>
          {/* PROFILE BUTTON */}

          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            {/* AVATAR */}

            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
              {initials}
            </span>

            {/* USER INFO */}

            <span className="hidden text-left sm:block">
              <b className="block max-w-32 truncate text-[11px] text-slate-800">
                {user?.name || "HR User"}
              </b>

              <small className="block max-w-32 truncate text-[9px] text-slate-500">
                {user?.role || "Employee"}
              </small>
            </span>

            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* =================================================
              DROPDOWN
          ================================================= */}

          {open && (
            <div
              className="absolute right-0 top-12 z-[100] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
              role="menu"
            >
              {/* ACCOUNT HEADER */}

              <div className="border-b border-slate-100 px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <b className="block truncate text-xs font-bold text-slate-800">
                      {user?.name || "HR User"}
                    </b>

                    <small className="mt-0.5 block truncate text-[10px] text-slate-500">
                      {user?.email || "No email available"}
                    </small>

                    <small className="mt-1 block text-[9px] font-semibold text-blue-600">
                      {user?.role || "Employee"}
                    </small>
                  </div>
                </div>
              </div>

              {/* =================================================
                  PROFILE
              ================================================= */}

              <button
                type="button"
                onClick={openProfile}
                role="menuitem"
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-600">
                  <UserRound size={14} />
                </span>

                <span>
                  <span className="block">Profile</span>
                  <span className="mt-0.5 block text-[9px] font-normal text-slate-400">
                    View your account profile
                  </span>
                </span>
              </button>

              {/* =================================================
                  SETTINGS
              ================================================= */}

              <button
                type="button"
                onClick={openSettings}
                role="menuitem"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-600">
                  <Settings size={14} />
                </span>

                <span>
                  <span className="block">Account & Settings</span>
                  <span className="mt-0.5 block text-[9px] font-normal text-slate-400">
                    Manage workspace settings
                  </span>
                </span>
              </button>

              {/* DIVIDER */}

              <div className="my-1 border-t border-slate-100" />

              {/* =================================================
                  LOGOUT
              ================================================= */}

              <button
                type="button"
                onClick={handleLogout}
                role="menuitem"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50">
                  <LogOut size={14} />
                </span>

                <span>
                  <span className="block">Logout</span>
                  <span className="mt-0.5 block text-[9px] font-normal text-rose-400">
                    Sign out of your account
                  </span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}