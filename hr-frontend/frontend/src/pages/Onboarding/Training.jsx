import React, { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Play,
} from "lucide-react";

import "../Page.css";

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
    <div className="page">
      <div className="page-header">
        <div>
          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            LEARNING
          </span>

          <h1 className="mt-1">Onboarding Training</h1>

          <p>
            Complete the mandatory learning modules assigned to new employees.
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Courses
              </p>

              <h2 className="mt-2 text-2xl font-extrabold">{courses.length}</h2>
            </div>

            <GraduationCap className="text-blue-600" size={21} />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Completed
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-emerald-600">
                {completed}
              </h2>
            </div>

            <CheckCircle2 className="text-emerald-500" size={21} />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Progress
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-blue-600">
                {progress}%
              </h2>
            </div>

            <Clock3 className="text-blue-600" size={21} />
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="card mb-5 p-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Not started", "Completed"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-lg px-3 py-2 text-[10px] font-bold ${
                filter === item
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* COURSES */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredCourses.map((course) => {
          const isCompleted = course.status === "Completed";

          return (
            <div className="card p-5" key={course.id}>
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen size={19} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-extrabold">{course.title}</h3>

                      <p className="mt-1 text-[10px] leading-4 text-slate-500">
                        {course.description}
                      </p>
                    </div>

                    {isCompleted ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <span className="badge warning">Not started</span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400">
                      Duration: {course.duration}
                    </span>

                    {!isCompleted ? (
                      <button
                        type="button"
                        onClick={() => startCourse(course.id)}
                        className="btn btn-primary !min-h-8 !px-3"
                      >
                        <Play size={13} />
                        Start Course
                      </button>
                    ) : (
                      <span className="rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-600">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {progress === 100 && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
          ✓ All mandatory onboarding training has been completed.
        </div>
      )}
    </div>
  );
}
