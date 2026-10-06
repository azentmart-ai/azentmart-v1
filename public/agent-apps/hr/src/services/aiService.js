import api from "./api.js";

export const aiService = {
  async chat(message) {
    const response = await api.post("/ai-agent/chat", {
      message
    });

    return response.data;
  }
};
