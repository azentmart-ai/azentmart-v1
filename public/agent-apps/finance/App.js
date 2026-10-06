import React, { useState } from "react";
import { ArrowUpRight, Bot, BrainCircuit, ChevronRight, CircleDollarSign, FileText, LineChart, Menu, MessageSquareText, Play, Search, ShieldCheck, Sparkles, TrendingDown, TrendingUp, Upload, X, Zap, BarChart3, WalletCards, Activity, SlidersHorizontal } from "lucide-react";
const agents = [{
  name: "Financial Analyst",
  desc: "Explains performance, margins and business drivers.",
  icon: BarChart3,
  tone: "blue",
  status: "Active"
}, {
  name: "Cash Flow Agent",
  desc: "Tracks liquidity, inflows, outflows and runway.",
  icon: WalletCards,
  tone: "violet",
  status: "Watching"
}, {
  name: "Expense Intelligence",
  desc: "Finds unusual spend and recurring cost patterns.",
  icon: Search,
  tone: "cyan",
  status: "Active"
}, {
  name: "Forecast Agent",
  desc: "Builds scenario-based revenue and expense forecasts.",
  icon: LineChart,
  tone: "green",
  status: "Ready"
}, {
  name: "Reconciliation Agent",
  desc: "Checks records and flags mismatches for review.",
  icon: ShieldCheck,
  tone: "amber",
  status: "Ready"
}, {
  name: "Reporting Agent",
  desc: "Turns finance data into decision-ready reports.",
  icon: FileText,
  tone: "pink",
  status: "Ready"
}];
const metrics = [{
  label: "Revenue",
  value: "₹1.24 Cr",
  change: "+8.2%",
  positive: true
}, {
  label: "Operating spend",
  value: "₹78.4 L",
  change: "+3.1%",
  positive: false
}, {
  label: "Net margin",
  value: "36.8%",
  change: "+2.4%",
  positive: true
}, {
  label: "Cash position",
  value: "₹42.8 L",
  change: "+12.4%",
  positive: true
}];
function Logo({
  compact = false
}) {
  return /*#__PURE__*/React.createElement("a", {
    className: `brand ${compact ? "brand-compact" : ""}`,
    href: "#top",
    "aria-label": "AzentMart AI"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/azentmart-ai-logo.png",
    alt: "azentmart AI"
  }));
}
function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeAgent, setActiveAgent] = useState("Financial Analyst");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ask = () => {
    if (!query.trim()) return;
    setSubmitted(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "noise"
  }), /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("div", {
    className: "product-pill"
  }, /*#__PURE__*/React.createElement("span", {
    className: "live-dot"
  }), " Finance AI"), /*#__PURE__*/React.createElement("nav", {
    className: mobileOpen ? "nav open" : "nav"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#command"
  }, "Command Center"), /*#__PURE__*/React.createElement("a", {
    href: "#agents"
  }, "AI Workforce"), /*#__PURE__*/React.createElement("a", {
    href: "#intelligence"
  }, "Intelligence"), /*#__PURE__*/React.createElement("a", {
    href: "#reports"
  }, "Reports"), /*#__PURE__*/React.createElement("a", {
    href: "#integrations"
  }, "Integrations")), /*#__PURE__*/React.createElement("div", {
    className: "top-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-button",
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement(Search, {
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    className: "outline-button",
    onClick: () => document.getElementById("workspace")?.scrollIntoView({
      behavior: "smooth"
    })
  }, "Open workspace"), /*#__PURE__*/React.createElement("button", {
    className: "menu-button",
    onClick: () => setMobileOpen(v => !v),
    "aria-label": "Menu"
  }, mobileOpen ? /*#__PURE__*/React.createElement(X, {
    size: 22
  }) : /*#__PURE__*/React.createElement(Menu, {
    size: 22
  })))), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 14
  }), " AUTONOMOUS FINANCE WORKSPACE"), /*#__PURE__*/React.createElement("h1", null, "Numbers in.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", null, "Decisions out.")), /*#__PURE__*/React.createElement("p", {
    className: "hero-lede"
  }, "A financial intelligence layer that watches performance, explains changes, finds anomalies and turns your finance data into actions."), /*#__PURE__*/React.createElement("div", {
    className: "hero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "primary-button",
    onClick: () => document.getElementById("workspace")?.scrollIntoView({
      behavior: "smooth"
    })
  }, "Launch Finance AI ", /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    className: "ghost-button",
    onClick: () => document.getElementById("agents")?.scrollIntoView({
      behavior: "smooth"
    })
  }, /*#__PURE__*/React.createElement(Play, {
    size: 16,
    fill: "currentColor"
  }), " Explore agents")), /*#__PURE__*/React.createElement("div", {
    className: "hero-trust"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(ShieldCheck, {
    size: 15
  }), " Explainable insights"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Zap, {
    size: 15
  }), " Continuous monitoring"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(CircleDollarSign, {
    size: 15
  }), " Finance-first workflows"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-orbit"
  }, /*#__PURE__*/React.createElement("div", {
    className: "orbital-ring ring-one"
  }), /*#__PURE__*/React.createElement("div", {
    className: "orbital-ring ring-two"
  }), /*#__PURE__*/React.createElement("div", {
    className: "finance-core"
  }, /*#__PURE__*/React.createElement("div", {
    className: "core-top"
  }, /*#__PURE__*/React.createElement("span", null, "FINANCE AI CORE"), /*#__PURE__*/React.createElement("span", {
    className: "status"
  }, /*#__PURE__*/React.createElement("i", null), " LIVE")), /*#__PURE__*/React.createElement("div", {
    className: "core-number"
  }, "\u20B942.8L"), /*#__PURE__*/React.createElement("div", {
    className: "core-label"
  }, "available cash position"), /*#__PURE__*/React.createElement("div", {
    className: "sparkline"
  }, [34, 48, 42, 59, 52, 67, 62, 78, 72, 86, 81, 94].map((h, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: `${h}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "core-foot"
  }, /*#__PURE__*/React.createElement("span", null, "Cash flow health"), /*#__PURE__*/React.createElement("b", null, "Healthy"))), /*#__PURE__*/React.createElement("div", {
    className: "float-card insight"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 16
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Insight detected"), /*#__PURE__*/React.createElement("small", null, "Marketing spend is trending 18% higher."))), /*#__PURE__*/React.createElement("div", {
    className: "float-card received"
  }, /*#__PURE__*/React.createElement(CircleDollarSign, {
    size: 16
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "\u20B97.85L received"), /*#__PURE__*/React.createElement("small", null, "3 payments reconciled"))), /*#__PURE__*/React.createElement("div", {
    className: "float-card agent"
  }, /*#__PURE__*/React.createElement(Bot, {
    size: 16
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Agent working"), /*#__PURE__*/React.createElement("small", null, "Investigating expense variance")), /*#__PURE__*/React.createElement("span", {
    className: "pulse"
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "metric-strip",
    id: "command"
  }, metrics.map(m => /*#__PURE__*/React.createElement("div", {
    className: "metric",
    key: m.label
  }, /*#__PURE__*/React.createElement("span", null, m.label), /*#__PURE__*/React.createElement("strong", null, m.value), /*#__PURE__*/React.createElement("small", {
    className: m.positive ? "up" : "down"
  }, m.positive ? /*#__PURE__*/React.createElement(TrendingUp, {
    size: 13
  }) : /*#__PURE__*/React.createElement(TrendingDown, {
    size: 13
  }), " ", m.change))), /*#__PURE__*/React.createElement("div", {
    className: "metric-note"
  }, /*#__PURE__*/React.createElement(Activity, {
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, "AI is monitoring 126 financial signals"))), /*#__PURE__*/React.createElement("section", {
    className: "section workspace-section",
    id: "workspace"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "FINANCE COMMAND CENTER"), /*#__PURE__*/React.createElement("h2", null, "Your finance team, in one workspace.")), /*#__PURE__*/React.createElement("div", {
    className: "section-caption"
  }, "Ask questions. Investigate changes. Run agents.")), /*#__PURE__*/React.createElement("div", {
    className: "workspace-card"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "workspace-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-label"
  }, "Workspace"), /*#__PURE__*/React.createElement("button", {
    className: "side-item active"
  }, /*#__PURE__*/React.createElement(BarChart3, {
    size: 17
  }), " Overview"), /*#__PURE__*/React.createElement("button", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement(Activity, {
    size: 17
  }), " Activity"), /*#__PURE__*/React.createElement("button", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement(WalletCards, {
    size: 17
  }), " Cash flow"), /*#__PURE__*/React.createElement("button", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement(FileText, {
    size: 17
  }), " Reports"), /*#__PURE__*/React.createElement("button", {
    className: "side-item"
  }, /*#__PURE__*/React.createElement(SlidersHorizontal, {
    size: 17
  }), " Controls"), /*#__PURE__*/React.createElement("div", {
    className: "side-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "side-label"
  }, "AI agents"), agents.slice(0, 4).map(a => {
    const Icon = a.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: a.name,
      className: "side-agent"
    }, /*#__PURE__*/React.createElement("span", {
      className: `mini-icon ${a.tone}`
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 13
    })), a.name.replace(" Agent", ""));
  })), /*#__PURE__*/React.createElement("div", {
    className: "workspace-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "workspace-toolbar"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "crumb"
  }, "Finance /"), " Overview"), /*#__PURE__*/React.createElement("div", {
    className: "toolbar-actions"
  }, /*#__PURE__*/React.createElement("span", {
    className: "period"
  }, "Last 30 days ", /*#__PURE__*/React.createElement(ChevronRight, {
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    className: "tiny-button"
  }, /*#__PURE__*/React.createElement(Upload, {
    size: 14
  }), " Import"))), /*#__PURE__*/React.createElement("div", {
    className: "dash-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card wide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Revenue performance"), /*#__PURE__*/React.createElement("b", null, "\u20B91.24 Cr")), /*#__PURE__*/React.createElement("small", {
    className: "up"
  }, "+8.2% vs previous period")), /*#__PURE__*/React.createElement("div", {
    className: "chart"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chart-y"
  }, /*#__PURE__*/React.createElement("span", null, "1.4Cr"), /*#__PURE__*/React.createElement("span", null, "1Cr"), /*#__PURE__*/React.createElement("span", null, "60L"), /*#__PURE__*/React.createElement("span", null, "20L")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 720 220",
    preserveAspectRatio: "none",
    "aria-label": "Revenue trend"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "fill",
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#426bff",
    stopOpacity: ".30"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#426bff",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M0 176 C55 160 70 172 112 142 S175 146 214 119 S274 132 316 91 S378 111 420 80 S483 102 526 61 S584 76 624 48 S676 56 720 28 L720 220 L0 220 Z",
    fill: "url(#fill)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 176 C55 160 70 172 112 142 S175 146 214 119 S274 132 316 91 S378 111 420 80 S483 102 526 61 S584 76 624 48 S676 56 720 28",
    fill: "none",
    stroke: "#5d7cff",
    strokeWidth: "4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "chart-x"
  }, /*#__PURE__*/React.createElement("span", null, "01"), /*#__PURE__*/React.createElement("span", null, "07"), /*#__PURE__*/React.createElement("span", null, "14"), /*#__PURE__*/React.createElement("span", null, "21"), /*#__PURE__*/React.createElement("span", null, "30")))), /*#__PURE__*/React.createElement("div", {
    className: "dash-card insight-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-badge"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 14
  }), " AI INSIGHT"), /*#__PURE__*/React.createElement("h3", null, "Expense variance detected"), /*#__PURE__*/React.createElement("p", null, "Infrastructure costs are 11.4% above the expected run-rate. The agent found 3 contributing vendors."), /*#__PURE__*/React.createElement("button", {
    className: "text-button"
  }, "Investigate ", /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dash-card activity-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-head"
  }, /*#__PURE__*/React.createElement("span", null, "Agent activity"), /*#__PURE__*/React.createElement("span", {
    className: "live-label"
  }, /*#__PURE__*/React.createElement("i", null), " live")), [["Financial Analyst", "Explained margin movement", "2m ago", "blue"], ["Cash Flow Agent", "Updated 30-day forecast", "8m ago", "violet"], ["Expense Intelligence", "Flagged vendor variance", "14m ago", "cyan"]].map(([name, desc, time, tone]) => /*#__PURE__*/React.createElement("div", {
    className: "activity-row",
    key: name
  }, /*#__PURE__*/React.createElement("span", {
    className: `activity-dot ${tone}`
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, name), /*#__PURE__*/React.createElement("small", null, desc)), /*#__PURE__*/React.createElement("time", null, time)))))))), /*#__PURE__*/React.createElement("section", {
    className: "section agents-section",
    id: "agents"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-heading centered"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "AI WORKFORCE"), /*#__PURE__*/React.createElement("h2", null, "Specialists for every finance workflow.")), /*#__PURE__*/React.createElement("p", null, "Activate agents independently or let them collaborate across your finance operations.")), /*#__PURE__*/React.createElement("div", {
    className: "agent-grid"
  }, agents.map(agent => {
    const Icon = agent.icon;
    const active = activeAgent === agent.name;
    return /*#__PURE__*/React.createElement("button", {
      className: `agent-card ${active ? "selected" : ""}`,
      key: agent.name,
      onClick: () => setActiveAgent(agent.name)
    }, /*#__PURE__*/React.createElement("div", {
      className: "agent-card-top"
    }, /*#__PURE__*/React.createElement("span", {
      className: `agent-icon ${agent.tone}`
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      className: "agent-status"
    }, /*#__PURE__*/React.createElement("i", null), agent.status)), /*#__PURE__*/React.createElement("h3", null, agent.name), /*#__PURE__*/React.createElement("p", null, agent.desc), /*#__PURE__*/React.createElement("span", {
      className: "agent-link"
    }, "Open agent ", /*#__PURE__*/React.createElement(ArrowUpRight, {
      size: 15
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "agent-console"
  }, /*#__PURE__*/React.createElement("div", {
    className: "console-label"
  }, /*#__PURE__*/React.createElement(Bot, {
    size: 16
  }), " ACTIVE AGENT"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, activeAgent), /*#__PURE__*/React.createElement("span", null, "Ready to analyze your finance workspace.")), /*#__PURE__*/React.createElement("button", {
    className: "primary-small"
  }, "Open workspace ", /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 15
  })))), /*#__PURE__*/React.createElement("section", {
    className: "section intelligence-section",
    id: "intelligence"
  }, /*#__PURE__*/React.createElement("div", {
    className: "intelligence-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "ASK FINANCE AI"), /*#__PURE__*/React.createElement("h2", null, "Talk to your numbers like a finance analyst."), /*#__PURE__*/React.createElement("p", null, "Ask a plain-language question and the agent can trace the underlying signals, explain the result and point you to the next action."), /*#__PURE__*/React.createElement("div", {
    className: "query-box"
  }, /*#__PURE__*/React.createElement(MessageSquareText, {
    size: 19
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => {
      setQuery(e.target.value);
      setSubmitted(false);
    },
    onKeyDown: e => e.key === "Enter" && ask(),
    placeholder: "Why did our expenses increase this month?"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: ask
  }, /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 17
  }))), /*#__PURE__*/React.createElement("div", {
    className: "suggested"
  }, /*#__PURE__*/React.createElement("span", null, "Try:"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQuery("Why did our expenses increase this month?")
  }, "Expense variance"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQuery("What is our cash runway?")
  }, "Cash runway"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQuery("Show our revenue trend")
  }, "Revenue trend")), submitted && /*#__PURE__*/React.createElement("div", {
    className: "answer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "answer-icon"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 17
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Finance AI"), /*#__PURE__*/React.createElement("p", null, "Expenses increased primarily from infrastructure and marketing. I found three material changes and can open the supporting transactions."), /*#__PURE__*/React.createElement("button", {
    className: "text-button"
  }, "View analysis ", /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 14
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "signal-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "signal-head"
  }, /*#__PURE__*/React.createElement("span", null, "LIVE SIGNALS"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", null), " 126 monitored")), /*#__PURE__*/React.createElement("div", {
    className: "signal-big"
  }, /*#__PURE__*/React.createElement("strong", null, "18"), /*#__PURE__*/React.createElement("span", null, "signals changed", /*#__PURE__*/React.createElement("br", null), "in the last 24h")), /*#__PURE__*/React.createElement("div", {
    className: "signal-bars"
  }, [42, 60, 50, 72, 64, 88, 74, 92, 68, 84, 78, 96].map((h, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: `${h}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "signal-list"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "green-dot"
  }), "Positive movement ", /*#__PURE__*/React.createElement("b", null, "+12")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "amber-dot"
  }), "Needs review ", /*#__PURE__*/React.createElement("b", null, "4")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "red-dot"
  }), "Anomalies ", /*#__PURE__*/React.createElement("b", null, "2")))))), /*#__PURE__*/React.createElement("section", {
    className: "section report-section",
    id: "reports"
  }, /*#__PURE__*/React.createElement("div", {
    className: "report-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "report-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "DECISION-READY REPORTING"), /*#__PURE__*/React.createElement("h2", null, "From raw transactions to a clear financial story."), /*#__PURE__*/React.createElement("p", null, "Generate executive summaries, variance explanations, forecast narratives and audit-ready activity trails from the same finance workspace."), /*#__PURE__*/React.createElement("button", {
    className: "primary-button"
  }, "Generate a report ", /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "report-preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "report-top"
  }, /*#__PURE__*/React.createElement("span", null, "MONTHLY FINANCE BRIEF"), /*#__PURE__*/React.createElement("span", null, "SEP 2026")), /*#__PURE__*/React.createElement("h3", null, "Business performance is improving"), /*#__PURE__*/React.createElement("div", {
    className: "report-row"
  }, /*#__PURE__*/React.createElement("span", null, "Revenue"), /*#__PURE__*/React.createElement("b", null, "\u20B91.24 Cr"), /*#__PURE__*/React.createElement("em", null, "+8.2%")), /*#__PURE__*/React.createElement("div", {
    className: "report-row"
  }, /*#__PURE__*/React.createElement("span", null, "Operating spend"), /*#__PURE__*/React.createElement("b", null, "\u20B978.4 L"), /*#__PURE__*/React.createElement("em", {
    className: "warn"
  }, "+3.1%")), /*#__PURE__*/React.createElement("div", {
    className: "report-row"
  }, /*#__PURE__*/React.createElement("span", null, "Net margin"), /*#__PURE__*/React.createElement("b", null, "36.8%"), /*#__PURE__*/React.createElement("em", null, "+2.4%")), /*#__PURE__*/React.createElement("div", {
    className: "report-note"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 15
  }), /*#__PURE__*/React.createElement("span", null, "AI summary: Margin expanded as revenue growth outpaced operating spend."))))), /*#__PURE__*/React.createElement("section", {
    className: "section integrations-section",
    id: "integrations"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-heading centered"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "CONNECT YOUR STACK"), /*#__PURE__*/React.createElement("h2", null, "One intelligence layer across finance data.")), /*#__PURE__*/React.createElement("p", null, "Designed to sit above your existing systems instead of replacing them.")), /*#__PURE__*/React.createElement("div", {
    className: "integration-row"
  }, ["ERP / Accounting", "Banking data", "Spreadsheets", "CRM / Sales", "Payroll", "Data warehouse"].map((x, i) => /*#__PURE__*/React.createElement("div", {
    className: "integration-chip",
    key: x
  }, /*#__PURE__*/React.createElement("span", null, String(i + 1).padStart(2, "0")), x)))), /*#__PURE__*/React.createElement("section", {
    className: "final-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "THE FINANCE AI LAYER"), /*#__PURE__*/React.createElement("h2", null, "Let your finance data", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", null, "do more work.")), /*#__PURE__*/React.createElement("p", null, "Bring analysis, monitoring, forecasting and reporting into one intelligent workspace."), /*#__PURE__*/React.createElement("button", {
    className: "primary-button"
  }, "Launch Finance AI ", /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 18
  })))), /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
    className: "footer-main"
  }, /*#__PURE__*/React.createElement(Logo, {
    compact: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "footer-product"
  }, "Finance AI / Intelligent financial operations"), /*#__PURE__*/React.createElement("div", {
    className: "footer-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#command"
  }, "Workspace"), /*#__PURE__*/React.createElement("a", {
    href: "#agents"
  }, "Agents"), /*#__PURE__*/React.createElement("a", {
    href: "#reports"
  }, "Reports"), /*#__PURE__*/React.createElement("a", {
    href: "#integrations"
  }, "Integrations"))), /*#__PURE__*/React.createElement("div", {
    className: "footer-bottom"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 AzentMart AI. All rights reserved."), /*#__PURE__*/React.createElement("span", null, "Finance intelligence, designed for teams."))));
}
export default App;