const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Dashboard/Dashboard.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useState } from "react";

import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileText,
  LifeBuoy,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  Cake,
  UserPlus,
  AlertCircle,
  BriefcaseBusiness,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api.js";


const initial = {
  employees: 0,
  active_employees: 0,
  new_joiners: 0,
  present_today: 0,
  attendance_rate: 0,
  pending_leave: 0,
  onboarding: 0,
  payroll_total: 0,
  support_open: 0,
  documents_pending: 0,
  recent_activity: [],
  birthdays: [],
  anniversaries: [],
};


export default function Dashboard() {
  const [data, setData] = useState(initial);

  const [busy, setBusy] = useState(true);

  const [error, setError] = useState("");


  const loadDashboard = async () => {
    setBusy(true);

    try {
      const response = await api.get("/reports/dashboard");

      setData({
        ...initial,
        ...response.data,
      });

      setError("");
    } catch (error) {
      setError(
        _optionalChain([error, 'access', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.detail]) ||
          "Unable to load dashboard information."
      );
    } finally {
      setBusy(false);
    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);


  const employeeUtilization =
    data.employees > 0
      ? Math.round((data.active_employees / data.employees) * 100)
      : 0;


  const attendanceRate = Number(data.attendance_rate || 0);


  const payrollValue = Number(data.payroll_total || 0);


  return (
    React.createElement('div', { className: "min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}

      /* ---------------------------------------------------- */
      /* HEADER */
      /* ---------------------------------------------------- */

      , React.createElement('div', { className: "mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}

          , React.createElement('div', { className: "mb-2 flex items-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}

            , React.createElement('span', { className: "h-2 w-2 rounded-full bg-emerald-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}} )

            , React.createElement('span', { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}, "People Operations"

            )

          )


          , React.createElement('h1', { className: "text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}, "Workforce command center"

          )


          , React.createElement('p', { className: "mt-2 max-w-2xl text-sm leading-6 text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "A live view of your people, attendance, employee requests, onboarding and HR operations."


          )

        )


        , React.createElement('button', {
          type: "button",
          onClick: loadDashboard,
          disabled: busy,
          className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"                   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}


          , React.createElement(RefreshCw, {
            size: 14,
            className: busy ? "animate-spin" : "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
          )

          , busy ? "Refreshing..." : "Refresh data"

        )

      )


      /* ---------------------------------------------------- */
      /* ERROR */
      /* ---------------------------------------------------- */

      , error && (
        React.createElement('div', { className: "mb-5 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}

          , React.createElement(AlertCircle, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}} )

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}, error)

        )
      )


      /* ---------------------------------------------------- */
      /* TOP KPI CARDS */
      /* ---------------------------------------------------- */

      , React.createElement('div', { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}

        , React.createElement(MetricCard, {
          title: "Total workforce" ,
          value: data.employees,
          subtitle: `${data.active_employees} currently active`,
          icon: Users,
          iconClass: "bg-blue-50 text-blue-600" ,
          loading: busy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}
        )


        , React.createElement(MetricCard, {
          title: "Attendance today" ,
          value: `${attendanceRate}%`,
          subtitle: `${data.present_today} employees present`,
          icon: Clock3,
          iconClass: "bg-emerald-50 text-emerald-600" ,
          loading: busy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
        )


        , React.createElement(MetricCard, {
          title: "New joiners" ,
          value: data.new_joiners,
          subtitle: "Recent employee additions"  ,
          icon: UserPlus,
          iconClass: "bg-violet-50 text-violet-600" ,
          loading: busy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
        )


        , React.createElement(MetricCard, {
          title: "Pending actions" ,
          value: data.pending_leave + data.support_open,
          subtitle: `${data.pending_leave} leave · ${data.support_open} tickets`,
          icon: ClipboardCheck,
          iconClass: "bg-amber-50 text-amber-600" ,
          loading: busy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}
        )

      )


      /* ---------------------------------------------------- */
      /* MAIN GRID */
      /* ---------------------------------------------------- */

      , React.createElement('div', { className: "mt-5 grid gap-5 xl:grid-cols-[1.6fr_0.9fr]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}


        /* ------------------------------------------------ */
        /* LEFT COLUMN */
        /* ------------------------------------------------ */

        , React.createElement('div', { className: "space-y-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}


          /* ---------------------------------------------- */
          /* WORKFORCE PULSE */
          /* ---------------------------------------------- */

          , React.createElement('section', { className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}

            , React.createElement('div', { className: "flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}

                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}

                  , React.createElement(Sparkles, {
                    size: 16,
                    className: "text-blue-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
                  )

                  , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}, "Workforce pulse"

                  )

                )


                , React.createElement('p', { className: "mt-1 text-[11px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}, "Current operational health across your organization."

                )

              )


              , React.createElement(Link, {
                to: "/reports",
                className: "inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
, "Open analytics"


                , React.createElement(ArrowUpRight, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}} )

              )

            )


            , React.createElement('div', { className: "grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}

              , React.createElement(PulseItem, {
                label: "Active workforce" ,
                value: `${employeeUtilization}%`,
                description: "of total employees"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
              )


              , React.createElement(PulseItem, {
                label: "Attendance",
                value: `${attendanceRate}%`,
                description: "today", __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
              )


              , React.createElement(PulseItem, {
                label: "Onboarding",
                value: data.onboarding,
                description: "active processes" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
              )


              , React.createElement(PulseItem, {
                label: "Documents",
                value: data.documents_pending,
                description: "pending review" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}
              )

            )

          )


          /* ---------------------------------------------- */
          /* ACTION CENTER */
          /* ---------------------------------------------- */

          , React.createElement('section', { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}

            , React.createElement('div', { className: "mb-5 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}

                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}

                  , React.createElement(ShieldCheck, {
                    size: 16,
                    className: "text-emerald-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}
                  )

                  , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}, "Action center"

                  )

                )


                , React.createElement('p', { className: "mt-1 text-[11px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}, "Areas that may need HR attention."

                )

              )

            )


            , React.createElement('div', { className: "grid gap-3 sm:grid-cols-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 336}}


              , React.createElement(ActionCard, {
                title: "Leave requests" ,
                value: data.pending_leave,
                description: "Requests waiting for review"   ,
                icon: CalendarDays,
                to: "/leave",
                tone: "amber", __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
              )


              , React.createElement(ActionCard, {
                title: "HR support" ,
                value: data.support_open,
                description: "Open employee conversations"  ,
                icon: LifeBuoy,
                to: "/support",
                tone: "blue", __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}
              )


              , React.createElement(ActionCard, {
                title: "Onboarding",
                value: data.onboarding,
                description: "Active onboarding workflows"  ,
                icon: ClipboardCheck,
                to: "/onboarding",
                tone: "violet", __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}}
              )


              , React.createElement(ActionCard, {
                title: "Documents",
                value: data.documents_pending,
                description: "Documents requiring attention"  ,
                icon: FileText,
                to: "/documents",
                tone: "rose", __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}
              )

            )

          )


          /* ---------------------------------------------- */
          /* RECENT ACTIVITY */
          /* ---------------------------------------------- */

          , React.createElement('section', { className: "rounded-2xl border border-slate-200 bg-white shadow-sm"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}

            , React.createElement('div', { className: "flex items-center justify-between border-b border-slate-100 p-5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}

                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 393}}

                  , React.createElement(Activity, {
                    size: 16,
                    className: "text-blue-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}
                  )

                  , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}, "Operational feed"

                  )

                )


                , React.createElement('p', { className: "mt-1 text-[11px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}, "Latest activity recorded across HR operations."

                )

              )


              , React.createElement(Link, {
                to: "/reports",
                className: "text-[10px] font-bold text-blue-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}
, "View all"

              )

            )


            , React.createElement('div', { className: "p-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}

              , _optionalChain([data, 'access', _4 => _4.recent_activity, 'optionalAccess', _5 => _5.length]) ? (

                React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 428}}

                  , data.recent_activity.map((activity, index) => (

                    React.createElement('div', {
                      key: activity.id || index,
                      className: "group flex items-start gap-3 rounded-xl border border-transparent bg-slate-50 p-3 transition hover:border-blue-100 hover:bg-blue-50/50"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 432}}


                      , React.createElement('div', { className: "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-blue-600 shadow-sm"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}

                        , React.createElement(Activity, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}} )

                      )


                      , React.createElement('div', { className: "min-w-0 flex-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 444}}

                        , React.createElement('b', { className: "block text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 446}}
                          , activity.title
                        )


                        , React.createElement('span', { className: "mt-1 block text-[10px] leading-5 text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}
                          , activity.detail
                        )

                      )


                      , React.createElement('span', { className: "shrink-0 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}
                        , activity.time
                      )

                    )

                  ))

                )

              ) : (

                React.createElement('div', { className: "rounded-xl bg-slate-50 px-5 py-10 text-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 470}}

                  , React.createElement(Activity, {
                    size: 22,
                    className: "mx-auto text-slate-300" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}
                  )

                  , React.createElement('p', { className: "mt-3 text-xs font-bold text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 477}}, "No recent activity"

                  )

                  , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 481}}, "New HR activity will appear here automatically."

                  )

                )

              )

            )

          )

        )


        /* ------------------------------------------------ */
        /* RIGHT COLUMN */
        /* ------------------------------------------------ */

        , React.createElement('div', { className: "space-y-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}


          /* ---------------------------------------------- */
          /* QUICK ACTIONS */
          /* ---------------------------------------------- */

          , React.createElement('section', { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 507}}

            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 509}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 511}}

                , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 513}}, "Quick actions"

                )

                , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 517}}, "Frequently used HR workflows."

                )

              )

              , React.createElement(BriefcaseBusiness, {
                size: 17,
                className: "text-blue-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}
              )

            )


            , React.createElement('div', { className: "mt-4 grid grid-cols-2 gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}

              , React.createElement(QuickAction, {
                title: "Add employee" ,
                to: "/employees/new",
                icon: Users, __self: this, __source: {fileName: _jsxFileName, lineNumber: 533}}
              )


              , React.createElement(QuickAction, {
                title: "Review leave" ,
                to: "/leave",
                icon: CalendarDays, __self: this, __source: {fileName: _jsxFileName, lineNumber: 540}}
              )


              , React.createElement(QuickAction, {
                title: "Onboarding",
                to: "/onboarding",
                icon: ClipboardCheck, __self: this, __source: {fileName: _jsxFileName, lineNumber: 547}}
              )


              , React.createElement(QuickAction, {
                title: "Payroll",
                to: "/payroll",
                icon: WalletCards, __self: this, __source: {fileName: _jsxFileName, lineNumber: 554}}
              )


              , React.createElement(QuickAction, {
                title: "Documents",
                to: "/documents",
                icon: FileText, __self: this, __source: {fileName: _jsxFileName, lineNumber: 561}}
              )


              , React.createElement(QuickAction, {
                title: "HR Support" ,
                to: "/support",
                icon: LifeBuoy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 568}}
              )

            )

          )


          /* ---------------------------------------------- */
          /* PAYROLL SNAPSHOT */
          /* ---------------------------------------------- */

          , React.createElement('section', { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 583}}

            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 585}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 587}}

                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 589}}

                  , React.createElement(WalletCards, {
                    size: 16,
                    className: "text-emerald-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 591}}
                  )

                  , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 596}}, "Payroll snapshot"

                  )

                )


                , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 603}}, "Current payroll value from your HR database."

                )

              )

            )


            , React.createElement('div', { className: "mt-5 rounded-2xl bg-slate-900 p-5 text-white"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 612}}

              , React.createElement('span', { className: "text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}}, "Current payroll"

              )


              , React.createElement('div', { className: "mt-2 text-2xl font-black tracking-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 619}}, "₹ "
                 , payrollValue.toLocaleString("en-IN")
              )


              , React.createElement('div', { className: "mt-4 flex items-center justify-between border-t border-white/10 pt-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 624}}

                , React.createElement('span', { className: "text-[10px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 626}}, "Payroll records"

                )


                , React.createElement(Link, {
                  to: "/payroll",
                  className: "flex items-center gap-1 text-[10px] font-bold text-white"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 631}}
, "Open payroll"


                  , React.createElement(ChevronRight, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 637}} )

                )

              )

            )

          )


          /* ---------------------------------------------- */
          /* PEOPLE MOMENTS */
          /* ---------------------------------------------- */

          , React.createElement('section', { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 652}}

            , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 654}}

              , React.createElement(Cake, {
                size: 16,
                className: "text-pink-500", __self: this, __source: {fileName: _jsxFileName, lineNumber: 656}}
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 661}}

                , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 663}}, "People moments"

                )

                , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 667}}, "Upcoming employee milestones."

                )

              )

            )


            , React.createElement('div', { className: "mt-4 space-y-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 676}}

              , _optionalChain([data, 'access', _6 => _6.birthdays, 'optionalAccess', _7 => _7.length]) ? (

                data.birthdays.map((person) => (

                  React.createElement('div', {
                    key: person.id,
                    className: "flex items-center gap-3 rounded-xl bg-slate-50 p-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 682}}


                    , React.createElement('div', { className: "grid h-8 w-8 place-items-center rounded-full bg-pink-50 text-pink-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 687}}

                      , React.createElement(Cake, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 689}} )

                    )


                    , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 694}}

                      , React.createElement('p', { className: "text-xs font-bold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 696}}
                        , person.name
                      )

                      , React.createElement('span', { className: "text-[10px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 700}}, "Birthday"

                      )

                    )

                  )

                ))

              ) : (

                React.createElement('div', { className: "rounded-xl bg-slate-50 p-5 text-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 712}}

                  , React.createElement(Cake, {
                    size: 20,
                    className: "mx-auto text-slate-300" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 714}}
                  )

                  , React.createElement('p', { className: "mt-2 text-[10px] font-semibold text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 719}}, "No upcoming milestones"

                  )

                  , React.createElement('p', { className: "mt-1 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 723}}, "Employee birthdays and anniversaries will appear here."

                  )

                )

              )

            )

          )


          /* ---------------------------------------------- */
          /* HR STATUS */
          /* ---------------------------------------------- */

          , React.createElement('section', { className: "rounded-2xl border border-blue-100 bg-blue-50/60 p-5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 740}}

            , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 742}}

              , React.createElement('div', { className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 744}}

                , React.createElement(CheckCircle2, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 746}} )

              )


              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 751}}

                , React.createElement('h3', { className: "text-xs font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 753}}, "HR operations are connected"

                )


                , React.createElement('p', { className: "mt-1 text-[10px] leading-5 text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 758}}, "Dashboard metrics are retrieved from your backend HR services and PostgreSQL data rather than static dashboard values."



                )

              )

            )

          )

        )

      )

    )
  );
}


