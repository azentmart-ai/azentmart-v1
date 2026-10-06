import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import EmptyState from "./EmptyState";
import Loading from "./Loading";
import "../pages/Page.css";

export default function ResourcePage({
  title,
  description,
  service,
  icon: Icon,
  action,
  renderItem
}) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    service
      .list()
      .then((data) => {
        if (active) {
          setItems(Array.isArray(data) ? data : data.items || []);
        }
      })
      .catch(() => {
        if (active) {
          setItems([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [service]);

  const filtered = items.filter((item) => {
    const text = JSON.stringify(item).toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>
            {Icon ? <Icon size={25} /> : null}
            {title}
          </h1>
          <p>{description}</p>
        </div>
        {action}
      </div>

      <div className="page-toolbar">
        <div className="topbar-search search-input">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title={`No ${title.toLowerCase()} found`}
            message="Try another search or add the first record."
          />
        </div>
      ) : (
        <div className="resource-grid">
          {filtered.map((item) => renderItem(item))}
        </div>
      )}
    </div>
  );
}
