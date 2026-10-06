import React, { useEffect, useMemo, useState } from "react";
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
import { onboardingService } from "../../services/onboardingService";

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
          error?.response?.data?.detail ||
            "Unable to load onboarding journey."
        );
      });
  };

  useEffect(() => {
    load();
  }, [id]);

  const completedTasks = useMemo(
    () => data?.tasks?.filter((task) => task.completed).length || 0,
    [data]
  );

  const totalTasks = data?.tasks?.length || 0;

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
        error?.response?.data?.detail ||
          "Unable to update onboarding task."
      );
    } finally {
      setUpdating(null);
    }
  };

  if (error) {
    return (
      <div className="page">
        <Link to="/onboarding" className="btn">
          <ArrowLeft size={14} />
          Onboarding
        </Link>

        <div className="error-box mt-4">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <div className="loading">Loading onboarding journey...</div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500"
          >
            <ArrowLeft size={14} />
            Onboarding
          </Link>

          <h1 className="mt-4">{data.name}</h1>

          <p>
            Employee #{data.employee_id} · {data.status} ·{" "}
            {data.progress || 0}% complete
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/onboarding/ai?employee=${data.employee_id}`}
            className="btn btn-primary"
          >
            AI Analysis
          </Link>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="card mb-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overall Progress
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              {data.progress || 0}%
            </h2>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-slate-700">
              {completedTasks}/{totalTasks}
            </p>

            <p className="text-[10px] text-slate-400">
              Tasks completed
            </p>
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${data.progress || 0}%`,
            }}
          />
        </div>
      </div>

      {/* CHECKLIST */}
      <div className="card p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <ClipboardCheck size={18} />
          </span>

          <div>
            <h2 className="text-sm font-extrabold">
              Onboarding checklist
            </h2>

            <p className="text-[10px] text-slate-500">
              Complete every stage to move the employee journey forward.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(data.tasks || []).map((task) => {
            const Icon =
              CATEGORY_ICONS[task.category] || ClipboardCheck;

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => toggle(task)}
                disabled={updating === task.id}
                className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/30 disabled:opacity-60"
              >
                <span>
                  {task.completed ? (
                    <CheckCircle2
                      className="text-emerald-600"
                      size={21}
                    />
                  ) : (
                    <Circle
                      className="text-slate-300"
                      size={21}
                    />
                  )}
                </span>

                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500">
                  <Icon size={16} />
                </span>

                <span className="flex-1">
                  <b className="block text-xs text-slate-800">
                    {task.title}
                  </b>

                  <span className="text-[10px] text-slate-400">
                    {task.category}

                    {task.description
                      ? ` · ${task.description}`
                      : ""}
                  </span>
                </span>

                <span
                  className={`badge ${
                    task.completed ? "success" : "warning"
                  }`}
                >
                  {updating === task.id
                    ? "Updating..."
                    : task.completed
                    ? "Completed"
                    : "Pending"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Link
          to="/onboarding/documents"
          className="card p-5 transition hover:-translate-y-0.5 hover:border-blue-200"
        >
          <FileText className="text-blue-600" size={19} />
          <h3 className="mt-3 text-sm font-extrabold">
            Documents
          </h3>
          <p className="mt-1 text-[10px] text-slate-500">
            Review employee onboarding documents.
          </p>
        </Link>

        <Link
          to="/onboarding/policies"
          className="card p-5 transition hover:-translate-y-0.5 hover:border-blue-200"
        >
          <ShieldCheck className="text-blue-600" size={19} />
          <h3 className="mt-3 text-sm font-extrabold">
            Policies
          </h3>
          <p className="mt-1 text-[10px] text-slate-500">
            Track required policy acknowledgements.
          </p>
        </Link>

        <Link
          to="/onboarding/training"
          className="card p-5 transition hover:-translate-y-0.5 hover:border-blue-200"
        >
          <GraduationCap className="text-blue-600" size={19} />
          <h3 className="mt-3 text-sm font-extrabold">
            Training
          </h3>
          <p className="mt-1 text-[10px] text-slate-500">
            Track mandatory onboarding courses.
          </p>
        </Link>
      </div>
    </div>
  );
}