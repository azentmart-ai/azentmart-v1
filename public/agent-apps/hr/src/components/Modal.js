const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/components/Modal.jsx";import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) {
    return null;
  }

  return (
    React.createElement('div', { className: "modal-backdrop", onMouseDown: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}}
      , React.createElement('div', {
        className: "modal-card",
        onMouseDown: (event) => event.stopPropagation(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}

        , React.createElement('div', { className: "modal-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}
          , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}, title)
          , React.createElement('button', { className: "icon-button", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
            , React.createElement(X, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}} )
          )
        )
        , children
      )
    )
  );
}
