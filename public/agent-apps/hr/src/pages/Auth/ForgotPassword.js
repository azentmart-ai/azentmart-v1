const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Auth/ForgotPassword.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  CalendarCheck,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

import { authService } from "../../services/authService.js";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const result = await authService.forgotPassword(email);
      setMessage(result.message);
    } catch (err) {
      setError(
        _optionalChain([err, 'access', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.detail]) ||
          "Unable to process the request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    React.createElement('div', { className: "auth-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}

      /* =====================================================
          TOP BAR
      ===================================================== */

      , React.createElement('header', { className: "auth-navbar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}

        , React.createElement(Link, { to: "/", className: "auth-logo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}

          , React.createElement('img', {
            src: "/agent-apps/hr/assets/logo.svg",
            alt: "AzentMart AI" ,
            className: "auth-logo-image", __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
          )

        )


        , React.createElement(Link, { to: "/", className: "auth-home-link", __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
          , React.createElement(ArrowLeft, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}} ), "Back to home"

        )

      )


      /* =====================================================
          MAIN
      ===================================================== */

      , React.createElement('main', { className: "auth-main", __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}

        /* ===================================================
            LEFT CONTENT
        =================================================== */

        , React.createElement('section', { className: "auth-intro", __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}

          , React.createElement('div', { className: "auth-intro-content", __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}

            , React.createElement('div', { className: "auth-eyebrow", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}), "AZENTMART HR PLATFORM"

            )


            , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, "Your people."

              , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 89}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}, "One connected" )
              , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 91}} ), "platform."

            )


            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}, "Manage your workforce, HR operations and employee experience from one simple, intelligent platform."



            )


            , React.createElement('div', { className: "auth-features", __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}

              , React.createElement('div', { className: "auth-feature", __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}

                , React.createElement('div', { className: "auth-feature-icon blue" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
                  , React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}} )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}, "Employee management" )
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, "Keep your entire workforce organized."

                  )
                )

              )


              , React.createElement('div', { className: "auth-feature", __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}

                , React.createElement('div', { className: "auth-feature-icon green" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
                  , React.createElement(CalendarCheck, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}} )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}, "Attendance & leave"  )
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}, "Manage everyday HR operations easily."

                  )
                )

              )


              , React.createElement('div', { className: "auth-feature", __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}

                , React.createElement('div', { className: "auth-feature-icon purple" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
                  , React.createElement(UserPlus, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}} )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}, "Employee lifecycle" )
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}, "From onboarding to everyday operations."

                  )
                )

              )

            )


            /* =================================================
                MINI DASHBOARD
            ================================================= */

            , React.createElement('div', { className: "auth-mini-dashboard", __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}

              , React.createElement('div', { className: "mini-dashboard-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}, "WORKFORCE OVERVIEW" )
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}, "People Operations" )
                )

                , React.createElement('div', { className: "mini-live", __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
                  , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}), "Live"

                )

              )


              , React.createElement('div', { className: "mini-dashboard-stats", __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}
                  , React.createElement(Users, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}} )
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}, "248")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}, "Employees")
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}
                  , React.createElement(CalendarCheck, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}} )
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}, "93.1%")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}, "Attendance")
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}
                  , React.createElement(UserPlus, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}} )
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}, "12")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}, "New joiners" )
                )

              )

            )

          )

        )


        /* ===================================================
            RIGHT FORM
        =================================================== */

        , React.createElement('section', { className: "auth-form-section", __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}}

          , React.createElement('div', { className: "auth-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}

            , React.createElement('div', { className: "auth-card-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}
              , React.createElement(ShieldCheck, { size: 22, __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}} )
            )


            , React.createElement('div', { className: "auth-card-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}

              , React.createElement('span', { className: "auth-card-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}, "ACCOUNT RECOVERY"

              )

              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}, "Forgot your password?"

              )

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}, "Enter your work email and we'll help you recover access to your account."


              )

            )


            , React.createElement('form', {
              className: "auth-form",
              onSubmit: submit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}


              , message && (
                React.createElement('div', { className: "auth-success", __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
                  , message
                )
              )


              , error && (
                React.createElement('div', { className: "auth-error", __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
                  , error
                )
              )


              , React.createElement('div', { className: "form-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}

                , React.createElement('label', { htmlFor: "email", __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}, "Work email"

                )

                , React.createElement('input', {
                  id: "email",
                  className: "input",
                  type: "email",
                  placeholder: "you@company.com",
                  required: true,
                  value: email,
                  onChange: (event) =>
                    setEmail(event.target.value)
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}
                )

              )


              , React.createElement('button', {
                type: "submit",
                className: "auth-submit",
                disabled: loading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}


                , loading
                  ? "Sending..."
                  : "Request password reset"
                

                , !loading && (
                  React.createElement(ArrowRight, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}} )
                )

              )

            )


            , React.createElement('div', { className: "auth-divider", __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 297}})
              , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}, "OR")
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 299}})
            )


            , React.createElement(Link, {
              to: "/login",
              className: "auth-back-login", __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}
, "Back to sign in"

            )


            , React.createElement('p', { className: "auth-help-text", __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}, "Need help accessing your account?"

              , React.createElement(Link, { to: "/contact", __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}, "Contact support"

              )
            )

          )

        )

      )


      /* =====================================================
          FOOTER
      ===================================================== */

      , React.createElement('footer', { className: "auth-footer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}, "© "
           , new Date().getFullYear(), " AzentMart. All rights reserved."

        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 336}}
          , React.createElement(Link, { to: "/privacy", __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}, "Privacy"

          )

          , React.createElement(Link, { to: "/terms", __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}, "Terms"

          )

          , React.createElement(Link, { to: "/security", __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}, "Security"

          )
        )

      )

    )
  );
}