const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Home/Home.jsx";import React from "react";
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

import HRChatbot from "../../components/HRChatbot.js";
import HRFooter from "../../components/HRFooter.js";


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
    React.createElement('div', { className: "hr-home", __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}

      /* =====================================================
          NAVBAR
      ===================================================== */

      , React.createElement('header', { className: "hr-nav", __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}

        , React.createElement('div', { className: "hr-nav-inner", __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}

          , React.createElement(Link, { to: "/", className: "hr-logo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}

            , React.createElement('img', {
              className: "hr-logo-image",
              src: "/agent-apps/hr/assets/logo.svg",
              alt: "AzentMart AI" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
            )

          )


          , React.createElement('nav', { className: `hr-navigation ${menuOpen ? "show" : ""}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}

            , React.createElement('a', { href: "#dashboard", onClick: () => setMenuOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, "Overview"

            )

            , React.createElement('a', { href: "#platform", onClick: () => setMenuOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, "Platform"

            )

            , React.createElement('a', { href: "#employees", onClick: () => setMenuOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "Employees"

            )

            , React.createElement('a', { href: "#operations", onClick: () => setMenuOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}, "Operations"

            )

            , React.createElement('a', { href: "#intelligence", onClick: () => setMenuOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}, "Intelligence"

            )

            , React.createElement(Link, { to: "/login", className: "mobile-login", __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}, "Sign in"

            )

          )


          , React.createElement('div', { className: "nav-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}

            , React.createElement(Link, { to: "/login", className: "nav-login", __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}, "Sign in"

            )

            , React.createElement(Link, { to: "/signup", className: "nav-button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}, "Get started"

              , React.createElement(ArrowRight, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}} )
            )

          )


          , React.createElement('button', {
            className: "mobile-menu",
            onClick: () => setMenuOpen(!menuOpen), __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}

            , menuOpen
              ? React.createElement(X, { size: 23, __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}} )
              : React.createElement(Menu, { size: 23, __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}} )
            
          )

        )

      )


      /* =====================================================
          HERO
      ===================================================== */

      , React.createElement('section', { className: "hero-section", id: "dashboard", __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}

        , React.createElement('div', { className: "hero-container", __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}

          , React.createElement('div', { className: "hero-copy", __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}

            , React.createElement('div', { className: "hero-badge", __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}), "MODERN PEOPLE OPERATIONS"

            )


            , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}, "Your entire"

              , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 207}} ), "workforce,"

              , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 209}} )
              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}, "in one place."  )
            )


            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}, "Manage employees, attendance, onboarding, leave, documents and workforce operations from one intelligent HR platform."



            )


            , React.createElement('div', { className: "hero-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}

              , React.createElement(Link, {
                to: "/signup",
                className: "hero-primary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
, "Start building your workforce"

                , React.createElement(ArrowRight, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}} )
              )

              , React.createElement('a', {
                href: "#platform",
                className: "hero-secondary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
, "Explore platform"

                , React.createElement(ChevronRight, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}} )
              )

            )


            , React.createElement('div', { className: "hero-stats", __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}, "248")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}, "Employees managed" )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}, "93.1%")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}, "Attendance today" )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}, "12")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}, "New joiners" )
              )

            )

          )


          /* =================================================
              HERO DASHBOARD
          ================================================= */

          , React.createElement('div', { className: "hero-dashboard", __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}

            , React.createElement('div', { className: "dashboard-shell", __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}

              /* Dashboard header */

              , React.createElement('div', { className: "dashboard-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}

                  , React.createElement('span', { className: "dashboard-small", __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}, "PEOPLE OPERATIONS"

                  )

                  , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}, "Workforce overview"

                  )

                )


                , React.createElement('div', { className: "dashboard-header-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}

                  , React.createElement('button', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
                    , React.createElement(Search, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}} )
                  )

                  , React.createElement('button', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}
                    , React.createElement(Bell, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}} )
                    , React.createElement('span', { className: "notification-dot", __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}})
                  )

                  , React.createElement('div', { className: "dashboard-user", __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}, "HR"

                  )

                )

              )


              /* Dashboard navigation */

              , React.createElement('div', { className: "dashboard-tabs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}

                , React.createElement('span', { className: "active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}, "Overview"

                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}, "Employees"

                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}, "Attendance"

                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}, "Leave"

                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}, "Payroll"

                )

              )


              /* Metric cards */

              , React.createElement('div', { className: "dashboard-metrics", __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}

                , React.createElement('div', { className: "dashboard-metric", __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}

                  , React.createElement('div', { className: "metric-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}, "Total employees" )

                    , React.createElement('div', { className: "metric-blue", __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}
                      , React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 347}} )
                    )

                  )

                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}, "248")

                  , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 354}}
                    , React.createElement(TrendingUp, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}} ), "8.4% this month"

                  )

                )


                , React.createElement('div', { className: "dashboard-metric", __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}

                  , React.createElement('div', { className: "metric-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}, "Present today" )

                    , React.createElement('div', { className: "metric-green", __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}
                      , React.createElement(CalendarCheck, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}} )
                    )

                  )

                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}, "231")

                  , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}, "93.1% attendance"

                  )

                )


                , React.createElement('div', { className: "dashboard-metric", __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}

                  , React.createElement('div', { className: "metric-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 385}}

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}, "On leave" )

                    , React.createElement('div', { className: "metric-orange", __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}
                      , React.createElement(Clock3, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}} )
                    )

                  )

                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}, "17")

                  , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 397}}, "6.9% of workforce"

                  )

                )


                , React.createElement('div', { className: "dashboard-metric", __self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}

                  , React.createElement('div', { className: "metric-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}, "New joiners" )

                    , React.createElement('div', { className: "metric-purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}
                      , React.createElement(UserPlus, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}} )
                    )

                  )

                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}, "12")

                  , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}, "This month"

                  )

                )

              )


              /* Dashboard body */

              , React.createElement('div', { className: "dashboard-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}

                /* Attendance */

                , React.createElement('div', { className: "attendance-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}

                  , React.createElement('div', { className: "card-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}

                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}, "ATTENDANCE")
                      , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}, "Today's attendance" )
                    )

                    , React.createElement('button', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 442}}
                      , React.createElement(MoreHorizontal, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 443}} )
                    )

                  )


                  , React.createElement('div', { className: "attendance-content", __self: this, __source: {fileName: _jsxFileName, lineNumber: 449}}

                    , React.createElement('div', { className: "attendance-circle", __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 453}}

                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 455}}, "93%")

                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 457}}, "Present"

                        )

                      )

                    )


                    , React.createElement('div', { className: "attendance-details", __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 468}}
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 469}}, "Present"

                        )
                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}, "231")
                      )

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 476}}, "Late"

                        )
                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 479}}, "9")
                      )

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 482}}
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 483}}, "Absent"

                        )
                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 486}}, "8")
                      )

                    )

                  )

                )


                /* Leave */

                , React.createElement('div', { className: "leave-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}}

                  , React.createElement('div', { className: "card-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}

                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 502}}
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 503}}, "LEAVE REQUESTS" )
                      , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 504}}, "Needs attention" )
                    )

                    , React.createElement(Link, { to: "/leave", __self: this, __source: {fileName: _jsxFileName, lineNumber: 507}}, "View all"

                    )

                  )


                  , React.createElement('div', { className: "leave-list", __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}

                    , React.createElement('div', { className: "leave-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 516}}

                      , React.createElement('div', { className: "mini-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 518}}, "AK"

                      )

                      , React.createElement('div', { className: "leave-person", __self: this, __source: {fileName: _jsxFileName, lineNumber: 522}}

                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 524}}, "Arun Kumar"

                        )

                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 528}}, "Casual Leave · 2 days"

                        )

                      )

                      , React.createElement('button', { className: "approve", __self: this, __source: {fileName: _jsxFileName, lineNumber: 534}}, "Review"

                      )

                    )


                    , React.createElement('div', { className: "leave-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 541}}

                      , React.createElement('div', { className: "mini-avatar purple" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 543}}, "SP"

                      )

                      , React.createElement('div', { className: "leave-person", __self: this, __source: {fileName: _jsxFileName, lineNumber: 547}}

                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 549}}, "Sneha Priya"

                        )

                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 553}}, "Sick Leave · 1 day"

                        )

                      )

                      , React.createElement('button', { className: "approve", __self: this, __source: {fileName: _jsxFileName, lineNumber: 559}}, "Review"

                      )

                    )


                    , React.createElement('div', { className: "leave-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 566}}

                      , React.createElement('div', { className: "mini-avatar orange" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 568}}, "RM"

                      )

                      , React.createElement('div', { className: "leave-person", __self: this, __source: {fileName: _jsxFileName, lineNumber: 572}}

                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}, "Rajesh M"

                        )

                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 578}}, "Earned Leave · 3 days"

                        )

                      )

                      , React.createElement('button', { className: "approve", __self: this, __source: {fileName: _jsxFileName, lineNumber: 584}}, "Review"

                      )

                    )

                  )

                )

              )


              /* Bottom dashboard row */

              , React.createElement('div', { className: "dashboard-bottom-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 599}}

                , React.createElement('div', { className: "quick-stat", __self: this, __source: {fileName: _jsxFileName, lineNumber: 601}}

                  , React.createElement('div', { className: "quick-icon blue" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 603}}
                    , React.createElement(BriefcaseBusiness, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 604}} )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 607}}
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 608}}, "Open positions" )
                    , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 609}}, "18")
                  )

                )


                , React.createElement('div', { className: "quick-stat", __self: this, __source: {fileName: _jsxFileName, lineNumber: 615}}

                  , React.createElement('div', { className: "quick-icon green" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 617}}
                    , React.createElement(UserPlus, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 618}} )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 621}}
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}, "Onboarding")
                    , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 623}}, "24")
                  )

                )


                , React.createElement('div', { className: "quick-stat", __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}

                  , React.createElement('div', { className: "quick-icon purple" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 631}}
                    , React.createElement(FileText, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 632}} )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 635}}
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 636}}, "Documents")
                    , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 637}}, "96%")
                  )

                )


                , React.createElement('div', { className: "quick-stat", __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}}

                  , React.createElement('div', { className: "quick-icon orange" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 645}}
                    , React.createElement(BarChart3, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 646}} )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 649}}
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 650}}, "Workforce health" )
                    , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}, "Good")
                  )

                )

              )

            )

          )

        )

      )


      /* =====================================================
          PLATFORM INTRO
      ===================================================== */

      , React.createElement('section', { className: "platform-intro", id: "platform", __self: this, __source: {fileName: _jsxFileName, lineNumber: 671}}

        , React.createElement('div', { className: "section-container", __self: this, __source: {fileName: _jsxFileName, lineNumber: 673}}

          , React.createElement('div', { className: "section-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 675}}, "01 / PLATFORM"

          )


          , React.createElement('div', { className: "platform-intro-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 680}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 682}}

              , React.createElement('span', { className: "blue-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 684}}, "EVERYTHING HR NEEDS"

              )

              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 688}}, "One platform for"

                , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 690}} )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 691}}, "every HR operation."  )
              )

            )


            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 697}}, "From the first day an employee joins to everyday workforce management, AzentMart keeps your HR operations connected and easy to manage."



            )

          )


          /* Module cards */

          , React.createElement('div', { className: "module-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 708}}

            , modules.map((module) => {

              const Icon = module.icon;

              return (
                React.createElement(Link, {
                  to: module.path,
                  className: "module-card",
                  key: module.title, __self: this, __source: {fileName: _jsxFileName, lineNumber: 715}}


                  , React.createElement('div', { className: "module-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 721}}
                    , React.createElement(Icon, { size: 22, __self: this, __source: {fileName: _jsxFileName, lineNumber: 722}} )
                  )

                  , React.createElement('div', { className: "module-number", __self: this, __source: {fileName: _jsxFileName, lineNumber: 725}}
                    , String(
                      modules.indexOf(module) + 1
                    ).padStart(2, "0")
                  )

                  , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 731}}
                    , module.title
                  )

                  , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 735}}
                    , module.description
                  )

                  , React.createElement('div', { className: "module-link", __self: this, __source: {fileName: _jsxFileName, lineNumber: 739}}, "Explore"

                    , React.createElement(ArrowRight, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 741}} )
                  )

                )
              );

            })

          )

        )

      )


      /* =====================================================
          EMPLOYEE MANAGEMENT
      ===================================================== */

      , React.createElement('section', {
        className: "employees-section",
        id: "employees", __self: this, __source: {fileName: _jsxFileName, lineNumber: 760}}


        , React.createElement('div', { className: "section-container", __self: this, __source: {fileName: _jsxFileName, lineNumber: 765}}

          , React.createElement('div', { className: "section-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 767}}, "02 / EMPLOYEES"

          )


          , React.createElement('div', { className: "employees-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 772}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 774}}

              , React.createElement('span', { className: "blue-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 776}}, "YOUR WORKFORCE"

              )

              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 780}}, "Know your people."

                , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 782}} )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 783}}, "Manage them better."  )
              )

            )


            , React.createElement(Link, {
              to: "/employees",
              className: "section-button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 789}}
, "View employees"

              , React.createElement(ArrowRight, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 794}} )
            )

          )


          , React.createElement('div', { className: "employee-workspace", __self: this, __source: {fileName: _jsxFileName, lineNumber: 800}}

            /* Employee sidebar */

            , React.createElement('div', { className: "employee-sidebar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 804}}

              , React.createElement('div', { className: "employee-sidebar-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 806}}, "Workforce"

              )

              , React.createElement('div', { className: "employee-sidebar-item active" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 810}}
                , React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 811}} ), "All employees"

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 813}}, "248")
              )

              , React.createElement('div', { className: "employee-sidebar-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 816}}
                , React.createElement(BriefcaseBusiness, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 817}} ), "Departments"

              )

              , React.createElement('div', { className: "employee-sidebar-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 821}}
                , React.createElement(MapPin, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 822}} ), "Locations"

              )

              , React.createElement('div', { className: "employee-sidebar-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 826}}
                , React.createElement(CircleUserRound, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 827}} ), "Managers"

              )

              , React.createElement('div', { className: "employee-sidebar-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 831}}
                , React.createElement(UserPlus, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 832}} ), "New joiners"

              )

            )


            /* Employee table */

            , React.createElement('div', { className: "employee-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 841}}

              , React.createElement('div', { className: "employee-table-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 843}}

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 845}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 846}}, "EMPLOYEE")
                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 849}}, "DEPARTMENT")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 850}}, "STATUS")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 851}}, "ACTION")

              )


              , employees.map((employee) => (

                React.createElement('div', {
                  className: "employee-row",
                  key: employee.name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 858}}


                  , React.createElement('div', { className: "employee-name", __self: this, __source: {fileName: _jsxFileName, lineNumber: 863}}

                    , React.createElement('div', { className: "employee-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 865}}
                      , employee.initials
                    )

                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 869}}

                      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 871}}
                        , employee.name
                      )

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 875}}
                        , employee.role
                      )

                    )

                  )


                  , React.createElement('span', { className: "department", __self: this, __source: {fileName: _jsxFileName, lineNumber: 884}}
                    , employee.department
                  )


                  , React.createElement('span', {
                    className: 
                      employee.status === "Present"
                        ? "status present"
                        : "status leave"
                    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 889}}

                    , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 896}})
                    , employee.status
                  )


                  , React.createElement('button', { className: "row-action", __self: this, __source: {fileName: _jsxFileName, lineNumber: 901}}
                    , React.createElement(ChevronRight, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 902}} )
                  )

                )

              ))

            )

          )

        )

      )


      /* =====================================================
          OPERATIONS
      ===================================================== */

      , React.createElement('section', {
        className: "operations-section",
        id: "operations", __self: this, __source: {fileName: _jsxFileName, lineNumber: 922}}


        , React.createElement('div', { className: "section-container", __self: this, __source: {fileName: _jsxFileName, lineNumber: 927}}

          , React.createElement('div', { className: "section-label light-label" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 929}}, "03 / HR OPERATIONS"

          )


          , React.createElement('div', { className: "operations-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 934}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 936}}

              , React.createElement('span', { className: "light-blue-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 938}}, "SIMPLE OPERATIONS"

              )

              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 942}}, "From attendance"

                , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 944}} )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 945}}, "to onboarding." )
              )

            )


            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 951}}, "Give HR teams the visibility they need to handle everyday workforce operations quickly and consistently."



            )

          )


          , React.createElement('div', { className: "operations-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 960}}

            /* Attendance */

            , React.createElement('div', { className: "operation-card large" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 964}}

              , React.createElement('div', { className: "operation-card-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 966}}

                , React.createElement('div', { className: "operation-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 968}}
                  , React.createElement(CalendarCheck, { size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 969}} )
                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 972}}, "ATTENDANCE"

                )

              )


              , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 979}}, "See attendance"

                , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 981}} ), "at a glance."

              )


              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 986}}, "Monitor presence, late marks, shifts and working patterns from one place."


              )


              , React.createElement('div', { className: "attendance-bars", __self: this, __source: {fileName: _jsxFileName, lineNumber: 992}}

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 994}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 995}}, "Mon")
                  , React.createElement('i', { style: { height: "72%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 996}})
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 999}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1000}}, "Tue")
                  , React.createElement('i', { style: { height: "88%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1001}})
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1004}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1005}}, "Wed")
                  , React.createElement('i', { style: { height: "76%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1006}})
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1009}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1010}}, "Thu")
                  , React.createElement('i', { style: { height: "94%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1011}})
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1014}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1015}}, "Fri")
                  , React.createElement('i', { style: { height: "82%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1016}})
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1019}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1020}}, "Sat")
                  , React.createElement('i', { style: { height: "45%" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1021}})
                )

              )

            )


            /* Onboarding */

            , React.createElement('div', { className: "operation-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1031}}

              , React.createElement('div', { className: "operation-card-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1033}}

                , React.createElement('div', { className: "operation-icon green" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1035}}
                  , React.createElement(UserPlus, { size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1036}} )
                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1039}}, "ONBOARDING"

                )

              )


              , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1046}}, "Keep every"

                , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1048}} ), "new joiner moving."

              )


              , React.createElement('div', { className: "onboarding-progress", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1053}}

                , React.createElement('div', { className: "progress-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1055}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1056}}, "Onboarding progress"

                  )

                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1060}}, "78%"

                  )
                )

                , React.createElement('div', { className: "progress-track", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1065}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1066}})
                )

              )


              , React.createElement('div', { className: "onboarding-steps", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1072}}

                , React.createElement('div', { className: "completed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1074}}
                  , React.createElement(CheckCircle2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1075}} ), "Documents"

                )

                , React.createElement('div', { className: "completed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1079}}
                  , React.createElement(CheckCircle2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1080}} ), "Verification"

                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1084}}
                  , React.createElement(Clock3, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1085}} ), "Orientation"

                )

              )

            )


            /* Leave */

            , React.createElement('div', { className: "operation-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1096}}

              , React.createElement('div', { className: "operation-card-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1098}}

                , React.createElement('div', { className: "operation-icon orange" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1100}}
                  , React.createElement(CalendarDays, { size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1101}} )
                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1104}}, "LEAVE"

                )

              )


              , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1111}}, "Approvals without"

                , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1113}} ), "the back-and-forth."

              )


              , React.createElement('div', { className: "leave-summary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1118}}

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1120}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1121}}, "08")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1122}}, "Pending")
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1125}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1126}}, "31")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1127}}, "Approved")
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1130}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1131}}, "04")
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1132}}, "Rejected")
                )

              )


              , React.createElement(Link, {
                to: "/leave",
                className: "operation-link", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1138}}
, "Manage leave"

                , React.createElement(ArrowRight, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1143}} )
              )

            )

          )

        )

      )


      /* =====================================================
          AI INTELLIGENCE
      ===================================================== */

      , React.createElement('section', {
        className: "intelligence-section",
        id: "intelligence", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1159}}


        , React.createElement('div', { className: "section-container", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1164}}

          , React.createElement('div', { className: "section-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1166}}, "04 / INTELLIGENCE"

          )


          , React.createElement('div', { className: "intelligence-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1171}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1173}}

              , React.createElement('span', { className: "blue-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1175}}, "AI HR ASSISTANT"

              )

              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1179}}, "HR answers,"

                , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1181}} )
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1182}}, "without the searching."  )
              )

            )


            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1188}}, "Ask questions about your workforce and get useful answers without moving between spreadsheets and HR systems."



            )

          )


          , React.createElement('div', { className: "ai-workspace", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1197}}

            , React.createElement('div', { className: "ai-sidebar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1199}}

              , React.createElement('div', { className: "ai-sidebar-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1201}}, "People Intelligence"

              )

              , React.createElement('div', { className: "ai-sidebar-item active" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1205}}
                , React.createElement(Sparkles, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1206}} ), "HR Assistant"

              )

              , React.createElement('div', { className: "ai-sidebar-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1210}}
                , React.createElement(BarChart3, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1211}} ), "Workforce insights"

              )

              , React.createElement('div', { className: "ai-sidebar-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1215}}
                , React.createElement(CalendarCheck, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1216}} ), "Attendance"

              )

              , React.createElement('div', { className: "ai-sidebar-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1220}}
                , React.createElement(Users, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1221}} ), "Employees"

              )

            )


            , React.createElement('div', { className: "ai-chat", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1228}}

              , React.createElement('div', { className: "ai-chat-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1230}}

                , React.createElement('div', { className: "ai-agent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1232}}

                  , React.createElement('div', { className: "ai-agent-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1234}}
                    , React.createElement(Sparkles, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1235}} )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1238}}
                    , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1239}}, "People Intelligence"

                    )

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1243}}, "AI HR Assistant"

                    )
                  )

                )


                , React.createElement('span', { className: "ai-online", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1251}}
                  , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1252}}), "Online"

                )

              )


              , React.createElement('div', { className: "conversation", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1259}}

                , React.createElement('div', { className: "chat-user", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1261}}, "Show me this month's workforce overview."

                )


                , React.createElement('div', { className: "chat-answer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1266}}

                  , React.createElement('div', { className: "chat-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1268}}
                    , React.createElement(Sparkles, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1269}} )
                  )

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1272}}

                    , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1274}}, "Here's the latest workforce overview."

                    )


                    , React.createElement('div', { className: "answer-metrics", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1279}}

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1281}}
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1282}}, "Total employees" )
                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1283}}, "248")
                      )

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1286}}
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1287}}, "Attendance")
                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1288}}, "93.1%")
                      )

                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1291}}
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1292}}, "New joiners" )
                        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1293}}, "12")
                      )

                    )

                  )

                )


                , React.createElement('div', { className: "suggestions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1303}}

                  , React.createElement('button', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1305}}, "Attendance trends"

                  )

                  , React.createElement('button', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1309}}, "Who is on leave?"

                  )

                  , React.createElement('button', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1313}}, "New employees"

                  )

                )

              )


              , React.createElement('div', { className: "ai-input", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1322}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1324}}, "Ask anything about your workforce..."

                )

                , React.createElement(ArrowRight, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1328}} )

              )

            )

          )

        )

      )


      /* =====================================================
          FINAL CTA
      ===================================================== */

      , React.createElement('section', { className: "final-section", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1345}}

        , React.createElement('div', { className: "final-container", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1347}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1349}}

            , React.createElement('span', { className: "blue-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1351}}, "MODERN HR STARTS HERE"

            )

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1355}}, "Give your HR team"

              , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1357}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1358}}, "one place to work."   )
            )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1361}}, "Bring employees, attendance, onboarding, documents and workforce intelligence together."


            )

          )


          , React.createElement('div', { className: "final-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1369}}

            , React.createElement(Link, {
              to: "/signup",
              className: "hero-primary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1371}}
, "Get started"

              , React.createElement(ArrowRight, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1376}} )
            )

            , React.createElement(Link, {
              to: "/login",
              className: "final-login", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1379}}
, "Already have an account?"

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1384}}, "Sign in" )
            )

          )

        )

      )


      , React.createElement(HRChatbot, { publicMode: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1394}} )

      , React.createElement(HRFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1396}} )

    )
  );
}

export default Home;