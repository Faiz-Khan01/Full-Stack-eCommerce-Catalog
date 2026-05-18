import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";

const Navbar = ({ 
  searchTerm, onSearch, 
  categories, selectedCategory, onCategoryChange, 
  sortOrder, onSortChange 
}) => {
  const [cartCount, setCartCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch cart count whenever the search term changes (or periodically)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("https://full-stack-ecommerce-catalog-13.onrender.com/api/cart");
        const data = await res.json();
        setCartCount(data.length);
      } catch (err) { console.error("Cart error:", err); }
    };
    fetchCart();
  }, [searchTerm]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-2 shadow-sm">
      <div className="container-fluid px-lg-5">
        <Link className="navbar-brand fw-bold fs-3 text-warning me-3" to="/">
          🛍️ TechStore
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search Bar */}
          <div className="flex-grow-1 mx-lg-4 my-2 my-lg-0">
            <div className="position-relative">
              <input
                type="text"
                className="form-control border-0 py-2 ps-3 pe-5"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                style={{ borderRadius: '4px' }}
              />
              <span className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted">🔍</span>
            </div>
          </div>

          {/* Filtering & Sorting Controls */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 me-lg-4">
            <CategoryFilter 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onSelect={onCategoryChange} 
            />
            
            <select 
              className="form-select form-select-sm bg-light border-0" 
              value={sortOrder} 
              onChange={(e) => onSortChange(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {/* Cart & Account */}
          <div className="d-flex align-items-center gap-4">
            <Link to="/cart" className="text-white text-decoration-none d-flex align-items-center fw-bold">
              <div className="position-relative me-1">
                <span className="fs-4">🛒</span>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.65rem'}}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>

            <div className="dropdown">
              <button className="btn btn-outline-light btn-sm dropdown-toggle border-0" type="button" data-bs-toggle="dropdown">
                {user ? `Hi, ${user.name}` : "Login"}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow mt-2">
                <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={() => {localStorage.clear(); window.location.href="/"}}>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
