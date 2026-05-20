import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProductList from "../components/ProductList";

// FIX 1: Corrected production fallback URL (Removed -13)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";

const Home = ({
  searchTerm = "",
  selectedCategory = "",
  sortOrder = "asc",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch Products (Public Endpoint - No Token Needed)
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to load products",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add To Cart
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (!user?.email) {
        Swal.fire({
          title: "Login Required",
          text: "Please log in to add items to cart",
          icon: "info",
        });
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/cart/add/${productId}?email=${encodeURIComponent(user.email)}`, {
        method: "POST",
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 403) throw new Error("Session expired. Please log in again.");
        throw new Error(errorData.error || `Cart error: ${res.status}`);
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

      // Trigger cart count update by dispatching custom event
      console.log("Dispatching cartUpdated event");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Cart error:", err);
      Swal.fire({
        title: "Error",
        text: err.message || "Could not add item to cart",
        icon: "error",
      });
    }
  };

  // Buy Now
  const handleBuyNow = (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Login required", "Please login first to buy products", "info");
      navigate("/login");
      return;
    }
    navigate(`/checkout/${productId}`);
  };

  // Filter + Sort Products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory
        ? product.category?.id === Number(selectedCategory) ||
          product.categoryId === Number(selectedCategory)
        : true;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.price - b.price
        : b.price - a.price
    );

  // Loading UI
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