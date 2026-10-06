import React, { useState } from "react";
import {
  ArrowUpRight, Bot, BrainCircuit, ChevronRight, CircleDollarSign,
  FileText, LineChart, Menu, MessageSquareText, Play, Search,
  ShieldCheck, Sparkles, TrendingDown, TrendingUp, Upload, X,
  Zap, BarChart3, WalletCards, Activity, SlidersHorizontal
} from "lucide-react";

const agents = [
  { name: "Financial Analyst", desc: "Explains performance, margins and business drivers.", icon: BarChart3, tone: "blue", status: "Active" },
  { name: "Cash Flow Agent", desc: "Tracks liquidity, inflows, outflows and runway.", icon: WalletCards, tone: "violet", status: "Watching" },
  { name: "Expense Intelligence", desc: "Finds unusual spend and recurring cost patterns.", icon: Search, tone: "cyan", status: "Active" },
  { name: "Forecast Agent", desc: "Builds scenario-based revenue and expense forecasts.", icon: LineChart, tone: "green", status: "Ready" },
  { name: "Reconciliation Agent", desc: "Checks records and flags mismatches for review.", icon: ShieldCheck, tone: "amber", status: "Ready" },
  { name: "Reporting Agent", desc: "Turns finance data into decision-ready reports.", icon: FileText, tone: "pink", status: "Ready" }
];

const metrics = [
  { label: "Revenue", value: "₹1.24 Cr", change: "+8.2%", positive: true },
  { label: "Operating spend", value: "₹78.4 L", change: "+3.1%", positive: false },
  { label: "Net margin", value: "36.8%", change: "+2.4%", positive: true },
  { label: "Cash position", value: "₹42.8 L", change: "+12.4%", positive: true }
];

