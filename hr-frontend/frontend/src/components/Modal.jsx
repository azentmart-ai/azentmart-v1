import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
