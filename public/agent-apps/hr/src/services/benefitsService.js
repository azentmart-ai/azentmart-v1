import api from "./api.js";

export const benefitsService = {
  async list() {
    const response = await api.get("/benefits");
    return response.data;
  }
};
