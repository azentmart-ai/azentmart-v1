import React from "react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  tone = "blue"
}) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{trend}</small>
      </div>
    </div>
  );
}
