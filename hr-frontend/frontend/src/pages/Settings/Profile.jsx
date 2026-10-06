import React from "react";
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  CalendarDays,
  BriefcaseBusiness,
  MapPin,
  Phone,
  KeyRound,
  Activity,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "../Page.css";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();

  const role = user?.role || "Employee";
  const department = user?.department || "Not assigned";

  return (
    <div className="profile-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="profile-header">

        <div>
          <span className="profile-kicker">
            ACCOUNT MANAGEMENT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your account information and review
            your People Operations access details.
          </p>
        </div>

      </div>


      {/* =====================================================
          PROFILE HERO
      ===================================================== */}

      <section className="profile-hero">

        <div className="profile-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="profile-identity">

          <div className="profile-name-row">

            <h2>
              {user?.name || "Employee"}
            </h2>

            <span className="profile-active">
              <span />
              Active
            </span>

          </div>

          <p>
            {user?.email || "No email available"}
          </p>

          <div className="profile-meta">

            <span>
              <BriefcaseBusiness size={13} />
              {role}
            </span>

            <span>
              <Building2 size={13} />
              {department}
            </span>

            <span>
              <MapPin size={13} />
              People Operations
            </span>

          </div>

        </div>

        <div className="profile-security-status">

          <ShieldCheck size={18} />

          <div>
            <strong>Account protected</strong>
            <span>Standard security controls enabled</span>
          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="profile-grid">

        {/* ACCOUNT INFORMATION */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon blue">
              <User size={17} />
            </div>

            <div>
              <h2>Account information</h2>

              <p>
                Basic information associated with your
                HR workspace account.
              </p>
            </div>

          </div>


          <div className="profile-fields">

            <ProfileField
              icon={<User size={15} />}
              label="Full name"
              value={user?.name || "Not available"}
            />

            <ProfileField
              icon={<Mail size={15} />}
              label="Email address"
              value={user?.email || "Not available"}
            />

            <ProfileField
              icon={<Building2 size={15} />}
              label="Department"
              value={department}
            />

            <ProfileField
              icon={<ShieldCheck size={15} />}
              label="System role"
              value={role}
            />

            <ProfileField
              icon={<Phone size={15} />}
              label="Phone number"
              value="Not configured"
            />

            <ProfileField
              icon={<MapPin size={15} />}
              label="Work location"
              value="Not configured"
            />

          </div>

        </section>


        {/* ACCESS INFORMATION */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon purple">
              <KeyRound size={17} />
            </div>

            <div>
              <h2>Access & permissions</h2>

              <p>
                Current role-based access assigned to
                your account.
              </p>
            </div>

          </div>


          <div className="access-list">

            <AccessRow
              icon={<ShieldCheck size={15} />}
              title="Role access"
              value={role}
              status="Active"
            />

            <AccessRow
              icon={<Building2 size={15} />}
              title="Department"
              value={department}
              status="Assigned"
            />

            <AccessRow
              icon={<Activity size={15} />}
              title="Account status"
              value="Active"
              status="Verified"
            />

          </div>

        </section>


        {/* ACCOUNT ACTIVITY */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon green">
              <Activity size={17} />
            </div>

            <div>
              <h2>Account activity</h2>

              <p>
                Important account and workspace information.
              </p>
            </div>

          </div>


          <div className="activity-information">

            <div className="activity-info-row">

              <CalendarDays size={16} />

              <div>
                <span>Account created</span>
                <strong>Managed by HR Administration</strong>
              </div>

            </div>


            <div className="activity-info-row">

              <CheckCircle2 size={16} />

              <div>
                <span>Account status</span>
                <strong>Active and available</strong>
              </div>

            </div>


            <div className="activity-info-row">

              <ShieldCheck size={16} />

              <div>
                <span>Security</span>
                <strong>Role-based access enabled</strong>
              </div>

            </div>

          </div>

        </section>


        {/* SECURITY */}

        <section className="profile-card security-card">

          <div className="profile-card-header">

            <div className="profile-card-icon orange">
              <KeyRound size={17} />
            </div>

            <div>
              <h2>Security</h2>

              <p>
                Keep your HR workspace account protected.
              </p>
            </div>

          </div>


          <div className="security-box">

            <ShieldCheck size={20} />

            <div>

              <strong>Role-based security enabled</strong>

              <p>
                Your access to employee information,
                HR workflows and administration features
                is controlled by your assigned role.
              </p>

            </div>

          </div>

        </section>

      </div>


      {/* FOOTER */}

      <div className="profile-footer">

        <ShieldCheck size={14} />

        <span>
          Profile information is managed within the
          AzentMart People Operations workspace.
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   PROFILE FIELD
============================================================ */

function ProfileField({
  icon,
  label,
  value,
}) {
  return (
    <div className="profile-field">

      <div className="profile-field-label">

        <span className="field-icon">
          {icon}
        </span>

        <span>{label}</span>

      </div>

      <strong>{value}</strong>

    </div>
  );
}


/* ============================================================
   ACCESS ROW
============================================================ */

function AccessRow({
  icon,
  title,
  value,
  status,
}) {
  return (
    <div className="access-row">

      <span className="access-icon">
        {icon}
      </span>

      <div className="access-main">

        <strong>{title}</strong>

        <span>{value}</span>

      </div>

      <span className="access-status">
        {status}
      </span>

    </div>
  );
}