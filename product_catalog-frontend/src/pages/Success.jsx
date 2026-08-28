import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // GET REAL ORDER ID
  // ==========================================
  const realOrderId =
    location.state?.orderId ||
    location.state?.order?.id ||
    location.state?.order?.orderId ||
    null;

  // ==========================================
  // DISPLAY ORDER ID
  // ==========================================
  const displayOrderId = realOrderId || "Pending";

  // ==========================================
  // TRACK ORDER
  // ==========================================
  const handleTrackOrder = () => {
    if (!realOrderId) {
      alert(
        "Order ID is not available. Please open your orders page and track the order from there."
      );

      navigate("/orders");
      return;
    }

    navigate(
      `/track-order?orderId=${encodeURIComponent(
        realOrderId
      )}`
    );
  };

  return (
    <div className="success-page">

      {/* ==========================================
          BACKGROUND DECORATION
      ========================================== */}

      <div className="success-glow glow-one"></div>
      <div className="success-glow glow-two"></div>
      <div className="success-grid"></div>

      <div className="container position-relative">

        <div className="row min-vh-100 align-items-center justify-content-center py-5">

          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

            {/* ==========================================
                SUCCESS CARD
            ========================================== */}

            <div className="success-card">

              {/* ========================================
                  SUCCESS ICON
              ======================================== */}

              <div className="success-icon-wrapper">

                <div className="success-icon">

                  <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>

                </div>

                <div className="success-ring ring-one"></div>
                <div className="success-ring ring-two"></div>

              </div>

              {/* ========================================
                  HEADING
              ======================================== */}

              <div className="text-center">

                <div className="success-label">
                  ORDER CONFIRMED
                </div>

                <h2 className="success-title">
                  Order Placed Successfully!
                </h2>

                <p className="success-description">
                  Thank you for your purchase. Your order has
                  been received and is being processed.
                </p>

              </div>

              {/* ========================================
                  ORDER NUMBER
              ======================================== */}

              <div className="order-box">

                <div className="order-box-icon">

                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 2h12v20H6z" />
                    <path d="M9 6h6" />
                    <path d="M9 10h6" />
                    <path d="M9 14h4" />
                  </svg>

                </div>

                <div className="order-box-content">

                  <span className="order-label">
                    Order Number:
                  </span>

                  <span className="order-number">
                    {realOrderId
                      ? `#TS-${displayOrderId}`
                      : "Order ID unavailable"}
                  </span>

                </div>

                {realOrderId && (
                  <div className="verified-badge">

                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>

                  </div>
                )}

              </div>

              {/* ========================================
                  CONFIRMATION MESSAGE
              ======================================== */}

              <div className="confirmation-message">

                <div className="message-icon">

                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="m4 6 8 6 8-6" />
                  </svg>

                </div>

                <p>
                  Your order has been successfully placed.
                  You can track your shipping status at any
                  time from your orders.
                </p>

              </div>

              {/* ========================================
                  ACTION BUTTONS
              ======================================== */}

              <div className="success-actions">

                {/* ======================================
                    TRACK ORDER
                ====================================== */}

                <button
                  type="button"
                  className="primary-action"
                  onClick={handleTrackOrder}
                >

                  <svg
                    viewBox="0 0 24 24"
                    width="19"
                    height="19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 7h13v10H3z" />
                    <path d="M16 10h3l2 3v4h-5z" />
                    <circle cx="7" cy="18" r="2" />
                    <circle cx="18" cy="18" r="2" />
                  </svg>

                  <span>
                    Track This Order
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>

                </button>

                {/* ======================================
                    VIEW ORDERS
                ====================================== */}

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => navigate("/orders")}
                >

                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16v16H4z" />
                    <path d="M8 8h8" />
                    <path d="M8 12h8" />
                    <path d="M8 16h5" />
                  </svg>

                  <span>
                    View My Orders
                  </span>

                </button>

                {/* ======================================
                    CONTINUE SHOPPING
                ====================================== */}

                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => navigate("/")}
                >

                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 12h18" />
                    <path d="m12 3-9 9 9 9" />
                  </svg>

                  <span>
                    Continue Shopping
                  </span>

                </button>

              </div>

              {/* ========================================
                  SECURITY
              ======================================== */}

              <div className="security-note">

                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>

                Your information is securely protected

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          PREMIUM STYLES
      ========================================== */}

      <style>{`

        /* =========================================
           PAGE
        ========================================= */

        .success-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;

          background:
            radial-gradient(
              circle at 10% 15%,
              rgba(34, 197, 94, 0.10),
              transparent 32%
            ),
            radial-gradient(
              circle at 90% 85%,
              rgba(99, 102, 241, 0.12),
              transparent 35%
            ),
            #f8fafc;
        }

        /* =========================================
           BACKGROUND
        ========================================= */

        .success-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);
        }

        .glow-one {
          width: 420px;
          height: 420px;
          top: -220px;
          left: -180px;
          background: rgba(34, 197, 94, 0.08);
        }

        .glow-two {
          width: 400px;
          height: 400px;
          right: -200px;
          bottom: -200px;
          background: rgba(99, 102, 241, 0.08);
        }

        .success-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.25;

          background-image:
            linear-gradient(
              rgba(99, 102, 241, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(99, 102, 241, 0.035) 1px,
              transparent 1px
            );

          background-size: 45px 45px;
        }

        /* =========================================
           CARD
        ========================================= */

        .success-card {
          position: relative;
          z-index: 2;

          background: rgba(255, 255, 255, 0.96);

          border: 1px solid rgba(226, 232, 240, 0.9);

          border-radius: 26px;

          padding: 42px 38px 32px;

          box-shadow:
            0 30px 80px rgba(15, 23, 42, 0.10),
            0 10px 30px rgba(15, 23, 42, 0.05);

          backdrop-filter: blur(18px);

          animation: successEnter 0.55s ease-out;
        }

        @keyframes successEnter {

          from {
            opacity: 0;
            transform: translateY(22px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

        }

        /* =========================================
           SUCCESS ICON
        ========================================= */

        .success-icon-wrapper {
          position: relative;

          width: 100px;
          height: 100px;

          margin: 0 auto 25px;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-icon {
          position: relative;
          z-index: 3;

          width: 76px;
          height: 76px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: white;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #22c55e,
              #16a34a
            );

          box-shadow:
            0 15px 35px rgba(34, 197, 94, 0.28);

          animation:
            iconPop
            0.6s
            cubic-bezier(.17,.67,.38,1.4);
        }

        @keyframes iconPop {

          0% {
            opacity: 0;
            transform: scale(0.5);
          }

          70% {
            transform: scale(1.08);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }

        }

        .success-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(34, 197, 94, 0.15);
        }

        .ring-one {
          width: 94px;
          height: 94px;
        }

        .ring-two {
          width: 115px;
          height: 115px;
          border-color: rgba(34, 197, 94, 0.07);
        }

        /* =========================================
           HEADING
        ========================================= */

        .success-label {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          padding: 5px 10px;

          margin-bottom: 10px;

          border-radius: 20px;

          background: #ecfdf5;
          color: #16a34a;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 1px;
        }

        .success-title {
          margin: 0;

          color: #111827;

          font-size: 27px;
          font-weight: 800;

          letter-spacing: -0.7px;
        }

        .success-description {
          max-width: 430px;

          margin: 9px auto 0;

          color: #64748b;

          font-size: 14px;

          line-height: 1.7;
        }

        /* =========================================
           ORDER BOX
        ========================================= */

        .order-box {
          display: flex;
          align-items: center;

          gap: 13px;

          margin-top: 27px;

          padding: 16px;

          border-radius: 15px;

          background:
            linear-gradient(
              135deg,
              #f8fafc,
              #f1f5f9
            );

          border: 1px solid #e2e8f0;

          transition: all 0.2s ease;
        }

        .order-box:hover {
          border-color: #cbd5e1;

          transform: translateY(-1px);

          box-shadow:
            0 8px 20px rgba(15, 23, 42, 0.05);
        }

        .order-box-icon {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          background: #eef2ff;
          color: #4f46e5;
        }

        .order-box-content {
          display: flex;

          flex-direction: column;

          align-items: flex-start;

          min-width: 0;
        }

        .order-label {
          color: #94a3b8;

          font-size: 11px;

          font-weight: 600;
        }

        .order-number {
          margin-top: 2px;

          color: #4f46e5;

          font-size: 20px;

          font-weight: 800;

          letter-spacing: 0.3px;

          word-break: break-word;
        }

        .verified-badge {
          margin-left: auto;

          width: 28px;
          height: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 50%;

          background: #dcfce7;
          color: #16a34a;
        }

        /* =========================================
           CONFIRMATION
        ========================================= */

        .confirmation-message {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          margin-top: 17px;

          padding: 13px 14px;

          border-radius: 12px;

          background: #f8fafc;

          border: 1px solid #f1f5f9;
        }

        .message-icon {
          width: 30px;
          height: 30px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          color: #6366f1;
          background: #eef2ff;
        }

        .confirmation-message p {
          margin: 0;

          color: #64748b;

          font-size: 11px;

          line-height: 1.7;

          text-align: left;
        }

        /* =========================================
           BUTTONS
        ========================================= */

        .success-actions {
          display: grid;

          gap: 10px;

          margin-top: 24px;
        }

        .primary-action,
        .secondary-action {
          width: 100%;

          min-height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          border-radius: 12px;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .primary-action {
          border: 0;

          color: white;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          box-shadow:
            0 10px 22px rgba(79, 70, 229, 0.24);
        }

        .primary-action:hover {
          transform: translateY(-1px);

          box-shadow:
            0 14px 28px rgba(79, 70, 229, 0.32);
        }

        .primary-action:active,
        .secondary-action:active {
          transform: translateY(0);
        }

        .secondary-action {
          border: 1px solid #e2e8f0;

          color: #475569;

          background: white;
        }

        .secondary-action:hover {
          border-color: #cbd5e1;

          background: #f8fafc;

          color: #1e293b;

          transform: translateY(-1px);

          box-shadow:
            0 6px 16px rgba(15, 23, 42, 0.05);
        }

        /* =========================================
           SECURITY
        ========================================= */

        .security-note {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 5px;

          margin-top: 23px;

          padding-top: 17px;

          border-top: 1px solid #f1f5f9;

          color: #94a3b8;

          font-size: 10px;
        }

        .security-note svg {
          color: #22c55e;
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 576px) {

          .success-card {
            padding: 34px 22px 27px;
            border-radius: 21px;
          }

          .success-title {
            font-size: 23px;
          }

          .success-description {
            font-size: 13px;
          }

          .order-number {
            font-size: 18px;
          }

          .success-icon-wrapper {
            margin-bottom: 21px;
          }

        }

      `}</style>
    </div>
  );
};

export default Success;