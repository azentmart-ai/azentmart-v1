const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/context/HRContext.jsx";import React, { createContext, useContext, useMemo, useState } from "react";

const HRContext = createContext(null);

export function HRProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const value = useMemo(
    () => ({
      refreshKey,
      refresh: () => setRefreshKey((value) => value + 1)
    }),
    [refreshKey]
  );

  return (
    React.createElement(HRContext.Provider, { value: value, __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
      , children
    )
  );
}

export function useHR() {
  return useContext(HRContext);
}
