import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

// =====================================================
// Get Wishlist from LocalStorage
// =====================================================
const getWishlistItems = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error(
      "Error reading wishlist:",  
      error
    );

    return [];
  }
};

// =====================================================
// Save Wishlist to LocalStorage
// =====================================================
const saveWishlistItems = (items) => {
  localStorage.setItem(
    "wishlist",
    JSON.stringify(items)
  );

  // Notify Navbar/ProductList
  window.dispatchEvent(
    new Event("wishlistUpdated")
  );
};

// =====================================================
// Get Logged-in User
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

// =====================================================
// Wishlist Component
// =====================================================
const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const navigate = useNavigate();

  // =====================================================
  // Load Wishlist
  // =====================================================
  useEffect(() => {
    const syncWishlist = () => {
      setItems(getWishlistItems());
    };

    // Initial load
    syncWishlist();

    // Listen for updates from ProductList/ProductDetail
    window.addEventListener(
      "wishlistUpdated",
      syncWishlist
    );

    // Listen for changes from another browser tab
    window.addEventListener(
      "storage",
      syncWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        syncWishlist
      );

      window.removeEventListener(
        "storage",
        syncWishlist
      );
    };
  }, []);

  // =====================================================
  // Remove Item from Wishlist
  // =====================================================
  const removeItem = async (productId) => {
    const user = getStoredUser();

    // ---------------------------------------------------
    // Confirmation
    // ---------------------------------------------------
    const result = await Swal.fire({
      title: "Remove from Wishlist?",
      text: "This product will be removed from your wishlist.",
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

    try {
      setRemovingId(productId);

      if (user?.email) {
        try {
          await api.post(
            `/wishlist/add/${productId}?email=${encodeURIComponent(
              user.email
            )}`
          );
        } catch (apiError) {
          console.error(
            "Backend wishlist update failed:",
            apiError
          );
        }
      }

      // =================================================
      // Remove from LocalStorage
      // =================================================
      const next = getWishlistItems().filter(
        (item) =>
          Number(item?.id) !==
          Number(productId)
      );

      saveWishlistItems(next);
      setItems(next);

      // =================================================
      // Success Alert
      // =================================================
      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Product removed from your wishlist.",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message ||
          "Could not remove product from wishlist.",
      });
    } finally {
      setRemovingId(null);
    }
  };

  // =====================================================
  // View Product Details
  // =====================================================
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  // =====================================================
  // Product Image URL (Dynamic Local/Prod support)
  // =====================================================
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === "") {
      return "https://placehold.co/600x400?text=No+Image+Available";
    }

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    const cleanPath = imageUrl.startsWith("/")
      ? imageUrl
      : `/${imageUrl}`;

    const backendUrl =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
    "https://full-stack-ecommerce-catalog.onrender.com";


    return `${backendUrl}${cleanPath}`;
  };

  // =====================================================
  // Loading
  // =====================================================
  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-loading">
          <div className="premium-spinner"></div>

          <p>Loading wishlist...</p>
        </div>

        <style>{`
          .wishlist-page {
            min-height: 100vh;
            background:
              radial-gradient(
                circle at 10% 10%,
                rgba(99, 102, 241, 0.09),
                transparent 30%
              ),
              radial-gradient(
                circle at 90% 90%,
                rgba(236, 72, 153, 0.08),
                transparent 30%
              ),
              #f8fafc;
          }

          .wishlist-loading {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #64748b;
          }

          .wishlist-loading p {
            margin-top: 16px;
            font-size: 14px;
            font-weight: 600;
          }

          .premium-spinner {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 3px solid #e2e8f0;
            border-top-color: #4f46e5;
            border-right-color: #ec4899;
            animation: wishlistSpin 0.8s linear infinite;
          }

          @keyframes wishlistSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // =====================================================
  // Render
  // =====================================================
  return (
    <div className="wishlist-page">

      <div className="wishlist-container">

        {/* =================================================
            Header
        ================================================== */}
        <div className="wishlist-header">

          <div className="wishlist-title-wrapper">

            <div className="wishlist-main-icon">
              ❤️
            </div>

            <div>
              <h2>My Wishlist</h2>

              {items.length > 0 && (
                <p>
                  {items.length} product
                  {items.length !== 1
                    ? "s"
                    : ""}{" "}
                  saved
                </p>
              )}
            </div>

          </div>

          <Link
            to="/"
            className="continue-shopping"
          >
            <span>🛍️</span>
            <span>Continue Shopping</span>
          </Link>

        </div>

        {/* =================================================
            Empty Wishlist
        ================================================== */}
        {items.length === 0 ? (
          <div className="empty-wishlist">

            <div className="empty-heart">
              ❤️
            </div>

            <h4>
              Your wishlist is empty.
            </h4>

            <p>
              Save products you love and
              come back anytime.
            </p>

            <button
              type="button"
              className="browse-button"
              onClick={() => navigate("/")}
            >
              Browse Products
            </button>

          </div>
        ) : (

          /* =================================================
              Wishlist Products
          ================================================== */
          <div className="wishlist-grid">

            {items.map((product) => (

              <div
                key={product.id}
                className="wishlist-card"
              >

                {/* =================================================
                    Product Image
                ================================================== */}
                <div className="wishlist-image-wrapper">

                  <div className="heart-badge">
                    ♥
                  </div>

                  <img
                    src={getImageUrl(
                      product.imageUrl
                    )}
                    alt={
                      product.name ||
                      "Product"
                    }
                    className="wishlist-image"
                    onError={(e) => {
                      e.target.onerror = null;

                      e.target.src =
                        "https://placehold.co/600x400?text=Image+Not+Found";
                    }}
                  />

                </div>

                {/* =================================================
                    Card Body
                ================================================== */}
                <div className="wishlist-card-body">

                  {/* Product Name */}
                  <h5>
                    {product.name ||
                      "Unnamed Product"}
                  </h5>

                  {/* Description */}
                  <p className="product-description">
                    {product.description ||
                      "No description available."}
                  </p>

                  <div className="wishlist-card-bottom">

                    {/* Price */}
                    <div className="product-price">
                      ₹
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </div>

                    {/* Buttons */}
                    <div className="wishlist-actions">

                      {/* View Details */}
                      <button
                        type="button"
                        className="view-details-button"
                        onClick={() =>
                          handleViewDetails(
                            product.id
                          )
                        }
                      >
                        <span>👁️</span>
                        <span>View Details</span>
                      </button>

                      {/* Remove */}
                      <button
                        type="button"
                        className="remove-button"
                        disabled={
                          removingId ===
                          product.id
                        }
                        onClick={() =>
                          removeItem(
                            product.id
                          )
                        }
                      >
                        {removingId ===
                        product.id ? (
                          <>
                            <span className="remove-spinner"></span>
                            <span>Removing...</span>
                          </>
                        ) : (
                          <>
                            <span>🗑️</span>
                            <span>Remove</span>
                          </>
                        )}
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* =================================================
          Premium UI Styles
      ================================================== */}
      <style>{`

        /* ==============================
           Page
        ============================== */

        .wishlist-page {
          min-height: 100vh;
          padding: 48px 20px 70px;

          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(99, 102, 241, 0.09),
              transparent 30%
            ),
            radial-gradient(
              circle at 100% 100%,
              rgba(236, 72, 153, 0.08),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #f8fafc 0%,
              #f1f5f9 100%
            );
        }

        .wishlist-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* ==============================
           Header
        ============================== */

        .wishlist-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
        }

        .wishlist-title-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .wishlist-main-icon {
          width: 56px;
          height: 56px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 17px;

          font-size: 25px;

          background:
            linear-gradient(
              135deg,
              #ec4899,
              #e11d48
            );

          box-shadow:
            0 12px 28px
            rgba(236, 72, 153, 0.25);
        }

        .wishlist-header h2 {
          margin: 0;

          color: #0f172a;

          font-size: 28px;
          font-weight: 800;

          letter-spacing: -0.7px;
        }

        .wishlist-header p {
          margin: 4px 0 0;

          color: #64748b;

          font-size: 13px;
        }

        /* ==============================
           Continue Shopping
        ============================== */

        .continue-shopping {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 10px 15px;

          border-radius: 11px;

          color: #4f46e5;
          background: rgba(255,255,255,0.85);

          border: 1px solid #e2e8f0;

          text-decoration: none;

          font-size: 13px;
          font-weight: 700;

          box-shadow:
            0 5px 15px
            rgba(15, 23, 42, 0.05);

          transition: all 0.2s ease;
        }

        .continue-shopping:hover {
          color: #3730a3;
          background: white;

          transform: translateY(-2px);

          box-shadow:
            0 10px 22px
            rgba(15, 23, 42, 0.09);
        }

        /* ==============================
           Product Grid
        ============================== */

        .wishlist-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 24px;
        }

        /* ==============================
           Product Card
        ============================== */

        .wishlist-card {
          overflow: hidden;

          background:
            rgba(255,255,255,0.96);

          border:
            1px solid
            rgba(226,232,240,0.9);

          border-radius: 20px;

          box-shadow:
            0 18px 45px
            rgba(15,23,42,0.07),
            0 5px 18px
            rgba(15,23,42,0.04);

          backdrop-filter: blur(12px);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;

          animation: wishlistCardEnter 0.45s ease both;
        }

        .wishlist-card:hover {
          transform: translateY(-6px);

          border-color:
            rgba(99,102,241,0.18);

          box-shadow:
            0 25px 55px
            rgba(15,23,42,0.11),
            0 8px 25px
            rgba(79,70,229,0.07);
        }

        @keyframes wishlistCardEnter {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ==============================
           Image
        ============================== */

        .wishlist-image-wrapper {
          height: 235px;

          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          background:
            radial-gradient(
              circle at center,
              #ffffff 0%,
              #f8fafc 65%,
              #eef2f7 100%
            );

          border-bottom:
            1px solid #f1f5f9;
        }

        .wishlist-image {
          width: 100%;
          height: 235px;

          object-fit: contain;

          padding: 18px;

          transition:
            transform 0.35s ease;
        }

        .wishlist-card:hover
        .wishlist-image {
          transform: scale(1.05);
        }

        /* ==============================
           Heart Badge
        ============================== */

        .heart-badge {
          position: absolute;

          top: 14px;
          right: 14px;

          width: 35px;
          height: 35px;

          z-index: 2;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #e11d48;

          background:
            rgba(255,255,255,0.92);

          border:
            1px solid
            rgba(255,255,255,0.8);

          box-shadow:
            0 5px 15px
            rgba(15,23,42,0.10);

          font-size: 16px;
        }

        /* ==============================
           Card Body
        ============================== */

        .wishlist-card-body {
          padding: 20px;
        }

        .wishlist-card-body h5 {
          margin: 0 0 8px;

          color: #172033;

          font-size: 17px;
          font-weight: 750;

          line-height: 1.35;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          overflow: hidden;
        }

        .product-description {
          min-height: 42px;

          margin: 0 0 18px;

          color: #64748b;

          font-size: 12px;

          line-height: 1.6;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          overflow: hidden;
        }

        /* ==============================
           Price
        ============================== */

        .product-price {
          margin-bottom: 15px;

          color: #4f46e5;

          font-size: 21px;
          font-weight: 850;

          letter-spacing: -0.4px;
        }

        /* ==============================
           Buttons
        ============================== */

        .wishlist-actions {
          display: grid;
          gap: 9px;
        }

        .view-details-button,
        .remove-button {
          width: 100%;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          border-radius: 11px;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .view-details-button {
          border: 0;

          color: white;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          box-shadow:
            0 8px 18px
            rgba(79,70,229,0.20);
        }

        .view-details-button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 12px 24px
            rgba(79,70,229,0.28);
        }

        .remove-button {
          color: #dc2626;

          background: #fff;

          border:
            1px solid
            #fecaca;
        }

        .remove-button:hover:not(:disabled) {
          color: #b91c1c;

          background: #fef2f2;

          border-color: #fca5a5;

          transform: translateY(-1px);
        }

        .remove-button:disabled {
          opacity: 0.65;

          cursor: not-allowed;
        }

        /* ==============================
           Remove Spinner
        ============================== */

        .remove-spinner {
          width: 15px;
          height: 15px;

          border:
            2px solid
            rgba(220,38,38,0.2);

          border-top-color: #dc2626;

          border-radius: 50%;

          animation:
            wishlistSpin 0.7s linear infinite;
        }

        /* ==============================
           Empty Wishlist
        ============================== */

        .empty-wishlist {
          padding: 85px 25px;

          text-align: center;

          background:
            rgba(255,255,255,0.92);

          border:
            1px solid
            #e2e8f0;

          border-radius: 22px;

          box-shadow:
            0 22px 55px
            rgba(15,23,42,0.07);
        }

        .empty-heart {
          width: 86px;
          height: 86px;

          margin:
            0 auto 22px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 26px;

          background:
            linear-gradient(
              135deg,
              #fff1f2,
              #fce7f3
            );

          font-size: 39px;

          box-shadow:
            0 12px 28px
            rgba(236,72,153,0.10);
        }

        .empty-wishlist h4 {
          margin: 0 0 9px;

          color: #1e293b;

          font-size: 21px;
          font-weight: 800;
        }

        .empty-wishlist p {
          margin: 0 0 22px;

          color: #64748b;

          font-size: 14px;
        }

        .browse-button {
          height: 45px;

          padding: 0 22px;

          border: 0;

          border-radius: 11px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          font-size: 13px;
          font-weight: 700;

          box-shadow:
            0 9px 20px
            rgba(79,70,229,0.23);

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .browse-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 13px 26px
            rgba(79,70,229,0.30);
        }

        /* ==============================
           Responsive
        ============================== */

        @media (max-width: 992px) {
          .wishlist-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .wishlist-page {
            padding: 32px 15px 55px;
          }

          .wishlist-header {
            align-items: flex-start;
          }

          .wishlist-main-icon {
            width: 48px;
            height: 48px;

            border-radius: 14px;

            font-size: 21px;
          }

          .wishlist-header h2 {
            font-size: 23px;
          }

          .continue-shopping {
            padding: 9px 11px;
          }

          .continue-shopping span:last-child {
            display: none;
          }

          .wishlist-grid {
            gap: 18px;
          }
        }

        @media (max-width: 576px) {
          .wishlist-grid {
            grid-template-columns: 1fr;
          }

          .wishlist-header {
            gap: 12px;
          }

          .wishlist-title-wrapper {
            gap: 11px;
          }

          .wishlist-header h2 {
            font-size: 21px;
          }

          .wishlist-header p {
            font-size: 11px;
          }

          .wishlist-image-wrapper,
          .wishlist-image {
            height: 230px;
          }

          .wishlist-card-body {
            padding: 18px;
          }

          .empty-wishlist {
            padding: 65px 20px;
          }
        }

      `}</style>
    </div>
  );
};

export default Wishlist;