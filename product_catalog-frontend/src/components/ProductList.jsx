import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ProductList = ({
  products = [],
  onAddToCart,
  onBuyNow,
  onViewDetails,
}) => {
  const [wishlist, setWishlist] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(null);

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );

        setWishlist(Array.isArray(saved) ? saved : []);
      } catch (error) {
        console.error("Error loading wishlist:", error);
        setWishlist([]);
      }
    };

    loadWishlist();

    window.addEventListener("wishlistUpdated", loadWishlist);
    window.addEventListener("storage", loadWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
      window.removeEventListener("storage", loadWishlist);
    };
  }, []);

  // =====================================================
  // TOGGLE WISHLIST
  // =====================================================

  const toggleWishlist = (product) => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      const wishlistItems = Array.isArray(saved)
        ? saved
        : [];

      const exists = wishlistItems.some((item) => {
        if (
          item &&
          typeof item === "object" &&
          item.id !== undefined
        ) {
          return item.id === product.id;
        }

        return item === product.id;
      });

      let updated;

      if (exists) {
        updated = wishlistItems.filter((item) => {
          if (
            item &&
            typeof item === "object" &&
            item.id !== undefined
          ) {
            return item.id !== product.id;
          }

          return item !== product.id;
        });

        Swal.fire({
          icon: "info",
          title: "Removed from Wishlist",
          text: `${
            product.name || "Product"
          } was removed from your wishlist.`,
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        updated = [...wishlistItems, product];

        Swal.fire({
          icon: "success",
          title: "Added to Wishlist",
          text: `${
            product.name || "Product"
          } added to your wishlist!`,
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );

      setWishlist(updated);

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (error) {
      console.error("Wishlist error:", error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Unable to update your wishlist.",
        confirmButtonText: "OK",
      });
    }
  };

  // =====================================================
  // CHECK WISHLIST
  // =====================================================

  const isWishlisted = (productId) => {
    return wishlist.some((item) => {
      if (
        item &&
        typeof item === "object" &&
        item.id !== undefined
      ) {
        return item.id === productId;
      }

      return item === productId;
    });
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (product) => {
    try {
      setLoadingProduct(product.id);

      if (onAddToCart) {
        await onAddToCart(product.id);
      } else {
        const CART_STORAGE_KEY = "guestCart";

        const existingCart = JSON.parse(
          localStorage.getItem(
            CART_STORAGE_KEY
          ) || "[]"
        );

        const existingIndex =
          existingCart.findIndex(
            (item) =>
              Number(
                item.product?.id ??
                  item.productId
              ) === Number(product.id)
          );

        if (existingIndex > -1) {
          existingCart[existingIndex].quantity =
            (existingCart[existingIndex].quantity || 1) +
            1;
        } else {
          existingCart.push({
            product,
            productId: product.id,
            quantity: 1,
            price: product.price,
          });
        }

        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(existingCart)
        );
      }

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${
          product.name || "Product"
        } has been added to your cart.`,
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to Add",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while adding the product to your cart.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoadingProduct(null);
    }
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = async (product) => {
    try {
      setLoadingProduct(product.id);

      if (onBuyNow) {
        await onBuyNow(product.id);
      } else {
        const directBuyItem = [
          {
            product,
            productId: product.id,
            quantity: 1,
            price: product.price,
          },
        ];

        localStorage.setItem(
          "directBuyItem",
          JSON.stringify(directBuyItem)
        );

        localStorage.setItem(
          "isDirectBuy",
          "true"
        );

        window.location.href = "/checkout";
      }
    } catch (error) {
      console.error(
        "Buy now error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to proceed with the purchase.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoadingProduct(null);
    }
  };

  // =====================================================
  // PRODUCT IMAGE URL
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
    import.meta.env.VITE_API_BASE_URL?.replace(
      /\/api\/?$/,
      ""
    ) || "https://full-stack-ecommerce-catalog.onrender.com";

  return `${backendUrl}${cleanPath}`;
};



  // =====================================================
  // RATING STARS
  // =====================================================

  const renderStars = (rating) => {
    const numericRating =
      Number(rating) || 0;

    const validRating =
      Math.round(numericRating);

    if (validRating <= 0) {
      return null;
    }

    return (
      <div className="mb-2 d-flex align-items-center gap-2">
        <div
          className="d-inline-flex align-items-center px-2 py-1 rounded-pill"
          style={{
            background:
              "linear-gradient(135deg, #fff7ed, #fffbeb)",
            border: "1px solid #fde68a",
          }}
        >
          <span
            className="fw-semibold"
            style={{
              color: "#f59e0b",
              fontSize: "12px",
              letterSpacing: "1px",
            }}
          >
            {"⭐".repeat(
              Math.min(validRating, 5)
            )}
          </span>
        </div>

        <span
          className="text-theme-secondary"
          style={{
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          ({numericRating.toFixed(1)})
        </span>
      </div>
    );
  };

  // =====================================================
  // NO PRODUCTS
  // =====================================================

  if (
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return (
      <div
        className="text-center py-5"
        style={{
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="rounded-4 p-5"
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "var(--card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            boxShadow:
              "0 20px 50px var(--shadow)",
          }}
        >
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "80px",
              height: "80px",
              background:
                "linear-gradient(135deg, #eff6ff, #eef2ff)",
              fontSize: "36px",
            }}
          >
            🛍️
          </div>

          <h3
            className="fw-bold mb-2"
            style={{
              color: "var(--text-primary)",
            }}
          >
            No Products Found
          </h3>

          <p
            className="mb-0"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Try changing search or category filters.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PRODUCT LIST
  // =====================================================

  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {products.map((product) => {
          const wishlisted =
            isWishlisted(product.id);

          const isLoading =
            loadingProduct === product.id;

          return (
            <div
              key={product.id}
              className="col"
            >
              {/* =================================================
                  PRODUCT CARD
              ================================================= */}

              <div
                className="product-card position-relative overflow-hidden"
                style={{
                  borderRadius: "20px",
                  background: "var(--card)",
                  color: "var(--text-primary)",
                  border:
                    "1px solid var(--border)",
                  boxShadow:
                    "0 8px 24px var(--shadow)",
                  transition:
                    "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* =================================================
                    WISHLIST
                ================================================= */}

                <button
                  type="button"
                  className="wishlist-button position-absolute d-flex align-items-center justify-content-center"
                  style={{
                    top: "12px",
                    right: "12px",
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    zIndex: 5,
                    background: wishlisted
                      ? "linear-gradient(135deg, #ef4444, #dc2626)"
                      : "var(--card)",
                    color: wishlisted
                      ? "#fff"
                      : "var(--text-secondary)",
                    border:
                      "1px solid var(--border)",
                    boxShadow:
                      "0 6px 16px var(--shadow)",
                    backdropFilter:
                      "blur(10px)",
                    cursor: "pointer",
                    transition:
                      "all 0.25s ease",
                  }}
                  aria-label={
                    wishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  onClick={() =>
                    toggleWishlist(product)
                  }
                  onMouseEnter={(e) => {
                    if (!wishlisted) {
                      e.currentTarget.style.color =
                        "#ef4444";

                      e.currentTarget.style.transform =
                        "scale(1.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      wishlisted
                        ? "#fff"
                        : "var(--text-secondary)";

                    e.currentTarget.style.transform =
                      "scale(1)";
                  }}
                >
                  <span
                    style={{
                      fontSize: "19px",
                      lineHeight: 1,
                    }}
                  >
                    {wishlisted ? "♥" : "♡"}
                  </span>
                </button>

                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}

                <div
                  className="product-image-wrapper position-relative d-flex align-items-center justify-content-center overflow-hidden"
                  style={{
                    height: "240px",
                    cursor: onViewDetails
                      ? "pointer"
                      : "default",
                    background:
                      "var(--muted-bg)",
                  }}
                  onClick={() => {
                    if (onViewDetails) {
                      onViewDetails(product.id);
                    }
                  }}
                >
                  {/* Decorative Background */}

                  <div
                    className="position-absolute rounded-circle"
                    style={{
                      width: "175px",
                      height: "175px",
                      background:
                        "radial-gradient(circle, var(--card), transparent)",
                      filter: "blur(2px)",
                      opacity: 0.95,
                    }}
                  />

                  {/* Product Image */}

                  <img
                    src={getImageUrl(
                      product.imageUrl
                    )}
                    alt={
                      product.name || "Product"
                    }
                    className="product-list-image position-relative"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: "14px",
                      transform: "scale(1.04)",
                      transition:
                        "transform 0.45s ease",
                      zIndex: 1,
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;

                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=Image+Not+Found";
                    }}
                  />

                  {/* View Details Overlay */}

                  {onViewDetails && (
                    <div
                      className="position-absolute bottom-0 start-0 end-0 text-center py-2 product-view-overlay"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(15,23,42,0.72), transparent)",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.3px",
                        opacity: 0,
                        transition:
                          "opacity 0.3s ease",
                        zIndex: 2,
                        pointerEvents: "none",
                      }}
                    >
                      View Product
                    </div>
                  )}
                </div>

                {/* =================================================
                    PRODUCT BODY
                ================================================= */}

                <div
                  className="d-flex flex-column p-3"
                  style={{
                    minHeight: "270px",
                    background:
                      "var(--card)",
                  }}
                >
                  {/* Product Name */}

                  <h5
                    className="fw-bold mb-1"
                    style={{
                      color:
                        "var(--text-primary)",
                      fontSize: "16px",
                      lineHeight: "1.3",
                      cursor: onViewDetails
                        ? "pointer"
                        : "default",
                      minHeight: "21px",
                    }}
                    onClick={() => {
                      if (onViewDetails) {
                        onViewDetails(product.id);
                      }
                    }}
                    title={
                      product.name || "Product"
                    }
                  >
                    {product.name || "Product"}
                  </h5>

                  {/* Rating */}

                  {Number(
                    product.averageRating
                  ) > 0 &&
                    renderStars(
                      product.averageRating
                    )}

                  {/* No Rating */}

                  {Number(
                    product.averageRating
                  ) <= 0 && (
                    <div
                      className="mb-2"
                      style={{
                        minHeight: "25px",
                        fontSize: "11px",
                        color:
                          "var(--text-secondary)",
                      }}
                    >
                      No ratings yet
                    </div>
                  )}

                  {/* Description */}

                  <p
                    className="mb-2"
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.45",
                      display:
                        "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient:
                        "vertical",
                      overflow: "hidden",
                      minHeight: "35px",
                      color:
                        "var(--text-secondary)",
                    }}
                    title={
                      product.description || ""
                    }
                  >
                    {product.description ||
                      "High quality product for all occasions"}
                  </p>

                  {/* Divider */}

                  <div
                    className="product-divider mb-2"
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, var(--border), transparent)",
                    }}
                  />

                  {/* Price */}

                  <div className="mb-2 mt-auto">
                    <small
                      className="d-block mb-0"
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        textTransform:
                          "uppercase",
                        letterSpacing: "0.7px",
                        color:
                          "var(--text-secondary)",
                      }}
                    >
                      Price
                    </small>

                    <span
                      className="fw-bold"
                      style={{
                        color: "#2563eb",
                        fontSize: "21px",
                        letterSpacing: "-0.4px",
                      }}
                    >
                      ₹
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  {/* =================================================
                      BUTTONS
                  ================================================= */}

                  <div className="d-grid gap-2">
                    {/* View Details */}

                    {onViewDetails && (
                      <button
                        type="button"
                        className="btn details-button fw-semibold"
                        onClick={() =>
                          onViewDetails(
                            product.id
                          )
                        }
                        style={{
                          minHeight: "38px",
                          borderRadius: "9px",
                          padding: "7px 12px",
                          fontSize: "12px",
                          color:
                            "var(--text-primary)",
                          background:
                            "var(--muted-bg)",
                          border:
                            "1px solid var(--border)",
                          transition:
                            "all 0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "var(--hover-bg)";

                          e.currentTarget.style.transform =
                            "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "var(--muted-bg)";

                          e.currentTarget.style.transform =
                            "translateY(0)";
                        }}
                      >
                        ⭐ View Reviews & Details
                      </button>
                    )}

                    {/* Buy Now */}

                    <button
                      type="button"
                      className="btn fw-semibold text-white"
                      disabled={isLoading}
                      onClick={() =>
                        handleBuyNow(product)
                      }
                      style={{
                        minHeight: "38px",
                        border: "none",
                        borderRadius: "9px",
                        padding: "8px 12px",
                        fontSize: "12px",
                        background:
                          "linear-gradient(135deg, #16a34a, #15803d)",
                        boxShadow:
                          "0 6px 14px rgba(22, 163, 74, 0.18)",
                        transition:
                          "all 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.transform =
                            "translateY(-1px)";

                          e.currentTarget.style.boxShadow =
                            "0 9px 18px rgba(22, 163, 74, 0.25)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0)";

                        e.currentTarget.style.boxShadow =
                          "0 6px 14px rgba(22, 163, 74, 0.18)";
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />

                          Processing...
                        </>
                      ) : (
                        <>Buy Now ⚡</>
                      )}
                    </button>

                    {/* Add To Cart */}

                    <button
                      type="button"
                      className="btn fw-semibold"
                      disabled={isLoading}
                      onClick={() =>
                        handleAddToCart(product)
                      }
                      style={{
                        minHeight: "38px",
                        borderRadius: "9px",
                        padding: "8px 12px",
                        fontSize: "12px",
                        color:
                          "var(--primary-action-text)",
                        background:
                          "var(--primary-action-bg)",
                        border:
                          "1px solid var(--primary-action-border)",
                        transition:
                          "all 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.currentTarget.style.background =
                            "var(--primary-action-hover-bg)";

                          e.currentTarget.style.borderColor =
                            "var(--primary-action-hover-border)";

                          e.currentTarget.style.transform =
                            "translateY(-1px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "var(--primary-action-bg)";

                        e.currentTarget.style.borderColor =
                          "var(--primary-action-border)";

                        e.currentTarget.style.transform =
                          "translateY(0)";
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />

                          Adding...
                        </>
                      ) : (
                        <>Add to Cart 🛒</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          PRODUCT CARD CSS
      ===================================================== */}

      <style>
        {`
          .product-card {
            background: var(--card);
            color: var(--text-primary);
          }

          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 18px 40px var(--shadow) !important;
            border-color: var(--border) !important;
          }

          .product-card:hover .product-list-image {
            transform: scale(1.08);
          }

          .product-card:hover .product-view-overlay {
            opacity: 1;
          }

          .product-card .details-button:hover {
            color: var(--text-primary);
          }

          .product-list-image {
            display: block;
          }

          @media (max-width: 767px) {
            .product-card {
              border-radius: 18px !important;
            }

            .product-image-wrapper {
              height: 225px !important;
            }

            .product-list-image {
              padding: 12px !important;
            }
          }

          @media (min-width: 768px) and (max-width: 991px) {
            .product-image-wrapper {
              height: 230px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default ProductList;