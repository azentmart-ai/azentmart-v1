const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/components/ResourcePage.jsx";import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import EmptyState from "./EmptyState.js";
import Loading from "./Loading.js";
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
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
            , Icon ? React.createElement(Icon, { size: 25, __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}} ) : null
            , title
          )
          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}, description)
        )
        , action
      )

      , React.createElement('div', { className: "page-toolbar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
        , React.createElement('div', { className: "topbar-search search-input" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
          , React.createElement(Search, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}} )
          , React.createElement('input', {
            value: query,
            onChange: (event) => setQuery(event.target.value),
            placeholder: `Search ${title.toLowerCase()}...`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
          )
        )
      )

      , loading ? (
        React.createElement(Loading, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 73}} )
      ) : filtered.length === 0 ? (
        React.createElement('div', { className: "card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
          , React.createElement(EmptyState, {
            title: `No ${title.toLowerCase()} found`,
            message: "Try another search or add the first record."       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
          )
        )
      ) : (
        React.createElement('div', { className: "resource-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
          , filtered.map((item) => renderItem(item))
        )
      )
    )
  );
}
