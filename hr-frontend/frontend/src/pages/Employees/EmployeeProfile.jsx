import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { employeeService } from "../../services/employeeService";

import "./EmployeeProfile.css";


export default function EmployeeProfile() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    let mounted = true;

    const loadEmployee = async () => {
      setBusy(true);
      setError("");

      try {
        const result = await employeeService.get(id);

        if (mounted) {
          setEmployee(result);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.detail ||
              "Unable to load employee profile."
          );
        }
      } finally {
        if (mounted) {
          setBusy(false);
        }
      }
    };

    loadEmployee();

    return () => {
      mounted = false;
    };
  }, [id]);


  const initials = useMemo(() => {
    if (!employee?.name) {
      return "EM";
    }

    return employee.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }, [employee]);


  if (busy) {
    return <ProfileSkeleton />;
  }


  if (error) {
    return (
      <div className="employee-profile-page">
        <Link
          to="/employees"
          className="profile-back-link"
        >
          <ArrowLeft size={14} />
          Back to Employees
        </Link>

        <div className="profile-error">
          <ShieldCheck size={20} />

          <div>
            <strong>Unable to open employee profile</strong>

            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }


  if (!employee) {
    return (
      <div className="employee-profile-page">
        <div className="profile-empty">
          <UserRound size={28} />

          <h2>Employee not found</h2>

          <p>
            The employee record could not be found in the HR database.
          </p>

          <Link to="/employees">
            Return to Employees
          </Link>
        </div>
      </div>
    );
  }


  const tabs = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "attendance",
      label: "Attendance",
      count: employee.attendance?.length || 0,
    },
    {
      id: "leave",
      label: "Leave",
      count: employee.leave?.length || 0,
    },
    {
      id: "payroll",
      label: "Payroll",
      count: employee.payroll?.length || 0,
    },
    {
      id: "documents",
      label: "Documents",
      count: employee.documents?.length || 0,
    },
  ];


  return (
    <div className="employee-profile-page">

      {/* ================================================= */}
      {/* BACK */}
      {/* ================================================= */}

      <Link
        to="/employees"
        className="profile-back-link"
      >
        <ArrowLeft size={14} />
        Employees
      </Link>


      {/* ================================================= */}
      {/* EMPLOYEE HERO */}
      {/* ================================================= */}

      <section className="employee-hero">

        <div className="employee-hero-main">

          <div className="employee-avatar-large">
            {initials}
          </div>


          <div className="employee-hero-info">

            <div className="employee-status-line">

              <span className="employee-id-label">
                EMPLOYEE PROFILE
              </span>

              <span className="employee-status">
                <span />
                {employee.status || "Active"}
              </span>

            </div>


            <h1>
              {employee.name}
            </h1>


            <p className="employee-role">
              {employee.designation || "Employee"}

              {employee.department && (
                <>
                  <span>•</span>
                  {employee.department}
                </>
              )}
            </p>


            <div className="employee-meta">

              <span>
                <MapPin size={13} />
                {employee.location || "Location not available"}
              </span>


              <span>
                <CalendarDays size={13} />
                Joined {employee.join_date || "—"}
              </span>


              <span>
                <BriefcaseBusiness size={13} />
                {employee.employment_type || "Full time"}
              </span>

            </div>

          </div>

        </div>


        <div className="employee-hero-actions">

          <Link
            to={`/employees/${id}/edit`}
            className="profile-secondary-button"
          >
            Edit profile
          </Link>

        </div>

      </section>


      {/* ================================================= */}
      {/* NAVIGATION TABS */}
      {/* ================================================= */}

      <div className="profile-tabs">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            type="button"
            className={
              activeTab === tab.id
                ? "profile-tab active"
                : "profile-tab"
            }
            onClick={() => setActiveTab(tab.id)}
          >

            {tab.label}

            {typeof tab.count === "number" && (
              <span>
                {tab.count}
              </span>
            )}

          </button>

        ))}

      </div>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      {activeTab === "overview" && (
        <Overview
          employee={employee}
          initials={initials}
        />
      )}


      {activeTab === "attendance" && (
        <DataTable
          title="Attendance history"
          description="Employee attendance and working-time records."
          icon={Clock3}
          columns={[
            "Date",
            "Check in",
            "Check out",
            "Status",
          ]}
          rows={(employee.attendance || []).map((item) => [
            item.date,
            item.check_in || "—",
            item.check_out || "—",
            item.status || "—",
          ])}
        />
      )}


      {activeTab === "leave" && (
        <DataTable
          title="Leave history"
          description="Employee leave requests and their current status."
          icon={CalendarDays}
          columns={[
            "Leave type",
            "Start",
            "End",
            "Status",
          ]}
          rows={(employee.leave || []).map((item) => [
            item.leave_type || "—",
            item.start_date || "—",
            item.end_date || "—",
            item.status || "—",
          ])}
        />
      )}


      {activeTab === "payroll" && (
        <DataTable
          title="Payroll history"
          description="Employee payroll records and payment status."
          icon={WalletCards}
          columns={[
            "Month",
            "Net pay",
            "Status",
          ]}
          rows={(employee.payroll || []).map((item) => [
            item.month || "—",
            item.net_pay
              ? `₹ ${Number(item.net_pay).toLocaleString("en-IN")}`
              : "₹ 0",
            item.status || "—",
          ])}
        />
      )}


      {activeTab === "documents" && (
        <DataTable
          title="Employee documents"
          description="Contracts, certificates and HR documents."
          icon={FileText}
          columns={[
            "Document",
            "Category",
            "Status",
          ]}
          rows={(employee.documents || []).map((item) => [
            item.title || "Untitled document",
            item.category || "HR",
            item.status || "—",
          ])}
        />
      )}

    </div>
  );
}


