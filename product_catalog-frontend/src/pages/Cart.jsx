import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const API_BASE_URL = "http://localhost:8082/api/cart";
  const IMAGE_BASE_URL = "http://localhost:8082";

  // 1. Fetch and Group Cart Items
  const fetchCart = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      // Grouping logic for UI display
      const groupedData = data.reduce((acc, item) => {
        const found = acc.find(i => i.id === item.id);
        if (found) { 
            found.quantity += 1; 
        } else { 
            acc.push({ ...item, quantity: 1 }); 
        }
        return acc;
      }, []);

      setCartItems(groupedData);
    } catch (err) { 
      console.error("Cart fetch failed", err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // 2. Increase Quantity (+)
  const handleIncrease = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/add/${productId}`, { method: 'POST' });
      if (res.ok) fetchCart(); 
    } catch (err) { console.error("Increase failed", err); }
  };

  // 3. Decrease Quantity (-) with Auto-Remove Logic
  const handleDecrease = async (productId, currentQuantity) => {
    if (currentQuantity === 1) {
      // If quantity is 1, trigger the full removal process
      handleRemoveItem(productId, true);
    } else {
      try {
        const res = await fetch(`${API_BASE_URL}/remove/${productId}`, { method: 'DELETE' });
        if (res.ok) fetchCart();
      } catch (err) { console.error("Decrease failed", err); }
    }
  };

  // 4. Remove Item (Supports single click or manual removal)
  const handleRemoveItem = async (productId, autoTriggered = false) => {
    const result = await Swal.fire({
      title: autoTriggered ? 'Remove from cart?' : 'Remove Item?',
      text: "This item will be removed from your shopping cart.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it'
    });

    if (result.isConfirmed) {
      try {
        // We call the delete endpoint until the item is gone or use a specific clear endpoint
        const res = await fetch(`${API_BASE_URL}/remove/${productId}`, { method: 'DELETE' });
        if (res.ok) {
          fetchCart();
          Swal.fire({ 
            title: 'Removed!', 
            icon: 'success', 
            toast: true, 
            position: 'top-end', 
            timer: 1500, 
            showConfirmButton: false 
          });
        }
      } catch (err) { Swal.fire('Error', 'Action failed.', 'error'); }
    }
  };

  // 5. Checkout
  const handleCheckout = async () => {
    if (!user || !user.email) {
      Swal.fire('Login Required', 'Please login to checkout', 'info');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/buy?email=${encodeURIComponent(user.email)}`, {
        method: "POST",
      });

      if (res.ok) {
        Swal.fire('Success!', 'Purchase successful!', 'success');
        setCartItems([]);
        navigate("/orders");
      } else {
        const errorText = await res.text();
        Swal.fire('Failed', errorText, 'error');
      }
    } catch (err) { Swal.fire('Error', 'Checkout failed.', 'error'); }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4 mb-5">
      <h2 className="text-primary fw-bold mb-4">🛒 Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="card shadow-sm border-0 p-5 text-center">
          <h4 className="text-muted">Your cart is empty!</h4>
          <button className="btn btn-primary mt-3 px-4" onClick={() => navigate("/")}>Browse Products</button>
        </div>
      ) : (
        <div className="card shadow border-0 p-4">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ minWidth: "300px" }}>Product</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Subtotal</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {/* Enlarged Image (120px) */}
                        <img 
                          src={`${IMAGE_BASE_URL}${item.imageUrl}`} 
                          alt={item.name}   
                          className="rounded border shadow-sm me-4" 
                          style={{ width: "200px", height: "160px", objectFit: "cover" }} 
                        />
                        <div>
                          <h5 className="mb-1 fw-bold text-dark">{item.name}</h5>
                          <p className="text-primary fw-semibold mb-0 font-monospace">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Quantity Controls with +/- */}
                    <td className="text-center">
                      <div className="d-inline-flex align-items-center bg-light border rounded-pill p-1 shadow-sm">
                        <button 
                          className="btn btn-sm btn-white rounded-pill px-3 fw-bold" 
                          onClick={() => handleDecrease(item.id, item.quantity)}
                        >
                          −
                        </button>
                        <span className="px-3 fw-bold fs-5" style={{ minWidth: "50px" }}>
                          {item.quantity}
                        </span>
                        <button 
                          className="btn btn-sm btn-white rounded-pill px-3 fw-bold" 
                          onClick={() => handleIncrease(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="text-end fw-bold fs-5 text-dark font-monospace">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>

                    <td className="text-center">
                      <button 
                        className="btn btn-link text-danger text-decoration-none" 
                        onClick={() => handleRemoveItem(item.id)}
                      >
                         🗑️ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-4 mt-3">
            <div className="mb-3 mb-md-0">
              <span className="text-muted fs-5">Estimated Total:</span>
              <h2 className="fw-bold text-success d-inline ms-2">${calculateTotal()}</h2>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-lg px-4" onClick={() => navigate("/")}>Continue Shopping</button>
              <button className="btn btn-success btn-lg px-5 shadow fw-bold" onClick={handleCheckout}>Checkout Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;