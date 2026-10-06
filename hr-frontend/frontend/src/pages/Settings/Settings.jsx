import React, { useState } from "react";

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

import "./Settings.css";

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
    <div className="settings-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="settings-top">

        <div className="settings-heading">

          <span className="settings-kicker">
            ADMINISTRATION / CONFIGURATION
          </span>

          <h1>Workspace Settings</h1>

          <p>
            Configure how AzentMart People Operations manages
            employees, HR workflows, security and organization rules.
          </p>

        </div>

        <div className="settings-header-actions">

          <div className="settings-status">
            <span className="settings-status-dot" />
            System operational
          </div>

          <button
            className="settings-primary-button"
            onClick={saveChanges}
          >
            <Save size={14} />
            Save changes
          </button>

        </div>

      </div>


      {/* =====================================================
          CATEGORY STRIP
      ===================================================== */}

      <section className="settings-category-area">

        <div className="section-heading">

          <div>
            <span>CONFIGURATION</span>
            <h2>Workspace controls</h2>
          </div>

          <p>
            Select an area to manage its settings.
          </p>

        </div>


        <div className="settings-category-grid">

          {categories.map((category) => {

            const Icon = category.icon;

            const selected =
              active === category.id;

            return (
              <button
                key={category.id}
                className={`settings-category ${
                  selected ? "selected" : ""
                }`}
                onClick={() => setActive(category.id)}
              >

                <div
                  className={`settings-category-icon ${
                    selected ? "selected-icon" : ""
                  }`}
                >
                  <Icon size={17} />
                </div>

                <div className="settings-category-copy">

                  <strong>
                    {category.title}
                  </strong>

                  <span>
                    {category.description}
                  </span>

                </div>

                {selected && (
                  <CheckCircle2
                    className="category-check"
                    size={15}
                  />
                )}

              </button>
            );
          })}

        </div>

      </section>


      {/* =====================================================
          ACTIVE SECTION HEADER
      ===================================================== */}

      <div className="active-section-header">

        <div className="active-section-title">

          <div className="active-section-icon">
            <activeCategory.icon size={18} />
          </div>

          <div>

            <span>
              CURRENT CONFIGURATION
            </span>

            <h2>
              {activeCategory.title}
            </h2>

          </div>

        </div>

        <span className="configuration-badge">
          <SlidersHorizontal size={12} />
          Configuration
        </span>

      </div>


      {/* =====================================================
          ORGANIZATION
      ===================================================== */}

      {active === "organization" && (
        <OrganizationSection
          settings={settings}
          update={update}
        />
      )}


      {/* =====================================================
          PEOPLE
      ===================================================== */}

      {active === "people" && (
        <PeopleSection
          settings={settings}
          update={update}
        />
      )}


      {/* =====================================================
          ATTENDANCE
      ===================================================== */}

      {active === "attendance" && (
        <AttendanceSection
          settings={settings}
          update={update}
        />
      )}


      {/* =====================================================
          LEAVE
      ===================================================== */}

      {active === "leave" && (
        <LeaveSection
          settings={settings}
          update={update}
        />
      )}


      {/* =====================================================
          PAYROLL
      ===================================================== */}

      {active === "payroll" && (
        <PayrollSection
          settings={settings}
          update={update}
        />
      )}


      {/* =====================================================
          SECURITY
      ===================================================== */}

      {active === "security" && (
        <SecuritySection
          settings={settings}
          update={update}
        />
      )}


      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      {active === "notifications" && (
        <NotificationSection
          settings={settings}
          update={update}
        />
      )}


      {/* =====================================================
          PASSWORD
      ===================================================== */}

      {active === "password" && (
        <PasswordSection
          settings={settings}
          update={update}
        />
      )}


      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <section className="system-status">

        <div className="system-status-main">

          <div className="system-status-icon">
            <Activity size={17} />
          </div>

          <div>

            <strong>
              People Operations configuration
            </strong>

            <span>
              Your workspace is configured for HR,
              employee and administrative workflows.
            </span>

          </div>

        </div>


        <div className="system-status-items">

          <StatusItem
            label="Database"
            value="Connected"
          />

          <StatusItem
            label="Security"
            value="Protected"
          />

          <StatusItem
            label="HR Services"
            value="Active"
          />

        </div>

      </section>

    </div>
  );
}