/* ========================================================= */
/* METRIC CARD */
/* ========================================================= */

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  loading,
}) {
  return (
    React.createElement('div', { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 792}}

      , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 794}}

        , React.createElement('div', {
          className: `grid h-10 w-10 place-items-center rounded-xl ${iconClass}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 796}}

          , React.createElement(Icon, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 799}} )
        )


        , React.createElement(ArrowUpRight, {
          size: 14,
          className: "text-slate-300", __self: this, __source: {fileName: _jsxFileName, lineNumber: 803}}
        )

      )


      , React.createElement('p', { className: "mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 811}}
        , title
      )


      , React.createElement('div', { className: "mt-1 text-2xl font-black tracking-tight text-slate-900"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 816}}

        , loading ? "—" : value

      )


      , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 823}}
        , subtitle
      )

    )
  );
}


/* ========================================================= */
/* PULSE ITEM */
/* ========================================================= */

function PulseItem({
  label,
  value,
  description,
}) {
  return (
    React.createElement('div', { className: "p-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 842}}

      , React.createElement('span', { className: "text-[10px] font-semibold text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 844}}
        , label
      )


      , React.createElement('b', { className: "mt-2 block text-xl font-black tracking-tight text-slate-900"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 849}}
        , value
      )


      , React.createElement('span', { className: "mt-1 block text-[9px] text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 854}}
        , description
      )

    )
  );
}


/* ========================================================= */
/* ACTION CARD */
/* ========================================================= */

function ActionCard({
  title,
  value,
  description,
  icon: Icon,
  to,
  tone,
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600",
  };


  return (
    React.createElement(Link, {
      to: to,
      className: "group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 884}}


      , React.createElement('div', {
        className: `grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 889}}

        , React.createElement(Icon, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 892}} )
      )


      , React.createElement('div', { className: "min-w-0 flex-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 896}}

        , React.createElement('p', { className: "text-xs font-bold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 898}}
          , title
        )


        , React.createElement('p', { className: "mt-1 text-[9px] leading-4 text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 903}}
          , description
        )

      )


      , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 910}}

        , React.createElement('b', { className: "block text-sm font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 912}}
          , value
        )


        , React.createElement(ChevronRight, {
          size: 12,
          className: "ml-auto mt-1 text-slate-300 transition group-hover:text-blue-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 917}}
        )

      )

    )
  );
}


/* ========================================================= */
/* QUICK ACTION */
/* ========================================================= */

function QuickAction({
  title,
  to,
  icon: Icon,
}) {
  return (
    React.createElement(Link, {
      to: to,
      className: "flex min-h-[72px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 939}}


      , React.createElement(Icon, {
        size: 15,
        className: "text-blue-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 944}}
      )


      , React.createElement('span', { className: "text-[10px] font-bold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 950}}
        , title
      )

    )
  );
}