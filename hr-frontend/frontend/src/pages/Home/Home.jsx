import React from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronRight,
  Users,
  UserPlus,
  CalendarCheck,
  Clock3,
  FileText,
  WalletCards,
  BarChart3,
  Sparkles,
  Search,
  Bell,
  MoreHorizontal,
  CheckCircle2,
  CalendarDays,
  TrendingUp,
  BriefcaseBusiness,
  MapPin,
  CircleUserRound,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

import "./Home.css";
import HRChatbot from "../../components/HRChatbot";
import HRFooter from "../../components/HRFooter";


const modules = [
  {
    icon: Users,
    title: "Employees",
    description: "Manage employee profiles, teams and workforce information.",
    path: "/employees",
  },
  {
    icon: CalendarCheck,
    title: "Attendance",
    description: "Track attendance, shifts, working hours and leave.",
    path: "/attendance",
  },
  {
    icon: UserPlus,
    title: "Onboarding",
    description: "Move new employees through a structured onboarding journey.",
    path: "/onboarding",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Keep employee documents and HR policies organized.",
    path: "/documents",
  },
  {
    icon: WalletCards,
    title: "Payroll",
    description: "Keep workforce and payroll information connected.",
    path: "/payroll",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Understand workforce trends through actionable insights.",
    path: "/analytics",
  },
];


const employees = [
  {
    initials: "AK",
    name: "Arun Kumar",
    role: "Product Designer",
    department: "Design",
    status: "Present",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    role: "HR Executive",
    department: "People",
    status: "Present",
  },
  {
    initials: "RV",
    name: "Rahul Verma",
    role: "Software Engineer",
    department: "Engineering",
    status: "On leave",
  },
  {
    initials: "SK",
    name: "Sneha Kumar",
    role: "Marketing Manager",
    department: "Marketing",
    status: "Present",
  },
];


