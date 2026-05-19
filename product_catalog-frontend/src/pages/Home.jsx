import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import Swal from "sweetalert2";

// ✅ Backend base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog-13.onrender.com";

const Home = ({ searchTerm = "", selectedCategory, sortOrder }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ==============================
  // 1. FETCH PRODUCTS
  // ==============================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/api/products`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        console.log("PRODUCTS API RESPONSE:", data);

        // IMPORTANT: backend returns array directly
        setProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==============================
  // 2. ADD TO CART
  // ==============================
  const handleAddToCart = async (productId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/cart/add/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        Swal.fire({
          title: "Added!",
          text: "Item successfully added to cart",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        console.error("Cart error status:", res.status);

        Swal.fire(
          "Error",
          `Server error ${res.status}. Check backend security.`,
          "error"
        );
      }
    } catch (err) {
      console.error("Connection error:", err);

      Swal.fire(
        "Error",
        "Backend not reachable. Check server.",
        "error"
      );
    }
  };

  // ==============================
  // 3. BUY NOW
  // ==============================
  const handleBuyNow = (productId) => {
    navigate(`/checkout/${productId}`);
  };

  // ==============================
  // 4. FILTER + SORT LOGIC (FIXED)
  // ==============================
  const filteredProducts = products
    .filter((p) => {
      // CATEGORY FIX (category is object, not categoryId)
      const matchesCategory = selectedCategory
        ? p.category?.id === Number(selectedCategory)
        : true;

      // SAFE SEARCH
      const matchesSearch =
        !searchTerm ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.price - b.price
        : b.price - a.price
    );

  // ==============================
  // LOADING UI
  // ==============================
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container-fluid px-lg-5">

        {filteredProducts.length > 0 ? (
          <ProductList
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : (
          <div className="text-center mt-5 py-5">
            <h3>No products found matching your search.</h3>
            <p className="text-muted">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
