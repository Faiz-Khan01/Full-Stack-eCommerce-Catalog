import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../App";

const AdminSidebar = () => {
  const { darkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sections = [
    {
      title: "MAIN",
      items: [
        { name: "Overview", path: "/admin/dashboard", icon: "📊" },
        { name: "AI Assistant", path: "/admin/ai-assistant", icon: "✨", isAI: true },
      ],
    },
    {
      title: "CATALOGUE",
      items: [
        { name: "Products", path: "/admin/products", icon: "📦" },
        { name: "Categories", path: "/admin/categories", icon: "📁" },
      ],
    },
    {
      title: "SALES",
      items: [
        { name: "Orders", path: "/admin/orders", icon: "🛒" },
        { name: "Users", path: "/admin/customers", icon: "👥" },
      ],
    },
    {
      title: "STOREFRONT",
      items: [
        { name: "Home Page", path: "/", icon: "🛍️", external: true },
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        { name: "Admin Management", path: "/admin/support", icon: "🛡️" },
        { name: "Settings", path: "/admin/settings", icon: "⚙️" },
      ],
    },
  ];

  return (
    <div
      style={{
        width: "250px",
        minWidth: "250px",
        minHeight: "100vh",
        background: "#0e0f14",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        userSelect: "none",
        zIndex: 50,
      }}
    >
      <div>
        {/* Brand Logo - Arequa luxury styling */}
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
              boxShadow: "0 4px 14px rgba(224, 122, 66, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "18px",
            }}
          >
            A
          </div>
          <div className="d-flex flex-column">
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "18px",
                letterSpacing: "-0.5px",
                color: "#ffffff",
              }}
            >
              Arequa
            </span>
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.4)",
                fontWeight: 600,
              }}
            >
              Luxury Atelier
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="d-flex flex-column gap-3">
          {sections.map((sec) => (
            <div key={sec.title}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "rgba(255, 255, 255, 0.35)",
                  padding: "0 10px 4px 10px",
                  textTransform: "uppercase",
                }}
              >
                {sec.title}
              </div>

              <div className="d-flex flex-column gap-1">
                {sec.items.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path === "/admin/dashboard" && location.pathname === "/admin");

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-decoration-none d-flex align-items-center justify-content-between px-3 py-2 rounded-3"
                      style={{
                        background: isActive
                          ? "rgba(224, 122, 66, 0.14)"
                          : "transparent",
                        color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
                        border: isActive
                          ? "1px solid rgba(224, 122, 66, 0.3)"
                          : "1px solid transparent",
                        fontSize: "13px",
                        fontWeight: isActive ? 600 : 500,
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                          e.currentTarget.style.color = "#ffffff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)";
                        }
                      }}
                    >
                      <div className="d-flex align-items-center gap-2.5">
                        <span style={{ fontSize: "14px" }}>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>

                      {item.isAI && (
                        <span
                          style={{
                            background: "linear-gradient(135deg, #e07a42, #f59e0b)",
                            color: "#ffffff",
                            fontSize: "9px",
                            fontWeight: 800,
                            padding: "2px 6px",
                            borderRadius: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          AI
                        </span>
                      )}

                      {item.external && (
                        <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>
                          ↗
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section / Logout */}
      <div className="pt-3" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <button
          onClick={handleLogout}
          className="w-100 text-decoration-none d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 border-0"
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            color: "#f87171",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            border: "1px solid rgba(239, 68, 68, 0.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.15)";
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