/* ========================================================= */
/* OVERVIEW */
/* ========================================================= */

function Overview({ employee }) {
  return (
    <div className="profile-overview-grid">

      {/* ----------------------------------------------- */}
      {/* PERSONAL INFORMATION */}
      {/* ----------------------------------------------- */}

      <section className="profile-panel">

        <PanelHeader
          eyebrow="PERSONAL INFORMATION"
          title="Contact & identity"
          icon={UserRound}
        />


        <div className="profile-info-list">

          <InfoItem
            label="Full name"
            value={employee.name}
            icon={UserRound}
          />

          <InfoItem
            label="Email address"
            value={employee.email}
            icon={Mail}
          />

          <InfoItem
            label="Phone number"
            value={employee.phone || "Not provided"}
            icon={Phone}
          />

          <InfoItem
            label="Location"
            value={employee.location || "Not provided"}
            icon={MapPin}
          />

        </div>

      </section>


      {/* ----------------------------------------------- */}
      {/* WORK INFORMATION */}
      {/* ----------------------------------------------- */}

      <section className="profile-panel">

        <PanelHeader
          eyebrow="WORK INFORMATION"
          title="Employment details"
          icon={BriefcaseBusiness}
        />


        <div className="profile-info-list">

          <InfoItem
            label="Employee ID"
            value={
              employee.employee_id ||
              employee.id ||
              "—"
            }
            icon={BriefcaseBusiness}
          />

          <InfoItem
            label="Designation"
            value={employee.designation || "—"}
            icon={BriefcaseBusiness}
          />

          <InfoItem
            label="Department"
            value={employee.department || "—"}
            icon={BriefcaseBusiness}
          />

          <InfoItem
            label="Manager"
            value={employee.manager || "—"}
            icon={UserRound}
          />

          <InfoItem
            label="Date of joining"
            value={employee.join_date || "—"}
            icon={CalendarDays}
          />

          <InfoItem
            label="Employment type"
            value={employee.employment_type || "—"}
            icon={BriefcaseBusiness}
          />

        </div>

      </section>


      {/* ----------------------------------------------- */}
      {/* COMPENSATION */}
      {/* ----------------------------------------------- */}

      <section className="profile-panel profile-panel-wide">

        <PanelHeader
          eyebrow="COMPENSATION"
          title="Salary & payroll"
          icon={WalletCards}
        />


        <div className="compensation-layout">

          <div className="salary-highlight">

            <span>
              Current salary
            </span>

            <strong>
              {employee.salary
                ? `₹ ${Number(employee.salary).toLocaleString("en-IN")}`
                : "Not available"}
            </strong>

            <small>
              Payroll information from HR records
            </small>

          </div>


          <div className="salary-details">

            <InfoItem
              label="Payroll records"
              value={`${employee.payroll?.length || 0} records`}
              icon={WalletCards}
            />

            <InfoItem
              label="Leave records"
              value={`${employee.leave?.length || 0} requests`}
              icon={CalendarDays}
            />

            <InfoItem
              label="Documents"
              value={`${employee.documents?.length || 0} files`}
              icon={FileText}
            />

          </div>

        </div>

      </section>


      {/* ----------------------------------------------- */}
      {/* EMPLOYEE SNAPSHOT */}
      {/* ----------------------------------------------- */}

      <section className="profile-panel profile-panel-wide">

        <PanelHeader
          eyebrow="EMPLOYEE SNAPSHOT"
          title="HR record overview"
          icon={ShieldCheck}
        />


        <div className="profile-stat-grid">

          <ProfileStat
            label="Attendance records"
            value={employee.attendance?.length || 0}
          />

          <ProfileStat
            label="Leave requests"
            value={employee.leave?.length || 0}
          />

          <ProfileStat
            label="Payroll records"
            value={employee.payroll?.length || 0}
          />

          <ProfileStat
            label="Documents"
            value={employee.documents?.length || 0}
          />

        </div>

      </section>

    </div>
  );
}


