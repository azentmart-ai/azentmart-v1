import React, { useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  FileText,
  LifeBuoy,
  Send,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { supportService } from "../../services/supportService";

import { SUPPORT_CATEGORIES } from "../../utils/constants";

export default function CreateTicket() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    category: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

  };

  const submit = async (event) => {

    event.preventDefault();

    setError("");
    setSaving(true);

    try {

      await supportService.create({
        subject: form.subject.trim(),
        category: form.category,
        description: form.description.trim(),
      });

      navigate("/support/tickets");

    } catch (err) {

      setError(
        err.response?.data?.detail ||
          "Unable to create the support ticket."
      );

    } finally {

      setSaving(false);

    }

  };

  return (
    <div className="page">

      {/* BACK */}

      <Link
        to="/support"
        className="btn mb-4"
      >
        <ArrowLeft size={14} />
        HR Support
      </Link>

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            HR SERVICE DESK
          </span>

          <h1 className="mt-1">
            Create support ticket
          </h1>

          <p>
            Submit an HR request and provide enough information
            for the support team to assist you.
          </p>

        </div>

      </div>

      {/* CONTENT */}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">

        {/* FORM */}

        <div className="card overflow-hidden">

          <div className="border-b border-slate-100 px-5 py-4">

            <div className="flex items-center gap-3">

              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <LifeBuoy size={18} />
              </span>

              <div>

                <h2 className="text-sm font-extrabold text-slate-950">
                  Support request
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Enter the details of your HR request.
                </p>

              </div>

            </div>

          </div>

          <form
            className="space-y-5 p-5"
            onSubmit={submit}
          >

            {/* ERROR */}

            {error && (

              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">

                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <div>

                  <p className="text-[11px] font-extrabold text-red-700">
                    Unable to submit request
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-red-600">
                    {error}
                  </p>

                </div>

              </div>

            )}

            {/* SUBJECT */}

            <div className="form-group">

              <label>
                Subject
              </label>

              <input
                className="input"
                required
                maxLength={200}
                placeholder="Example: Need help updating my bank details"
                value={form.subject}
                onChange={(event) =>
                  updateField(
                    "subject",
                    event.target.value
                  )
                }
              />

              <span className="mt-1 block text-[9px] text-slate-400">
                Provide a short title that describes your request.
              </span>

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label>
                HR category
              </label>

              <select
                className="select"
                required
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value
                  )
                }
              >

                <option value="">
                  Select HR category
                </option>

                {SUPPORT_CATEGORIES.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Request details
              </label>

              <textarea
                className="textarea min-h-[180px]"
                required
                maxLength={4000}
                placeholder="Explain your request, issue or question in detail..."
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
              />

              <div className="mt-1 flex justify-between">

                <span className="text-[9px] text-slate-400">
                  Include relevant information so HR can respond efficiently.
                </span>

                <span className="text-[9px] text-slate-400">
                  {form.description.length}/4000
                </span>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-5">

              <Link
                to="/support"
                className="btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >

                <Send
                  size={13}
                />

                {saving
                  ? "Submitting..."
                  : "Submit ticket"}

              </button>

            </div>

          </form>

        </div>

        {/* RIGHT INFORMATION PANEL */}

        <div className="space-y-4">

          {/* HOW IT WORKS */}

          <div className="card overflow-hidden">

            <div className="border-b border-slate-100 px-5 py-4">

              <span className="text-[9px] font-extrabold tracking-[0.16em] text-blue-600">
                REQUEST PROCESS
              </span>

              <h2 className="mt-1 text-sm font-extrabold">
                How support works
              </h2>

            </div>

            <div className="divide-y divide-slate-100">

              <div className="flex gap-3 p-4">

                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-[9px] font-extrabold text-blue-600">
                  01
                </span>

                <div>

                  <p className="text-[10px] font-extrabold">
                    Submit request
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-slate-400">
                    Provide the subject, category and request details.
                  </p>

                </div>

              </div>

              <div className="flex gap-3 p-4">

                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-[9px] font-extrabold text-blue-600">
                  02
                </span>

                <div>

                  <p className="text-[10px] font-extrabold">
                    HR review
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-slate-400">
                    People Operations reviews the submitted request.
                  </p>

                </div>

              </div>

              <div className="flex gap-3 p-4">

                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-[9px] font-extrabold text-blue-600">
                  03
                </span>

                <div>

                  <p className="text-[10px] font-extrabold">
                    Resolution
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-slate-400">
                    HR updates the ticket when the request is resolved.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* REQUEST TIPS */}

          <div className="card bg-blue-50 p-5">

            <div className="flex gap-3">

              <FileText
                size={16}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <h3 className="text-xs font-extrabold text-slate-900">
                  Request tips
                </h3>

                <ul className="mt-3 space-y-2">

                  <li className="text-[10px] leading-4 text-slate-600">
                    • Use a clear and specific subject.
                  </li>

                  <li className="text-[10px] leading-4 text-slate-600">
                    • Select the most relevant HR category.
                  </li>

                  <li className="text-[10px] leading-4 text-slate-600">
                    • Include important dates or employee information when relevant.
                  </li>

                  <li className="text-[10px] leading-4 text-slate-600">
                    • Avoid sharing passwords or confidential credentials.
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}