import api from "./api";

export const onboardingService = {
  async list() { const r = await api.get("/onboarding"); return r.data?.items || r.data || []; },
  async get(id) { const r = await api.get(`/onboarding/${id}`); return r.data; },
  async getByEmployee(employeeId) { const r = await api.get(`/onboarding/employee/${employeeId}`); return r.data; },
  async create(employee_id, details = {}) { const r = await api.post("/onboarding", { employee_id, details }); return r.data; },
  async updateDetails(id, details) { const r = await api.patch(`/onboarding/${id}/details`, { details }); return r.data; },
  async updateTask(taskId, completed) { const r = await api.patch(`/onboarding/tasks/${taskId}`, { completed }); return r.data; },
  async complete(id) { const r = await api.post(`/onboarding/${id}/complete`); return r.data; },
  async analyze(payload = {}) { const r = await api.post("/onboarding/ai/analyze", payload); return r.data; },
};
export default onboardingService;
