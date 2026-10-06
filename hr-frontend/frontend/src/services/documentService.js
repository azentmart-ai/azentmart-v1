import api from "./api";

export const documentService = {
  async list() {
    const response = await api.get("/documents");
    return response.data;
  }
};
