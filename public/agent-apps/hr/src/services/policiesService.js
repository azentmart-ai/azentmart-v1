import api from "./api.js";

export const policiesService = {
  async list() {
    const response = await api.get("/policies");
    return response.data;
  }
};