/* ========================================================= */
/* PANEL HEADER */
/* ========================================================= */

function PanelHeader({
  eyebrow,
  title,
  icon: Icon,
}) {
  return (
    <div className="profile-panel-header">

      <div className="profile-panel-icon">
        <Icon size={16} />
      </div>


      <div>

        <span>
          {eyebrow}
        </span>

        <h2>
          {title}
        </h2>

      </div>

    </div>
  );
}


/* ========================================================= */
/* INFO ITEM */
/* ========================================================= */

function InfoItem({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="profile-info-item">

      <div className="profile-info-icon">
        <Icon size={14} />
      </div>


      <div>

        <span>
          {label}
        </span>

        <strong>
          {value || "—"}
        </strong>

      </div>

    </div>
  );
}


/* ========================================================= */
/* PROFILE STAT */
/* ========================================================= */

function ProfileStat({
  label,
  value,
}) {
  return (
    <div className="profile-stat">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <ChevronRight
        size={14}
      />

    </div>
  );
}


/* ========================================================= */
/* DATA TABLE */
/* ========================================================= */

function DataTable({
  title,
  description,
  icon: Icon,
  columns,
  rows,
}) {
  return (
    <section className="profile-data-panel">

      <div className="profile-data-header">

        <div className="profile-data-title">

          <div className="profile-panel-icon">
            <Icon size={16} />
          </div>

          <div>

            <h2>
              {title}
            </h2>

            <p>
              {description}
            </p>

          </div>

        </div>

      </div>


      {rows.length ? (

        <div className="profile-table-scroll">

          <table className="profile-table">

            <thead>

              <tr>

                {columns.map((column) => (
                  <th key={column}>
                    {column}
                  </th>
                ))}

              </tr>

            </thead>


            <tbody>

              {rows.map((row, index) => (

                <tr key={index}>

                  {row.map((value, columnIndex) => (

                    <td key={columnIndex}>

                      {columnIndex === row.length - 1 ? (

                        <span className="profile-status">
                          {value}
                        </span>

                      ) : (
                        value
                      )}

                    </td>

                  ))}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      ) : (

        <div className="profile-empty-table">

          <FileText size={24} />

          <strong>
            No {title.toLowerCase()} yet
          </strong>

          <span>
            Information will appear here when records are available.
          </span>

        </div>

      )}

    </section>
  );
}


/* ========================================================= */
/* LOADING SKELETON */
/* ========================================================= */

function ProfileSkeleton() {
  return (
    <div className="employee-profile-page">

      <div className="profile-skeleton-back" />

      <div className="profile-skeleton-hero">

        <div className="profile-skeleton-avatar" />

        <div className="profile-skeleton-lines">

          <div />
          <div />
          <div />

        </div>

      </div>


      <div className="profile-skeleton-tabs" />


      <div className="profile-skeleton-grid">

        <div />
        <div />
        <div />
        <div />

      </div>

    </div>
  );
}