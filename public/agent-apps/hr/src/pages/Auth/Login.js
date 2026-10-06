const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Auth/Login.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useState } from "react";
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

import { useAuth } from "../../context/AuthContext.js";

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
        _optionalChain([err, 'optionalAccess', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.detail]) ||
          "Unable to sign in. Please verify your credentials."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    React.createElement('main', { className: "min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}

      /* =====================================================
          TOP BRAND BAR
      ====================================================== */

      , React.createElement('header', { className: "flex h-[74px] items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}

        , React.createElement(Link, {
          to: "/",
          className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}

          , React.createElement('img', {
            src: "/agent-apps/hr/assets/logo.svg",
            alt: "AzentMart AI" ,
            className: "h-10 w-[170px] object-contain object-left"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
          )
        )

        , React.createElement('div', { className: "hidden items-center gap-2 text-[10px] font-semibold text-slate-400 sm:flex"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
          , React.createElement(ShieldCheck, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}} ), "Secure workspace"

        )

      )


      /* =====================================================
          MAIN LOGIN WORKSPACE
      ====================================================== */

      , React.createElement('div', { className: "mx-auto grid min-h-[calc(100vh-74px)] max-w-[1500px] lg:grid-cols-[0.85fr_1.15fr]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}

        /* ===================================================
            LEFT — LOGIN
        ==================================================== */

        , React.createElement('section', { className: "flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}

          , React.createElement('div', { className: "w-full max-w-[430px]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}

            /* Small label */

            , React.createElement('div', { className: "mb-5 flex items-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}

              , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}
                , React.createElement(LockKeyhole, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}} )
              )

              , React.createElement('span', { className: "text-[10px] font-extrabold uppercase tracking-[0.15em] text-blue-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, "Secure access"

              )

            )


            /* Heading */

            , React.createElement('h1', { className: "text-[36px] font-black leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-[42px]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, "Welcome back."

            )

            , React.createElement('p', { className: "mt-3 max-w-sm text-sm leading-6 text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}, "Sign in to continue managing your people, HR workflows and employee operations."


            )


            /* Success */

            , _optionalChain([location, 'access', _4 => _4.state, 'optionalAccess', _5 => _5.message]) && (
              React.createElement('div', { className: "mt-6 flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}

                , React.createElement(Check, {
                  size: 17,
                  className: "mt-0.5 shrink-0 text-emerald-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
                )

                , React.createElement('p', { className: "text-xs font-semibold text-emerald-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
                  , location.state.message
                )

              )
            )


            /* Error */

            , error && (
              React.createElement('div', { className: "mt-6 rounded-xl border border-rose-100 bg-rose-50 p-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}

                , React.createElement('p', { className: "text-xs font-semibold leading-5 text-rose-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
                  , error
                )

              )
            )


            /* =================================================
                LOGIN FORM
            ================================================== */

            , React.createElement('form', {
              onSubmit: submit,
              className: "mt-8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}


              /* Email */

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
                , React.createElement('label', { className: "mb-2 block text-[11px] font-bold text-slate-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}, "Work email"

                )

                , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}

                  , React.createElement(Mail, {
                    size: 16,
                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                  )

                  , React.createElement('input', {
                    type: "email",
                    required: true,
                    autoComplete: "email",
                    placeholder: "name@company.com",
                    value: form.email,
                    onChange: (e) =>
                      update("email", e.target.value)
                    ,
                    className: "h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                  )

                )
              )


              /* Password */

              , React.createElement('div', { className: "mt-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}

                , React.createElement('div', { className: "mb-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}

                  , React.createElement('label', { className: "text-[11px] font-bold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}, "Password"

                  )

                  , React.createElement(Link, {
                    to: "/forgot-password",
                    className: "text-[11px] font-bold text-blue-600 hover:text-blue-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}
, "Forgot password?"

                  )

                )

                , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}

                  , React.createElement(LockKeyhole, {
                    size: 16,
                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
                  )

                  , React.createElement('input', {
                    type: showPassword ? "text" : "password",
                    required: true,
                    autoComplete: "current-password",
                    placeholder: "Enter your password"  ,
                    value: form.password,
                    onChange: (e) =>
                      update("password", e.target.value)
                    ,
                    className: "h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
                  )

                  , React.createElement('button', {
                    type: "button",
                    onClick: () =>
                      setShowPassword((prev) => !prev)
                    ,
                    className: "absolute right-3 top-1/2 grid -translate-y-1/2 place-items-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}

                    , showPassword ? (
                      React.createElement(EyeOff, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}} )
                    ) : (
                      React.createElement(Eye, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}} )
                    )
                  )

                )

              )


              /* Security strip */

              , React.createElement('div', { className: "mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}

                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}

                  , React.createElement('div', { className: "grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}
                    , React.createElement(ShieldCheck, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}} )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}
                    , React.createElement('p', { className: "text-[10px] font-bold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}, "Protected login"

                    )

                    , React.createElement('p', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}, "Role-based HR access"

                    )
                  )

                )

                , React.createElement('span', { className: "rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide text-emerald-600"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}, "Secure"

                )

              )


              /* Submit */

              , React.createElement('button', {
                type: "submit",
                disabled: busy,
                className: "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}

                , busy ? "Signing in..." : "Continue to workspace"

                , !busy && (
                  React.createElement(ArrowRight, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}} )
                )
              )

            )


            /* Signup */

            , React.createElement('div', { className: "mt-7 border-t border-slate-200 pt-6 text-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}

              , React.createElement('p', { className: "text-xs text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}, "Don't have an account?"
                   , " "
                , React.createElement(Link, {
                  to: "/signup",
                  className: "font-extrabold text-blue-600 hover:text-blue-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}
, "Create account"

                )
              )

            )

          )

        )


        /* ===================================================
            RIGHT — LIVE WORKSPACE PREVIEW
        ==================================================== */

        , React.createElement('section', { className: "relative hidden overflow-hidden border-l border-slate-200 bg-white lg:block"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 330}}

          /* Decorative background */

          , React.createElement('div', { className: "absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.10),transparent_32%),radial-gradient(circle_at_20%_90%,rgba(99,102,241,0.07),transparent_35%)]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 334}} )

          , React.createElement('div', { className: "relative flex h-full flex-col justify-center px-12 py-16 xl:px-20"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 336}}

            /* Intro */

            , React.createElement('div', { className: "mb-9 max-w-xl" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}

              , React.createElement('div', { className: "mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}

                , React.createElement(Sparkles, {
                  size: 13,
                  className: "text-blue-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}
                )

                , React.createElement('span', { className: "text-[9px] font-extrabold uppercase tracking-[0.15em] text-blue-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}, "People Operations"

                )

              )

              , React.createElement('h2', { className: "text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 xl:text-5xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}, "Your HR workspace,"

                , React.createElement('span', { className: "block text-blue-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}, "already connected."

                )
              )

              , React.createElement('p', { className: "mt-4 max-w-lg text-sm leading-6 text-slate-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}, "Employees, attendance, leave, onboarding, payroll, documents and AI support — organized in one workspace."


              )

            )


            /* =================================================
                FAKE DASHBOARD PREVIEW
            ================================================== */

            , React.createElement('div', { className: "relative max-w-[720px]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}

              /* Main dashboard */

              , React.createElement('div', { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_25px_70px_rgba(15,23,42,0.10)]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}

                /* Dashboard top */

                , React.createElement('div', { className: "flex items-center justify-between border-b border-slate-100 pb-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}

                    , React.createElement('p', { className: "text-[9px] font-extrabold uppercase tracking-[0.14em] text-blue-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}, "Workforce overview"

                    )

                    , React.createElement('h3', { className: "mt-1 text-lg font-black text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}, "People Operations"

                    )

                  )

                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}

                    , React.createElement('span', { className: "h-2 w-2 rounded-full bg-emerald-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}} )

                    , React.createElement('span', { className: "text-[9px] font-bold text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}, "System operational"

                    )

                  )

                )


                /* Metrics */

                , React.createElement('div', { className: "mt-4 grid grid-cols-3 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}

                  , React.createElement(Metric, {
                    icon: Users,
                    title: "Employees",
                    value: "248", __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}
                  )

                  , React.createElement(Metric, {
                    icon: CalendarDays,
                    title: "Attendance",
                    value: "94%", __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}
                  )

                  , React.createElement(Metric, {
                    icon: Activity,
                    title: "Active workflows" ,
                    value: "18", __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}
                  )

                )


                /* Activity */

                , React.createElement('div', { className: "mt-4 grid gap-3 md:grid-cols-[1.4fr_0.8fr]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}

                  , React.createElement('div', { className: "rounded-xl border border-slate-100 bg-slate-50 p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}

                    , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 442}}
                        , React.createElement('p', { className: "text-[9px] font-extrabold uppercase tracking-wide text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 443}}, "Workforce activity"

                        )

                        , React.createElement('p', { className: "mt-1 text-xs font-bold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 447}}, "Attendance this week"

                        )
                      )

                      , React.createElement(Activity, {
                        size: 16,
                        className: "text-blue-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}
                      )

                    )


                    /* Fake graph */

                    , React.createElement('div', { className: "mt-5 flex h-20 items-end gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 462}}

                      , [35, 55, 48, 72, 62, 80, 68, 91, 76, 88].map(
                        (height, index) => (
                          React.createElement('div', {
                            key: index,
                            className: "flex-1 rounded-t-md bg-blue-100"  ,
                            style: {
                              height: `${height}%`,
                            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}
                          )
                        )
                      )

                    )

                  )


                  /* AI card */

                  , React.createElement('div', { className: "rounded-xl bg-[#0f172a] p-4 text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 483}}

                    , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 485}}

                      , React.createElement('div', { className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-500"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}}
                        , React.createElement(Bot, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 488}} )
                      )

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 491}}
                        , React.createElement('p', { className: "text-[9px] font-extrabold uppercase tracking-wide text-blue-300"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 492}}, "AI HR Support"

                        )

                        , React.createElement('p', { className: "text-[8px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}, "Available 24/7"

                        )
                      )

                    )

                    , React.createElement('p', { className: "mt-5 text-[11px] leading-5 text-slate-300"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 503}}, "Ask about leave, attendance, policies, payroll or employee processes."


                    )

                    , React.createElement('div', { className: "mt-4 rounded-lg bg-white/10 px-3 py-2 text-[9px] text-slate-300"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 508}}, "How can I help today?"

                    )

                  )

                )

              )


              /* Floating status card */

              , React.createElement('div', { className: "absolute -bottom-7 -left-6 hidden w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xl xl:block"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 521}}

                , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}

                  , React.createElement('div', { className: "grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 525}}
                    , React.createElement(Check, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 526}} )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 529}}
                    , React.createElement('p', { className: "text-[10px] font-extrabold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 530}}, "HR workflows connected"

                    )

                    , React.createElement('p', { className: "mt-0.5 text-[8px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 534}}, "Employee lifecycle is synchronized"

                    )
                  )

                )

              )


              /* Floating AI card */

              , React.createElement('div', { className: "absolute -right-5 -top-6 hidden w-48 rounded-xl border border-blue-100 bg-white p-3 shadow-xl xl:block"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 546}}

                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 548}}

                  , React.createElement('div', { className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 550}}
                    , React.createElement(Bot, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 551}} )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 554}}
                    , React.createElement('p', { className: "text-[9px] font-extrabold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 555}}, "AI Assistant"

                    )

                    , React.createElement('p', { className: "text-[8px] text-emerald-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 559}}, "Online"

                    )
                  )

                )

              )

            )


            /* Bottom features */

            , React.createElement('div', { className: "mt-12 grid max-w-[720px] grid-cols-3 gap-5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 573}}

              , React.createElement(MiniFeature, {
                title: "Employee lifecycle" ,
                text: "From onboarding to exit"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 575}}
              )

              , React.createElement(MiniFeature, {
                title: "HR automation" ,
                text: "Less manual administration"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 580}}
              )

              , React.createElement(MiniFeature, {
                title: "AI assistance" ,
                text: "Instant HR guidance"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 585}}
              )

            )

          )

        )

      )

    )
  );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({ icon: Icon, title, value }) {
  return (
    React.createElement('div', { className: "rounded-xl border border-slate-100 bg-white p-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 609}}

      , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 611}}

        , React.createElement('span', { className: "grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 613}}
          , React.createElement(Icon, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}} )
        )

        , React.createElement('span', { className: "text-lg font-black text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 617}}
          , value
        )

      )

      , React.createElement('p', { className: "mt-3 text-[9px] font-semibold text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 623}}
        , title
      )

    )
  );
}


/* =========================================================
   MINI FEATURE
========================================================= */

function MiniFeature({ title, text }) {
  return (
    React.createElement('div', { className: "border-l-2 border-blue-100 pl-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 638}}

      , React.createElement('p', { className: "text-[10px] font-extrabold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 640}}
        , title
      )

      , React.createElement('p', { className: "mt-1 text-[9px] leading-4 text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 644}}
        , text
      )

    )
  );
}