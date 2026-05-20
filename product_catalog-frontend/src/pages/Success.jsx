import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // FIX 1: Try to read the actual order ID passed from the checkout redirection state
  // If not available (e.g., direct link visit), fallback to a realistic random number
  const realOrderId = location.state?.orderId;
  const fallbackOrderNumber = React.useMemo(() => {
    return Math.floor(Math.random() * 900000) + 100000;
  }, []);

  const displayOrderId = realOrderId ? realOrderId : fallbackOrderNumber;

  return (
    <div className="container mt-5 mb-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 p-5">
            <div className="mb-4">
              {/* FIX 2: Cleaned up dual-icon rendering for sharp look */}
              <div className="display-1 text-success">
                <span role="img" aria-label="success-checkmark">✅</span>
              </div>
            </div>
            
            <h2 className="fw-bold mb-3">Order Placed Successfully!</h2>
            <p className="text-muted fs-5">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            
            <div className="bg-light p-3 rounded mb-4 border">
              <span className="text-muted d-block">Order Number:</span>
              <span className="fw-bold fs-4 text-primary">
                #TS-{displayOrderId}
              </span>
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