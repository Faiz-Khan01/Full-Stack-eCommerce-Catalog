import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

const CART_STORAGE_KEY = "guestCart";

const BASE_URL_NO_API =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "https://full-stack-ecommerce-catalog.onrender.com";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detailed Shipping Form Fields matching the UI
  const [fullName, setFullName] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("India");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [instructions, setInstructions] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon States Added
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // =====================================================
  // Load Cart or Direct Buy Item
  // =====================================================
  useEffect(() => {
    try {
      const isDirect =
        localStorage.getItem("isDirectBuy") === "true";

      const storageKey = isDirect
        ? "directBuyItem"
        : CART_STORAGE_KEY;

      const storedCart = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      if (
        !Array.isArray(storedCart) ||
        storedCart.length === 0
      ) {
        Swal.fire({
          icon: "info",
          title: "Cart is Empty",
          text: "Please add products to your cart first.",
        });

        navigate("/cart");
        return;
      }

      setCartItems(storedCart);
    } catch (error) {
      console.error("Checkout cart error:", error);
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =====================================================
  // Image URL
  // =====================================================
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === "") {
      return "https://placehold.co/600x400?text=No+Image";
    }

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    return `${BASE_URL_NO_API.replace(
      /\/$/,
      ""
    )}/${imageUrl.replace(/^\//, "")}`;
  };

  // =====================================================
  // Total Calculation
  // =====================================================
  const total = cartItems.reduce((sum, item) => {
    const price = Number(
      item?.product?.price ?? item?.price ?? 0
    );

    const quantity = Number(item?.quantity ?? 0);

    return sum + price * quantity;
  }, 0);

  // Final Payable Amount after discount
  const finalPayableAmount = Math.max(0, total - discountAmount);

  // =====================================================
  // Apply Coupon Handler
  // =====================================================
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Enter Coupon",
        text: "Please enter a valid coupon code.",
      });
      return;
    }

    try {
      const response = await api.post("/coupons/apply", {
        code: couponCode.trim(),
        cartAmount: total,
      });

      const data = response.data;
      setAppliedCoupon(data.couponCode);
      setDiscountAmount(Number(data.discountAmount));

      Swal.fire({
        icon: "success",
        title: "Coupon Applied!",
        text: data.message || "Discount applied successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Coupon error:", error);
      const message =
        error.response?.data?.message || "Invalid or expired coupon.";
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
      });
    }
  };

  // =====================================================
  // Helper to compile full address string
  // =====================================================
  const getCompiledAddress = () => {
    return `${fullName}, ${houseNo}, ${street}, ${city}, ${state} - ${pinCode}, Country: ${country}${
      instructions
        ? ` | Instructions: ${instructions}`
        : ""
    }`;
  };

  // =====================================================
  // Build standard OrderDTO payload (Sends final discounted total)
  // =====================================================
  const buildOrderPayload = (method) => ({
    userEmail: email.trim(),
    fullName: fullName.trim(),
    mobile: mobile.trim(),
    address: getCompiledAddress(),
    paymentMethod:
      method === "cod" ? "COD" : "ONLINE",
    totalAmount: Number(finalPayableAmount.toFixed(2)),
    items: cartItems.map((item) => ({
      productId: Number(
        item.product?.id ?? item.productId
      ),
      quantity: Number(item.quantity),
      price: Number(
        item.product?.price ??
          item.price ??
          0
      ),
    })),
  });

  // =====================================================
  // Clear Storage Helper
  // =====================================================
  const clearCheckoutStorage = () => {
    const isDirect =
      localStorage.getItem("isDirectBuy") === "true";

    if (isDirect) {
      localStorage.removeItem("directBuyItem");
      localStorage.removeItem("isDirectBuy");
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    }
  };

  // =====================================================
  // Main Order Handler
  // =====================================================
  const handleOrder = async (e) => {
    e.preventDefault();

    if (
      !fullName.trim() ||
      !houseNo.trim() ||
      !street.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pinCode.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Address",
        text: "Please fill out all required shipping address fields.",
      });

      return;
    }

    if (!email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email.",
      });

      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile",
        text: "Please enter a valid 10-digit mobile number.",
      });

      return;
    }

    if (cartItems.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Cart Empty",
        text: "Please add products first.",
      });

      navigate("/cart");
      return;
    }

    try {
      setIsSubmitting(true);

      if (paymentMethod === "cod") {
        await handleCashOnDelivery();
      } else {
        await handleOnlinePayment();
      }
    } catch (error) {
      console.error("Checkout error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred.";

      Swal.fire({
        icon: "error",
        title: "Checkout Error",
        text: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // COD Request
  // =====================================================
  const handleCashOnDelivery = async () => {
    const payload = buildOrderPayload("cod");

    const response = await api.post(
      "/orders/guest",
      payload
    );

    const orderData = response.data;

    console.log(
      "Backend Order Response (COD):",
      orderData
    );

    const rawId =
      typeof orderData === "number" ||
      typeof orderData === "string"
        ? orderData
        : orderData?.id ||
          orderData?.orderId ||
          orderData?.order_id ||
          orderData?.savedOrderId ||
          orderData?.data?.orderId ||
          orderData?.data?.id ||
          orderData?.order?.id;

    const internalOrderId = Number(rawId);

    if (
      !internalOrderId ||
      isNaN(internalOrderId)
    ) {
      throw new Error(
        `Backend did not return a valid order ID. Response was: ${JSON.stringify(
          orderData
        )}`
      );
    }

    clearCheckoutStorage();

    await Swal.fire({
      icon: "success",
      title: "Order Confirmed!",
      text: "Please pay when your package arrives.",
      confirmButtonText: "Continue",
    });

    navigate("/order-success", {
      state: {
        orderId: internalOrderId,
      },
    });
  };

  // =====================================================
  // Razorpay SDK Loader
  // =====================================================
  const loadRazorpay = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

      if (existingScript) {
        existingScript.onload = () =>
          resolve(true);

        existingScript.onerror = () =>
          reject(
            new Error(
              "Failed to load Razorpay SDK."
            )
          );

        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () =>
        resolve(true);

      script.onerror = () =>
        reject(
          new Error(
            "Failed to load Razorpay SDK."
          )
        );

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // Online Payment Request
  // =====================================================
  const handleOnlinePayment = async () => {
    const razorpayKey =
      import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      throw new Error(
        "Razorpay key is not configured. Please check your environment variables."
      );
    }

    const payload =
      buildOrderPayload("online");

    const initialOrderResponse =
      await api.post(
        "/orders/guest",
        payload
      );

    const orderData =
      initialOrderResponse.data;

    console.log(
      "Backend Order Response (Online):",
      orderData
    );

    const rawOrderId =
      typeof orderData === "number" ||
      typeof orderData === "string"
        ? orderData
        : orderData?.id ||
          orderData?.orderId ||
          orderData?.order_id ||
          orderData?.savedOrderId ||
          orderData?.data?.orderId ||
          orderData?.data?.id ||
          orderData?.order?.id;

    const internalOrderId =
      Number(rawOrderId);

    if (
      !internalOrderId ||
      isNaN(internalOrderId)
    ) {
      throw new Error(
        `Backend did not return a valid order ID. Response was: ${JSON.stringify(
          orderData
        )}`
      );
    }

    console.log(
      "Parsed Internal Order ID for Payment:",
      internalOrderId
    );

    const gatewayResponse =
      await api.post(
        "/payment/create-order",
        {
          orderId: internalOrderId,
          amount: Number(finalPayableAmount),
          currency: "INR",
          userEmail: email.trim(),
          description: `TechStore Order #${internalOrderId}`,
        }
      );

    const gatewayData =
      gatewayResponse.data;

    console.log(
      "Backend Gateway Response:",
      gatewayData
    );

    const razorpayOrderId =
      typeof gatewayData === "string" &&
      gatewayData.startsWith("order_")
        ? gatewayData
        : gatewayData?.razorpayOrderId ||
          gatewayData?.orderId ||
          gatewayData?.id ||
          gatewayData?.data
            ?.razorpayOrderId ||
          gatewayData?.data?.orderId ||
          gatewayData?.data?.id;

    if (!razorpayOrderId) {
      throw new Error(
        `Razorpay order ID was not returned. Response received: ${JSON.stringify(
          gatewayData
        )}`
      );
    }

    await loadRazorpay();

    if (!window.Razorpay) {
      throw new Error(
        "Razorpay SDK could not be initialized."
      );
    }

    const amountInPaise =
      Math.round(
        Number(
          gatewayData?.amount ?? finalPayableAmount
        ) * 100
      );

    const options = {
      key: razorpayKey,
      amount: amountInPaise,
      currency:
        gatewayData?.currency || "INR",
      name: "E-Commerce TechStore",
      description:
        `Payment for Order #${internalOrderId}`.slice(
          0,
          255
        ),
      order_id: String(
        razorpayOrderId
      ),
      prefill: {
        email: email.trim(),
        contact: mobile.trim(),
        name: fullName.trim(),
      },
      notes: {
        internalOrderId:
          String(internalOrderId),
      },
      theme: {
        color: "#0d6efd",
      },

      handler: async (response) => {
        try {
          setIsSubmitting(true);

          console.log(
            "Submitting Payment Verification with Payload:",
            {
              razorpayOrderId:
                response.razorpay_order_id,
              razorpayPaymentId:
                response.razorpay_payment_id,
              razorpaySignature:
                response.razorpay_signature,
              dbOrderId: internalOrderId,
            }
          );

          await api.post(
            "/payment/verify",
            {
              razorpayOrderId:
                response.razorpay_order_id,
              razorpayPaymentId:
                response.razorpay_payment_id,
              razorpaySignature:
                response.razorpay_signature,
              dbOrderId: internalOrderId,
            }
          );

          clearCheckoutStorage();

          await Swal.fire({
            icon: "success",
            title: "Payment Complete!",
            text: "Your payment was successfully verified.",
            confirmButtonText:
              "View Order",
          });

          navigate("/order-success", {
            state: {
              orderId:
                internalOrderId,
            },
          });
        } catch (error) {
          console.error(
            "Payment verification error:",
            error
          );

          Swal.fire({
            icon: "error",
            title: "Verification Failed",
            text:
              error.response?.data
                ?.message ||
              error.response?.data?.error ||
              error.message ||
              "Payment verification failed.",
          });
        } finally {
          setIsSubmitting(false);
        }
      },

      modal: {
        ondismiss: () => {
          setIsSubmitting(false);

          Swal.fire({
            icon: "info",
            title: "Payment Cancelled",
            text: "You cancelled the Razorpay payment.",
            toast: true,
            position: "top-end",
            timer: 2000,
            showConfirmButton: false,
          });
        },
      },
    };

    console.log(
      "Opening Razorpay with Options:",
      options
    );

    const razorpay =
      new window.Razorpay(options);

    razorpay.on(
      "payment.failed",
      (response) => {
        console.error(
          "Payment failed:",
          response
        );

        setIsSubmitting(false);

        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text:
            response.error?.description ||
            "The payment could not be completed.",
        });
      }
    );

    razorpay.open();
  };

  // =====================================================
  // Loading State
  // =====================================================
  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          minHeight: "75vh",
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        }}
      >
        <div
          className="bg-white rounded-4 shadow-sm border text-center p-5"
          style={{
            minWidth: "280px",
          }}
        >
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{
              width: "2.6rem",
              height: "2.6rem",
            }}
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-muted mb-0 fw-medium">
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI Render
  // =====================================================
  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 45%, #eef2ff 100%)",
      }}
    >
      <div className="container">

        {/* =====================================================
            Premium Page Header
        ===================================================== */}
        <div className="mb-5">

          <div
            className="text-primary fw-bold text-uppercase small mb-2"
            style={{
              letterSpacing: "2px",
            }}
          >
            Secure Checkout
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">

            <div>
              <h1
                className="fw-bold text-dark mb-2"
                style={{
                  fontSize:
                    "clamp(2rem, 5vw, 3rem)",
                  letterSpacing:
                    "-1.2px",
                }}
              >
                Checkout
              </h1>

              <p className="text-muted mb-0">
                Complete your order securely
                and conveniently.
              </p>
            </div>

            <div
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white border shadow-sm"
              style={{
                width: "fit-content",
              }}
            >
              <span
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "28px",
                  height: "28px",
                  background:
                    "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                  fontSize: "14px",
                }}
              >
                🔒
              </span>

              <span className="small fw-semibold text-dark">
                Secure checkout
              </span>
            </div>

          </div>
        </div>

        <div className="row g-4 g-xl-5">

          {/* =====================================================
              Shipping Form
          ===================================================== */}
          <div className="col-lg-7">

            <div
              className="bg-white rounded-4 border shadow-sm overflow-hidden"
              style={{
                boxShadow:
                  "0 20px 60px rgba(15, 23, 42, 0.07)",
              }}
            >

              {/* Form Header */}
              <div
                className="p-4 p-md-5 border-bottom"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                }}
              >

                <div className="d-flex align-items-center gap-3">

                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: "48px",
                      height: "48px",
                      background:
                        "linear-gradient(135deg, #eff6ff, #dbeafe)",
                      color: "#2563eb",
                      fontSize: "21px",
                    }}
                  >
                    📦
                  </div>

                  <div>
                    <h4 className="fw-bold mb-1 text-dark">
                      Shipping Details
                    </h4>

                    <p className="text-muted small mb-0">
                      Enter your delivery information
                    </p>
                  </div>

                </div>

              </div>

              <div className="p-4 p-md-5">

                <form onSubmit={handleOrder}>

                  {/* Full Name */}
                  <div className="mb-4">

                    <label className="form-label fw-semibold small text-dark">
                      Full Name (Receiver)
                    </label>

                    <input
                      type="text"
                      className="form-control premium-input"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(
                          e.target.value
                        )
                      }
                      required
                      disabled={
                        isSubmitting
                      }
                    />

                  </div>

                  {/* House / Street */}
                  <div className="row">

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-semibold small text-dark">
                        House / Flat / Building No.
                      </label>

                      <input
                        type="text"
                        className="form-control premium-input"
                        placeholder="Flat 102, Sunshine Apartments"
                        value={houseNo}
                        onChange={(e) =>
                          setHouseNo(
                            e.target.value
                          )
                        }
                        required
                        disabled={
                          isSubmitting
                        }
                      />

                    </div>

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-semibold small text-dark">
                        Street / Road / Locality
                      </label>

                      <input
                        type="text"
                        className="form-control premium-input"
                        placeholder="MG Road, Sector 4"
                        value={street}
                        onChange={(e) =>
                          setStreet(
                            e.target.value
                          )
                        }
                        required
                        disabled={
                          isSubmitting
                        }
                      />

                    </div>

                  </div>

                  {/* City / State */}
                  <div className="row">

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-semibold small text-dark">
                        City / Town
                      </label>

                      <input
                        type="text"
                        className="form-control premium-input"
                        placeholder="Mumbai"
                        value={city}
                        onChange={(e) =>
                          setCity(
                            e.target.value
                          )
                        }
                        required
                        disabled={
                          isSubmitting
                        }
                      />

                    </div>

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-semibold small text-dark">
                        State / Province
                      </label>

                      <input
                        type="text"
                        className="form-control premium-input"
                        placeholder="Maharashtra"
                        value={state}
                        onChange={(e) =>
                          setState(
                            e.target.value
                          )
                        }
                        required
                        disabled={
                          isSubmitting
                        }
                      />

                    </div>

                  </div>

                  {/* PIN / Country */}
                  <div className="row">

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-semibold small text-dark">
                        PIN Code
                      </label>

                      <input
                        type="text"
                        className="form-control premium-input"
                        placeholder="400001"
                        value={pinCode}
                        onChange={(e) =>
                          setPinCode(
                            e.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                6
                              )
                          )
                        }
                        required
                        disabled={
                          isSubmitting
                        }
                      />

                    </div>

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-semibold small text-dark">
                        Country
                      </label>

                      <input
                        type="text"
                        className="form-control premium-input"
                        value={country}
                        onChange={(e) =>
                          setCountry(
                            e.target.value
                          )
                        }
                        required
                        disabled={
                          isSubmitting
                        }
                      />

                    </div>

                  </div>

                  {/* Phone / Email */}
                  <div className="row">

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-semibold small text-dark">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-control premium-input"
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={(e) =>
                          setMobile(
                            e.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                10
                              )
                          )
                        }
                        required
                        disabled={
                          isSubmitting
                        }
                      />

                    </div>

                    <div className="col-md-6 mb-4">

                      <label className="form-label fw-semibold small text-dark">
                        Email Address
                      </label>

                      <input
                        type="email"
                        className="form-control premium-input"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) =>
                          setEmail(
                            e.target.value
                          )
                        }
                        required
                        disabled={
                          isSubmitting
                        }
                      />

                    </div>

                  </div>

                  {/* Instructions */}
                  <div className="mb-5">

                    <label className="form-label fw-semibold small text-dark">
                      Delivery Instructions{" "}
                      <span className="text-muted">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      className="form-control premium-input"
                      placeholder="Landmark, preferred timing, leave at door, etc."
                      rows="3"
                      value={instructions}
                      onChange={(e) =>
                        setInstructions(
                          e.target.value
                        )
                      }
                      disabled={
                        isSubmitting
                      }
                    />

                  </div>

                  {/* Payment Header */}
                  <div className="d-flex align-items-center gap-3 mb-3">

                    <div
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: "42px",
                        height: "42px",
                        background:
                          "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                        fontSize: "18px",
                      }}
                    >
                      💳
                    </div>

                    <h5 className="fw-bold mb-0">
                      Payment Method
                    </h5>

                  </div>

                  {/* Payment Methods */}
                  <div
                    className="border rounded-4 p-2 mb-4"
                    style={{
                      background:
                        "#f8fafc",
                    }}
                  >

                    {/* COD */}
                    <label
                      htmlFor="codOpt"
                      className={`d-flex align-items-center gap-3 p-3 rounded-3 mb-2 ${
                        paymentMethod ===
                        "cod"
                          ? "bg-white shadow-sm"
                          : ""
                      }`}
                      style={{
                        cursor: isSubmitting
                          ? "not-allowed"
                          : "pointer",
                        border:
                          paymentMethod ===
                          "cod"
                            ? "1px solid #dbeafe"
                            : "1px solid transparent",
                        transition:
                          "all .2s ease",
                      }}
                    >

                      <input
                        type="radio"
                        name="paymentOpt"
                        id="codOpt"
                        className="form-check-input mt-0"
                        checked={
                          paymentMethod ===
                          "cod"
                        }
                        onChange={() =>
                          setPaymentMethod(
                            "cod"
                          )
                        }
                        disabled={
                          isSubmitting
                        }
                      />

                      <div className="flex-grow-1">

                        <div className="fw-semibold text-dark">
                          💵 Cash On Delivery
                        </div>

                      </div>

                    </label>

                    {/* Online */}
                    <label
                      htmlFor="upiOpt"
                      className={`d-flex align-items-center gap-3 p-3 rounded-3 ${
                        paymentMethod ===
                        "online"
                          ? "bg-white shadow-sm"
                          : ""
                      }`}
                      style={{
                        cursor: isSubmitting
                          ? "not-allowed"
                          : "pointer",
                        border:
                          paymentMethod ===
                          "online"
                            ? "1px solid #dbeafe"
                            : "1px solid transparent",
                        transition:
                          "all .2s ease",
                      }}
                    >

                      <input
                        type="radio"
                        name="paymentOpt"
                        id="upiOpt"
                        className="form-check-input mt-0"
                        checked={
                          paymentMethod ===
                          "online"
                        }
                        onChange={() =>
                          setPaymentMethod(
                            "online"
                          )
                        }
                        disabled={
                          isSubmitting
                        }
                      />

                      <div className="flex-grow-1">

                        <div className="fw-semibold text-dark">
                          💳 UPI / Credit Card / Debit Card (Razorpay)
                        </div>

                      </div>

                    </label>

                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-bold rounded-3 premium-pay-btn"
                    disabled={
                      isSubmitting
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />

                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹
                        {finalPayableAmount.toFixed(
                          2
                        )}
                      </>
                    )}
                  </button>

                  <div className="text-center mt-3">

                    <small className="text-muted">
                      🔒 Secure payment and
                      protected checkout
                    </small>

                  </div>

                </form>

              </div>
            </div>
          </div>

          {/* =====================================================
              Order Summary
          ===================================================== */}
          <div className="col-lg-5">

            <div
              className="bg-white rounded-4 border shadow-sm p-4 p-md-4 sticky-lg-top"
              style={{
                top: "24px",
                boxShadow:
                  "0 20px 60px rgba(15, 23, 42, 0.08)",
              }}
            >

              {/* Summary Header */}
              <div className="d-flex align-items-center justify-content-between mb-4">

                <div>
                  <h4 className="fw-bold mb-1">
                    Order Summary
                  </h4>

                  <p className="text-muted small mb-0">
                    Review your items
                  </p>
                </div>

                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "46px",
                    height: "46px",
                    background:
                      "linear-gradient(135deg, #eff6ff, #dbeafe)",
                    fontSize: "20px",
                  }}
                >
                  🛍️
                </div>

              </div>

              {/* Products */}
              <div
                style={{
                  maxHeight: "430px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >

                {cartItems.map(
                  (item, index) => {
                    const productName =
                      item.product?.name ??
                      item.name ??
                      "Product";

                    const productPrice =
                      Number(
                        item.product
                          ?.price ??
                          item.price ??
                          0
                      );

                    const productDesc =
                      item.product
                        ?.description ??
                      item.description ??
                      "Latest model product with amazing features";

                    const productImg =
                      item.product
                        ?.imageUrl ??
                      item.imageUrl;

                    return (
                      <div
                        key={
                          item.id ||
                          index
                        }
                        className="mb-4"
                      >

                        {/* Product Card */}
                        <div
                          className="rounded-4 p-3"
                          style={{
                            background:
                              "linear-gradient(135deg, #f8fafc, #ffffff)",
                            border:
                              "1px solid #edf0f4",
                          }}
                        >

                          <div className="d-flex align-items-center gap-3">

                            {/* Medium Product Image */}
                            <div
                              className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{
                                width:
                                  "100px",
                                height:
                                  "100px",
                                background:
                                  "#ffffff",
                                border:
                                  "1px solid #e9ecef",
                                overflow:
                                  "hidden",
                              }}
                            >

                              <img
                                src={getImageUrl(
                                  productImg
                                )}
                                alt={
                                  productName
                                }
                                style={{
                                  width:
                                    "100%",
                                  height:
                                    "100%",
                                  objectFit:
                                    "contain",
                                  padding:
                                    "8px",
                                }}
                                onError={(
                                  e
                                ) => {
                                  e.currentTarget.onerror =
                                    null;

                                  e.currentTarget.src =
                                    "https://placehold.co/600x400?text=No+Image";
                                }}
                              />

                            </div>

                            {/* Product Info */}
                            <div className="flex-grow-1 min-w-0">

                              <h5
                                className="fw-bold text-dark mb-1"
                                style={{
                                  fontSize:
                                    "15px",
                                }}
                              >
                                {
                                  productName
                                }
                              </h5>

                              <p
                                className="text-muted small mb-2"
                                style={{
                                  lineHeight:
                                    "1.45",
                                  display:
                                    "-webkit-box",
                                  WebkitLineClamp:
                                    2,
                                  WebkitBoxOrient:
                                    "vertical",
                                  overflow:
                                    "hidden",
                                }}
                              >
                                {
                                  productDesc
                                }
                              </p>

                              <div className="d-flex align-items-center justify-content-between">

                                <span className="text-muted small">
                                  Quantity:{" "}
                                  <strong className="text-dark">
                                    {
                                      item.quantity
                                    }
                                  </strong>
                                </span>

                                <span className="fw-bold text-dark">
                                  ₹
                                  {productPrice}
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

              {/* Coupon Box */}
              <div className="mb-4">

                <label className="form-label small fw-semibold text-dark">
                  Have a Coupon?
                </label>

                <div className="input-group">

                  <input
                    type="text"
                    className="form-control premium-input"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    disabled={isSubmitting}
                  />

                  <button
                    className="btn btn-outline-secondary px-4"
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isSubmitting}
                  >
                    Apply
                  </button>

                </div>

                {appliedCoupon && (
                  <small className="text-success fw-semibold mt-1 d-block">
                    ✓ Coupon '{appliedCoupon}' applied successfully!
                  </small>
                )}

              </div>

              <hr className="my-4" />

              {/* Original Price */}
              <div className="d-flex justify-content-between text-muted mb-2">

                <span className="small">
                  Original Price:
                </span>

                <span className="fw-semibold text-dark">
                  ₹{total.toFixed(2)}
                </span>

              </div>

              {/* Discount Amount (Shown only if applied) */}
              {discountAmount > 0 && (
                <div className="d-flex justify-content-between text-success mb-3">
                  <span className="small">Discount:</span>
                  <span className="fw-semibold">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Total Amount */}
              <div
                className="rounded-4 p-3 mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #f8fafc, #eff6ff)",
                  border:
                    "1px solid #e5e7eb",
                }}
              >

                <div className="d-flex justify-content-between align-items-center">

                  <span className="fw-bold fs-5">
                    Total Amount:
                  </span>

                  <span
                    className="text-primary fw-bold"
                    style={{
                      fontSize:
                        "1.6rem",
                    }}
                  >
                    ₹{finalPayableAmount.toFixed(2)}
                  </span>

                </div>

              </div>

              {/* Secure Checkout */}
              <div
                className="d-flex align-items-center gap-3 p-3 rounded-3"
                style={{
                  background:
                    "#f8fafc",
                }}
              >

                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "38px",
                    height: "38px",
                    background:
                      "#dcfce7",
                    fontSize: "16px",
                  }}
                >
                  🔒
                </div>

                <div>

                  <div className="fw-semibold small text-dark">
                    Secure checkout
                  </div>

                  <div className="text-muted">
                    <small>
                      Your payment information
                      is protected
                    </small>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          Premium Input / Button Styles
      ===================================================== */}
      <style>{`
        .premium-input {
          min-height: 48px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          color: #0f172a;
          padding: 10px 14px;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
          transition: all 0.2s ease;
        }

        .premium-input::placeholder {
          color: #94a3b8;
        }

        .premium-input:focus {
          border-color: #86b7fe;
          box-shadow:
            0 0 0 4px rgba(13, 110, 253, 0.08),
            0 4px 12px rgba(15, 23, 42, 0.04);
          outline: none;
        }

        .premium-input:hover:not(:disabled) {
          border-color: #cbd5e1;
        }

        .premium-pay-btn {
          min-height: 56px;
          border: none;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );
          box-shadow:
            0 10px 25px rgba(37, 99, 235, 0.22);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .premium-pay-btn:hover:not(:disabled) {
          background:
            linear-gradient(
              135deg,
              #1d4ed8,
              #1e40af
            );
          transform: translateY(-1px);
          box-shadow:
            0 14px 30px rgba(37, 99, 235, 0.28);
        }

        .premium-pay-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        @media (max-width: 991.98px) {
          .sticky-lg-top {
            position: static !important;
          }
        }

        @media (max-width: 575.98px) {
          .container {
            padding-left: 16px;
            padding-right: 16px;
          }

          .premium-input {
            min-height: 46px;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;