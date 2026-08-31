import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import api from "../services/api";
import ProductReview from "../components/ProductReview";
import PaymentComponent from "../components/PaymentComponent";

// =====================================================
// Backend base URL without /api
// =====================================================
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  import.meta.env.VITE_API_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com";

// =====================================================
// Wishlist Helpers
// =====================================================
const getWishlistItems = () => {
  try {
    const raw = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    console.error("Error reading wishlist:", error);
    return [];
  }
};

const saveWishlistItems = (items) => {
  localStorage.setItem("wishlist", JSON.stringify(items));

  window.dispatchEvent(new Event("wishlistUpdated"));
};

// =====================================================
// Product Detail
// =====================================================
const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [dbOrderId, setDbOrderId] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);

  // =====================================================
  // Get Logged User
  // =====================================================
  const getStoredUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  };

  const user = getStoredUser();

  // =====================================================
  // Fetch Product
  // =====================================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/products/${id}`);

        setProduct(response.data);
      } catch (error) {
        console.error(
          "Error fetching product details:",
          error
        );

        const status = error.response?.status;

        if (status === 404) {
          setProduct(null);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error.response?.data?.message ||
              error.response?.data?.error ||
              "Failed to load product details.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // =====================================================
  // Check Wishlist
  // =====================================================
  useEffect(() => {
    if (!product?.id) {
      return;
    }

    const saved = getWishlistItems();

    const exists = saved.some(
      (item) =>
        Number(item?.id) === Number(product.id)
    );

    setWishlisted(exists);
  }, [product?.id]);

  // =====================================================
  // Wishlist
  // =====================================================
  const handleAddToWishlist = async () => {
    if (!product) {
      return;
    }

    const loggedUser = getStoredUser();

    if (!loggedUser?.email) {
      const result = await Swal.fire({
        title: "Login Required",
        text:
          "Please log in to add items to your wishlist.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }

      return;
    }

    try {
      setWishlistLoading(true);

      await api.post(
        `/wishlist/add/${product.id}?email=${encodeURIComponent(
          loggedUser.email
        )}`
      );

      const saved = getWishlistItems();

      const exists = saved.some(
        (item) =>
          Number(item?.id) === Number(product.id)
      );

      let updated;

      if (exists) {
        updated = saved.filter(
          (item) =>
            Number(item?.id) !== Number(product.id)
        );
      } else {
        updated = [
          ...saved,
          {
            ...product,
            id: Number(product.id),
          },
        ];
      }

      saveWishlistItems(updated);
      setWishlisted(!exists);

      Swal.fire({
        title: exists
          ? "Removed from Wishlist"
          : "Wishlisted! ❤️",

        text: exists
          ? `${product.name || "Product"} was removed from your wishlist.`
          : `${product.name || "Product"} was added to your wishlist!`,

        icon: exists ? "info" : "success",

        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Wishlist error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        await Swal.fire({
          title: "Session Expired",
          text: "Please log in again.",
          icon: "warning",
          confirmButtonText: "Login",
        });

        localStorage.removeItem("token");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      Swal.fire({
        title: "Wishlist Error",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Could not update wishlist.",
        icon: "error",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  // =====================================================
  // Add To Cart
  // =====================================================
  const handleAddProductToCart = () => {
    if (!product) {
      return;
    }

    if (!user?.email) {
      Swal.fire({
        title: "Login Required",
        text:
          "Please log in before adding products to your cart.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });

      return;
    }

    if (onAddToCart) {
      onAddToCart(product.id);

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text:
          `${product.name || "Product"} was added to your cart.`,
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // =====================================================
  // Prepare Order
  // =====================================================
  const handlePrepareOrderAndPay = async () => {
    if (!user?.email) {
      Swal.fire({
        title: "Login Required",
        text:
          "Please log in before making a payment.",
        icon: "info",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });

      return;
    }

    if (!product) {
      return;
    }

    try {
      setCreatingOrder(true);

      const orderPayload = {
        userEmail: user.email,
        totalAmount: product.price,
        items: [
          {
            productId: product.id,
            quantity: 1,
            price: product.price,
          },
        ],
      };

      const response = await api.post(
        "/orders",
        orderPayload
      );

      const generatedId =
        response.data?.id ||
        response.data?.orderId;

      if (!generatedId) {
        throw new Error(
          "Server failed to return a valid database Order ID."
        );
      }

      setDbOrderId(generatedId);
    } catch (error) {
      console.error(
        "Failed to initialize database order:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Order Generation Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Could not create order record in the database.",
      });
    } finally {
      setCreatingOrder(false);
    }
  };

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

    return `${BASE_URL.replace(
      /\/$/,
      ""
    )}/${imageUrl.replace(/^\//, "")}`;
  };

  // =====================================================
  // Loading
  // =====================================================
  if (loading) {
    return (
      <div className="product-detail-page theme-page">
        <div className="container">
          <div className="premium-loading">
            <div className="premium-spinner"></div>

            <p>
              Loading product details...
            </p>
          </div>
        </div>

        <style>{`
          .theme-page {
            background: var(--bg);
            color: var(--text-primary);
          }

          .premium-loading {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
          }

          .premium-spinner {
            width: 42px;
            height: 42px;
            border: 3px solid var(--border);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: premiumSpin .7s linear infinite;
          }

          .premium-loading p {
            margin-top: 18px;
            font-size: 14px;
            color: var(--text-secondary);
          }

          @keyframes premiumSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // =====================================================
  // Not Found
  // =====================================================
  if (!product) {
    return (
      <div className="product-detail-page theme-page">
        <div className="container">
          <div className="not-found-card theme-card">
            <div className="not-found-icon">
              !
            </div>

            <h3>
              Product Not Found!
            </h3>

            <p>
              The product you are looking for
              does not exist.
            </p>

            <button
              type="button"
              className="premium-primary-button"
              onClick={() => navigate("/")}
            >
              ← Back to Shop
            </button>
          </div>
        </div>

        <style>{`
          .not-found-card {
            max-width: 520px;
            margin: 80px auto;
            padding: 50px 35px;
            text-align: center;
            border-radius: 26px;
          }

          .not-found-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(239,68,68,.12);
            color: #ef4444;
            font-size: 28px;
            font-weight: 800;
          }

          .not-found-card h3 {
            color: var(--text-primary);
            font-weight: 800;
          }

          .not-found-card p {
            color: var(--text-secondary);
            margin-bottom: 25px;
          }

          .premium-primary-button {
            border: 0;
            padding: 13px 22px;
            border-radius: 12px;
            color: white;
            background:
              linear-gradient(
                135deg,
                #4f46e5,
                #7c3aed
              );
            font-weight: 700;
            box-shadow:
              0 10px 25px
              rgba(79,70,229,.22);
            transition: .2s ease;
          }

          .premium-primary-button:hover {
            transform: translateY(-2px);
          }
        `}</style>
      </div>
    );
  }

  // =====================================================
  // Main UI
  // =====================================================
  return (
    <div className="premium-product-page">

      <div className="premium-orb orb-one"></div>
      <div className="premium-orb orb-two"></div>

      <div className="container py-3 py-lg-4 position-relative">

        {/* =================================================
            Back Button
        ================================================= */}
        <button
          type="button"
          className="premium-back-button"
          onClick={() => navigate(-1)}
        >
          <span>←</span>
          Back to Products
        </button>

        {/* =================================================
            Main Product Card
        ================================================= */}
        <div className="product-main-card theme-card">

          <div className="row g-0">

            {/* =================================================
                Product Image
            ================================================= */}
            <div className="col-lg-6">

              <div className="product-image-section">

                <div className="image-glow"></div>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                  className={`wishlist-button ${
                    wishlisted ? "wishlisted" : ""
                  }`}
                  title={
                    wishlisted
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                  aria-label={
                    wishlisted
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                >
                  {wishlistLoading ? (
                    <span className="wishlist-spinner"></span>
                  ) : (
                    <span>
                      {wishlisted ? "♥" : "♡"}
                    </span>
                  )}
                </button>

                {/* Product Image */}
                <div className="product-image-wrapper">
                  <img
                    src={getImageUrl(
                      product.imageUrl
                    )}
                    alt={
                      product.name || "Product"
                    }
                    className="product-main-image"
                    onError={(e) => {
                      e.currentTarget.onerror = null;

                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=Image+Not+Found";
                    }}
                  />
                </div>

              </div>
            </div>

            {/* =================================================
                Product Information
            ================================================= */}
            <div className="col-lg-6">

              <div className="product-info-section">

                {/* Category */}
                <span className="category-badge">
                  Category ID:{" "}
                  {product.categoryId || "General"}
                </span>

                {/* Product Name */}
                <h1 className="product-title">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="rating-section">

                  {product.averageRating > 0 ? (
                    <>
                      <span className="stars">
                        {"⭐".repeat(
                          Math.round(
                            product.averageRating
                          )
                        )}
                      </span>

                      <span className="rating-text">
                        (
                        {Number(
                          product.averageRating
                        ).toFixed(1)}
                        {" "} / 5)
                      </span>
                    </>
                  ) : (
                    <span className="no-rating">
                      No ratings yet
                    </span>
                  )}

                </div>

                <div className="premium-divider"></div>

                {/* Price */}
                <div className="price-label">
                  Price
                </div>

                <h2 className="product-price">
                  ₹
                  {Number(
                    product.price || 0
                  ).toFixed(2)}
                </h2>

                {/* Description */}
                <div className="description-block">

                  <h5>
                    Description
                  </h5>

                  <p>
                    {product.description ||
                      "No description available for this product."}
                  </p>

                </div>

                {/* =================================================
                    Action Buttons
                ================================================= */}
                <div className="action-area">

                  {/* Add To Cart */}
                  <button
                    type="button"
                    className="cart-button"
                    onClick={
                      handleAddProductToCart
                    }
                  >
                    <span>
                      Add to Cart
                    </span>

                    <span className="button-icon">
                      🛍️
                    </span>
                  </button>

                  {/* Payment */}
                  {!dbOrderId ? (
                    <button
                      type="button"
                      onClick={
                        handlePrepareOrderAndPay
                      }
                      disabled={creatingOrder}
                      className="pay-button"
                    >
                      {creatingOrder ? (
                        <>
                          <span className="button-spinner"></span>

                          Preparing...
                        </>
                      ) : (
                        <>
                          <span>
                            Pay ₹
                            {Number(
                              product.price || 0
                            ).toFixed(2)}
                          </span>

                          <span>
                            →
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="payment-wrapper">
                      <PaymentComponent
                        orderId={dbOrderId}
                        amount={product.price}
                        userEmail={
                          user?.email ||
                          "guest@ecommerce.com"
                        }
                        onPaymentSuccess={(payId) => {
                          console.log(
                            "Payment successful:",
                            payId
                          );

                          navigate("/orders");
                        }}
                      />
                    </div>
                  )}

                </div>

                {/* =================================================
                    Trust Information
                ================================================= */}
                <div className="trust-row">

                  <div className="trust-item">
                    <span>✓</span>
                    Secure Checkout
                  </div>

                  <div className="trust-item">
                    <span>✓</span>
                    Premium Quality
                  </div>

                  <div className="trust-item">
                    <span>✓</span>
                    Easy Shopping
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =================================================
            Reviews
        ================================================= */}
        <div className="reviews-card theme-card">

          <ProductReview
            productId={product.id}
            productName={product.name}
          />

        </div>

      </div>

      {/* =====================================================
          COMPACT PRODUCT DETAIL CSS
      ===================================================== */}
      <style>{`

        /* =================================================
           GLOBAL
        ================================================= */

        * {
          box-sizing: border-box;
        }

        .premium-product-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;

          background: var(--bg);
          color: var(--text-primary);

          transition:
            background-color .25s ease,
            color .25s ease;
        }

        /* =================================================
           Background Orbs
        ================================================= */

        .premium-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);
        }

        .orb-one {
          width: 300px;
          height: 300px;

          top: -180px;
          left: -130px;

          background: rgba(99,102,241,.07);
        }

        .orb-two {
          width: 280px;
          height: 280px;

          right: -150px;
          bottom: -150px;

          background: rgba(124,58,237,.07);
        }

        /* =================================================
           Back Button
        ================================================= */

        .premium-back-button {
          border: 1px solid var(--border);
          background: var(--card);
          color: var(--text-secondary);

          border-radius: 10px;

          padding: 8px 14px;

          font-size: 12px;
          font-weight: 700;

          display: inline-flex;
          align-items: center;

          gap: 7px;

          margin-bottom: 15px;

          box-shadow:
            0 4px 14px var(--shadow);

          transition: all .2s ease;
        }

        .premium-back-button:hover {
          color: #6366f1;
          border-color: #6366f1;
          background: var(--hover-bg);

          transform: translateX(-2px);
        }

        /* =================================================
           MAIN PRODUCT CARD
        ================================================= */

        .product-main-card {
          position: relative;
          overflow: hidden;

          border-radius: 20px;

          animation:
            productEnter .45s ease-out;

          box-shadow:
            0 12px 35px var(--shadow);
        }

        @keyframes productEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =================================================
           IMAGE SECTION
           
           IMPORTANT:
           Previously 600px.
           Now approximately 420px.
        ================================================= */

        .product-image-section {
          position: relative;

          min-height: 420px;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 25px;

          overflow: hidden;

          background:
            radial-gradient(
              circle at center,
              var(--card) 0%,
              var(--muted-bg) 58%,
              rgba(99,102,241,.08) 100%
            );
        }

        /* =================================================
           Image Glow
        ================================================= */

        .image-glow {
          position: absolute;

          width: 230px;
          height: 230px;

          border-radius: 50%;

          background:
            rgba(99,102,241,.08);

          filter: blur(40px);
        }

        /* =================================================
           IMAGE WRAPPER
           
           Previously 500px.
           Now 350px.
        ================================================= */

        .product-image-wrapper {
          position: relative;

          width: 100%;
          height: 350px;

          display: flex;
          align-items: center;
          justify-content: center;

          z-index: 1;
        }

        /* =================================================
           MAIN IMAGE
        ================================================= */

        .product-main-image {
          width: 100%;
          height: 100%;

          max-width: 100%;
          max-height: 350px;

          object-fit: contain;

          display: block;

          transition:
            transform .35s ease,
            filter .35s ease;

          filter:
            drop-shadow(
              0 18px 25px var(--shadow)
            );
        }

        .product-image-wrapper:hover
        .product-main-image {
          transform: scale(1.025);
        }

        /* =================================================
           WISHLIST
        ================================================= */

        .wishlist-button {
          position: absolute;

          z-index: 5;

          top: 17px;
          right: 17px;

          width: 44px;
          height: 44px;

          border-radius: 50%;

          border: 1px solid var(--border);

          background: var(--card);

          color: var(--text-secondary);

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 23px;

          cursor: pointer;

          box-shadow:
            0 7px 18px var(--shadow);

          transition: all .2s ease;
        }

        .wishlist-button:hover {
          transform:
            translateY(-2px)
            scale(1.03);

          color: #ef4444;

          border-color: #fecaca;
        }

        .wishlist-button.wishlisted {
          color: white;

          border-color: #ef4444;

          background:
            linear-gradient(
              135deg,
              #ef4444,
              #dc2626
            );

          box-shadow:
            0 8px 20px
            rgba(239,68,68,.22);
        }

        .wishlist-spinner {
          width: 16px;
          height: 16px;

          border: 2px solid
            rgba(100,116,139,.25);

          border-top-color: #6366f1;

          border-radius: 50%;

          animation:
            spin .7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =================================================
           PRODUCT INFORMATION
           
           Reduced from 58px 55px.
        ================================================= */

        .product-info-section {
          height: 100%;

          padding: 32px 38px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          background: var(--card);
        }

        /* =================================================
           CATEGORY
        ================================================= */

        .category-badge {
          display: inline-flex;

          width: fit-content;

          align-items: center;

          padding: 5px 10px;

          border-radius: 999px;

          background:
            rgba(99,102,241,.10);

          border:
            1px solid
            rgba(99,102,241,.18);

          color: #818cf8;

          font-size: 10px;
          font-weight: 750;

          margin-bottom: 11px;
        }

        /* =================================================
           PRODUCT TITLE
        ================================================= */

        .product-title {
          margin: 0;

          color: var(--text-primary);

          font-size:
            clamp(25px, 3vw, 36px);

          line-height: 1.1;

          font-weight: 850;

          letter-spacing: -1px;
        }

        /* =================================================
           RATING
        ================================================= */

        .rating-section {
          display: flex;
          align-items: center;

          gap: 8px;

          margin-top: 11px;
        }

        .stars {
          font-size: 14px;
          letter-spacing: 1px;
        }

        .rating-text {
          color: var(--text-secondary);

          font-size: 12px;
          font-weight: 600;
        }

        .no-rating {
          color: var(--text-secondary);

          font-size: 12px;
          font-weight: 600;
        }

        /* =================================================
           DIVIDER
        ================================================= */

        .premium-divider {
          height: 1px;

          background:
            linear-gradient(
              90deg,
              var(--border),
              transparent
            );

          margin: 16px 0;
        }

        /* =================================================
           PRICE
        ================================================= */

        .price-label {
          color: var(--text-secondary);

          font-size: 10px;
          font-weight: 750;

          text-transform: uppercase;

          letter-spacing: 1px;
        }

        .product-price {
          margin: 2px 0 0;

          font-size: 31px;

          font-weight: 850;

          line-height: 1.1;

          letter-spacing: -.7px;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #8b5cf6
            );

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* =================================================
           DESCRIPTION
        ================================================= */

        .description-block {
          margin-top: 17px;
        }

        .description-block h5 {
          margin-bottom: 6px;

          color: var(--text-primary);

          font-size: 13px;

          font-weight: 800;
        }

        .description-block p {
          margin: 0;

          color: var(--text-secondary);

          font-size: 13px;

          line-height: 1.55;

          /* Prevent extremely long descriptions
             from making the card too tall */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* =================================================
           ACTION AREA
        ================================================= */

        .action-area {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 9px;

          margin-top: 20px;
        }

        /* =================================================
           ACTION BUTTONS
        ================================================= */

        .cart-button,
        .pay-button {
          min-height: 47px;

          border-radius: 11px;

          padding: 0 14px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 7px;

          font-size: 12px;

          font-weight: 750;

          cursor: pointer;

          transition: all .2s ease;
        }

        /* =================================================
           CART BUTTON
        ================================================= */

        .cart-button {
          border:
            1px solid
            rgba(99,102,241,.22);

          background:
            rgba(99,102,241,.10);

          color: #818cf8;
        }

        .cart-button:hover {
          transform: translateY(-2px);

          background:
            rgba(99,102,241,.17);

          box-shadow:
            0 8px 18px
            rgba(79,70,229,.10);
        }

        /* =================================================
           PAY BUTTON
        ================================================= */

        .pay-button {
          border: 0;

          color: white;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #059669
            );

          box-shadow:
            0 8px 18px
            rgba(22,163,74,.18);
        }

        .pay-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 11px 22px
            rgba(22,163,74,.24);
        }

        .pay-button:disabled {
          opacity: .7;
          cursor: not-allowed;
        }

        .button-icon {
          font-size: 15px;
        }

        .button-spinner {
          width: 15px;
          height: 15px;

          border:
            2px solid
            rgba(255,255,255,.35);

          border-top-color: white;

          border-radius: 50%;

          animation:
            spin .7s linear infinite;
        }

        /* =================================================
           PAYMENT
        ================================================= */

        .payment-wrapper {
          grid-column: span 2;
        }

        /* =================================================
           TRUST ROW
        ================================================= */

        .trust-row {
          display: flex;

          flex-wrap: wrap;

          gap: 10px;

          margin-top: 14px;

          padding-top: 12px;

          border-top:
            1px solid
            var(--border);
        }

        .trust-item {
          display: flex;

          align-items: center;

          gap: 4px;

          color: var(--text-secondary);

          font-size: 9px;

          font-weight: 650;
        }

        .trust-item span {
          color: #22c55e;

          font-weight: 900;
        }

        /* =================================================
           REVIEWS
        ================================================= */

        .reviews-card {
          margin-top: 22px;

          padding:
            4px 25px 20px;

          border-radius: 20px;

          box-shadow:
            0 8px 25px var(--shadow);
        }

        /* =================================================
           LARGE DESKTOP
        ================================================= */

        @media (min-width: 1200px) {

          .product-image-section {
            min-height: 410px;
          }

          .product-image-wrapper {
            height: 340px;
          }

          .product-main-image {
            max-height: 340px;
          }

          .product-info-section {
            padding:
              30px 38px;
          }

        }

        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 991px) {

          .product-image-section {
            min-height: 380px;

            padding:
              25px;
          }

          .product-image-wrapper {
            height: 310px;
          }

          .product-main-image {
            max-height: 310px;
          }

          .product-info-section {
            padding:
              30px 32px;
          }

        }

        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 767px) {

          .premium-product-page {
            padding-bottom: 15px;
          }

          .product-main-card {
            border-radius: 17px;
          }

          .product-image-section {
            min-height: 310px;

            padding:
              22px 18px;
          }

          .product-image-wrapper {
            height: 250px;
          }

          .product-main-image {
            max-height: 250px;
          }

          .wishlist-button {
            top: 13px;
            right: 13px;

            width: 41px;
            height: 41px;

            font-size: 21px;
          }

          .product-info-section {
            padding:
              25px 22px 27px;
          }

          .category-badge {
            margin-bottom: 9px;
          }

          .product-title {
            font-size: 28px;

            letter-spacing:
              -.7px;
          }

          .rating-section {
            margin-top: 9px;
          }

          .premium-divider {
            margin:
              13px 0;
          }

          .product-price {
            font-size: 29px;
          }

          .description-block {
            margin-top: 14px;
          }

          .description-block p {
            font-size: 12px;

            line-height: 1.5;

            -webkit-line-clamp: 4;
          }

          .action-area {
            grid-template-columns: 1fr;

            gap: 8px;

            margin-top: 17px;
          }

          .payment-wrapper {
            grid-column: span 1;
          }

          .cart-button,
          .pay-button {
            min-height: 45px;
          }

          .trust-row {
            justify-content: center;

            gap: 9px;

            margin-top: 12px;

            padding-top: 11px;
          }

          .reviews-card {
            padding:
              3px 12px 17px;

            border-radius: 17px;
          }

        }

        /* =================================================
           SMALL MOBILE
        ================================================= */

        @media (max-width: 400px) {

          .product-info-section {
            padding:
              22px 17px 24px;
          }

          .product-image-section {
            min-height: 285px;

            padding:
              18px;
          }

          .product-image-wrapper {
            height: 225px;
          }

          .product-main-image {
            max-height: 225px;
          }

          .product-title {
            font-size: 25px;
          }

          .product-price {
            font-size: 27px;
          }

          .premium-back-button {
            margin-left: 2px;

            padding:
              7px 11px;
          }

          .trust-item {
            font-size: 8px;
          }

        }

        /* =================================================
           VERY SHORT SCREENS
           Extra protection against tall cards
        ================================================= */

        @media (min-width: 768px) and (max-height: 800px) {

          .product-image-section {
            min-height: 370px;
          }

          .product-image-wrapper {
            height: 300px;
          }

          .product-main-image {
            max-height: 300px;
          }

          .product-info-section {
            padding:
              25px 35px;
          }

          .description-block {
            margin-top: 13px;
          }

          .action-area {
            margin-top: 16px;
          }

          .trust-row {
            margin-top: 11px;
            padding-top: 10px;
          }

        }

      `}</style>
    </div>
  );
};

export default ProductDetail;