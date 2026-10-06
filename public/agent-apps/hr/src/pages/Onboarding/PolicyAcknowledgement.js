const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Onboarding/PolicyAcknowledgement.jsx";import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
const policies = [
  "Code of conduct",
  "Information security",
  "Leave and attendance policy",
  "Remote work policy"
];

export default function PolicyAcknowledgement() {
  const [acknowledged, setAcknowledged] = useState([]);

  const toggle = (policy) => {
    setAcknowledged((current) =>
      current.includes(policy)
        ? current.filter((item) => item !== policy)
        : [...current, policy]
    );
  };

  return (
    React.createElement('div', { className: "page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}
      , React.createElement('div', { className: "page-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "Policy acknowledgement" )
          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}, "Review and acknowledge onboarding policies."    )
        )
      )

      , React.createElement('div', { className: "card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
        , policies.map((policy) => {
          const checked = acknowledged.includes(policy);

          return (
            React.createElement('button', {
              key: policy,
              className: "nav-link",
              onClick: () => toggle(policy),
              style: {
                minHeight: "58px",
                borderBottom: "1px solid #eef0f4"
              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}

              , React.createElement(CheckCircle2, { color: checked ? "#12b76a" : "#98a2b3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}, policy)
              , React.createElement('span', { style: { marginLeft: "auto" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
                , checked ? "Acknowledged" : "Acknowledge"
              )
            )
          );
        })
      )
    )
  );
}