function Home() {

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="hr-home">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="hr-nav">

        <div className="hr-nav-inner">

          <Link to="/" className="hr-logo">

            <img
              className="hr-logo-image"
              src="/agent-apps/hr/assets/logo.svg"
              alt="AzentMart AI"
            />

          </Link>


          <nav className={`hr-navigation ${menuOpen ? "show" : ""}`}>

            <a href="#dashboard" onClick={() => setMenuOpen(false)}>
              Overview
            </a>

            <a href="#platform" onClick={() => setMenuOpen(false)}>
              Platform
            </a>

            <a href="#employees" onClick={() => setMenuOpen(false)}>
              Employees
            </a>

            <a href="#operations" onClick={() => setMenuOpen(false)}>
              Operations
            </a>

            <a href="#intelligence" onClick={() => setMenuOpen(false)}>
              Intelligence
            </a>

            <Link to="/login" className="mobile-login">
              Sign in
            </Link>

          </nav>


          <div className="nav-actions">

            <Link to="/login" className="nav-login">
              Sign in
            </Link>

            <Link to="/signup" className="nav-button">
              Get started
              <ArrowRight size={16} />
            </Link>

          </div>


          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen
              ? <X size={23} />
              : <Menu size={23} />
            }
          </button>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section" id="dashboard">

        <div className="hero-container">

          <div className="hero-copy">

            <div className="hero-badge">
              <span></span>
              MODERN PEOPLE OPERATIONS
            </div>


            <h1>
              Your entire
              <br />
              workforce,
              <br />
              <strong>in one place.</strong>
            </h1>


            <p>
              Manage employees, attendance, onboarding, leave,
              documents and workforce operations from one
              intelligent HR platform.
            </p>


            <div className="hero-actions">

              <Link
                to="/signup"
                className="hero-primary"
              >
                Start building your workforce
                <ArrowRight size={18} />
              </Link>

              <a
                href="#platform"
                className="hero-secondary"
              >
                Explore platform
                <ChevronRight size={17} />
              </a>

            </div>


            <div className="hero-stats">

              <div>
                <strong>248</strong>
                <span>Employees managed</span>
              </div>

              <div>
                <strong>93.1%</strong>
                <span>Attendance today</span>
              </div>

              <div>
                <strong>12</strong>
                <span>New joiners</span>
              </div>

            </div>

          </div>


          {/* =================================================
              HERO DASHBOARD
          ================================================= */}

          <div className="hero-dashboard">

            <div className="dashboard-shell">

              {/* Dashboard header */}

              <div className="dashboard-header">

                <div>

                  <span className="dashboard-small">
                    PEOPLE OPERATIONS
                  </span>

                  <h2>
                    Workforce overview
                  </h2>

                </div>


                <div className="dashboard-header-actions">

                  <button>
                    <Search size={17} />
                  </button>

                  <button>
                    <Bell size={17} />
                    <span className="notification-dot"></span>
                  </button>

                  <div className="dashboard-user">
                    HR
                  </div>

                </div>

              </div>


              {/* Dashboard navigation */}

              <div className="dashboard-tabs">

                <span className="active">
                  Overview
                </span>

                <span>
                  Employees
                </span>

                <span>
                  Attendance
                </span>

                <span>
                  Leave
                </span>

                <span>
                  Payroll
                </span>

              </div>


              {/* Metric cards */}

              <div className="dashboard-metrics">

                <div className="dashboard-metric">

                  <div className="metric-top">

                    <span>Total employees</span>

                    <div className="metric-blue">
                      <Users size={17} />
                    </div>

                  </div>

                  <strong>248</strong>

                  <small>
                    <TrendingUp size={12} />
                    8.4% this month
                  </small>

                </div>


                <div className="dashboard-metric">

                  <div className="metric-top">

                    <span>Present today</span>

                    <div className="metric-green">
                      <CalendarCheck size={17} />
                    </div>

                  </div>

                  <strong>231</strong>

                  <small>
                    93.1% attendance
                  </small>

                </div>


                <div className="dashboard-metric">

                  <div className="metric-top">

                    <span>On leave</span>

                    <div className="metric-orange">
                      <Clock3 size={17} />
                    </div>

                  </div>

                  <strong>17</strong>

                  <small>
                    6.9% of workforce
                  </small>

                </div>


                <div className="dashboard-metric">

                  <div className="metric-top">

                    <span>New joiners</span>

                    <div className="metric-purple">
                      <UserPlus size={17} />
                    </div>

                  </div>

                  <strong>12</strong>

                  <small>
                    This month
                  </small>

                </div>

              </div>


              {/* Dashboard body */}

              <div className="dashboard-grid">

                {/* Attendance */}

                <div className="attendance-card">

                  <div className="card-heading">

                    <div>
                      <span>ATTENDANCE</span>
                      <h3>Today's attendance</h3>
                    </div>

                    <button>
                      <MoreHorizontal size={18} />
                    </button>

                  </div>


                  <div className="attendance-content">

                    <div className="attendance-circle">

                      <div>

                        <strong>93%</strong>

                        <span>
                          Present
                        </span>

                      </div>

                    </div>


                    <div className="attendance-details">

                      <div>
                        <span>
                          Present
                        </span>
                        <strong>231</strong>
                      </div>

                      <div>
                        <span>
                          Late
                        </span>
                        <strong>9</strong>
                      </div>

                      <div>
                        <span>
                          Absent
                        </span>
                        <strong>8</strong>
                      </div>

                    </div>

                  </div>

                </div>


                {/* Leave */}

                <div className="leave-card">

                  <div className="card-heading">

                    <div>
                      <span>LEAVE REQUESTS</span>
                      <h3>Needs attention</h3>
                    </div>

                    <Link to="/leave">
                      View all
                    </Link>

                  </div>


                  <div className="leave-list">

                    <div className="leave-item">

                      <div className="mini-avatar">
                        AK
                      </div>

                      <div className="leave-person">

                        <strong>
                          Arun Kumar
                        </strong>

                        <span>
                          Casual Leave · 2 days
                        </span>

                      </div>

                      <button className="approve">
                        Review
                      </button>

                    </div>


                    <div className="leave-item">

                      <div className="mini-avatar purple">
                        SP
                      </div>

                      <div className="leave-person">

                        <strong>
                          Sneha Priya
                        </strong>

                        <span>
                          Sick Leave · 1 day
                        </span>

                      </div>

                      <button className="approve">
                        Review
                      </button>

                    </div>


                    <div className="leave-item">

                      <div className="mini-avatar orange">
                        RM
                      </div>

                      <div className="leave-person">

                        <strong>
                          Rajesh M
                        </strong>

                        <span>
                          Earned Leave · 3 days
                        </span>

                      </div>

                      <button className="approve">
                        Review
                      </button>

                    </div>

                  </div>

                </div>

              </div>


              {/* Bottom dashboard row */}

              <div className="dashboard-bottom-row">

                <div className="quick-stat">

                  <div className="quick-icon blue">
                    <BriefcaseBusiness size={18} />
                  </div>

                  <div>
                    <span>Open positions</span>
                    <strong>18</strong>
                  </div>

                </div>


                <div className="quick-stat">

                  <div className="quick-icon green">
                    <UserPlus size={18} />
                  </div>

                  <div>
                    <span>Onboarding</span>
                    <strong>24</strong>
                  </div>

                </div>


                <div className="quick-stat">

                  <div className="quick-icon purple">
                    <FileText size={18} />
                  </div>

                  <div>
                    <span>Documents</span>
                    <strong>96%</strong>
                  </div>

                </div>


                <div className="quick-stat">

                  <div className="quick-icon orange">
                    <BarChart3 size={18} />
                  </div>

                  <div>
                    <span>Workforce health</span>
                    <strong>Good</strong>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PLATFORM INTRO
      ===================================================== */}

      <section className="platform-intro" id="platform">

        <div className="section-container">

          <div className="section-label">
            01 / PLATFORM
          </div>


          <div className="platform-intro-grid">

            <div>

              <span className="blue-label">
                EVERYTHING HR NEEDS
              </span>

              <h2>
                One platform for
                <br />
                <span>every HR operation.</span>
              </h2>

            </div>


            <p>
              From the first day an employee joins to everyday
              workforce management, AzentMart keeps your HR
              operations connected and easy to manage.
            </p>

          </div>


          {/* Module cards */}

          <div className="module-grid">

            {modules.map((module) => {

              const Icon = module.icon;

              return (
                <Link
                  to={module.path}
                  className="module-card"
                  key={module.title}
                >

                  <div className="module-icon">
                    <Icon size={22} />
                  </div>

                  <div className="module-number">
                    {String(
                      modules.indexOf(module) + 1
                    ).padStart(2, "0")}
                  </div>

                  <h3>
                    {module.title}
                  </h3>

                  <p>
                    {module.description}
                  </p>

                  <div className="module-link">
                    Explore
                    <ArrowRight size={15} />
                  </div>

                </Link>
              );

            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          EMPLOYEE MANAGEMENT
      ===================================================== */}

      <section
        className="employees-section"
        id="employees"
      >

        <div className="section-container">

          <div className="section-label">
            02 / EMPLOYEES
          </div>


          <div className="employees-header">

            <div>

              <span className="blue-label">
                YOUR WORKFORCE
              </span>

              <h2>
                Know your people.
                <br />
                <span>Manage them better.</span>
              </h2>

            </div>


            <Link
              to="/employees"
              className="section-button"
            >
              View employees
              <ArrowRight size={16} />
            </Link>

          </div>


          <div className="employee-workspace">

            {/* Employee sidebar */}

            <div className="employee-sidebar">

              <div className="employee-sidebar-title">
                Workforce
              </div>

              <div className="employee-sidebar-item active">
                <Users size={17} />
                All employees
                <span>248</span>
              </div>

              <div className="employee-sidebar-item">
                <BriefcaseBusiness size={17} />
                Departments
              </div>

              <div className="employee-sidebar-item">
                <MapPin size={17} />
                Locations
              </div>

              <div className="employee-sidebar-item">
                <CircleUserRound size={17} />
                Managers
              </div>

              <div className="employee-sidebar-item">
                <UserPlus size={17} />
                New joiners
              </div>

            </div>


            {/* Employee table */}

            <div className="employee-table">

              <div className="employee-table-header">

                <div>
                  <span>EMPLOYEE</span>
                </div>

                <span>DEPARTMENT</span>
                <span>STATUS</span>
                <span>ACTION</span>

              </div>


              {employees.map((employee) => (

                <div
                  className="employee-row"
                  key={employee.name}
                >

                  <div className="employee-name">

                    <div className="employee-avatar">
                      {employee.initials}
                    </div>

                    <div>

                      <strong>
                        {employee.name}
                      </strong>

                      <span>
                        {employee.role}
                      </span>

                    </div>

                  </div>


                  <span className="department">
                    {employee.department}
                  </span>


                  <span
                    className={
                      employee.status === "Present"
                        ? "status present"
                        : "status leave"
                    }
                  >
                    <i></i>
                    {employee.status}
                  </span>


                  <button className="row-action">
                    <ChevronRight size={17} />
                  </button>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OPERATIONS
      ===================================================== */}

      <section
        className="operations-section"
        id="operations"
      >

        <div className="section-container">

          <div className="section-label light-label">
            03 / HR OPERATIONS
          </div>


          <div className="operations-heading">

            <div>

              <span className="light-blue-label">
                SIMPLE OPERATIONS
              </span>

              <h2>
                From attendance
                <br />
                <span>to onboarding.</span>
              </h2>

            </div>


            <p>
              Give HR teams the visibility they need to
              handle everyday workforce operations quickly
              and consistently.
            </p>

          </div>


          <div className="operations-grid">

            {/* Attendance */}

            <div className="operation-card large">

              <div className="operation-card-top">

                <div className="operation-icon">
                  <CalendarCheck size={21} />
                </div>

                <span>
                  ATTENDANCE
                </span>

              </div>


              <h3>
                See attendance
                <br />
                at a glance.
              </h3>


              <p>
                Monitor presence, late marks, shifts and
                working patterns from one place.
              </p>


              <div className="attendance-bars">

                <div>
                  <span>Mon</span>
                  <i style={{ height: "72%" }}></i>
                </div>

                <div>
                  <span>Tue</span>
                  <i style={{ height: "88%" }}></i>
                </div>

                <div>
                  <span>Wed</span>
                  <i style={{ height: "76%" }}></i>
                </div>

                <div>
                  <span>Thu</span>
                  <i style={{ height: "94%" }}></i>
                </div>

                <div>
                  <span>Fri</span>
                  <i style={{ height: "82%" }}></i>
                </div>

                <div>
                  <span>Sat</span>
                  <i style={{ height: "45%" }}></i>
                </div>

              </div>

            </div>


            {/* Onboarding */}

            <div className="operation-card">

              <div className="operation-card-top">

                <div className="operation-icon green">
                  <UserPlus size={21} />
                </div>

                <span>
                  ONBOARDING
                </span>

              </div>


              <h3>
                Keep every
                <br />
                new joiner moving.
              </h3>


              <div className="onboarding-progress">

                <div className="progress-heading">
                  <span>
                    Onboarding progress
                  </span>

                  <strong>
                    78%
                  </strong>
                </div>

                <div className="progress-track">
                  <span></span>
                </div>

              </div>


              <div className="onboarding-steps">

                <div className="completed">
                  <CheckCircle2 size={15} />
                  Documents
                </div>

                <div className="completed">
                  <CheckCircle2 size={15} />
                  Verification
                </div>

                <div>
                  <Clock3 size={15} />
                  Orientation
                </div>

              </div>

            </div>


            {/* Leave */}

            <div className="operation-card">

              <div className="operation-card-top">

                <div className="operation-icon orange">
                  <CalendarDays size={21} />
                </div>

                <span>
                  LEAVE
                </span>

              </div>


              <h3>
                Approvals without
                <br />
                the back-and-forth.
              </h3>


              <div className="leave-summary">

                <div>
                  <strong>08</strong>
                  <span>Pending</span>
                </div>

                <div>
                  <strong>31</strong>
                  <span>Approved</span>
                </div>

                <div>
                  <strong>04</strong>
                  <span>Rejected</span>
                </div>

              </div>


              <Link
                to="/leave"
                className="operation-link"
              >
                Manage leave
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          AI INTELLIGENCE
      ===================================================== */}

      <section
        className="intelligence-section"
        id="intelligence"
      >

        <div className="section-container">

          <div className="section-label">
            04 / INTELLIGENCE
          </div>


          <div className="intelligence-heading">

            <div>

              <span className="blue-label">
                AI HR ASSISTANT
              </span>

              <h2>
                HR answers,
                <br />
                <span>without the searching.</span>
              </h2>

            </div>


            <p>
              Ask questions about your workforce and get
              useful answers without moving between
              spreadsheets and HR systems.
            </p>

          </div>


          <div className="ai-workspace">

            <div className="ai-sidebar">

              <div className="ai-sidebar-title">
                People Intelligence
              </div>

              <div className="ai-sidebar-item active">
                <Sparkles size={16} />
                HR Assistant
              </div>

              <div className="ai-sidebar-item">
                <BarChart3 size={16} />
                Workforce insights
              </div>

              <div className="ai-sidebar-item">
                <CalendarCheck size={16} />
                Attendance
              </div>

              <div className="ai-sidebar-item">
                <Users size={16} />
                Employees
              </div>

            </div>


            <div className="ai-chat">

              <div className="ai-chat-header">

                <div className="ai-agent">

                  <div className="ai-agent-icon">
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <strong>
                      People Intelligence
                    </strong>

                    <span>
                      AI HR Assistant
                    </span>
                  </div>

                </div>


                <span className="ai-online">
                  <i></i>
                  Online
                </span>

              </div>


              <div className="conversation">

                <div className="chat-user">
                  Show me this month's workforce overview.
                </div>


                <div className="chat-answer">

                  <div className="chat-avatar">
                    <Sparkles size={14} />
                  </div>

                  <div>

                    <p>
                      Here's the latest workforce overview.
                    </p>


                    <div className="answer-metrics">

                      <div>
                        <span>Total employees</span>
                        <strong>248</strong>
                      </div>

                      <div>
                        <span>Attendance</span>
                        <strong>93.1%</strong>
                      </div>

                      <div>
                        <span>New joiners</span>
                        <strong>12</strong>
                      </div>

                    </div>

                  </div>

                </div>


                <div className="suggestions">

                  <button>
                    Attendance trends
                  </button>

                  <button>
                    Who is on leave?
                  </button>

                  <button>
                    New employees
                  </button>

                </div>

              </div>


              <div className="ai-input">

                <span>
                  Ask anything about your workforce...
                </span>

                <ArrowRight size={17} />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="final-section">

        <div className="final-container">

          <div>

            <span className="blue-label">
              MODERN HR STARTS HERE
            </span>

            <h2>
              Give your HR team
              <br />
              <span>one place to work.</span>
            </h2>

            <p>
              Bring employees, attendance, onboarding,
              documents and workforce intelligence together.
            </p>

          </div>


          <div className="final-actions">

            <Link
              to="/signup"
              className="hero-primary"
            >
              Get started
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/login"
              className="final-login"
            >
              Already have an account?
              <span>Sign in</span>
            </Link>

          </div>

        </div>

      </section>


      <HRChatbot publicMode />

      <HRFooter />

    </div>
  );
}

export default Home;