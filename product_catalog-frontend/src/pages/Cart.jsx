import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// FIX 1: Corrected fallback URLs (Removed -13)
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

      // FIX 2: Added Auth Headers for token verification
      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders("GET"),
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();

      // Group items by product id
      const grouped = data.reduce((acc, item) => {
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
      // FIX 2: Added Auth Headers
      await fetch(`${API_BASE_URL}/cart/add/${productId}`, {
        method: "POST",
        headers: getAuthHeaders("POST"),
      });

      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // Decrease quantity
  const handleDecrease = async (productId, qty) => {
    if (qty === 1) {
      return handleRemove(productId);
    }

    try {
      // FIX 2: Added Auth Headers
      await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders("DELETE"),
      });

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
      // FIX 2: Added Auth Headers
      await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders("DELETE"),
      });

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
      return;
    }

    try {
      // FIX 2: Added Auth Headers to secure checkout endpoint
      const res = await fetch(
        `${API_BASE_URL}/cart/buy?email=${user.email}`,
        {
          method: "POST",
          headers: getAuthHeaders("POST"),
        }
      );

      if (!res.ok) throw new Error("Checkout failed");

      Swal.fire({
        icon: "success",
        title: "Order placed!",
      });

      setCartItems([]);
      navigate("/order-success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Total
  const total = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

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

                    <td>₹{item.price}</td>

                    <td>
                      {" "}
                      ₹{(item.price * item.quantity).toFixed(2)}
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

          <div className="d-flex justify-content-between mt-4">
            <h4>Total: ₹{total}</h4>

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