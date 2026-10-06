import api from "./api";

export const employeeService = {
  async list(params = {}) {
    const r = await api.get("/employees", { params });
    return r.data?.items || r.data || [];
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
