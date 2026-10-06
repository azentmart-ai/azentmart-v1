const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/context/AuthContext.jsx";import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("azentmart_hr_token") || ""
  );
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("azentmart_hr_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .me()
      .then((currentUser) => {
        setUser(currentUser);
        localStorage.setItem(
          "azentmart_hr_user",
          JSON.stringify(currentUser)
        );
      })
      .catch(() => {
        localStorage.removeItem("azentmart_hr_token");
        localStorage.removeItem("azentmart_hr_user");
        setToken("");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    localStorage.setItem("azentmart_hr_token", result.access_token);
    localStorage.setItem(
      "azentmart_hr_user",
      JSON.stringify(result.user)
    );
    setToken(result.access_token);
    setUser(result.user);
    return result;
  };

  const signup = async (payload) => {
    return authService.signup(payload);
  };

  const logout = () => {
    localStorage.removeItem("azentmart_hr_token");
    localStorage.removeItem("azentmart_hr_user");
    setToken("");
    setUser(null);
  };

  return (
    React.createElement(AuthContext.Provider, {
      value: {
        token,
        user,
        loading,
        login,
        signup,
        logout
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}

      , children
    )
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
