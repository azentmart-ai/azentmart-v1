import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowLeftRight, ArrowRight, BarChart3, Bot, CheckCircle2, ChevronDown, ClipboardList, FileText, Landmark, LayoutDashboard, Menu, MessageSquareText, Play, ReceiptText, Send, Shield, ShieldAlert, Sparkles, Users, Wallet, X, Zap } from 'lucide-react';
const API_BASE = (window.AZENTMART_AGENT_CONFIG?.bankingApi || "/banking-api") || '/banking-api';
const navItems = [['Dashboard', LayoutDashboard], ['Accounts', Wallet], ['Transactions', ArrowLeftRight], ['Beneficiaries', Users], ['Loans', Landmark], ['Statements', FileText], ['Fraud & Risk', ShieldAlert], ['Audit Logs', ClipboardList]];
function Logo({
  className = ''
}) {
  return /*#__PURE__*/React.createElement("img", {
    className: `site-logo ${className}`,
    src: "/azentmart-ai-logo.png",
    alt: "Azentmart AI"
  });
}
function App() {
  const [view, setView] = useState(() => window.location.hash === '#dashboard' ? 'dashboard' : 'landing');
  const openDashboard = () => {
    window.location.hash = 'dashboard';
    setView('dashboard');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const openLanding = () => {
    window.location.hash = '';
    setView('landing');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    const onHashChange = () => setView(window.location.hash === '#dashboard' ? 'dashboard' : 'landing');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return view === 'dashboard' ? /*#__PURE__*/React.createElement(Dashboard, {
    onBack: openLanding
  }) : /*#__PURE__*/React.createElement(Landing, {
    onLaunch: openDashboard
  });
}
function Landing({
  onLaunch
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const goTo = id => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "landing"
  }, /*#__PURE__*/React.createElement("header", {
    className: "landing-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-inner"
  }, /*#__PURE__*/React.createElement("button", {
    className: "brand-button",
    onClick: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }),
    "aria-label": "Azentmart AI home"
  }, /*#__PURE__*/React.createElement(Logo, null)), /*#__PURE__*/React.createElement("nav", {
    className: `landing-links ${mobileOpen ? 'open' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => goTo('how-it-works')
  }, "How It Works"), /*#__PURE__*/React.createElement("button", {
    onClick: () => goTo('capabilities')
  }, "Capabilities"), /*#__PURE__*/React.createElement("button", {
    onClick: () => goTo('benefits')
  }, "Benefits"), /*#__PURE__*/React.createElement("button", {
    onClick: () => goTo('use-cases')
  }, "Use Cases"), /*#__PURE__*/React.createElement("button", {
    onClick: () => goTo('security')
  }, "Security"), /*#__PURE__*/React.createElement("button", {
    className: "nav-dashboard",
    onClick: onLaunch
  }, "Open Dashboard ", /*#__PURE__*/React.createElement(ArrowRight, {
    size: 15
  }))), /*#__PURE__*/React.createElement("button", {
    className: "menu-button",
    onClick: () => setMobileOpen(v => !v),
    "aria-label": "Toggle menu"
  }, mobileOpen ? /*#__PURE__*/React.createElement(X, {
    size: 21
  }) : /*#__PURE__*/React.createElement(Menu, {
    size: 21
  })))), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "hero-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow-dot"
  }), " Intelligent Banking Operations"), /*#__PURE__*/React.createElement("h1", null, "Banking intelligence that turns ", /*#__PURE__*/React.createElement("span", null, "questions into action.")), /*#__PURE__*/React.createElement("p", {
    className: "hero-description"
  }, "A conversational AI banking workspace that helps teams understand accounts, transactions, beneficiaries, loans, statements and risk through one intelligent interface."), /*#__PURE__*/React.createElement("div", {
    className: "hero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "primary-btn",
    onClick: onLaunch
  }, "Launch Banking Agent ", /*#__PURE__*/React.createElement(ArrowRight, {
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    className: "secondary-btn",
    onClick: () => goTo('how-it-works')
  }, /*#__PURE__*/React.createElement(Play, {
    size: 16
  }), " See how it works")), /*#__PURE__*/React.createElement("div", {
    className: "hero-proof"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CheckCircle2, {
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, "Natural-language banking")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CheckCircle2, {
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, "Action-oriented workflows")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CheckCircle2, {
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, "Risk-aware assistance")))), /*#__PURE__*/React.createElement("div", {
    className: "hero-visual",
    "aria-label": "Banking AI workflow preview"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glow glow-one"
  }), /*#__PURE__*/React.createElement("div", {
    className: "glow glow-two"
  }), /*#__PURE__*/React.createElement("div", {
    className: "agent-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "agent-card-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mini-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mini-orb"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Banking AI"), /*#__PURE__*/React.createElement("small", null, "Intelligent workspace"))), /*#__PURE__*/React.createElement("span", {
    className: "online-dot"
  }, "Live")), /*#__PURE__*/React.createElement("div", {
    className: "agent-chat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-label"
  }, "You"), /*#__PURE__*/React.createElement("div", {
    className: "preview-user"
  }, "Show my account activity and flag anything unusual."), /*#__PURE__*/React.createElement("div", {
    className: "chat-label assistant-label"
  }, "Banking AI"), /*#__PURE__*/React.createElement("div", {
    className: "preview-ai"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-title"
  }, /*#__PURE__*/React.createElement(Bot, {
    size: 16
  }), " Analysis ready"), /*#__PURE__*/React.createElement("p", null, "4 recent transactions reviewed. No unusual activity detected."), /*#__PURE__*/React.createElement("div", {
    className: "mini-stats"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "\u20B975K"), /*#__PURE__*/React.createElement("small", null, "Available")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "4"), /*#__PURE__*/React.createElement("small", null, "Transactions")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Low"), /*#__PURE__*/React.createElement("small", null, "Risk"))))), /*#__PURE__*/React.createElement("div", {
    className: "preview-input"
  }, /*#__PURE__*/React.createElement("span", null, "Ask your banking assistant..."), /*#__PURE__*/React.createElement("span", {
    className: "send-pill"
  }, /*#__PURE__*/React.createElement(Send, {
    size: 14
  })))), /*#__PURE__*/React.createElement("div", {
    className: "floating-card floating-secure"
  }, /*#__PURE__*/React.createElement(Shield, {
    size: 17
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Protected workflow"), /*#__PURE__*/React.createElement("small", null, "Risk-aware processing"))), /*#__PURE__*/React.createElement("div", {
    className: "floating-card floating-analytics"
  }, /*#__PURE__*/React.createElement(BarChart3, {
    size: 17
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Smart insights"), /*#__PURE__*/React.createElement("small", null, "Understand activity faster"))))), /*#__PURE__*/React.createElement("div", {
    className: "hero-line"
  })), /*#__PURE__*/React.createElement("section", {
    className: "intro-section section-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-kicker"
  }, "THE BANKING AI AGENT"), /*#__PURE__*/React.createElement("div", {
    className: "two-column-intro"
  }, /*#__PURE__*/React.createElement("h2", null, "One intelligent layer for everyday banking operations."), /*#__PURE__*/React.createElement("p", null, "Instead of navigating multiple banking screens for every question, users can describe what they need in plain language. The agent interprets the intent, works with the banking platform and returns a clear, useful response.")), /*#__PURE__*/React.createElement("div", {
    className: "stats-strip"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "01"), /*#__PURE__*/React.createElement("span", null, "Ask naturally")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "02"), /*#__PURE__*/React.createElement("span", null, "AI understands intent")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "03"), /*#__PURE__*/React.createElement("span", null, "Banking workflow responds")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "04"), /*#__PURE__*/React.createElement("span", null, "Get a clear result")))), /*#__PURE__*/React.createElement("section", {
    id: "how-it-works",
    className: "dark-section section-anchor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-heading light-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-kicker"
  }, "HOW IT WORKS"), /*#__PURE__*/React.createElement("h2", null, "From a simple message to a banking action.")), /*#__PURE__*/React.createElement("p", null, "The experience is designed around a simple flow: understand the request, connect it to the right banking capability, then present the result clearly.")), /*#__PURE__*/React.createElement("div", {
    className: "flow-grid"
  }, /*#__PURE__*/React.createElement(FlowStep, {
    number: "01",
    icon: /*#__PURE__*/React.createElement(MessageSquareText, null),
    title: "Ask",
    text: "A user describes a banking need using everyday language."
  }), /*#__PURE__*/React.createElement(FlowStep, {
    number: "02",
    icon: /*#__PURE__*/React.createElement(Bot, null),
    title: "Understand",
    text: "The AI interprets the intent and identifies the relevant banking workflow."
  }), /*#__PURE__*/React.createElement(FlowStep, {
    number: "03",
    icon: /*#__PURE__*/React.createElement(Zap, null),
    title: "Process",
    text: "The platform uses the connected banking services to retrieve or prepare the requested result."
  }), /*#__PURE__*/React.createElement(FlowStep, {
    number: "04",
    icon: /*#__PURE__*/React.createElement(CheckCircle2, null),
    title: "Respond",
    text: "The user receives a concise answer, status, insight or next step."
  })))), /*#__PURE__*/React.createElement("section", {
    id: "capabilities",
    className: "section-shell capabilities-section section-anchor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-kicker"
  }, "CAPABILITIES"), /*#__PURE__*/React.createElement("h2", null, "Built around the banking workflows that matter.")), /*#__PURE__*/React.createElement("p", null, "Explore the same functional areas available in the existing Banking AI workspace.")), /*#__PURE__*/React.createElement("div", {
    className: "capability-grid"
  }, /*#__PURE__*/React.createElement(Capability, {
    icon: /*#__PURE__*/React.createElement(Wallet, null),
    title: "Accounts",
    text: "Understand balances and account-level information through conversational requests."
  }), /*#__PURE__*/React.createElement(Capability, {
    icon: /*#__PURE__*/React.createElement(ArrowLeftRight, null),
    title: "Transactions",
    text: "Review recent activity and get faster answers about transaction history."
  }), /*#__PURE__*/React.createElement(Capability, {
    icon: /*#__PURE__*/React.createElement(Users, null),
    title: "Beneficiaries",
    text: "Access beneficiary-related information without navigating complex menus."
  }), /*#__PURE__*/React.createElement(Capability, {
    icon: /*#__PURE__*/React.createElement(Landmark, null),
    title: "Loans",
    text: "Ask about loan information, repayments and related banking workflows."
  }), /*#__PURE__*/React.createElement(Capability, {
    icon: /*#__PURE__*/React.createElement(ReceiptText, null),
    title: "Statements",
    text: "Request statement-related information through natural language."
  }), /*#__PURE__*/React.createElement(Capability, {
    icon: /*#__PURE__*/React.createElement(ShieldAlert, null),
    title: "Fraud & Risk",
    text: "Surface risk-oriented insights and make unusual activity easier to investigate."
  }))), /*#__PURE__*/React.createElement("section", {
    id: "benefits",
    className: "benefits-section section-anchor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "benefits-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "benefit-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-kicker"
  }, "WHY IT MATTERS"), /*#__PURE__*/React.createElement("h2", null, "Less searching. More understanding."), /*#__PURE__*/React.createElement("p", null, "Banking workflows can be powerful without being complicated. The AI layer makes the experience more conversational, focused and easier to operate."), /*#__PURE__*/React.createElement("button", {
    className: "text-btn",
    onClick: onLaunch
  }, "Explore the workspace ", /*#__PURE__*/React.createElement(ArrowRight, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    className: "benefit-list"
  }, /*#__PURE__*/React.createElement(Benefit, {
    number: "01",
    title: "Faster access to information",
    text: "Get useful banking answers without manually moving through multiple sections."
  }), /*#__PURE__*/React.createElement(Benefit, {
    number: "02",
    title: "A more natural user experience",
    text: "Use everyday language instead of learning rigid navigation or command patterns."
  }), /*#__PURE__*/React.createElement(Benefit, {
    number: "03",
    title: "Better operational focus",
    text: "Bring related banking capabilities into one consistent workspace."
  }), /*#__PURE__*/React.createElement(Benefit, {
    number: "04",
    title: "Actionable intelligence",
    text: "Turn raw account activity into understandable status, insights and next steps."
  }))))), /*#__PURE__*/React.createElement("section", {
    id: "use-cases",
    className: "section-shell use-case-section section-anchor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-kicker"
  }, "USE CASES"), /*#__PURE__*/React.createElement("h2", null, "Useful across the banking journey.")), /*#__PURE__*/React.createElement("p", null, "A single conversational layer can support customers, operations teams and decision-making workflows.")), /*#__PURE__*/React.createElement("div", {
    className: "use-case-grid"
  }, /*#__PURE__*/React.createElement(UseCase, {
    title: "Customer assistance",
    text: "Answer common banking questions and guide customers to the information they need.",
    tag: "CUSTOMER EXPERIENCE"
  }), /*#__PURE__*/React.createElement(UseCase, {
    title: "Operations support",
    text: "Help internal users quickly inspect account, transaction, loan and statement information.",
    tag: "OPERATIONS"
  }), /*#__PURE__*/React.createElement(UseCase, {
    title: "Risk review",
    text: "Support investigations by bringing activity and risk-oriented information into one conversation.",
    tag: "RISK & COMPLIANCE"
  }))), /*#__PURE__*/React.createElement("section", {
    id: "security",
    className: "security-section section-anchor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-shell security-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "security-icon"
  }, /*#__PURE__*/React.createElement(Shield, {
    size: 25
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-kicker"
  }, "TRUST & CONTROL"), /*#__PURE__*/React.createElement("h2", null, "Designed for a responsible banking AI experience."), /*#__PURE__*/React.createElement("p", null, "The interface keeps banking actions and information inside a structured workspace, with clear status feedback and a dedicated risk area. Connect your production authentication, authorization and security controls to the backend when deploying.")), /*#__PURE__*/React.createElement("div", {
    className: "security-points"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(CheckCircle2, {
    size: 15
  }), " Structured banking workflows"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(CheckCircle2, {
    size: 15
  }), " Risk-aware experience"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(CheckCircle2, {
    size: 15
  }), " Clear action feedback")))), /*#__PURE__*/React.createElement("section", {
    className: "cta-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-shell cta-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-kicker"
  }, "READY TO EXPLORE"), /*#__PURE__*/React.createElement("h2", null, "See the Banking AI Agent in action."), /*#__PURE__*/React.createElement("p", null, "Move from the product overview into the working banking dashboard with one click.")), /*#__PURE__*/React.createElement("button", {
    className: "primary-btn light-cta",
    onClick: onLaunch
  }, "Open Banking Dashboard ", /*#__PURE__*/React.createElement(ArrowRight, {
    size: 18
  }))))), /*#__PURE__*/React.createElement("footer", {
    className: "site-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-shell footer-top"
  }, /*#__PURE__*/React.createElement(Logo, {
    className: "footer-logo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "footer-copy"
  }, /*#__PURE__*/React.createElement("b", null, "Banking AI Agent"), /*#__PURE__*/React.createElement("span", null, "Intelligent banking, designed around the way people ask.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, "Back to top ", /*#__PURE__*/React.createElement(ChevronDown, {
    size: 16,
    className: "rotate-180"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "section-shell footer-bottom"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear(), " Azentmart AI. Banking AI Platform."), /*#__PURE__*/React.createElement("span", null, "AI-powered banking workspace"))));
}
function FlowStep({
  number,
  icon,
  title,
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flow-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flow-top"
  }, /*#__PURE__*/React.createElement("span", null, number), /*#__PURE__*/React.createElement("div", null, icon)), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, text));
}
function Capability({
  icon,
  title,
  text
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "capability-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "capability-icon"
  }, icon), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, text), /*#__PURE__*/React.createElement("span", {
    className: "capability-arrow"
  }, /*#__PURE__*/React.createElement(ArrowUpRightIcon, null)));
}
function ArrowUpRightIcon() {
  return /*#__PURE__*/React.createElement(ArrowRight, {
    size: 16
  });
}
function Benefit({
  number,
  title,
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "benefit-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "benefit-number"
  }, number), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, text)));
}
function UseCase({
  title,
  text,
  tag
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "use-case-card"
  }, /*#__PURE__*/React.createElement("span", null, tag), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, text), /*#__PURE__*/React.createElement(ArrowRight, {
    size: 18
  }));
}
function Dashboard({
  onBack
}) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: 'Hello! I’m your Banking AI assistant. Ask me about your balance, transactions, beneficiaries, loans, statements, or transfers.'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email] = useState('admin@example.com');
  const [password] = useState('123456');
  const askAgent = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMessages(m => [...m, {
      role: 'user',
      text
    }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/ai-agent/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          message: text
        })
      });
      const data = await response.json();
      const pretty = data.message ? `${data.message}${data.status ? `\n\nStatus: ${data.status}` : ''}${data.transferId ? `\nTransfer ID: ${data.transferId}` : ''}${data.riskLevel ? `\nRisk: ${data.riskLevel}` : ''}` : JSON.stringify(data, null, 2);
      setMessages(m => [...m, {
        role: 'assistant',
        text: pretty
      }]);
    } catch {
      setMessages(m => [...m, {
        role: 'assistant',
        text: `Could not connect to the NestJS backend. Make sure ${API_BASE} is running and CORS is enabled.`
      }]);
    } finally {
      setLoading(false);
    }
  };
  const activeIcon = useMemo(() => navItems.find(([name]) => name === page)?.[1], [page]);
  return /*#__PURE__*/React.createElement("div", {
    className: "dashboard-app"
  }, /*#__PURE__*/React.createElement("aside", {
    className: `dashboard-sidebar ${mobileOpen ? 'mobile-visible' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-brand"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    className: "dashboard-logo-button"
  }, /*#__PURE__*/React.createElement(Logo, null)), /*#__PURE__*/React.createElement("span", null, "Banking AI Workspace")), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-nav-title"
  }, "WORKSPACE"), /*#__PURE__*/React.createElement("nav", null, navItems.map(([name, Icon]) => /*#__PURE__*/React.createElement("button", {
    key: name,
    className: page === name ? 'active' : '',
    onClick: () => {
      setPage(name);
      setMobileOpen(false);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 18
  }), name))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-side-bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "connection-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "connection-dot"
  }), " Backend connection", /*#__PURE__*/React.createElement("div", null, API_BASE)), /*#__PURE__*/React.createElement("button", {
    className: "back-landing",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    size: 16
  }), " Product overview"))), /*#__PURE__*/React.createElement("main", {
    className: "dashboard-main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "dashboard-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: "dashboard-menu",
    onClick: () => setMobileOpen(v => !v)
  }, mobileOpen ? /*#__PURE__*/React.createElement(X, null) : /*#__PURE__*/React.createElement(Menu, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, page), /*#__PURE__*/React.createElement("p", null, "Secure AI-powered banking workspace")), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-header-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "status-badge"
  }, /*#__PURE__*/React.createElement("span", null), " AI online"), /*#__PURE__*/React.createElement("div", {
    className: "avatar"
  }, "A"))), page === 'Dashboard' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    className: "dashboard-welcome"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "dashboard-eyebrow"
  }, "BANKING AI WORKSPACE"), /*#__PURE__*/React.createElement("h2", null, "Good to see you. What would you like to do?"), /*#__PURE__*/React.createElement("p", null, "Use the assistant below to interact with your banking services in natural language.")), /*#__PURE__*/React.createElement("button", {
    className: "overview-btn",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(ArrowLeft, {
    size: 16
  }), " Overview")), /*#__PURE__*/React.createElement("section", {
    className: "dashboard-cards"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card-icon"
  }, /*#__PURE__*/React.createElement(Wallet, {
    size: 18
  })), /*#__PURE__*/React.createElement("span", null, "Available Balance"), /*#__PURE__*/React.createElement("strong", null, "\u20B975,000"), /*#__PURE__*/React.createElement("small", null, "Account ACC001")), /*#__PURE__*/React.createElement("div", {
    className: "dash-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card-icon"
  }, /*#__PURE__*/React.createElement(ArrowLeftRight, {
    size: 18
  })), /*#__PURE__*/React.createElement("span", null, "Transactions"), /*#__PURE__*/React.createElement("strong", null, "4"), /*#__PURE__*/React.createElement("small", null, "Recent activity")), /*#__PURE__*/React.createElement("div", {
    className: "dash-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card-icon"
  }, /*#__PURE__*/React.createElement(Landmark, {
    size: 18
  })), /*#__PURE__*/React.createElement("span", null, "Active Loans"), /*#__PURE__*/React.createElement("strong", null, "1"), /*#__PURE__*/React.createElement("small", null, "Manage repayments")), /*#__PURE__*/React.createElement("div", {
    className: "dash-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dash-card-icon secure-card-icon"
  }, /*#__PURE__*/React.createElement(Shield, {
    size: 18
  })), /*#__PURE__*/React.createElement("span", null, "Security"), /*#__PURE__*/React.createElement("strong", {
    className: "green"
  }, "Protected"), /*#__PURE__*/React.createElement("small", null, "MFA enabled"))), /*#__PURE__*/React.createElement("section", {
    className: "dashboard-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dashboard-panel assistant-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "panel-kicker"
  }, "CONVERSATIONAL BANKING"), /*#__PURE__*/React.createElement("h2", null, "Banking AI Assistant"), /*#__PURE__*/React.createElement("p", null, "Ask questions or request a banking workflow using natural language.")), /*#__PURE__*/React.createElement("div", {
    className: "assistant-status"
  }, /*#__PURE__*/React.createElement(Bot, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, "Ready"))), /*#__PURE__*/React.createElement("div", {
    className: "chat-window"
  }, messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    className: `message-row ${m.role}`,
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-bubble"
  }, m.text.split('\n').map((line, j, arr) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: j
  }, line, j < arr.length - 1 && /*#__PURE__*/React.createElement("br", null)))))), loading && /*#__PURE__*/React.createElement("div", {
    className: "message-row assistant"
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-bubble typing"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-composer"
  }, /*#__PURE__*/React.createElement("input", {
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: e => e.key === 'Enter' && askAgent(),
    placeholder: "Ask: Show my balance / Transfer \u20B95,000 to John"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: askAgent,
    disabled: loading
  }, /*#__PURE__*/React.createElement(Send, {
    size: 17
  }))), /*#__PURE__*/React.createElement("div", {
    className: "suggestion-row"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setInput('Show my account balance')
  }, "Show balance"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setInput('Show my beneficiaries')
  }, "Beneficiaries"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setInput('Show my loans')
  }, "My loans"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setInput('Generate my statement')
  }, "Statement"))), /*#__PURE__*/React.createElement("div", {
    className: "dashboard-panel quick-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-heading simple"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "panel-kicker"
  }, "SHORTCUTS"), /*#__PURE__*/React.createElement("h2", null, "Quick Actions"), /*#__PURE__*/React.createElement("p", null, "Jump into a common banking workflow."))), /*#__PURE__*/React.createElement("div", {
    className: "quick-actions"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setInput('Transfer 5000 rupees to John');
      setPage('Dashboard');
    }
  }, /*#__PURE__*/React.createElement(ArrowLeftRight, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Transfer Money"), /*#__PURE__*/React.createElement("small", null, "Prepare a secure transfer")), /*#__PURE__*/React.createElement(ArrowRight, {
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('Accounts')
  }, /*#__PURE__*/React.createElement(Wallet, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "View Accounts"), /*#__PURE__*/React.createElement("small", null, "Balances and accounts")), /*#__PURE__*/React.createElement(ArrowRight, {
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('Loans')
  }, /*#__PURE__*/React.createElement(Landmark, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Manage Loans"), /*#__PURE__*/React.createElement("small", null, "Balance and payments")), /*#__PURE__*/React.createElement(ArrowRight, {
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('Statements')
  }, /*#__PURE__*/React.createElement(FileText, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Statements"), /*#__PURE__*/React.createElement("small", null, "Generate or view statements")), /*#__PURE__*/React.createElement(ArrowRight, {
    size: 16
  })))))) : /*#__PURE__*/React.createElement("section", {
    className: "dashboard-empty dashboard-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-icon"
  }, activeIcon && /*#__PURE__*/React.createElement(activeIcon, {
    size: 30
  })), /*#__PURE__*/React.createElement("span", {
    className: "panel-kicker"
  }, "BANKING MODULE"), /*#__PURE__*/React.createElement("h2", null, page), /*#__PURE__*/React.createElement("p", null, "This section is ready for connection to the corresponding NestJS API. The AI Assistant remains available from the Dashboard."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage('Dashboard')
  }, "Open AI Assistant ", /*#__PURE__*/React.createElement(ArrowRight, {
    size: 16
  })))));
}
export default App;