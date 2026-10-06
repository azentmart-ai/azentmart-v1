const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Onboarding/OnboardingJourney.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Laptop,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { onboardingService } from "../../services/onboardingService.js";

const CATEGORY_ICONS = {
  Profile: UserCheck,
  Documents: FileText,
  Policies: ShieldCheck,
  Training: GraduationCap,
  IT: Laptop,
};

export default function OnboardingJourney() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setError("");

    onboardingService
      .get(id)
      .then(setData)
      .catch((error) => {
        setError(
          _optionalChain([error, 'optionalAccess', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.detail]) ||
            "Unable to load onboarding journey."
        );
      });
  };

  useEffect(() => {
    load();
  }, [id]);

  const completedTasks = useMemo(
    () => _optionalChain([data, 'optionalAccess', _4 => _4.tasks, 'optionalAccess', _5 => _5.filter, 'call', _6 => _6((task) => task.completed), 'access', _7 => _7.length]) || 0,
    [data]
  );

  const totalTasks = _optionalChain([data, 'optionalAccess', _8 => _8.tasks, 'optionalAccess', _9 => _9.length]) || 0;

  const toggle = async (task) => {
    try {
      setUpdating(task.id);

      const updated = await onboardingService.updateTask(
        task.id,
        !task.completed
      );

      setData(updated);
    } catch (error) {
      setError(
        _optionalChain([error, 'optionalAccess', _10 => _10.response, 'optionalAccess', _11 => _11.data, 'optionalAccess', _12 => _12.detail]) ||
          "Unable to update onboarding task."
      );
    } finally {
      setUpdating(null);
    }
  };

  if (error) {
    return (
      React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}
        , React.createElement(Link, { to: "/onboarding", className: "btn", __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
          , React.createElement(ArrowLeft, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}} ), "Onboarding"

        )

        , React.createElement('div', { className: "error-box mt-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}, error)
      )
    );
  }

  if (!data) {
    return (
      React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
        , React.createElement('div', { className: "loading", __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}, "Loading onboarding journey..."  )
      )
    );
  }

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
      /* HEADER */
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
          , React.createElement(Link, {
            to: "/onboarding",
            className: "inline-flex items-center gap-2 text-xs font-bold text-slate-500"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}

            , React.createElement(ArrowLeft, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}} ), "Onboarding"

          )

          , React.createElement('h1', { className: "mt-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}, data.name)

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}, "Employee #"
             , data.employee_id, " · "  , data.status, " ·" , " "
            , data.progress || 0, "% complete"
          )
        )

        , React.createElement('div', { className: "flex gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
          , React.createElement(Link, {
            to: `/onboarding/ai?employee=${data.employee_id}`,
            className: "btn btn-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
, "AI Analysis"

          )
        )
      )

      /* PROGRESS */
      , React.createElement('div', { className: "card mb-5 p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
            , React.createElement('p', { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}, "Overall Progress"

            )

            , React.createElement('h2', { className: "mt-1 text-2xl font-extrabold text-slate-900"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
              , data.progress || 0, "%"
            )
          )

          , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}
            , React.createElement('p', { className: "text-xs font-bold text-slate-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
              , completedTasks, "/", totalTasks
            )

            , React.createElement('p', { className: "text-[10px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}, "Tasks completed"

            )
          )
        )

        , React.createElement('div', { className: "mt-4 h-3 overflow-hidden rounded-full bg-slate-100"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
          , React.createElement('div', {
            className: "h-full rounded-full bg-blue-600 transition-all"   ,
            style: {
              width: `${data.progress || 0}%`,
            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
          )
        )
      )

      /* CHECKLIST */
      , React.createElement('div', { className: "card p-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
        , React.createElement('div', { className: "mb-6 flex items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}
          , React.createElement('span', { className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}
            , React.createElement(ClipboardCheck, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}} )
          )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}
            , React.createElement('h2', { className: "text-sm font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}, "Onboarding checklist"

            )

            , React.createElement('p', { className: "text-[10px] text-slate-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}, "Complete every stage to move the employee journey forward."

            )
          )
        )

        , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
          , (data.tasks || []).map((task) => {
            const Icon =
              CATEGORY_ICONS[task.category] || ClipboardCheck;

            return (
              React.createElement('button', {
                key: task.id,
                type: "button",
                onClick: () => toggle(task),
                disabled: updating === task.id,
                className: "flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/30 disabled:opacity-60"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}

                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
                  , task.completed ? (
                    React.createElement(CheckCircle2, {
                      className: "text-emerald-600",
                      size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
                    )
                  ) : (
                    React.createElement(Circle, {
                      className: "text-slate-300",
                      size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}
                    )
                  )
                )

                , React.createElement('span', { className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}
                  , React.createElement(Icon, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}} )
                )

                , React.createElement('span', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}
                  , React.createElement('b', { className: "block text-xs text-slate-800"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}
                    , task.title
                  )

                  , React.createElement('span', { className: "text-[10px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
                    , task.category

                    , task.description
                      ? ` · ${task.description}`
                      : ""
                  )
                )

                , React.createElement('span', {
                  className: `badge ${
                    task.completed ? "success" : "warning"
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}

                  , updating === task.id
                    ? "Updating..."
                    : task.completed
                    ? "Completed"
                    : "Pending"
                )
              )
            );
          })
        )
      )

      /* QUICK LINKS */
      , React.createElement('div', { className: "mt-5 grid gap-4 md:grid-cols-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
        , React.createElement(Link, {
          to: "/onboarding/documents",
          className: "card p-5 transition hover:-translate-y-0.5 hover:border-blue-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}

          , React.createElement(FileText, { className: "text-blue-600", size: 19, __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}} )
          , React.createElement('h3', { className: "mt-3 text-sm font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}, "Documents"

          )
          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}, "Review employee onboarding documents."

          )
        )

        , React.createElement(Link, {
          to: "/onboarding/policies",
          className: "card p-5 transition hover:-translate-y-0.5 hover:border-blue-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}

          , React.createElement(ShieldCheck, { className: "text-blue-600", size: 19, __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}} )
          , React.createElement('h3', { className: "mt-3 text-sm font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}, "Policies"

          )
          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}, "Track required policy acknowledgements."

          )
        )

        , React.createElement(Link, {
          to: "/onboarding/training",
          className: "card p-5 transition hover:-translate-y-0.5 hover:border-blue-200"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}

          , React.createElement(GraduationCap, { className: "text-blue-600", size: 19, __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}} )
          , React.createElement('h3', { className: "mt-3 text-sm font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}, "Training"

          )
          , React.createElement('p', { className: "mt-1 text-[10px] text-slate-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}, "Track mandatory onboarding courses."

          )
        )
      )
    )
  );
}