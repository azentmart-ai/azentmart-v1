const agentUrls = {
  voice:
    process.env.REACT_APP_VOICE_APP_URL ||
    "https://Voiceagent-prod-env.eba-ztsbugwe.ap-south-1.elasticbeanstalk.com",

  whatsapp:
    process.env.REACT_APP_WHATSAPP_APP_URL ||
    "https://Whatsapp-agent-prod-env.eba-zugtjcau.ap-south-1.elasticbeanstalk.com",

  instagram:
    process.env.REACT_APP_INSTAGRAM_APP_URL ||
    "https://www.azentmart.ai/agents/instagram/",

  interview:
    process.env.REACT_APP_INTERVIEW_APP_URL ||
    "https://InterviewAgent-env.eba-pyp2ps8r.ap-south-1.elasticbeanstalk.com",
};

export default agentUrls;