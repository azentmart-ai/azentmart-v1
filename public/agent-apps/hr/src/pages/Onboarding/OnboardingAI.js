const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Onboarding/OnboardingAI.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api.js";

const DEFAULT_ANALYSIS = {
  summary:
    "The onboarding process is partially complete. Several HR actions are still required before the employee can be marked as fully onboarded.",
  completion: 0,
  completed: [],
  pending: [
    "Create onboarding journey",
    "Verify employee documents",
    "Complete policy acknowledgement",
    "Complete mandatory training",
  ],
  recommendations: [
    "Create or review the employee onboarding journey.",
    "Verify all required employee documents.",
    "Complete mandatory policy acknowledgement.",
    "Complete mandatory onboarding training.",
  ],
};

const checklist = [
  {
    title: "Employee Profile",
    description: "Personal and contact information",
    icon: UserCheck,
  },
  {
    title: "Documents",
    description: "Identity, address and education verification",
    icon: FileText,
  },
  {
    title: "Policies",
    description: "Required HR policies acknowledged",
    icon: ShieldCheck,
  },
  {
    title: "Training",
    description: "Mandatory learning modules completed",
    icon: GraduationCap,
  },
];

export default function OnboardingAI() {
  const [searchParams] = useSearchParams();

  const [employeeId, setEmployeeId] = useState(
    searchParams.get("employee") || ""
  );

  const [employeeName, setEmployeeName] = useState("");

  const [analysis, setAnalysis] = useState(DEFAULT_ANALYSIS);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const completionText = useMemo(() => {
    return `${analysis.completion || 0}%`;
  }, [analysis]);

  const runAIAnalysis = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/onboarding/ai/analyze", {
        employee_id: employeeId ? Number(employeeId) : null,
        employee_name: employeeName || null,
      });

      setAnalysis({
        ...DEFAULT_ANALYSIS,
        ...(response.data || {}),
      });

      setMessage("AI onboarding analysis completed successfully.");
    } catch (error) {
      console.error("AI onboarding analysis error:", error);

      setAnalysis(DEFAULT_ANALYSIS);

      setMessage(
        _optionalChain([error, 'optionalAccess', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.detail]) ||
          "Unable to connect to the AI onboarding service."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId || employeeName) {
      runAIAnalysis();
    }
  }, []);

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
      /* HEADER */
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}, "INTELLIGENCE"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}, "AI Onboarding Assistant"  )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, "Use AI to identify missing onboarding tasks, summarize progress and recommend the next HR actions."


          )
        )

        , React.createElement('div', { className: "flex flex-wrap gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
          , React.createElement(Link, { to: "/onboarding", className: "btn", __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}, "Back to onboarding"

          )

          , React.createElement('button', {
            type: "button",
            onClick: runAIAnalysis,
            disabled: loading,
            className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}

            , loading ? (
              React.createElement(React.Fragment, null
                , React.createElement(RefreshCw, { size: 14, className: "animate-spin", __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}} ), "Analyzing..."

              )
            ) : (
              React.createElement(React.Fragment, null
                , React.createElement(Sparkles, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}} ), "Analyze with AI"

              )
            )
          )
        )
      )

      /* EMPLOYEE SELECTOR */
      , React.createElement('div', { className: "card mb-5 p-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
        , React.createElement('div', { className: "grid gap-4 md:grid-cols-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}
            , React.createElement('label', { className: "mb-1.5 block text-xs font-semibold text-slate-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}, "Employee ID"

            )

            , React.createElement('input', {
              value: employeeId,
              onChange: (e) => setEmployeeId(e.target.value),
              placeholder: "e.g. 25" ,
              className: "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}
            )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
            , React.createElement('label', { className: "mb-1.5 block text-xs font-semibold text-slate-700"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}, "Employee Name"

            )

            , React.createElement('input', {
              value: employeeName,
              onChange: (e) => setEmployeeName(e.target.value),
              placeholder: "e.g. Mani" ,
              className: "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}
            )
          )
        )
      )

      , message && (
        React.createElement('div', { className: "mb-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
          , message
        )
      )

      /* SUMMARY */
      , React.createElement('div', { className: "mb-5 grid gap-5 lg:grid-cols-[1fr_320px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}
        , React.createElement('section', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
          , React.createElement('div', { className: "bg-slate-950 p-6 text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}
            , React.createElement('div', { className: "flex items-start justify-between gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
                , React.createElement('div', { className: "flex items-center gap-2 text-blue-300"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}
                  , React.createElement(Sparkles, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}} )

                  , React.createElement('span', { className: "text-[10px] font-bold tracking-[0.16em]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}, "AI ONBOARDING AGENT"

                  )
                )

                , React.createElement('h2', { className: "mt-3 text-xl font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}, "Onboarding health summary"

                )

                , React.createElement('p', { className: "mt-2 max-w-2xl text-xs leading-5 text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}}
                  , analysis.summary
                )
              )

              , React.createElement('div', { className: "hidden h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-600 text-xl font-extrabold sm:grid"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}
                , completionText
              )
            )
          )

          , React.createElement('div', { className: "p-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}
            , React.createElement('div', { className: "mb-2 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
              , React.createElement('span', { className: "text-xs font-bold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}, "Onboarding completion"

              )

              , React.createElement('span', { className: "text-xs font-extrabold text-blue-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}}
                , completionText
              )
            )

            , React.createElement('div', { className: "h-3 overflow-hidden rounded-full bg-slate-100"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
              , React.createElement('div', {
                className: "h-full rounded-full bg-blue-600 transition-all"   ,
                style: {
                  width: `${analysis.completion || 0}%`,
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
              )
            )
          )
        )

        /* NEXT ACTION */
        , React.createElement('aside', { className: "card p-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
          , React.createElement('div', { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}
            , React.createElement(AlertTriangle, { size: 19, __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}} )
          )

          , React.createElement('h3', { className: "mt-4 text-sm font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}, "Next HR action"

          )

          , React.createElement('p', { className: "mt-2 text-xs leading-5 text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}
            , _optionalChain([analysis, 'access', _4 => _4.pending, 'optionalAccess', _5 => _5[0]]) ||
              "Review the employee onboarding status."
          )

          , React.createElement(Link, {
            to: "/onboarding",
            className: "mt-5 inline-flex items-center gap-2 text-xs font-bold text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}
, "Open onboarding"

            , React.createElement(ArrowRight, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}} )
          )
        )
      )

      /* CHECKLIST */
      , React.createElement('section', { className: "card mb-5 p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}
          , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}, "Onboarding checklist"

          )

          , React.createElement('p', { className: "mt-1 text-[11px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}, "AI checks the major onboarding areas and identifies incomplete work."


          )
        )

        , React.createElement('div', { className: "mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
          , checklist.map((item, index) => {
            const Icon = item.icon;

            const completed =
              index < 2
                ? (analysis.completed || []).length > 0
                : (analysis.completed || []).length >= 4;

            return (
              React.createElement('div', {
                key: item.title,
                className: "rounded-xl border border-slate-200 p-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}

                , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}
                  , React.createElement('div', { className: "grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}
                    , React.createElement(Icon, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}} )
                  )

                  , completed ? (
                    React.createElement(CheckCircle2, {
                      size: 18,
                      className: "text-emerald-500", __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}
                    )
                  ) : (
                    React.createElement(AlertTriangle, {
                      size: 18,
                      className: "text-amber-500", __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}
                    )
                  )
                )

                , React.createElement('h3', { className: "mt-4 text-xs font-extrabold text-slate-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}
                  , item.title
                )

                , React.createElement('p', { className: "mt-1 text-[10px] leading-4 text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}
                  , item.description
                )

                , React.createElement('div', { className: "mt-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}
                  , React.createElement('span', {
                    className: `rounded-full px-2 py-1 text-[9px] font-bold ${
                      completed
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}

                    , completed ? "Completed" : "Pending"
                  )
                )
              )
            );
          })
        )
      )

      /* COMPLETED / PENDING */
      , React.createElement('div', { className: "grid gap-5 lg:grid-cols-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}
        , React.createElement('section', { className: "card p-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}
            , React.createElement(CheckCircle2, {
              size: 17,
              className: "text-emerald-500", __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}
            )

            , React.createElement('h2', { className: "text-sm font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}, "Completed"

            )
          )

          , React.createElement('div', { className: "mt-4 space-y-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}
            , (analysis.completed || []).map((item) => (
              React.createElement('div', {
                key: item,
                className: "flex items-center gap-3 rounded-xl bg-emerald-50 p-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}

                , React.createElement(CheckCircle2, {
                  size: 15,
                  className: "shrink-0 text-emerald-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}
                )

                , React.createElement('span', { className: "text-xs text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}
                  , item
                )
              )
            ))

            , !_optionalChain([analysis, 'access', _6 => _6.completed, 'optionalAccess', _7 => _7.length]) && (
              React.createElement('p', { className: "text-xs text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}, "No completed onboarding tasks yet."

              )
            )
          )
        )

        , React.createElement('section', { className: "card p-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}
          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}
            , React.createElement(AlertTriangle, {
              size: 17,
              className: "text-amber-500", __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}
            )

            , React.createElement('h2', { className: "text-sm font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}, "Pending actions"

            )
          )

          , React.createElement('div', { className: "mt-4 space-y-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 388}}
            , (analysis.pending || []).map((item) => (
              React.createElement('div', {
                key: item,
                className: "flex items-center gap-3 rounded-xl bg-amber-50 p-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}

                , React.createElement(AlertTriangle, {
                  size: 15,
                  className: "shrink-0 text-amber-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}
                )

                , React.createElement('span', { className: "text-xs text-slate-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}
                  , item
                )
              )
            ))
          )
        )
      )

      /* RECOMMENDATIONS */
      , React.createElement('section', { className: "card mt-5 p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}
        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}
          , React.createElement(Sparkles, { size: 17, className: "text-blue-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}} )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}
            , React.createElement('h2', { className: "text-sm font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}, "AI recommendations"

            )

            , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}, "Suggested actions based on the current onboarding status."

            )
          )
        )

        , React.createElement('div', { className: "mt-5 space-y-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
          , (analysis.recommendations || []).map(
            (recommendation, index) => (
              React.createElement('div', {
                key: recommendation,
                className: "flex items-start gap-3 rounded-xl border border-slate-200 p-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 427}}

                , React.createElement('span', { className: "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-extrabold text-blue-600"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 431}}
                  , index + 1
                )

                , React.createElement('p', { className: "text-xs leading-5 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}
                  , recommendation
                )
              )
            )
          )
        )
      )
    )
  );
}