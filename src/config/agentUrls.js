const agentUrls = {
  voice: process.env.REACT_APP_VOICE_APP_URL || "http://localhost:3001",
  whatsapp: process.env.REACT_APP_WHATSAPP_APP_URL || "http://localhost:3002",
  instagram: process.env.REACT_APP_INSTAGRAM_APP_URL || "http://localhost:3003",
  interview: process.env.REACT_APP_INTERVIEW_APP_URL || "http://localhost:3004",
};
export default agentUrls;
