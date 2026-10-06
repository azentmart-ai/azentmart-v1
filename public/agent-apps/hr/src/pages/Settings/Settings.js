const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Settings/Settings.jsx";import React, { useState } from "react";

import {
  Activity,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe2,
  KeyRound,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  WalletCards,
  Zap,
} from "lucide-react";

const categories = [
  {
    id: "organization",
    title: "Organization",
    description: "Company profile and workspace",
    icon: Building2,
  },
  {
    id: "people",
    title: "People & Access",
    description: "Users, roles and permissions",
    icon: UsersRound,
  },
  {
    id: "attendance",
    title: "Attendance",
    description: "Working hours and shifts",
    icon: Clock3,
  },
  {
    id: "leave",
    title: "Leave",
    description: "Leave rules and approvals",
    icon: CalendarDays,
  },
  {
    id: "payroll",
    title: "Payroll",
    description: "Salary and payroll controls",
    icon: WalletCards,
  },
  {
    id: "security",
    title: "Security",
    description: "Authentication and protection",
    icon: ShieldCheck,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Email and workflow alerts",
    icon: Bell,
  },
  {
    id: "password",
    title: "Password",
    description: "Account password policy",
    icon: KeyRound,
  },
];

export default function Settings() {
  const [active, setActive] = useState("organization");

  const [settings, setSettings] = useState({
    companyName: "AzentMart",
    workspace: "People Operations",
    timezone: "Asia/Kolkata",
    workWeek: "Monday - Friday",

    employeeAccess: true,
    managerAccess: true,
    hrApproval: true,

    attendance: true,
    overtime: true,
    breakTracking: true,

    leaveApproval: true,
    holidayCalendar: true,

    payroll: true,
    pf: true,
    tds: true,

    twoFactor: true,
    auditLogs: true,
    sessionTimeout: true,

    emailNotifications: true,
    leaveNotifications: true,
    payrollNotifications: true,

    passwordPolicy: true,
  });

  const update = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveChanges = () => {
    alert("Settings saved successfully.");
  };

  const activeCategory =
    categories.find((item) => item.id === active) || categories[0];

  return (
    React.createElement('div', { className: "settings-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}

      /* =====================================================
          PAGE HEADER
      ===================================================== */

      , React.createElement('div', { className: "settings-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}

        , React.createElement('div', { className: "settings-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}

          , React.createElement('span', { className: "settings-kicker", __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, "ADMINISTRATION / CONFIGURATION"

          )

          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, "Workspace Settings" )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, "Configure how AzentMart People Operations manages employees, HR workflows, security and organization rules."


          )

        )

        , React.createElement('div', { className: "settings-header-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}

          , React.createElement('div', { className: "settings-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
            , React.createElement('span', { className: "settings-status-dot", __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}} ), "System operational"

          )

          , React.createElement('button', {
            className: "settings-primary-button",
            onClick: saveChanges, __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}

            , React.createElement(Save, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}} ), "Save changes"

          )

        )

      )


      /* =====================================================
          CATEGORY STRIP
      ===================================================== */

      , React.createElement('section', { className: "settings-category-area", __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}

        , React.createElement('div', { className: "section-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}, "CONFIGURATION")
            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}, "Workspace controls" )
          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}, "Select an area to manage its settings."

          )

        )


        , React.createElement('div', { className: "settings-category-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}

          , categories.map((category) => {

            const Icon = category.icon;

            const selected =
              active === category.id;

            return (
              React.createElement('button', {
                key: category.id,
                className: `settings-category ${
                  selected ? "selected" : ""
                }`,
                onClick: () => setActive(category.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}


                , React.createElement('div', {
                  className: `settings-category-icon ${
                    selected ? "selected-icon" : ""
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}

                  , React.createElement(Icon, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}} )
                )

                , React.createElement('div', { className: "settings-category-copy", __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}

                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}
                    , category.title
                  )

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}
                    , category.description
                  )

                )

                , selected && (
                  React.createElement(CheckCircle2, {
                    className: "category-check",
                    size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}
                  )
                )

              )
            );
          })

        )

      )


      /* =====================================================
          ACTIVE SECTION HEADER
      ===================================================== */

      , React.createElement('div', { className: "active-section-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}

        , React.createElement('div', { className: "active-section-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}

          , React.createElement('div', { className: "active-section-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
            , React.createElement(activeCategory.icon, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}} )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}, "CURRENT CONFIGURATION"

            )

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}
              , activeCategory.title
            )

          )

        )

        , React.createElement('span', { className: "configuration-badge", __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}
          , React.createElement(SlidersHorizontal, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}} ), "Configuration"

        )

      )


      /* =====================================================
          ORGANIZATION
      ===================================================== */

      , active === "organization" && (
        React.createElement(OrganizationSection, {
          settings: settings,
          update: update, __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}
        )
      )


      /* =====================================================
          PEOPLE
      ===================================================== */

      , active === "people" && (
        React.createElement(PeopleSection, {
          settings: settings,
          update: update, __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
        )
      )


      /* =====================================================
          ATTENDANCE
      ===================================================== */

      , active === "attendance" && (
        React.createElement(AttendanceSection, {
          settings: settings,
          update: update, __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}
        )
      )


      /* =====================================================
          LEAVE
      ===================================================== */

      , active === "leave" && (
        React.createElement(LeaveSection, {
          settings: settings,
          update: update, __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}
        )
      )


      /* =====================================================
          PAYROLL
      ===================================================== */

      , active === "payroll" && (
        React.createElement(PayrollSection, {
          settings: settings,
          update: update, __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}
        )
      )


      /* =====================================================
          SECURITY
      ===================================================== */

      , active === "security" && (
        React.createElement(SecuritySection, {
          settings: settings,
          update: update, __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
        )
      )


      /* =====================================================
          NOTIFICATIONS
      ===================================================== */

      , active === "notifications" && (
        React.createElement(NotificationSection, {
          settings: settings,
          update: update, __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}
        )
      )


      /* =====================================================
          PASSWORD
      ===================================================== */

      , active === "password" && (
        React.createElement(PasswordSection, {
          settings: settings,
          update: update, __self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}
        )
      )


      /* =====================================================
          SYSTEM STATUS
      ===================================================== */

      , React.createElement('section', { className: "system-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}

        , React.createElement('div', { className: "system-status-main", __self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}

          , React.createElement('div', { className: "system-status-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}
            , React.createElement(Activity, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}} )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}

            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}, "People Operations configuration"

            )

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 388}}, "Your workspace is configured for HR, employee and administrative workflows."


            )

          )

        )


        , React.createElement('div', { className: "system-status-items", __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}

          , React.createElement(StatusItem, {
            label: "Database",
            value: "Connected", __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}
          )

          , React.createElement(StatusItem, {
            label: "Security",
            value: "Protected", __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
          )

          , React.createElement(StatusItem, {
            label: "HR Services" ,
            value: "Active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}
          )

        )

      )

    )
  );
}


/* ============================================================
   ORGANIZATION
============================================================ */

function OrganizationSection({ settings, update }) {
  return (
    React.createElement('div', { className: "settings-content-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 430}}

      , React.createElement('div', { className: "settings-main-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 432}}

        , React.createElement(CardHeading, {
          icon: React.createElement(Building2, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}} ),
          title: "Company information" ,
          description: "Basic information used throughout the HR workspace."      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}
        )

        , React.createElement('div', { className: "settings-fields", __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}

          , React.createElement(Field, {
            label: "Organization name" ,
            value: settings.companyName,
            onChange: (value) =>
              update("companyName", value)
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 442}}
          )

          , React.createElement(Field, {
            label: "Workspace",
            value: settings.workspace,
            onChange: (value) =>
              update("workspace", value)
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 450}}
          )

          , React.createElement(Select, {
            label: "Time zone" ,
            value: settings.timezone,
            options: [
              "Asia/Kolkata",
              "Asia/Dubai",
              "Asia/Singapore",
              "Europe/London",
            ],
            onChange: (value) =>
              update("timezone", value)
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}
          )

          , React.createElement(Select, {
            label: "Working week" ,
            value: settings.workWeek,
            options: [
              "Monday - Friday",
              "Monday - Saturday",
              "Sunday - Thursday",
            ],
            onChange: (value) =>
              update("workWeek", value)
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}
          )

        )

      )


      , React.createElement('div', { className: "settings-side-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}

        , React.createElement(CardHeading, {
          icon: React.createElement(Globe2, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 493}} ),
          title: "Regional setup" ,
          description: "Default regional configuration."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 492}}
        )

        , React.createElement(InfoRow, {
          label: "Time zone" ,
          value: "Asia/Kolkata", __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}}
        )

        , React.createElement(InfoRow, {
          label: "Currency",
          value: "Indian Rupee (₹)"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 503}}
        )

        , React.createElement(InfoRow, {
          label: "Date format" ,
          value: "DD/MM/YYYY", __self: this, __source: {fileName: _jsxFileName, lineNumber: 508}}
        )

        , React.createElement(InfoRow, {
          label: "Workspace",
          value: "People Operations" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 513}}
        )

      )


      , React.createElement('div', { className: "settings-wide-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 521}}

        , React.createElement(CardHeading, {
          icon: React.createElement(Zap, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 524}} ),
          title: "Workspace defaults" ,
          description: "Default behavior applied across HR workflows."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}
        )

        , React.createElement('div', { className: "quick-setting-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 529}}

          , React.createElement(MiniSetting, {
            title: "Employee records" ,
            text: "Central employee information"  ,
            active: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}
          )

          , React.createElement(MiniSetting, {
            title: "HR workflows" ,
            text: "Onboarding and approvals"  ,
            active: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}}
          )

          , React.createElement(MiniSetting, {
            title: "Document management" ,
            text: "Employee document library"  ,
            active: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 543}}
          )

          , React.createElement(MiniSetting, {
            title: "HR support" ,
            text: "Employee service desk"  ,
            active: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 549}}
          )

        )

      )

    )
  );
}


/* ============================================================
   PEOPLE
============================================================ */

function PeopleSection({ settings, update }) {
  return (
    React.createElement('div', { className: "settings-content-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 570}}

      , React.createElement('div', { className: "settings-main-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 572}}

        , React.createElement(CardHeading, {
          icon: React.createElement(UsersRound, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 575}} ),
          title: "People access" ,
          description: "Define who can access employee information."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}
        )

        , React.createElement(Toggle, {
          title: "Employee self-service" ,
          description: "Allow employees to access their own HR information."       ,
          value: settings.employeeAccess,
          onChange: (value) =>
            update("employeeAccess", value)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 580}}
        )

        , React.createElement(Toggle, {
          title: "Manager access" ,
          description: "Allow managers to access permitted team information."      ,
          value: settings.managerAccess,
          onChange: (value) =>
            update("managerAccess", value)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 589}}
        )

        , React.createElement(Toggle, {
          title: "HR approval controls"  ,
          description: "Require HR approval for sensitive employee changes."      ,
          value: settings.hrApproval,
          onChange: (value) =>
            update("hrApproval", value)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 598}}
        )

      )


      , React.createElement('div', { className: "settings-side-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 610}}

        , React.createElement(CardHeading, {
          icon: React.createElement(ShieldCheck, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 613}} ),
          title: "Access model" ,
          description: "Role-based permission structure."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 612}}
        )

        , React.createElement(RoleCard, {
          role: "Employee",
          access: "Personal records" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 618}}
        )

        , React.createElement(RoleCard, {
          role: "Manager",
          access: "Team records" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 623}}
        )

        , React.createElement(RoleCard, {
          role: "HR Manager" ,
          access: "HR operations" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 628}}
        )

        , React.createElement(RoleCard, {
          role: "HR Admin" ,
          access: "Full HR administration"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 633}}
        )

      )

    )
  );
}


/* ============================================================
   ATTENDANCE
============================================================ */

function AttendanceSection({ settings, update }) {
  return (
    React.createElement('div', { className: "settings-content-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}

      , React.createElement('div', { className: "settings-main-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}

        , React.createElement(CardHeading, {
          icon: React.createElement(Clock3, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 656}} ),
          title: "Attendance controls" ,
          description: "Configure employee working-time tracking."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 655}}
        )

        , React.createElement(Toggle, {
          title: "Attendance tracking" ,
          description: "Record employee check-in and check-out activity."     ,
          value: settings.attendance,
          onChange: (value) =>
            update("attendance", value)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 661}}
        )

        , React.createElement(Toggle, {
          title: "Overtime tracking" ,
          description: "Track additional working hours."   ,
          value: settings.overtime,
          onChange: (value) =>
            update("overtime", value)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 670}}
        )

        , React.createElement(Toggle, {
          title: "Break tracking" ,
          description: "Record employee break duration."   ,
          value: settings.breakTracking,
          onChange: (value) =>
            update("breakTracking", value)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 679}}
        )

      )


      , React.createElement('div', { className: "settings-side-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 691}}

        , React.createElement(CardHeading, {
          icon: React.createElement(Clock3, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 694}} ),
          title: "Default schedule" ,
          description: "Current organization schedule."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 693}}
        )

        , React.createElement(InfoRow, {
          label: "Shift",
          value: "09:00 AM - 06:00 PM"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 699}}
        )

        , React.createElement(InfoRow, {
          label: "Grace period" ,
          value: "15 minutes" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 704}}
        )

        , React.createElement(InfoRow, {
          label: "Weekly off" ,
          value: "Saturday & Sunday"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 709}}
        )

        , React.createElement(InfoRow, {
          label: "Overtime",
          value: "Enabled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 714}}
        )

      )

    )
  );
}


/* ============================================================
   LEAVE
============================================================ */

function LeaveSection() {
  return (
    React.createElement('div', { className: "settings-content-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 732}}

      , React.createElement('div', { className: "settings-main-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 734}}

        , React.createElement(CardHeading, {
          icon: React.createElement(CalendarDays, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 737}} ),
          title: "Leave management" ,
          description: "Manage leave workflows and employee approvals."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 736}}
        )

        , React.createElement(InfoRow, {
          label: "Annual leave" ,
          value: "Configured", __self: this, __source: {fileName: _jsxFileName, lineNumber: 742}}
        )

        , React.createElement(InfoRow, {
          label: "Sick leave" ,
          value: "Configured", __self: this, __source: {fileName: _jsxFileName, lineNumber: 747}}
        )

        , React.createElement(InfoRow, {
          label: "Casual leave" ,
          value: "Configured", __self: this, __source: {fileName: _jsxFileName, lineNumber: 752}}
        )

        , React.createElement(InfoRow, {
          label: "Approval workflow" ,
          value: "Manager → HR"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 757}}
        )

      )


      , React.createElement('div', { className: "settings-side-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 765}}

        , React.createElement(CardHeading, {
          icon: React.createElement(CheckCircle2, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 768}} ),
          title: "Leave controls" ,
          description: "Current workflow status."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 767}}
        )

        , React.createElement(StatusBlock, {
          title: "Leave approval" ,
          text: "Manager approval required"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 773}}
        )

        , React.createElement(StatusBlock, {
          title: "Holiday calendar" ,
          text: "2026 company calendar"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 778}}
        )

        , React.createElement(StatusBlock, {
          title: "Regularization",
          text: "HR review enabled"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 783}}
        )

      )

    )
  );
}


/* ============================================================
   PAYROLL
============================================================ */

function PayrollSection() {
  return (
    React.createElement('div', { className: "settings-content-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 801}}

      , React.createElement('div', { className: "settings-main-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 803}}

        , React.createElement(CardHeading, {
          icon: React.createElement(WalletCards, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 806}} ),
          title: "Payroll configuration" ,
          description: "Organization payroll and statutory controls."    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 805}}
        )

        , React.createElement(InfoRow, {
          label: "Payroll cycle" ,
          value: "Monthly", __self: this, __source: {fileName: _jsxFileName, lineNumber: 811}}
        )

        , React.createElement(InfoRow, {
          label: "Provident Fund" ,
          value: "Enabled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 816}}
        )

        , React.createElement(InfoRow, {
          label: "TDS",
          value: "Enabled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 821}}
        )

        , React.createElement(InfoRow, {
          label: "Payroll status" ,
          value: "Active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 826}}
        )

      )


      , React.createElement('div', { className: "settings-side-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 834}}

        , React.createElement(CardHeading, {
          icon: React.createElement(LockKeyhole, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 837}} ),
          title: "Payroll protection" ,
          description: "Payroll access is restricted."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 836}}
        )

        , React.createElement(StatusBlock, {
          title: "HR access" ,
          text: "Authorized HR roles"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 842}}
        )

        , React.createElement(StatusBlock, {
          title: "Payroll records" ,
          text: "Protected", __self: this, __source: {fileName: _jsxFileName, lineNumber: 847}}
        )

        , React.createElement(StatusBlock, {
          title: "Export controls" ,
          text: "Authorized users only"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 852}}
        )

      )

    )
  );
}


/* ============================================================
   SECURITY
============================================================ */

function SecuritySection({
  settings,
  update,
}) {
  return (
    React.createElement('div', { className: "settings-content-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 873}}

      , React.createElement('div', { className: "settings-main-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 875}}

        , React.createElement(CardHeading, {
          icon: React.createElement(ShieldCheck, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 878}} ),
          title: "Security controls" ,
          description: "Protect your employee and HR data."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 877}}
        )

        , React.createElement(Toggle, {
          title: "Two-factor authentication" ,
          description: "Require an additional authentication factor for privileged roles."       ,
          value: settings.twoFactor,
          onChange: (value) =>
            update("twoFactor", value)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 883}}
        )

        , React.createElement(Toggle, {
          title: "Audit logging" ,
          description: "Record important HR and configuration changes."     ,
          value: settings.auditLogs,
          onChange: (value) =>
            update("auditLogs", value)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 892}}
        )

        , React.createElement(Toggle, {
          title: "Session timeout" ,
          description: "Expire inactive sessions automatically."   ,
          value: settings.sessionTimeout,
          onChange: (value) =>
            update("sessionTimeout", value)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 901}}
        )

      )


      , React.createElement('div', { className: "settings-side-card security-highlight" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 913}}

        , React.createElement(ShieldCheck, { size: 24, __self: this, __source: {fileName: _jsxFileName, lineNumber: 915}} )

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 917}}, "Workspace protected"

        )

        , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 921}}, "Role-based access and security controls are enabled for this HR workspace."


        )

      )

    )
  );
}


/* ============================================================
   NOTIFICATIONS
============================================================ */

function NotificationSection({
  settings,
  update,
}) {
  return (
    React.createElement('div', { className: "settings-content-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 942}}

      , React.createElement('div', { className: "settings-main-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 944}}

        , React.createElement(CardHeading, {
          icon: React.createElement(Bell, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 947}} ),
          title: "Notification preferences" ,
          description: "Control HR workflow alerts."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 946}}
        )

        , React.createElement(Toggle, {
          title: "Email notifications" ,
          description: "Send important HR notifications by email."     ,
          value: settings.emailNotifications,
          onChange: (value) =>
            update(
              "emailNotifications",
              value
            )
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 952}}
        )

        , React.createElement(Toggle, {
          title: "Leave notifications" ,
          description: "Notify employees and managers about leave actions."      ,
          value: settings.leaveNotifications,
          onChange: (value) =>
            update(
              "leaveNotifications",
              value
            )
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 964}}
        )

        , React.createElement(Toggle, {
          title: "Payroll notifications" ,
          description: "Send payroll-related notifications."  ,
          value: settings.payrollNotifications,
          onChange: (value) =>
            update(
              "payrollNotifications",
              value
            )
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 976}}
        )

      )


      , React.createElement('div', { className: "settings-side-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 991}}

        , React.createElement(CardHeading, {
          icon: React.createElement(Mail, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 994}} ),
          title: "Notification channels" ,
          description: "Available communication channels."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 993}}
        )

        , React.createElement(StatusBlock, {
          title: "Email",
          text: "Available", __self: this, __source: {fileName: _jsxFileName, lineNumber: 999}}
        )

        , React.createElement(StatusBlock, {
          title: "In-app alerts" ,
          text: "Available", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1004}}
        )

        , React.createElement(StatusBlock, {
          title: "HR workflow alerts"  ,
          text: "Enabled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1009}}
        )

      )

    )
  );
}


/* ============================================================
   PASSWORD
============================================================ */

function PasswordSection({
  settings,
  update,
}) {
  return (
    React.createElement('div', { className: "settings-content-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1030}}

      , React.createElement('div', { className: "settings-main-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1032}}

        , React.createElement(CardHeading, {
          icon: React.createElement(KeyRound, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1035}} ),
          title: "Password policy" ,
          description: "Define account password requirements."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1034}}
        )

        , React.createElement(Toggle, {
          title: "Password policy enforcement"  ,
          description: "Require accounts to follow workspace password rules."      ,
          value: settings.passwordPolicy,
          onChange: (value) =>
            update(
              "passwordPolicy",
              value
            )
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1040}}
        )

        , React.createElement('div', { className: "password-rule-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1052}}

          , React.createElement(Rule, {
            title: "Minimum length" ,
            value: "8 characters" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1054}}
          )

          , React.createElement(Rule, {
            title: "Password expiry" ,
            value: "90 days" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1059}}
          )

          , React.createElement(Rule, {
            title: "Password history" ,
            value: "5 passwords" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1064}}
          )

          , React.createElement(Rule, {
            title: "Account lockout" ,
            value: "Enabled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1069}}
          )

        )

      )


      , React.createElement('div', { className: "settings-side-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1079}}

        , React.createElement(CardHeading, {
          icon: React.createElement(LockKeyhole, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1082}} ),
          title: "Authentication",
          description: "Account protection." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1081}}
        )

        , React.createElement(StatusBlock, {
          title: "Strong passwords" ,
          text: "Required", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1087}}
        )

        , React.createElement(StatusBlock, {
          title: "Account lockout" ,
          text: "Enabled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1092}}
        )

        , React.createElement(StatusBlock, {
          title: "Security review" ,
          text: "Active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1097}}
        )

      )

    )
  );
}


/* ============================================================
   COMPONENTS
============================================================ */

function CardHeading({
  icon,
  title,
  description,
}) {
  return (
    React.createElement('div', { className: "card-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1119}}

      , React.createElement('div', { className: "card-heading-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1121}}
        , icon
      )

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1125}}

        , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1127}}, title)

        , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1129}}, description)

      )

    )
  );
}


function Field({
  label,
  value,
  onChange,
}) {
  return (
    React.createElement('label', { className: "settings-field", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1144}}

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1146}}, label)

      , React.createElement('input', {
        value: value,
        onChange: (event) =>
          onChange(event.target.value)
        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1148}}
      )

    )
  );
}


function Select({
  label,
  value,
  options,
  onChange,
}) {
  return (
    React.createElement('label', { className: "settings-field", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1167}}

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1169}}, label)

      , React.createElement('select', {
        value: value,
        onChange: (event) =>
          onChange(event.target.value)
        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1171}}

        , options.map((option) => (
          React.createElement('option', {
            key: option,
            value: option, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1178}}

            , option
          )
        ))
      )

    )
  );
}


function Toggle({
  title,
  description,
  value,
  onChange,
}) {
  return (
    React.createElement('div', { className: "settings-toggle-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1199}}

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1201}}

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1203}}, title)

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1205}}, description)

      )

      , React.createElement('button', {
        type: "button",
        className: `settings-toggle ${
          value ? "enabled" : ""
        }`,
        onClick: () => onChange(!value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1209}}

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1216}} )
      )

    )
  );
}


function InfoRow({
  label,
  value,
}) {
  return (
    React.createElement('div', { className: "info-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1229}}

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1231}}, label)

      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1233}}, value)

    )
  );
}


function RoleCard({
  role,
  access,
}) {
  return (
    React.createElement('div', { className: "role-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1245}}

      , React.createElement('div', { className: "role-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1247}}
        , React.createElement(UsersRound, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1248}} )
      )

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1251}}

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1253}}, role)

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1255}}, access)

      )

      , React.createElement(CheckCircle2, {
        size: 14,
        className: "role-check", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1259}}
      )

    )
  );
}


function StatusBlock({
  title,
  text,
}) {
  return (
    React.createElement('div', { className: "status-block", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1274}}

      , React.createElement('span', { className: "status-block-dot", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1276}} )

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1278}}

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1280}}, title)

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1282}}, text)

      )

    )
  );
}


function MiniSetting({
  title,
  text,
  active,
}) {
  return (
    React.createElement('div', { className: "mini-setting", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1297}}

      , React.createElement('div', { className: "mini-setting-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1299}}
        , React.createElement(CheckCircle2, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1300}} )
      )

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1303}}

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1305}}, title)

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1307}}, text)

      )

      , active && (
        React.createElement('span', { className: "mini-active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1312}}, "Active"

        )
      )

    )
  );
}


function Rule({
  title,
  value,
}) {
  return (
    React.createElement('div', { className: "password-rule", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1327}}

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1329}}, title)

      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1331}}, value)

    )
  );
}


function StatusItem({
  label,
  value,
}) {
  return (
    React.createElement('div', { className: "system-status-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1343}}

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1345}}, label)

      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1347}}
        , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1348}} )
        , value
      )

    )
  );
}