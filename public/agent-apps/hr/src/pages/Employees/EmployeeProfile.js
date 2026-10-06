const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Employees/EmployeeProfile.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useState } from "react";

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

import { employeeService } from "../../services/employeeService.js";

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
            _optionalChain([err, 'access', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.detail]) ||
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
    if (!_optionalChain([employee, 'optionalAccess', _4 => _4.name])) {
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
    return React.createElement(ProfileSkeleton, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 83}} );
  }


  if (error) {
    return (
      React.createElement('div', { className: "employee-profile-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
        , React.createElement(Link, {
          to: "/employees",
          className: "profile-back-link", __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}

          , React.createElement(ArrowLeft, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}} ), "Back to Employees"

        )

        , React.createElement('div', { className: "profile-error", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
          , React.createElement(ShieldCheck, { size: 20, __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}} )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}, "Unable to open employee profile"    )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}, error)
          )
        )
      )
    );
  }


  if (!employee) {
    return (
      React.createElement('div', { className: "employee-profile-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}
        , React.createElement('div', { className: "profile-empty", __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
          , React.createElement(UserRound, { size: 28, __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}} )

          , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}, "Employee not found"  )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}, "The employee record could not be found in the HR database."

          )

          , React.createElement(Link, { to: "/employees", __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}, "Return to Employees"

          )
        )
      )
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
      count: _optionalChain([employee, 'access', _5 => _5.attendance, 'optionalAccess', _6 => _6.length]) || 0,
    },
    {
      id: "leave",
      label: "Leave",
      count: _optionalChain([employee, 'access', _7 => _7.leave, 'optionalAccess', _8 => _8.length]) || 0,
    },
    {
      id: "payroll",
      label: "Payroll",
      count: _optionalChain([employee, 'access', _9 => _9.payroll, 'optionalAccess', _10 => _10.length]) || 0,
    },
    {
      id: "documents",
      label: "Documents",
      count: _optionalChain([employee, 'access', _11 => _11.documents, 'optionalAccess', _12 => _12.length]) || 0,
    },
  ];


  return (
    React.createElement('div', { className: "employee-profile-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}

      /* ================================================= */
      /* BACK */
      /* ================================================= */

      , React.createElement(Link, {
        to: "/employees",
        className: "profile-back-link", __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}

        , React.createElement(ArrowLeft, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}} ), "Employees"

      )


      /* ================================================= */
      /* EMPLOYEE HERO */
      /* ================================================= */

      , React.createElement('section', { className: "employee-hero", __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}

        , React.createElement('div', { className: "employee-hero-main", __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}

          , React.createElement('div', { className: "employee-avatar-large", __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
            , initials
          )


          , React.createElement('div', { className: "employee-hero-info", __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}

            , React.createElement('div', { className: "employee-status-line", __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}

              , React.createElement('span', { className: "employee-id-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}, "EMPLOYEE PROFILE"

              )

              , React.createElement('span', { className: "employee-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 199}} )
                , employee.status || "Active"
              )

            )


            , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}
              , employee.name
            )


            , React.createElement('p', { className: "employee-role", __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}
              , employee.designation || "Employee"

              , employee.department && (
                React.createElement(React.Fragment, null
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}, "•")
                  , employee.department
                )
              )
            )


            , React.createElement('div', { className: "employee-meta", __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}
                , React.createElement(MapPin, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}} )
                , employee.location || "Location not available"
              )


              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
                , React.createElement(CalendarDays, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}} ), "Joined "
                 , employee.join_date || "—"
              )


              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
                , React.createElement(BriefcaseBusiness, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}} )
                , employee.employment_type || "Full time"
              )

            )

          )

        )


        , React.createElement('div', { className: "employee-hero-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}

          , React.createElement(Link, {
            to: `/employees/${id}/edit`,
            className: "profile-secondary-button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}
, "Edit profile"

          )

        )

      )


      /* ================================================= */
      /* NAVIGATION TABS */
      /* ================================================= */

      , React.createElement('div', { className: "profile-tabs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}

        , tabs.map((tab) => (

          React.createElement('button', {
            key: tab.id,
            type: "button",
            className: 
              activeTab === tab.id
                ? "profile-tab active"
                : "profile-tab"
            ,
            onClick: () => setActiveTab(tab.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}


            , tab.label

            , typeof tab.count === "number" && (
              React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
                , tab.count
              )
            )

          )

        ))

      )


      /* ================================================= */
      /* CONTENT */
      /* ================================================= */

      , activeTab === "overview" && (
        React.createElement(Overview, {
          employee: employee,
          initials: initials, __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
        )
      )


      , activeTab === "attendance" && (
        React.createElement(DataTable, {
          title: "Attendance history" ,
          description: "Employee attendance and working-time records."    ,
          icon: Clock3,
          columns: [
            "Date",
            "Check in",
            "Check out",
            "Status",
          ],
          rows: (employee.attendance || []).map((item) => [
            item.date,
            item.check_in || "—",
            item.check_out || "—",
            item.status || "—",
          ]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
        )
      )


      , activeTab === "leave" && (
        React.createElement(DataTable, {
          title: "Leave history" ,
          description: "Employee leave requests and their current status."      ,
          icon: CalendarDays,
          columns: [
            "Leave type",
            "Start",
            "End",
            "Status",
          ],
          rows: (employee.leave || []).map((item) => [
            item.leave_type || "—",
            item.start_date || "—",
            item.end_date || "—",
            item.status || "—",
          ]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}
        )
      )


      , activeTab === "payroll" && (
        React.createElement(DataTable, {
          title: "Payroll history" ,
          description: "Employee payroll records and payment status."     ,
          icon: WalletCards,
          columns: [
            "Month",
            "Net pay",
            "Status",
          ],
          rows: (employee.payroll || []).map((item) => [
            item.month || "—",
            item.net_pay
              ? `₹ ${Number(item.net_pay).toLocaleString("en-IN")}`
              : "₹ 0",
            item.status || "—",
          ]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}
        )
      )


      , activeTab === "documents" && (
        React.createElement(DataTable, {
          title: "Employee documents" ,
          description: "Contracts, certificates and HR documents."    ,
          icon: FileText,
          columns: [
            "Document",
            "Category",
            "Status",
          ],
          rows: (employee.documents || []).map((item) => [
            item.title || "Untitled document",
            item.category || "HR",
            item.status || "—",
          ]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}
        )
      )

    )
  );
}


/* ========================================================= */
/* OVERVIEW */
/* ========================================================= */

function Overview({ employee }) {
  return (
    React.createElement('div', { className: "profile-overview-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 401}}

      /* ----------------------------------------------- */
      /* PERSONAL INFORMATION */
      /* ----------------------------------------------- */

      , React.createElement('section', { className: "profile-panel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}

        , React.createElement(PanelHeader, {
          eyebrow: "PERSONAL INFORMATION" ,
          title: "Contact & identity"  ,
          icon: UserRound, __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}
        )


        , React.createElement('div', { className: "profile-info-list", __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}

          , React.createElement(InfoItem, {
            label: "Full name" ,
            value: employee.name,
            icon: UserRound, __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}
          )

          , React.createElement(InfoItem, {
            label: "Email address" ,
            value: employee.email,
            icon: Mail, __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
          )

          , React.createElement(InfoItem, {
            label: "Phone number" ,
            value: employee.phone || "Not provided",
            icon: Phone, __self: this, __source: {fileName: _jsxFileName, lineNumber: 430}}
          )

          , React.createElement(InfoItem, {
            label: "Location",
            value: employee.location || "Not provided",
            icon: MapPin, __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}
          )

        )

      )


      /* ----------------------------------------------- */
      /* WORK INFORMATION */
      /* ----------------------------------------------- */

      , React.createElement('section', { className: "profile-panel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}

        , React.createElement(PanelHeader, {
          eyebrow: "WORK INFORMATION" ,
          title: "Employment details" ,
          icon: BriefcaseBusiness, __self: this, __source: {fileName: _jsxFileName, lineNumber: 453}}
        )


        , React.createElement('div', { className: "profile-info-list", __self: this, __source: {fileName: _jsxFileName, lineNumber: 460}}

          , React.createElement(InfoItem, {
            label: "Employee ID" ,
            value: 
              employee.employee_id ||
              employee.id ||
              "—"
            ,
            icon: BriefcaseBusiness, __self: this, __source: {fileName: _jsxFileName, lineNumber: 462}}
          )

          , React.createElement(InfoItem, {
            label: "Designation",
            value: employee.designation || "—",
            icon: BriefcaseBusiness, __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}
          )

          , React.createElement(InfoItem, {
            label: "Department",
            value: employee.department || "—",
            icon: BriefcaseBusiness, __self: this, __source: {fileName: _jsxFileName, lineNumber: 478}}
          )

          , React.createElement(InfoItem, {
            label: "Manager",
            value: employee.manager || "—",
            icon: UserRound, __self: this, __source: {fileName: _jsxFileName, lineNumber: 484}}
          )

          , React.createElement(InfoItem, {
            label: "Date of joining"  ,
            value: employee.join_date || "—",
            icon: CalendarDays, __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}
          )

          , React.createElement(InfoItem, {
            label: "Employment type" ,
            value: employee.employment_type || "—",
            icon: BriefcaseBusiness, __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}
          )

        )

      )


      /* ----------------------------------------------- */
      /* COMPENSATION */
      /* ----------------------------------------------- */

      , React.createElement('section', { className: "profile-panel profile-panel-wide" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 511}}

        , React.createElement(PanelHeader, {
          eyebrow: "COMPENSATION",
          title: "Salary & payroll"  ,
          icon: WalletCards, __self: this, __source: {fileName: _jsxFileName, lineNumber: 513}}
        )


        , React.createElement('div', { className: "compensation-layout", __self: this, __source: {fileName: _jsxFileName, lineNumber: 520}}

          , React.createElement('div', { className: "salary-highlight", __self: this, __source: {fileName: _jsxFileName, lineNumber: 522}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 524}}, "Current salary"

            )

            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 528}}
              , employee.salary
                ? `₹ ${Number(employee.salary).toLocaleString("en-IN")}`
                : "Not available"
            )

            , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 534}}, "Payroll information from HR records"

            )

          )


          , React.createElement('div', { className: "salary-details", __self: this, __source: {fileName: _jsxFileName, lineNumber: 541}}

            , React.createElement(InfoItem, {
              label: "Payroll records" ,
              value: `${_optionalChain([employee, 'access', _13 => _13.payroll, 'optionalAccess', _14 => _14.length]) || 0} records`,
              icon: WalletCards, __self: this, __source: {fileName: _jsxFileName, lineNumber: 543}}
            )

            , React.createElement(InfoItem, {
              label: "Leave records" ,
              value: `${_optionalChain([employee, 'access', _15 => _15.leave, 'optionalAccess', _16 => _16.length]) || 0} requests`,
              icon: CalendarDays, __self: this, __source: {fileName: _jsxFileName, lineNumber: 549}}
            )

            , React.createElement(InfoItem, {
              label: "Documents",
              value: `${_optionalChain([employee, 'access', _17 => _17.documents, 'optionalAccess', _18 => _18.length]) || 0} files`,
              icon: FileText, __self: this, __source: {fileName: _jsxFileName, lineNumber: 555}}
            )

          )

        )

      )


      /* ----------------------------------------------- */
      /* EMPLOYEE SNAPSHOT */
      /* ----------------------------------------------- */

      , React.createElement('section', { className: "profile-panel profile-panel-wide" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 572}}

        , React.createElement(PanelHeader, {
          eyebrow: "EMPLOYEE SNAPSHOT" ,
          title: "HR record overview"  ,
          icon: ShieldCheck, __self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}
        )


        , React.createElement('div', { className: "profile-stat-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 581}}

          , React.createElement(ProfileStat, {
            label: "Attendance records" ,
            value: _optionalChain([employee, 'access', _19 => _19.attendance, 'optionalAccess', _20 => _20.length]) || 0, __self: this, __source: {fileName: _jsxFileName, lineNumber: 583}}
          )

          , React.createElement(ProfileStat, {
            label: "Leave requests" ,
            value: _optionalChain([employee, 'access', _21 => _21.leave, 'optionalAccess', _22 => _22.length]) || 0, __self: this, __source: {fileName: _jsxFileName, lineNumber: 588}}
          )

          , React.createElement(ProfileStat, {
            label: "Payroll records" ,
            value: _optionalChain([employee, 'access', _23 => _23.payroll, 'optionalAccess', _24 => _24.length]) || 0, __self: this, __source: {fileName: _jsxFileName, lineNumber: 593}}
          )

          , React.createElement(ProfileStat, {
            label: "Documents",
            value: _optionalChain([employee, 'access', _25 => _25.documents, 'optionalAccess', _26 => _26.length]) || 0, __self: this, __source: {fileName: _jsxFileName, lineNumber: 598}}
          )

        )

      )

    )
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
    React.createElement('div', { className: "profile-panel-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}

      , React.createElement('div', { className: "profile-panel-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 624}}
        , React.createElement(Icon, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 625}} )
      )


      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 631}}
          , eyebrow
        )

        , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 635}}
          , title
        )

      )

    )
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
    React.createElement('div', { className: "profile-info-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 656}}

      , React.createElement('div', { className: "profile-info-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 658}}
        , React.createElement(Icon, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 659}} )
      )


      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 663}}

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 665}}
          , label
        )

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 669}}
          , value || "—"
        )

      )

    )
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
    React.createElement('div', { className: "profile-stat", __self: this, __source: {fileName: _jsxFileName, lineNumber: 689}}

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 691}}
        , label
      )

      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 695}}
        , value
      )

      , React.createElement(ChevronRight, {
        size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 699}}
      )

    )
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
    React.createElement('section', { className: "profile-data-panel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 720}}

      , React.createElement('div', { className: "profile-data-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 722}}

        , React.createElement('div', { className: "profile-data-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 724}}

          , React.createElement('div', { className: "profile-panel-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 726}}
            , React.createElement(Icon, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 727}} )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 730}}

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 732}}
              , title
            )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 736}}
              , description
            )

          )

        )

      )


      , rows.length ? (

        React.createElement('div', { className: "profile-table-scroll", __self: this, __source: {fileName: _jsxFileName, lineNumber: 749}}

          , React.createElement('table', { className: "profile-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 751}}

            , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 753}}

              , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 755}}

                , columns.map((column) => (
                  React.createElement('th', { key: column, __self: this, __source: {fileName: _jsxFileName, lineNumber: 758}}
                    , column
                  )
                ))

              )

            )


            , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 768}}

              , rows.map((row, index) => (

                React.createElement('tr', { key: index, __self: this, __source: {fileName: _jsxFileName, lineNumber: 772}}

                  , row.map((value, columnIndex) => (

                    React.createElement('td', { key: columnIndex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 776}}

                      , columnIndex === row.length - 1 ? (

                        React.createElement('span', { className: "profile-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 780}}
                          , value
                        )

                      ) : (
                        value
                      )

                    )

                  ))

                )

              ))

            )

          )

        )

      ) : (

        React.createElement('div', { className: "profile-empty-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 804}}

          , React.createElement(FileText, { size: 24, __self: this, __source: {fileName: _jsxFileName, lineNumber: 806}} )

          , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 808}}, "No "
             , title.toLowerCase(), " yet"
          )

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 812}}, "Information will appear here when records are available."

          )

        )

      )

    )
  );
}


/* ========================================================= */
/* LOADING SKELETON */
/* ========================================================= */

function ProfileSkeleton() {
  return (
    React.createElement('div', { className: "employee-profile-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 831}}

      , React.createElement('div', { className: "profile-skeleton-back", __self: this, __source: {fileName: _jsxFileName, lineNumber: 833}} )

      , React.createElement('div', { className: "profile-skeleton-hero", __self: this, __source: {fileName: _jsxFileName, lineNumber: 835}}

        , React.createElement('div', { className: "profile-skeleton-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 837}} )

        , React.createElement('div', { className: "profile-skeleton-lines", __self: this, __source: {fileName: _jsxFileName, lineNumber: 839}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 841}} )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 842}} )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 843}} )

        )

      )


      , React.createElement('div', { className: "profile-skeleton-tabs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 850}} )


      , React.createElement('div', { className: "profile-skeleton-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 853}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 855}} )
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 856}} )
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 857}} )
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 858}} )

      )

    )
  );
}