import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../services/api";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// =====================================================
// Helper Utility
// =====================================================
const numericDisplay = (amount) => {
  const value = Number(amount || 0);
  return value.toFixed(2);
};

// =====================================================
// Load Razorpay Script
// =====================================================
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

// =====================================================
// Payment Component
// =====================================================
const PaymentComponent = ({
  orderId,
  amount,
  userEmail,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  // =====================================================
  // Initiate Payment
  // =====================================================
  const initiatePayment = async () => {
    console.log(
      "Initiating payment with props -> Order ID:",
      orderId,
      "Amount:",
      amount,
      "Email:",
      userEmail
    );

    if (!orderId) {
      console.error(
        "Payment Error: Order ID is missing:",
        orderId
      );

      Swal.fire({
        icon: "error",
        title: "Invalid Order",
        text: "Order ID is missing in payment request. Please place the order first and ensure a valid database Order ID is passed.",
      });

      return;
    }

    if (!RAZORPAY_KEY_ID) {
      Swal.fire({
        icon: "error",
        title: "Razorpay Configuration Error",
        text: "VITE_RAZORPAY_KEY_ID is missing in your .env file.",
      });

      return;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "Payment amount must be greater than zero.",
      });

      return;
    }

    if (!userEmail || !userEmail.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please provide a valid email before payment.",
      });

      return;
    }

    setLoading(true);

    try {
      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error("Unable to load Razorpay SDK.");
      }

      const paymentRequest = {
        dbOrderId: String(orderId),
        orderId: String(orderId),
        amount: numericAmount,
        currency: "INR",
        userEmail: userEmail.trim(),
        description: `Order #${orderId}`,
        couponCode: null,
      };

      const orderResponse = await api.post(
        "/payment/create-order",
        paymentRequest
      );

      const orderData = orderResponse.data;

      if (!orderData?.razorpayOrderId) {
        throw new Error(
          "Razorpay order ID was not returned from the server."
        );
      }

      const razorpayOrderId =
        orderData.razorpayOrderId;

      const finalAmount = Number(
        orderData.amount || numericAmount
      );

      const currency =
        orderData.currency || "INR";

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: Math.round(finalAmount * 100),
        currency,
        name: "Full Stack eCommerce",
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,

        prefill: {
          email: userEmail.trim(),
        },

        notes: {
          orderId: String(orderId),
        },

        theme: {
          color: "#2563eb",
        },

        handler: async (response) => {
          try {
            setLoading(true);

            const verifyPayload = {
              dbOrderId: String(orderId),
              razorpayOrderId:
                response.razorpay_order_id,
              razorpayPaymentId:
                response.razorpay_payment_id,
              razorpaySignature:
                response.razorpay_signature,
              userEmail: userEmail.trim(),
            };

            const verifyResponse = await api.post(
              "/payment/verify",
              verifyPayload
            );

            if (
              verifyResponse.status >= 200 &&
              verifyResponse.status < 300
            ) {
              await Swal.fire({
                icon: "success",
                title: "Payment Successful!",
                text: `Payment of ₹${numericDisplay(
                  finalAmount
                )} has been processed and verified successfully.`,
                confirmButtonText: "Continue",
              });

              if (onPaymentSuccess) {
                onPaymentSuccess(
                  response.razorpay_payment_id
                );
              }
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            Swal.fire({
              icon: "error",
              title: "Payment Verification Failed",
              text:
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Payment could not be verified.",
            });
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);

            Swal.fire({
              icon: "warning",
              title: "Payment Cancelled",
              text: "You closed the payment window.",
              toast: true,
              position: "top-end",
              timer: 2000,
              showConfirmButton: false,
            });
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setLoading(false);

          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text:
              response.error?.description ||
              "Your payment could not be completed.",
          });
        }
      );

      razorpay.open();

      setLoading(false);
    } catch (error) {
      console.error(
        "Payment initiation error details:",
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        }
      );

      const errorMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            error.response?.data?.error ||
            error.response?.data?.errorMsg ||
            error.message ||
            "Failed to initiate payment.";

      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: errorMessage,
      });

      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <>
      <div
        className="payment-container"
        style={{
          width: "100%",
        }}
      >
        <div
          className="rounded-4 border p-3 p-md-4"
          style={{
            background:
              "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            borderColor: "#e5e7eb",
            boxShadow:
              "0 15px 40px rgba(15, 23, 42, 0.08)",
          }}
        >
          {/* Payment Header */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: "46px",
                  height: "46px",
                  background:
                    "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  color: "#2563eb",
                  fontSize: "21px",
                  boxShadow:
                    "0 8px 20px rgba(37, 99, 235, 0.12)",
                }}
              >
                💳
              </div>

              <div>
                <div
                  className="fw-bold text-dark"
                  style={{
                    fontSize: "15px",
                  }}
                >
                  Secure Payment
                </div>

                <div
                  className="text-muted"
                  style={{
                    fontSize: "12px",
                  }}
                >
                  Fast & secure online payment
                </div>
              </div>
            </div>

            <div
              className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
              style={{
                background: "#ecfdf5",
                color: "#15803d",
                fontSize: "11px",
                fontWeight: 700,
                border: "1px solid #bbf7d0",
              }}
            >
              <span>🔒</span>
              Secure
            </div>
          </div>

          {/* Amount Card */}
          <div
            className="rounded-4 p-3 mb-3"
            style={{
              background:
                "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
              border: "1px solid #dbeafe",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div
                  className="text-muted mb-1"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Order #{orderId}
                </div>

                <div
                  className="text-muted"
                  style={{
                    fontSize: "12px",
                  }}
                >
                  Total Amount
                </div>
              </div>

              <div
                className="fw-bold text-primary"
                style={{
                  fontSize: "25px",
                  letterSpacing: "-0.5px",
                }}
              >
                ₹{numericDisplay(amount)}
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            type="button"
            onClick={initiatePayment}
            disabled={loading}
            className="btn btn-success btn-lg w-100 fw-bold rounded-3 border-0"
            style={{
              minHeight: "56px",
              background:
                loading
                  ? "#64748b"
                  : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              boxShadow:
                loading
                  ? "none"
                  : "0 12px 25px rgba(22, 163, 74, 0.25)",
              transition:
                "all 0.25s ease",
            }}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />

                Processing...
              </span>
            ) : (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span>💳</span>
                <span>
                  Pay ₹{numericDisplay(amount)}
                </span>
                <span>→</span>
              </span>
            )}
          </button>

          {/* Security Information */}
          <div
            className="d-flex align-items-center justify-content-center gap-2 mt-3 text-muted"
            style={{
              fontSize: "11px",
            }}
          >
            <span>🔒</span>
            <span>
              Your payment is secured by Razorpay
            </span>
          </div>

          {/* Payment Methods */}
          <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
            <span
              className="px-2 py-1 rounded-2 border bg-white text-muted"
              style={{
                fontSize: "10px",
                fontWeight: 600,
              }}
            >
              UPI
            </span>

            <span
              className="px-2 py-1 rounded-2 border bg-white text-muted"
              style={{
                fontSize: "10px",
                fontWeight: 600,
              }}
            >
              Cards
            </span>

            <span
              className="px-2 py-1 rounded-2 border bg-white text-muted"
              style={{
                fontSize: "10px",
                fontWeight: 600,
              }}
            >
              Net Banking
            </span>

            <span
              className="px-2 py-1 rounded-2 border bg-white text-muted"
              style={{
                fontSize: "10px",
                fontWeight: 600,
              }}
            >
              Wallets
            </span>
          </div>
        </div>
      </div>

      {/* Premium Button Hover Effect */}
      <style>
        {`
          .payment-container button.btn-success:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 30px rgba(22, 163, 74, 0.32) !important;
          }

          .payment-container button.btn-success:not(:disabled):active {
            transform: translateY(0);
          }

          .payment-container button:disabled {
            cursor: not-allowed;
            opacity: 0.85;
          }
        `}
      </style>
    </>
  );
};

export default PaymentComponent;