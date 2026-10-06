const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Support/CreateTicket.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  FileText,
  LifeBuoy,
  Send,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { supportService } from "../../services/supportService.js";

import { SUPPORT_CATEGORIES } from "../../utils/constants.js";

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
        _optionalChain([err, 'access', _ => _.response, 'optionalAccess', _2 => _2.data, 'optionalAccess', _3 => _3.detail]) ||
          "Unable to create the support ticket."
      );

    } finally {

      setSaving(false);

    }

  };

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}

      /* BACK */

      , React.createElement(Link, {
        to: "/support",
        className: "btn mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}

        , React.createElement(ArrowLeft, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}} ), "HR Support"

      )

      /* HEADER */

      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}

          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}, "HR SERVICE DESK"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}, "Create support ticket"

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, "Submit an HR request and provide enough information for the support team to assist you."


          )

        )

      )

      /* CONTENT */

      , React.createElement('div', { className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}

        /* FORM */

        , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}

          , React.createElement('div', { className: "border-b border-slate-100 px-5 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}

            , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}

              , React.createElement('span', { className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
                , React.createElement(LifeBuoy, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}} )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}

                , React.createElement('h2', { className: "text-sm font-extrabold text-slate-950"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}, "Support request"

                )

                , React.createElement('p', { className: "mt-1 text-[10px] text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}, "Enter the details of your HR request."

                )

              )

            )

          )

          , React.createElement('form', {
            className: "space-y-5 p-5" ,
            onSubmit: submit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}


            /* ERROR */

            , error && (

              React.createElement('div', { className: "flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}

                , React.createElement(AlertCircle, {
                  size: 16,
                  className: "mt-0.5 shrink-0 text-red-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}

                  , React.createElement('p', { className: "text-[11px] font-extrabold text-red-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}, "Unable to submit request"

                  )

                  , React.createElement('p', { className: "mt-1 text-[10px] leading-5 text-red-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
                    , error
                  )

                )

              )

            )

            /* SUBJECT */

            , React.createElement('div', { className: "form-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}

              , React.createElement('label', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}, "Subject"

              )

              , React.createElement('input', {
                className: "input",
                required: true,
                maxLength: 200,
                placeholder: "Example: Need help updating my bank details"      ,
                value: form.subject,
                onChange: (event) =>
                  updateField(
                    "subject",
                    event.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
              )

              , React.createElement('span', { className: "mt-1 block text-[9px] text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}, "Provide a short title that describes your request."

              )

            )

            /* CATEGORY */

            , React.createElement('div', { className: "form-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 201}}

              , React.createElement('label', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}, "HR category"

              )

              , React.createElement('select', {
                className: "select",
                required: true,
                value: form.category,
                onChange: (event) =>
                  updateField(
                    "category",
                    event.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}


                , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}, "Select HR category"

                )

                , SUPPORT_CATEGORIES.map(
                  (category) => (
                    React.createElement('option', {
                      key: category,
                      value: category, __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}

                      , category
                    )
                  )
                )

              )

            )

            /* DESCRIPTION */

            , React.createElement('div', { className: "form-group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}

              , React.createElement('label', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}, "Request details"

              )

              , React.createElement('textarea', {
                className: "textarea min-h-[180px]" ,
                required: true,
                maxLength: 4000,
                placeholder: "Explain your request, issue or question in detail..."       ,
                value: form.description,
                onChange: (event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}
              )

              , React.createElement('div', { className: "mt-1 flex justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}

                , React.createElement('span', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}, "Include relevant information so HR can respond efficiently."

                )

                , React.createElement('span', { className: "text-[9px] text-slate-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}
                  , form.description.length, "/4000"
                )

              )

            )

            /* ACTIONS */

            , React.createElement('div', { className: "flex items-center justify-end gap-2 border-t border-slate-100 pt-5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}

              , React.createElement(Link, {
                to: "/support",
                className: "btn", __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
, "Cancel"

              )

              , React.createElement('button', {
                type: "submit",
                className: "btn btn-primary" ,
                disabled: saving, __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}


                , React.createElement(Send, {
                  size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
                )

                , saving
                  ? "Submitting..."
                  : "Submit ticket"

              )

            )

          )

        )

        /* RIGHT INFORMATION PANEL */

        , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}

          /* HOW IT WORKS */

          , React.createElement('div', { className: "card overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}

            , React.createElement('div', { className: "border-b border-slate-100 px-5 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}

              , React.createElement('span', { className: "text-[9px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}, "REQUEST PROCESS"

              )

              , React.createElement('h2', { className: "mt-1 text-sm font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}, "How support works"

              )

            )

            , React.createElement('div', { className: "divide-y divide-slate-100" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}

              , React.createElement('div', { className: "flex gap-3 p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}

                , React.createElement('span', { className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-[9px] font-extrabold text-blue-600"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}, "01"

                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 335}}

                  , React.createElement('p', { className: "text-[10px] font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}, "Submit request"

                  )

                  , React.createElement('p', { className: "mt-1 text-[9px] leading-4 text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}, "Provide the subject, category and request details."

                  )

                )

              )

              , React.createElement('div', { className: "flex gap-3 p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}

                , React.createElement('span', { className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-[9px] font-extrabold text-blue-600"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}, "02"

                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}

                  , React.createElement('p', { className: "text-[10px] font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}, "HR review"

                  )

                  , React.createElement('p', { className: "mt-1 text-[9px] leading-4 text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}, "People Operations reviews the submitted request."

                  )

                )

              )

              , React.createElement('div', { className: "flex gap-3 p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}

                , React.createElement('span', { className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-[9px] font-extrabold text-blue-600"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 371}}, "03"

                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}

                  , React.createElement('p', { className: "text-[10px] font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}, "Resolution"

                  )

                  , React.createElement('p', { className: "mt-1 text-[9px] leading-4 text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}, "HR updates the ticket when the request is resolved."

                  )

                )

              )

            )

          )

          /* REQUEST TIPS */

          , React.createElement('div', { className: "card bg-blue-50 p-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}

            , React.createElement('div', { className: "flex gap-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}}

              , React.createElement(FileText, {
                size: 16,
                className: "mt-0.5 shrink-0 text-blue-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}

                , React.createElement('h3', { className: "text-xs font-extrabold text-slate-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}, "Request tips"

                )

                , React.createElement('ul', { className: "mt-3 space-y-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}

                  , React.createElement('li', { className: "text-[10px] leading-4 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}, "• Use a clear and specific subject."

                  )

                  , React.createElement('li', { className: "text-[10px] leading-4 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}, "• Select the most relevant HR category."

                  )

                  , React.createElement('li', { className: "text-[10px] leading-4 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}, "• Include important dates or employee information when relevant."

                  )

                  , React.createElement('li', { className: "text-[10px] leading-4 text-slate-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}, "• Avoid sharing passwords or confidential credentials."

                  )

                )

              )

            )

          )

        )

      )

    )
  );
}