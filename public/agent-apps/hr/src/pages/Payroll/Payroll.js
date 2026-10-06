const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Payroll/Payroll.jsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useState } from "react";
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

import { payrollService } from "../../services/payrollService.js";
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

const API_URL = _optionalChain([window, 'access', _ => _.AZENTMART_AGENT_CONFIG, 'optionalAccess', _2 => _2.hrApi]) || "/hr-api";

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
      if (Array.isArray(_optionalChain([result, 'optionalAccess', _3 => _3[key]]))) {
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
        _nullishCoalesce(_nullishCoalesce(employee.id, () => (
        employee.employee_id)), () => (
        employee.employeeId)),

      employee_id:
        _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(employee.employee_id, () => (
        employee.employeeId)), () => (
        employee.emp_id)), () => (
        employee.id)),

      employee:
        _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(employee.employee, () => (
        employee.employee_name)), () => (
        employee.full_name)), () => (
        employee.name)), () => (
        employee.display_name)), () => (
        "Employee")),

      email:
        _nullishCoalesce(_nullishCoalesce(employee.email, () => (
        employee.email_id)), () => (
        "")),

      phone:
        _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(employee.phone, () => (
        employee.phone_number)), () => (
        employee.mobile)), () => (
        "")),

      role:
        _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(employee.role, () => (
        employee.designation)), () => (
        employee.job_title)), () => (
        "")),

      department:
        _nullishCoalesce(_nullishCoalesce(employee.department, () => (
        employee.department_name)), () => (
        "")),

      location:
        _nullishCoalesce(_nullishCoalesce(employee.location, () => (
        employee.work_location)), () => (
        "")),

      date_joined:
        _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(employee.date_joined, () => (
        employee.joining_date)), () => (
        employee.doj)), () => (
        "")),

      employment_type:
        _nullishCoalesce(_nullishCoalesce(employee.employment_type, () => (
        employee.employment_status)), () => (
        "Full-time")),

      manager:
        _nullishCoalesce(_nullishCoalesce(employee.manager, () => (
        employee.manager_name)), () => (
        "")),

      status:
        _nullishCoalesce(employee.status, () => (
        "Active")),
    };
  };

  const mergePayrollWithEmployee = (
    payroll,
    employeeList
  ) => {
    const payrollEmployeeId =
      _nullishCoalesce(_nullishCoalesce(payroll.employee_id, () => (
      payroll.employeeId)), () => (
      payroll.emp_id));

    const payrollEmail =
      _nullishCoalesce(payroll.email, () => (
      payroll.employee_email));

    const payrollEmployee =
      _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(payroll.employee, () => (
      payroll.employee_name)), () => (
      payroll.full_name)), () => (
      payroll.name));

    const employee =
      employeeList.find((emp) => {
        const id =
          _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(emp.employee_id, () => (
          emp.employeeId)), () => (
          emp.emp_id)), () => (
          emp.id));

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
        _nullishCoalesce(_nullishCoalesce(payroll.id, () => (
        payroll.payroll_id)), () => (
        payroll.payrollId)),

      employee:
        payrollEmployee ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _4 => _4.employee]) ||
        "Employee",

      employee_id:
        payrollEmployeeId ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _5 => _5.employee_id]) ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _6 => _6.id]),

      email:
        payroll.email ||
        payroll.employee_email ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _7 => _7.email]) ||
        "",

      phone:
        payroll.phone ||
        payroll.phone_number ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _8 => _8.phone]) ||
        "",

      role:
        payroll.role ||
        payroll.designation ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _9 => _9.role]) ||
        "",

      department:
        payroll.department ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _10 => _10.department]) ||
        "",

      location:
        payroll.location ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _11 => _11.location]) ||
        "",

      date_joined:
        payroll.date_joined ||
        payroll.joining_date ||
        payroll.doj ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _12 => _12.date_joined]) ||
        "",

      employment_type:
        payroll.employment_type ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _13 => _13.employment_type]) ||
        "Full-time",

      manager:
        payroll.manager ||
        _optionalChain([normalizedEmployee, 'optionalAccess', _14 => _14.manager]) ||
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
        _optionalChain([error, 'optionalAccess', _15 => _15.message]) ||
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
        _optionalChain([result, 'optionalAccess', _16 => _16.message]) ||
          `${_optionalChain([result, 'optionalAccess', _17 => _17.created]) || 0} payroll record(s) generated.`
      );

      await load();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        _optionalChain([error, 'optionalAccess', _18 => _18.message]) ||
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
        _optionalChain([error, 'optionalAccess', _19 => _19.message]) ||
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
        _optionalChain([error, 'optionalAccess', _20 => _20.message]) ||
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
        _optionalChain([error, 'optionalAccess', _21 => _21.message]) ||
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
        _optionalChain([error, 'optionalAccess', _22 => _22.message]) ||
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
          _optionalChain([errorData, 'optionalAccess', _23 => _23.detail]) ||
          _optionalChain([errorData, 'optionalAccess', _24 => _24.message]) ||
          detail;
      } catch (e) {
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
        _optionalChain([result, 'optionalAccess', _25 => _25.answer]) ||
        _optionalChain([result, 'optionalAccess', _26 => _26.response]) ||
        _optionalChain([result, 'optionalAccess', _27 => _27.message]) ||
        "No payroll insight was returned.";

      setRecordAiMessage(answer);

      setRecordAiSources(
        Array.isArray(_optionalChain([result, 'optionalAccess', _28 => _28.sources]))
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
  }, [_optionalChain([selectedEmployee, 'optionalAccess', _29 => _29.id]), month]);

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
            _optionalChain([selectedEmployee, 'optionalAccess', _30 => _30.employee_id]) ||
            _optionalChain([selectedEmployee, 'optionalAccess', _31 => _31.id]) ||
            null,
        });

      const answer =
        _optionalChain([result, 'optionalAccess', _32 => _32.answer]) ||
        _optionalChain([result, 'optionalAccess', _33 => _33.response]) ||
        _optionalChain([result, 'optionalAccess', _34 => _34.message]) ||
        "No response received from Payroll AI.";

      setAiMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: answer,
          sources: Array.isArray(
            _optionalChain([result, 'optionalAccess', _35 => _35.sources])
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
            _optionalChain([error, 'optionalAccess', _36 => _36.message]) ||
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
    React.createElement('div', { className: "payroll-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1133}}

      /* HEADER */

      , React.createElement('header', { className: "payroll-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1137}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1138}}
          , React.createElement('div', { className: "payroll-eyebrow", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1139}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1140}} ), "PEOPLE OPERATIONS / PAYROLL"

          )

          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1144}}, "Payroll")

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1146}}, "Process, review and manage employee payroll from one controlled workspace."


          )
        )

        , React.createElement('div', { className: "payroll-header-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1152}}

          , React.createElement('div', { className: "month-control", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1154}}
            , React.createElement(CalendarDays, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1155}} )

            , React.createElement('input', {
              type: "month",
              value: month,
              onChange: (event) =>
                setMonth(
                  event.target.value
                )
              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1157}}
            )

            , React.createElement(ChevronDown, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1167}} )
          )

          , React.createElement('button', {
            className: "payroll-button secondary" ,
            onClick: () => load(true),
            disabled: refreshing, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1170}}

            , React.createElement(RefreshCw, {
              size: 15,
              className: 
                refreshing ? "spin" : ""
              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1175}}
            ), "Refresh"

          )

          , React.createElement('button', {
            className: "payroll-button ai-button" ,
            onClick: () =>
              setAiOpen(true)
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1184}}

            , React.createElement(Sparkles, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1190}} ), "Payroll AI"

          )

        )
      )

      /* ALERT */

      , (actionMessage ||
        errorMessage) && (
        React.createElement('div', {
          className: 
            errorMessage
              ? "payroll-alert error"
              : "payroll-alert success"
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1201}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1208}}
            , errorMessage ||
              actionMessage
          )

          , React.createElement('button', {
            onClick: () => {
              setErrorMessage("");
              setActionMessage("");
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1213}}

            , React.createElement(X, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1219}} )
          )
        )
      )

      /* KPI */

      , React.createElement('section', { className: "payroll-kpis", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1226}}

        , React.createElement(KpiCard, {
          icon: WalletCards,
          label: "Gross payroll" ,
          value: currency(
            totals.gross
          ),
          trend: "+6.4%",
          trendType: "up", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1228}}
        )

        , React.createElement(KpiCard, {
          icon: IndianRupee,
          label: "Net payable" ,
          value: currency(
            totals.net
          ),
          trend: "+4.8%",
          trendType: "up", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1238}}
        )

        , React.createElement(KpiCard, {
          icon: TrendingDown,
          label: "TDS deducted" ,
          value: currency(
            totals.tax
          ),
          trend: "This month" ,
          trendType: "neutral", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1248}}
        )

        , React.createElement(KpiCard, {
          icon: Users,
          label: "Payroll employees" ,
          value: items.length,
          trend: "Active records" ,
          trendType: "neutral", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1258}}
        )

      )

      /* PAYROLL PROCESS */

      , React.createElement('section', { className: "payroll-process", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1270}}

        , React.createElement('div', { className: "section-heading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1272}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1273}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1274}}, "PAYROLL PROCESS" )

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1276}}, "Run payroll with control at every step."


            )
          )

          , React.createElement('div', { className: "process-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1282}}
            , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1283}} ), "Processing period: "
              , month
          )
        )

        , React.createElement('div', { className: "process-track", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1288}}

          , payrollSteps.map(
            (step, index) => {
              const Icon = step.icon;

              const active =
                index === 1;

              const completed =
                index === 0;

              return (
                React.createElement(React.Fragment, {
                  key: step.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1301}}

                  , React.createElement('div', {
                    className: `process-step ${
                      active
                        ? "active"
                        : ""
                    } ${
                      completed
                        ? "completed"
                        : ""
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1304}}

                    , React.createElement('div', { className: "process-number", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1315}}
                      , completed ? (
                        React.createElement(Check, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1317}} )
                      ) : (
                        React.createElement(Icon, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1319}} )
                      )
                    )

                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1323}}
                      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1324}}
                        , step.number, " "
                        , step.title
                      )

                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1329}}
                        , step.description
                      )
                    )
                  )

                  , index <
                    payrollSteps.length -
                      1 && (
                    React.createElement('div', { className: "process-line", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1338}} )
                  )
                )
              );
            }
          )

        )
      )

      /* MAIN WORKSPACE */

      , React.createElement('section', { className: "payroll-workspace", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1350}}

        , React.createElement('div', { className: "workspace-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1352}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1354}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1355}}, "PAYROLL WORKSPACE"

            )

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1359}}
              , monthLabel, " payroll"
            )
          )

          , React.createElement('div', { className: "workspace-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1364}}

            , React.createElement('button', {
              className: "payroll-button secondary" ,
              onClick: downloadBankFile,
              disabled: downloading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1366}}

              , React.createElement(Download, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1371}} ), "Bank NEFT"

            )

            , React.createElement('button', {
              className: "payroll-button secondary" ,
              onClick: downloadPayslipsZip,
              disabled: downloading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1375}}

              , React.createElement(Download, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1380}} ), "Payslips ZIP"

            )

            , React.createElement('button', {
              className: "payroll-button primary" ,
              onClick: generatePayroll,
              disabled: processing, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1384}}

              , React.createElement(Zap, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1389}} )

              , processing
                ? "Processing..."
                : "Run payroll"
            )

          )
        )

        /* TABS */

        , React.createElement('div', { className: "payroll-tabs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1401}}

          , React.createElement('button', {
            className: 
              tab === "admin"
                ? "active"
                : ""
            ,
            onClick: () =>
              setTab("admin")
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1403}}

            , React.createElement(ShieldCheck, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1413}} ), "HR Console"

          )

          , React.createElement('button', {
            className: 
              tab === "self"
                ? "active"
                : ""
            ,
            onClick: () =>
              setTab("self")
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1417}}

            , React.createElement(UserRound, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1427}} ), "My Payroll"

          )

        )

        , tab === "self" ? (
          React.createElement(SelfPayroll, {
            items: items,
            onDownload: downloadPayslip,
            downloading: downloading,
            currency: currency, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1434}}
          )
        ) : (
          React.createElement(React.Fragment, null
            /* CONTROL BAR */

            , React.createElement('div', { className: "payroll-control", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1444}}

              , React.createElement('div', { className: "search-box", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1446}}
                , React.createElement(Search, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1447}} )

                , React.createElement('input', {
                  placeholder: "Search employee, ID or email..."    ,
                  value: search,
                  onChange: (event) =>
                    setSearch(
                      event.target.value
                    )
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1449}}
                )
              )

              , React.createElement('select', {
                value: department,
                onChange: (event) =>
                  setDepartment(
                    event.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1460}}

                , departments.map(
                  (item) => (
                    React.createElement('option', {
                      key: item,
                      value: item, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1470}}

                      , item === "All"
                        ? "All departments"
                        : item
                    )
                  )
                )
              )

              , React.createElement('select', {
                value: statusFilter,
                onChange: (event) =>
                  setStatusFilter(
                    event.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1482}}

                , React.createElement('option', { value: "All", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1490}}, "All status"

                )

                , React.createElement('option', { value: "Draft", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1494}}, "Draft"

                )

                , React.createElement('option', { value: "Approved", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1498}}, "Approved"

                )

                , React.createElement('option', { value: "Processed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1502}}, "Processed"

                )

                , React.createElement('option', { value: "Locked", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1506}}, "Locked"

                )
              )

              , React.createElement('div', { className: "control-spacer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1511}} )

              , React.createElement('button', {
                className: "approve-button",
                onClick: approvePayroll,
                disabled: processing, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1513}}

                , React.createElement(Lock, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1518}} ), "Approve & lock"

              )

            )

            /* TABLE */

            , React.createElement('div', { className: "payroll-table-wrapper", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1526}}

              , busy ? (
                React.createElement('div', { className: "payroll-loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1529}}
                  , React.createElement('div', { className: "loading-spinner", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1530}} ), "Loading payroll..."

                )
              ) : (
                React.createElement('table', { className: "payroll-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1534}}

                  , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1536}}
                    , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1537}}
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1538}}, "Employee")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1539}}, "Role")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1540}}, "Department")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1541}}, "Gross")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1542}}, "PF")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1543}}, "TDS")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1544}}, "Claims")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1545}}, "Net pay" )
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1546}}, "Status")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1547}} )
                    )
                  )

                  , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1551}}

                    , filteredItems.map(
                      (item) => {
                        const status =
                          item.status ||
                          "Draft";

                        return (
                          React.createElement('tr', {
                            key: 
                              item.id ||
                              item.employee_id
                            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1560}}


                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1567}}
                              , React.createElement('button', {
                                className: "employee-cell",
                                onClick: () =>
                                  setSelectedEmployee(
                                    item
                                  )
                                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1568}}

                                , React.createElement('div', { className: "employee-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1576}}
                                  , getInitials(
                                    item.employee
                                  )
                                )

                                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1582}}
                                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1583}}
                                    , 
                                      item.employee
                                    
                                  )

                                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1589}}
                                    , 
                                      item.employee_id ||
                                      "EMP"
                                    
                                  )

                                  , item.email && (
                                    React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1597}}
                                      , item.email
                                    )
                                  )
                                )
                              )
                            )

                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1605}}
                              , item.role ||
                                "—"
                            )

                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1610}}
                              , React.createElement('span', { className: "department-text", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1611}}
                                , item.department ||
                                  "—"
                              )
                            )

                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1617}}
                              , currency(
                                item.gross_pay
                              )
                            )

                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1623}}
                              , currency(
                                item.pf
                              )
                            )

                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1629}}
                              , currency(
                                item.tds
                              )
                            )

                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1635}}
                              , currency(
                                item.claims
                              )
                            )

                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1641}}
                              , React.createElement('strong', { className: "net-value", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1642}}
                                , currency(
                                  item.net_pay
                                )
                              )
                            )

                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1649}}
                              , React.createElement('span', {
                                className: `payroll-status ${String(
                                  status
                                )
                                  .toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1650}}

                                , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1660}} )
                                , status
                              )
                            )

                            , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1665}}
                              , React.createElement('button', {
                                className: "table-more",
                                onClick: () =>
                                  setSelectedEmployee(
                                    item
                                  )
                                ,
                                title: "View payroll record"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1666}}

                                , React.createElement(MoreHorizontal, {
                                  size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1675}}
                                )
                              )
                            )

                          )
                        );
                      }
                    )

                  )
                )
              )

              , !busy &&
                !filteredItems.length && (
                  React.createElement('div', { className: "empty-payroll", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1692}}
                    , React.createElement(Users, { size: 30, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1693}} )

                    , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1695}}, "No payroll records found"

                    )

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1699}}, "Try changing your search or filters."


                    )
                  )
                )

            )
          )
        )

      )

      /* AI + RAG PROMOTION */

      , React.createElement('section', { className: "payroll-ai-section", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1714}}

        , React.createElement('div', { className: "payroll-ai-content", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1716}}

          , React.createElement('div', { className: "ai-section-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1718}}
            , React.createElement(BrainCircuit, { size: 23, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1719}} )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1722}}
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1723}}, "AI + RAG FOR PAYROLL"

            )

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1727}}, "Payroll answers grounded in your organization's data."


            )

            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1732}}, "Ask questions across payroll records, attendance, leave, company policies, tax documents and HR knowledge before generating an answer."




            )
          )

          , React.createElement('button', {
            className: "payroll-button ai-button" ,
            onClick: () =>
              setAiOpen(true)
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1740}}

            , React.createElement(Sparkles, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1746}} ), "Ask Payroll AI"

          )

        )

        , React.createElement('div', { className: "rag-source-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1752}}

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1754}}
            , React.createElement(FileText, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1755}} ), "Payroll Policies"

          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1759}}
            , React.createElement(CalendarDays, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1760}} ), "Attendance"

          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1764}}
            , React.createElement(WalletCards, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1765}} ), "Payroll Records"

          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1769}}
            , React.createElement(ShieldCheck, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1770}} ), "HR Knowledge Base"

          )

        )

      )

      /* ========================================================
          REDESIGNED PAYROLL RECORD DRAWER
      ======================================================== */

      , selectedEmployee && (
        React.createElement('div', {
          className: "record-overlay",
          onClick: () =>
            setSelectedEmployee(null)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1783}}

          , React.createElement('aside', {
            className: "payroll-record-panel",
            onClick: (event) =>
              event.stopPropagation()
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1789}}


            , React.createElement('div', { className: "record-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1796}}

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1798}}
                , React.createElement('span', { className: "record-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1799}}, "PAYROLL RECORD"

                )

                , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1803}}
                  , monthLabel
                )

                , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1807}}, "Complete employee payroll information"


                )
              )

              , React.createElement('button', {
                className: "record-close",
                onClick: () =>
                  setSelectedEmployee(null)
                ,
                'aria-label': "Close payroll record"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1813}}

                , React.createElement(X, { size: 20, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1820}} )
              )

            )

            /* EMPLOYEE PROFILE */

            , React.createElement('section', { className: "record-employee", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1827}}

              , React.createElement('div', { className: "record-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1829}}
                , getInitials(
                  selectedEmployee.employee
                )
              )

              , React.createElement('div', { className: "record-employee-main", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1835}}

                , React.createElement('div', { className: "record-name-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1837}}

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1839}}
                    , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1840}}
                      , 
                        selectedEmployee.employee
                      
                    )

                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1846}}
                      , selectedEmployee.employee_id ||
                        "Employee ID unavailable"
                    )
                  )

                  , React.createElement('span', { className: "record-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1852}}
                    , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1853}} )
                    , selectedEmployee.status ||
                      "Draft"
                  )

                )

                , React.createElement('div', { className: "record-meta", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1860}}

                  , selectedEmployee.role && (
                    React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1863}}
                      , selectedEmployee.role
                    )
                  )

                  , selectedEmployee.department && (
                    React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1869}}
                      , 
                        selectedEmployee.department
                      
                    )
                  )

                  , selectedEmployee.location && (
                    React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1877}}
                      , 
                        selectedEmployee.location
                      
                    )
                  )

                )

              )

            )

            /* EMPLOYEE INFORMATION */

            , React.createElement('section', { className: "record-section", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1892}}

              , React.createElement('div', { className: "record-section-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1894}}
                , React.createElement(UserRound, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1895}} )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1897}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1898}}, "Employee information"

                  )

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1902}}, "Personal and employment details"

                  )
                )
              )

              , React.createElement('div', { className: "record-info-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1908}}

                , React.createElement(RecordInfo, {
                  label: "Email",
                  value: 
                    selectedEmployee.email
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1910}}
                )

                , React.createElement(RecordInfo, {
                  label: "Phone",
                  value: 
                    selectedEmployee.phone
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1917}}
                )

                , React.createElement(RecordInfo, {
                  label: "Role",
                  value: 
                    selectedEmployee.role
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1924}}
                )

                , React.createElement(RecordInfo, {
                  label: "Department",
                  value: 
                    selectedEmployee.department
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1931}}
                )

                , React.createElement(RecordInfo, {
                  label: "Location",
                  value: 
                    selectedEmployee.location
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1938}}
                )

                , React.createElement(RecordInfo, {
                  label: "Date joined" ,
                  value: 
                    selectedEmployee.date_joined
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1945}}
                )

                , React.createElement(RecordInfo, {
                  label: "Employment",
                  value: 
                    selectedEmployee.employment_type
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1952}}
                )

                , React.createElement(RecordInfo, {
                  label: "Manager",
                  value: 
                    selectedEmployee.manager
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1959}}
                )

              )

            )

            /* PAYROLL BREAKDOWN */

            , React.createElement('section', { className: "record-section", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1972}}

              , React.createElement('div', { className: "record-section-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1974}}
                , React.createElement(WalletCards, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1975}} )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1977}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1978}}, "Payroll breakdown"

                  )

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1982}}
                    , monthLabel, " salary calculation"

                  )
                )
              )

              , React.createElement('div', { className: "salary-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1989}}

                , React.createElement(SalaryCard, {
                  label: "Gross pay" ,
                  value: currency(
                    selectedEmployee.gross_pay
                  ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1991}}
                )

                , React.createElement(SalaryCard, {
                  label: "Net pay" ,
                  value: currency(
                    selectedEmployee.net_pay
                  ),
                  highlight: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1998}}
                )

                , React.createElement(SalaryCard, {
                  label: "PF",
                  value: currency(
                    selectedEmployee.pf
                  ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2006}}
                )

                , React.createElement(SalaryCard, {
                  label: "TDS",
                  value: currency(
                    selectedEmployee.tds
                  ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2013}}
                )

                , React.createElement(SalaryCard, {
                  label: "Claims",
                  value: currency(
                    selectedEmployee.claims
                  ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2020}}
                )

                , React.createElement(SalaryCard, {
                  label: "Status",
                  value: 
                    selectedEmployee.status ||
                    "Draft"
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2027}}
                )

              )

            )

            /* AUTOMATIC AI INSIGHT */

            , React.createElement('section', { className: "record-ai", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2041}}

              , React.createElement('div', { className: "record-ai-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2043}}

                , React.createElement('div', { className: "record-ai-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2045}}
                  , React.createElement(Sparkles, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2046}} )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2049}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2050}}, "Payroll Intelligence"

                  )

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2054}}, "AI + RAG analysis"

                  )
                )

              )

              , recordAiLoading ? (
                React.createElement('div', { className: "record-ai-loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2062}}

                  , React.createElement('div', { className: "ai-loading-dots", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2064}}
                    , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2065}} )
                    , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2066}} )
                    , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2067}} )
                  ), "Analyzing payroll, attendance and HR policies..."




                )
              ) : (
                React.createElement('div', { className: "record-ai-message", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2075}}
                  , recordAiMessage ||
                    "Open payroll record to generate an AI insight."
                )
              )

              , recordAiSources.length >
                0 && (
                React.createElement('div', { className: "record-ai-sources", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2083}}

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2085}}, "Sources used"

                  )

                  , recordAiSources.map(
                    (
                      source,
                      index
                    ) => (
                      React.createElement('div', {
                        key: index, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2094}}

                        , React.createElement(FileText, {
                          size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2097}}
                        )

                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2101}}
                          , source.title ||
                            source.name ||
                            "Source"
                        )

                        , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2107}}
                          , source.type ||
                            "RAG"
                        )
                      )
                    )
                  )

                )
              )

            )

            /* ACTIONS */

            , React.createElement('div', { className: "record-actions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2122}}

              , React.createElement('button', {
                className: "record-download",
                onClick: () =>
                  downloadPayslip(
                    selectedEmployee.id
                  )
                ,
                disabled: 
                  downloading
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2124}}

                , React.createElement(Download, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2135}} )

                , downloading
                  ? "Generating..."
                  : "Download payslip"
              )

              , React.createElement('button', {
                className: "record-ai-button",
                onClick: () => {
                  setAiOpen(true);

                  setAiQuestion(
                    `Explain the ${monthLabel} payroll for ${selectedEmployee.employee} and identify important deductions, attendance impact or unusual changes.`
                  );
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2142}}

                , React.createElement(Sparkles, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2152}} ), "Ask Payroll AI"

              )

            )

          )
        )
      )

      /* ========================================================
          AI DRAWER
      ======================================================== */

      , aiOpen && (
        React.createElement('div', {
          className: "ai-overlay",
          onClick: () =>
            setAiOpen(false)
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2167}}

          , React.createElement('aside', {
            className: "ai-drawer",
            onClick: (event) =>
              event.stopPropagation()
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2173}}


            , React.createElement('div', { className: "ai-drawer-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2180}}

              , React.createElement('div', { className: "ai-title", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2182}}

                , React.createElement('div', { className: "ai-title-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2184}}
                  , React.createElement(Sparkles, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2185}} )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2188}}
                  , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2189}}, "Payroll Intelligence"

                  )

                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2193}}, "AI + RAG Assistant"

                  )
                )

              )

              , React.createElement('button', {
                onClick: () =>
                  setAiOpen(false)
                ,
                'aria-label': "Close AI" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2200}}

                , React.createElement(X, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2206}} )
              )

            )

            /* AI CONTEXT */

            , React.createElement('div', { className: "ai-context", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2213}}

              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2215}}, "CONTEXT")

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2217}}
                , React.createElement('b', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2218}}, "Payroll")
                , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2219}}, monthLabel)
              )

              , selectedEmployee && (
                React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2223}}
                  , React.createElement('b', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2224}}, "Employee")

                  , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2226}}
                    , 
                      selectedEmployee.employee
                    
                  )
                )
              )

            )

            /* CHAT */

            , React.createElement('div', { className: "ai-messages", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2238}}

              , aiMessages.map(
                (message, index) => (
                  React.createElement('div', {
                    key: index,
                    className: `ai-message ${message.role}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2242}}


                    , message.role ===
                      "assistant" && (
                      React.createElement('div', { className: "ai-message-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2249}}
                        , React.createElement(Bot, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2250}} )
                      )
                    )

                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2254}}

                      , React.createElement('div', { className: "ai-message-content", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2256}}
                        , message.content
                      )

                      , _optionalChain([message, 'access', _37 => _37.sources
, 'optionalAccess', _38 => _38.length]) > 0 && (
                        React.createElement('div', { className: "ai-sources", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2262}}

                          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2264}}, "Sources used"

                          )

                          , message.sources.map(
                            (
                              source,
                              sourceIndex
                            ) => (
                              React.createElement('div', {
                                key: 
                                  sourceIndex
                                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2273}}

                                , React.createElement(FileText, {
                                  size: 11, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2278}}
                                )

                                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2282}}
                                  , source.title ||
                                    source.name ||
                                    "Source"
                                )

                                , React.createElement('small', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2288}}
                                  , source.type ||
                                    "RAG"
                                )
                              )
                            )
                          )

                        )
                      )

                    )

                  )
                )
              )

              , aiLoading && (
                React.createElement('div', { className: "ai-thinking", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2306}}

                  , React.createElement('div', { className: "thinking-dots", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2308}}
                    , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2309}} )
                    , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2310}} )
                    , React.createElement('i', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2311}} )
                  ), "Searching payroll knowledge and employee records..."





                )
              )

            )

            /* SUGGESTIONS */

            , React.createElement('div', { className: "ai-suggestions", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2325}}

              , aiSuggestions.map(
                (suggestion) => (
                  React.createElement('button', {
                    key: suggestion,
                    onClick: () =>
                      askPayrollAI(
                        suggestion
                      )
                    ,
                    disabled: aiLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2329}}

                    , suggestion
                  )
                )
              )

            )

            /* INPUT */

            , React.createElement('div', { className: "ai-input-wrapper", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2347}}

              , React.createElement('textarea', {
                value: aiQuestion,
                onChange: (event) =>
                  setAiQuestion(
                    event.target.value
                  )
                ,
                onKeyDown: (event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    askPayrollAI();
                  }
                },
                placeholder: "Ask about payroll, deductions, policies..."    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2349}}
              )

              , React.createElement('button', {
                onClick: () =>
                  askPayrollAI()
                ,
                disabled: 
                  !aiQuestion.trim() ||
                  aiLoading
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2368}}

                , React.createElement(Send, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2377}} )
              )

            )

            , React.createElement('div', { className: "ai-disclaimer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2382}}
              , React.createElement(ShieldCheck, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2383}} ), "AI responses will be grounded in authorized HR, payroll and RAG sources."




            )

          )
        )
      )

    )
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
    React.createElement('div', { className: "payroll-kpi", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2410}}

      , React.createElement('div', { className: "kpi-top", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2412}}

        , React.createElement('div', { className: "kpi-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2414}}
          , React.createElement(Icon, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2415}} )
        )

        , React.createElement(MoreHorizontal, {
          size: 16,
          className: "kpi-more", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2418}}
        )

      )

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2425}}, label)

      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2427}}, value)

      , React.createElement('small', {
        className: 
          trendType === "up"
            ? "positive"
            : ""
        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2429}}

        , trendType === "up" && (
          React.createElement(TrendingUp, { size: 11, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2437}} )
        )

        , trend
      )

    )
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
      React.createElement('div', { className: "empty-payroll large" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2461}}

        , React.createElement(WalletCards, { size: 32, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2463}} )

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2465}}, "No payroll available"

        )

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2469}}, "Your latest payroll record will appear here."


        )

      )
    );
  }

  return (
    React.createElement('div', { className: "self-payroll", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2479}}

      , React.createElement('div', { className: "self-pay-main", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2481}}

        , React.createElement('div', { className: "self-eyebrow", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2483}}, "THIS MONTH TAKE-HOME PAY"

        )

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2487}}
          , currency(
            payroll.net_pay
          )
        )

        , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2493}}, "Latest payroll record for"
             , " "
          , payroll.employee || "you", "."
        )

        , React.createElement('button', {
          className: "self-download",
          onClick: () =>
            onDownload(payroll.id)
          ,
          disabled: downloading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2498}}

          , React.createElement(Download, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2505}} )

          , downloading
            ? "Generating..."
            : "Download payslip"
        )

      )

      , React.createElement('div', { className: "self-breakdown", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2514}}

        , React.createElement('div', { className: "self-breakdown-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2516}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2518}}, "PAYROLL BREAKDOWN"

          )

          , React.createElement(WalletCards, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2522}} )

        )

        , React.createElement(Breakdown, {
          label: "Gross pay" ,
          value: currency(
            payroll.gross_pay
          ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2526}}
        )

        , React.createElement(Breakdown, {
          label: "PF",
          value: currency(
            payroll.pf
          ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2533}}
        )

        , React.createElement(Breakdown, {
          label: "TDS",
          value: currency(
            payroll.tds
          ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2540}}
        )

        , React.createElement(Breakdown, {
          label: "Claims",
          value: currency(
            payroll.claims
          ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2547}}
        )

        , React.createElement('div', { className: "breakdown-total", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2554}}

          , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2556}}, "Net pay" )

          , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2558}}
            , currency(
              payroll.net_pay
            )
          )

        )

      )

    )
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
    React.createElement('div', { className: "breakdown-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2581}}
      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2582}}, label)
      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2583}}, value)
    )
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
    React.createElement('div', { className: "record-info", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2597}}

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2599}}, label)

      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2601}}
        , value || "—"
      )

    )
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
    React.createElement('div', {
      className: `salary-card ${
        highlight ? "highlight" : ""
      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2619}}

      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2624}}, label)

      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2626}}, value)
    )
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
