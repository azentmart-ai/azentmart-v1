import api from "./api.js";

export const leaveService = {
  async list() {
    const response = await api.get("/leave");
    return response.data;
  },

  async apply(payload) {
    const response = await api.post("/leave", payload);
    return response.data;
  }
};
