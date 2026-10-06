const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/App.jsx";import React from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.js";
import { HRProvider } from "./context/HRContext.js";

import ProtectedRoute from "./components/ProtectedRoute.js";
import AppShell from "./components/AppShell.js";

/* =========================
   PUBLIC PAGES
========================= */

import Home from "./pages/Home/Home.js";

import Login from "./pages/Auth/Login.js";
import Signup from "./pages/Auth/Signup.js";
import ForgotPassword from "./pages/Auth/ForgotPassword.js";
import ResetPassword from "./pages/Auth/ResetPassword.js";

/* =========================
   DASHBOARD
========================= */

import Dashboard from "./pages/Dashboard/Dashboard.js";

/* =========================
   EMPLOYEES
========================= */

import Employees from "./pages/Employees/Employees.js";
import EmployeeProfile from "./pages/Employees/EmployeeProfile.js";
import EmployeeForm from "./pages/Employees/EmployeeForm.js";

/* =========================
   ONBOARDING
========================= */

import Onboarding from "./pages/Onboarding/Onboarding.js";
import OnboardingJourney from "./pages/Onboarding/OnboardingJourney.js";
import OnboardingForm from "./pages/Onboarding/OnboardingForm.js";
import OnboardingAI from "./pages/Onboarding/OnboardingAI.js";
import OnboardingDocuments from "./pages/Onboarding/Documents.js";
import PolicyAcknowledgement from "./pages/Onboarding/PolicyAcknowledgement.js";
import Training from "./pages/Onboarding/Training.js";

/* =========================
   ATTENDANCE
========================= */

import Attendance from "./pages/Attendance/Attendance.js";
import MyAttendance from "./pages/Attendance/MyAttendance.js";
import Regularization from "./pages/Attendance/Regularization.js";

/* =========================
   LEAVE
========================= */

import Leave from "./pages/Leave/Leave.js";
import ApplyLeave from "./pages/Leave/ApplyLeave.js";
import LeaveHistory from "./pages/Leave/LeaveHistory.js";

/* =========================
   DOCUMENTS
========================= */

import Documents from "./pages/Documents/Documents.js";
import DocumentViewer from "./pages/Documents/DocumentViewer.js";
import DocumentCategory from "./pages/Documents/DocumentCategory.js";
import DefaultDocumentViewer from "./pages/Documents/DefaultDocumentViewer.js";

/* =========================
   OTHER HR MODULES
========================= */

import Policies from "./pages/Policies/Policies.js";
import Benefits from "./pages/Benefits/Benefits.js";
import Payroll from "./pages/Payroll/Payroll.js";

/* =========================
   SUPPORT
========================= */

import HRSupport from "./pages/Support/HRSupport.js";
import Tickets from "./pages/Support/Tickets.js";
import CreateTicket from "./pages/Support/CreateTicket.js";

/* =========================
   REPORTS / SETTINGS
========================= */

import Reports from "./pages/Reports/Reports.js";
import Profile from "./pages/Settings/Profile.js";
import Settings from "./pages/Settings/Settings.js";


/* =========================================================
   PRIVATE LAYOUT
========================================================= */

