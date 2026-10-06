import React from "react";

export default function EmptyState({
  title = "Nothing here yet",
  message = "There are no records to display."
}) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}
