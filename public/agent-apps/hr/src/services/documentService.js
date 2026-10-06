import api from "./api.js";

export const documentService = {
  async list() {
    const response = await api.get("/documents");
    return response.data;
  }
};
