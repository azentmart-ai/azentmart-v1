const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Reports/Reports.jsx";import React, { useEffect, useMemo, useState } from "react";
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

import api from "../../services/api.js";
export default function Reports() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState("");

  const loadReports = async () => {
    setLoading(true);

    try {
      const response = await api.get("/reports/summary");
      setData(response.data || {});
    } catch (e) {
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
    } catch (e2) {
      // Keep UI stable if export fails.
    } finally {
      setExporting("");
    }
  };

  return (
    React.createElement('div', { className: "reports-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}

      /* =====================================================
          PAGE HEADER
      ===================================================== */

      , React.createElement('header', { className: "reports-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}

        , React.createElement('div', { className: "reports-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}

          , React.createElement('div', { className: "reports-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}
            , React.createElement(BarChart3, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}} ), "PEOPLE ANALYTICS"

          )

          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}, "Reports & Analytics"  )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}, "Monitor workforce activity, attendance, leave, onboarding, payroll and HR support from one reporting workspace."



          )

        )

        , React.createElement('div', { className: "reports-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}

          , React.createElement('button', {
            className: "report-btn secondary" ,
            onClick: loadReports,
            disabled: loading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}

            , React.createElement(RefreshCw, {
              size: 14,
              className: loading ? "reports-spin" : "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
            ), "Refresh"

          )

          , React.createElement('button', {
            className: "report-btn secondary" ,
            onClick: () => exportReport("csv"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}

            , React.createElement(Download, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}} ), "Export CSV"

          )

          , React.createElement('button', {
            className: "report-btn primary" ,
            onClick: () => exportReport("excel"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}

            , React.createElement(FileSpreadsheet, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}} )

            , exporting === "excel"
              ? "Exporting..."
              : "Export Excel"
          )

        )

      )


      /* =====================================================
          KPI STRIP
      ===================================================== */

      , React.createElement('section', { className: "reports-kpis", __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}

        , metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            React.createElement('article', {
              className: "report-kpi",
              key: metric.title, __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}


              , React.createElement('div', {
                className: `report-kpi-icon ${metric.type}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}}

                , React.createElement(Icon, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}} )
              )

              , React.createElement('div', { className: "report-kpi-content", __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}, metric.title)

                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
                  , loading ? "—" : metric.value
                )

                , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}
                  , metric.subtitle
                )

              )

            )
          );
        })

      )


      /* =====================================================
          MAIN ANALYTICS
      ===================================================== */

      , React.createElement('section', { className: "reports-main-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}

        /* ATTENDANCE */

        , React.createElement('article', { className: "report-card attendance-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}

          , React.createElement('div', { className: "report-card-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
              , React.createElement('span', { className: "section-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}, "ATTENDANCE ANALYTICS"

              )

              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}, "Workforce attendance" )

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}, "Current employee attendance overview based on available attendance records."


              )
            )

            , React.createElement('div', { className: "header-icon blue" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
              , React.createElement(Clock3, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}} )
            )

          )


          , React.createElement('div', { className: "attendance-layout", __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}

            , React.createElement('div', { className: "attendance-number", __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}

              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
                , attendanceRate, "%"
              )

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}, "Attendance rate"

              )

            )


            , React.createElement('div', { className: "attendance-chart", __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}

              , React.createElement('div', { className: "attendance-bar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}

                , React.createElement('div', {
                  className: "attendance-fill",
                  style: {
                    width: `${attendanceRate}%`,
                  }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}
                )

              )

              , React.createElement('div', { className: "attendance-labels", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
                  , React.createElement('i', { className: "dot present" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}} ), "Present "
                   , present
                )

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}
                  , React.createElement('i', { className: "dot absent" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 334}} ), "Absent "
                   , absent
                )

              )

            )

          )


          , React.createElement('div', { className: "attendance-summary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}

            , React.createElement('div', { className: "summary-box", __self: this, __source: {fileName: _jsxFileName, lineNumber: 347}}

              , React.createElement(CheckCircle2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}} )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}, "Present")
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}, present)
              )

            )

            , React.createElement('div', { className: "summary-box", __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}

              , React.createElement(Clock3, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}} )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}, "Records")
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}, attendance)
              )

            )

            , React.createElement('div', { className: "summary-box", __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}

              , React.createElement(TrendingUp, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 371}} )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}, "Rate")
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}, attendanceRate, "%")
              )

            )

          )

        )


        /* HR ACTIVITY */

        , React.createElement('article', { className: "report-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}

          , React.createElement('div', { className: "report-card-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}
              , React.createElement('span', { className: "section-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}, "HR OPERATIONS"

              )

              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}, "Current activity" )

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}, "Live operational records across the HR modules."


              )
            )

            , React.createElement('div', { className: "header-icon purple" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}
              , React.createElement(Activity, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}} )
            )

          )


          , React.createElement('div', { className: "activity-list", __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}

            , React.createElement(ActivityRow, {
              icon: React.createElement(CalendarDays, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 414}} ),
              title: "Pending Leave" ,
              description: "Requests awaiting approval"  ,
              value: pendingLeave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}
            )

            , React.createElement(ActivityRow, {
              icon: React.createElement(UserCheck, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}} ),
              title: "Onboarding",
              description: "Active employee journeys"  ,
              value: onboarding, __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}
            )

            , React.createElement(ActivityRow, {
              icon: React.createElement(WalletCards, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 428}} ),
              title: "Payroll",
              description: "Payroll records" ,
              value: payroll, __self: this, __source: {fileName: _jsxFileName, lineNumber: 427}}
            )

            , React.createElement(ActivityRow, {
              icon: React.createElement(Headphones, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}} ),
              title: "HR Support" ,
              description: "Employee support requests"  ,
              value: support, __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}
            )

          )

        )

      )


      /* =====================================================
          WORKFORCE SNAPSHOT
      ===================================================== */

      , React.createElement('section', { className: "workforce-panel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}

        , React.createElement('div', { className: "workforce-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 454}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 456}}

            , React.createElement('span', { className: "section-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}, "WORKFORCE SNAPSHOT"

            )

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 462}}, "People Operations overview"  )

          )

          , React.createElement('div', { className: "live-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 467}} ), "Live reporting"

          )

        )


        , React.createElement('div', { className: "workforce-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}}

          , React.createElement(Snapshot, {
            icon: React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 477}} ),
            label: "Employees",
            value: employees,
            text: "Total employee records"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 476}}
          )

          , React.createElement(Snapshot, {
            icon: React.createElement(Clock3, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 484}} ),
            label: "Attendance",
            value: attendance,
            text: "Attendance records" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 483}}
          )

          , React.createElement(Snapshot, {
            icon: React.createElement(CalendarDays, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 491}} ),
            label: "Leave",
            value: pendingLeave,
            text: "Pending requests" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}
          )

          , React.createElement(Snapshot, {
            icon: React.createElement(UserCheck, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}} ),
            label: "Onboarding",
            value: onboarding,
            text: "Active journeys" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 497}}
          )

          , React.createElement(Snapshot, {
            icon: React.createElement(WalletCards, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}} ),
            label: "Payroll",
            value: payroll,
            text: "Payroll records" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 504}}
          )

          , React.createElement(Snapshot, {
            icon: React.createElement(Headphones, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 512}} ),
            label: "Support",
            value: support,
            text: "Support requests" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 511}}
          )

        )

      )


      /* =====================================================
          REPORT CATALOG
      ===================================================== */

      , React.createElement('section', { className: "report-card catalog-section" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 527}}

        , React.createElement('div', { className: "catalog-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 529}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}

            , React.createElement('span', { className: "section-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 533}}, "REPORT CATALOG"

            )

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 537}}, "Available HR reports"  )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 539}}, "Reporting areas available across the People Operations platform."


            )

          )

        )


        , React.createElement('div', { className: "catalog-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 549}}

          , React.createElement(ReportItem, {
            icon: React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 552}} ),
            title: "Employee Report" ,
            description: "Employee profiles, departments and workforce information."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 551}}
          )

          , React.createElement(ReportItem, {
            icon: React.createElement(Clock3, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 558}} ),
            title: "Attendance Report" ,
            description: "Check-in, check-out, working hours and overtime."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 557}}
          )

          , React.createElement(ReportItem, {
            icon: React.createElement(CalendarDays, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 564}} ),
            title: "Leave Report" ,
            description: "Leave requests, balances and approval activity."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 563}}
          )

          , React.createElement(ReportItem, {
            icon: React.createElement(WalletCards, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 570}} ),
            title: "Payroll Report" ,
            description: "Payroll processing and employee compensation records."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 569}}
          )

          , React.createElement(ReportItem, {
            icon: React.createElement(UserCheck, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 576}} ),
            title: "Onboarding Report" ,
            description: "Employee onboarding progress and completion."    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 575}}
          )

          , React.createElement(ReportItem, {
            icon: React.createElement(Headphones, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 582}} ),
            title: "HR Support Report"  ,
            description: "Employee requests and HR service desk activity."      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 581}}
          )

        )

      )


      /* =====================================================
          EXPORT AREA
      ===================================================== */

      , React.createElement('section', { className: "reports-export", __self: this, __source: {fileName: _jsxFileName, lineNumber: 596}}

        , React.createElement('div', { className: "export-content", __self: this, __source: {fileName: _jsxFileName, lineNumber: 598}}

          , React.createElement('div', { className: "export-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 600}}
            , React.createElement(FileSpreadsheet, { size: 20, __self: this, __source: {fileName: _jsxFileName, lineNumber: 601}} )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 604}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 606}}, "DATA EXPORT" )

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 608}}, "Download HR reports"  )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 610}}, "Export current reporting data for analysis, sharing or record keeping."


            )

          )

        )


        , React.createElement('div', { className: "export-buttons", __self: this, __source: {fileName: _jsxFileName, lineNumber: 620}}

          , React.createElement('button', {
            className: "export-btn",
            onClick: () => exportReport("csv"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}

            , React.createElement(FileText, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 626}} ), "CSV"

          )

          , React.createElement('button', {
            className: "export-btn blue" ,
            onClick: () => exportReport("excel"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 630}}

            , React.createElement(FileSpreadsheet, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 634}} )
            , exporting === "excel"
              ? "Exporting..."
              : "Excel"
          )

        )

      )


      /* =====================================================
          FOOTER NOTE
      ===================================================== */

      , React.createElement('div', { className: "reports-footer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 649}}

        , React.createElement(ShieldCheck, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}} )

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}, "HR reports are generated from the current People Operations records."


        )

      )

    )
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
    React.createElement('div', { className: "activity-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 676}}

      , React.createElement('div', { className: "activity-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}
        , icon
      )

      , React.createElement('div', { className: "activity-content", __self: this, __source: {fileName: _jsxFileName, lineNumber: 682}}

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 684}}, title)

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 686}}, description)

      )

      , React.createElement('b', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 690}}, value)

    )
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
    React.createElement('div', { className: "snapshot-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 708}}

      , React.createElement('div', { className: "snapshot-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 710}}
        , icon
      )

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 714}}

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 716}}, label)

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 718}}, value)

        , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 720}}, text)

      )

    )
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
    React.createElement('div', { className: "report-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 739}}

      , React.createElement('div', { className: "report-item-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 741}}
        , icon
      )

      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 745}}

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 747}}, title)

        , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 749}}, description)

      )

    )
  );
}