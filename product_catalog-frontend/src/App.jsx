import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

// User pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";

// Admin pages
import AdminDashboard from "./Admin/AdminDashboard";
import AdminProducts from "./Admin/AdminProducts";
import AdminCategories from "./Admin/AdminCategories";
import AdminLogin from "./Admin/AdminLogin";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Ensure this matches your Spring Boot server port (8080 or 8081)
const API_BASE_URL = "https://full-stack-ecommerce-catalog-13.onrender.com/api";

function App() {
  // --- Global States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // --- Fetch Categories for Navbar ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Router>
      {/* Navbar is placed outside Routes so it stays visible.
          We pass search and filter states as props.
      */}
      <Navbar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <div className="container-fluid p-0">
        <Routes>
          {/* --- Public User Routes --- */}
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

          {/* --- Protected User Routes --- */}
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

          {/* --- Admin Routes --- */}
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

          {/* --- Fallback 404 --- */}
          <Route 
            path="*" 
            element={<div className="text-center mt-5"><h1>404 - Page Not Found</h1></div>} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
