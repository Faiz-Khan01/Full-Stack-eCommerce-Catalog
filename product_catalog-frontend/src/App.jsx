import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// =========================================================
// PROVIDERS & CONTEXTS
// =========================================================

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// =========================================================
// LAYOUT COMPONENTS
// =========================================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// =========================================================
// GLOBAL THEME STYLES
// =========================================================

import "./styles/theme.css";

// =========================================================
// LAZY-LOADED PUBLIC & USER PAGES
// =========================================================

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Success = lazy(() => import("./pages/Success"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const AdminSupportTickets = lazy(
  () => import("./Admin/AdminSupportTickets")
);

// =========================================================
// FOOTER PAGES
// =========================================================

const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const Press = lazy(() => import("./pages/Press"));
const Science = lazy(() => import("./pages/Science"));
const Sell = lazy(() => import("./pages/Sell"));
const ProtectBrand = lazy(() => import("./pages/ProtectBrand"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const Advertise = lazy(() => import("./pages/Advertise"));
const Account = lazy(() => import("./pages/Account"));
const Returns = lazy(() => import("./pages/Returns"));
const Protection = lazy(() => import("./pages/Protection"));
const Help = lazy(() => import("./pages/Help"));

// =========================================================
// LAZY-LOADED ADMIN PAGES
// =========================================================

const AdminLogin = lazy(() => import("./Admin/AdminLogin"));
const AdminLayout = lazy(() => import("./Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./Admin/AdminProducts"));
const AdminCategories = lazy(() => import("./Admin/AdminCategories"));
const AdminInventory = lazy(() => import("./Admin/AdminInventory"));
const AdminOrders = lazy(() => import("./Admin/AdminOrders"));
const AdminCustomers = lazy(() => import("./Admin/AdminCustomers"));
const AdminSettings = lazy(() => import("./Admin/AdminSettings"));

// =========================================================
// API BASE URL
// =========================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";



// =========================================================
// PAGE LOADER
// =========================================================

const PageLoader = () => (
  <div
    className="d-flex align-items-center justify-content-center"
    style={{
      minHeight: "70vh",
      background: "var(--bg)",
      color: "var(--text-primary)",
    }}
  >
    <div className="text-center">
      <div
        className="spinner-border mb-3"
        style={{
          width: "3rem",
          height: "3rem",
          color: "#10b981",
        }}
        role="status"
      >
        <span className="visually-hidden">
          Loading...
        </span>
      </div>

      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        Loading experience...
      </div>
    </div>
  </div>
);

// =========================================================
// 404 PAGE
// =========================================================

const NotFoundPage = () => (
  <div
    className="min-vh-100 d-flex align-items-center justify-content-center px-3"
    style={{
      background: "var(--bg)",
      color: "var(--text-primary)",
    }}
  >
    <div
      className="text-center p-5 rounded-4 shadow-lg"
      style={{
        maxWidth: "480px",
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="display-1 fw-bold mb-2"
        style={{
          color: "#10b981",
        }}
      >
        404
      </div>

      <h3
        className="fw-bold mb-3"
        style={{
          color: "var(--text-primary)",
        }}
      >
        Page Not Found
      </h3>

      <p
        className="mb-4"
        style={{
          color: "var(--text-secondary)",
        }}
      >
        The page you are looking for does not exist
        or has been moved.
      </p>

      <a
        href="/"
        className="btn rounded-pill px-4 py-2 fw-semibold"
        style={{
          background: "#10b981",
          color: "#ffffff",
          border: "none",
        }}
      >
        Back to Home
      </a>
    </div>
  </div>
);

// =========================================================
// THEME CONFIGURATION
// =========================================================
//
// LIGHT THEME = WARM OFF-WHITE
// DARK THEME  = ORIGINAL DARK STYLE
//
// =========================================================

export const themes = {
  light: {
    // Main page background
    background: "#F7F3EA",

    // Cards / navbar / panels
    cardSolid: "#FFFDF8",

    // Main text
    textPrimary: "#1F2937",

    // Secondary text
    textSecondary: "#6B7280",

    // Borders
    border: "#E5DED0",

    // Input background
    inputBg: "#FFFCF5",

    // Hover background
    hoverBg: "#F1EBDD",

    // Muted sections
    mutedBg: "#F3EEE4",

    // Soft warm shadow
    shadow: "rgba(71, 61, 45, 0.10)",
  },

  dark: {
    // Main page background
    background: "#090D16",

    // Cards / panels
    cardSolid: "#111827",

    // Main text
    textPrimary: "#F8FAFC",

    // Secondary text
    textSecondary: "#94A3B8",

    // Borders
    border: "#1F2937",

    // Input background
    inputBg: "#1F2937",

    // Hover background
    hoverBg: "#1F2937",

    // Muted sections
    mutedBg: "#111827",

    // Dark shadow
    shadow: "rgba(0, 0, 0, 0.35)",
  },
};

// =========================================================
// THEME CONTEXT
// =========================================================

const ThemeContext = createContext(null);

// =========================================================
// THEME PROVIDER
// =========================================================

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    // Keep dark mode as default for existing users
    return savedTheme
      ? savedTheme === "dark"
      : true;
  });

  useEffect(() => {
    const theme = darkMode
      ? themes.dark
      : themes.light;

    // Save theme preference
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

    const root =
      document.documentElement;

    // =====================================================
    // CSS VARIABLES
    // =====================================================

    root.style.setProperty(
      "--bg",
      theme.background
    );

    root.style.setProperty(
      "--card",
      theme.cardSolid
    );

    root.style.setProperty(
      "--text-primary",
      theme.textPrimary
    );

    root.style.setProperty(
      "--text-secondary",
      theme.textSecondary
    );

    root.style.setProperty(
      "--border",
      theme.border
    );

    root.style.setProperty(
      "--input-bg",
      theme.inputBg
    );

    root.style.setProperty(
      "--hover-bg",
      theme.hoverBg
    );

    root.style.setProperty(
      "--muted-bg",
      theme.mutedBg
    );

    root.style.setProperty(
      "--shadow",
      theme.shadow
    );

    // =====================================================
    // THEME ATTRIBUTE
    // =====================================================

    root.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    // =====================================================
    // BODY STYLING
    // =====================================================

    document.body.style.backgroundColor =
      theme.background;

    document.body.style.color =
      theme.textPrimary;

  }, [darkMode]);

  // =======================================================
  // TOGGLE THEME
  // =======================================================

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        theme: darkMode
          ? themes.dark
          : themes.light,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// =========================================================
// USE THEME HOOK
// =========================================================

export const useTheme = () =>
  useContext(ThemeContext);

// =========================================================
// APP CONTENT
// =========================================================

function AppContent() {
  const location = useLocation();

  // =======================================================
  // SEARCH / CATEGORY / SORT STATE
  // =======================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [categories, setCategories] =
    useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("asc");

  // =======================================================
  // ADMIN PAGE DETECTION
  // =======================================================

  const isAdminPage =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/admin-login";

  // =======================================================
  // LOAD CATEGORIES
  // =======================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/categories`
        );

        if (response.ok) {
          const data =
            await response.json();

          setCategories(
            Array.isArray(data)
              ? data
              : []
          );
        }
      } catch (error) {
        console.warn(
          "Category load warning:",
          error.message
        );
      }
    };

    fetchCategories();
  }, []);

  // =======================================================
  // APP ROOT
  // =======================================================

  return (
    <div
      className="app-root"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* ===================================================
          NAVBAR
      =================================================== */}

      {!isAdminPage && (
        <Navbar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={
            setSelectedCategory
          }
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}

      {/* ===================================================
          LAZY ROUTES
      =================================================== */}

      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* =================================================
              PUBLIC SHOPPING
          ================================================= */}

          <Route
            path="/"
            element={
              <Home
                searchTerm={searchTerm}
                selectedCategory={
                  selectedCategory
                }
                sortOrder={sortOrder}
              />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetail />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/checkout/:productId"
            element={<Checkout />}
          />

          <Route
            path="/order-success"
            element={<Success />}
          />

          {/* =================================================
              USER PROTECTED ROUTES
          ================================================= */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="user">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="user">
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              FOOTER INFORMATION PAGES
          ================================================= */}

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/careers"
            element={<Careers />}
          />

          <Route
            path="/press"
            element={<Press />}
          />

          <Route
            path="/science"
            element={<Science />}
          />

          <Route
            path="/sell"
            element={<Sell />}
          />

          <Route
            path="/protect-brand"
            element={<ProtectBrand />}
          />

          <Route
            path="/affiliate"
            element={<Affiliate />}
          />

          <Route
            path="/advertise"
            element={<Advertise />}
          />

          <Route
            path="/account"
            element={<Account />}
          />

          <Route
            path="/returns"
            element={<Returns />}
          />

          <Route
            path="/protection"
            element={<Protection />}
          />

          <Route
            path="/help"
            element={<Help />}
          />

          {/* =================================================
              ADMIN LOGIN
          ================================================= */}

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          {/* =================================================
              ADMIN PROTECTED ROUTES
          ================================================= */}

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <Routes>

                    {/* Admin Dashboard */}
                    <Route
                      path=""
                      element={<AdminDashboard />}
                    />

                    <Route
                      path="dashboard"
                      element={<AdminDashboard />}
                    />

                    {/* Products */}
                    <Route
                      path="products"
                      element={<AdminProducts />}
                    />

                    {/* Categories */}
                    <Route
                      path="categories"
                      element={<AdminCategories />}
                    />

                    {/* Inventory */}
                    <Route
                      path="inventory"
                      element={<AdminInventory />}
                    />

                    {/* Orders */}
                    <Route
                      path="orders"
                      element={<AdminOrders />}
                    />

                    {/* Customers */}
                    <Route
                      path="customers"
                      element={<AdminCustomers />}
                    />

                    {/* Support Tickets */}
                    <Route
                      path="support"
                      element={
                        <AdminSupportTickets />
                      }
                    />

                    {/* Settings */}
                    <Route
                      path="settings"
                      element={<AdminSettings />}
                    />

                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* =================================================
              404
          ================================================= */}

          <Route
            path="*"
            element={<NotFoundPage />}
          />

        </Routes>
      </Suspense>

      {/* ===================================================
          FOOTER
      =================================================== */}

      {!isAdminPage && <Footer />}
    </div>
  );
}

// =========================================================
// MAIN APP
// =========================================================

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;