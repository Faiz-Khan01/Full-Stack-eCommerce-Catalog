import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://full-stack-ecommerce-catalog-13.onrender.com/api';

const Home = ({ searchTerm, selectedCategory, sortOrder }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch Products on Load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Hits https://full-stack-ecommerce-catalog-13.onrender.com/api/products
        const res = await fetch(`${API_BASE_URL}/products`);
        if (!res.ok) throw new Error("Could not fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Logic: Add to Cart (The "Handshake" with Backend)
  const handleAddToCart = async (productId) => {
    try {
      // Logic: Calls POST https://full-stack-ecommerce-catalog-13.onrender.com/api/cart/add/{productId}
      const res = await fetch(`${API_BASE_URL}/cart/add/${productId}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        Swal.fire({ 
          title: 'Added!', 
          text: 'Item successfully added to cart', 
          icon: 'success', 
          toast: true, 
          position: 'top-end', 
          timer: 2000, 
          showConfirmButton: false 
        });
      } else {
        // If status is 403, your SecurityConfig is blocking the request
        console.error("Backend Error Status:", res.status);
        Swal.fire('Error', `Server returned error ${res.status}. Check SecurityConfig.`, 'error');
      }
    } catch (err) {
      console.error("Connection error:", err);
      Swal.fire('Error', 'Could not connect to server on port 8082', 'error');
    }
  };

  // 3. Logic: Buy Now (Redirects to Checkout)
  const handleBuyNow = (productId) => {
    navigate(`/checkout/${productId}`);
  };

  // 4. Filter and Sort Logic (Uses search/category props from App.jsx)
  const filteredProducts = products
    .filter((p) => {
      const matchesCat = selectedCategory ? p.categoryId === Number(selectedCategory) : true;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

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
            <p className="text-muted">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
