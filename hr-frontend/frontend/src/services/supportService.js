import api from "./api";

export const supportService = {
  async list() {
    const response = await api.get("/support");
    return response.data;
  },

  async create(payload) {
    const response = await api.post("/support", payload);
    return response.data;
  }
};
