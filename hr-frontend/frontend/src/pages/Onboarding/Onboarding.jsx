import React, { useEffect, useMemo, useState } from "react";

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

import { onboardingService } from "../../services/onboardingService";

import "./Onboarding.css";


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
          task?.completed
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

    <div className="onboarding-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="onboarding-header">

        <div>

          <div className="onboarding-eyebrow">
            <span />
            PEOPLE OPERATIONS
          </div>


          <h1>
            Employee Onboarding
          </h1>


          <p>
            Manage employee onboarding
            journeys from one place.
          </p>

        </div>


        <div className="onboarding-header-actions">

          <button
            type="button"
            className="onboarding-refresh"
            onClick={load}
            disabled={loading}
          >

            <RefreshCw
              size={15}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>


          <Link
            to="/onboarding/ai"
            className="onboarding-refresh"
          >
            <Sparkles size={15} />
            AI assistant
          </Link>

          <Link
            to="/onboarding/new"
            className="onboarding-start"
          >

            <Plus size={16} />

            Start onboarding

          </Link>

        </div>

      </div>


      {/* =====================================================
          SUMMARY STRIP
      ===================================================== */}

      <div className="onboarding-summary">

        <SummaryItem
          icon={<Users size={17} />}
          value={stats.total}
          label="Total employees"
          type="blue"
        />


        <SummaryItem
          icon={<CheckCircle2 size={17} />}
          value={stats.completed}
          label="Completed"
          type="green"
        />


        <SummaryItem
          icon={<Clock3 size={17} />}
          value={stats.progress}
          label="In progress"
          type="purple"
        />


        <SummaryItem
          icon={<ClipboardCheck size={17} />}
          value={stats.pending}
          label="Not started"
          type="orange"
        />

      </div>


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div className="onboarding-toolbar">

        <div className="onboarding-search">

          <Search size={16} />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search employee, ID or department..."
          />

        </div>


        <div className="onboarding-filter">

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
          >

            <option value="All">
              All status
            </option>

            <option value="Not Started">
              Not Started
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

          </select>

        </div>

      </div>


      {/* =====================================================
          EMPLOYEE COUNT
      ===================================================== */}

      <div className="onboarding-section-heading">

        <div>

          <h2>
            Onboarding employees
          </h2>

          <p>
            {filteredEmployees.length}
            {" "}
            employee
            {filteredEmployees.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (

        <div className="onboarding-loading">

          <RefreshCw
            size={20}
            className="animate-spin"
          />

          <span>
            Loading employees...
          </span>

        </div>

      ) : filteredEmployees.length ? (

        /* ===================================================
           EMPLOYEE CARDS
        =================================================== */

        <div className="onboarding-employee-grid">

          {filteredEmployees.map(
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

                <div
                  key={
                    item.id ||
                    employeeId
                  }
                  className="onboarding-employee-card"
                >

                  {/* CARD TOP */}

                  <div className="onboarding-card-top">

                    <div className="onboarding-employee-avatar">

                      {getInitials(
                        name
                      )}

                    </div>


                    <div className="onboarding-employee-info">

                      <h3>
                        {name}
                      </h3>


                      <span>
                        Employee #
                        {employeeId}
                      </span>

                    </div>


                    <div
                      className={getStatusClass(
                        itemStatus
                      )}
                    >

                      {itemStatus}

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="onboarding-details">

                    <DetailItem
                      icon={
                        <Users
                          size={14}
                        />
                      }
                      label="Department"
                      value={
                        item.department ||
                        "Not assigned"
                      }
                    />


                    <DetailItem
                      icon={
                        <CalendarDays
                          size={14}
                        />
                      }
                      label="Joining date"
                      value={
                        item.joining_date ||
                        item.date_joined ||
                        item.doj ||
                        "Not available"
                      }
                    />

                  </div>


                  {/* PROGRESS */}

                  <div className="onboarding-progress">

                    <div className="onboarding-progress-head">

                      <span>
                        Onboarding progress
                      </span>

                      <strong>
                        {progress}%
                      </strong>

                    </div>


                    <div className="onboarding-progress-track">

                      <div
                        className={
                          progress === 100
                            ? "onboarding-progress-fill complete"
                            : "onboarding-progress-fill"
                        }
                        style={{
                          width:
                            `${progress}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* TASKS */}

                  <div className="onboarding-card-footer">

                    <div className="onboarding-task-count">

                      <ClipboardCheck
                        size={14}
                      />

                      <span>
                        {tasks.completed}
                        /
                        {tasks.total}
                        {" "}
                        tasks completed
                      </span>

                    </div>


                    <Link
                      to={`/onboarding/journey/${item.id}`}
                      className="onboarding-view"
                    >

                      View onboarding

                      <ArrowRight
                        size={14}
                      />

                    </Link>

                  </div>

                </div>

              );

            }
          )}

        </div>

      ) : (

        /* ===================================================
           EMPTY
        =================================================== */

        <div className="onboarding-empty">

          <div className="onboarding-empty-icon">

            <UserRound size={24} />

          </div>


          <h3>
            No employees found
          </h3>


          <p>
            Try changing your search
            or status filter.
          </p>


          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatus("All");
            }}
          >
            Clear filters
          </button>

        </div>

      )}

    </div>

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

    <div className="onboarding-summary-item">

      <div
        className={`onboarding-summary-icon ${type}`}
      >
        {icon}
      </div>


      <div>

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

      </div>

    </div>

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

    <div className="onboarding-detail">

      <div className="onboarding-detail-icon">
        {icon}
      </div>


      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>

  );

}