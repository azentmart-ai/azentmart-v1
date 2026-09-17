import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./style.css";

const API = "http://localhost:8001";

function MarkdownContent({ children }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}

function App() {
  // ============================================================
  // JWT / USER STATE
  // ============================================================

  const [token, setToken] = useState(
    localStorage.getItem("access_token") || ""
  );

  const [tenant, setTenant] = useState(
    localStorage.getItem("tenant") || ""
  );

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("user_email") || ""
  );

  // ============================================================
  // LOGIN STATE
  // ============================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ============================================================
  // REGISTER STATE
  // ============================================================

  const [authMode, setAuthMode] = useState("login");
  const [companyName, setCompanyName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // ============================================================
  // CAMPAIGN STATE
  // ============================================================

  const [name, setName] = useState("");
  const [task, setTask] = useState("");
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  /*
   * "full" = complete 8-agent campaign
   * otherwise = individual AI Employee
   */
  const [selectedAgent, setSelectedAgent] = useState("full");

  const [activeTab, setActiveTab] = useState("final");

  // ============================================================
  // MARKETING AI EMPLOYEES
  // ============================================================

  const marketingEmployees = [
    {
      id: "strategy",
      icon: "🧠",
      name: "AI Marketing Employee",
      shortName: "Marketing / Strategy",
      description: "Marketing workflows & strategy"
    },
    {
      id: "content",
      icon: "✍️",
      name: "AI Content Employee",
      shortName: "Content",
      description: "Blogs, copy & content ideas"
    },
    {
      id: "social_media",
      icon: "📱",
      name: "AI Social Media Employee",
      shortName: "Social Media",
      description: "Social content & engagement"
    },
    {
      id: "seo",
      icon: "🔎",
      name: "AI SEO Employee",
      shortName: "SEO",
      description: "Keywords & search optimization"
    },
    {
      id: "ads",
      icon: "📣",
      name: "AI Ads Employee",
      shortName: "Ads",
      description: "Paid search & ad messaging"
    },
    {
      id: "email",
      icon: "📧",
      name: "AI Email Marketing Employee",
      shortName: "Email Marketing",
      description: "Email campaigns & personalization"
    },
    {
      id: "market_research",
      icon: "📊",
      name: "AI Market Research Employee",
      shortName: "Market Research",
      description: "Customer & competitor research"
    },
    {
      id: "campaign_analyst",
      icon: "📈",
      name: "AI Campaign Analyst",
      shortName: "Campaign Analyst",
      description: "Campaign performance & optimization"
    }
  ];

  // ============================================================
  // QUICK PRESETS
  // ============================================================

  const presets = [
    {
      title: "🎧 AirPods Pro 2",
      prompt:
        "Launch campaign for Apple AirPods Pro 2 targeting tech-savvy commuters and fitness enthusiasts."
    },
    {
      title: "💻 Custom Gaming PC",
      prompt:
        "Multi-channel marketing campaign for high-performance custom liquid-cooled PC targeting gamers and 3D animators."
    },
    {
      title: "📱 iPhone 16 Pro",
      prompt:
        "Launch campaign for iPhone 16 Pro targeting creative professionals, videographers, and corporate leaders."
    },
    {
      title: "⚡ Enterprise AI SaaS",
      prompt:
        "B2B go-to-market plan for AI workflow automation platform targeting CTOs and Engineering Managers."
    }
  ];

  // ============================================================
  // SELECT AI EMPLOYEE
  // ============================================================

  function selectAgent(agentId) {
    setSelectedAgent(agentId);
    setOut(null);

    /*
     * Individual agents show their own output.
     * Full campaign shows the integrated campaign tabs.
     */
    if (agentId === "full") {
      setActiveTab("final");
    } else {
      setActiveTab("employee");
    }
  }

  // ============================================================
  // JWT LOGIN
  // ============================================================

  async function login() {
    if (!email.trim()) {
      return alert("Enter your email");
    }

    if (!password.trim()) {
      return alert("Enter your password");
    }

    setLoginLoading(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "tenant",
        data.tenant_id
      );

      localStorage.setItem(
        "user_email",
        data.email
      );

      setToken(data.access_token);
      setTenant(data.tenant_id);
      setUserEmail(data.email);

      setEmail("");
      setPassword("");

      alert("Login successful!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoginLoading(false);
    }
  }

  // ============================================================
  // CREATE ACCOUNT / REGISTER
  // ============================================================

  async function register() {
    if (!companyName.trim()) {
      return alert("Enter your company or workspace name");
    }

    if (!registerEmail.trim()) {
      return alert("Enter your email");
    }

    if (!registerPassword.trim()) {
      return alert("Enter your password");
    }

    if (registerPassword.length < 8) {
      return alert(
        "Password must contain at least 8 characters"
      );
    }

    if (registerPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    setRegisterLoading(true);

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_name: companyName.trim(),
          email: registerEmail.trim(),
          password: registerPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail || "Registration failed"
        );
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "tenant",
        data.tenant_id
      );

      localStorage.setItem(
        "user_email",
        data.email
      );

      setToken(data.access_token);
      setTenant(data.tenant_id);
      setUserEmail(data.email);

      setCompanyName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");

      alert("Account created successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setRegisterLoading(false);
    }
  }

  // ============================================================
  // AUTHENTICATED API HEADERS
  // ============================================================

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  // ============================================================
  // CREATE TENANT
  // ============================================================

  async function createTenant() {
    if (!name.trim()) {
      return alert("Enter workspace name");
    }

    try {
      const res = await fetch(`${API}/tenants`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name: name.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.detail || "Failed to create tenant"
        );
      }

      setTenant(data.tenant_id);

      localStorage.setItem(
        "tenant",
        data.tenant_id
      );

      setName("");
    } catch (err) {
      alert(err.message);
    }
  }

  // ============================================================
  // RUN MARKETING AGENT
  // ============================================================

  async function runMarketingAgent() {
    if (!task.trim()) {
      return alert("Please enter campaign prompt");
    }

    if (!token) {
      return alert("Please login first");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          task: task.trim(),

          /*
           * Full campaign:
           *   agent = null
           *
           * Individual employee:
           *   agent = selected employee id
           */
          agent:
            selectedAgent === "full"
              ? null
              : selectedAgent
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          logout();

          throw new Error(
            "Session expired. Please login again."
          );
        }

        throw new Error(
          data.detail || "Execution failed"
        );
      }

      setOut(data);

      if (selectedAgent === "full") {
        setActiveTab("final");
      } else {
        setActiveTab("employee");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("tenant");
    localStorage.removeItem("user_email");

    setToken("");
    setTenant("");
    setUserEmail("");

    setEmail("");
    setPassword("");

    setCompanyName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");

    setName("");
    setTask("");
    setOut(null);

    setSelectedAgent("full");
    setActiveTab("final");
    setAuthMode("login");
  }

  // ============================================================
  // RESET / SWITCH WORKSPACE
  // ============================================================

  function resetTenant() {
    localStorage.removeItem("tenant");

    setTenant("");
    setName("");
    setTask("");
    setOut(null);

    setSelectedAgent("full");
    setActiveTab("final");
  }

  // ============================================================
  // COPY CURRENT OUTPUT
  // ============================================================

  async function copyCurrentOutput() {
    if (!out) {
      return;
    }

    let text = "";

    if (selectedAgent !== "full") {
      text = out.output || "";
    } else if (activeTab === "mcp") {
      text = JSON.stringify(
        out.mcp_campaign_brief || {},
        null,
        2
      );
    } else {
      text =
        out[activeTab] ||
        out.final ||
        "";
    }

    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      alert("Unable to copy output.");
    }
  }

  // ============================================================
  // CURRENT EMPLOYEE
  // ============================================================

  const currentEmployee =
    marketingEmployees.find(
      (employee) =>
        employee.id === selectedAgent
    );

  // ============================================================
  // AUTH SCREEN
  // ============================================================

  if (!token) {
    return (
      <div className="app-shell">
        <main
          className="canvas"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh"
          }}
        >
          <div
            className="sidebar-card"
            style={{
              width: "380px",
              maxWidth: "90%",
              padding: "28px"
            }}
          >
            {/* BRAND */}

            <div
              style={{
                textAlign: "center",
                marginBottom: "25px"
              }}
            >
              <div
                className="brand-icon"
                style={{
                  margin: "0 auto 12px"
                }}
              >
                ⚡
              </div>

              <h1
                style={{
                  color: "#fff",
                  margin: "0 0 5px"
                }}
              >
                Nexus Studio
              </h1>

              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px"
                }}
              >
                Enterprise AI Suite
              </span>
            </div>

            {/* LOGIN */}

            {authMode === "login" && (
              <>
                <span className="control-title">
                  🔐 Secure Login
                </span>

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    margin: "7px 0 18px"
                  }}
                >
                  Sign in to access your isolated
                  Marketing AI workspace.
                </p>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 12px",
                    background: "var(--bg-input)",
                    border:
                      "1px solid var(--border-sheet)",
                    borderRadius: "6px",
                    color: "#fff",
                    marginBottom: "10px",
                    fontFamily: "inherit"
                  }}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      login();
                    }
                  }}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 12px",
                    background: "var(--bg-input)",
                    border:
                      "1px solid var(--border-sheet)",
                    borderRadius: "6px",
                    color: "#fff",
                    marginBottom: "14px",
                    fontFamily: "inherit"
                  }}
                />

                <button
                  onClick={login}
                  disabled={loginLoading}
                  className="btn-trigger"
                  style={{
                    width: "100%"
                  }}
                >
                  {loginLoading
                    ? "Authenticating..."
                    : "Login →"}
                </button>

                <button
                  onClick={() =>
                    setAuthMode("register")
                  }
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "10px",
                    background:
                      "rgba(255,255,255,0.04)",
                    border:
                      "1px solid var(--border-sheet)",
                    borderRadius: "6px",
                    color: "var(--accent-cyan)",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 700
                  }}
                >
                  Create New Account
                </button>

                <div
                  style={{
                    marginTop: "16px",
                    padding: "10px",
                    borderRadius: "6px",
                    background:
                      "rgba(255,255,255,0.03)",
                    color: "var(--text-muted)",
                    fontSize: "10px",
                    lineHeight: "1.5"
                  }}
                >
                  JWT authentication protects your
                  tenant data and API requests.
                </div>
              </>
            )}

            {/* REGISTER */}

            {authMode === "register" && (
              <>
                <span className="control-title">
                  🚀 Create Account
                </span>

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    margin: "7px 0 18px"
                  }}
                >
                  Create a new company workspace.
                  A unique tenant will be created
                  automatically.
                </p>

                <input
                  type="text"
                  placeholder="Company / Workspace Name"
                  value={companyName}
                  onChange={(e) =>
                    setCompanyName(e.target.value)
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 12px",
                    background: "var(--bg-input)",
                    border:
                      "1px solid var(--border-sheet)",
                    borderRadius: "6px",
                    color: "#fff",
                    marginBottom: "10px",
                    fontFamily: "inherit"
                  }}
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) =>
                    setRegisterEmail(e.target.value)
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 12px",
                    background: "var(--bg-input)",
                    border:
                      "1px solid var(--border-sheet)",
                    borderRadius: "6px",
                    color: "#fff",
                    marginBottom: "10px",
                    fontFamily: "inherit"
                  }}
                />

                <input
                  type="password"
                  placeholder="Password (minimum 8 characters)"
                  value={registerPassword}
                  onChange={(e) =>
                    setRegisterPassword(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 12px",
                    background: "var(--bg-input)",
                    border:
                      "1px solid var(--border-sheet)",
                    borderRadius: "6px",
                    color: "#fff",
                    marginBottom: "10px",
                    fontFamily: "inherit"
                  }}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      register();
                    }
                  }}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 12px",
                    background: "var(--bg-input)",
                    border:
                      "1px solid var(--border-sheet)",
                    borderRadius: "6px",
                    color: "#fff",
                    marginBottom: "14px",
                    fontFamily: "inherit"
                  }}
                />

                <button
                  onClick={register}
                  disabled={registerLoading}
                  className="btn-trigger"
                  style={{
                    width: "100%"
                  }}
                >
                  {registerLoading
                    ? "Creating Account..."
                    : "Create Account →"}
                </button>

                <button
                  onClick={() =>
                    setAuthMode("login")
                  }
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "10px",
                    background:
                      "rgba(255,255,255,0.04)",
                    border:
                      "1px solid var(--border-sheet)",
                    borderRadius: "6px",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 700
                  }}
                >
                  ← Back to Login
                </button>

                <div
                  style={{
                    marginTop: "16px",
                    padding: "10px",
                    borderRadius: "6px",
                    background:
                      "rgba(255,255,255,0.03)",
                    color: "var(--text-muted)",
                    fontSize: "10px",
                    lineHeight: "1.5"
                  }}
                >
                  Your company receives a unique
                  tenant ID and isolated workspace.
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // MAIN APPLICATION
  // ============================================================

  return (
    <div className="app-shell">

      {/* ========================================================
          LEFT COMMAND CONSOLE
      ======================================================== */}

      <aside className="sidebar">

        {/* HEADER */}

        <div className="sidebar-header">
          <div className="brand-wrapper">

            <div className="brand-icon">
              ⚡
            </div>

            <div className="brand-info">
              <h1>Azentmart AI</h1>
              <span>Enterprise AI Suite</span>
            </div>

          </div>
        </div>

        <div className="sidebar-content">

          {/* ====================================================
              ACTIVE TENANT
          ==================================================== */}

          {!tenant ? (
            <div className="sidebar-card">

              <span className="control-title">
                Initialize Tenant
              </span>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  margin: "6px 0 12px"
                }}
              >
                Boot an isolated tenant container
                with pgvector memory.
              </p>

              <input
                type="text"
                placeholder="Workspace / Brand Name..."
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  background: "var(--bg-input)",
                  border:
                    "1px solid var(--border-sheet)",
                  borderRadius: "6px",
                  color: "#fff",
                  marginBottom: "10px",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />

              <button
                onClick={createTenant}
                className="btn-trigger"
                style={{
                  padding: "10px"
                }}
              >
                Boot Workspace →
              </button>

            </div>
          ) : (
            <div className="sidebar-card">

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px"
                }}
              >
                <span
                  className="control-title"
                  style={{
                    margin: 0
                  }}
                >
                  Active Tenant
                </span>

                <button
                  onClick={resetTenant}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent-cyan)",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 700
                  }}
                >
                  SWITCH
                </button>
              </div>

              <div className="tenant-box">
                <span>
                  {tenant.slice(0, 10)}
                  ...
                  {tenant.slice(-6)}
                </span>

                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--accent-emerald)",
                    fontWeight: 700
                  }}
                >
                  ● ONLINE
                </span>
              </div>

              <div
                style={{
                  marginTop: "9px",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                👤 {userEmail}
              </div>

              <button
                onClick={logout}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "7px",
                  background:
                    "rgba(255,255,255,0.04)",
                  border:
                    "1px solid var(--border-sheet)",
                  borderRadius: "5px",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontWeight: 700
                }}
              >
                LOGOUT
              </button>

            </div>
          )}

          {/* ====================================================
              CAMPAIGN CONTROLS
          ==================================================== */}

          {tenant && (
            <>
              {/* CAMPAIGN OBJECTIVE */}

              <div>
                <span className="control-title">
                  🎯 Campaign Objective
                </span>

                <textarea
                  className="textarea-field"
                  placeholder="Describe product, key messaging, target demographic, or promotions..."
                  value={task}
                  onChange={(e) =>
                    setTask(e.target.value)
                  }
                />
              </div>

              {/* =================================================
                  AI EMPLOYEE SELECTOR
              ================================================= */}

              <div style={{ marginTop: "18px" }}>

                <span className="control-title">
                  🤖 Marketing AI Employees
                </span>

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "10px",
                    lineHeight: "1.5",
                    margin: "5px 0 10px"
                  }}
                >
                  Select one specialized employee for
                  a focused task, or run the complete
                  campaign swarm.
                </p>

                {/* FULL CAMPAIGN */}

                <button
                  onClick={() =>
                    selectAgent("full")
                  }
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "11px",
                    marginBottom: "7px",
                    borderRadius: "7px",
                    cursor: "pointer",
                    background:
                      selectedAgent === "full"
                        ? "rgba(0, 220, 255, 0.12)"
                        : "rgba(255,255,255,0.03)",
                    border:
                      selectedAgent === "full"
                        ? "1px solid var(--accent-cyan)"
                        : "1px solid var(--border-sheet)",
                    color: "#fff"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px"
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>
                      ⚡
                    </span>

                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 800
                        }}
                      >
                        Full Campaign Swarm
                      </div>

                      <div
                        style={{
                          fontSize: "9px",
                          color:
                            "var(--text-muted)",
                          marginTop: "2px"
                        }}
                      >
                        Coordinate all 8 AI Employees
                      </div>
                    </div>
                  </div>
                </button>

                {/* 8 AI EMPLOYEES */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "6px"
                  }}
                >
                  {marketingEmployees.map(
                    (employee) => {
                      const active =
                        selectedAgent ===
                        employee.id;

                      return (
                        <button
                          key={employee.id}
                          onClick={() =>
                            selectAgent(
                              employee.id
                            )
                          }
                          title={
                            employee.description
                          }
                          style={{
                            textAlign: "left",
                            minHeight: "64px",
                            padding: "8px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            background: active
                              ? "rgba(0, 220, 255, 0.10)"
                              : "rgba(255,255,255,0.025)",
                            border: active
                              ? "1px solid var(--accent-cyan)"
                              : "1px solid var(--border-sheet)",
                            color: "#fff"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "7px",
                              alignItems:
                                "flex-start"
                            }}
                          >
                            <span
                              style={{
                                fontSize: "16px"
                              }}
                            >
                              {employee.icon}
                            </span>

                            <div
                              style={{
                                minWidth: 0
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "9.5px",
                                  fontWeight: 800,
                                  lineHeight: "1.25"
                                }}
                              >
                                {
                                  employee.name
                                }
                              </div>

                              <div
                                style={{
                                  fontSize: "8px",
                                  color:
                                    "var(--text-muted)",
                                  marginTop: "3px"
                                }}
                              >
                                {
                                  employee.shortName
                                }
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* QUICK PRESETS */}

              <div style={{ marginTop: "18px" }}>

                <span className="control-title">
                  ⚡ Quick Launch Presets
                </span>

                <div className="preset-grid">
                  {presets.map((p, i) => (
                    <button
                      key={i}
                      className="preset-btn"
                      onClick={() =>
                        setTask(p.prompt)
                      }
                    >
                      {p.title}
                    </button>
                  ))}
                </div>

              </div>

              {/* AGENT STATUS */}

              <div style={{ marginTop: "18px" }}>

                <span className="control-title">
                  📡 Agent Pipeline Status
                </span>

                {marketingEmployees.map(
                  (employee) => (
                    <div
                      className="telemetry-row"
                      key={employee.id}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "10px"
                        }}
                      >
                        {employee.icon}{" "}
                        {employee.shortName}
                      </span>

                      <span
                        style={{
                          color:
                            "var(--accent-emerald)",
                          fontFamily:
                            "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          fontSize: "9px"
                        }}
                      >
                        READY
                      </span>
                    </div>
                  )
                )}

                <div className="telemetry-row">
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "10px"
                    }}
                  >
                    🔧 MCP Tool Server
                  </span>

                  <span
                    style={{
                      color:
                        "var(--accent-cyan)",
                      fontFamily:
                        "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: "9px"
                    }}
                  >
                    PORT 9000
                  </span>
                </div>

              </div>

              {/* EXECUTE */}

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "12px"
                }}
              >
                <button
                  onClick={runMarketingAgent}
                  disabled={loading}
                  className="btn-trigger"
                >
                  {loading
                    ? selectedAgent === "full"
                      ? "Synthesizing Campaign..."
                      : "Executing AI Employee..."
                    : selectedAgent === "full"
                      ? "Execute Campaign Swarm ⚡"
                      : `Run ${
                          currentEmployee?.shortName ||
                          "AI Employee"
                        } →`}
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ========================================================
          RIGHT REPORT CANVAS
      ======================================================== */}

      <main className="canvas">

        {/* HEADER / TABS */}

        <header className="canvas-header">

          <div className="tabs-dock">

            {/* INDIVIDUAL EMPLOYEE */}

            {selectedAgent !== "full" && (
              <button
                className={`tab-pill ${
                  activeTab === "employee"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("employee")
                }
              >
                {currentEmployee?.icon || "🤖"}{" "}
                {currentEmployee?.shortName ||
                  "AI Employee"}
              </button>
            )}

            {/* FULL CAMPAIGN TABS */}

            {selectedAgent === "full" && (
              <>
                <button
                  className={`tab-pill ${
                    activeTab === "final"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("final")
                  }
                >
                  ✨ Executive Campaign Plan
                </button>

                <button
                  className={`tab-pill ${
                    activeTab === "strategy"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("strategy")
                  }
                >
                  🧠 Marketing Strategy
                </button>

                <button
                  className={`tab-pill ${
                    activeTab === "content"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("content")
                  }
                >
                  ✍️ Content
                </button>

                <button
                  className={`tab-pill ${
                    activeTab === "email"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("email")
                  }
                >
                  📧 Email
                </button>

                <button
                  className={`tab-pill ${
                    activeTab === "mcp"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("mcp")
                  }
                >
                  🔧 MCP Live Telemetry
                </button>
              </>
            )}
          </div>

          {/* COPY BUTTON */}

          {out && (
            <button
              onClick={copyCurrentOutput}
              style={{
                background:
                  "rgba(255, 255, 255, 0.05)",
                border:
                  "1px solid var(--border-sheet)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              📋 Copy Output
            </button>
          )}
        </header>

        {/* ======================================================
            REPORT BODY
        ====================================================== */}

        <section className="canvas-body">

          {/* EMPTY */}

          {!out && !loading ? (
            <div className="empty-view">

              <div className="empty-view-icon">
                🎯
              </div>

              <h2
                style={{
                  fontSize: "20px",
                  margin: "0 0 8px",
                  color: "#fff"
                }}
              >
                Ready for Orchestration
              </h2>

              <p
                style={{
                  color: "var(--text-muted)",
                  maxWidth: "470px",
                  fontSize: "13.5px",
                  lineHeight: "1.6"
                }}
              >
                Select one of the 8 Marketing AI
                Employees for a focused task, or
                choose Full Campaign Swarm to
                coordinate the complete marketing
                workflow.
              </p>

            </div>
          ) : loading ? (

            /* LOADING */

            <div className="loader-view">

              <div className="orbit-loader"></div>

              <h3
                style={{
                  color: "#fff",
                  marginTop: "20px",
                  fontSize: "16px"
                }}
              >
                {selectedAgent === "full"
                  ? "Orchestrating Autonomous AI Employees..."
                  : `Executing ${
                      currentEmployee?.name ||
                      "Specialized AI Employee"
                    }...`}
              </h3>

              <p
                style={{
                  color:
                    "var(--accent-cyan)",
                  fontSize: "12.5px",
                  fontFamily:
                    "'JetBrains Mono', monospace"
                }}
              >
                Querying Groq LLM ⇄ Vector Search
                ⇄ MCP Tool Server ⇄ Memory
              </p>

            </div>
          ) : (

            /* REPORT */

            <div className="report-container">

              {/* TOP BANNER */}

              <div className="report-top-banner">

                <div>

                  <span
                    style={{
                      fontSize: "11px",
                      color:
                        "var(--accent-cyan)",
                      fontFamily:
                        "'JetBrains Mono', monospace",
                      fontWeight: 700
                    }}
                  >
                    {selectedAgent === "full"
                      ? "MULTI-AGENT ENGINE DELIVERABLE"
                      : "SPECIALIZED AI EMPLOYEE DELIVERABLE"}
                  </span>

                  <div
                    style={{
                      color:
                        "var(--text-muted)",
                      fontSize: "13px",
                      marginTop: "3px"
                    }}
                  >
                    {selectedAgent === "full"
                      ? "Coordinated across all 8 specialized Marketing AI Employees"
                      : `Generated by ${
                          currentEmployee?.name ||
                          "AI Employee"
                        }`}
                  </div>

                </div>

                <div className="status-badge">
                  ● Production Ready
                </div>

              </div>

              {/* =================================================
                  INDIVIDUAL EMPLOYEE OUTPUT
              ================================================= */}

              {selectedAgent !== "full" &&
                activeTab === "employee" && (
                  <MarkdownContent>
                    {out.output}
                  </MarkdownContent>
                )}

              {/* =================================================
                  FULL CAMPAIGN FINAL
              ================================================= */}

              {selectedAgent === "full" &&
                activeTab === "final" && (
                  <MarkdownContent>
                    {out.final}
                  </MarkdownContent>
                )}

              {/* =================================================
                  STRATEGY
              ================================================= */}

              {selectedAgent === "full" &&
                activeTab === "strategy" && (
                  <MarkdownContent>
                    {out.strategy}
                  </MarkdownContent>
                )}

              {/* =================================================
                  CONTENT
              ================================================= */}

              {selectedAgent === "full" &&
                activeTab === "content" && (
                  <MarkdownContent>
                    {out.content}
                  </MarkdownContent>
                )}

              {/* =================================================
                  EMAIL
              ================================================= */}

              {selectedAgent === "full" &&
                activeTab === "email" && (
                  <MarkdownContent>
                    {out.email}
                  </MarkdownContent>
                )}

              {/* =================================================
                  MCP
              ================================================= */}

              {selectedAgent === "full" &&
                activeTab === "mcp" && (
                  <div>

                    <h2
                      style={{
                        marginTop: 0
                      }}
                    >
                      MCP Server Context &
                      Brief Generation
                    </h2>

                    <div className="mcp-grid">

                      {/* PRODUCT */}

                      <div className="mcp-card">

                        <div className="mcp-card-label">
                          Extracted Product
                        </div>

                        <div className="mcp-card-val">
                          {out
                            ?.mcp_campaign_brief
                            ?.brief
                            ?.product ||
                            "N/A"}
                        </div>

                      </div>

                      {/* AUDIENCE */}

                      <div className="mcp-card">

                        <div className="mcp-card-label">
                          Target Audience
                        </div>

                        <div className="mcp-card-val">
                          {out
                            ?.mcp_campaign_brief
                            ?.brief
                            ?.audience ||
                            "N/A"}
                        </div>

                      </div>

                      {/* GOAL */}

                      <div className="mcp-card">

                        <div className="mcp-card-label">
                          Campaign Goal
                        </div>

                        <div className="mcp-card-val">
                          {out
                            ?.mcp_campaign_brief
                            ?.brief
                            ?.goal ||
                            "N/A"}
                        </div>

                      </div>

                      {/* CHANNELS */}

                      <div className="mcp-card">

                        <div className="mcp-card-label">
                          Active Channels
                        </div>

                        <div
                          className="mcp-card-val"
                          style={{
                            color:
                              "var(--accent-cyan)"
                          }}
                        >
                          {out
                            ?.mcp_campaign_brief
                            ?.brief
                            ?.channels
                            ?.join(" • ") ||
                            "Instagram • Email"}
                        </div>

                      </div>

                    </div>

                    {/* HASHTAGS */}

                    <h3
                      style={{
                        color: "#fff",
                        marginTop: "28px",
                        fontSize: "15px"
                      }}
                    >
                      Auto-Generated Hashtag
                      Clusters
                    </h3>

                    <div className="hashtag-cluster">
                      {out
                        ?.mcp_hashtags
                        ?.hashtags
                        ?.map(
                          (tag, i) => (
                            <span
                              key={i}
                              className="hashtag-pill"
                            >
                              {tag}
                            </span>
                          )
                        )}
                    </div>

                  </div>
                )}

            </div>
          )}
        </section>
      </main>
    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <App />
);