import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import ProductList from "../components/ProductList";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog-13.onrender.com/api";

const Home = ({
  searchTerm = "",
  selectedCategory = "",
  sortOrder = "asc",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        setProducts(data || []);
      } catch (error) {
        console.error("Product Fetch Error:", error);

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
    try {
      const res = await fetch(
        `${API_BASE_URL}/cart/add/${productId}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error("Cart request failed");
      }

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Cart Error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not add item to cart",
      });
    }
  };

  // Buy Now
  const handleBuyNow = (productId) => {
    navigate(`/checkout/${productId}`);
  };

  // Filter Products
  const filteredProducts = products
    .filter((product) => {
      // Search Filter
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Category Filter
      const matchesCategory = selectedCategory
        ? product.category?.id === Number(selectedCategory)
        : true;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      return sortOrder === "asc"
        ? a.price - b.price
        : b.price - a.price;
    });

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
        <ProductList
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>
    </div>
  );
};

export default Home;