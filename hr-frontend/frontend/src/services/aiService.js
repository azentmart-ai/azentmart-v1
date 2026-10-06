import api from "./api";

export const aiService = {
  async chat(message) {
    const response = await api.post("/ai-agent/chat", {
      message
    });

    return response.data;
  }
};
