import React, { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Ticket as TicketIcon,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../services/api";

export default function Tickets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");

  const load = async () => {
    setLoading(true);

    try {
      const response = await api.get("/support");

      setItems(
        response.data?.items ||
          response.data ||
          []
      );
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {

      const matchesSearch =
        !query ||
        String(item.id || "")
          .toLowerCase()
          .includes(query) ||
        String(item.subject || "")
          .toLowerCase()
          .includes(query) ||
        String(item.category || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "All statuses" ||
        item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  const getStatusClass = (value) => {

    if (
      value === "Resolved" ||
      value === "Closed"
    ) {
      return "badge success";
    }

    if (value === "Pending") {
      return "badge warning";
    }

    if (value === "Rejected") {
      return "badge danger";
    }

    return "badge";
  };

  const total = items.length;

  const open = items.filter(
    (item) =>
      !["Resolved", "Closed"].includes(
        item.status
      )
  ).length;

  const resolved = items.filter(
    (item) =>
      item.status === "Resolved" ||
      item.status === "Closed"
  ).length;

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="text-[10px] font-extrabold tracking-[0.16em] text-blue-600">
            HR SERVICE DESK
          </span>

          <h1 className="mt-1">
            Support Tickets
          </h1>

          <p>
            View and track employee HR support requests.
          </p>

        </div>

        <div className="flex gap-2">

          <button
            type="button"
            className="btn"
            onClick={load}
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <Link
            className="btn btn-primary"
            to="/support/tickets/new"
          >
            <Plus size={14} />
            New ticket
          </Link>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="mb-4 grid gap-3 md:grid-cols-3">

        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Total Tickets
              </p>

              <p className="mt-2 text-2xl font-extrabold">
                {total}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                All HR requests
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <TicketIcon size={15} />
            </span>

          </div>

        </div>

        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Open
              </p>

              <p className="mt-2 text-2xl font-extrabold">
                {open}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Requests requiring attention
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600">
              <Clock3 size={15} />
            </span>

          </div>

        </div>

        <div className="card p-5">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Resolved
              </p>

              <p className="mt-2 text-2xl font-extrabold">
                {resolved}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Completed requests
              </p>

            </div>

            <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={15} />
            </span>

          </div>

        </div>

      </div>

      {/* RECORDS */}

      <div className="card overflow-hidden">

        <div className="border-b border-slate-100 px-5 py-4">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <h2 className="text-sm font-extrabold text-slate-950">
                Ticket records
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                Search and review HR service desk requests.
              </p>

            </div>

            <div className="flex gap-2">

              <div className="relative">

                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  className="input h-9 w-[220px] pl-8"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

              </div>

              <select
                className="select h-9 w-[145px]"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option>All statuses</option>
                <option>Open</option>
                <option>Pending</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>

            </div>

          </div>

        </div>

        {loading ? (

          <div className="loading">
            Loading support tickets...
          </div>

        ) : (

          <div className="table-wrap">

            <table>

              <thead>

                <tr>
                  <th>Ticket</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredItems.map((item) => (

                  <tr key={item.id}>

                    <td>

                      <div className="flex items-center gap-2">

                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                          <TicketIcon size={13} />
                        </span>

                        <span className="text-[10px] font-extrabold">
                          #{item.id}
                        </span>

                      </div>

                    </td>

                    <td>

                      <div>

                        <p className="text-[11px] font-extrabold text-slate-800">
                          {item.subject ||
                            "Untitled request"}
                        </p>

                        {item.description && (
                          <p className="mt-0.5 max-w-[320px] truncate text-[9px] text-slate-400">
                            {item.description}
                          </p>
                        )}

                      </div>

                    </td>

                    <td>
                      <span className="text-[10px] text-slate-600">
                        {item.category ||
                          "General HR"}
                      </span>
                    </td>

                    <td>

                      <span
                        className={getStatusClass(
                          item.status
                        )}
                      >
                        {item.status || "Open"}
                      </span>

                    </td>

                    <td>

                      <span className="text-[10px] text-slate-500">
                        {item.created_at
                          ? String(
                              item.created_at
                            ).slice(0, 10)
                          : "—"}
                      </span>

                    </td>

                    <td>

                      <button
                        type="button"
                        className="btn !min-h-8 !px-2.5"
                      >
                        <Eye size={12} />
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {!filteredItems.length && (

              <div className="empty-state py-14">

                <TicketIcon className="mx-auto mb-3 text-slate-300" />

                <strong>
                  No support tickets found
                </strong>

                <p>
                  Create a new HR request to get started.
                </p>

                <Link
                  to="/support/tickets/new"
                  className="btn btn-primary mt-4"
                >
                  <Plus size={13} />
                  New ticket
                </Link>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}