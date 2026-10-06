import api from "./api";

export const attendanceService = {
  async list() {
    const response = await api.get("/attendance");
    return response.data;
  },

  async regularize(payload) {
    const response = await api.post("/attendance/regularization", payload);
    return response.data;
  }
};
