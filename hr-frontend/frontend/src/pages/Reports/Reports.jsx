import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileSpreadsheet,
  FileText,
  Headphones,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react";

import api from "../../services/api";
import "./Reports.css";

export default function Reports() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState("");

  const loadReports = async () => {
    setLoading(true);

    try {
      const response = await api.get("/reports/summary");
      setData(response.data || {});
    } catch {
      setData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const employees = Number(data.employees || 0);
  const attendance = Number(data.attendance || 0);
  const pendingLeave = Number(data.pending_leave || 0);
  const onboarding = Number(data.onboarding || 0);

  const payroll = Number(
    data.payroll ||
      data.payroll_records ||
      data.payroll_count ||
      0
  );

  const support = Number(
    data.support ||
      data.tickets ||
      data.support_tickets ||
      0
  );

  const present = Number(
    data.present ||
      data.present_today ||
      data.present_employees ||
      0
  );

  const absent = Number(
    data.absent ||
      data.absent_today ||
      0
  );

  const attendanceRate =
    employees > 0
      ? Math.min(
          100,
          Math.round((present / employees) * 100)
        )
      : 0;

  const metrics = useMemo(
    () => [
      {
        title: "Total Employees",
        value: employees,
        subtitle: "Active workforce",
        icon: Users,
        type: "blue",
      },
      {
        title: "Attendance Records",
        value: attendance,
        subtitle: "Current report scope",
        icon: Clock3,
        type: "green",
      },
      {
        title: "Pending Leave",
        value: pendingLeave,
        subtitle: "Awaiting approval",
        icon: CalendarDays,
        type: "orange",
      },
      {
        title: "Active Onboarding",
        value: onboarding,
        subtitle: "Employee journeys",
        icon: UserCheck,
        type: "purple",
      },
    ],
    [
      employees,
      attendance,
      pendingLeave,
      onboarding,
    ]
  );

  const exportReport = async (type) => {
    const path =
      type === "excel"
        ? "/reports/export.xlsx"
        : "/reports/export.csv";

    const filename =
      type === "excel"
        ? "azentmart-hr-report.xlsx"
        : "azentmart-hr-report.csv";

    setExporting(type);

    try {
      const response = await api.get(path, {
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(
        response.data
      );

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Keep UI stable if export fails.
    } finally {
      setExporting("");
    }
  };

  return (
    <div className="reports-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <header className="reports-top">

        <div className="reports-title">

          <div className="reports-label">
            <BarChart3 size={13} />
            PEOPLE ANALYTICS
          </div>

          <h1>Reports & Analytics</h1>

          <p>
            Monitor workforce activity, attendance,
            leave, onboarding, payroll and HR support
            from one reporting workspace.
          </p>

        </div>

        <div className="reports-actions">

          <button
            className="report-btn secondary"
            onClick={loadReports}
            disabled={loading}
          >
            <RefreshCw
              size={14}
              className={loading ? "reports-spin" : ""}
            />
            Refresh
          </button>

          <button
            className="report-btn secondary"
            onClick={() => exportReport("csv")}
          >
            <Download size={14} />
            Export CSV
          </button>

          <button
            className="report-btn primary"
            onClick={() => exportReport("excel")}
          >
            <FileSpreadsheet size={14} />

            {exporting === "excel"
              ? "Exporting..."
              : "Export Excel"}
          </button>

        </div>

      </header>


      {/* =====================================================
          KPI STRIP
      ===================================================== */}

      <section className="reports-kpis">

        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              className="report-kpi"
              key={metric.title}
            >

              <div
                className={`report-kpi-icon ${metric.type}`}
              >
                <Icon size={18} />
              </div>

              <div className="report-kpi-content">

                <span>{metric.title}</span>

                <strong>
                  {loading ? "—" : metric.value}
                </strong>

                <small>
                  {metric.subtitle}
                </small>

              </div>

            </article>
          );
        })}

      </section>


      {/* =====================================================
          MAIN ANALYTICS
      ===================================================== */}

      <section className="reports-main-grid">

        {/* ATTENDANCE */}

        <article className="report-card attendance-card">

          <div className="report-card-header">

            <div>
              <span className="section-label">
                ATTENDANCE ANALYTICS
              </span>

              <h2>Workforce attendance</h2>

              <p>
                Current employee attendance overview
                based on available attendance records.
              </p>
            </div>

            <div className="header-icon blue">
              <Clock3 size={17} />
            </div>

          </div>


          <div className="attendance-layout">

            <div className="attendance-number">

              <strong>
                {attendanceRate}%
              </strong>

              <span>
                Attendance rate
              </span>

            </div>


            <div className="attendance-chart">

              <div className="attendance-bar">

                <div
                  className="attendance-fill"
                  style={{
                    width: `${attendanceRate}%`,
                  }}
                />

              </div>

              <div className="attendance-labels">

                <span>
                  <i className="dot present" />
                  Present {present}
                </span>

                <span>
                  <i className="dot absent" />
                  Absent {absent}
                </span>

              </div>

            </div>

          </div>


          <div className="attendance-summary">

            <div className="summary-box">

              <CheckCircle2 size={15} />

              <div>
                <span>Present</span>
                <strong>{present}</strong>
              </div>

            </div>

            <div className="summary-box">

              <Clock3 size={15} />

              <div>
                <span>Records</span>
                <strong>{attendance}</strong>
              </div>

            </div>

            <div className="summary-box">

              <TrendingUp size={15} />

              <div>
                <span>Rate</span>
                <strong>{attendanceRate}%</strong>
              </div>

            </div>

          </div>

        </article>


        {/* HR ACTIVITY */}

        <article className="report-card">

          <div className="report-card-header">

            <div>
              <span className="section-label">
                HR OPERATIONS
              </span>

              <h2>Current activity</h2>

              <p>
                Live operational records across
                the HR modules.
              </p>
            </div>

            <div className="header-icon purple">
              <Activity size={17} />
            </div>

          </div>


          <div className="activity-list">

            <ActivityRow
              icon={<CalendarDays size={15} />}
              title="Pending Leave"
              description="Requests awaiting approval"
              value={pendingLeave}
            />

            <ActivityRow
              icon={<UserCheck size={15} />}
              title="Onboarding"
              description="Active employee journeys"
              value={onboarding}
            />

            <ActivityRow
              icon={<WalletCards size={15} />}
              title="Payroll"
              description="Payroll records"
              value={payroll}
            />

            <ActivityRow
              icon={<Headphones size={15} />}
              title="HR Support"
              description="Employee support requests"
              value={support}
            />

          </div>

        </article>

      </section>


      {/* =====================================================
          WORKFORCE SNAPSHOT
      ===================================================== */}

      <section className="workforce-panel">

        <div className="workforce-heading">

          <div>

            <span className="section-label">
              WORKFORCE SNAPSHOT
            </span>

            <h2>People Operations overview</h2>

          </div>

          <div className="live-status">
            <span />
            Live reporting
          </div>

        </div>


        <div className="workforce-grid">

          <Snapshot
            icon={<Users size={17} />}
            label="Employees"
            value={employees}
            text="Total employee records"
          />

          <Snapshot
            icon={<Clock3 size={17} />}
            label="Attendance"
            value={attendance}
            text="Attendance records"
          />

          <Snapshot
            icon={<CalendarDays size={17} />}
            label="Leave"
            value={pendingLeave}
            text="Pending requests"
          />

          <Snapshot
            icon={<UserCheck size={17} />}
            label="Onboarding"
            value={onboarding}
            text="Active journeys"
          />

          <Snapshot
            icon={<WalletCards size={17} />}
            label="Payroll"
            value={payroll}
            text="Payroll records"
          />

          <Snapshot
            icon={<Headphones size={17} />}
            label="Support"
            value={support}
            text="Support requests"
          />

        </div>

      </section>


      {/* =====================================================
          REPORT CATALOG
      ===================================================== */}

      <section className="report-card catalog-section">

        <div className="catalog-header">

          <div>

            <span className="section-label">
              REPORT CATALOG
            </span>

            <h2>Available HR reports</h2>

            <p>
              Reporting areas available across
              the People Operations platform.
            </p>

          </div>

        </div>


        <div className="catalog-grid">

          <ReportItem
            icon={<Users size={17} />}
            title="Employee Report"
            description="Employee profiles, departments and workforce information."
          />

          <ReportItem
            icon={<Clock3 size={17} />}
            title="Attendance Report"
            description="Check-in, check-out, working hours and overtime."
          />

          <ReportItem
            icon={<CalendarDays size={17} />}
            title="Leave Report"
            description="Leave requests, balances and approval activity."
          />

          <ReportItem
            icon={<WalletCards size={17} />}
            title="Payroll Report"
            description="Payroll processing and employee compensation records."
          />

          <ReportItem
            icon={<UserCheck size={17} />}
            title="Onboarding Report"
            description="Employee onboarding progress and completion."
          />

          <ReportItem
            icon={<Headphones size={17} />}
            title="HR Support Report"
            description="Employee requests and HR service desk activity."
          />

        </div>

      </section>


      {/* =====================================================
          EXPORT AREA
      ===================================================== */}

      <section className="reports-export">

        <div className="export-content">

          <div className="export-icon">
            <FileSpreadsheet size={20} />
          </div>

          <div>

            <span>DATA EXPORT</span>

            <h2>Download HR reports</h2>

            <p>
              Export current reporting data for
              analysis, sharing or record keeping.
            </p>

          </div>

        </div>


        <div className="export-buttons">

          <button
            className="export-btn"
            onClick={() => exportReport("csv")}
          >
            <FileText size={15} />
            CSV
          </button>

          <button
            className="export-btn blue"
            onClick={() => exportReport("excel")}
          >
            <FileSpreadsheet size={15} />
            {exporting === "excel"
              ? "Exporting..."
              : "Excel"}
          </button>

        </div>

      </section>


      {/* =====================================================
          FOOTER NOTE
      ===================================================== */}

      <div className="reports-footer">

        <ShieldCheck size={14} />

        <span>
          HR reports are generated from the current
          People Operations records.
        </span>

      </div>

    </div>
  );
}


/* ============================================================
   ACTIVITY ROW
============================================================ */

function ActivityRow({
  icon,
  title,
  description,
  value,
}) {
  return (
    <div className="activity-row">

      <div className="activity-icon">
        {icon}
      </div>

      <div className="activity-content">

        <strong>{title}</strong>

        <span>{description}</span>

      </div>

      <b>{value}</b>

    </div>
  );
}


/* ============================================================
   SNAPSHOT
============================================================ */

function Snapshot({
  icon,
  label,
  value,
  text,
}) {
  return (
    <div className="snapshot-card">

      <div className="snapshot-icon">
        {icon}
      </div>

      <div>

        <span>{label}</span>

        <strong>{value}</strong>

        <small>{text}</small>

      </div>

    </div>
  );
}


/* ============================================================
   REPORT ITEM
============================================================ */

function ReportItem({
  icon,
  title,
  description,
}) {
  return (
    <div className="report-item">

      <div className="report-item-icon">
        {icon}
      </div>

      <div>

        <strong>{title}</strong>

        <p>{description}</p>

      </div>

    </div>
  );
}