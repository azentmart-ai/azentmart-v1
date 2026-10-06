import React from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { HRProvider } from "./context/HRContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

/* =========================
   PUBLIC PAGES
========================= */

import Home from "./pages/Home/Home";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

/* =========================
   DASHBOARD
========================= */

import Dashboard from "./pages/Dashboard/Dashboard";

/* =========================
   EMPLOYEES
========================= */

import Employees from "./pages/Employees/Employees";
import EmployeeProfile from "./pages/Employees/EmployeeProfile";
import EmployeeForm from "./pages/Employees/EmployeeForm";

/* =========================
   ONBOARDING
========================= */

import Onboarding from "./pages/Onboarding/Onboarding";
import OnboardingJourney from "./pages/Onboarding/OnboardingJourney";
import OnboardingForm from "./pages/Onboarding/OnboardingForm";
import OnboardingAI from "./pages/Onboarding/OnboardingAI";
import OnboardingDocuments from "./pages/Onboarding/Documents";
import PolicyAcknowledgement from "./pages/Onboarding/PolicyAcknowledgement";
import Training from "./pages/Onboarding/Training";

/* =========================
   ATTENDANCE
========================= */

import Attendance from "./pages/Attendance/Attendance";
import MyAttendance from "./pages/Attendance/MyAttendance";
import Regularization from "./pages/Attendance/Regularization";

/* =========================
   LEAVE
========================= */

import Leave from "./pages/Leave/Leave";
import ApplyLeave from "./pages/Leave/ApplyLeave";
import LeaveHistory from "./pages/Leave/LeaveHistory";

/* =========================
   DOCUMENTS
========================= */

import Documents from "./pages/Documents/Documents";
import DocumentViewer from "./pages/Documents/DocumentViewer";
import DocumentCategory from "./pages/Documents/DocumentCategory";
import DefaultDocumentViewer from "./pages/Documents/DefaultDocumentViewer";

/* =========================
   OTHER HR MODULES
========================= */

import Policies from "./pages/Policies/Policies";
import Benefits from "./pages/Benefits/Benefits";
import Payroll from "./pages/Payroll/Payroll";

/* =========================
   SUPPORT
========================= */

import HRSupport from "./pages/Support/HRSupport";
import Tickets from "./pages/Support/Tickets";
import CreateTicket from "./pages/Support/CreateTicket";

/* =========================
   REPORTS / SETTINGS
========================= */

import Reports from "./pages/Reports/Reports";
import Profile from "./pages/Settings/Profile";
import Settings from "./pages/Settings/Settings";


/* =========================================================
   PRIVATE LAYOUT
========================================================= */

function PrivateLayout() {
  return (
    <ProtectedRoute>
      <AppShell />
    </ProtectedRoute>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <AuthProvider>
      <HRProvider>

        <Routes>

          {/* =================================================
              PUBLIC ROUTES
          ================================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />


          {/* =================================================
              PROTECTED APPLICATION
          ================================================= */}

          <Route element={<PrivateLayout />}>

            {/* =========================
                DASHBOARD
            ========================= */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* =========================
                EMPLOYEES
            ========================= */}

            <Route
              path="/employees"
              element={<Employees />}
            />

            <Route
              path="/employees/new"
              element={<EmployeeForm />}
            />

            <Route
              path="/employees/:id"
              element={<EmployeeProfile />}
            />

            <Route
              path="/employees/:id/edit"
              element={<EmployeeForm />}
            />


            {/* =================================================
                ONBOARDING
            ================================================= */}

            {/* Onboarding dashboard/list */}

            <Route
              path="/onboarding"
              element={<Onboarding />}
            />

            {/* SIX-STEP EMPLOYEE ONBOARDING FORM */}

            <Route
              path="/onboarding/new"
              element={<OnboardingForm />}
            />

            {/* AI onboarding analysis */}

            <Route
              path="/onboarding/ai"
              element={<OnboardingAI />}
            />

            {/* Individual onboarding journey */}

            <Route
              path="/onboarding/journey/:id"
              element={<OnboardingJourney />}
            />

            {/* Onboarding documents */}

            <Route
              path="/onboarding/documents"
              element={<OnboardingDocuments />}
            />

            {/* Policy acknowledgement */}

            <Route
              path="/onboarding/policies"
              element={<PolicyAcknowledgement />}
            />

            {/* Training */}

            <Route
              path="/onboarding/training"
              element={<Training />}
            />


            {/* =================================================
                ATTENDANCE
            ================================================= */}

            <Route
              path="/attendance"
              element={<Attendance />}
            />

            <Route
              path="/attendance/my"
              element={<MyAttendance />}
            />

            <Route
              path="/attendance/regularization"
              element={<Regularization />}
            />


            {/* =================================================
                LEAVE
            ================================================= */}

            <Route
              path="/leave"
              element={<Leave />}
            />

            <Route
              path="/leave/apply"
              element={<ApplyLeave />}
            />

            <Route
              path="/leave/history"
              element={<LeaveHistory />}
            />


            {/* =================================================
                DOCUMENTS
            ================================================= */}

            <Route
              path="/documents"
              element={<Documents />}
            />

            {/* Document category folder */}
            <Route
              path="/documents/category/:category"
              element={<DocumentCategory />}
            />

            {/* Default/reference document details */}
            <Route
              path="/documents/default/:id"
              element={<DefaultDocumentViewer />}
            />

            {/* Uploaded/database document details */}
            <Route
              path="/documents/:id"
              element={<DocumentViewer />}
            />


            {/* =================================================
                POLICIES
            ================================================= */}

            <Route
              path="/policies"
              element={<Policies />}
            />


            {/* =================================================
                BENEFITS
            ================================================= */}

            <Route
              path="/benefits"
              element={<Benefits />}
            />


            {/* =================================================
                PAYROLL
            ================================================= */}

            <Route
              path="/payroll"
              element={<Payroll />}
            />


            {/* =================================================
                HR SUPPORT
            ================================================= */}

            <Route
              path="/support"
              element={<HRSupport />}
            />

            <Route
              path="/support/tickets"
              element={<Tickets />}
            />

            <Route
              path="/support/tickets/new"
              element={<CreateTicket />}
            />


            {/* =================================================
                REPORTS
            ================================================= */}

            <Route
              path="/reports"
              element={<Reports />}
            />


            {/* =================================================
                SETTINGS
            ================================================= */}

            <Route
              path="/settings/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>


          {/* =================================================
              FALLBACK
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </HRProvider>
    </AuthProvider>
  );
}