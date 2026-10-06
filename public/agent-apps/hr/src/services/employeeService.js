 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import api from "./api.js";

export const employeeService = {
  async list(params = {}) {
    const r = await api.get("/employees", { params });
    return _optionalChain([r, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) || r.data || [];
  },
  async get(id) {
    const r = await api.get(`/employees/${id}`);
    return r.data;
  },
  async create(payload) {
    const r = await api.post("/employees", payload);
    return r.data;
  },
  async update(id, payload) {
    const r = await api.patch(`/employees/${id}`, payload);
    return r.data;
  },
  async remove(id) {
    const r = await api.delete(`/employees/${id}`);
    return r.data;
  },
};