/* ============================================================
   ORGANIZATION
============================================================ */

function OrganizationSection({ settings, update }) {
  return (
    <div className="settings-content-grid">

      <div className="settings-main-card">

        <CardHeading
          icon={<Building2 size={16} />}
          title="Company information"
          description="Basic information used throughout the HR workspace."
        />

        <div className="settings-fields">

          <Field
            label="Organization name"
            value={settings.companyName}
            onChange={(value) =>
              update("companyName", value)
            }
          />

          <Field
            label="Workspace"
            value={settings.workspace}
            onChange={(value) =>
              update("workspace", value)
            }
          />

          <Select
            label="Time zone"
            value={settings.timezone}
            options={[
              "Asia/Kolkata",
              "Asia/Dubai",
              "Asia/Singapore",
              "Europe/London",
            ]}
            onChange={(value) =>
              update("timezone", value)
            }
          />

          <Select
            label="Working week"
            value={settings.workWeek}
            options={[
              "Monday - Friday",
              "Monday - Saturday",
              "Sunday - Thursday",
            ]}
            onChange={(value) =>
              update("workWeek", value)
            }
          />

        </div>

      </div>


      <div className="settings-side-card">

        <CardHeading
          icon={<Globe2 size={16} />}
          title="Regional setup"
          description="Default regional configuration."
        />

        <InfoRow
          label="Time zone"
          value="Asia/Kolkata"
        />

        <InfoRow
          label="Currency"
          value="Indian Rupee (₹)"
        />

        <InfoRow
          label="Date format"
          value="DD/MM/YYYY"
        />

        <InfoRow
          label="Workspace"
          value="People Operations"
        />

      </div>


      <div className="settings-wide-card">

        <CardHeading
          icon={<Zap size={16} />}
          title="Workspace defaults"
          description="Default behavior applied across HR workflows."
        />

        <div className="quick-setting-grid">

          <MiniSetting
            title="Employee records"
            text="Central employee information"
            active
          />

          <MiniSetting
            title="HR workflows"
            text="Onboarding and approvals"
            active
          />

          <MiniSetting
            title="Document management"
            text="Employee document library"
            active
          />

          <MiniSetting
            title="HR support"
            text="Employee service desk"
            active
          />

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   PEOPLE
============================================================ */

function PeopleSection({ settings, update }) {
  return (
    <div className="settings-content-grid">

      <div className="settings-main-card">

        <CardHeading
          icon={<UsersRound size={16} />}
          title="People access"
          description="Define who can access employee information."
        />

        <Toggle
          title="Employee self-service"
          description="Allow employees to access their own HR information."
          value={settings.employeeAccess}
          onChange={(value) =>
            update("employeeAccess", value)
          }
        />

        <Toggle
          title="Manager access"
          description="Allow managers to access permitted team information."
          value={settings.managerAccess}
          onChange={(value) =>
            update("managerAccess", value)
          }
        />

        <Toggle
          title="HR approval controls"
          description="Require HR approval for sensitive employee changes."
          value={settings.hrApproval}
          onChange={(value) =>
            update("hrApproval", value)
          }
        />

      </div>


      <div className="settings-side-card">

        <CardHeading
          icon={<ShieldCheck size={16} />}
          title="Access model"
          description="Role-based permission structure."
        />

        <RoleCard
          role="Employee"
          access="Personal records"
        />

        <RoleCard
          role="Manager"
          access="Team records"
        />

        <RoleCard
          role="HR Manager"
          access="HR operations"
        />

        <RoleCard
          role="HR Admin"
          access="Full HR administration"
        />

      </div>

    </div>
  );
}


/* ============================================================
   ATTENDANCE
============================================================ */

function AttendanceSection({ settings, update }) {
  return (
    <div className="settings-content-grid">

      <div className="settings-main-card">

        <CardHeading
          icon={<Clock3 size={16} />}
          title="Attendance controls"
          description="Configure employee working-time tracking."
        />

        <Toggle
          title="Attendance tracking"
          description="Record employee check-in and check-out activity."
          value={settings.attendance}
          onChange={(value) =>
            update("attendance", value)
          }
        />

        <Toggle
          title="Overtime tracking"
          description="Track additional working hours."
          value={settings.overtime}
          onChange={(value) =>
            update("overtime", value)
          }
        />

        <Toggle
          title="Break tracking"
          description="Record employee break duration."
          value={settings.breakTracking}
          onChange={(value) =>
            update("breakTracking", value)
          }
        />

      </div>


      <div className="settings-side-card">

        <CardHeading
          icon={<Clock3 size={16} />}
          title="Default schedule"
          description="Current organization schedule."
        />

        <InfoRow
          label="Shift"
          value="09:00 AM - 06:00 PM"
        />

        <InfoRow
          label="Grace period"
          value="15 minutes"
        />

        <InfoRow
          label="Weekly off"
          value="Saturday & Sunday"
        />

        <InfoRow
          label="Overtime"
          value="Enabled"
        />

      </div>

    </div>
  );
}


/* ============================================================
   LEAVE
============================================================ */

function LeaveSection() {
  return (
    <div className="settings-content-grid">

      <div className="settings-main-card">

        <CardHeading
          icon={<CalendarDays size={16} />}
          title="Leave management"
          description="Manage leave workflows and employee approvals."
        />

        <InfoRow
          label="Annual leave"
          value="Configured"
        />

        <InfoRow
          label="Sick leave"
          value="Configured"
        />

        <InfoRow
          label="Casual leave"
          value="Configured"
        />

        <InfoRow
          label="Approval workflow"
          value="Manager → HR"
        />

      </div>


      <div className="settings-side-card">

        <CardHeading
          icon={<CheckCircle2 size={16} />}
          title="Leave controls"
          description="Current workflow status."
        />

        <StatusBlock
          title="Leave approval"
          text="Manager approval required"
        />

        <StatusBlock
          title="Holiday calendar"
          text="2026 company calendar"
        />

        <StatusBlock
          title="Regularization"
          text="HR review enabled"
        />

      </div>

    </div>
  );
}


/* ============================================================
   PAYROLL
============================================================ */

function PayrollSection() {
  return (
    <div className="settings-content-grid">

      <div className="settings-main-card">

        <CardHeading
          icon={<WalletCards size={16} />}
          title="Payroll configuration"
          description="Organization payroll and statutory controls."
        />

        <InfoRow
          label="Payroll cycle"
          value="Monthly"
        />

        <InfoRow
          label="Provident Fund"
          value="Enabled"
        />

        <InfoRow
          label="TDS"
          value="Enabled"
        />

        <InfoRow
          label="Payroll status"
          value="Active"
        />

      </div>


      <div className="settings-side-card">

        <CardHeading
          icon={<LockKeyhole size={16} />}
          title="Payroll protection"
          description="Payroll access is restricted."
        />

        <StatusBlock
          title="HR access"
          text="Authorized HR roles"
        />

        <StatusBlock
          title="Payroll records"
          text="Protected"
        />

        <StatusBlock
          title="Export controls"
          text="Authorized users only"
        />

      </div>

    </div>
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
    <div className="settings-content-grid">

      <div className="settings-main-card">

        <CardHeading
          icon={<ShieldCheck size={16} />}
          title="Security controls"
          description="Protect your employee and HR data."
        />

        <Toggle
          title="Two-factor authentication"
          description="Require an additional authentication factor for privileged roles."
          value={settings.twoFactor}
          onChange={(value) =>
            update("twoFactor", value)
          }
        />

        <Toggle
          title="Audit logging"
          description="Record important HR and configuration changes."
          value={settings.auditLogs}
          onChange={(value) =>
            update("auditLogs", value)
          }
        />

        <Toggle
          title="Session timeout"
          description="Expire inactive sessions automatically."
          value={settings.sessionTimeout}
          onChange={(value) =>
            update("sessionTimeout", value)
          }
        />

      </div>


      <div className="settings-side-card security-highlight">

        <ShieldCheck size={24} />

        <strong>
          Workspace protected
        </strong>

        <p>
          Role-based access and security controls
          are enabled for this HR workspace.
        </p>

      </div>

    </div>
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
    <div className="settings-content-grid">

      <div className="settings-main-card">

        <CardHeading
          icon={<Bell size={16} />}
          title="Notification preferences"
          description="Control HR workflow alerts."
        />

        <Toggle
          title="Email notifications"
          description="Send important HR notifications by email."
          value={settings.emailNotifications}
          onChange={(value) =>
            update(
              "emailNotifications",
              value
            )
          }
        />

        <Toggle
          title="Leave notifications"
          description="Notify employees and managers about leave actions."
          value={settings.leaveNotifications}
          onChange={(value) =>
            update(
              "leaveNotifications",
              value
            )
          }
        />

        <Toggle
          title="Payroll notifications"
          description="Send payroll-related notifications."
          value={settings.payrollNotifications}
          onChange={(value) =>
            update(
              "payrollNotifications",
              value
            )
          }
        />

      </div>


      <div className="settings-side-card">

        <CardHeading
          icon={<Mail size={16} />}
          title="Notification channels"
          description="Available communication channels."
        />

        <StatusBlock
          title="Email"
          text="Available"
        />

        <StatusBlock
          title="In-app alerts"
          text="Available"
        />

        <StatusBlock
          title="HR workflow alerts"
          text="Enabled"
        />

      </div>

    </div>
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
    <div className="settings-content-grid">

      <div className="settings-main-card">

        <CardHeading
          icon={<KeyRound size={16} />}
          title="Password policy"
          description="Define account password requirements."
        />

        <Toggle
          title="Password policy enforcement"
          description="Require accounts to follow workspace password rules."
          value={settings.passwordPolicy}
          onChange={(value) =>
            update(
              "passwordPolicy",
              value
            )
          }
        />

        <div className="password-rule-grid">

          <Rule
            title="Minimum length"
            value="8 characters"
          />

          <Rule
            title="Password expiry"
            value="90 days"
          />

          <Rule
            title="Password history"
            value="5 passwords"
          />

          <Rule
            title="Account lockout"
            value="Enabled"
          />

        </div>

      </div>


      <div className="settings-side-card">

        <CardHeading
          icon={<LockKeyhole size={16} />}
          title="Authentication"
          description="Account protection."
        />

        <StatusBlock
          title="Strong passwords"
          text="Required"
        />

        <StatusBlock
          title="Account lockout"
          text="Enabled"
        />

        <StatusBlock
          title="Security review"
          text="Active"
        />

      </div>

    </div>
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
    <div className="card-heading">

      <div className="card-heading-icon">
        {icon}
      </div>

      <div>

        <h3>{title}</h3>

        <p>{description}</p>

      </div>

    </div>
  );
}


function Field({
  label,
  value,
  onChange,
}) {
  return (
    <label className="settings-field">

      <span>{label}</span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

    </label>
  );
}


function Select({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label className="settings-field">

      <span>{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </label>
  );
}


function Toggle({
  title,
  description,
  value,
  onChange,
}) {
  return (
    <div className="settings-toggle-row">

      <div>

        <strong>{title}</strong>

        <span>{description}</span>

      </div>

      <button
        type="button"
        className={`settings-toggle ${
          value ? "enabled" : ""
        }`}
        onClick={() => onChange(!value)}
      >
        <span />
      </button>

    </div>
  );
}


function InfoRow({
  label,
  value,
}) {
  return (
    <div className="info-row">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}


function RoleCard({
  role,
  access,
}) {
  return (
    <div className="role-card">

      <div className="role-avatar">
        <UsersRound size={14} />
      </div>

      <div>

        <strong>{role}</strong>

        <span>{access}</span>

      </div>

      <CheckCircle2
        size={14}
        className="role-check"
      />

    </div>
  );
}


function StatusBlock({
  title,
  text,
}) {
  return (
    <div className="status-block">

      <span className="status-block-dot" />

      <div>

        <strong>{title}</strong>

        <span>{text}</span>

      </div>

    </div>
  );
}


function MiniSetting({
  title,
  text,
  active,
}) {
  return (
    <div className="mini-setting">

      <div className="mini-setting-icon">
        <CheckCircle2 size={14} />
      </div>

      <div>

        <strong>{title}</strong>

        <span>{text}</span>

      </div>

      {active && (
        <span className="mini-active">
          Active
        </span>
      )}

    </div>
  );
}


function Rule({
  title,
  value,
}) {
  return (
    <div className="password-rule">

      <span>{title}</span>

      <strong>{value}</strong>

    </div>
  );
}


function StatusItem({
  label,
  value,
}) {
  return (
    <div className="system-status-item">

      <span>{label}</span>

      <strong>
        <i />
        {value}
      </strong>

    </div>
  );
}