function PrivateLayout() {
  return (
    React.createElement(ProtectedRoute, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
      , React.createElement(AppShell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 109}} )
    )
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    React.createElement(AuthProvider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
      , React.createElement(HRProvider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}

        , React.createElement(Routes, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}

          /* =================================================
              PUBLIC ROUTES
          ================================================= */

          , React.createElement(Route, {
            path: "/",
            element: React.createElement(Home, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 132}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
          )

          , React.createElement(Route, {
            path: "/login",
            element: React.createElement(Login, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 137}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}
          )

          , React.createElement(Route, {
            path: "/signup",
            element: React.createElement(Signup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 142}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}
          )

          , React.createElement(Route, {
            path: "/forgot-password",
            element: React.createElement(ForgotPassword, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 147}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}
          )

          , React.createElement(Route, {
            path: "/reset-password",
            element: React.createElement(ResetPassword, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 152}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
          )


          /* =================================================
              PROTECTED APPLICATION
          ================================================= */

          , React.createElement(Route, { element: React.createElement(PrivateLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 160}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}

            /* =========================
                DASHBOARD
            ========================= */

            , React.createElement(Route, {
              path: "/dashboard",
              element: React.createElement(Dashboard, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 168}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}
            )


            /* =========================
                EMPLOYEES
            ========================= */

            , React.createElement(Route, {
              path: "/employees",
              element: React.createElement(Employees, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 178}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}
            )

            , React.createElement(Route, {
              path: "/employees/new",
              element: React.createElement(EmployeeForm, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 183}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
            )

            , React.createElement(Route, {
              path: "/employees/:id",
              element: React.createElement(EmployeeProfile, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 188}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
            )

            , React.createElement(Route, {
              path: "/employees/:id/edit",
              element: React.createElement(EmployeeForm, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 193}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}
            )


            /* =================================================
                ONBOARDING
            ================================================= */

            /* Onboarding dashboard/list */

            , React.createElement(Route, {
              path: "/onboarding",
              element: React.createElement(Onboarding, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 205}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}
            )

            /* SIX-STEP EMPLOYEE ONBOARDING FORM */

            , React.createElement(Route, {
              path: "/onboarding/new",
              element: React.createElement(OnboardingForm, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 212}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}
            )

            /* AI onboarding analysis */

            , React.createElement(Route, {
              path: "/onboarding/ai",
              element: React.createElement(OnboardingAI, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 219}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}
            )

            /* Individual onboarding journey */

            , React.createElement(Route, {
              path: "/onboarding/journey/:id",
              element: React.createElement(OnboardingJourney, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 226}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}
            )

            /* Onboarding documents */

            , React.createElement(Route, {
              path: "/onboarding/documents",
              element: React.createElement(OnboardingDocuments, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 233}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
            )

            /* Policy acknowledgement */

            , React.createElement(Route, {
              path: "/onboarding/policies",
              element: React.createElement(PolicyAcknowledgement, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 240}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}
            )

            /* Training */

            , React.createElement(Route, {
              path: "/onboarding/training",
              element: React.createElement(Training, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 247}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}
            )


            /* =================================================
                ATTENDANCE
            ================================================= */

            , React.createElement(Route, {
              path: "/attendance",
              element: React.createElement(Attendance, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 257}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}
            )

            , React.createElement(Route, {
              path: "/attendance/my",
              element: React.createElement(MyAttendance, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 262}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}
            )

            , React.createElement(Route, {
              path: "/attendance/regularization",
              element: React.createElement(Regularization, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 267}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}
            )


            /* =================================================
                LEAVE
            ================================================= */

            , React.createElement(Route, {
              path: "/leave",
              element: React.createElement(Leave, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 277}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}
            )

            , React.createElement(Route, {
              path: "/leave/apply",
              element: React.createElement(ApplyLeave, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 282}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
            )

            , React.createElement(Route, {
              path: "/leave/history",
              element: React.createElement(LeaveHistory, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 287}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
            )


            /* =================================================
                DOCUMENTS
            ================================================= */

            , React.createElement(Route, {
              path: "/documents",
              element: React.createElement(Documents, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 297}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}
            )

            /* Document category folder */
            , React.createElement(Route, {
              path: "/documents/category/:category",
              element: React.createElement(DocumentCategory, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 303}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}
            )

            /* Default/reference document details */
            , React.createElement(Route, {
              path: "/documents/default/:id",
              element: React.createElement(DefaultDocumentViewer, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 309}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}
            )

            /* Uploaded/database document details */
            , React.createElement(Route, {
              path: "/documents/:id",
              element: React.createElement(DocumentViewer, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 315}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}
            )


            /* =================================================
                POLICIES
            ================================================= */

            , React.createElement(Route, {
              path: "/policies",
              element: React.createElement(Policies, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 325}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}
            )


            /* =================================================
                BENEFITS
            ================================================= */

            , React.createElement(Route, {
              path: "/benefits",
              element: React.createElement(Benefits, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 335}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}
            )


            /* =================================================
                PAYROLL
            ================================================= */

            , React.createElement(Route, {
              path: "/payroll",
              element: React.createElement(Payroll, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 345}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}
            )


            /* =================================================
                HR SUPPORT
            ================================================= */

            , React.createElement(Route, {
              path: "/support",
              element: React.createElement(HRSupport, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 355}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}
            )

            , React.createElement(Route, {
              path: "/support/tickets",
              element: React.createElement(Tickets, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 360}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}
            )

            , React.createElement(Route, {
              path: "/support/tickets/new",
              element: React.createElement(CreateTicket, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 365}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}
            )


            /* =================================================
                REPORTS
            ================================================= */

            , React.createElement(Route, {
              path: "/reports",
              element: React.createElement(Reports, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 375}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}
            )


            /* =================================================
                SETTINGS
            ================================================= */

            , React.createElement(Route, {
              path: "/settings/profile",
              element: React.createElement(Profile, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 385}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}
            )

            , React.createElement(Route, {
              path: "/settings",
              element: React.createElement(Settings, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 390}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 388}}
            )

          )


          /* =================================================
              FALLBACK
          ================================================= */

          , React.createElement(Route, {
            path: "*",
            element: 
              React.createElement(Navigate, {
                to: "/",
                replace: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}
              )
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}
          )

        )

      )
    )
  );
}