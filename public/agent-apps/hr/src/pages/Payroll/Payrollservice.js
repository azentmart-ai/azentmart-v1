 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }const API_URL = _optionalChain([window, 'access', _ => _.AZENTMART_AGENT_CONFIG, 'optionalAccess', _2 => _2.hrApi]) || "/hr-api";

/* =========================================================
   AUTH
========================================================= */

const getToken = () => {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
};

const getHeaders = (includeJson = false) => {
  const token = getToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/* =========================================================
   COMMON RESPONSE HANDLER
========================================================= */

const parseResponse = async (response) => {
  const contentType =
    response.headers.get("content-type") || "";

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      if (
        contentType.includes("application/json")
      ) {
        const data = await response.json();

        message =
          _optionalChain([data, 'optionalAccess', _3 => _3.detail]) ||
          _optionalChain([data, 'optionalAccess', _4 => _4.message]) ||
          _optionalChain([data, 'optionalAccess', _5 => _5.error]) ||
          message;
      } else {
        const text = await response.text();

        if (text) {
          message = text;
        }
      }
    } catch (e) {
      // Keep default error message.
    }

    throw new Error(message);
  }

  if (
    contentType.includes("application/json")
  ) {
    return response.json();
  }

  return response;
};

/* =========================================================
   DOWNLOAD FILE
========================================================= */

const downloadFile = async (
  url,
  fallbackFilename
) => {
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    let message =
      "Unable to download the file.";

    try {
      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        const data =
          await response.json();

        message =
          _optionalChain([data, 'optionalAccess', _6 => _6.detail]) ||
          _optionalChain([data, 'optionalAccess', _7 => _7.message]) ||
          message;
      } else {
        const text =
          await response.text();

        if (text) {
          message = text;
        }
      }
    } catch (e2) {
      // Ignore parsing errors.
    }

    throw new Error(message);
  }

  const blob =
    await response.blob();

  /* -----------------------------------------
     Try to get filename from backend
  ----------------------------------------- */

  const contentDisposition =
    response.headers.get(
      "Content-Disposition"
    );

  let filename =
    fallbackFilename;

  if (contentDisposition) {
    const match =
      contentDisposition.match(
        /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i
      );

    if (_optionalChain([match, 'optionalAccess', _8 => _8[1]])) {
      filename =
        decodeURIComponent(
          match[1]
        );
    }
  }

  /* -----------------------------------------
     Browser download
  ----------------------------------------- */

  const blobUrl =
    window.URL.createObjectURL(
      blob
    );

  const link =
    document.createElement("a");

  link.href = blobUrl;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(
    blobUrl
  );

  return {
    success: true,
    filename,
  };
};

/* =========================================================
   PAYROLL SERVICE
========================================================= */

