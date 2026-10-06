import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clock3,
  FileText,
  HelpCircle,
  LifeBuoy,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Ticket,
  UserRound,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";

export default function HRSupport() {
  const [tickets, setTickets] = useState([]);
  const [busy, setBusy] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [category, setCategory] = useState("All categories");

  /* =========================================================
     AI SUPPORT
  ========================================================= */

  const [aiOpen, setAiOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm AzentMart AI HR Support. I'm available 24/7 to help with leave, attendance, payroll, benefits, onboarding, policies and general HR questions. How can I help you today?",
      time: new Date(),
    },
  ]);

  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const chatEndRef = useRef(null);

  const load = async () => {
    setBusy(true);

    try {
      const response = await api.get("/support");

      setTickets(
        response.data?.items ||
          response.data ||
          []
      );
    } catch {
      setTickets([]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, aiLoading]);

  const updateStatus = async (id, nextStatus) => {
    try {
      await api.patch(`/support/${id}`, {
        status: nextStatus,
      });

      load();
    } catch {
      // Keep current data when update fails.
    }
  };

  /* =========================================================
     FILTERS
  ========================================================= */

  const categories = useMemo(() => {
    const values = tickets
      .map((ticket) => ticket.category)
      .filter(Boolean);

    return [
      "All categories",
      ...Array.from(new Set(values)),
    ];
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !query ||
        String(ticket.id || "")
          .toLowerCase()
          .includes(query) ||
        String(ticket.subject || "")
          .toLowerCase()
          .includes(query) ||
        String(ticket.category || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "All statuses" ||
        ticket.status === status;

      const matchesCategory =
        category === "All categories" ||
        ticket.category === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    tickets,
    search,
    status,
    category,
  ]);

  /* =========================================================
     METRICS
  ========================================================= */

  const total = tickets.length;

  const open = tickets.filter(
    (ticket) =>
      !["Resolved", "Closed"].includes(
        ticket.status
      )
  ).length;

  const pending = tickets.filter(
    (ticket) =>
      ticket.status === "Pending"
  ).length;

  const resolved = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved" ||
      ticket.status === "Closed"
  ).length;

  /* =========================================================
     AI QUICK QUESTIONS
  ========================================================= */

  const quickQuestions = [
    {
      label: "Leave policy",
      message:
        "What is the company leave policy?",
      icon: Clock3,
    },
    {
      label: "Attendance",
      message:
        "How does attendance and regularization work?",
      icon: CheckCircle2,
    },
    {
      label: "Payroll",
      message:
        "What information is available about payroll?",
      icon: FileText,
    },
    {
      label: "Benefits",
      message:
        "What employee benefits are available?",
      icon: Sparkles,
    },
    {
      label: "Onboarding",
      message:
        "What is the employee onboarding process?",
      icon: UserRound,
    },
    {
      label: "HR policies",
      message:
        "What HR policies should employees know?",
      icon: HelpCircle,
    },
  ];

  /* =========================================================
     SEND AI MESSAGE
  ========================================================= */

  const sendAIMessage = async (messageOverride = null) => {
    const text =
      messageOverride !== null
        ? messageOverride
        : aiMessage.trim();

    if (!text || aiLoading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
      time: new Date(),
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setAiMessage("");
    setAiLoading(true);

    try {
      const response = await api.post(
        "/support/ai/chat",
        {
          message: text,
        }
      );

      const answer =
        response.data?.response ||
        response.data?.answer ||
        response.data?.message ||
        "I couldn't generate a response right now.";

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: answer,
          time: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I'm temporarily unable to connect to the HR AI service. You can create an HR support ticket and the People Operations team can assist you.",
          time: new Date(),
          error: true,
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendAIMessage();
    }
  };

  const getStatusClass = (value) => {
    if (
      value === "Resolved" ||
      value === "Closed"
    ) {
      return "badge success";
    }

    if (value === "Pending") {
      return "badge warning";
    }

    if (value === "Rejected") {
      return "badge danger";
    }

    return "badge";
  };

  return (
    <div className="page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-header">

        <div>

          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            HR SERVICE DESK
          </span>

          <h1 className="mt-1">
            HR Support
          </h1>

          <p>
            Get instant AI assistance or submit a request
            to the People Operations team.
          </p>

        </div>

        <div className="flex gap-2">

          <button
            type="button"
            className="btn"
            onClick={load}
            disabled={busy}
          >
            <RefreshCw
              size={14}
              className={
                busy
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>

          <button
            type="button"
            className="btn"
            onClick={() =>
              setAiOpen(true)
            }
          >
            <Sparkles size={14} />
            AI HR Support
          </button>

          <Link
            className="btn btn-primary"
            to="/support/tickets/new"
          >
            <Plus size={14} />
            Create ticket
          </Link>

        </div>

      </div>

      {/* =====================================================
          24/7 AI SUPPORT HERO
      ===================================================== */}

      <section className="mb-5 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

        <div className="grid lg:grid-cols-[1fr_340px]">

          {/* LEFT */}

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-6 text-white">

            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative">

              <div className="mb-5 flex items-center gap-3">

                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <Bot size={21} />
                </span>

                <div>

                  <div className="flex items-center gap-2">

                    <span className="text-sm font-extrabold">
                      AzentMart AI HR Support
                    </span>

                    <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[8px] font-bold text-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      ONLINE
                    </span>

                  </div>

                  <p className="mt-1 text-[10px] text-blue-100">
                    Available 24/7 for instant HR assistance
                  </p>

                </div>

              </div>

              <h2 className="max-w-xl text-xl font-extrabold leading-tight md:text-2xl">
                Your HR questions,
                answered instantly.
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-5 text-blue-100">
                Ask about company policies, leave, attendance,
                payroll, benefits, onboarding, documents and
                everyday HR processes without waiting for a
                support response.
              </p>

              <button
                type="button"
                onClick={() =>
                  setAiOpen(true)
                }
                className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-lg bg-white px-4 text-[10px] font-extrabold text-blue-700 shadow-sm transition hover:bg-blue-50"
              >
                <MessageCircle size={14} />
                Chat with AI HR Support
              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div className="bg-slate-50 p-5">

            <p className="text-[9px] font-extrabold tracking-[0.15em] text-blue-600">
              AI CAPABILITIES
            </p>

            <div className="mt-4 space-y-3">

              {[
                "Instant HR policy guidance",
                "Leave and attendance assistance",
                "Payroll and benefits questions",
                "Employee onboarding guidance",
                "Document and process assistance",
                "24/7 self-service support",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-2"
                >

                  <span className="grid h-6 w-6 place-items-center rounded-md bg-white text-emerald-600 shadow-sm">
                    <CheckCircle2 size={12} />
                  </span>

                  <span className="text-[10px] font-semibold text-slate-600">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Total Tickets
              </p>

              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {total}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Support requests
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <Ticket size={15} />
            </span>

          </div>

        </div>

        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Open
              </p>

              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {open}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Requires attention
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <LifeBuoy size={15} />
            </span>

          </div>

        </div>

        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Pending
              </p>

              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {pending}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Awaiting action
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600">
              <Clock3 size={15} />
            </span>

          </div>

        </div>

        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Resolved
              </p>

              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {resolved}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Completed requests
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={15} />
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          SUPPORT QUEUE
      ===================================================== */}

      <div className="card overflow-hidden">

        <div className="border-b border-slate-100 px-5 py-4">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <span className="text-[9px] font-extrabold tracking-[0.16em] text-blue-600">
                SUPPORT QUEUE
              </span>

              <h2 className="mt-1 text-sm font-extrabold text-slate-950">
                Employee support requests
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                Search, review and resolve HR service requests.
              </p>

            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="relative">

                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  className="input h-9 w-full pl-8 sm:w-[220px]"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

              <select
                className="select h-9 w-full sm:w-[145px]"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >
                <option>
                  All statuses
                </option>
                <option>Open</option>
                <option>Pending</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>

              <select
                className="select h-9 w-full sm:w-[165px]"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
              >
                {categories.map(
                  (item) => (
                    <option key={item}>
                      {item}
                    </option>
                  )
                )}
              </select>

            </div>

          </div>

        </div>

        {busy ? (

          <div className="loading">
            Loading support requests...
          </div>

        ) : (

          <div className="table-wrap">

            <table>

              <thead>

                <tr>
                  <th>Ticket</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredTickets.map(
                  (ticket) => (

                    <tr key={ticket.id}>

                      <td>

                        <div className="flex items-center gap-2">

                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                            <Ticket size={13} />
                          </span>

                          <span className="text-[10px] font-extrabold text-slate-700">
                            #{ticket.id}
                          </span>

                        </div>

                      </td>

                      <td>

                        <div>

                          <p className="text-[11px] font-extrabold text-slate-800">
                            {ticket.subject ||
                              "Untitled request"}
                          </p>

                          {ticket.description && (
                            <p className="mt-0.5 max-w-[300px] truncate text-[9px] text-slate-400">
                              {ticket.description}
                            </p>
                          )}

                        </div>

                      </td>

                      <td>

                        <span className="text-[10px] text-slate-600">
                          {ticket.category ||
                            "General HR"}
                        </span>

                      </td>

                      <td>

                        <span className="text-[10px] font-semibold text-slate-600">
                          {ticket.priority ||
                            "Normal"}
                        </span>

                      </td>

                      <td>

                        <span
                          className={getStatusClass(
                            ticket.status
                          )}
                        >
                          {ticket.status ||
                            "Open"}
                        </span>

                      </td>

                      <td>

                        {ticket.status !==
                          "Resolved" &&
                        ticket.status !==
                          "Closed" ? (

                          <button
                            type="button"
                            className="btn !min-h-8 !px-2.5"
                            onClick={() =>
                              updateStatus(
                                ticket.id,
                                "Resolved"
                              )
                            }
                          >
                            <CheckCircle2 size={12} />
                            Resolve
                          </button>

                        ) : (

                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                            <CheckCircle2 size={12} />
                            Completed
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

            {!filteredTickets.length && (

              <div className="empty-state py-14">

                <LifeBuoy className="mx-auto mb-3 text-slate-300" />

                <strong>
                  No support tickets found
                </strong>

                <p>
                  Create a new HR support request or
                  change your filters.
                </p>

                <Link
                  to="/support/tickets/new"
                  className="btn btn-primary mt-4"
                >
                  <Plus size={13} />
                  Create ticket
                </Link>

              </div>

            )}

          </div>

        )}

      </div>

      {/* =====================================================
          AI CHAT MODAL
      ===================================================== */}

      {aiOpen && (

        <div className="fixed inset-0 z-[100] flex items-end justify-end bg-slate-950/40 p-0 backdrop-blur-[2px] sm:p-5">

          <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[720px] sm:max-h-[calc(100vh-40px)] sm:w-[440px] sm:rounded-2xl">

            {/* AI HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">

              <div className="flex items-center gap-3">

                <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">

                  <Bot size={19} />

                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />

                </span>

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-sm font-extrabold text-slate-950">
                      AzentMart AI HR
                    </h2>

                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-extrabold text-emerald-600">
                      24/7
                    </span>

                  </div>

                  <p className="mt-0.5 text-[9px] text-slate-400">
                    AI-powered HR assistance
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setAiOpen(false)
                }
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>

            </div>

            {/* AI STATUS */}

            <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-[9px] font-semibold text-slate-500">
                  AI assistant is online and ready to help
                </span>

              </div>

            </div>

            {/* MESSAGES */}

            <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4">

              {/* QUICK QUESTIONS */}

              {messages.length === 1 && (

                <div className="mb-5">

                  <p className="mb-2 px-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                    Common HR questions
                  </p>

                  <div className="grid grid-cols-2 gap-2">

                    {quickQuestions.map(
                      (question) => {

                        const Icon =
                          question.icon;

                        return (
                          <button
                            key={
                              question.label
                            }
                            type="button"
                            onClick={() =>
                              sendAIMessage(
                                question.message
                              )
                            }
                            className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                          >

                            <Icon
                              size={14}
                              className="text-blue-600"
                            />

                            <p className="mt-2 text-[9px] font-extrabold text-slate-700">
                              {question.label}
                            </p>

                          </button>
                        );
                      }
                    )}

                  </div>

                </div>

              )}

              {/* CHAT */}

              <div className="space-y-3">

                {messages.map(
                  (message) => (

                    <div
                      key={message.id}
                      className={
                        message.role ===
                        "user"
                          ? "flex justify-end"
                          : "flex justify-start"
                      }
                    >

                      <div
                        className={
                          message.role ===
                          "user"
                            ? "max-w-[82%] rounded-2xl rounded-br-md bg-blue-600 px-3.5 py-3 text-white shadow-sm"
                            : "max-w-[88%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-3 text-slate-700 shadow-sm"
                        }
                      >

                        {message.role ===
                          "assistant" && (

                          <div className="mb-1.5 flex items-center gap-1.5">

                            <Bot
                              size={11}
                              className="text-blue-600"
                            />

                            <span className="text-[8px] font-extrabold text-blue-600">
                              AZENTMART AI
                            </span>

                          </div>

                        )}

                        <p className="whitespace-pre-wrap text-[10px] leading-5">
                          {message.content}
                        </p>

                      </div>

                    </div>

                  )
                )}

                {aiLoading && (

                  <div className="flex justify-start">

                    <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">

                      <div className="flex items-center gap-1">

                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500" />

                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500"
                          style={{
                            animationDelay:
                              "100ms",
                          }}
                        />

                        <span
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500"
                          style={{
                            animationDelay:
                              "200ms",
                          }}
                        />

                      </div>

                    </div>

                  </div>

                )}

                <div ref={chatEndRef} />

              </div>

            </div>

            {/* CHAT INPUT */}

            <div className="border-t border-slate-100 bg-white p-3">

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-1">

                <div className="flex items-end gap-2">

                  <textarea
                    value={aiMessage}
                    onChange={(event) =>
                      setAiMessage(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleAIKeyDown
                    }
                    rows={2}
                    placeholder="Ask your HR question..."
                    className="min-h-[48px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-[10px] outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    disabled={
                      !aiMessage.trim() ||
                      aiLoading
                    }
                    onClick={() =>
                      sendAIMessage()
                    }
                    className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={14} />
                  </button>

                </div>

              </div>

              <div className="mt-2 flex items-center justify-between px-1">

                <span className="text-[8px] text-slate-400">
                  AI support is available 24/7
                </span>

                <Link
                  to="/support/tickets/new"
                  onClick={() =>
                    setAiOpen(false)
                  }
                  className="text-[8px] font-bold text-blue-600"
                >
                  Create HR ticket
                </Link>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}