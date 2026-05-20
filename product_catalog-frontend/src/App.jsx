import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";

// Admin
import AdminDashboard from "./Admin/AdminDashboard";
import AdminProducts from "./Admin/AdminProducts";
import AdminCategories from "./Admin/AdminCategories";
import AdminLogin from "./Admin/AdminLogin";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog-13.onrender.com/api";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Router>
      <Navbar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <Routes>
        {/* USER ROUTES */}
        <Route
          path="/"
          element={
            <Home
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              sortOrder={sortOrder}
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/:productId" element={<Checkout />} />
        <Route path="/order-success" element={<Success />} />

        {/* PROTECTED USER */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCategories />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="text-center mt-5">
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;