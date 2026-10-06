const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Auth/Signup.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
  CalendarDays,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.js";
export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "HR account created successfully. Please sign in.",
        },
      });
    } catch (err) {
      setError(
        _optionalChain([err, 'optionalAccess', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.detail]) ||
          "Unable to create HR account. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    React.createElement('div', { className: "signup-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}

      /* =====================================================
          HEADER
      ===================================================== */

      , React.createElement('header', { className: "signup-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
        , React.createElement('div', { className: "signup-header-inner", __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}

          , React.createElement(Link, { to: "/", className: "signup-brand", __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}

            , React.createElement('img', {
              src: "/agent-apps/hr/assets/logo.svg",
              alt: "AzentMart AI" ,
              className: "signup-brand-logo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}
            )

          )

          , React.createElement('div', { className: "signup-header-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}

            , React.createElement(ShieldCheck, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}} )

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, "Secure workspace"

            )

          )

        )
      )


      /* =====================================================
          MAIN
      ===================================================== */

      , React.createElement('main', { className: "signup-main", __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}

        /* ===================================================
            LEFT SIDE
        =================================================== */

        , React.createElement('section', { className: "signup-left", __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}

          , React.createElement('div', { className: "signup-form-wrapper", __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}

            , React.createElement('div', { className: "signup-eyebrow", __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
              , React.createElement(Users, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}} ), "PEOPLE OPERATIONS"

            )

            , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}, "Create your"

              , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 138}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, "HR workspace." )
            )

            , React.createElement('p', { className: "signup-intro", __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}, "Set up your account to manage employees, attendance, leave, onboarding and everyday HR operations in one connected workspace."



            )


            /* FORM */

            , React.createElement('form', {
              className: "signup-form",
              onSubmit: submit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}


              /* FULL NAME */

              , React.createElement(SignupField, {
                label: "Full name" ,
                icon: UserRound, __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}


                , React.createElement('input', {
                  type: "text",
                  required: true,
                  autoComplete: "name",
                  placeholder: "Enter your full name"   ,
                  value: form.name,
                  onChange: (e) =>
                    update("name", e.target.value)
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
                )

              )


              /* EMAIL */

              , React.createElement(SignupField, {
                label: "Work email" ,
                icon: Mail, __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}


                , React.createElement('input', {
                  type: "email",
                  required: true,
                  autoComplete: "email",
                  placeholder: "name@company.com",
                  value: form.email,
                  onChange: (e) =>
                    update("email", e.target.value)
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}
                )

              )


              /* PASSWORD */

              , React.createElement(SignupField, {
                label: "Password",
                icon: LockKeyhole, __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}


                , React.createElement('div', { className: "signup-password-wrapper", __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}

                  , React.createElement('input', {
                    type: 
                      showPassword
                        ? "text"
                        : "password"
                    ,
                    required: true,
                    minLength: 6,
                    autoComplete: "new-password",
                    placeholder: "Create a secure password"   ,
                    value: form.password,
                    onChange: (e) =>
                      update(
                        "password",
                        e.target.value
                      )
                    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}
                  )

                  , React.createElement('button', {
                    type: "button",
                    className: "signup-password-toggle",
                    onClick: () =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}}

                    , showPassword ? (
                      React.createElement(EyeOff, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}} )
                    ) : (
                      React.createElement(Eye, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}} )
                    )
                  )

                )

              )


              /* CONFIRM PASSWORD */

              , React.createElement(SignupField, {
                label: "Confirm password" ,
                icon: LockKeyhole, __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}


                , React.createElement('div', { className: "signup-password-wrapper", __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}

                  , React.createElement('input', {
                    type: 
                      showConfirmPassword
                        ? "text"
                        : "password"
                    ,
                    required: true,
                    autoComplete: "new-password",
                    placeholder: "Confirm your password"  ,
                    value: form.confirmPassword,
                    onChange: (e) =>
                      update(
                        "confirmPassword",
                        e.target.value
                      )
                    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
                  )

                  , React.createElement('button', {
                    type: "button",
                    className: "signup-password-toggle",
                    onClick: () =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}

                    , showConfirmPassword ? (
                      React.createElement(EyeOff, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}} )
                    ) : (
                      React.createElement(Eye, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}} )
                    )
                  )

                )

              )


              /* PASSWORD INFO */

              , React.createElement('div', { className: "signup-password-info", __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 299}}
                  , React.createElement(Check, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}} ), "Minimum 6 characters"

                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
                  , React.createElement(Check, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}} ), "Secure account protection"

                )

              )


              /* ERROR */

              , error && (
                React.createElement('div', { className: "signup-error", __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}

                  , React.createElement('div', { className: "signup-error-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}, "!"

                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}
                    , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}, "Account creation failed"

                    )

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}
                      , error
                    )
                  )

                )
              )


              /* SECURITY */

              , React.createElement('div', { className: "signup-security", __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}

                , React.createElement('div', { className: "signup-security-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
                  , React.createElement(ShieldCheck, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}} )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}

                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}, "Protected HR access"

                  )

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}, "Your account information is protected and used only for authorized HR access."


                  )

                )

              )


              /* BUTTON */

              , React.createElement('button', {
                type: "submit",
                className: "signup-button",
                disabled: busy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}


                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 367}}
                  , busy
                    ? "Creating account..."
                    : "Create HR account"
                )

                , !busy && (
                  React.createElement(ArrowRight, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}} )
                )

              )


              /* LOGIN */

              , React.createElement('div', { className: "signup-login", __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}, "Already have an account?"

                )

                , React.createElement(Link, { to: "/login", __self: this, __source: {fileName: _jsxFileName, lineNumber: 388}}, "Sign in"

                )

              )

            )

          )

        )


        /* ===================================================
            RIGHT SIDE
        =================================================== */

        , React.createElement('section', { className: "signup-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}

          , React.createElement('div', { className: "signup-right-content", __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}

            , React.createElement('div', { className: "signup-right-eyebrow", __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}
              , React.createElement(Sparkles, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}} ), "PEOPLE OPERATIONS"

            )

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}, "Everything your"

              , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 416}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 417}}, "people need." )
            )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}, "Connect employees, HR workflows and intelligent assistance in one secure workspace."



            )


            /* DASHBOARD MOCKUP */

            , React.createElement('div', { className: "signup-dashboard", __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}

              /* Dashboard header */

              , React.createElement('div', { className: "signup-dashboard-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}, "WORKFORCE OVERVIEW"

                  )

                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 441}}, "People Operations"

                  )

                )

                , React.createElement('div', { className: "signup-live", __self: this, __source: {fileName: _jsxFileName, lineNumber: 447}}
                  , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 448}} ), "Live"

                )

              )


              /* Stats */

              , React.createElement('div', { className: "signup-stats", __self: this, __source: {fileName: _jsxFileName, lineNumber: 457}}

                , React.createElement(DashboardStat, {
                  icon: Users,
                  value: "248",
                  label: "Employees", __self: this, __source: {fileName: _jsxFileName, lineNumber: 459}}
                )

                , React.createElement(DashboardStat, {
                  icon: CalendarDays,
                  value: "94%",
                  label: "Attendance", __self: this, __source: {fileName: _jsxFileName, lineNumber: 465}}
                )

                , React.createElement(DashboardStat, {
                  icon: BriefcaseBusiness,
                  value: "18",
                  label: "Active workflows" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}}
                )

              )


              /* Lower dashboard */

              , React.createElement('div', { className: "signup-dashboard-lower", __self: this, __source: {fileName: _jsxFileName, lineNumber: 482}}

                , React.createElement('div', { className: "signup-chart", __self: this, __source: {fileName: _jsxFileName, lineNumber: 484}}

                  , React.createElement('div', { className: "signup-chart-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}}

                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 488}}
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 489}}, "WORKFORCE ACTIVITY"

                      )

                      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 493}}, "Attendance this week"

                      )
                    )

                    , React.createElement(Sparkles, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}} )

                  )


                  , React.createElement('div', { className: "signup-bars", __self: this, __source: {fileName: _jsxFileName, lineNumber: 503}}

                    , React.createElement('i', { style: { height: "42%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}} )
                    , React.createElement('i', { style: { height: "58%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 506}} )
                    , React.createElement('i', { style: { height: "50%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 507}} )
                    , React.createElement('i', { style: { height: "70%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 508}} )
                    , React.createElement('i', { style: { height: "61%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 509}} )
                    , React.createElement('i', { style: { height: "78%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 510}} )
                    , React.createElement('i', { style: { height: "67%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 511}} )
                    , React.createElement('i', { style: { height: "82%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 512}} )

                  )

                )


                /* AI CARD */

                , React.createElement('div', { className: "signup-ai-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 521}}

                  , React.createElement('div', { className: "signup-ai-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}
                    , React.createElement(Sparkles, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 524}} )
                  )

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 527}}, "AI HR SUPPORT"

                  )

                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}, "Available 24/7"

                  )

                  , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 535}}, "Ask about leave, attendance, policies or employee processes."


                  )

                  , React.createElement('div', { className: "signup-ai-input", __self: this, __source: {fileName: _jsxFileName, lineNumber: 540}}, "How can I help today?"

                  )

                )

              )

            )


            /* FLOATING CARDS */

            , React.createElement('div', { className: "signup-floating signup-floating-one" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 553}}

              , React.createElement('div', { className: "floating-icon green" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 555}}
                , React.createElement(Check, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 556}} )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 559}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 560}}, "HR workflows connected"

                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 564}}, "Employee lifecycle synced"

                )
              )

            )


            , React.createElement('div', { className: "signup-floating signup-floating-two" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 572}}

              , React.createElement('div', { className: "floating-icon blue" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}
                , React.createElement(Sparkles, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 575}} )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 578}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 579}}, "AI HR Assistant"

                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 583}}, "System operational"

                )
              )

            )


            /* Bottom features */

            , React.createElement('div', { className: "signup-right-features", __self: this, __source: {fileName: _jsxFileName, lineNumber: 593}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 595}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 596}}, "Employee lifecycle"

                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 600}}, "From onboarding to exit"

                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 605}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 606}}, "HR automation"

                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 610}}, "Less manual administration"

                )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 615}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 616}}, "AI assistance"

                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 620}}, "Instant HR guidance"

                )
              )

            )

          )

        )

      )

    )
  );
}


/* =========================================================
   FIELD
========================================================= */

function SignupField({
  label,
  icon: Icon,
  children,
}) {
  return (
    React.createElement('label', { className: "signup-field", __self: this, __source: {fileName: _jsxFileName, lineNumber: 648}}

      , React.createElement('span', { className: "signup-field-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 650}}
        , label
        , React.createElement('b', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 652}}, "*")
      )

      , React.createElement('div', { className: "signup-input", __self: this, __source: {fileName: _jsxFileName, lineNumber: 655}}

        , React.createElement(Icon, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 657}} )

        , children

      )

    )
  );
}


/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({
  icon: Icon,
  value,
  label,
}) {
  return (
    React.createElement('div', { className: "signup-stat", __self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}

      , React.createElement('div', { className: "signup-stat-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 680}}
        , React.createElement(Icon, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 681}} )
      )

      , React.createElement('div', { className: "signup-stat-value", __self: this, __source: {fileName: _jsxFileName, lineNumber: 684}}
        , value
      )

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 688}}
        , label
      )

    )
  );
}