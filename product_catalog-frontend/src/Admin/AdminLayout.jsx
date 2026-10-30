import React from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useTheme, themes } from "../App";

const AdminLayout = ({ children }) => {
  const { darkMode, toggleTheme } = useTheme();
  const theme = darkMode ? themes.dark : themes.light;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: darkMode ? "#0c0d12" : theme.background,
        color: darkMode ? "#f8fafc" : theme.textPrimary,
      }}
    >
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header Bar matching Reference Video */}
        <header
          style={{
            height: "64px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            background: darkMode ? "#0e0f14" : theme.cardSolid,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            gap: "16px",
            zIndex: 40,
          }}
        >
          {/* Go to storefront button */}
          <Link
            to="/"
            className="text-decoration-none d-inline-flex align-items-center gap-2"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              padding: "6px 14px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(224, 122, 66, 0.15)";
              e.currentTarget.style.borderColor = "#e07a42";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            }}
          >
            <span>Go to storefront</span>
            <span style={{ fontSize: "12px" }}>↗</span>
          </Link>

          {/* Right actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Search Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "30px",
                padding: "6px 14px",
                width: "200px",
              }}
            >
              <span style={{ opacity: 0.5, fontSize: "12px" }}>🔍</span>
              <input
                type="text"
                placeholder="Search..."
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "12px",
                  width: "100%",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                ⌘K
              </span>
            </div>

            {/* Language dropdown */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "30px",
                padding: "6px 12px",
                fontSize: "12px",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <span>🇺🇸</span>
              <span style={{ fontWeight: 600 }}>EN</span>
              <span style={{ fontSize: "10px", opacity: 0.6 }}>⌄</span>
            </div>

            {/* Demo API keys */}
            <div
              style={{
                background: "rgba(224, 122, 66, 0.12)",
                border: "1px solid rgba(224, 122, 66, 0.3)",
                borderRadius: "30px",
                padding: "6px 12px",
                fontSize: "12px",
                color: "#e07a42",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <span>🔑</span>
              <span>Demo API keys</span>
            </div>

            {/* User Profile Chip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "30px",
                padding: "4px 10px 4px 6px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e07a42, #7c2d12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                D
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#ffffff" }}>
                Demo
              </span>
              <span style={{ fontSize: "10px", opacity: 0.5 }}>⌄</span>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="btn"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.05)",
                color: darkMode ? "#f8fafc" : theme.textPrimary,
                borderRadius: "50%",
                width: "34px",
                height: "34px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
              title="Toggle Theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            padding: "28px",
            background: darkMode ? "#0c0d12" : theme.background,
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
