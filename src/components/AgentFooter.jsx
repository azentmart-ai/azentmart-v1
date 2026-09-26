import React from "react";
import Footer from "./Footer";

export default function AgentFooter({ theme = "default" }) {
  return <Footer themeClass={`az-agent-footer az-agent-footer--${theme}`} />;
}
