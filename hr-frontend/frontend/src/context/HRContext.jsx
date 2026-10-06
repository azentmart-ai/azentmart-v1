import React, { createContext, useContext, useMemo, useState } from "react";

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
    <HRContext.Provider value={value}>
      {children}
    </HRContext.Provider>
  );
}

export function useHR() {
  return useContext(HRContext);
}
