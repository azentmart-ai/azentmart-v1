import React, { useEffect, useMemo, useState } from "react";
import {
  Bot,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  IndianRupee,
  Lock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserRound,
  Users,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

import { payrollService } from "../../services/payrollService";
import "./Payroll.css";

/*
 * Payroll.jsx
 *
 * Frontend responsibilities:
 * - Load payroll records
 * - Load employee records and merge them with payroll by employee_id/id/email
 * - Search/filter payroll
 * - Run payroll
 * - Approve/lock payroll
 * - Download payslip / NEFT / ZIP
 * - Show a complete payroll record drawer
 * - Automatically ask the Payroll LLM when a record is opened
 * - Send AI questions to the LLM + RAG backend
 *
 * Expected AI endpoint:
 * POST /api/ai/payroll/chat
 *
 * Payload:
 * {
 *   message,
 *   month,
 *   employee_id,
 *   context: "payroll"
 * }
 *
 * Expected response:
 * {
 *   answer: string,
 *   sources: [
 *     { title: string, type: string }
 *   ]
 * }
 */

const API_URL = window.AZENTMART_AGENT_CONFIG?.hrApi || "/hr-api";

const fallbackEmployees = [];



const payrollSteps = [
  {
    id: "attendance",
    number: "01",
    title: "Attendance",
    description: "Attendance, leave and overtime",
    icon: CalendarDays,
  },
  {
    id: "calculate",
    number: "02",
    title: "Calculate",
    description: "Gross, deductions and taxes",
    icon: IndianRupee,
  },
  {
    id: "review",
    number: "03",
    title: "Review",
    description: "HR verifies payroll",
    icon: Search,
  },
  {
    id: "approve",
    number: "04",
    title: "Approve",
    description: "Payroll is approved",
    icon: CheckCircle2,
  },
  {
    id: "lock",
    number: "05",
    title: "Lock",
    description: "Payroll is finalized",
    icon: Lock,
  },
];

const aiSuggestions = [
  "Why did payroll increase this month?",
  "Show employees with unusual deductions",
  "Explain TDS calculation",
  "Which employees have attendance issues?",
];

export default function Payroll() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("admin");

  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [actionMessage, setActionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Employee master data
  const [employees, setEmployees] = useState([]);

  // Record-level AI
  const [recordAiLoading, setRecordAiLoading] = useState(false);
  const [recordAiMessage, setRecordAiMessage] = useState("");
  const [recordAiSources, setRecordAiSources] = useState([]);

  // AI drawer
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [aiMessages, setAiMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I can help you understand payroll, deductions, attendance impact, policies and employee salary information.",
      sources: [],
    },
  ]);

  const getToken = () =>
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");

  const authHeaders = () => {
    const token = getToken();

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  const normalizeList = (result, keys = []) => {
    if (Array.isArray(result)) return result;

    for (const key of keys) {
      if (Array.isArray(result?.[key])) {
        return result[key];
      }
    }

    return [];
  };

  const normalizeEmployee = (employee) => {
    if (!employee) return null;

    return {
      ...employee,

      id:
        employee.id ??
        employee.employee_id ??
        employee.employeeId,

      employee_id:
        employee.employee_id ??
        employee.employeeId ??
        employee.emp_id ??
        employee.id,

      employee:
        employee.employee ??
        employee.employee_name ??
        employee.full_name ??
        employee.name ??
        employee.display_name ??
        "Employee",

      email:
        employee.email ??
        employee.email_id ??
        "",

      phone:
        employee.phone ??
        employee.phone_number ??
        employee.mobile ??
        "",

      role:
        employee.role ??
        employee.designation ??
        employee.job_title ??
        "",

      department:
        employee.department ??
        employee.department_name ??
        "",

      location:
        employee.location ??
        employee.work_location ??
        "",

      date_joined:
        employee.date_joined ??
        employee.joining_date ??
        employee.doj ??
        "",

      employment_type:
        employee.employment_type ??
        employee.employment_status ??
        "Full-time",

      manager:
        employee.manager ??
        employee.manager_name ??
        "",

      status:
        employee.status ??
        "Active",
    };
  };

  const mergePayrollWithEmployee = (
    payroll,
    employeeList
  ) => {
    const payrollEmployeeId =
      payroll.employee_id ??
      payroll.employeeId ??
      payroll.emp_id;

    const payrollEmail =
      payroll.email ??
      payroll.employee_email;

    const payrollEmployee =
      payroll.employee ??
      payroll.employee_name ??
      payroll.full_name ??
      payroll.name;

    const employee =
      employeeList.find((emp) => {
        const id =
          emp.employee_id ??
          emp.employeeId ??
          emp.emp_id ??
          emp.id;

        return (
          payrollEmployeeId != null &&
          id != null &&
          String(id) === String(payrollEmployeeId)
        );
      }) ||
      employeeList.find((emp) => {
        const id = emp.id;

        return (
          payrollEmployeeId != null &&
          id != null &&
          String(id) === String(payrollEmployeeId)
        );
      }) ||
      employeeList.find(
        (emp) =>
          payrollEmail &&
          emp.email &&
          String(emp.email).toLowerCase() ===
            String(payrollEmail).toLowerCase()
      ) ||
      employeeList.find(
        (emp) =>
          payrollEmployee &&
          emp.employee &&
          String(emp.employee).toLowerCase() ===
            String(payrollEmployee).toLowerCase()
      );

    const normalizedEmployee =
      normalizeEmployee(employee);

    return {
      ...payroll,

      employeeProfile:
        normalizedEmployee || null,

      id:
        payroll.id ??
        payroll.payroll_id ??
        payroll.payrollId,

      employee:
        payrollEmployee ||
        normalizedEmployee?.employee ||
        "Employee",

      employee_id:
        payrollEmployeeId ||
        normalizedEmployee?.employee_id ||
        normalizedEmployee?.id,

      email:
        payroll.email ||
        payroll.employee_email ||
        normalizedEmployee?.email ||
        "",

      phone:
        payroll.phone ||
        payroll.phone_number ||
        normalizedEmployee?.phone ||
        "",

      role:
        payroll.role ||
        payroll.designation ||
        normalizedEmployee?.role ||
        "",

      department:
        payroll.department ||
        normalizedEmployee?.department ||
        "",

      location:
        payroll.location ||
        normalizedEmployee?.location ||
        "",

      date_joined:
        payroll.date_joined ||
        payroll.joining_date ||
        payroll.doj ||
        normalizedEmployee?.date_joined ||
        "",

      employment_type:
        payroll.employment_type ||
        normalizedEmployee?.employment_type ||
        "Full-time",

      manager:
        payroll.manager ||
        normalizedEmployee?.manager ||
        "",

      status:
        payroll.status ||
        "Draft",
    };
  };

  /*
   * Load employee records.
   *
   * We first use payrollService.employees() if the service has it.
   * Otherwise we call /employees directly so the page remains compatible
   * while the service file is being updated.
   */
  const loadEmployees = async () => {
    try {
      let result;

      if (
        typeof payrollService.employees ===
        "function"
      ) {
        result =
          await payrollService.employees();
      } else {
        const response = await fetch(
          `${API_URL}/employees`,
          {
            headers: authHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Employee API failed: ${response.status}`
          );
        }

        result = await response.json();
      }

      const employeeData = normalizeList(
        result,
        [
          "items",
          "data",
          "employees",
          "results",
        ]
      );

      const normalized =
        employeeData.map(
          normalizeEmployee
        );

      setEmployees(normalized);

      return normalized;
    } catch (error) {
      console.error(
        "Employee loading failed:",
        error
      );

      setEmployees([]);

      return [];
    }
  };

  // ============================================================
  // LOAD PAYROLL + EMPLOYEES
  // ============================================================

  const load = async (showRefresh = false) => {
    try {
      setErrorMessage("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setBusy(true);
      }

      const [payrollResult, employeeData] =
        await Promise.all([
          payrollService.list(month),
          loadEmployees(),
        ]);

      const payrollData = normalizeList(
        payrollResult,
        [
          "items",
          "data",
          "payroll",
          "results",
        ]
      );

      const merged = payrollData.map(
        (payroll) =>
          mergePayrollWithEmployee(
            payroll,
            employeeData
          )
      );

      if (merged.length) {
        setItems(merged);
      } else {
        // Keep the page usable when the API returns no records.
        // Do not show demo records if real employees exist.
        if (employeeData.length === 0) {
          setItems([]);
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error(
        "Payroll loading failed:",
        error
      );

      setItems(
        []
      );

      setErrorMessage(
        error?.message ||
          "Payroll API is currently unavailable."
      );
    } finally {
      setBusy(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [month]);

  // ============================================================
  // TOTALS
  // ============================================================

  const totals = useMemo(
    () => ({
      gross: items.reduce(
        (sum, item) =>
          sum + Number(item.gross_pay || 0),
        0
      ),

      net: items.reduce(
        (sum, item) =>
          sum + Number(item.net_pay || 0),
        0
      ),

      tax: items.reduce(
        (sum, item) =>
          sum + Number(item.tds || 0),
        0
      ),

      pf: items.reduce(
        (sum, item) =>
          sum + Number(item.pf || 0),
        0
      ),

      claims: items.reduce(
        (sum, item) =>
          sum + Number(item.claims || 0),
        0
      ),
    }),
    [items]
  );

  // ============================================================
  // FILTERS
  // ============================================================

  const departments = useMemo(() => {
    return [
      "All",
      ...new Set(
        items
          .map((item) => item.department)
          .filter(Boolean)
      ),
    ];
  }, [items]);

  const filteredItems = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return items.filter((item) => {
      const employeeName =
        item.employee ||
        item.employee_name ||
        "";

      const employeeId =
        item.employee_id || "";

      const email = item.email || "";

      const matchesSearch =
        !query ||
        employeeName
          .toLowerCase()
          .includes(query) ||
        String(employeeId)
          .toLowerCase()
          .includes(query) ||
        email
          .toLowerCase()
          .includes(query);

      const matchesDepartment =
        department === "All" ||
        item.department === department;

      const matchesStatus =
        statusFilter === "All" ||
        String(item.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    items,
    search,
    department,
    statusFilter,
  ]);

  // ============================================================
  // GENERATE PAYROLL
  // ============================================================

  const generatePayroll = async () => {
    try {
      setProcessing(true);
      setActionMessage("");
      setErrorMessage("");

      const result =
        await payrollService.generate(
          month
        );

      setActionMessage(
        result?.message ||
          `${result?.created || 0} payroll record(s) generated.`
      );

      await load();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error?.message ||
          "Unable to generate payroll."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ============================================================
  // APPROVE + LOCK
  // ============================================================

  const approvePayroll = async () => {
    const draft = items.find(
      (item) =>
        String(item.status)
          .toLowerCase() === "draft"
    );

    if (!draft) {
      setErrorMessage(
        "There is no draft payroll available for approval."
      );
      return;
    }

    try {
      setProcessing(true);
      setErrorMessage("");

      if (
        typeof payrollService.approveAndLock ===
        "function"
      ) {
        await payrollService.approveAndLock(
          draft.id
        );
      } else {
        await payrollService.approve(
          draft.id
        );
      }

      setActionMessage(
        "Payroll approved successfully."
      );

      await load();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error?.message ||
          "Unable to approve payroll."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ============================================================
  // PAYSLIP
  // ============================================================

  const downloadPayslip = async (
    payrollId
  ) => {
    if (!payrollId) {
      setErrorMessage(
        "Payroll ID is missing."
      );
      return;
    }

    try {
      setDownloading(true);
      setErrorMessage("");

      await payrollService.downloadPayslip(
        payrollId
      );

      setActionMessage(
        "Payslip download started."
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error?.message ||
          "Unable to download payslip."
      );
    } finally {
      setDownloading(false);
    }
  };

  // ============================================================
  // BANK FILE
  // ============================================================

  const downloadBankFile = async () => {
    try {
      setDownloading(true);
      setErrorMessage("");

      await payrollService.downloadBankFile(
        month
      );

      setActionMessage(
        "Bank NEFT file downloaded."
      );
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Bank export is not available."
      );
    } finally {
      setDownloading(false);
    }
  };

  // ============================================================
  // PAYSLIPS ZIP
  // ============================================================

  const downloadPayslipsZip = async () => {
    try {
      setDownloading(true);
      setErrorMessage("");

      await payrollService.downloadPayslipsZip(
        month
      );

      setActionMessage(
        "Payslips ZIP download started."
      );
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Payslips ZIP export is not available."
      );
    } finally {
      setDownloading(false);
    }
  };

  // ============================================================
  // AI REQUEST
  // ============================================================

  const requestPayrollAI = async ({
    message,
    employeeId = null,
  }) => {
    /*
     * Prefer the service method when available.
     * This keeps the component compatible with the updated
     * payrollService.js.
     */
    if (
      typeof payrollService.askAI ===
      "function"
    ) {
      return payrollService.askAI({
        message,
        month,
        employee_id: employeeId,
        context: "payroll",
      });
    }

    /*
     * Direct fallback while payrollService.js is being updated.
     */
    const response = await fetch(
      `${API_URL}/ai/payroll/chat`,
      {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          message,
          month,
          employee_id: employeeId,
          context: "payroll",
        }),
      }
    );

    if (!response.ok) {
      let detail =
        "Payroll AI request failed.";

      try {
        const errorData =
          await response.json();

        detail =
          errorData?.detail ||
          errorData?.message ||
          detail;
      } catch {
        // Ignore JSON parsing error.
      }

      throw new Error(detail);
    }

    return response.json();
  };

  // ============================================================
  // AUTO AI INSIGHT FOR PAYROLL RECORD
  // ============================================================

  const generatePayrollInsight = async (
    employee
  ) => {
    if (!employee) return;

    setRecordAiLoading(true);
    setRecordAiMessage("");
    setRecordAiSources([]);

    const employeeId =
      employee.employee_id ||
      employee.employeeId ||
      employee.id ||
      null;

    try {
      const result =
        await requestPayrollAI({
          employeeId,
          message: `
You are the payroll intelligence assistant
for AzentMart HR.

Analyze the payroll record for ${month}.

Employee:
${employee.employee || "Unknown"}

Employee ID:
${employeeId || "Not available"}

Email:
${employee.email || "Not available"}

Phone:
${employee.phone || "Not available"}

Role:
${employee.role || "Not available"}

Department:
${employee.department || "Not available"}

Location:
${employee.location || "Not available"}

Date joined:
${employee.date_joined || "Not available"}

Employment type:
${employee.employment_type || "Not available"}

Manager:
${employee.manager || "Not available"}

Gross pay:
₹${Number(
            employee.gross_pay || 0
          ).toLocaleString("en-IN")}

PF:
₹${Number(
            employee.pf || 0
          ).toLocaleString("en-IN")}

TDS:
₹${Number(
            employee.tds || 0
          ).toLocaleString("en-IN")}

Claims:
₹${Number(
            employee.claims || 0
          ).toLocaleString("en-IN")}

Net pay:
₹${Number(
            employee.net_pay || 0
          ).toLocaleString("en-IN")}

Status:
${employee.status || "Unknown"}

Give a concise HR-friendly payroll insight.

Cover:
1. Net salary
2. Main deductions
3. Important payroll observations
4. Whether HR should review anything

Use retrieved payroll policies, attendance,
leave records, tax documents, employee records
and company HR knowledge when available.

Do not invent facts that are not available in
the retrieved sources.

If RAG sources are unavailable, clearly say
that the response is based only on the payroll
record currently supplied.
          `,
        });

      const answer =
        result?.answer ||
        result?.response ||
        result?.message ||
        "No payroll insight was returned.";

      setRecordAiMessage(answer);

      setRecordAiSources(
        Array.isArray(result?.sources)
          ? result.sources
          : []
      );
    } catch (error) {
      console.error(
        "Payroll AI insight failed:",
        error
      );

      setRecordAiMessage(
        "Payroll AI could not analyze this record right now. Please verify that the LLM + RAG backend endpoint is running."
      );
    } finally {
      setRecordAiLoading(false);
    }
  };

  /*
   * Whenever a payroll record is opened:
   * 1. Clear previous insight
   * 2. Automatically send employee payroll context to the LLM
   * 3. Render the grounded answer inside the record
   */
  useEffect(() => {
    if (!selectedEmployee) {
      setRecordAiMessage("");
      setRecordAiSources([]);
      setRecordAiLoading(false);
      return;
    }

    generatePayrollInsight(
      selectedEmployee
    );
  }, [selectedEmployee?.id, month]);

  // ============================================================
  // ASK PAYROLL AI
  // ============================================================

  const askPayrollAI = async (
    questionOverride
  ) => {
    const question =
      questionOverride ||
      aiQuestion.trim();

    if (!question || aiLoading) return;

    setAiQuestion("");

    setAiMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: question,
        sources: [],
      },
    ]);

    setAiLoading(true);

    try {
      const result =
        await requestPayrollAI({
          message: question,
          employeeId:
            selectedEmployee?.employee_id ||
            selectedEmployee?.id ||
            null,
        });

      const answer =
        result?.answer ||
        result?.response ||
        result?.message ||
        "No response received from Payroll AI.";

      setAiMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: answer,
          sources: Array.isArray(
            result?.sources
          )
            ? result.sources
            : [],
        },
      ]);
    } catch (error) {
      console.error(
        "Payroll AI request failed:",
        error
      );

      setAiMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error?.message ||
            "Payroll AI is currently unavailable. Please verify the LLM + RAG backend.",
          sources: [],
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // ============================================================
  // FORMAT
  // ============================================================

  const currency = (value) =>
    `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;

  const monthLabel = useMemo(() => {
    if (!month) return "Payroll";

    const date = new Date(
      `${month}-01T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return month;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );
  }, [month]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="payroll-page">

      {/* HEADER */}

      <header className="payroll-header">
        <div>
          <div className="payroll-eyebrow">
            <span />
            PEOPLE OPERATIONS / PAYROLL
          </div>

          <h1>Payroll</h1>

          <p>
            Process, review and manage employee
            payroll from one controlled workspace.
          </p>
        </div>

        <div className="payroll-header-actions">

          <div className="month-control">
            <CalendarDays size={15} />

            <input
              type="month"
              value={month}
              onChange={(event) =>
                setMonth(
                  event.target.value
                )
              }
            />

            <ChevronDown size={13} />
          </div>

          <button
            className="payroll-button secondary"
            onClick={() => load(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={15}
              className={
                refreshing ? "spin" : ""
              }
            />
            Refresh
          </button>

          <button
            className="payroll-button ai-button"
            onClick={() =>
              setAiOpen(true)
            }
          >
            <Sparkles size={15} />
            Payroll AI
          </button>

        </div>
      </header>

      {/* ALERT */}

      {(actionMessage ||
        errorMessage) && (
        <div
          className={
            errorMessage
              ? "payroll-alert error"
              : "payroll-alert success"
          }
        >
          <span>
            {errorMessage ||
              actionMessage}
          </span>

          <button
            onClick={() => {
              setErrorMessage("");
              setActionMessage("");
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* KPI */}

      <section className="payroll-kpis">

        <KpiCard
          icon={WalletCards}
          label="Gross payroll"
          value={currency(
            totals.gross
          )}
          trend="+6.4%"
          trendType="up"
        />

        <KpiCard
          icon={IndianRupee}
          label="Net payable"
          value={currency(
            totals.net
          )}
          trend="+4.8%"
          trendType="up"
        />

        <KpiCard
          icon={TrendingDown}
          label="TDS deducted"
          value={currency(
            totals.tax
          )}
          trend="This month"
          trendType="neutral"
        />

        <KpiCard
          icon={Users}
          label="Payroll employees"
          value={items.length}
          trend="Active records"
          trendType="neutral"
        />

      </section>

      {/* PAYROLL PROCESS */}

      <section className="payroll-process">

        <div className="section-heading">
          <div>
            <span>PAYROLL PROCESS</span>

            <h2>
              Run payroll with control at every
              step.
            </h2>
          </div>

          <div className="process-status">
            <i />
            Processing period: {month}
          </div>
        </div>

        <div className="process-track">

          {payrollSteps.map(
            (step, index) => {
              const Icon = step.icon;

              const active =
                index === 1;

              const completed =
                index === 0;

              return (
                <React.Fragment
                  key={step.id}
                >
                  <div
                    className={`process-step ${
                      active
                        ? "active"
                        : ""
                    } ${
                      completed
                        ? "completed"
                        : ""
                    }`}
                  >
                    <div className="process-number">
                      {completed ? (
                        <Check size={14} />
                      ) : (
                        <Icon size={15} />
                      )}
                    </div>

                    <div>
                      <strong>
                        {step.number}{" "}
                        {step.title}
                      </strong>

                      <span>
                        {step.description}
                      </span>
                    </div>
                  </div>

                  {index <
                    payrollSteps.length -
                      1 && (
                    <div className="process-line" />
                  )}
                </React.Fragment>
              );
            }
          )}

        </div>
      </section>

      {/* MAIN WORKSPACE */}

      <section className="payroll-workspace">

        <div className="workspace-header">

          <div>
            <span>
              PAYROLL WORKSPACE
            </span>

            <h2>
              {monthLabel} payroll
            </h2>
          </div>

          <div className="workspace-actions">

            <button
              className="payroll-button secondary"
              onClick={downloadBankFile}
              disabled={downloading}
            >
              <Download size={14} />
              Bank NEFT
            </button>

            <button
              className="payroll-button secondary"
              onClick={downloadPayslipsZip}
              disabled={downloading}
            >
              <Download size={14} />
              Payslips ZIP
            </button>

            <button
              className="payroll-button primary"
              onClick={generatePayroll}
              disabled={processing}
            >
              <Zap size={14} />

              {processing
                ? "Processing..."
                : "Run payroll"}
            </button>

          </div>
        </div>

        {/* TABS */}

        <div className="payroll-tabs">

          <button
            className={
              tab === "admin"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("admin")
            }
          >
            <ShieldCheck size={15} />
            HR Console
          </button>

          <button
            className={
              tab === "self"
                ? "active"
                : ""
            }
            onClick={() =>
              setTab("self")
            }
          >
            <UserRound size={15} />
            My Payroll
          </button>

        </div>

        {tab === "self" ? (
          <SelfPayroll
            items={items}
            onDownload={downloadPayslip}
            downloading={downloading}
            currency={currency}
          />
        ) : (
          <>
            {/* CONTROL BAR */}

            <div className="payroll-control">

              <div className="search-box">
                <Search size={15} />

                <input
                  placeholder="Search employee, ID or email..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <select
                value={department}
                onChange={(event) =>
                  setDepartment(
                    event.target.value
                  )
                }
              >
                {departments.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item === "All"
                        ? "All departments"
                        : item}
                    </option>
                  )
                )}
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All status
                </option>

                <option value="Draft">
                  Draft
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Processed">
                  Processed
                </option>

                <option value="Locked">
                  Locked
                </option>
              </select>

              <div className="control-spacer" />

              <button
                className="approve-button"
                onClick={approvePayroll}
                disabled={processing}
              >
                <Lock size={14} />
                Approve & lock
              </button>

            </div>

            {/* TABLE */}

            <div className="payroll-table-wrapper">

              {busy ? (
                <div className="payroll-loading">
                  <div className="loading-spinner" />
                  Loading payroll...
                </div>
              ) : (
                <table className="payroll-table">

                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Gross</th>
                      <th>PF</th>
                      <th>TDS</th>
                      <th>Claims</th>
                      <th>Net pay</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>

                    {filteredItems.map(
                      (item) => {
                        const status =
                          item.status ||
                          "Draft";

                        return (
                          <tr
                            key={
                              item.id ||
                              item.employee_id
                            }
                          >

                            <td>
                              <button
                                className="employee-cell"
                                onClick={() =>
                                  setSelectedEmployee(
                                    item
                                  )
                                }
                              >
                                <div className="employee-avatar">
                                  {getInitials(
                                    item.employee
                                  )}
                                </div>

                                <div>
                                  <strong>
                                    {
                                      item.employee
                                    }
                                  </strong>

                                  <span>
                                    {
                                      item.employee_id ||
                                      "EMP"
                                    }
                                  </span>

                                  {item.email && (
                                    <small>
                                      {item.email}
                                    </small>
                                  )}
                                </div>
                              </button>
                            </td>

                            <td>
                              {item.role ||
                                "—"}
                            </td>

                            <td>
                              <span className="department-text">
                                {item.department ||
                                  "—"}
                              </span>
                            </td>

                            <td>
                              {currency(
                                item.gross_pay
                              )}
                            </td>

                            <td>
                              {currency(
                                item.pf
                              )}
                            </td>

                            <td>
                              {currency(
                                item.tds
                              )}
                            </td>

                            <td>
                              {currency(
                                item.claims
                              )}
                            </td>

                            <td>
                              <strong className="net-value">
                                {currency(
                                  item.net_pay
                                )}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={`payroll-status ${String(
                                  status
                                )
                                  .toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )}`}
                              >
                                <i />
                                {status}
                              </span>
                            </td>

                            <td>
                              <button
                                className="table-more"
                                onClick={() =>
                                  setSelectedEmployee(
                                    item
                                  )
                                }
                                title="View payroll record"
                              >
                                <MoreHorizontal
                                  size={16}
                                />
                              </button>
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>
                </table>
              )}

              {!busy &&
                !filteredItems.length && (
                  <div className="empty-payroll">
                    <Users size={30} />

                    <strong>
                      No payroll records found
                    </strong>

                    <span>
                      Try changing your search
                      or filters.
                    </span>
                  </div>
                )}

            </div>
          </>
        )}

      </section>

      {/* AI + RAG PROMOTION */}

      <section className="payroll-ai-section">

        <div className="payroll-ai-content">

          <div className="ai-section-icon">
            <BrainCircuit size={23} />
          </div>

          <div>
            <span>
              AI + RAG FOR PAYROLL
            </span>

            <h2>
              Payroll answers grounded in your
              organization's data.
            </h2>

            <p>
              Ask questions across payroll records,
              attendance, leave, company policies,
              tax documents and HR knowledge before
              generating an answer.
            </p>
          </div>

          <button
            className="payroll-button ai-button"
            onClick={() =>
              setAiOpen(true)
            }
          >
            <Sparkles size={15} />
            Ask Payroll AI
          </button>

        </div>

        <div className="rag-source-row">

          <div>
            <FileText size={14} />
            Payroll Policies
          </div>

          <div>
            <CalendarDays size={14} />
            Attendance
          </div>

          <div>
            <WalletCards size={14} />
            Payroll Records
          </div>

          <div>
            <ShieldCheck size={14} />
            HR Knowledge Base
          </div>

        </div>

      </section>

      {/* ========================================================
          REDESIGNED PAYROLL RECORD DRAWER
      ======================================================== */}

      {selectedEmployee && (
        <div
          className="record-overlay"
          onClick={() =>
            setSelectedEmployee(null)
          }
        >
          <aside
            className="payroll-record-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="record-header">

              <div>
                <span className="record-label">
                  PAYROLL RECORD
                </span>

                <h2>
                  {monthLabel}
                </h2>

                <p>
                  Complete employee payroll
                  information
                </p>
              </div>

              <button
                className="record-close"
                onClick={() =>
                  setSelectedEmployee(null)
                }
                aria-label="Close payroll record"
              >
                <X size={20} />
              </button>

            </div>

            {/* EMPLOYEE PROFILE */}

            <section className="record-employee">

              <div className="record-avatar">
                {getInitials(
                  selectedEmployee.employee
                )}
              </div>

              <div className="record-employee-main">

                <div className="record-name-row">

                  <div>
                    <h3>
                      {
                        selectedEmployee.employee
                      }
                    </h3>

                    <span>
                      {selectedEmployee.employee_id ||
                        "Employee ID unavailable"}
                    </span>
                  </div>

                  <span className="record-status">
                    <i />
                    {selectedEmployee.status ||
                      "Draft"}
                  </span>

                </div>

                <div className="record-meta">

                  {selectedEmployee.role && (
                    <span>
                      {selectedEmployee.role}
                    </span>
                  )}

                  {selectedEmployee.department && (
                    <span>
                      {
                        selectedEmployee.department
                      }
                    </span>
                  )}

                  {selectedEmployee.location && (
                    <span>
                      {
                        selectedEmployee.location
                      }
                    </span>
                  )}

                </div>

              </div>

            </section>

            {/* EMPLOYEE INFORMATION */}

            <section className="record-section">

              <div className="record-section-title">
                <UserRound size={16} />

                <div>
                  <strong>
                    Employee information
                  </strong>

                  <span>
                    Personal and employment details
                  </span>
                </div>
              </div>

              <div className="record-info-grid">

                <RecordInfo
                  label="Email"
                  value={
                    selectedEmployee.email
                  }
                />

                <RecordInfo
                  label="Phone"
                  value={
                    selectedEmployee.phone
                  }
                />

                <RecordInfo
                  label="Role"
                  value={
                    selectedEmployee.role
                  }
                />

                <RecordInfo
                  label="Department"
                  value={
                    selectedEmployee.department
                  }
                />

                <RecordInfo
                  label="Location"
                  value={
                    selectedEmployee.location
                  }
                />

                <RecordInfo
                  label="Date joined"
                  value={
                    selectedEmployee.date_joined
                  }
                />

                <RecordInfo
                  label="Employment"
                  value={
                    selectedEmployee.employment_type
                  }
                />

                <RecordInfo
                  label="Manager"
                  value={
                    selectedEmployee.manager
                  }
                />

              </div>

            </section>

            {/* PAYROLL BREAKDOWN */}

            <section className="record-section">

              <div className="record-section-title">
                <WalletCards size={16} />

                <div>
                  <strong>
                    Payroll breakdown
                  </strong>

                  <span>
                    {monthLabel} salary
                    calculation
                  </span>
                </div>
              </div>

              <div className="salary-grid">

                <SalaryCard
                  label="Gross pay"
                  value={currency(
                    selectedEmployee.gross_pay
                  )}
                />

                <SalaryCard
                  label="Net pay"
                  value={currency(
                    selectedEmployee.net_pay
                  )}
                  highlight
                />

                <SalaryCard
                  label="PF"
                  value={currency(
                    selectedEmployee.pf
                  )}
                />

                <SalaryCard
                  label="TDS"
                  value={currency(
                    selectedEmployee.tds
                  )}
                />

                <SalaryCard
                  label="Claims"
                  value={currency(
                    selectedEmployee.claims
                  )}
                />

                <SalaryCard
                  label="Status"
                  value={
                    selectedEmployee.status ||
                    "Draft"
                  }
                />

              </div>

            </section>

            {/* AUTOMATIC AI INSIGHT */}

            <section className="record-ai">

              <div className="record-ai-header">

                <div className="record-ai-icon">
                  <Sparkles size={18} />
                </div>

                <div>
                  <strong>
                    Payroll Intelligence
                  </strong>

                  <span>
                    AI + RAG analysis
                  </span>
                </div>

              </div>

              {recordAiLoading ? (
                <div className="record-ai-loading">

                  <div className="ai-loading-dots">
                    <i />
                    <i />
                    <i />
                  </div>

                  Analyzing payroll,
                  attendance and HR policies...

                </div>
              ) : (
                <div className="record-ai-message">
                  {recordAiMessage ||
                    "Open payroll record to generate an AI insight."}
                </div>
              )}

              {recordAiSources.length >
                0 && (
                <div className="record-ai-sources">

                  <span>
                    Sources used
                  </span>

                  {recordAiSources.map(
                    (
                      source,
                      index
                    ) => (
                      <div
                        key={index}
                      >
                        <FileText
                          size={13}
                        />

                        <span>
                          {source.title ||
                            source.name ||
                            "Source"}
                        </span>

                        <small>
                          {source.type ||
                            "RAG"}
                        </small>
                      </div>
                    )
                  )}

                </div>
              )}

            </section>

            {/* ACTIONS */}

            <div className="record-actions">

              <button
                className="record-download"
                onClick={() =>
                  downloadPayslip(
                    selectedEmployee.id
                  )
                }
                disabled={
                  downloading
                }
              >
                <Download size={16} />

                {downloading
                  ? "Generating..."
                  : "Download payslip"}
              </button>

              <button
                className="record-ai-button"
                onClick={() => {
                  setAiOpen(true);

                  setAiQuestion(
                    `Explain the ${monthLabel} payroll for ${selectedEmployee.employee} and identify important deductions, attendance impact or unusual changes.`
                  );
                }}
              >
                <Sparkles size={16} />
                Ask Payroll AI
              </button>

            </div>

          </aside>
        </div>
      )}

      {/* ========================================================
          AI DRAWER
      ======================================================== */}

      {aiOpen && (
        <div
          className="ai-overlay"
          onClick={() =>
            setAiOpen(false)
          }
        >
          <aside
            className="ai-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="ai-drawer-header">

              <div className="ai-title">

                <div className="ai-title-icon">
                  <Sparkles size={17} />
                </div>

                <div>
                  <strong>
                    Payroll Intelligence
                  </strong>

                  <span>
                    AI + RAG Assistant
                  </span>
                </div>

              </div>

              <button
                onClick={() =>
                  setAiOpen(false)
                }
                aria-label="Close AI"
              >
                <X size={18} />
              </button>

            </div>

            {/* AI CONTEXT */}

            <div className="ai-context">

              <span>CONTEXT</span>

              <div>
                <b>Payroll</b>
                <small>{monthLabel}</small>
              </div>

              {selectedEmployee && (
                <div>
                  <b>Employee</b>

                  <small>
                    {
                      selectedEmployee.employee
                    }
                  </small>
                </div>
              )}

            </div>

            {/* CHAT */}

            <div className="ai-messages">

              {aiMessages.map(
                (message, index) => (
                  <div
                    key={index}
                    className={`ai-message ${message.role}`}
                  >

                    {message.role ===
                      "assistant" && (
                      <div className="ai-message-avatar">
                        <Bot size={13} />
                      </div>
                    )}

                    <div>

                      <div className="ai-message-content">
                        {message.content}
                      </div>

                      {message.sources
                        ?.length > 0 && (
                        <div className="ai-sources">

                          <span>
                            Sources used
                          </span>

                          {message.sources.map(
                            (
                              source,
                              sourceIndex
                            ) => (
                              <div
                                key={
                                  sourceIndex
                                }
                              >
                                <FileText
                                  size={11}
                                />

                                <span>
                                  {source.title ||
                                    source.name ||
                                    "Source"}
                                </span>

                                <small>
                                  {source.type ||
                                    "RAG"}
                                </small>
                              </div>
                            )
                          )}

                        </div>
                      )}

                    </div>

                  </div>
                )
              )}

              {aiLoading && (
                <div className="ai-thinking">

                  <div className="thinking-dots">
                    <i />
                    <i />
                    <i />
                  </div>

                  Searching payroll
                  knowledge and employee
                  records...

                </div>
              )}

            </div>

            {/* SUGGESTIONS */}

            <div className="ai-suggestions">

              {aiSuggestions.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() =>
                      askPayrollAI(
                        suggestion
                      )
                    }
                    disabled={aiLoading}
                  >
                    {suggestion}
                  </button>
                )
              )}

            </div>

            {/* INPUT */}

            <div className="ai-input-wrapper">

              <textarea
                value={aiQuestion}
                onChange={(event) =>
                  setAiQuestion(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    askPayrollAI();
                  }
                }}
                placeholder="Ask about payroll, deductions, policies..."
              />

              <button
                onClick={() =>
                  askPayrollAI()
                }
                disabled={
                  !aiQuestion.trim() ||
                  aiLoading
                }
              >
                <Send size={15} />
              </button>

            </div>

            <div className="ai-disclaimer">
              <ShieldCheck size={12} />

              AI responses will be grounded
              in authorized HR, payroll and
              RAG sources.
            </div>

          </aside>
        </div>
      )}

    </div>
  );
}

// ============================================================
// KPI CARD
// ============================================================

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  trendType,
}) {
  return (
    <div className="payroll-kpi">

      <div className="kpi-top">

        <div className="kpi-icon">
          <Icon size={18} />
        </div>

        <MoreHorizontal
          size={16}
          className="kpi-more"
        />

      </div>

      <span>{label}</span>

      <strong>{value}</strong>

      <small
        className={
          trendType === "up"
            ? "positive"
            : ""
        }
      >
        {trendType === "up" && (
          <TrendingUp size={11} />
        )}

        {trend}
      </small>

    </div>
  );
}

// ============================================================
// SELF PAYROLL
// ============================================================

function SelfPayroll({
  items,
  onDownload,
  downloading,
  currency,
}) {
  const payroll = items[0];

  if (!payroll) {
    return (
      <div className="empty-payroll large">

        <WalletCards size={32} />

        <strong>
          No payroll available
        </strong>

        <span>
          Your latest payroll record
          will appear here.
        </span>

      </div>
    );
  }

  return (
    <div className="self-payroll">

      <div className="self-pay-main">

        <div className="self-eyebrow">
          THIS MONTH TAKE-HOME PAY
        </div>

        <strong>
          {currency(
            payroll.net_pay
          )}
        </strong>

        <p>
          Latest payroll record for{" "}
          {payroll.employee || "you"}.
        </p>

        <button
          className="self-download"
          onClick={() =>
            onDownload(payroll.id)
          }
          disabled={downloading}
        >
          <Download size={15} />

          {downloading
            ? "Generating..."
            : "Download payslip"}
        </button>

      </div>

      <div className="self-breakdown">

        <div className="self-breakdown-header">

          <span>
            PAYROLL BREAKDOWN
          </span>

          <WalletCards size={18} />

        </div>

        <Breakdown
          label="Gross pay"
          value={currency(
            payroll.gross_pay
          )}
        />

        <Breakdown
          label="PF"
          value={currency(
            payroll.pf
          )}
        />

        <Breakdown
          label="TDS"
          value={currency(
            payroll.tds
          )}
        />

        <Breakdown
          label="Claims"
          value={currency(
            payroll.claims
          )}
        />

        <div className="breakdown-total">

          <span>Net pay</span>

          <strong>
            {currency(
              payroll.net_pay
            )}
          </strong>

        </div>

      </div>

    </div>
  );
}

// ============================================================
// BREAKDOWN
// ============================================================

function Breakdown({
  label,
  value,
}) {
  return (
    <div className="breakdown-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// ============================================================
// RECORD INFO
// ============================================================

function RecordInfo({
  label,
  value,
}) {
  return (
    <div className="record-info">

      <span>{label}</span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}

// ============================================================
// SALARY CARD
// ============================================================

function SalaryCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={`salary-card ${
        highlight ? "highlight" : ""
      }`}
    >
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

// ============================================================
// INITIALS
// ============================================================

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase()
    )
    .join("");
}
