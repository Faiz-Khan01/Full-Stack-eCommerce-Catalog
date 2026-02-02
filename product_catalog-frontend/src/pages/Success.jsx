import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  // Generate a random order ID for display purposes
  const orderNumber = Math.floor(Math.random() * 900000) + 100000;

  return (
    <div className="container mt-5 mb-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 p-5">
            <div className="mb-4">
              {/* Large green success checkmark */}
              <div className="display-1 text-success">
                <i className="bi bi-check-circle-fill">✅</i>
              </div>
            </div>
            
            <h2 className="fw-bold mb-3">Order Placed Successfully!</h2>
            <p className="text-muted fs-5">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            
            <div className="bg-light p-3 rounded mb-4 border">
              <span className="text-muted d-block">Order Number:</span>
              <span className="fw-bold fs-4 text-primary">#TS-{orderNumber}</span>
            </div>

            <p className="small text-muted mb-4">
              A confirmation email has been sent to your registered address. 
              You can track your shipping status in your profile.
            </p>

            <div className="d-grid gap-2">
              <button 
                className="btn btn-primary btn-lg fw-bold" 
                onClick={() => navigate('/orders')}
              >
                View My Orders
              </button>
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;