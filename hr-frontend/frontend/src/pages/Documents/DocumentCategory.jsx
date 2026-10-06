import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DEFAULT_DOCUMENTS } from "./Documents";

const categoryDescriptions = {
  "Employee Records": "Employee personal, contact and emergency information.",
  "Identity & Compliance": "Identity verification and compliance records.",
  Employment: "Offer letters, employment agreements and role documentation.",
  "Payroll & Finance": "Salary, bank, tax and payroll-related records.",
  Benefits: "Benefits enrollment, insurance and dependent information.",
  "Leave & Attendance": "Leave, attendance and regularization records.",
  Performance: "Performance reviews, goals and manager feedback.",
  "Training & Development": "Training, orientation and development records.",
  Policies: "Company policies, conduct and information security documents.",
  Recruitment: "Candidate and interview-related recruitment documents.",
  "Company Documents": "Company-wide HR guides and organizational documents.",
  Certificates: "Education, experience and professional certificates.",
  Other: "Other employee, IT and exit-related HR documents.",
};

function CategoryIcon({ category }) {
  if (category === "Policies" || category === "Identity & Compliance") {
    return <ShieldCheck size={22} />;
  }
  if (category === "Employee Records") return <Users size={22} />;
  if (category === "Certificates" || category === "Training & Development") {
    return <FileCheck2 size={22} />;
  }
  if (category === "Leave & Attendance") return <CalendarDays size={22} />;
  return <FileText size={22} />;
}

export default function DocumentCategory() {
  const { category: encodedCategory } = useParams();
  const navigate = useNavigate();
  const category = decodeURIComponent(encodedCategory || "");

  const [search, setSearch] = useState("");

  const documents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return DEFAULT_DOCUMENTS.filter((document) => {
      const matchesCategory = document.category === category;
      const matchesSearch =
        !query ||
        document.title?.toLowerCase().includes(query) ||
        document.employee?.toLowerCase().includes(query) ||
        document.description?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const exists = Boolean(categoryDescriptions[category]);

  if (!exists) {
    return (
      <div className="page">
        <button className="btn" onClick={() => navigate("/documents")}>
          <ArrowLeft size={15} />
          Documents
        </button>

        <div className="card mt-4 p-8 text-center">
          <FileText className="mx-auto mb-3 text-slate-300" size={38} />
          <h2 className="text-lg font-extrabold">Category not found</h2>
          <p className="mt-2 text-sm text-slate-500">
            The requested document category does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="mb-3 flex items-center gap-2 text-[11px] font-bold text-blue-600 hover:text-blue-700"
            onClick={() => navigate("/documents")}
          >
            <ArrowLeft size={14} />
            Back to document library
          </button>

          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <CategoryIcon category={category} />
            </span>

            <div>
              <span className="text-[10px] font-extrabold tracking-[.16em] text-blue-600">
                DOCUMENT CATEGORY
              </span>

              <h1 className="mt-1">{category}</h1>

              <p>{categoryDescriptions[category]}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            TOTAL DOCUMENTS
          </p>
          <p className="mt-2 text-2xl font-extrabold">{documents.length}</p>
          <p className="mt-1 text-[10px] text-slate-400">
            Available in this category
          </p>
        </div>

        <div className="card p-5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            AVAILABLE
          </p>
          <p className="mt-2 text-2xl font-extrabold">
            {documents.filter((x) => x.status === "Available").length}
          </p>
          <p className="mt-1 text-[10px] text-slate-400">Reference documents</p>
        </div>

        <div className="card p-5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            VERIFIED / ACTIVE
          </p>
          <p className="mt-2 text-2xl font-extrabold">
            {
              documents.filter(
                (x) =>
                  x.status === "Verified" ||
                  x.status === "Active" ||
                  x.status === "Completed",
              ).length
            }
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            Completed or verified records
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[14px] font-extrabold">{category} documents</h2>
            <p className="mt-1 text-[9px] text-slate-400">
              Select a document to view its details.
            </p>
          </div>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${category.toLowerCase()}...`}
              className="h-9 w-[240px] rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[10px] outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {documents.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>DOCUMENT</th>
                  <th>EMPLOYEE</th>
                  <th>STATUS</th>
                  <th>EXPIRY</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                          <FileText size={15} />
                        </span>
                        <div>
                          <p className="text-[11px] font-bold">
                            {document.title}
                          </p>
                          <p className="max-w-[520px] text-[9px] text-slate-400">
                            {document.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="text-[10px]">
                        {document.employee || "Company"}
                      </span>
                    </td>

                    <td>
                      <span className="badge success">
                        <CheckCircle2 size={10} className="mr-1 inline" />
                        {document.status}
                      </span>
                    </td>

                    <td>
                      <span className="text-[10px] text-slate-500">
                        {document.expiry_date || "—"}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/documents/default/${document.id}`}
                        state={{ document }}
                        className="btn !min-h-8 !px-2"
                      >
                        <Eye size={13} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <FileText className="mx-auto mb-2 text-slate-300" size={30} />
            <strong>No documents found</strong>
            <p>Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
