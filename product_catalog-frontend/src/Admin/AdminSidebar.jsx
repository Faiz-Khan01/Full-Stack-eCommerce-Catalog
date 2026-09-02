// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useTheme, themes } from "../App";

// const AdminSidebar = () => {
//   const { darkMode } = useTheme();
//   const theme = darkMode ? themes.dark : themes.light;
//   const location = useLocation();

//   const menuItems = [
//     { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
//     { name: "Products", path: "/admin/products", icon: "📦" },
//     { name: "Categories", path: "/admin/categories", icon: "📁" },
//     { name: "Inventory", path: "/admin/inventory", icon: "🏷️" },
//     { name: "Orders", path: "/admin/orders", icon: "🛒" },
//     { name: "Customers", path: "/admin/customers", icon: "👥" },
//     { name: "Support Tickets", path: "/admin/support", icon: "🎫" }, 
//     { name: "Settings", path: "/admin/settings", icon: "⚙️" },
//   ];

//   return (
//     <div
//       style={{
//         width: "260px",
//         minHeight: "100vh",
//         background: darkMode ? "#0f172a" : "#ffffff",
//         borderRight: `1px solid ${theme.border}`,
//         padding: "24px 16px",
//         transition: "background 0.3s ease, border 0.3s ease",
//       }}
//     >
//       {/* Brand Logo */}
//       <div className="d-flex align-items-center gap-2 mb-4 px-2">
//         <div
//           style={{
//             background: "linear-gradient(135deg, #f59e0b, #d97706)",
//             borderRadius: "12px",
//             padding: "8px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           🛒
//         </div>
//         <span
//           className="fw-bold fs-4"
//           style={{
//             color: darkMode ? "#facc15" : "#1e293b",
//           }}
//         >
//           TechStore
//         </span>
//       </div>

//       <div
//         className="text-uppercase fs-7 fw-bold mb-3 px-2"
//         style={{ color: theme.textSecondary, fontSize: "11px", letterSpacing: "1px" }}
//       >
//         Main Menu
//       </div>

//       {/* Menu Links */}
//       <nav className="d-flex flex-column gap-1">
//         {menuItems.map((item) => {
//           const isActive = location.pathname === item.path;
//           return (
//             <Link
//               key={item.name}
//               to={item.path}
//               className="text-decoration-none d-flex align-items-center gap-3 px-3 py-2.5 rounded-3"
//               style={{
//                 background: isActive
//                   ? darkMode
//                     ? "rgba(255, 255, 255, 0.08)"
//                     : "#f1f5f9"
//                   : "transparent",
//                 color: isActive ? theme.textPrimary : theme.textSecondary,
//                 fontWeight: isActive ? "600" : "500",
//                 transition: "all 0.2s ease",
//               }}
//             >
//               <span>{item.icon}</span>
//               <span>{item.name}</span>
//             </Link>
//           );
//         })}
//       </nav>
//     </div>
//   );
// };

// export default AdminSidebar;






import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme, themes } from "../App";

const AdminSidebar = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? themes.dark : themes.light;
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth token and user storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to login page
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Categories", path: "/admin/categories", icon: "📁" },
    { name: "Inventory", path: "/admin/inventory", icon: "🏷️" },
    { name: "Orders", path: "/admin/orders", icon: "🛒" },
    { name: "Customers", path: "/admin/customers", icon: "👥" },
    { name: "Support Tickets", path: "/admin/support", icon: "🎫" }, 
    { name: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: darkMode ? "#0f172a" : "#ffffff",
        borderRight: `1px solid ${theme.border}`,
        padding: "24px 16px",
        transition: "background 0.3s ease, border 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Ensures items spread and logout sits at bottom nicely
      }}
    >
      <div>
        {/* Brand Logo */}
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <div
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              borderRadius: "12px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🛒
          </div>
          <span
            className="fw-bold fs-4"
            style={{
              color: darkMode ? "#facc15" : "#1e293b",
            }}
          >
            TechStore
          </span>
        </div>

        <div
          className="text-uppercase fs-7 fw-bold mb-3 px-2"
          style={{ color: theme.textSecondary, fontSize: "11px", letterSpacing: "1px" }}
        >
          Main Menu
        </div>

        {/* Menu Links */}
        <nav className="d-flex flex-column gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="text-decoration-none d-flex align-items-center gap-3 px-3 py-2.5 rounded-3"
                style={{
                  background: isActive
                    ? darkMode
                      ? "rgba(255, 255, 255, 0.08)"
                      : "#f1f5f9"
                    : "transparent",
                  color: isActive ? theme.textPrimary : theme.textSecondary,
                  fontWeight: isActive ? "600" : "500",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button Section */}
      <div className="px-2 pt-3" style={{ borderTop: `1px solid ${theme.border}` }}>
        <button
          onClick={handleLogout}
          className="w-100 text-decoration-none d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 border-0"
          style={{
            background: darkMode ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
            color: "#ef4444",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ef4444";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = darkMode ? "rgba(239, 68, 68, 0.15)" : "#fee2e2";
            e.currentTarget.style.color = "#ef4444";
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