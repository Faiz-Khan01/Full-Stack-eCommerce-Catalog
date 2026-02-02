import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8082/api';

  // 1. Fetch product details on load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
        
        // Auto-fill email if user is logged in
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.email) setEmail(storedUser.email);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // 2. Handle Order Submission
  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (mobile.length !== 10) {
      Swal.fire('Invalid Mobile', 'Please enter a 10-digit number', 'warning');
      return;
    }

    try {
      // Matches Backend: @PostMapping("/buy/{productId}")
      // Note: Your current backend uses "guest@example.com" internally, 
      // but we call the endpoint here.
      const response = await fetch(`${API_BASE_URL}/cart/buy/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        Swal.fire({
          title: 'Order Placed!',
          text: 'Your order has been successfully processed.',
          icon: 'success',
          confirmButtonText: 'View My Orders'
        }).then(() => {
          navigate('/order-success');
        });
      } else {
        throw new Error("Failed to process order");
      }
    } catch (err) {
      Swal.fire('Error', 'Order failed. Please try again.', 'error');
    }
  };

  if (loading) return <div className="text-center mt-5"><h5>Loading Checkout...</h5></div>;
  if (!product) return <div className="text-center mt-5 text-danger">Product not found.</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Left Side: Form */}
        <div className="col-md-7">
          <form onSubmit={handleConfirmOrder}>
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-primary text-white fw-bold">Shipping & Contact</div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input type="tel" className="form-control" placeholder="10-digit mobile" value={mobile} 
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Delivery Address</label>
                  <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-primary text-white fw-bold">Payment Method</div>
              <div className="card-body">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="pay" id="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <label className="form-check-label" htmlFor="cod">Cash on Delivery</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="pay" id="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                  <label className="form-check-label" htmlFor="upi">UPI / Online Payment</label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-success btn-lg w-100 shadow-sm py-3">
              Place Order (${product.price.toFixed(2)})
            </button>
          </form>
        </div>

        {/* Right Side: Summary */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-dark text-white fw-bold">Order Summary</div>
            <div className="card-body text-center">
              <img src={`${API_BASE_URL.replace('/api', '')}${product.imageUrl}`} 
                alt={product.name} className="img-fluid rounded mb-3" style={{ maxHeight: '200px' }} />
              <h5 className="fw-bold">{product.name}</h5>
              <p className="text-muted small">{product.description}</p>
              <hr />
              <div className="d-flex justify-content-between px-3">
                <span>Price:</span>
                <span className="fw-bold">${product.price.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between px-3">
                <span>Delivery:</span>
                <span className="text-success fw-bold">FREE</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between px-3">
                <h4 className="fw-bold">Total:</h4>
                <h4 className="fw-bold text-primary">${product.price.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;