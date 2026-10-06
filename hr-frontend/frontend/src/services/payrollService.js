import api from "./api";

async function downloadBlob(path, fallback) {
  const response = await api.get(path, { responseType: "blob" });
  const disposition = response.headers?.["content-disposition"] || "";
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const filename = match?.[1] ? decodeURIComponent(match[1]) : fallback;
  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  return { success: true, filename };
}

export const payrollService = {
  async list(month = null) {
    const r = await api.get("/payroll", { params: month ? { month } : {} });
    return r.data;
  },
  async employees() {
    const r = await api.get("/employees", { params: { page_size: 200 } });
    return r.data;
  },
  async get(id) {
    const r = await api.get(`/payroll/${id}`);
    return r.data;
  },
  async generate(month) {
    const r = await api.post("/payroll/generate", { month });
    return r.data;
  },
  async approve(id) {
    const r = await api.patch(`/payroll/${id}/approve`);
    return r.data;
  },
  async approveAndLock(id) {
    const r = await api.patch(`/payroll/${id}/approve-lock`);
    return r.data;
  },
  async lock(id) {
    const r = await api.patch(`/payroll/${id}/lock`);
    return r.data;
  },
  async downloadPayslip(id) {
    return downloadBlob(`/payroll/${id}/payslip`, `Payslip-${id}.pdf`);
  },
  async downloadBankFile(month) {
    return downloadBlob(`/payroll/bank-file?month=${encodeURIComponent(month)}`, `Bank-NEFT-${month}.csv`);
  },
  async downloadPayslipsZip(month) {
    return downloadBlob(`/payroll/payslips.zip?month=${encodeURIComponent(month)}`, `Payslips-${month}.zip`);
  },
  async exportCSV(month) {
    return downloadBlob(`/payroll/export?month=${encodeURIComponent(month)}`, `Payroll-${month}.csv`);
  },
  async summary(month) {
    const r = await api.get("/payroll/summary", { params: { month } });
    return r.data;
  },
  async askAI({ message, month = null, employee_id = null, context = "payroll" }) {
    const r = await api.post("/ai/payroll/chat", { message, month, employee_id, context });
    return r.data;
  },
  async generateAIInsight({ employee_id, month }) {
    return this.askAI({
      employee_id,
      month,
      context: "payroll_record",
      message: "Analyze this employee payroll using only authorized payroll records and approved HR knowledge. Explain net pay, deductions, attendance/leave impact when available, unusual changes, and anything HR should review.",
    });
  },
};

export default payrollService;
