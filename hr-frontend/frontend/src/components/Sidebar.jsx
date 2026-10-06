import React from "react";

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

import { useAuth } from "../context/AuthContext";

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
    (user?.name || "HR")
      .split(" ")
      .map((word) => word?.[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "HR";

  return (
    <aside
      className="
        hidden
        lg:flex
        lg:w-64
        lg:flex-shrink-0
        lg:flex-col
        lg:h-screen
        lg:min-h-0
        lg:overflow-hidden
        lg:border-r
        lg:border-slate-200
        lg:bg-white
      "
    >
      {/* ======================================================
          USER / WORKSPACE HEADER

          The old AzentMart branding header has been removed.
      ====================================================== */}

      <div className="flex-shrink-0 px-4 pt-4">
        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-3
            py-3
          "
        >
          {/* Avatar */}

          <div
            className="
              grid
              h-10
              w-10
              flex-shrink-0
              place-items-center
              rounded-full
              bg-blue-600
              text-xs
              font-bold
              text-white
            "
          >
            {initials}
          </div>

          {/* User information */}

          <div className="min-w-0">
            <p
              className="
                m-0
                truncate
                text-[12px]
                font-bold
                leading-5
                text-slate-900
              "
            >
              {user?.name || "HR User"}
            </p>

            <p
              className="
                m-0
                truncate
                text-[10px]
                font-medium
                leading-4
                text-slate-500
              "
            >
              {user?.role || "HR"}
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          NAVIGATION

          No overflow-y-auto.
          No internal scrollbar.
      ====================================================== */}

      <nav
        className="
          flex
          min-h-0
          flex-1
          flex-col
          overflow-hidden
          px-3
          pt-5
        "
      >
        {groups.map((group) => (
          <div
            key={group.label}
            className="mb-5 flex-shrink-0"
          >
            {/* Section title */}

            <p
              className="
                mb-1
                px-3
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-slate-400
              "
            >
              {group.label}
            </p>

            {/* Navigation links */}

            <div>
              {group.items.map(([to, label, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
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
                  }
                >
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                    className="flex-shrink-0"
                  />

                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ======================================================
          BOTTOM WORKSPACE CARD

          Always stays at bottom.
      ====================================================== */}

      <div className="flex-shrink-0 border-t border-slate-100 p-4">
        <div
          className="
            rounded-xl
            border
            border-blue-100
            bg-blue-50
            px-3
            py-3
          "
        >
          <p
            className="
              m-0
              text-[10px]
              font-bold
              text-blue-700
            "
          >
            HR workspace
          </p>

          <p
            className="
              m-0
              mt-1
              text-[9px]
              leading-4
              text-slate-500
            "
          >
            All HR operations are available from the modules above.
          </p>
        </div>
      </div>
    </aside>
  );
}