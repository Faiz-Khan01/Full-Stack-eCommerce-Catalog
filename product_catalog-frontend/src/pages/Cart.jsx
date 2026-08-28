import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

const CART_STORAGE_KEY = "guestCart";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // Get Logged In User
  // =====================================================

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (error) {
      console.error("Error reading user:", error);
      return null;
    }
  };

  // =====================================================
  // Fetch Cart
  // =====================================================

  const fetchCart = async () => {
    const user = getStoredUser();

    if (!user?.email) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/cart?email=${encodeURIComponent(user.email)}`
      );

      const apiResponse = response.data;

      if (
        apiResponse &&
        apiResponse.success &&
        Array.isArray(apiResponse.data)
      ) {
        setCartItems(apiResponse.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Cart Error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Cart Event Listener
  // =====================================================

  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // =====================================================
  // Update Quantity
  // =====================================================

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(productId);
      return;
    }

    const user = getStoredUser();

    if (!user?.email) return;

    try {
      setProcessing(true);

      await api.put(`/cart/update/${productId}`, null, {
        params: {
          email: user.email,
          quantity: newQuantity,
        },
      });

      await fetchCart();

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Full update error object:", error);

      const errorData = error?.response?.data;

      const serverMessage =
        (typeof errorData === "string" ? errorData : null) ||
        errorData?.message ||
        errorData?.error ||
        error?.message ||
        "Could not update quantity.";

      Swal.fire({
        icon: "error",
        title: "Unable to Update Cart",
        text: serverMessage,
      });
    } finally {
      setProcessing(false);
    }
  };

  // =====================================================
  // Increase Quantity
  // =====================================================

  const handleIncrease = (productId, currentQuantity) => {
    handleUpdateQuantity(
      productId,
      Number(currentQuantity) + 1
    );
  };

  // =====================================================
  // Decrease Quantity
  // =====================================================

  const handleDecrease = (productId, currentQuantity) => {
    handleUpdateQuantity(
      productId,
      Number(currentQuantity) - 1
    );
  };

  // =====================================================
  // Remove Item
  // =====================================================

  const handleRemove = async (productId) => {
    const result = await Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this product from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    const user = getStoredUser();

    if (!user?.email) return;

    try {
      setProcessing(true);

      await api.delete(`/cart/remove/${productId}`, {
        params: {
          email: user.email,
        },
      });

      await fetchCart();

      window.dispatchEvent(new Event("cartUpdated"));

      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Product removed from your cart.",
        toast: true,
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
      });
    } catch (error) {
      console.error("Remove item error:", error);

      const errorData = error?.response?.data;

      const serverMessage =
        (typeof errorData === "string" ? errorData : null) ||
        errorData?.message ||
        errorData?.error ||
        error?.message ||
        "Failed to remove item.";

      Swal.fire({
        icon: "error",
        title: "Unable to Remove",
        text: serverMessage,
      });
    } finally {
      setProcessing(false);
    }
  };

  // =====================================================
  // Checkout
  // =====================================================

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Cart is Empty",
        text: "Please add products to your cart first.",
      });

      return;
    }

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );

    localStorage.removeItem("isDirectBuy");
    localStorage.removeItem("directBuyItem");

    navigate("/checkout");
  };

  // =====================================================
  // Calculations
  // =====================================================

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item?.price || 0);
    const quantity = Number(item?.quantity || 0);

    return sum + price * quantity;
  }, 0);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item?.quantity || 0),
    0
  );

  const totalProducts = cartItems.length;

  // =====================================================
  // Currency Formatter
  // =====================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // =====================================================
  // Product Image URL
  // =====================================================

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || String(imageUrl).trim() === "") {
      return "https://placehold.co/400x400?text=No+Image";
    }

    const image = String(imageUrl).trim();

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const backendUrl =
      import.meta.env.VITE_API_BASE_URL?.replace(
        /\/api\/?$/,
        ""
      ) ||
      (window.location.hostname === "localhost"
        ? "http://localhost:8082"
        : "https://full-stack-ecommerce-catalog.onrender.com");

    const cleanPath = image.startsWith("/")
      ? image
      : `/${image}`;

    return `${backendUrl}${cleanPath}`;
  };

  // =====================================================
  // Loading UI
  // =====================================================

  if (loading) {
    return (
      <div
        className="cart-page d-flex flex-column align-items-center justify-content-center"
        style={{
          minHeight: "70vh",
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        }}
      >
        <div
          className="p-4 rounded-4 shadow-sm bg-white text-center"
          style={{
            minWidth: "260px",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{
              width: "2.5rem",
              height: "2.5rem",
            }}
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mb-0 text-muted fw-medium">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // Main UI
  // =====================================================

  return (
    <div
      className="cart-page min-vh-100 py-5"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #eef2ff 100%)",
      }}
    >
      <div className="container">

        {/* =====================================================
            Header
        ===================================================== */}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">

          <div>
            <div
              className="text-primary fw-bold small text-uppercase mb-2"
              style={{
                letterSpacing: "1.5px",
              }}
            >
              Shopping Cart
            </div>

            <h2
              className="fw-bold mb-2 text-dark"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                letterSpacing: "-0.8px",
              }}
            >
              🛒 Your Cart
            </h2>

            {cartItems.length > 0 && (
              <p className="text-muted mb-0">
                Review your items before checkout
              </p>
            )}
          </div>

          {cartItems.length > 0 && (
            <div
              className="bg-white rounded-pill px-3 py-2 shadow-sm border"
              style={{
                width: "fit-content",
              }}
            >
              <span className="text-muted small">
                {totalProducts} product
                {totalProducts !== 1 ? "s" : ""} ·{" "}
                {totalItems} item
                {totalItems !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* =====================================================
            Empty Cart
        ===================================================== */}

        {cartItems.length === 0 ? (
          <div
            className="bg-white rounded-4 shadow-sm border text-center py-5 px-3"
            style={{
              minHeight: "420px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <div
                className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "110px",
                  height: "110px",
                  fontSize: "58px",
                  background:
                    "linear-gradient(135deg, #eff6ff, #eef2ff)",
                  boxShadow:
                    "0 15px 35px rgba(37, 99, 235, 0.10)",
                }}
              >
                🛒
              </div>

              <h4 className="mt-3 fw-bold text-dark">
                Your cart is empty
              </h4>

              <p className="text-muted mb-4">
                Please add products to your cart first.
              </p>

              <button
                className="btn btn-primary mt-2 px-4 py-2 rounded-3 fw-semibold shadow-sm"
                onClick={() => navigate("/")}
              >
                🛍️ Shop Now
              </button>
            </div>
          </div>
        ) : (
          /* =====================================================
             Cart Content
          ===================================================== */

          <div className="row g-4 align-items-start">

            {/* =================================================
                Products
            ================================================= */}

            <div className="col-lg-8">

              <div
                className="bg-white rounded-4 shadow-sm border overflow-hidden"
              >

                {/* =================================================
                    Desktop Header
                ================================================= */}

                <div
                  className="cart-desktop-header d-none d-md-grid px-4 py-3 border-bottom bg-light"
                  style={{
                    gridTemplateColumns:
                      "minmax(270px, 1fr) 130px 105px 115px 120px",
                    gap: "15px",
                    alignItems: "center",
                  }}
                >
                  <div className="small fw-bold text-muted text-uppercase">
                    Product
                  </div>

                  <div className="small fw-bold text-muted text-uppercase">
                    Qty
                  </div>

                  <div className="small fw-bold text-muted text-uppercase">
                    Price
                  </div>

                  <div className="small fw-bold text-muted text-uppercase">
                    Subtotal
                  </div>

                  <div className="small fw-bold text-muted text-uppercase">
                    Action
                  </div>
                </div>

                {/* =================================================
                    Cart Items
                ================================================= */}

                <div>
                  {cartItems.map((item, index) => (
                    <div
                      key={
                        item.id ||
                        item.productId ||
                        `cart-item-${index}`
                      }
                      className="cart-item px-3 px-md-4 py-4"
                      style={{
                        borderBottom:
                          index !== cartItems.length - 1
                            ? "1px solid #eef0f3"
                            : "none",
                      }}
                    >

                      {/* =================================================
                          DESKTOP ITEM
                      ================================================= */}

                      <div
                        className="cart-desktop-item d-none d-md-grid align-items-center"
                        style={{
                          gridTemplateColumns:
                            "minmax(270px, 1fr) 130px 105px 115px 120px",
                          gap: "15px",
                        }}
                      >

                        {/* =================================================
                            Product + BIG IMAGE
                        ================================================= */}

                        <div className="d-flex align-items-center gap-3">

                          <div
                            className="cart-product-image d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                              width: "130px",
                              height: "130px",
                              background:
                                "linear-gradient(135deg, #f8fafc, #eef2f7)",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius: "18px",
                              overflow: "hidden",
                              boxShadow:
                                "0 8px 22px rgba(15, 23, 42, 0.07)",
                            }}
                          >
                            <img
                              src={getImageUrl(
                                item.imageUrl
                              )}
                              alt={
                                item.name ||
                                "Product"
                              }
                              style={{
                                width: "112px",
                                height: "112px",
                                objectFit: "contain",
                                padding: "4px",
                                display: "block",
                              }}
                              onError={(e) => {
                                e.currentTarget.onerror =
                                  null;

                                e.currentTarget.src =
                                  "https://placehold.co/400x400?text=No+Image";
                              }}
                            />
                          </div>

                          <div
                            className="min-w-0"
                            style={{
                              minWidth: 0,
                            }}
                          >
                            <strong
                              className="text-dark d-block"
                              style={{
                                fontSize: "15px",
                                lineHeight: "1.4",
                              }}
                            >
                              {item.name ||
                                "Unknown Product"}
                            </strong>

                            <span className="small text-muted">
                              Product
                            </span>
                          </div>

                        </div>

                        {/* =================================================
                            Quantity
                        ================================================= */}

                        <div>
                          <div
                            className="d-flex align-items-center border rounded-pill bg-light"
                            style={{
                              width: "fit-content",
                              padding: "3px",
                            }}
                          >
                            <button
                              type="button"
                              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              disabled={processing}
                              onClick={() =>
                                handleDecrease(
                                  item.productId,
                                  item.quantity
                                )
                              }
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: 0,
                                background: "#ffffff",
                                border:
                                  "1px solid #e5e7eb",
                              }}
                            >
                              −
                            </button>

                            <span
                              className="fw-bold mx-3 text-dark"
                              style={{
                                minWidth: "18px",
                                textAlign: "center",
                              }}
                            >
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              disabled={processing}
                              onClick={() =>
                                handleIncrease(
                                  item.productId,
                                  item.quantity
                                )
                              }
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: 0,
                                background: "#ffffff",
                                border:
                                  "1px solid #e5e7eb",
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* =================================================
                            Price
                        ================================================= */}

                        <div>
                          <span className="text-muted">
                            {formatCurrency(
                              Number(item.price || 0)
                            )}
                          </span>
                        </div>

                        {/* =================================================
                            Subtotal
                        ================================================= */}

                        <div>
                          <span className="fw-bold text-dark">
                            {formatCurrency(
                              Number(item.price || 0) *
                                Number(
                                  item.quantity || 0
                                )
                            )}
                          </span>
                        </div>

                        {/* =================================================
                            Remove (Fixed Text Clipping)
                        ================================================= */}

                        <div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger rounded-3 px-3 py-2"
                            disabled={processing}
                            onClick={() =>
                              handleRemove(
                                item.productId
                              )
                            }
                            style={{
                              whiteSpace: "nowrap",
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🗑️ Remove
                          </button>
                        </div>

                      </div>

                      {/* =================================================
                          MOBILE ITEM
                      ================================================= */}

                      <div className="cart-mobile-item d-md-none">

                        <div className="d-flex align-items-center gap-3 mb-3">

                          {/* BIGGER MOBILE IMAGE */}

                          <div
                            className="d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                              width: "90px",
                              height: "90px",
                              background:
                                "linear-gradient(135deg, #f8fafc, #eef2f7)",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius: "16px",
                              overflow: "hidden",
                              boxShadow:
                                "0 6px 18px rgba(15, 23, 42, 0.06)",
                            }}
                          >
                            <img
                              src={getImageUrl(
                                item.imageUrl
                              )}
                              alt={
                                item.name ||
                                "Product"
                              }
                              style={{
                                width: "78px",
                                height: "78px",
                                objectFit: "contain",
                                padding: "4px",
                                display: "block",
                              }}
                              onError={(e) => {
                                e.currentTarget.onerror =
                                  null;

                                e.currentTarget.src =
                                  "https://placehold.co/400x400?text=No+Image";
                              }}
                            />
                          </div>

                          <div className="flex-grow-1 min-w-0">
                            <strong
                              className="d-block text-dark"
                              style={{
                                fontSize: "15px",
                                lineHeight: "1.4",
                              }}
                            >
                              {item.name ||
                                "Unknown Product"}
                            </strong>

                            <small className="text-muted">
                              {formatCurrency(
                                Number(
                                  item.price || 0
                                )
                              )}
                            </small>
                          </div>

                        </div>

                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">

                          {/* Quantity */}

                          <div
                            className="d-flex align-items-center border rounded-pill bg-light"
                            style={{
                              padding: "3px",
                            }}
                          >
                            <button
                              type="button"
                              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              disabled={processing}
                              onClick={() =>
                                handleDecrease(
                                  item.productId,
                                  item.quantity
                                )
                              }
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: 0,
                                background: "#ffffff",
                                border:
                                  "1px solid #e5e7eb",
                              }}
                            >
                              −
                            </button>

                            <span
                              className="mx-3 fw-bold text-dark"
                              style={{
                                minWidth: "18px",
                                textAlign: "center",
                              }}
                            >
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                              disabled={processing}
                              onClick={() =>
                                handleIncrease(
                                  item.productId,
                                  item.quantity
                                )
                              }
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: 0,
                                background: "#ffffff",
                                border:
                                  "1px solid #e5e7eb",
                              }}
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}

                          <div className="text-end">
                            <small className="text-muted d-block">
                              Subtotal
                            </small>

                            <strong className="text-dark">
                              {formatCurrency(
                                Number(
                                  item.price || 0
                                ) *
                                  Number(
                                    item.quantity ||
                                      0
                                  )
                              )}
                            </strong>
                          </div>

                          {/* Remove (Fixed Text Clipping) */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger rounded-3 px-3 py-2"
                            disabled={processing}
                            onClick={() =>
                              handleRemove(
                                item.productId
                              )
                            }
                            style={{
                              whiteSpace: "nowrap",
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🗑️ Remove
                          </button>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* =====================================================
                  Product Count
              ===================================================== */}

              <div
                className="bg-white border rounded-4 shadow-sm mt-3 px-4 py-3"
              >
                <p className="text-muted mb-0 small">
                  <strong>{totalProducts}</strong>{" "}
                  product
                  {totalProducts !== 1 ? "s" : ""}{" "}
                  (
                  <strong>{totalItems}</strong>{" "}
                  item
                  {totalItems !== 1 ? "s" : ""}
                  )
                </p>
              </div>
            </div>

            {/* =====================================================
                Order Summary
            ===================================================== */}

            <div className="col-lg-4">

              <div
                className="bg-white rounded-4 shadow-sm border p-4"
                style={{
                  position: "sticky",
                  top: "20px",
                }}
              >

                <div className="d-flex align-items-center justify-content-between mb-4">

                  <h5 className="fw-bold mb-0 text-dark">
                    Order Summary
                  </h5>

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      background:
                        "linear-gradient(135deg, #eff6ff, #eef2ff)",
                    }}
                  >
                    🛍️
                  </div>

                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Products
                  </span>

                  <span className="fw-semibold text-dark">
                    {totalProducts}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Items
                  </span>

                  <span className="fw-semibold text-dark">
                    {totalItems}
                  </span>
                </div>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-end mb-4">
                  <div>
                    <small className="text-muted d-block mb-1">
                      Total Amount
                    </small>

                    <h3 className="mb-0 fw-bold text-dark">
                      {formatCurrency(total)}
                    </h3>
                  </div>
                </div>

                {/* Checkout */}

                <button
                  type="button"
                  className="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm"
                  disabled={processing}
                  onClick={handleCheckout}
                  style={{
                    border: "none",
                    background:
                      "linear-gradient(135deg, #198754, #157347)",
                  }}
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 mt-2 py-2 rounded-3"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>

                {/* Secure Checkout */}

                <div
                  className="mt-4 p-3 rounded-3 text-center"
                  style={{
                    background: "#f8fafc",
                  }}
                >
                  <small className="text-muted">
                    🔒 Secure checkout
                  </small>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          CART RESPONSIVE IMAGE STYLES
          ========================================================= */}

      <style>
        {`
          .cart-product-image {
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease,
              border-color 0.25s ease;
          }

          .cart-product-image:hover {
            transform: scale(1.03);
            box-shadow:
              0 12px 28px rgba(15, 23, 42, 0.10) !important;
            border-color: #cbd5e1 !important;
          }

          .cart-item {
            transition:
              background-color 0.2s ease;
          }

          .cart-item:hover {
            background-color: rgba(248, 250, 252, 0.75);
          }

          @media (max-width: 1199px) and (min-width: 768px) {
            .cart-desktop-header,
            .cart-desktop-item {
              grid-template-columns:
                minmax(240px, 1fr)
                115px
                95px
                105px
                110px !important;

              gap: 10px !important;
            }

            .cart-product-image {
              width: 115px !important;
              height: 115px !important;
            }

            .cart-product-image img {
              width: 98px !important;
              height: 98px !important;
            }
          }

          @media (max-width: 767px) {
            .cart-page {
              padding-top: 25px !important;
              padding-bottom: 30px !important;
            }

            .cart-mobile-item {
              width: 100%;
            }

            .cart-item {
              padding-top: 20px !important;
              padding-bottom: 20px !important;
            }
          }

          @media (max-width: 480px) {
            .cart-product-image,
            .cart-mobile-item > div:first-child > div:first-child {
              width: 88px !important;
              height: 88px !important;
            }

            .cart-mobile-item img {
              width: 76px !important;
              height: 76px !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .cart-product-image,
            .cart-item {
              transition: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Cart;