import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";

const BASE_URL_NO_API =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "https://full-stack-ecommerce-catalog.onrender.com";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Helper function to get JWT token headers
  const getAuthHeaders = (method = "GET") => {
    const token = localStorage.getItem("token");
    return {
      ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
  };

  // Fetch Cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      
      if (!user?.email) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/cart?email=${encodeURIComponent(user.email)}`, {
        headers: getAuthHeaders("GET"),
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const response = await res.json();
      const data = response.data || response;

      // Handle both new format (with wrapper) and direct array
      const cartArray = Array.isArray(data) ? data : (response.success ? response.data : []);

      // Group items by product id
      const grouped = cartArray.reduce((acc, item) => {
        const found = acc.find((i) => i.id === item.id);
        if (found) {
          found.quantity += 1;
        } else {
          acc.push({ ...item, quantity: 1 });
        }
        return acc;
      }, []);

      setCartItems(grouped);
    } catch (error) {
      console.error("Cart Error:", error);
      Swal.fire("Error", error.message || "Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add quantity
  const handleIncrease = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/add/${productId}?email=${encodeURIComponent(user.email)}`, {
        method: "POST",
        headers: getAuthHeaders("POST"),
      });
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 403) throw new Error("Session expired. Please log in again.");
        throw new Error(errorData.error || `Cart error: ${res.status}`);
      }
      fetchCart();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.message || "Could not increase quantity",
        icon: "error",
      });
    }
  };

  // Decrease quantity
  const handleDecrease = async (productId, qty) => {
    if (qty === 1) {
      return handleRemove(productId);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/remove/${productId}?email=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
        headers: getAuthHeaders("DELETE"),
      });
      if (!res.ok) throw new Error("Failed to decrement quantity");
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // Remove item
  const handleRemove = async (productId) => {
    const result = await Swal.fire({
      title: "Remove Item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/cart/remove/${productId}?email=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
        headers: getAuthHeaders("DELETE"),
      });

      if (!res.ok) throw new Error("Failed to remove item");

      Swal.fire({
        icon: "success",
        title: "Removed",
        toast: true,
        timer: 1200,
        showConfirmButton: false,
        position: "top-end",
      });

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (!user?.email) {
      Swal.fire("Login required", "Please login first", "info");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/cart/buy?email=${encodeURIComponent(user.email)}`,
        {
          method: "POST",
          headers: getAuthHeaders("POST"),
        }
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error || response.message || "Checkout failed");
      }

      Swal.fire({
        icon: "success",
        title: "Order placed!",
      });

      setCartItems([]);
      navigate("/order-success");
    } catch (error) {
      console.error("Checkout Error:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const total = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalProducts = cartItems.length;

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>Your cart is empty</h4>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/")}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td className="d-flex align-items-center gap-3">
                      <img
                        src={
                          item.imageUrl
                            ? `${BASE_URL_NO_API}${item.imageUrl}`
                            : "https://placehold.co/120"
                        }
                        alt={item.name}
                        width="120"
                        height="120"
                        style={{ objectFit: "cover" }}
                      />
                      {item.name}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() =>
                          handleDecrease(item.id, item.quantity)
                        }
                      >
                        -
                      </button>

                      <span className="mx-2">{item.quantity}</span>

                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleIncrease(item.id)}
                      >
                        +
                      </button>
                    </td>

                    <td>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(item.price)}
                    </td>

                    <td>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(item.price * item.quantity)}
                    </td>

                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 mb-3">
            <p className="text-muted">
              <strong>{totalProducts}</strong> product{totalProducts !== 1 ? "s" : ""} ({totalItems} item{totalItems !== 1 ? "s" : ""})
            </p>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <h4>
              Total:{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(total)}
            </h4>

            <button
              className="btn btn-success btn-lg"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;