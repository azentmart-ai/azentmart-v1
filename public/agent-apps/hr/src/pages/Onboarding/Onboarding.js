const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Onboarding/Onboarding.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  Users,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

import { onboardingService } from "../../services/onboardingService.js";

/* =========================================================
   ONBOARDING PAGE
========================================================= */

export default function Onboarding() {

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");


  /* =========================================================
     LOAD DATA
  ========================================================= */

  const load = async () => {

    setLoading(true);

    try {

      const data =
        await onboardingService.list();

      setItems(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Unable to load onboarding:",
        error
      );

      setItems([]);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    load();

  }, []);


  /* =========================================================
     FILTER
  ========================================================= */

  const filteredEmployees = useMemo(() => {

    const query =
      search
        .trim()
        .toLowerCase();


    return items.filter((item) => {

      const name =
        String(
          item.name ||
          item.employee ||
          item.employee_name ||
          ""
        ).toLowerCase();


      const employeeId =
        String(
          item.employee_id ||
          item.employeeId ||
          ""
        ).toLowerCase();


      const department =
        String(
          item.department || ""
        ).toLowerCase();


      const itemStatus =
        item.status ||
        "Not Started";


      const matchesSearch =
        !query ||
        name.includes(query) ||
        employeeId.includes(query) ||
        department.includes(query);


      const matchesStatus =
        status === "All" ||
        itemStatus === status;


      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    items,
    search,
    status,
  ]);


  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {

    const total =
      items.length;


    const completed =
      items.filter(
        (item) =>
          item.status ===
          "Completed"
      ).length;


    const progress =
      items.filter(
        (item) =>
          item.status ===
          "In Progress"
      ).length;


    const pending =
      items.filter(
        (item) =>
          !item.status ||
          item.status ===
          "Not Started"
      ).length;


    return {
      total,
      completed,
      progress,
      pending,
    };

  }, [items]);


  /* =========================================================
     HELPERS
  ========================================================= */

  const getName = (item) => {

    return (
      item.name ||
      item.employee ||
      item.employee_name ||
      "Employee"
    );

  };


  const getEmployeeId = (item) => {

    return (
      item.employee_id ||
      item.employeeId ||
      item.id ||
      "—"
    );

  };


  const getInitials = (name) => {

    return String(name)
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0)
      )
      .join("")
      .toUpperCase();

  };


  const getProgress = (item) => {

    const value =
      Number(
        item.progress || 0
      );

    return Math.min(
      100,
      Math.max(
        0,
        value
      )
    );

  };


  const getTasks = (item) => {

    const tasks =
      Array.isArray(item.tasks)
        ? item.tasks
        : [];


    const completed =
      tasks.filter(
        (task) =>
          _optionalChain([task, 'optionalAccess', _ => _.completed])
      ).length;


    return {
      completed,
      total: tasks.length,
    };

  };


  const getStatusClass = (
    itemStatus
  ) => {

    if (
      itemStatus ===
      "Completed"
    ) {

      return "onboarding-status completed";

    }


    if (
      itemStatus ===
      "In Progress"
    ) {

      return "onboarding-status progress";

    }


    return "onboarding-status pending";

  };


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    React.createElement('div', { className: "onboarding-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}

      /* =====================================================
          HEADER
      ===================================================== */

      , React.createElement('div', { className: "onboarding-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}

          , React.createElement('div', { className: "onboarding-eyebrow", __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 323}} ), "PEOPLE OPERATIONS"

          )


          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}, "Employee Onboarding"

          )


          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}, "Manage employee onboarding journeys from one place."


          )

        )


        , React.createElement('div', { className: "onboarding-header-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}

          , React.createElement('button', {
            type: "button",
            className: "onboarding-refresh",
            onClick: load,
            disabled: loading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}


            , React.createElement(RefreshCw, {
              size: 15,
              className: 
                loading
                  ? "animate-spin"
                  : ""
              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}
            ), "Refresh"



          )


          , React.createElement(Link, {
            to: "/onboarding/ai",
            className: "onboarding-refresh", __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}

            , React.createElement(Sparkles, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}} ), "AI assistant"

          )

          , React.createElement(Link, {
            to: "/onboarding/new",
            className: "onboarding-start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}


            , React.createElement(Plus, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}} ), "Start onboarding"



          )

        )

      )


      /* =====================================================
          SUMMARY STRIP
      ===================================================== */

      , React.createElement('div', { className: "onboarding-summary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}

        , React.createElement(SummaryItem, {
          icon: React.createElement(Users, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}} ),
          value: stats.total,
          label: "Total employees" ,
          type: "blue", __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}
        )


        , React.createElement(SummaryItem, {
          icon: React.createElement(CheckCircle2, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}} ),
          value: stats.completed,
          label: "Completed",
          type: "green", __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}
        )


        , React.createElement(SummaryItem, {
          icon: React.createElement(Clock3, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}} ),
          value: stats.progress,
          label: "In progress" ,
          type: "purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}
        )


        , React.createElement(SummaryItem, {
          icon: React.createElement(ClipboardCheck, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}} ),
          value: stats.pending,
          label: "Not started" ,
          type: "orange", __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}
        )

      )


      /* =====================================================
          FILTER BAR
      ===================================================== */

      , React.createElement('div', { className: "onboarding-toolbar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 432}}

        , React.createElement('div', { className: "onboarding-search", __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}

          , React.createElement(Search, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}} )

          , React.createElement('input', {
            type: "text",
            value: search,
            onChange: (e) =>
              setSearch(
                e.target.value
              )
            ,
            placeholder: "Search employee, ID or department..."    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}
          )

        )


        , React.createElement('div', { className: "onboarding-filter", __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}

          , React.createElement('select', {
            value: status,
            onChange: (e) =>
              setStatus(
                e.target.value
              )
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 454}}


            , React.createElement('option', { value: "All", __self: this, __source: {fileName: _jsxFileName, lineNumber: 463}}, "All status"

            )

            , React.createElement('option', { value: "Not Started" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 467}}, "Not Started"

            )

            , React.createElement('option', { value: "In Progress" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}}, "In Progress"

            )

            , React.createElement('option', { value: "Completed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}, "Completed"

            )

          )

        )

      )


      /* =====================================================
          EMPLOYEE COUNT
      ===================================================== */

      , React.createElement('div', { className: "onboarding-section-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 492}}

          , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 494}}, "Onboarding employees"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 498}}
            , filteredEmployees.length
            , " ", "employee"

            , filteredEmployees.length !== 1
              ? "s"
              : "", " ", "found"

          )

        )

      )


      /* =====================================================
          LOADING
      ===================================================== */

      , loading ? (

        React.createElement('div', { className: "onboarding-loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 519}}

          , React.createElement(RefreshCw, {
            size: 20,
            className: "animate-spin", __self: this, __source: {fileName: _jsxFileName, lineNumber: 521}}
          )

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 526}}, "Loading employees..."

          )

        )

      ) : filteredEmployees.length ? (

        /* ===================================================
           EMPLOYEE CARDS
        =================================================== */

        React.createElement('div', { className: "onboarding-employee-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 538}}

          , filteredEmployees.map(
            (item) => {

              const name =
                getName(item);

              const employeeId =
                getEmployeeId(item);

              const progress =
                getProgress(item);

              const tasks =
                getTasks(item);

              const itemStatus =
                item.status ||
                "Not Started";


              return (

                React.createElement('div', {
                  key: 
                    item.id ||
                    employeeId
                  ,
                  className: "onboarding-employee-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 562}}


                  /* CARD TOP */

                  , React.createElement('div', { className: "onboarding-card-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 572}}

                    , React.createElement('div', { className: "onboarding-employee-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}

                      , getInitials(
                        name
                      )

                    )


                    , React.createElement('div', { className: "onboarding-employee-info", __self: this, __source: {fileName: _jsxFileName, lineNumber: 583}}

                      , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 585}}
                        , name
                      )


                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 590}}, "Employee #"

                        , employeeId
                      )

                    )


                    , React.createElement('div', {
                      className: getStatusClass(
                        itemStatus
                      ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 598}}


                      , itemStatus

                    )

                  )


                  /* DETAILS */

                  , React.createElement('div', { className: "onboarding-details", __self: this, __source: {fileName: _jsxFileName, lineNumber: 613}}

                    , React.createElement(DetailItem, {
                      icon: 
                        React.createElement(Users, {
                          size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 617}}
                        )
                      ,
                      label: "Department",
                      value: 
                        item.department ||
                        "Not assigned"
                      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 615}}
                    )


                    , React.createElement(DetailItem, {
                      icon: 
                        React.createElement(CalendarDays, {
                          size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 631}}
                        )
                      ,
                      label: "Joining date" ,
                      value: 
                        item.joining_date ||
                        item.date_joined ||
                        item.doj ||
                        "Not available"
                      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}
                    )

                  )


                  /* PROGRESS */

                  , React.createElement('div', { className: "onboarding-progress", __self: this, __source: {fileName: _jsxFileName, lineNumber: 649}}

                    , React.createElement('div', { className: "onboarding-progress-head", __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}, "Onboarding progress"

                      )

                      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 657}}
                        , progress, "%"
                      )

                    )


                    , React.createElement('div', { className: "onboarding-progress-track", __self: this, __source: {fileName: _jsxFileName, lineNumber: 664}}

                      , React.createElement('div', {
                        className: 
                          progress === 100
                            ? "onboarding-progress-fill complete"
                            : "onboarding-progress-fill"
                        ,
                        style: {
                          width:
                            `${progress}%`,
                        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 666}}
                      )

                    )

                  )


                  /* TASKS */

                  , React.createElement('div', { className: "onboarding-card-footer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 685}}

                    , React.createElement('div', { className: "onboarding-task-count", __self: this, __source: {fileName: _jsxFileName, lineNumber: 687}}

                      , React.createElement(ClipboardCheck, {
                        size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 689}}
                      )

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 693}}
                        , tasks.completed, "/"

                        , tasks.total
                        , " ", "tasks completed"

                      )

                    )


                    , React.createElement(Link, {
                      to: `/onboarding/journey/${item.id}`,
                      className: "onboarding-view", __self: this, __source: {fileName: _jsxFileName, lineNumber: 704}}
, "View onboarding"



                      , React.createElement(ArrowRight, {
                        size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 711}}
                      )

                    )

                  )

                )

              );

            }
          )

        )

      ) : (

        /* ===================================================
           EMPTY
        =================================================== */

        React.createElement('div', { className: "onboarding-empty", __self: this, __source: {fileName: _jsxFileName, lineNumber: 734}}

          , React.createElement('div', { className: "onboarding-empty-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 736}}

            , React.createElement(UserRound, { size: 24, __self: this, __source: {fileName: _jsxFileName, lineNumber: 738}} )

          )


          , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 743}}, "No employees found"

          )


          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 748}}, "Try changing your search or status filter."


          )


          , React.createElement('button', {
            type: "button",
            onClick: () => {
              setSearch("");
              setStatus("All");
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 754}}
, "Clear filters"

          )

        )

      )

    )

  );

}


/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  icon,
  value,
  label,
  type,
}) {

  return (

    React.createElement('div', { className: "onboarding-summary-item", __self: this, __source: {fileName: _jsxFileName, lineNumber: 788}}

      , React.createElement('div', {
        className: `onboarding-summary-icon ${type}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 790}}

        , icon
      )


      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 797}}

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 799}}
          , value
        )

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 803}}
          , label
        )

      )

    )

  );

}


/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  icon,
  label,
  value,
}) {

  return (

    React.createElement('div', { className: "onboarding-detail", __self: this, __source: {fileName: _jsxFileName, lineNumber: 828}}

      , React.createElement('div', { className: "onboarding-detail-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 830}}
        , icon
      )


      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 835}}

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 837}}
          , label
        )

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 841}}
          , value
        )

      )

    )

  );

}