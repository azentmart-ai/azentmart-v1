import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Public pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Main application pages
import Dashboard from "./pages/Dashboard.jsx";
import AIRecruiter from "./pages/AIRecruiter.jsx";
import Candidates from "./pages/Candidates.jsx";
import CandidateProfile from "./pages/CandidateProfile.jsx";
import Pipeline from "./pages/Pipeline.jsx";
import AIInterviewer from "./pages/AIInterviewer.jsx";
import CandidateAgent from "./pages/CandidateAgent.jsx";
import Campaigns from "./pages/Campaigns.jsx";
import Jobs from "./pages/Jobs.jsx";
import Analytics from "./pages/Analytics.jsx";

// Application shell
import AppShell from "./components/AppShell.jsx";

// Authentication
import { token } from "./lib/api";

// AI Recruiter pages
import CreateJob from "./pages/AIRecruiter/CreateJob/CreateJob.jsx";
import AIJobDescription from "./pages/AIRecruiter/AIJobDescription/AIJobDescription.jsx";
import SourceCandidates from "./pages/AIRecruiter/SourceCandidates/SourceCandidates.jsx";
import CandidateMatching from "./pages/AIRecruiter/CandidateMatching/CandidateMatching.jsx";

// Candidate pages
import AIShortlisted from "./pages/Candidates/AIShortlisted/AIShortlisted.jsx";

// Recruitment Pipeline pages
import Applied from "./pages/RecruitmentPipeline/Applied/Applied.jsx";
import AIScreening from "./pages/RecruitmentPipeline/AIScreening/AIScreening.jsx";
import Shortlisted from "./pages/RecruitmentPipeline/Shortlisted/Shortlisted.jsx";
import Interview from "./pages/RecruitmentPipeline/Interview/Interview.jsx";
import Offer from "./pages/RecruitmentPipeline/Offer/Offer.jsx";
import Hired from "./pages/RecruitmentPipeline/Hired/Hired.jsx";

/* =========================================================
   AUTH GUARD
========================================================= */

function Guard({ children }) {
  return token() ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* FORGOT PASSWORD */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* RESET PASSWORD */}
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =====================================================
          PROTECTED APPLICATION
      ===================================================== */}

      <Route
        element={
          <Guard>
            <AppShell />
          </Guard>
        }
      >

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ===================================================
            AI RECRUITER
        =================================================== */}

        <Route
          path="/ai-recruiter"
          element={<AIRecruiter />}
        />

        <Route
          path="/ai-recruiter/create-job"
          element={<CreateJob />}
        />

        <Route
          path="/ai-recruiter/ai-job-description"
          element={<AIJobDescription />}
        />

        <Route
          path="/ai-recruiter/source-candidates"
          element={<SourceCandidates />}
        />

        <Route
          path="/ai-recruiter/candidate-matching"
          element={<CandidateMatching />}
        />


        {/* ===================================================
            CANDIDATES
        =================================================== */}

        <Route
          path="/candidates"
          element={<Candidates />}
        />

        <Route
          path="/candidates/ai-shortlisted"
          element={<AIShortlisted />}
        />

        <Route
          path="/candidates/:id"
          element={<CandidateProfile />}
        />


        {/* ===================================================
            RECRUITMENT PIPELINE
        =================================================== */}

        <Route
          path="/pipeline"
          element={<Pipeline />}
        />

        <Route
          path="/pipeline/applied"
          element={<Applied />}
        />

        <Route
          path="/pipeline/ai-screening"
          element={<AIScreening />}
        />

        <Route
          path="/pipeline/shortlisted"
          element={<Shortlisted />}
        />

        <Route
          path="/pipeline/interview"
          element={<Interview />}
        />

        <Route
          path="/pipeline/offer"
          element={<Offer />}
        />

        <Route
          path="/pipeline/hired"
          element={<Hired />}
        />


        {/* ===================================================
            AI INTERVIEWER
        =================================================== */}

        <Route
          path="/ai-interviewer"
          element={<AIInterviewer />}
        />


        {/* ===================================================
            CANDIDATE AGENT
        =================================================== */}

        <Route
          path="/candidate-agent"
          element={<CandidateAgent />}
        />


        {/* ===================================================
            CAMPAIGNS
        =================================================== */}

        <Route
          path="/campaigns"
          element={<Campaigns />}
        />


        {/* ===================================================
            JOBS
        =================================================== */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />


        {/* ===================================================
            ANALYTICS
        =================================================== */}

        <Route
          path="/analytics"
          element={<Analytics />}
        />

      </Route>


      {/* =====================================================
          FALLBACK
      ===================================================== */}

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
  );
}