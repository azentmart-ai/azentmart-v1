 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import api from "./api.js";

export const onboardingService = {
  async list() { const r = await api.get("/onboarding"); return _optionalChain([r, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) || r.data || []; },
  async get(id) { const r = await api.get(`/onboarding/${id}`); return r.data; },
  async getByEmployee(employeeId) { const r = await api.get(`/onboarding/employee/${employeeId}`); return r.data; },
  async create(employee_id, details = {}) { const r = await api.post("/onboarding", { employee_id, details }); return r.data; },
  async updateDetails(id, details) { const r = await api.patch(`/onboarding/${id}/details`, { details }); return r.data; },
  async updateTask(taskId, completed) { const r = await api.patch(`/onboarding/tasks/${taskId}`, { completed }); return r.data; },
  async complete(id) { const r = await api.post(`/onboarding/${id}/complete`); return r.data; },
  async analyze(payload = {}) { const r = await api.post("/onboarding/ai/analyze", payload); return r.data; },
};
export default onboardingService;
