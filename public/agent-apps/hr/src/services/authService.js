import api from "./api.js";

export const authService = {
  async signup(payload) {
    const response = await api.post("/auth/signup", payload);
    return response.data;
  },

  async login(payload) {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },

  async me() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(payload) {
    const response = await api.post("/auth/reset-password", payload);
    return response.data;
  }
};
