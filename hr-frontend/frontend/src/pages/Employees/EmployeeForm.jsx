import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { employeeService } from "../../services/employeeService";
import { DEPARTMENTS } from "../../utils/constants";

const fields = [
  ["name", "Full name", "text"],
  ["email", "Email", "email"],
  ["phone", "Phone", "text"],
  ["designation", "Role / designation", "text"],
  ["department", "Department", "select"],
  ["location", "Location", "text"],
  ["manager", "Manager", "text"],
  ["employment_type", "Employment type", "select"],
  ["join_date", "Date of joining", "date"],
  ["date_of_birth", "Date of birth", "date"],
  ["salary", "Annual salary", "number"],
  ["bank_name", "Bank name", "text"],
  ["bank_account", "Bank account", "text"],
  ["ifsc_code", "IFSC code", "text"],
];

const empty = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  department: "",
  location: "",
  manager: "",
  employment_type: "Full-time",
  join_date: "",
  date_of_birth: "",
  salary: "",
  bank_name: "",
  bank_account: "",
  ifsc_code: "",
};

export default function EmployeeForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const nav = useNavigate();
  const [f, setF] = useState(empty);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) return;
    employeeService.get(id).then((data) => {
      setF({
        ...empty,
        ...data,
        salary: data.salary ?? "",
        join_date: data.join_date ?? "",
        date_of_birth: data.date_of_birth ?? "",
      });
    }).catch((x) => setErr(x.response?.data?.detail || "Unable to load employee."));
  }, [editing, id]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const payload = {
        ...f,
        salary: f.salary === "" ? null : Number(f.salary),
        join_date: f.join_date || null,
        date_of_birth: f.date_of_birth || null,
      };
      if (editing) {
        await employeeService.update(id, payload);
      } else {
        await employeeService.create(payload);
      }
      nav(editing ? `/employees/${id}` : "/employees");
    } catch (x) {
      setErr(x.response?.data?.detail || "Unable to save employee.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Link className="inline-flex items-center gap-2 text-xs font-bold text-slate-500" to={editing ? `/employees/${id}` : "/employees"}>
            <ArrowLeft size={14} /> Employees
          </Link>
          <h1 className="mt-4">{editing ? "Edit employee" : "Add employee"}</h1>
          <p>{editing ? "Update the complete employee record." : "Create a complete employee record for the HR workspace."}</p>
        </div>
      </div>

      <form onSubmit={submit} className="card p-5 sm:p-7">
        {err && <div className="error-box mb-5">{err}</div>}
        <div className="form-grid">
          {fields.map(([key, label, type]) => (
            <div className="form-group" key={key}>
              <label>{label}</label>
              {type === "select" ? (
                <select className="select" value={f[key] || ""} onChange={(e) => setF({ ...f, [key]: e.target.value })}>
                  {key === "department" ? (
                    <>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((x) => <option key={x}>{x}</option>)}
                    </>
                  ) : (
                    ["Full-time", "Part-time", "Contract", "Intern"].map((x) => <option key={x}>{x}</option>)
                  )}
                </select>
              ) : (
                <input
                  className="input"
                  type={type}
                  required={["name", "email"].includes(key)}
                  value={f[key] ?? ""}
                  onChange={(e) => setF({ ...f, [key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-7 flex justify-end gap-2">
          <Link className="btn" to={editing ? `/employees/${id}` : "/employees"}>Cancel</Link>
          <button className="btn btn-primary" disabled={busy}>
            <Save size={14} />
            {busy ? "Saving…" : editing ? "Save changes" : "Create employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
