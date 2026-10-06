import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
  CalendarDays,
  Activity,
  Bot,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      await login(form);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Unable to sign in. Please verify your credentials."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-900">

      {/* =====================================================
          TOP BRAND BAR
      ====================================================== */}

      <header className="flex h-[74px] items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src="/agent-apps/hr/assets/logo.svg"
            alt="AzentMart AI"
            className="h-10 w-[170px] object-contain object-left"
          />
        </Link>

        <div className="hidden items-center gap-2 text-[10px] font-semibold text-slate-400 sm:flex">
          <ShieldCheck size={14} />
          Secure workspace
        </div>

      </header>


      {/* =====================================================
          MAIN LOGIN WORKSPACE
      ====================================================== */}

      <div className="mx-auto grid min-h-[calc(100vh-74px)] max-w-[1500px] lg:grid-cols-[0.85fr_1.15fr]">

        {/* ===================================================
            LEFT — LOGIN
        ==================================================== */}

        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">

          <div className="w-full max-w-[430px]">

            {/* Small label */}

            <div className="mb-5 flex items-center gap-2">

              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <LockKeyhole size={15} />
              </span>

              <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-blue-600">
                Secure access
              </span>

            </div>


            {/* Heading */}

            <h1 className="text-[36px] font-black leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-[42px]">
              Welcome back.
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Sign in to continue managing your people, HR workflows and
              employee operations.
            </p>


            {/* Success */}

            {location.state?.message && (
              <div className="mt-6 flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                <Check
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <p className="text-xs font-semibold text-emerald-700">
                  {location.state.message}
                </p>

              </div>
            )}


            {/* Error */}

            {error && (
              <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50 p-4">

                <p className="text-xs font-semibold leading-5 text-rose-700">
                  {error}
                </p>

              </div>
            )}


            {/* =================================================
                LOGIN FORM
            ================================================== */}

            <form
              onSubmit={submit}
              className="mt-8"
            >

              {/* Email */}

              <div>
                <label className="mb-2 block text-[11px] font-bold text-slate-700">
                  Work email
                </label>

                <div className="relative">

                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) =>
                      update("email", e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>
              </div>


              {/* Password */}

              <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-[11px] font-bold text-slate-700">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      update("password", e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3 top-1/2 grid -translate-y-1/2 place-items-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>


              {/* Security strip */}

              <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">

                <div className="flex items-center gap-2">

                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={14} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-700">
                      Protected login
                    </p>

                    <p className="text-[9px] text-slate-400">
                      Role-based HR access
                    </p>
                  </div>

                </div>

                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide text-emerald-600">
                  Secure
                </span>

              </div>


              {/* Submit */}

              <button
                type="submit"
                disabled={busy}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Signing in..." : "Continue to workspace"}

                {!busy && (
                  <ArrowRight size={17} />
                )}
              </button>

            </form>


            {/* Signup */}

            <div className="mt-7 border-t border-slate-200 pt-6 text-center">

              <p className="text-xs text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-extrabold text-blue-600 hover:text-blue-700"
                >
                  Create account
                </Link>
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            RIGHT — LIVE WORKSPACE PREVIEW
        ==================================================== */}

        <section className="relative hidden overflow-hidden border-l border-slate-200 bg-white lg:block">

          {/* Decorative background */}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.10),transparent_32%),radial-gradient(circle_at_20%_90%,rgba(99,102,241,0.07),transparent_35%)]" />

          <div className="relative flex h-full flex-col justify-center px-12 py-16 xl:px-20">

            {/* Intro */}

            <div className="mb-9 max-w-xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">

                <Sparkles
                  size={13}
                  className="text-blue-600"
                />

                <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-blue-600">
                  People Operations
                </span>

              </div>

              <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 xl:text-5xl">
                Your HR workspace,
                <span className="block text-blue-600">
                  already connected.
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-500">
                Employees, attendance, leave, onboarding, payroll,
                documents and AI support — organized in one workspace.
              </p>

            </div>


            {/* =================================================
                FAKE DASHBOARD PREVIEW
            ================================================== */}

            <div className="relative max-w-[720px]">

              {/* Main dashboard */}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_25px_70px_rgba(15,23,42,0.10)]">

                {/* Dashboard top */}

                <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                  <div>

                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-blue-600">
                      Workforce overview
                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">
                      People Operations
                    </h3>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    <span className="text-[9px] font-bold text-slate-400">
                      System operational
                    </span>

                  </div>

                </div>


                {/* Metrics */}

                <div className="mt-4 grid grid-cols-3 gap-3">

                  <Metric
                    icon={Users}
                    title="Employees"
                    value="248"
                  />

                  <Metric
                    icon={CalendarDays}
                    title="Attendance"
                    value="94%"
                  />

                  <Metric
                    icon={Activity}
                    title="Active workflows"
                    value="18"
                  />

                </div>


                {/* Activity */}

                <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_0.8fr]">

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-wide text-slate-400">
                          Workforce activity
                        </p>

                        <p className="mt-1 text-xs font-bold text-slate-800">
                          Attendance this week
                        </p>
                      </div>

                      <Activity
                        size={16}
                        className="text-blue-600"
                      />

                    </div>


                    {/* Fake graph */}

                    <div className="mt-5 flex h-20 items-end gap-2">

                      {[35, 55, 48, 72, 62, 80, 68, 91, 76, 88].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-md bg-blue-100"
                            style={{
                              height: `${height}%`,
                            }}
                          />
                        )
                      )}

                    </div>

                  </div>


                  {/* AI card */}

                  <div className="rounded-xl bg-[#0f172a] p-4 text-white">

                    <div className="flex items-center gap-2">

                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500">
                        <Bot size={15} />
                      </div>

                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-wide text-blue-300">
                          AI HR Support
                        </p>

                        <p className="text-[8px] text-slate-400">
                          Available 24/7
                        </p>
                      </div>

                    </div>

                    <p className="mt-5 text-[11px] leading-5 text-slate-300">
                      Ask about leave, attendance, policies, payroll or
                      employee processes.
                    </p>

                    <div className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-[9px] text-slate-300">
                      How can I help today?
                    </div>

                  </div>

                </div>

              </div>


              {/* Floating status card */}

              <div className="absolute -bottom-7 -left-6 hidden w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xl xl:block">

                <div className="flex items-center gap-3">

                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Check size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-800">
                      HR workflows connected
                    </p>

                    <p className="mt-0.5 text-[8px] text-slate-400">
                      Employee lifecycle is synchronized
                    </p>
                  </div>

                </div>

              </div>


              {/* Floating AI card */}

              <div className="absolute -right-5 -top-6 hidden w-48 rounded-xl border border-blue-100 bg-white p-3 shadow-xl xl:block">

                <div className="flex items-center gap-2">

                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <Bot size={14} />
                  </div>

                  <div>
                    <p className="text-[9px] font-extrabold text-slate-800">
                      AI Assistant
                    </p>

                    <p className="text-[8px] text-emerald-600">
                      Online
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* Bottom features */}

            <div className="mt-12 grid max-w-[720px] grid-cols-3 gap-5">

              <MiniFeature
                title="Employee lifecycle"
                text="From onboarding to exit"
              />

              <MiniFeature
                title="HR automation"
                text="Less manual administration"
              />

              <MiniFeature
                title="AI assistance"
                text="Instant HR guidance"
              />

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({ icon: Icon, title, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">

      <div className="flex items-center justify-between">

        <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600">
          <Icon size={13} />
        </span>

        <span className="text-lg font-black text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-3 text-[9px] font-semibold text-slate-400">
        {title}
      </p>

    </div>
  );
}


/* =========================================================
   MINI FEATURE
========================================================= */

function MiniFeature({ title, text }) {
  return (
    <div className="border-l-2 border-blue-100 pl-3">

      <p className="text-[10px] font-extrabold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-[9px] leading-4 text-slate-400">
        {text}
      </p>

    </div>
  );
}