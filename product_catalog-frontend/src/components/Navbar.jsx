import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch cart count on load + interval (better than searchTerm dependency)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cart`);

        if (!res.ok) {
          throw new Error(`Cart API error: ${res.status}`);
        }

        const data = await res.json();

        setCartCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error("Cart error:", err);
        setCartCount(0);
      }
    };

    fetchCart();

    // optional refresh every 15 sec
    const interval = setInterval(fetchCart, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-2 shadow-sm">
      <div className="container-fluid px-lg-5">

        <Link className="navbar-brand fw-bold fs-3 text-warning" to="/">
          🛍️ TechStore
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">

          {/* SEARCH */}
          <div className="flex-grow-1 mx-lg-4 my-2 my-lg-0">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* FILTERS */}
          <div className="d-flex gap-2 me-lg-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={onCategoryChange}
            />

            <select
              className="form-select form-select-sm"
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="asc">Low → High</option>
              <option value="desc">High → Low</option>
            </select>
          </div>

          {/* CART */}
          <div className="d-flex align-items-center gap-3">

            <Link to="/cart" className="text-white text-decoration-none fw-bold">
              🛒 Cart
              {cartCount > 0 && (
                <span className="badge bg-danger ms-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER */}
            <div className="dropdown">
              <button
                className="btn btn-outline-light btn-sm dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user ? `Hi, ${user.name}` : "Login"}
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
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
                <li><hr /></li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
