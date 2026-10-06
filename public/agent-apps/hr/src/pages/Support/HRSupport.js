const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Support/HRSupport.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useRef, useState } from "react";

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

import api from "../../services/api.js";

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
        _optionalChain([response, 'access', _ => _.data, 'optionalAccess', _2 => _2.items]) ||
          response.data ||
          []
      );
    } catch (e) {
      setTickets([]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    _optionalChain([chatEndRef, 'access', _3 => _3.current, 'optionalAccess', _4 => _4.scrollIntoView, 'call', _5 => _5({
      behavior: "smooth",
    })]);
  }, [messages, aiLoading]);

  const updateStatus = async (id, nextStatus) => {
    try {
      await api.patch(`/support/${id}`, {
        status: nextStatus,
      });

      load();
    } catch (e2) {
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
        _optionalChain([response, 'access', _6 => _6.data, 'optionalAccess', _7 => _7.response]) ||
        _optionalChain([response, 'access', _8 => _8.data, 'optionalAccess', _9 => _9.answer]) ||
        _optionalChain([response, 'access', _10 => _10.data, 'optionalAccess', _11 => _11.message]) ||
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
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}

      /* =====================================================
          PAGE HEADER
      ===================================================== */

      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}

          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}, "HR SERVICE DESK"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}, "HR Support"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}, "Get instant AI assistance or submit a request to the People Operations team."


          )

        )

        , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}

          , React.createElement('button', {
            type: "button",
            className: "btn",
            onClick: load,
            disabled: busy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}

            , React.createElement(RefreshCw, {
              size: 14,
              className: 
                busy
                  ? "animate-spin"
                  : ""
              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}
            ), "Refresh"

          )

          , React.createElement('button', {
            type: "button",
            className: "btn",
            onClick: () =>
              setAiOpen(true)
            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}

            , React.createElement(Sparkles, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}} ), "AI HR Support"

          )

          , React.createElement(Link, {
            className: "btn btn-primary" ,
            to: "/support/tickets/new", __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}

            , React.createElement(Plus, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}} ), "Create ticket"

          )

        )

      )

      /* =====================================================
          24/7 AI SUPPORT HERO
      ===================================================== */

      , React.createElement('section', { className: "mb-5 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}

        , React.createElement('div', { className: "grid lg:grid-cols-[1fr_340px]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}

          /* LEFT */

          , React.createElement('div', { className: "relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-6 text-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}

            , React.createElement('div', { className: "absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}} )

            , React.createElement('div', { className: "absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-white/5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}} )

            , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}

              , React.createElement('div', { className: "mb-5 flex items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}

                , React.createElement('span', { className: "grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}
                  , React.createElement(Bot, { size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 401}} )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}

                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}

                    , React.createElement('span', { className: "text-sm font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}, "AzentMart AI HR Support"

                    )

                    , React.createElement('span', { className: "flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[8px] font-bold text-emerald-100"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}
                      , React.createElement('span', { className: "h-1.5 w-1.5 rounded-full bg-emerald-300"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}} ), "ONLINE"

                    )

                  )

                  , React.createElement('p', { className: "mt-1 text-[10px] text-blue-100"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}, "Available 24/7 for instant HR assistance"

                  )

                )

              )

              , React.createElement('h2', { className: "max-w-xl text-xl font-extrabold leading-tight md:text-2xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 427}}, "Your HR questions, answered instantly."


              )

              , React.createElement('p', { className: "mt-3 max-w-2xl text-xs leading-5 text-blue-100"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 432}}, "Ask about company policies, leave, attendance, payroll, benefits, onboarding, documents and everyday HR processes without waiting for a support response."




              )

              , React.createElement('button', {
                type: "button",
                onClick: () =>
                  setAiOpen(true)
                ,
                className: "mt-5 inline-flex min-h-9 items-center gap-2 rounded-lg bg-white px-4 text-[10px] font-extrabold text-blue-700 shadow-sm transition hover:bg-blue-50"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}

                , React.createElement(MessageCircle, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 446}} ), "Chat with AI HR Support"

              )

            )

          )

          /* RIGHT */

          , React.createElement('div', { className: "bg-slate-50 p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 456}}

            , React.createElement('p', { className: "text-[9px] font-extrabold tracking-[0.15em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}, "AI CAPABILITIES"

            )

            , React.createElement('div', { className: "mt-4 space-y-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 462}}

              , [
                "Instant HR policy guidance",
                "Leave and attendance assistance",
                "Payroll and benefits questions",
                "Employee onboarding guidance",
                "Document and process assistance",
                "24/7 self-service support",
              ].map((item) => (

                React.createElement('div', {
                  key: item,
                  className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 473}}


                  , React.createElement('span', { className: "grid h-6 w-6 place-items-center rounded-md bg-white text-emerald-600 shadow-sm"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 478}}
                    , React.createElement(CheckCircle2, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 479}} )
                  )

                  , React.createElement('span', { className: "text-[10px] font-semibold text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 482}}
                    , item
                  )

                )

              ))

            )

          )

        )

      )

      /* =====================================================
          SUMMARY
      ===================================================== */

      , React.createElement('div', { className: "mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 502}}

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 504}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 506}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 508}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 510}}, "Total Tickets"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}
                , total
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 518}}, "Support requests"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 524}}
              , React.createElement(Ticket, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 525}} )
            )

          )

        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 532}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 534}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 536}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 538}}, "Open"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 542}}
                , open
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 546}}, "Requires attention"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 552}}
              , React.createElement(LifeBuoy, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 553}} )
            )

          )

        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 560}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 562}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 564}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 566}}, "Pending"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 570}}
                , pending
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}, "Awaiting action"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 580}}
              , React.createElement(Clock3, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 581}} )
            )

          )

        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 588}}

          , React.createElement('div', { className: "flex items-start justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 590}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 592}}

              , React.createElement('p', { className: "text-[9px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 594}}, "Resolved"

              )

              , React.createElement('p', { className: "mt-2 text-2xl font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 598}}
                , resolved
              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 602}}, "Completed requests"

              )

            )

            , React.createElement('span', { className: "grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 608}}
              , React.createElement(CheckCircle2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 609}} )
            )

          )

        )

      )

      /* =====================================================
          SUPPORT QUEUE
      ===================================================== */

      , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}

        , React.createElement('div', { className: "border-b border-slate-100 px-5 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 624}}

          , React.createElement('div', { className: "flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 626}}

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 628}}

              , React.createElement('span', { className: "text-[9px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 630}}, "SUPPORT QUEUE"

              )

              , React.createElement('h2', { className: "mt-1 text-sm font-extrabold text-slate-950"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 634}}, "Employee support requests"

              )

              , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 638}}, "Search, review and resolve HR service requests."

              )

            )

            , React.createElement('div', { className: "flex flex-col gap-2 sm:flex-row"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 644}}

              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 646}}

                , React.createElement(Search, {
                  size: 13,
                  className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 648}}
                )

                , React.createElement('input', {
                  className: "input h-9 w-full pl-8 sm:w-[220px]"    ,
                  placeholder: "Search tickets..." ,
                  value: search,
                  onChange: (event) =>
                    setSearch(
                      event.target.value
                    )
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}
                )

              )

              , React.createElement('select', {
                className: "select h-9 w-full sm:w-[145px]"   ,
                value: status,
                onChange: (event) =>
                  setStatus(
                    event.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 666}}

                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 675}}, "All statuses"

                )
                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}, "Open")
                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 679}}, "Pending")
                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 680}}, "Resolved")
                , React.createElement('option', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 681}}, "Closed")
              )

              , React.createElement('select', {
                className: "select h-9 w-full sm:w-[165px]"   ,
                value: category,
                onChange: (event) =>
                  setCategory(
                    event.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 684}}

                , categories.map(
                  (item) => (
                    React.createElement('option', { key: item, __self: this, __source: {fileName: _jsxFileName, lineNumber: 695}}
                      , item
                    )
                  )
                )
              )

            )

          )

        )

        , busy ? (

          React.createElement('div', { className: "loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 710}}, "Loading support requests..."

          )

        ) : (

          React.createElement('div', { className: "table-wrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 716}}

            , React.createElement('table', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 718}}

              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 720}}

                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 722}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 723}}, "Ticket")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 724}}, "Subject")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 725}}, "Category")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 726}}, "Priority")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 727}}, "Status")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 728}}, "Action")
                )

              )

              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 733}}

                , filteredTickets.map(
                  (ticket) => (

                    React.createElement('tr', { key: ticket.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 738}}

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 740}}

                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 742}}

                          , React.createElement('span', { className: "grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 744}}
                            , React.createElement(Ticket, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 745}} )
                          )

                          , React.createElement('span', { className: "text-[10px] font-extrabold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 748}}, "#"
                            , ticket.id
                          )

                        )

                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 756}}

                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 758}}

                          , React.createElement('p', { className: "text-[11px] font-extrabold text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 760}}
                            , ticket.subject ||
                              "Untitled request"
                          )

                          , ticket.description && (
                            React.createElement('p', { className: "mt-0.5 max-w-[300px] truncate text-[9px] text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 766}}
                              , ticket.description
                            )
                          )

                        )

                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 775}}

                        , React.createElement('span', { className: "text-[10px] text-slate-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 777}}
                          , ticket.category ||
                            "General HR"
                        )

                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 784}}

                        , React.createElement('span', { className: "text-[10px] font-semibold text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 786}}
                          , ticket.priority ||
                            "Normal"
                        )

                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 793}}

                        , React.createElement('span', {
                          className: getStatusClass(
                            ticket.status
                          ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 795}}

                          , ticket.status ||
                            "Open"
                        )

                      )

                      , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 806}}

                        , ticket.status !==
                          "Resolved" &&
                        ticket.status !==
                          "Closed" ? (

                          React.createElement('button', {
                            type: "button",
                            className: "btn !min-h-8 !px-2.5"  ,
                            onClick: () =>
                              updateStatus(
                                ticket.id,
                                "Resolved"
                              )
                            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 813}}

                            , React.createElement(CheckCircle2, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 823}} ), "Resolve"

                          )

                        ) : (

                          React.createElement('span', { className: "flex items-center gap-1 text-[10px] font-semibold text-emerald-600"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 829}}
                            , React.createElement(CheckCircle2, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 830}} ), "Completed"

                          )

                        )

                      )

                    )

                  )
                )

              )

            )

            , !filteredTickets.length && (

              React.createElement('div', { className: "empty-state py-14" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 849}}

                , React.createElement(LifeBuoy, { className: "mx-auto mb-3 text-slate-300"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 851}} )

                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 853}}, "No support tickets found"

                )

                , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 857}}, "Create a new HR support request or change your filters."


                )

                , React.createElement(Link, {
                  to: "/support/tickets/new",
                  className: "btn btn-primary mt-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 862}}

                  , React.createElement(Plus, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 866}} ), "Create ticket"

                )

              )

            )

          )

        )

      )

      /* =====================================================
          AI CHAT MODAL
      ===================================================== */

      , aiOpen && (

        React.createElement('div', { className: "fixed inset-0 z-[100] flex items-end justify-end bg-slate-950/40 p-0 backdrop-blur-[2px] sm:p-5"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 886}}

          , React.createElement('div', { className: "flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[720px] sm:max-h-[calc(100vh-40px)] sm:w-[440px] sm:rounded-2xl"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 888}}

            /* AI HEADER */

            , React.createElement('div', { className: "flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 892}}

              , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 894}}

                , React.createElement('span', { className: "relative grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 896}}

                  , React.createElement(Bot, { size: 19, __self: this, __source: {fileName: _jsxFileName, lineNumber: 898}} )

                  , React.createElement('span', { className: "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 900}} )

                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 904}}

                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 906}}

                    , React.createElement('h2', { className: "text-sm font-extrabold text-slate-950"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 908}}, "AzentMart AI HR"

                    )

                    , React.createElement('span', { className: "rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-extrabold text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 912}}, "24/7"

                    )

                  )

                  , React.createElement('p', { className: "mt-0.5 text-[9px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 918}}, "AI-powered HR assistance"

                  )

                )

              )

              , React.createElement('button', {
                type: "button",
                onClick: () =>
                  setAiOpen(false)
                ,
                className: "grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 926}}

                , React.createElement(X, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 933}} )
              )

            )

            /* AI STATUS */

            , React.createElement('div', { className: "border-b border-slate-100 bg-slate-50 px-5 py-2.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 940}}

              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 942}}

                , React.createElement('span', { className: "h-2 w-2 rounded-full bg-emerald-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 944}} )

                , React.createElement('span', { className: "text-[9px] font-semibold text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 946}}, "AI assistant is online and ready to help"

                )

              )

            )

            /* MESSAGES */

            , React.createElement('div', { className: "flex-1 overflow-y-auto bg-slate-50/70 p-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 956}}

              /* QUICK QUESTIONS */

              , messages.length === 1 && (

                React.createElement('div', { className: "mb-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 962}}

                  , React.createElement('p', { className: "mb-2 px-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 964}}, "Common HR questions"

                  )

                  , React.createElement('div', { className: "grid grid-cols-2 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 968}}

                    , quickQuestions.map(
                      (question) => {

                        const Icon =
                          question.icon;

                        return (
                          React.createElement('button', {
                            key: 
                              question.label
                            ,
                            type: "button",
                            onClick: () =>
                              sendAIMessage(
                                question.message
                              )
                            ,
                            className: "rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 977}}


                            , React.createElement(Icon, {
                              size: 14,
                              className: "text-blue-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 990}}
                            )

                            , React.createElement('p', { className: "mt-2 text-[9px] font-extrabold text-slate-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 995}}
                              , question.label
                            )

                          )
                        );
                      }
                    )

                  )

                )

              )

              /* CHAT */

              , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1012}}

                , messages.map(
                  (message) => (

                    React.createElement('div', {
                      key: message.id,
                      className: 
                        message.role ===
                        "user"
                          ? "flex justify-end"
                          : "flex justify-start"
                      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1017}}


                      , React.createElement('div', {
                        className: 
                          message.role ===
                          "user"
                            ? "max-w-[82%] rounded-2xl rounded-br-md bg-blue-600 px-3.5 py-3 text-white shadow-sm"
                            : "max-w-[88%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-3 text-slate-700 shadow-sm"
                        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1027}}


                        , message.role ===
                          "assistant" && (

                          React.createElement('div', { className: "mb-1.5 flex items-center gap-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1039}}

                            , React.createElement(Bot, {
                              size: 11,
                              className: "text-blue-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1041}}
                            )

                            , React.createElement('span', { className: "text-[8px] font-extrabold text-blue-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1046}}, "AZENTMART AI"

                            )

                          )

                        )

                        , React.createElement('p', { className: "whitespace-pre-wrap text-[10px] leading-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1054}}
                          , message.content
                        )

                      )

                    )

                  )
                )

                , aiLoading && (

                  React.createElement('div', { className: "flex justify-start" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1067}}

                    , React.createElement('div', { className: "rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1069}}

                      , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1071}}

                        , React.createElement('span', { className: "h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1073}} )

                        , React.createElement('span', {
                          className: "h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500"    ,
                          style: {
                            animationDelay:
                              "100ms",
                          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1075}}
                        )

                        , React.createElement('span', {
                          className: "h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500"    ,
                          style: {
                            animationDelay:
                              "200ms",
                          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1083}}
                        )

                      )

                    )

                  )

                )

                , React.createElement('div', { ref: chatEndRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1099}} )

              )

            )

            /* CHAT INPUT */

            , React.createElement('div', { className: "border-t border-slate-100 bg-white p-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1107}}

              , React.createElement('div', { className: "rounded-xl border border-slate-200 bg-slate-50 p-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1109}}

                , React.createElement('div', { className: "flex items-end gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1111}}

                  , React.createElement('textarea', {
                    value: aiMessage,
                    onChange: (event) =>
                      setAiMessage(
                        event.target.value
                      )
                    ,
                    onKeyDown: 
                      handleAIKeyDown
                    ,
                    rows: 2,
                    placeholder: "Ask your HR question..."   ,
                    className: "min-h-[48px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-[10px] outline-none placeholder:text-slate-400"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1113}}
                  )

                  , React.createElement('button', {
                    type: "button",
                    disabled: 
                      !aiMessage.trim() ||
                      aiLoading
                    ,
                    onClick: () =>
                      sendAIMessage()
                    ,
                    className: "mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white disabled:cursor-not-allowed disabled:opacity-40"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1128}}

                    , React.createElement(Send, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1139}} )
                  )

                )

              )

              , React.createElement('div', { className: "mt-2 flex items-center justify-between px-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1146}}

                , React.createElement('span', { className: "text-[8px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1148}}, "AI support is available 24/7"

                )

                , React.createElement(Link, {
                  to: "/support/tickets/new",
                  onClick: () =>
                    setAiOpen(false)
                  ,
                  className: "text-[8px] font-bold text-blue-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1152}}
, "Create HR ticket"

                )

              )

            )

          )

        )

      )

    )
  );
}