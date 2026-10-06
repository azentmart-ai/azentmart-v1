import React, { useEffect, useMemo, useState } from "react";
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
import api from "../../services/api";

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
        error?.response?.data?.detail ||
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
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            INTELLIGENCE
          </span>

          <h1 className="mt-1">AI Onboarding Assistant</h1>

          <p>
            Use AI to identify missing onboarding tasks, summarize progress
            and recommend the next HR actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/onboarding" className="btn">
            Back to onboarding
          </Link>

          <button
            type="button"
            onClick={runAIAnalysis}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Analyze with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* EMPLOYEE SELECTOR */}
      <div className="card mb-5 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Employee ID
            </label>

            <input
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g. 25"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Employee Name
            </label>

            <input
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="e.g. Mani"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          {message}
        </div>
      )}

      {/* SUMMARY */}
      <div className="mb-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="card overflow-hidden">
          <div className="bg-slate-950 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-blue-300">
                  <Sparkles size={17} />

                  <span className="text-[10px] font-bold tracking-[0.16em]">
                    AI ONBOARDING AGENT
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-extrabold">
                  Onboarding health summary
                </h2>

                <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">
                  {analysis.summary}
                </p>
              </div>

              <div className="hidden h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-600 text-xl font-extrabold sm:grid">
                {completionText}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Onboarding completion
              </span>

              <span className="text-xs font-extrabold text-blue-600">
                {completionText}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${analysis.completion || 0}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* NEXT ACTION */}
        <aside className="card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle size={19} />
          </div>

          <h3 className="mt-4 text-sm font-extrabold text-slate-900">
            Next HR action
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {analysis.pending?.[0] ||
              "Review the employee onboarding status."}
          </p>

          <Link
            to="/onboarding"
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-blue-600"
          >
            Open onboarding
            <ArrowRight size={13} />
          </Link>
        </aside>
      </div>

      {/* CHECKLIST */}
      <section className="card mb-5 p-6">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900">
            Onboarding checklist
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            AI checks the major onboarding areas and identifies incomplete
            work.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {checklist.map((item, index) => {
            const Icon = item.icon;

            const completed =
              index < 2
                ? (analysis.completed || []).length > 0
                : (analysis.completed || []).length >= 4;

            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={17} />
                  </div>

                  {completed ? (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-500"
                    />
                  ) : (
                    <AlertTriangle
                      size={18}
                      className="text-amber-500"
                    />
                  )}
                </div>

                <h3 className="mt-4 text-xs font-extrabold text-slate-800">
                  {item.title}
                </h3>

                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-3">
                  <span
                    className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                      completed
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPLETED / PENDING */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={17}
              className="text-emerald-500"
            />

            <h2 className="text-sm font-extrabold">
              Completed
            </h2>
          </div>

          <div className="mt-4 space-y-2">
            {(analysis.completed || []).map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3"
              >
                <CheckCircle2
                  size={15}
                  className="shrink-0 text-emerald-600"
                />

                <span className="text-xs text-slate-700">
                  {item}
                </span>
              </div>
            ))}

            {!analysis.completed?.length && (
              <p className="text-xs text-slate-400">
                No completed onboarding tasks yet.
              </p>
            )}
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={17}
              className="text-amber-500"
            />

            <h2 className="text-sm font-extrabold">
              Pending actions
            </h2>
          </div>

          <div className="mt-4 space-y-2">
            {(analysis.pending || []).map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl bg-amber-50 p-3"
              >
                <AlertTriangle
                  size={15}
                  className="shrink-0 text-amber-600"
                />

                <span className="text-xs text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* RECOMMENDATIONS */}
      <section className="card mt-5 p-6">
        <div className="flex items-center gap-2">
          <Sparkles size={17} className="text-blue-600" />

          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              AI recommendations
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Suggested actions based on the current onboarding status.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {(analysis.recommendations || []).map(
            (recommendation, index) => (
              <div
                key={recommendation}
                className="flex items-start gap-3 rounded-xl border border-slate-200 p-4"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-extrabold text-blue-600">
                  {index + 1}
                </span>

                <p className="text-xs leading-5 text-slate-600">
                  {recommendation}
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}