import React from "react";
import { useTheme } from "../App";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={
        darkMode
          ? "Switch to Light Mode"
          : "Switch to Dark Mode"
      }
      className="d-flex align-items-center justify-content-center border-0"
      style={{
        width: "43px",
        height: "40px",
        borderRadius: "11px",
        color: darkMode ? "#fbbf24" : "#f8fafc",
        background: darkMode
          ? "rgba(251,191,36,0.12)"
          : "rgba(255,255,255,0.06)",
        border: darkMode
          ? "1px solid rgba(251,191,36,0.22)"
          : "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: darkMode
          ? "0 4px 15px rgba(251,191,36,0.10)"
          : "none",
      }}
    >
      <span
        style={{
          fontSize: "19px",
          lineHeight: 1,
          transition: "transform 0.25s ease",
        }}
      >
        {darkMode ? "☀️" : "🌙"}
      </span>
    </button>
  );
};

export default ThemeToggle;