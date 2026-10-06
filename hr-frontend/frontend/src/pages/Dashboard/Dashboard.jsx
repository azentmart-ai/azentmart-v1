import React, { useEffect, useState } from "react";

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

import api from "../../services/api";


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
        error.response?.data?.detail ||
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
    <div className="min-h-full bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">

      {/* ---------------------------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------------------------- */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              People Operations
            </span>

          </div>


          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Workforce command center
          </h1>


          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            A live view of your people, attendance, employee requests,
            onboarding and HR operations.
          </p>

        </div>


        <button
          type="button"
          onClick={loadDashboard}
          disabled={busy}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >

          <RefreshCw
            size={14}
            className={busy ? "animate-spin" : ""}
          />

          {busy ? "Refreshing..." : "Refresh data"}

        </button>

      </div>


      {/* ---------------------------------------------------- */}
      {/* ERROR */}
      {/* ---------------------------------------------------- */}

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">

          <AlertCircle size={16} />

          <span>{error}</span>

        </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* TOP KPI CARDS */}
      {/* ---------------------------------------------------- */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Total workforce"
          value={data.employees}
          subtitle={`${data.active_employees} currently active`}
          icon={Users}
          iconClass="bg-blue-50 text-blue-600"
          loading={busy}
        />


        <MetricCard
          title="Attendance today"
          value={`${attendanceRate}%`}
          subtitle={`${data.present_today} employees present`}
          icon={Clock3}
          iconClass="bg-emerald-50 text-emerald-600"
          loading={busy}
        />


        <MetricCard
          title="New joiners"
          value={data.new_joiners}
          subtitle="Recent employee additions"
          icon={UserPlus}
          iconClass="bg-violet-50 text-violet-600"
          loading={busy}
        />


        <MetricCard
          title="Pending actions"
          value={data.pending_leave + data.support_open}
          subtitle={`${data.pending_leave} leave · ${data.support_open} tickets`}
          icon={ClipboardCheck}
          iconClass="bg-amber-50 text-amber-600"
          loading={busy}
        />

      </div>


      {/* ---------------------------------------------------- */}
      {/* MAIN GRID */}
      {/* ---------------------------------------------------- */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.6fr_0.9fr]">


        {/* ------------------------------------------------ */}
        {/* LEFT COLUMN */}
        {/* ------------------------------------------------ */}

        <div className="space-y-5">


          {/* ---------------------------------------------- */}
          {/* WORKFORCE PULSE */}
          {/* ---------------------------------------------- */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={16}
                    className="text-blue-600"
                  />

                  <h2 className="text-sm font-extrabold text-slate-900">
                    Workforce pulse
                  </h2>

                </div>


                <p className="mt-1 text-[11px] text-slate-500">
                  Current operational health across your organization.
                </p>

              </div>


              <Link
                to="/reports"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
              >
                Open analytics

                <ArrowUpRight size={12} />

              </Link>

            </div>


            <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">

              <PulseItem
                label="Active workforce"
                value={`${employeeUtilization}%`}
                description="of total employees"
              />


              <PulseItem
                label="Attendance"
                value={`${attendanceRate}%`}
                description="today"
              />


              <PulseItem
                label="Onboarding"
                value={data.onboarding}
                description="active processes"
              />


              <PulseItem
                label="Documents"
                value={data.documents_pending}
                description="pending review"
              />

            </div>

          </section>


          {/* ---------------------------------------------- */}
          {/* ACTION CENTER */}
          {/* ---------------------------------------------- */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={16}
                    className="text-emerald-600"
                  />

                  <h2 className="text-sm font-extrabold text-slate-900">
                    Action center
                  </h2>

                </div>


                <p className="mt-1 text-[11px] text-slate-500">
                  Areas that may need HR attention.
                </p>

              </div>

            </div>


            <div className="grid gap-3 sm:grid-cols-2">


              <ActionCard
                title="Leave requests"
                value={data.pending_leave}
                description="Requests waiting for review"
                icon={CalendarDays}
                to="/leave"
                tone="amber"
              />


              <ActionCard
                title="HR support"
                value={data.support_open}
                description="Open employee conversations"
                icon={LifeBuoy}
                to="/support"
                tone="blue"
              />


              <ActionCard
                title="Onboarding"
                value={data.onboarding}
                description="Active onboarding workflows"
                icon={ClipboardCheck}
                to="/onboarding"
                tone="violet"
              />


              <ActionCard
                title="Documents"
                value={data.documents_pending}
                description="Documents requiring attention"
                icon={FileText}
                to="/documents"
                tone="rose"
              />

            </div>

          </section>


          {/* ---------------------------------------------- */}
          {/* RECENT ACTIVITY */}
          {/* ---------------------------------------------- */}

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">

              <div>

                <div className="flex items-center gap-2">

                  <Activity
                    size={16}
                    className="text-blue-600"
                  />

                  <h2 className="text-sm font-extrabold text-slate-900">
                    Operational feed
                  </h2>

                </div>


                <p className="mt-1 text-[11px] text-slate-500">
                  Latest activity recorded across HR operations.
                </p>

              </div>


              <Link
                to="/reports"
                className="text-[10px] font-bold text-blue-600"
              >
                View all
              </Link>

            </div>


            <div className="p-5">

              {data.recent_activity?.length ? (

                <div className="space-y-3">

                  {data.recent_activity.map((activity, index) => (

                    <div
                      key={activity.id || index}
                      className="group flex items-start gap-3 rounded-xl border border-transparent bg-slate-50 p-3 transition hover:border-blue-100 hover:bg-blue-50/50"
                    >

                      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-blue-600 shadow-sm">

                        <Activity size={14} />

                      </div>


                      <div className="min-w-0 flex-1">

                        <b className="block text-xs font-bold text-slate-800">
                          {activity.title}
                        </b>


                        <span className="mt-1 block text-[10px] leading-5 text-slate-500">
                          {activity.detail}
                        </span>

                      </div>


                      <span className="shrink-0 text-[9px] text-slate-400">
                        {activity.time}
                      </span>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="rounded-xl bg-slate-50 px-5 py-10 text-center">

                  <Activity
                    size={22}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-xs font-bold text-slate-500">
                    No recent activity
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    New HR activity will appear here automatically.
                  </p>

                </div>

              )}

            </div>

          </section>

        </div>


        {/* ------------------------------------------------ */}
        {/* RIGHT COLUMN */}
        {/* ------------------------------------------------ */}

        <div className="space-y-5">


          {/* ---------------------------------------------- */}
          {/* QUICK ACTIONS */}
          {/* ---------------------------------------------- */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-sm font-extrabold text-slate-900">
                  Quick actions
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  Frequently used HR workflows.
                </p>

              </div>

              <BriefcaseBusiness
                size={17}
                className="text-blue-600"
              />

            </div>


            <div className="mt-4 grid grid-cols-2 gap-2">

              <QuickAction
                title="Add employee"
                to="/employees/new"
                icon={Users}
              />


              <QuickAction
                title="Review leave"
                to="/leave"
                icon={CalendarDays}
              />


              <QuickAction
                title="Onboarding"
                to="/onboarding"
                icon={ClipboardCheck}
              />


              <QuickAction
                title="Payroll"
                to="/payroll"
                icon={WalletCards}
              />


              <QuickAction
                title="Documents"
                to="/documents"
                icon={FileText}
              />


              <QuickAction
                title="HR Support"
                to="/support"
                icon={LifeBuoy}
              />

            </div>

          </section>


          {/* ---------------------------------------------- */}
          {/* PAYROLL SNAPSHOT */}
          {/* ---------------------------------------------- */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <WalletCards
                    size={16}
                    className="text-emerald-600"
                  />

                  <h2 className="text-sm font-extrabold text-slate-900">
                    Payroll snapshot
                  </h2>

                </div>


                <p className="mt-1 text-[10px] text-slate-500">
                  Current payroll value from your HR database.
                </p>

              </div>

            </div>


            <div className="mt-5 rounded-2xl bg-slate-900 p-5 text-white">

              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Current payroll
              </span>


              <div className="mt-2 text-2xl font-black tracking-tight">
                ₹ {payrollValue.toLocaleString("en-IN")}
              </div>


              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">

                <span className="text-[10px] text-slate-400">
                  Payroll records
                </span>


                <Link
                  to="/payroll"
                  className="flex items-center gap-1 text-[10px] font-bold text-white"
                >
                  Open payroll

                  <ChevronRight size={12} />

                </Link>

              </div>

            </div>

          </section>


          {/* ---------------------------------------------- */}
          {/* PEOPLE MOMENTS */}
          {/* ---------------------------------------------- */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-2">

              <Cake
                size={16}
                className="text-pink-500"
              />

              <div>

                <h2 className="text-sm font-extrabold text-slate-900">
                  People moments
                </h2>

                <p className="mt-1 text-[10px] text-slate-500">
                  Upcoming employee milestones.
                </p>

              </div>

            </div>


            <div className="mt-4 space-y-2">

              {data.birthdays?.length ? (

                data.birthdays.map((person) => (

                  <div
                    key={person.id}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                  >

                    <div className="grid h-8 w-8 place-items-center rounded-full bg-pink-50 text-pink-600">

                      <Cake size={14} />

                    </div>


                    <div className="flex-1">

                      <p className="text-xs font-bold text-slate-800">
                        {person.name}
                      </p>

                      <span className="text-[10px] text-slate-400">
                        Birthday
                      </span>

                    </div>

                  </div>

                ))

              ) : (

                <div className="rounded-xl bg-slate-50 p-5 text-center">

                  <Cake
                    size={20}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-[10px] font-semibold text-slate-500">
                    No upcoming milestones
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Employee birthdays and anniversaries will appear here.
                  </p>

                </div>

              )}

            </div>

          </section>


          {/* ---------------------------------------------- */}
          {/* HR STATUS */}
          {/* ---------------------------------------------- */}

          <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">

            <div className="flex items-start gap-3">

              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">

                <CheckCircle2 size={17} />

              </div>


              <div>

                <h3 className="text-xs font-extrabold text-slate-900">
                  HR operations are connected
                </h3>


                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  Dashboard metrics are retrieved from your backend HR
                  services and PostgreSQL data rather than static dashboard
                  values.
                </p>

              </div>

            </div>

          </section>

        </div>

      </div>

    </div>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} />
        </div>


        <ArrowUpRight
          size={14}
          className="text-slate-300"
        />

      </div>


      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {title}
      </p>


      <div className="mt-1 text-2xl font-black tracking-tight text-slate-900">

        {loading ? "—" : value}

      </div>


      <p className="mt-1 text-[10px] text-slate-500">
        {subtitle}
      </p>

    </div>
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
    <div className="p-5">

      <span className="text-[10px] font-semibold text-slate-400">
        {label}
      </span>


      <b className="mt-2 block text-xl font-black tracking-tight text-slate-900">
        {value}
      </b>


      <span className="mt-1 block text-[9px] text-slate-400">
        {description}
      </span>

    </div>
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
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
    >

      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}
      >
        <Icon size={15} />
      </div>


      <div className="min-w-0 flex-1">

        <p className="text-xs font-bold text-slate-800">
          {title}
        </p>


        <p className="mt-1 text-[9px] leading-4 text-slate-400">
          {description}
        </p>

      </div>


      <div className="text-right">

        <b className="block text-sm font-black text-slate-900">
          {value}
        </b>


        <ChevronRight
          size={12}
          className="ml-auto mt-1 text-slate-300 transition group-hover:text-blue-500"
        />

      </div>

    </Link>
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
    <Link
      to={to}
      className="flex min-h-[72px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50"
    >

      <Icon
        size={15}
        className="text-blue-600"
      />


      <span className="text-[10px] font-bold text-slate-700">
        {title}
      </span>

    </Link>
  );
}