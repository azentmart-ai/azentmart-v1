import api from "./api";

export const policiesService = {
  async list() {
    const response = await api.get("/policies");
    return response.data;
  }
};
