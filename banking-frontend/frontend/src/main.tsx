import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  Landmark,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Play,
  ReceiptText,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import './styles.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/banking-api';

type Message = { role: 'user' | 'assistant'; text: string };
type Page = 'Dashboard' | 'Accounts' | 'Transactions' | 'Beneficiaries' | 'Loans' | 'Statements' | 'Fraud & Risk' | 'Audit Logs';

const navItems: Array<[Page, React.ComponentType<{ size?: number }>]> = [
  ['Dashboard', LayoutDashboard],
  ['Accounts', Wallet],
  ['Transactions', ArrowLeftRight],
  ['Beneficiaries', Users],
  ['Loans', Landmark],
  ['Statements', FileText],
  ['Fraud & Risk', ShieldAlert],
  ['Audit Logs', ClipboardList],
];

function Logo({ className = '' }: { className?: string }) {
  return <img className={`site-logo ${className}`} src="/azentmart-ai-logo.png" alt="Azentmart AI" />;
}

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>(() => window.location.hash === '#dashboard' ? 'dashboard' : 'landing');

  const openDashboard = () => {
    window.location.hash = 'dashboard';
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLanding = () => {
    window.location.hash = '';
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onHashChange = () => setView(window.location.hash === '#dashboard' ? 'dashboard' : 'landing');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return view === 'dashboard' ? <Dashboard onBack={openLanding} /> : <Landing onLaunch={openDashboard} />;
}

function Landing({ onLaunch }: { onLaunch: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const goTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="nav-inner">
          <button className="brand-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Azentmart AI home">
            <Logo />
          </button>
          <nav className={`landing-links ${mobileOpen ? 'open' : ''}`}>
            <button onClick={() => goTo('how-it-works')}>How It Works</button>
            <button onClick={() => goTo('capabilities')}>Capabilities</button>
            <button onClick={() => goTo('benefits')}>Benefits</button>
            <button onClick={() => goTo('use-cases')}>Use Cases</button>
            <button onClick={() => goTo('security')}>Security</button>
            <button className="nav-dashboard" onClick={onLaunch}>Open Dashboard <ArrowRight size={15} /></button>
          </nav>
          <button className="menu-button" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> Intelligent Banking Operations</div>
              <h1>Banking intelligence that turns <span>questions into action.</span></h1>
              <p className="hero-description">
                A conversational AI banking workspace that helps teams understand accounts, transactions, beneficiaries, loans, statements and risk through one intelligent interface.
              </p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={onLaunch}>Launch Banking Agent <ArrowRight size={18} /></button>
                <button className="secondary-btn" onClick={() => goTo('how-it-works')}><Play size={16} /> See how it works</button>
              </div>
              <div className="hero-proof">
                <div><CheckCircle2 size={16} /><span>Natural-language banking</span></div>
                <div><CheckCircle2 size={16} /><span>Action-oriented workflows</span></div>
                <div><CheckCircle2 size={16} /><span>Risk-aware assistance</span></div>
              </div>
            </div>

            <div className="hero-visual" aria-label="Banking AI workflow preview">
              <div className="glow glow-one" />
              <div className="glow glow-two" />
              <div className="agent-card">
                <div className="agent-card-top">
                  <div className="mini-brand"><span className="mini-orb"><Sparkles size={16} /></span><div><b>Banking AI</b><small>Intelligent workspace</small></div></div>
                  <span className="online-dot">Live</span>
                </div>
                <div className="agent-chat">
                  <div className="chat-label">You</div>
                  <div className="preview-user">Show my account activity and flag anything unusual.</div>
                  <div className="chat-label assistant-label">Banking AI</div>
                  <div className="preview-ai"><div className="ai-title"><Bot size={16} /> Analysis ready</div><p>4 recent transactions reviewed. No unusual activity detected.</p><div className="mini-stats"><span><b>₹75K</b><small>Available</small></span><span><b>4</b><small>Transactions</small></span><span><b>Low</b><small>Risk</small></span></div></div>
                </div>
                <div className="preview-input"><span>Ask your banking assistant...</span><span className="send-pill"><Send size={14} /></span></div>
              </div>
              <div className="floating-card floating-secure"><Shield size={17} /><div><b>Protected workflow</b><small>Risk-aware processing</small></div></div>
              <div className="floating-card floating-analytics"><BarChart3 size={17} /><div><b>Smart insights</b><small>Understand activity faster</small></div></div>
            </div>
          </div>
          <div className="hero-line" />
        </section>

        <section className="intro-section section-shell">
          <div className="section-kicker">THE BANKING AI AGENT</div>
          <div className="two-column-intro">
            <h2>One intelligent layer for everyday banking operations.</h2>
            <p>
              Instead of navigating multiple banking screens for every question, users can describe what they need in plain language. The agent interprets the intent, works with the banking platform and returns a clear, useful response.
            </p>
          </div>
          <div className="stats-strip">
            <div><strong>01</strong><span>Ask naturally</span></div>
            <div><strong>02</strong><span>AI understands intent</span></div>
            <div><strong>03</strong><span>Banking workflow responds</span></div>
            <div><strong>04</strong><span>Get a clear result</span></div>
          </div>
        </section>

        <section id="how-it-works" className="dark-section section-anchor">
          <div className="section-shell">
            <div className="section-heading light-heading"><div><div className="section-kicker">HOW IT WORKS</div><h2>From a simple message to a banking action.</h2></div><p>The experience is designed around a simple flow: understand the request, connect it to the right banking capability, then present the result clearly.</p></div>
            <div className="flow-grid">
              <FlowStep number="01" icon={<MessageSquareText />} title="Ask" text="A user describes a banking need using everyday language." />
              <FlowStep number="02" icon={<Bot />} title="Understand" text="The AI interprets the intent and identifies the relevant banking workflow." />
              <FlowStep number="03" icon={<Zap />} title="Process" text="The platform uses the connected banking services to retrieve or prepare the requested result." />
              <FlowStep number="04" icon={<CheckCircle2 />} title="Respond" text="The user receives a concise answer, status, insight or next step." />
            </div>
          </div>
        </section>

        <section id="capabilities" className="section-shell capabilities-section section-anchor">
          <div className="section-heading"><div><div className="section-kicker">CAPABILITIES</div><h2>Built around the banking workflows that matter.</h2></div><p>Explore the same functional areas available in the existing Banking AI workspace.</p></div>
          <div className="capability-grid">
            <Capability icon={<Wallet />} title="Accounts" text="Understand balances and account-level information through conversational requests." />
            <Capability icon={<ArrowLeftRight />} title="Transactions" text="Review recent activity and get faster answers about transaction history." />
            <Capability icon={<Users />} title="Beneficiaries" text="Access beneficiary-related information without navigating complex menus." />
            <Capability icon={<Landmark />} title="Loans" text="Ask about loan information, repayments and related banking workflows." />
            <Capability icon={<ReceiptText />} title="Statements" text="Request statement-related information through natural language." />
            <Capability icon={<ShieldAlert />} title="Fraud & Risk" text="Surface risk-oriented insights and make unusual activity easier to investigate." />
          </div>
        </section>

        <section id="benefits" className="benefits-section section-anchor">
          <div className="section-shell">
            <div className="benefits-layout">
              <div className="benefit-copy"><div className="section-kicker">WHY IT MATTERS</div><h2>Less searching. More understanding.</h2><p>Banking workflows can be powerful without being complicated. The AI layer makes the experience more conversational, focused and easier to operate.</p><button className="text-btn" onClick={onLaunch}>Explore the workspace <ArrowRight size={16} /></button></div>
              <div className="benefit-list">
                <Benefit number="01" title="Faster access to information" text="Get useful banking answers without manually moving through multiple sections." />
                <Benefit number="02" title="A more natural user experience" text="Use everyday language instead of learning rigid navigation or command patterns." />
                <Benefit number="03" title="Better operational focus" text="Bring related banking capabilities into one consistent workspace." />
                <Benefit number="04" title="Actionable intelligence" text="Turn raw account activity into understandable status, insights and next steps." />
              </div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="section-shell use-case-section section-anchor">
          <div className="section-heading"><div><div className="section-kicker">USE CASES</div><h2>Useful across the banking journey.</h2></div><p>A single conversational layer can support customers, operations teams and decision-making workflows.</p></div>
          <div className="use-case-grid">
            <UseCase title="Customer assistance" text="Answer common banking questions and guide customers to the information they need." tag="CUSTOMER EXPERIENCE" />
            <UseCase title="Operations support" text="Help internal users quickly inspect account, transaction, loan and statement information." tag="OPERATIONS" />
            <UseCase title="Risk review" text="Support investigations by bringing activity and risk-oriented information into one conversation." tag="RISK & COMPLIANCE" />
          </div>
        </section>

        <section id="security" className="security-section section-anchor">
          <div className="section-shell security-card">
            <div className="security-icon"><Shield size={25} /></div>
            <div><div className="section-kicker">TRUST & CONTROL</div><h2>Designed for a responsible banking AI experience.</h2><p>The interface keeps banking actions and information inside a structured workspace, with clear status feedback and a dedicated risk area. Connect your production authentication, authorization and security controls to the backend when deploying.</p></div>
            <div className="security-points"><span><CheckCircle2 size={15} /> Structured banking workflows</span><span><CheckCircle2 size={15} /> Risk-aware experience</span><span><CheckCircle2 size={15} /> Clear action feedback</span></div>
          </div>
        </section>

        <section className="cta-section">
          <div className="section-shell cta-inner">
            <div><div className="section-kicker">READY TO EXPLORE</div><h2>See the Banking AI Agent in action.</h2><p>Move from the product overview into the working banking dashboard with one click.</p></div>
            <button className="primary-btn light-cta" onClick={onLaunch}>Open Banking Dashboard <ArrowRight size={18} /></button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-top"><Logo className="footer-logo" /><div className="footer-copy"><b>Banking AI Agent</b><span>Intelligent banking, designed around the way people ask.</span></div><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ChevronDown size={16} className="rotate-180" /></button></div>
        <div className="section-shell footer-bottom"><span>© {new Date().getFullYear()} Azentmart AI. Banking AI Platform.</span><span>AI-powered banking workspace</span></div>
      </footer>
    </div>
  );
}

function FlowStep({ number, icon, title, text }: { number: string; icon: React.ReactNode; title: string; text: string }) {
  return <div className="flow-step"><div className="flow-top"><span>{number}</span><div>{icon}</div></div><h3>{title}</h3><p>{text}</p></div>;
}

function Capability({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="capability-card"><div className="capability-icon">{icon}</div><h3>{title}</h3><p>{text}</p><span className="capability-arrow"><ArrowUpRightIcon /></span></article>;
}

function ArrowUpRightIcon() { return <ArrowRight size={16} />; }

function Benefit({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="benefit-item"><span className="benefit-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>;
}

function UseCase({ title, text, tag }: { title: string; text: string; tag: string }) {
  return <article className="use-case-card"><span>{tag}</span><h3>{title}</h3><p>{text}</p><ArrowRight size={18} /></article>;
}

function Dashboard({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: 'Hello! I’m your Banking AI assistant. Ask me about your balance, transactions, beneficiaries, loans, statements, or transfers.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<Page>('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email] = useState('admin@example.com');
  const [password] = useState('123456');

  const askAgent = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/ai-agent/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, message: text }),
      });
      const data = await response.json();
      const pretty = data.message
        ? `${data.message}${data.status ? `\n\nStatus: ${data.status}` : ''}${data.transferId ? `\nTransfer ID: ${data.transferId}` : ''}${data.riskLevel ? `\nRisk: ${data.riskLevel}` : ''}`
        : JSON.stringify(data, null, 2);
      setMessages((m) => [...m, { role: 'assistant', text: pretty }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: `Could not connect to the NestJS backend. Make sure ${API_BASE} is running and CORS is enabled.` }]);
    } finally {
      setLoading(false);
    }
  };

  const activeIcon = useMemo(() => navItems.find(([name]) => name === page)?.[1], [page]);

  return <div className="dashboard-app">
    <aside className={`dashboard-sidebar ${mobileOpen ? 'mobile-visible' : ''}`}>
      <div className="dashboard-brand"><button onClick={onBack} className="dashboard-logo-button"><Logo /></button><span>Banking AI Workspace</span></div>
      <div className="dashboard-nav-title">WORKSPACE</div>
      <nav>{navItems.map(([name, Icon]) => <button key={name} className={page === name ? 'active' : ''} onClick={() => { setPage(name); setMobileOpen(false); }}><Icon size={18} />{name}</button>)}</nav>
      <div className="dashboard-side-bottom"><div className="connection-card"><span className="connection-dot" /> Backend connection<div>{API_BASE}</div></div><button className="back-landing" onClick={onBack}><ArrowLeft size={16} /> Product overview</button></div>
    </aside>
    <main className="dashboard-main">
      <header className="dashboard-header"><button className="dashboard-menu" onClick={() => setMobileOpen((v) => !v)}>{mobileOpen ? <X /> : <Menu />}</button><div><h1>{page}</h1><p>Secure AI-powered banking workspace</p></div><div className="dashboard-header-right"><span className="status-badge"><span /> AI online</span><div className="avatar">A</div></div></header>
      {page === 'Dashboard' ? <>
        <section className="dashboard-welcome"><div><span className="dashboard-eyebrow">BANKING AI WORKSPACE</span><h2>Good to see you. What would you like to do?</h2><p>Use the assistant below to interact with your banking services in natural language.</p></div><button className="overview-btn" onClick={onBack}><ArrowLeft size={16} /> Overview</button></section>
        <section className="dashboard-cards"><div className="dash-card"><div className="dash-card-icon"><Wallet size={18} /></div><span>Available Balance</span><strong>₹75,000</strong><small>Account ACC001</small></div><div className="dash-card"><div className="dash-card-icon"><ArrowLeftRight size={18} /></div><span>Transactions</span><strong>4</strong><small>Recent activity</small></div><div className="dash-card"><div className="dash-card-icon"><Landmark size={18} /></div><span>Active Loans</span><strong>1</strong><small>Manage repayments</small></div><div className="dash-card"><div className="dash-card-icon secure-card-icon"><Shield size={18} /></div><span>Security</span><strong className="green">Protected</strong><small>MFA enabled</small></div></section>
        <section className="dashboard-grid"><div className="dashboard-panel assistant-panel"><div className="panel-heading"><div><span className="panel-kicker">CONVERSATIONAL BANKING</span><h2>Banking AI Assistant</h2><p>Ask questions or request a banking workflow using natural language.</p></div><div className="assistant-status"><Bot size={20} /><span>Ready</span></div></div><div className="chat-window">{messages.map((m, i) => <div className={`message-row ${m.role}`} key={i}><div className="message-bubble">{m.text.split('\n').map((line, j, arr) => <React.Fragment key={j}>{line}{j < arr.length - 1 && <br />}</React.Fragment>)}</div></div>)}{loading && <div className="message-row assistant"><div className="message-bubble typing"><span /><span /><span /></div></div>}</div><div className="dashboard-composer"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && askAgent()} placeholder="Ask: Show my balance / Transfer ₹5,000 to John" /><button onClick={askAgent} disabled={loading}><Send size={17} /></button></div><div className="suggestion-row"><button onClick={() => setInput('Show my account balance')}>Show balance</button><button onClick={() => setInput('Show my beneficiaries')}>Beneficiaries</button><button onClick={() => setInput('Show my loans')}>My loans</button><button onClick={() => setInput('Generate my statement')}>Statement</button></div></div>
        <div className="dashboard-panel quick-panel"><div className="panel-heading simple"><div><span className="panel-kicker">SHORTCUTS</span><h2>Quick Actions</h2><p>Jump into a common banking workflow.</p></div></div><div className="quick-actions"><button onClick={() => { setInput('Transfer 5000 rupees to John'); setPage('Dashboard'); }}><ArrowLeftRight /><span><b>Transfer Money</b><small>Prepare a secure transfer</small></span><ArrowRight size={16} /></button><button onClick={() => setPage('Accounts')}><Wallet /><span><b>View Accounts</b><small>Balances and accounts</small></span><ArrowRight size={16} /></button><button onClick={() => setPage('Loans')}><Landmark /><span><b>Manage Loans</b><small>Balance and payments</small></span><ArrowRight size={16} /></button><button onClick={() => setPage('Statements')}><FileText /><span><b>Statements</b><small>Generate or view statements</small></span><ArrowRight size={16} /></button></div></div></section>
      </> : <section className="dashboard-empty dashboard-panel"><div className="empty-icon">{activeIcon && React.createElement(activeIcon, { size: 30 })}</div><span className="panel-kicker">BANKING MODULE</span><h2>{page}</h2><p>This section is ready for connection to the corresponding NestJS API. The AI Assistant remains available from the Dashboard.</p><button onClick={() => setPage('Dashboard')}>Open AI Assistant <ArrowRight size={16} /></button></section>}
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
