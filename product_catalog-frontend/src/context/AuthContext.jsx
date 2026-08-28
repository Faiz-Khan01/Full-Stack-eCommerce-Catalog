import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || localStorage.getItem("jwtToken") || null;
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token") || localStorage.getItem("jwtToken");
        setUser(storedUser ? JSON.parse(storedUser) : null);
        setToken(storedToken || null);
      } catch {
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = (userData, jwtToken) => {
    if (jwtToken) {
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("jwtToken", jwtToken);
      setToken(jwtToken);
    }
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    window.dispatchEvent(new Event("storage"));
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("jwtToken");
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event("storage"));
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(user?.role?.toUpperCase() === "ADMIN");

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};