function Logo({ compact = false }) {
  return (
    <a className={`brand ${compact ? "brand-compact" : ""}`} href="#top" aria-label="AzentMart AI">
      <img src="/azentmart-ai-logo.png" alt="azentmart AI" />
    </a>
  );
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

  return (
    <div className="app" id="top">
      <div className="noise" />
      <header className="topbar">
        <Logo />
        <div className="product-pill"><span className="live-dot" /> Finance AI</div>
        <nav className={mobileOpen ? "nav open" : "nav"}>
          <a href="#command">Command Center</a>
          <a href="#agents">AI Workforce</a>
          <a href="#intelligence">Intelligence</a>
          <a href="#reports">Reports</a>
          <a href="#integrations">Integrations</a>
        </nav>
        <div className="top-actions">
          <button className="icon-button" aria-label="Search"><Search size={18}/></button>
          <button className="outline-button" onClick={() => document.getElementById("workspace")?.scrollIntoView({behavior:"smooth"})}>Open workspace</button>
          <button className="menu-button" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
            {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={14}/> AUTONOMOUS FINANCE WORKSPACE</div>
              <h1>Numbers in.<br/><span>Decisions out.</span></h1>
              <p className="hero-lede">
                A financial intelligence layer that watches performance, explains changes,
                finds anomalies and turns your finance data into actions.
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => document.getElementById("workspace")?.scrollIntoView({behavior:"smooth"})}>
                  Launch Finance AI <ArrowUpRight size={18}/>
                </button>
                <button className="ghost-button" onClick={() => document.getElementById("agents")?.scrollIntoView({behavior:"smooth"})}>
                  <Play size={16} fill="currentColor"/> Explore agents
                </button>
              </div>
              <div className="hero-trust">
                <span><ShieldCheck size={15}/> Explainable insights</span>
                <span><Zap size={15}/> Continuous monitoring</span>
                <span><CircleDollarSign size={15}/> Finance-first workflows</span>
              </div>
            </div>

            <div className="hero-orbit">
              <div className="orbital-ring ring-one"/>
              <div className="orbital-ring ring-two"/>
              <div className="finance-core">
                <div className="core-top"><span>FINANCE AI CORE</span><span className="status"><i/> LIVE</span></div>
                <div className="core-number">₹42.8L</div>
                <div className="core-label">available cash position</div>
                <div className="sparkline">
                  {[34,48,42,59,52,67,62,78,72,86,81,94].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}
                </div>
                <div className="core-foot"><span>Cash flow health</span><b>Healthy</b></div>
              </div>
              <div className="float-card insight"><Sparkles size={16}/><div><b>Insight detected</b><small>Marketing spend is trending 18% higher.</small></div></div>
              <div className="float-card received"><CircleDollarSign size={16}/><div><b>₹7.85L received</b><small>3 payments reconciled</small></div></div>
              <div className="float-card agent"><Bot size={16}/><div><b>Agent working</b><small>Investigating expense variance</small></div><span className="pulse"/></div>
            </div>
          </div>
        </section>

        <section className="metric-strip" id="command">
          {metrics.map((m) => (
            <div className="metric" key={m.label}>
              <span>{m.label}</span><strong>{m.value}</strong>
              <small className={m.positive ? "up" : "down"}>{m.positive ? <TrendingUp size={13}/> : <TrendingDown size={13}/>} {m.change}</small>
            </div>
          ))}
          <div className="metric-note"><Activity size={16}/><span>AI is monitoring 126 financial signals</span></div>
        </section>

        <section className="section workspace-section" id="workspace">
          <div className="section-heading">
            <div><div className="eyebrow">FINANCE COMMAND CENTER</div><h2>Your finance team, in one workspace.</h2></div>
            <div className="section-caption">Ask questions. Investigate changes. Run agents.</div>
          </div>

          <div className="workspace-card">
            <aside className="workspace-sidebar">
              <div className="side-label">Workspace</div>
              <button className="side-item active"><BarChart3 size={17}/> Overview</button>
              <button className="side-item"><Activity size={17}/> Activity</button>
              <button className="side-item"><WalletCards size={17}/> Cash flow</button>
              <button className="side-item"><FileText size={17}/> Reports</button>
              <button className="side-item"><SlidersHorizontal size={17}/> Controls</button>
              <div className="side-divider"/>
              <div className="side-label">AI agents</div>
              {agents.slice(0,4).map(a => {
                const Icon = a.icon;
                return <button key={a.name} className="side-agent"><span className={`mini-icon ${a.tone}`}><Icon size={13}/></span>{a.name.replace(" Agent","")}</button>
              })}
            </aside>

            <div className="workspace-main">
              <div className="workspace-toolbar">
                <div><span className="crumb">Finance /</span> Overview</div>
                <div className="toolbar-actions"><span className="period">Last 30 days <ChevronRight size={14}/></span><button className="tiny-button"><Upload size={14}/> Import</button></div>
              </div>
              <div className="dash-grid">
                <div className="dash-card wide">
                  <div className="dash-head"><div><span>Revenue performance</span><b>₹1.24 Cr</b></div><small className="up">+8.2% vs previous period</small></div>
                  <div className="chart">
                    <div className="chart-y"><span>1.4Cr</span><span>1Cr</span><span>60L</span><span>20L</span></div>
                    <svg viewBox="0 0 720 220" preserveAspectRatio="none" aria-label="Revenue trend">
                      <defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#426bff" stopOpacity=".30"/><stop offset="1" stopColor="#426bff" stopOpacity="0"/></linearGradient></defs>
                      <path d="M0 176 C55 160 70 172 112 142 S175 146 214 119 S274 132 316 91 S378 111 420 80 S483 102 526 61 S584 76 624 48 S676 56 720 28 L720 220 L0 220 Z" fill="url(#fill)"/>
                      <path d="M0 176 C55 160 70 172 112 142 S175 146 214 119 S274 132 316 91 S378 111 420 80 S483 102 526 61 S584 76 624 48 S676 56 720 28" fill="none" stroke="#5d7cff" strokeWidth="4"/>
                    </svg>
                    <div className="chart-x"><span>01</span><span>07</span><span>14</span><span>21</span><span>30</span></div>
                  </div>
                </div>

                <div className="dash-card insight-card">
                  <div className="ai-badge"><Sparkles size={14}/> AI INSIGHT</div>
                  <h3>Expense variance detected</h3>
                  <p>Infrastructure costs are 11.4% above the expected run-rate. The agent found 3 contributing vendors.</p>
                  <button className="text-button">Investigate <ArrowUpRight size={15}/></button>
                </div>

                <div className="dash-card activity-card">
                  <div className="dash-head"><span>Agent activity</span><span className="live-label"><i/> live</span></div>
                  {[
                    ["Financial Analyst","Explained margin movement","2m ago","blue"],
                    ["Cash Flow Agent","Updated 30-day forecast","8m ago","violet"],
                    ["Expense Intelligence","Flagged vendor variance","14m ago","cyan"]
                  ].map(([name,desc,time,tone]) => (
                    <div className="activity-row" key={name}><span className={`activity-dot ${tone}`}/><div><b>{name}</b><small>{desc}</small></div><time>{time}</time></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section agents-section" id="agents">
          <div className="section-heading centered">
            <div><div className="eyebrow">AI WORKFORCE</div><h2>Specialists for every finance workflow.</h2></div>
            <p>Activate agents independently or let them collaborate across your finance operations.</p>
          </div>
          <div className="agent-grid">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const active = activeAgent === agent.name;
              return (
                <button className={`agent-card ${active ? "selected" : ""}`} key={agent.name} onClick={() => setActiveAgent(agent.name)}>
                  <div className="agent-card-top"><span className={`agent-icon ${agent.tone}`}><Icon size={20}/></span><span className="agent-status"><i/>{agent.status}</span></div>
                  <h3>{agent.name}</h3><p>{agent.desc}</p>
                  <span className="agent-link">Open agent <ArrowUpRight size={15}/></span>
                </button>
              );
            })}
          </div>
          <div className="agent-console">
            <div className="console-label"><Bot size={16}/> ACTIVE AGENT</div>
            <div><b>{activeAgent}</b><span>Ready to analyze your finance workspace.</span></div>
            <button className="primary-small">Open workspace <ArrowUpRight size={15}/></button>
          </div>
        </section>

        <section className="section intelligence-section" id="intelligence">
          <div className="intelligence-grid">
            <div>
              <div className="eyebrow">ASK FINANCE AI</div>
              <h2>Talk to your numbers like a finance analyst.</h2>
              <p>Ask a plain-language question and the agent can trace the underlying signals, explain the result and point you to the next action.</p>
              <div className="query-box">
                <MessageSquareText size={19}/>
                <input value={query} onChange={e=>{setQuery(e.target.value);setSubmitted(false)}} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="Why did our expenses increase this month?" />
                <button onClick={ask}><ArrowUpRight size={17}/></button>
              </div>
              <div className="suggested"><span>Try:</span><button onClick={()=>setQuery("Why did our expenses increase this month?")}>Expense variance</button><button onClick={()=>setQuery("What is our cash runway?")}>Cash runway</button><button onClick={()=>setQuery("Show our revenue trend")}>Revenue trend</button></div>
              {submitted && <div className="answer"><div className="answer-icon"><Sparkles size={17}/></div><div><b>Finance AI</b><p>Expenses increased primarily from infrastructure and marketing. I found three material changes and can open the supporting transactions.</p><button className="text-button">View analysis <ArrowUpRight size={14}/></button></div></div>}
            </div>
            <div className="signal-panel">
              <div className="signal-head"><span>LIVE SIGNALS</span><span><i/> 126 monitored</span></div>
              <div className="signal-big"><strong>18</strong><span>signals changed<br/>in the last 24h</span></div>
              <div className="signal-bars">{[42,60,50,72,64,88,74,92,68,84,78,96].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div>
              <div className="signal-list"><span><i className="green-dot"/>Positive movement <b>+12</b></span><span><i className="amber-dot"/>Needs review <b>4</b></span><span><i className="red-dot"/>Anomalies <b>2</b></span></div>
            </div>
          </div>
        </section>

        <section className="section report-section" id="reports">
          <div className="report-panel">
            <div className="report-copy">
              <div className="eyebrow">DECISION-READY REPORTING</div>
              <h2>From raw transactions to a clear financial story.</h2>
              <p>Generate executive summaries, variance explanations, forecast narratives and audit-ready activity trails from the same finance workspace.</p>
              <button className="primary-button">Generate a report <ArrowUpRight size={18}/></button>
            </div>
            <div className="report-preview">
              <div className="report-top"><span>MONTHLY FINANCE BRIEF</span><span>SEP 2026</span></div>
              <h3>Business performance is improving</h3>
              <div className="report-row"><span>Revenue</span><b>₹1.24 Cr</b><em>+8.2%</em></div>
              <div className="report-row"><span>Operating spend</span><b>₹78.4 L</b><em className="warn">+3.1%</em></div>
              <div className="report-row"><span>Net margin</span><b>36.8%</b><em>+2.4%</em></div>
              <div className="report-note"><Sparkles size={15}/><span>AI summary: Margin expanded as revenue growth outpaced operating spend.</span></div>
            </div>
          </div>
        </section>

        <section className="section integrations-section" id="integrations">
          <div className="section-heading centered"><div><div className="eyebrow">CONNECT YOUR STACK</div><h2>One intelligence layer across finance data.</h2></div><p>Designed to sit above your existing systems instead of replacing them.</p></div>
          <div className="integration-row">
            {["ERP / Accounting","Banking data","Spreadsheets","CRM / Sales","Payroll","Data warehouse"].map((x,i)=><div className="integration-chip" key={x}><span>{String(i+1).padStart(2,"0")}</span>{x}</div>)}
          </div>
        </section>

        <section className="final-cta">
          <div className="cta-glow"/>
          <div className="eyebrow">THE FINANCE AI LAYER</div>
          <h2>Let your finance data<br/><span>do more work.</span></h2>
          <p>Bring analysis, monitoring, forecasting and reporting into one intelligent workspace.</p>
          <button className="primary-button">Launch Finance AI <ArrowUpRight size={18}/></button>
        </section>
      </main>

      <footer>
        <div className="footer-main">
          <Logo compact/>
          <span className="footer-product">Finance AI / Intelligent financial operations</span>
          <div className="footer-links"><a href="#command">Workspace</a><a href="#agents">Agents</a><a href="#reports">Reports</a><a href="#integrations">Integrations</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 AzentMart AI. All rights reserved.</span><span>Finance intelligence, designed for teams.</span></div>
      </footer>
    </div>
  );
}

export default App;