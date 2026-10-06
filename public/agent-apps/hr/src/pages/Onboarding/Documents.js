const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Onboarding/Documents.jsx";import React from "react";
import { FileText, Upload } from "lucide-react";
const requiredDocuments = [
  "Government identity proof",
  "Address proof",
  "Bank account details",
  "Education certificates",
  "Previous employment documents"
];

export default function Documents() {
  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}
          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}, "Onboarding documents" )
          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}, "Track documents required for new employees."     )
        )
      )

      , React.createElement('div', { className: "resource-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
        , requiredDocuments.map((document) => (
          React.createElement('div', { className: "resource-card", key: document, __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
            , React.createElement(FileText, { color: "#155eef", __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} )
            , React.createElement('h3', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, document)
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}, "Required for onboarding verification."   )
            , React.createElement('button', { className: "btn", __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
              , React.createElement(Upload, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}} ), "Upload"

            )
          )
        ))
      )
    )
  );
}
