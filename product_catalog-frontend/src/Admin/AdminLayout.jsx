import React from "react";
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
        background: theme.background,
        color: theme.textPrimary,
      }}
    >
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Top Header Bar with Global Theme Switcher */}
        <header
          style={{
            height: "70px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.cardSolid,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 32px",
            gap: "16px",
          }}
        >
          <button
            onClick={toggleTheme}
            className="btn"
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.background,
              color: theme.textPrimary,
              borderRadius: "10px",
              padding: "8px 14px",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: "32px" }}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;