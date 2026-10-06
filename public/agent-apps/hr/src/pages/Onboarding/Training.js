const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Onboarding/Training.jsx";import React, { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Play,
} from "lucide-react";

const initialCourses = [
  {
    id: 1,
    title: "Company Orientation",
    duration: "30 min",
    description:
      "Learn about the company, teams, culture and workplace expectations.",
  },
  {
    id: 2,
    title: "Security Awareness",
    duration: "25 min",
    description:
      "Understand security practices, passwords, phishing and access control.",
  },
  {
    id: 3,
    title: "Workplace Conduct",
    duration: "20 min",
    description:
      "Learn workplace behaviour, ethics and professional communication.",
  },
  {
    id: 4,
    title: "HR Systems Introduction",
    duration: "15 min",
    description:
      "Learn how to use attendance, leave, documents and employee HR systems.",
  },
  {
    id: 5,
    title: "Data Privacy",
    duration: "20 min",
    description:
      "Understand employee data handling and privacy responsibilities.",
  },
  {
    id: 6,
    title: "Workplace Safety",
    duration: "15 min",
    description:
      "Learn emergency procedures and workplace safety requirements.",
  },
];

export default function Training() {
  const [courses, setCourses] = useState(initialCourses);
  const [filter, setFilter] = useState("All");

  const completed = courses.filter(
    (course) => course.status === "Completed",
  ).length;

  const progress = Math.round((completed / courses.length) * 100);

  const filteredCourses = useMemo(() => {
    if (filter === "All") return courses;

    return courses.filter((course) => {
      const status = course.status || "Not started";

      return status === filter;
    });
  }, [courses, filter]);

  const startCourse = (id) => {
    setCourses((current) =>
      current.map((course) =>
        course.id === id
          ? {
              ...course,
              status: "Completed",
            }
          : course,
      ),
    );
  };

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
          , React.createElement('span', { className: "text-[10px] font-extrabold tracking-[0.16em] text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}, "LEARNING"

          )

          , React.createElement('h1', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}, "Onboarding Training" )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, "Complete the mandatory learning modules assigned to new employees."

          )
        )
      )

      /* SUMMARY */
      , React.createElement('div', { className: "mb-5 grid gap-4 md:grid-cols-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
          , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
              , React.createElement('p', { className: "text-[10px] font-bold uppercase text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}, "Courses"

              )

              , React.createElement('h2', { className: "mt-2 text-2xl font-extrabold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, courses.length)
            )

            , React.createElement(GraduationCap, { className: "text-blue-600", size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}} )
          )
        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}
          , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
              , React.createElement('p', { className: "text-[10px] font-bold uppercase text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Completed"

              )

              , React.createElement('h2', { className: "mt-2 text-2xl font-extrabold text-emerald-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
                , completed
              )
            )

            , React.createElement(CheckCircle2, { className: "text-emerald-500", size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}} )
          )
        )

        , React.createElement('div', { className: "card p-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
          , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
              , React.createElement('p', { className: "text-[10px] font-bold uppercase text-slate-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, "Progress"

              )

              , React.createElement('h2', { className: "mt-2 text-2xl font-extrabold text-blue-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
                , progress, "%"
              )
            )

            , React.createElement(Clock3, { className: "text-blue-600", size: 21, __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}} )
          )
        )
      )

      /* FILTER */
      , React.createElement('div', { className: "card mb-5 p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
        , React.createElement('div', { className: "flex flex-wrap gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
          , ["All", "Not started", "Completed"].map((item) => (
            React.createElement('button', {
              key: item,
              type: "button",
              onClick: () => setFilter(item),
              className: `rounded-lg px-3 py-2 text-[10px] font-bold ${
                filter === item
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}

              , item
            )
          ))
        )
      )

      /* COURSES */
      , React.createElement('div', { className: "grid gap-4 lg:grid-cols-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
        , filteredCourses.map((course) => {
          const isCompleted = course.status === "Completed";

          return (
            React.createElement('div', { className: "card p-5" , key: course.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
              , React.createElement('div', { className: "flex items-start gap-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
                , React.createElement('div', { className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                  , React.createElement(BookOpen, { size: 19, __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}} )
                )

                , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
                  , React.createElement('div', { className: "flex items-start justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                      , React.createElement('h3', { className: "text-sm font-extrabold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}, course.title)

                      , React.createElement('p', { className: "mt-1 text-[10px] leading-4 text-slate-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}
                        , course.description
                      )
                    )

                    , isCompleted ? (
                      React.createElement(CheckCircle2, { size: 18, className: "text-emerald-500", __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}} )
                    ) : (
                      React.createElement('span', { className: "badge warning" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}, "Not started" )
                    )
                  )

                  , React.createElement('div', { className: "mt-4 flex items-center justify-between"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
                    , React.createElement('span', { className: "text-[10px] font-semibold text-slate-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}, "Duration: "
                       , course.duration
                    )

                    , !isCompleted ? (
                      React.createElement('button', {
                        type: "button",
                        onClick: () => startCourse(course.id),
                        className: "btn btn-primary !min-h-8 !px-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}

                        , React.createElement(Play, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}} ), "Start Course"

                      )
                    ) : (
                      React.createElement('span', { className: "rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-600"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "Completed"

                      )
                    )
                  )
                )
              )
            )
          );
        })
      )

      , progress === 100 && (
        React.createElement('div', { className: "mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}, "✓ All mandatory onboarding training has been completed."

        )
      )
    )
  );
}
