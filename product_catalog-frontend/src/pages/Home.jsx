import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import Swal from "sweetalert2";

// ✅ ONLY use env (NO fallback localhost)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = ({ searchTerm = "", selectedCategory, sortOrder = "asc" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/products`);

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ ADD TO CART
  const handleAddToCart = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/add/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Cart error: ${res.status}`);
      }

      Swal.fire({
        title: "Added!",
        text: "Item added to cart successfully",
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Cart error:", err);

      Swal.fire({
        title: "Error",
        text: "Cart request failed (check backend/CORS)",
        icon: "error",
      });
    }
  };

  // ✅ BUY NOW
  const handleBuyNow = (productId) => {
    navigate(`/checkout/${productId}`);
  };

  // ✅ FILTER + SORT SAFE VERSION
  const filteredProducts = products
    .filter((p) => {
      const matchCategory = selectedCategory
        ? p.categoryId === Number(selectedCategory)
        : true;

      const matchSearch = p.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchCategory && matchSearch;
    })
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

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
              Try adjusting filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