export const payrollService = {

  /* =======================================================
     GET PAYROLL
     
     GET /api/payroll?month=2026-10
  ======================================================= */

  async list(month = null) {
    let url = `${API_URL}/payroll`;

    if (month) {
      url += `?month=${encodeURIComponent(
        month
      )}`;
    }

    const response =
      await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      });

    return parseResponse(response);
  },

  /* =======================================================
     GET EMPLOYEES
     
     GET /api/employees

     Used by Payroll.jsx to merge employee information
     with payroll records.
  ======================================================= */

  async employees() {
    const response =
      await fetch(
        `${API_URL}/employees`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

    return parseResponse(response);
  },

  /* =======================================================
     GET SINGLE PAYROLL RECORD
     
     GET /api/payroll/{id}
  ======================================================= */

  async get(payrollId) {
    if (!payrollId) {
      throw new Error(
        "Payroll ID is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/payroll/${payrollId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

    return parseResponse(response);
  },

  /* =======================================================
     GENERATE / RUN PAYROLL
     
     POST /api/payroll/generate
  ======================================================= */

  async generate(month) {
    if (!month) {
      throw new Error(
        "Payroll month is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/payroll/generate`,
        {
          method: "POST",

          headers:
            getHeaders(true),

          body: JSON.stringify({
            month,
          }),
        }
      );

    return parseResponse(response);
  },

  /* =======================================================
     APPROVE PAYROLL
     
     PATCH /api/payroll/{id}/approve
  ======================================================= */

  async approve(payrollId) {
    if (!payrollId) {
      throw new Error(
        "Payroll ID is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/payroll/${payrollId}/approve`,
        {
          method: "PATCH",

          headers:
            getHeaders(true),

          body: JSON.stringify({}),
        }
      );

    return parseResponse(response);
  },

  /* =======================================================
     APPROVE + LOCK PAYROLL
     
     PATCH /api/payroll/{id}/approve-lock
  ======================================================= */

  async approveAndLock(
    payrollId
  ) {
    if (!payrollId) {
      throw new Error(
        "Payroll ID is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/payroll/${payrollId}/approve-lock`,
        {
          method: "PATCH",

          headers:
            getHeaders(true),

          body: JSON.stringify({}),
        }
      );

    return parseResponse(response);
  },

  /* =======================================================
     LOCK PAYROLL
     
     PATCH /api/payroll/{id}/lock
  ======================================================= */

  async lock(payrollId) {
    if (!payrollId) {
      throw new Error(
        "Payroll ID is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/payroll/${payrollId}/lock`,
        {
          method: "PATCH",

          headers:
            getHeaders(true),

          body: JSON.stringify({}),
        }
      );

    return parseResponse(response);
  },

  /* =======================================================
     DOWNLOAD PAYSLIP PDF
     
     GET /api/payroll/{id}/payslip
  ======================================================= */

  async downloadPayslip(
    payrollId
  ) {
    if (!payrollId) {
      throw new Error(
        "Payroll ID is required."
      );
    }

    return downloadFile(
      `${API_URL}/payroll/${payrollId}/payslip`,
      `Payslip-${payrollId}.pdf`
    );
  },

  /* =======================================================
     DOWNLOAD BANK NEFT FILE
     
     GET /api/payroll/bank-file?month=2026-10
  ======================================================= */

  async downloadBankFile(
    month
  ) {
    if (!month) {
      throw new Error(
        "Payroll month is required."
      );
    }

    return downloadFile(
      `${API_URL}/payroll/bank-file?month=${encodeURIComponent(
        month
      )}`,
      `Bank-NEFT-${month}.csv`
    );
  },

  /* =======================================================
     DOWNLOAD PAYSLIPS ZIP
     
     GET /api/payroll/payslips.zip?month=2026-10
  ======================================================= */

  async downloadPayslipsZip(
    month
  ) {
    if (!month) {
      throw new Error(
        "Payroll month is required."
      );
    }

    return downloadFile(
      `${API_URL}/payroll/payslips.zip?month=${encodeURIComponent(
        month
      )}`,
      `Payslips-${month}.zip`
    );
  },

  /* =======================================================
     EXPORT PAYROLL CSV
     
     GET /api/payroll/export?month=2026-10
  ======================================================= */

  async exportCSV(month) {
    if (!month) {
      throw new Error(
        "Payroll month is required."
      );
    }

    return downloadFile(
      `${API_URL}/payroll/export?month=${encodeURIComponent(
        month
      )}`,
      `Payroll-${month}.csv`
    );
  },

  /* =======================================================
     AI + LLM + RAG
     
     POST /api/ai/payroll/chat
  ======================================================= */

  async askAI({
    message,
    month = null,
    employee_id = null,
    context = "payroll",
  }) {
    if (!_optionalChain([message, 'optionalAccess', _9 => _9.trim, 'call', _10 => _10()])) {
      throw new Error(
        "AI question is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/ai/payroll/chat`,
        {
          method: "POST",

          headers:
            getHeaders(true),

          body: JSON.stringify({
            message:
              message.trim(),

            month,

            employee_id,

            context,
          }),
        }
      );

    return parseResponse(response);
  },

  /* =======================================================
     AUTOMATIC EMPLOYEE PAYROLL INSIGHT
     
     Same LLM endpoint, but sends structured payroll
     context so the backend RAG layer can retrieve:
     
     - Payroll policies
     - Attendance
     - Leave
     - Employee records
     - Tax documents
     - HR knowledge
  ======================================================= */

  async generateAIInsight({
    employee_id,
    month,
  }) {
    if (!employee_id) {
      throw new Error(
        "Employee ID is required."
      );
    }

    if (!month) {
      throw new Error(
        "Payroll month is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/ai/payroll/chat`,
        {
          method: "POST",

          headers:
            getHeaders(true),

          body: JSON.stringify({
            message:
              "Analyze this employee's payroll for the selected month. Explain net pay, major deductions, attendance or leave impact, unusual changes, and any HR action that may require review. Use only information available from authorized payroll records, employee data and retrieved HR/RAG sources.",

            month,

            employee_id,

            context:
              "payroll_record",
          }),
        }
      );

    return parseResponse(response);
  },

  /* =======================================================
     PAYROLL SUMMARY
     
     GET /api/payroll/summary?month=2026-10
  ======================================================= */

  async summary(month) {
    if (!month) {
      throw new Error(
        "Payroll month is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/payroll/summary?month=${encodeURIComponent(
          month
        )}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

    return parseResponse(response);
  },

  /* =======================================================
     DELETE / REMOVE DRAFT PAYROLL
     
     DELETE /api/payroll/{id}
     
     Only use this for draft records if your backend
     permits deletion.
  ======================================================= */

  async remove(payrollId) {
    if (!payrollId) {
      throw new Error(
        "Payroll ID is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/payroll/${payrollId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

    return parseResponse(response);
  },
};

export default payrollService;