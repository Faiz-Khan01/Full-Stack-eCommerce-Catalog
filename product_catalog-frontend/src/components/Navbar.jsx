import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog-13.onrender.com/api";

const Navbar = ({
  searchTerm,
  onSearch,
  categories,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortChange,
}) => {
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch Cart Count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cart`);

        if (!res.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await res.json();

        setCartCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Cart Error:", error);
        setCartCount(0);
      }
    };

    fetchCartCount();

    const interval = setInterval(fetchCartCount, 5000);

    return () => clearInterval(interval);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
      <div className="container-fluid px-lg-5">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-warning fs-3" to="/">
          🛍️ TechStore
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search */}
          <div className="flex-grow-1 mx-lg-4 my-3 my-lg-0">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="d-flex gap-2 me-lg-4 mb-3 mb-lg-0">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={onCategoryChange}
            />

            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="asc">Low → High</option>
              <option value="desc">High → Low</option>
            </select>
          </div>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="text-white text-decoration-none fw-bold"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="badge bg-danger ms-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                {user ? `Hi, ${user.name}` : "Account"}
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                {!user ? (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/login">
                        Login
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/signup">
                        Signup
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/orders">
                        Orders
                      </Link>
                    </li>

                    {user.role?.toLowerCase() === "admin" && (
                      <li>
                        <Link className="dropdown-item" to="/admin">
                          Admin Dashboard
                        </Link>
                      </li>
                    )}

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;