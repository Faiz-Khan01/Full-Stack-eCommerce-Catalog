import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProductList from "../components/ProductList";
import api from "../services/api";
import ThreeDProductViewer from "../components/ThreeDProductViewer";

const getWishlistItems = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Wishlist read error:", error);
    return [];
  }
};

const saveWishlistItems = (items) => {
  localStorage.setItem(
    "wishlist",
    JSON.stringify(items)
  );

  window.dispatchEvent(
    new Event("wishlistUpdated")
  );
};

const getStoredUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    return null;
  }
};

const Home = ({
  searchTerm = "",
  selectedCategory = "",
  sortOrder = "asc",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await api.get("/products");
        const data = response.data;

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Fetch products error:",
          error
        );

        setProducts([]);

        let message = "Unable to load products.";

        if (error.response) {
          message =
            error.response.data?.message ||
            error.response.data?.error ||
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          message =
            "Unable to connect to the server.";
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Reset pagination when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOrder]);

  // =====================================================
  // VIEW DETAILS
  // =====================================================
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  // =====================================================
  // ADD TO CART
  // =====================================================
  const handleAddToCart = async (productId) => {
    const user = getStoredUser();

    if (!user?.email) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please log in to add items to your cart.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#6366f1",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }

      return;
    }

    try {
      await api.post(
        `/cart/add/${productId}?email=${encodeURIComponent(
          user.email
        )}`
      );

      Swal.fire({
        title: "Added!",
        text: "Item added to cart successfully.",
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      let message =
        "Could not add item to cart.";

      if (error.response) {
        if (
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          message =
            "Session expired. Please log in again.";

          localStorage.removeItem("token");
          localStorage.removeItem("jwtToken");
        } else {
          message =
            error.response.data?.error ||
            error.response.data?.message ||
            `Cart error: ${error.response.status}`;
        }
      } else if (error.request) {
        message =
          "Unable to connect to the server.";
      } else {
        message = error.message;
      }

      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
      });
    }
  };

  // =====================================================
  // ADD / REMOVE WISHLIST
  // =====================================================
  const handleAddToWishlist = async (
    productOrId
  ) => {
    const productId =
      typeof productOrId === "object"
        ? Number(productOrId.id)
        : Number(productOrId);

    const product =
      typeof productOrId === "object"
        ? productOrId
        : products.find(
            (item) =>
              Number(item.id) === productId
          );

    const user = getStoredUser();

    if (!user?.email) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please log in to add items to your wishlist.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#6366f1",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }

      return;
    }

    try {
      const saved = getWishlistItems();

      const exists = saved.some(
        (item) =>
          Number(item?.id) === productId
      );

      await api.post(
        `/wishlist/add/${productId}?email=${encodeURIComponent(
          user.email
        )}`
      );

      const updated = exists
        ? saved.filter(
            (item) =>
              Number(item?.id) !== productId
          )
        : [
            ...saved,
            {
              ...(product || {
                id: productId,
              }),
              id: productId,
            },
          ];

      saveWishlistItems(updated);

      Swal.fire({
        title: exists
          ? "Removed from Wishlist"
          : "Wishlisted! ❤️",

        text: exists
          ? `${
              product?.name || "Product"
            } removed from your wishlist.`
          : `${
              product?.name || "Product"
            } added to your wishlist!`,

        icon: exists ? "info" : "success",

        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      let message =
        "Could not update wishlist.";

      if (error.response) {
        if (
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          message =
            "Session expired. Please log in again.";

          localStorage.removeItem("token");
          localStorage.removeItem("jwtToken");
        } else {
          message =
            error.response.data?.error ||
            error.response.data?.message ||
            `Wishlist error: ${error.response.status}`;
        }
      } else if (error.request) {
        message =
          "Unable to connect to the server.";
      } else {
        message = error.message;
      }

      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
      });
    }
  };

  // =====================================================
  // BUY NOW
  // =====================================================
  const handleBuyNow = async (
    productOrId
  ) => {
    const user = getStoredUser();

    if (!user?.email) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please log in first to buy products.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#6366f1",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }

      return;
    }

    const productId =
      typeof productOrId === "object"
        ? Number(productOrId.id)
        : Number(productOrId);

    const product =
      typeof productOrId === "object"
        ? productOrId
        : products.find(
            (item) =>
              Number(item.id) === productId
          );

    if (!product) {
      Swal.fire(
        "Error",
        "Product details not found.",
        "error"
      );

      return;
    }

    const directBuyItem = [
      {
        product,
        quantity: 1,
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

    navigate("/checkout");
  };

  // =====================================================
  // FILTER + SORT
  // =====================================================
  const filteredProducts = products
    .filter((product) => {
      const productName =
        product.name || "";

      const matchesSearch =
        productName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesCategory =
        selectedCategory
          ? Number(
              product.category?.id ??
                product.categoryId
            ) ===
            Number(selectedCategory)
          : true;

      return (
        matchesSearch &&
        matchesCategory
      );
    })
    .sort((a, b) => {
      const priceA =
        Number(a.price) || 0;

      const priceB =
        Number(b.price) || 0;

      return sortOrder === "asc"
        ? priceA - priceB
        : priceB - priceA;
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // =====================================================
  // LOADING UI
  // =====================================================
  if (loading) {
    return (
      <div
        className="home-page min-vh-100 d-flex justify-content-center align-items-center position-relative overflow-hidden"
        style={{
          background: "var(--bg)",
          color: "var(--text-primary)",
        }}
      >
        {/* Glow */}
        <div
          className="position-absolute"
          style={{
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background:
              "rgba(99,102,241,0.10)",
            filter: "blur(80px)",
            top: "20%",
            left: "50%",
            transform:
              "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />

        {/* Loading Card */}
        <div
          className="text-center position-relative theme-card"
          style={{
            padding: "45px 55px",
            borderRadius: "24px",
            background: "var(--card)",
            color: "var(--text-primary)",
            border:
              "1px solid var(--border)",
            boxShadow:
              "0 25px 70px var(--shadow)",
          }}
        >
          <div
            className="d-flex justify-content-center align-items-center mx-auto"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow:
                "0 12px 30px rgba(99,102,241,0.28)",
            }}
          >
            <div
              className="spinner-border text-light"
              role="status"
              style={{
                width: "28px",
                height: "28px",
                borderWidth: "3px",
              }}
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>
          </div>

          <p
            className="mt-4 mb-0"
            style={{
              color:
                "var(--text-primary)",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div
      className="home-page min-vh-100 position-relative overflow-hidden"
      style={{
        background:
          "var(--bg)",
        color:
          "var(--text-primary)",
        transition:
          "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      {/* =================================================
          BACKGROUND GLOW 1
      ================================================= */}
      <div
        className="position-absolute"
        style={{
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "rgba(99,102,241,0.06)",
          filter: "blur(90px)",
          top: "-180px",
          left: "-150px",
          pointerEvents: "none",
        }}
      />

      {/* =================================================
          BACKGROUND GLOW 2
      ================================================= */}
      <div
        className="position-absolute"
        style={{
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background:
            "rgba(245,158,11,0.055)",
          filter: "blur(90px)",
          right: "-160px",
          top: "30%",
          pointerEvents: "none",
        }}
      />

      {/* =================================================
          LUXURY HERO BANNER (Frames 00:30 - 00:33)
      ================================================= */}
      {!searchTerm && !selectedCategory && (
        <>
          <div
            className="position-relative overflow-hidden"
            style={{
              padding: "60px 24px 40px 24px",
              maxWidth: "1440px",
              margin: "0 auto",
            }}
          >
            <div className="row align-items-center g-5">
              <div className="col-12 col-lg-6">
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "2.5px",
                    color: "#e07a42",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                >
                  NEW COLLECTION 2026
                </div>

                <h1
                  style={{
                    fontSize: "clamp(42px, 5.5vw, 68px)",
                    fontWeight: 900,
                    letterSpacing: "-1.5px",
                    lineHeight: "1.05",
                    color: "var(--text-primary)",
                    marginBottom: "20px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Elevate <br />
                  Your Style
                </h1>

                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.6,
                    color: "var(--text-secondary)",
                    maxWidth: "460px",
                    marginBottom: "32px",
                  }}
                >
                  Timeless pieces, hand-picked for the modern gentleman. Premium labels, distinctive style.
                </p>

                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <a
                    href="#catalog-section"
                    className="btn px-4 py-3 fw-bold rounded-pill text-decoration-none"
                    style={{
                      background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
                      color: "#ffffff",
                      fontSize: "14px",
                      boxShadow: "0 8px 25px rgba(224, 122, 66, 0.4)",
                      border: "none",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 12px 30px rgba(224, 122, 66, 0.55)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(224, 122, 66, 0.4)";
                    }}
                  >
                    Shop Now ➔
                  </a>

                  <a
                    href="#curated-section"
                    className="btn px-4 py-3 fw-semibold rounded-pill text-decoration-none"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      backdropFilter: "blur(10px)",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--hover-bg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }}
                  >
                    New Arrivals
                  </a>
                </div>
              </div>

              {/* Right Hero Image */}
              <div className="col-12 col-lg-6">
                <div
                  style={{
                    position: "relative",
                    borderRadius: "28px",
                    overflow: "hidden",
                    height: "440px",
                    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80"
                    alt="Luxury Collection"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, transparent 40%, rgba(12, 13, 18, 0.85) 100%)",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "28px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          background: "#e07a42",
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        ATELIER EDIT
                      </span>
                      <h4 style={{ color: "#fff", fontWeight: 700, margin: "6px 0 0 0" }}>
                        Autumn Capsule • Distinctive Silhouettes
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Badges Strip (Frame 00:30) */}
            <div
              className="row g-3 mt-4 pt-3"
              style={{
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "20px",
              }}
            >
              {[
                { icon: "📦", title: "Free Shipping", sub: "Orders over ₹999" },
                { icon: "🔄", title: "Easy Returns", sub: "30-day return policy" },
                { icon: "🔒", title: "Secure Payment", sub: "100% secure checkout" },
                { icon: "✨", title: "Premium Quality", sub: "Curated expression" },
              ].map((b, idx) => (
                <div key={idx} className="col-6 col-md-3">
                  <div className="d-flex align-items-center gap-3">
                    <span style={{ fontSize: "24px" }}>{b.icon}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {b.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                        {b.sub}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              WHAT WE CURATE: Three quiet obsessions (Frame 00:35)
          ================================================= */}
          <div
            id="curated-section"
            style={{
              maxWidth: "1440px",
              margin: "0 auto",
              padding: "40px 24px 20px 24px",
            }}
          >
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    color: "#e07a42",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  WHAT WE CURATE
                </div>
                <h2
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                    margin: 0,
                    color: "var(--text-primary)",
                  }}
                >
                  Three quiet obsessions.
                </h2>
              </div>
              <a
                href="#catalog-section"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#e07a42",
                  textDecoration: "none",
                }}
              >
                View All ➔
              </a>
            </div>

            <div className="row g-4">
              {[
                {
                  roman: "I",
                  name: "Curated",
                  img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80",
                  tag: "Camel Wool Trench",
                },
                {
                  roman: "II",
                  name: "Modern",
                  img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
                  tag: "Linen Overshirt",
                },
                {
                  roman: "III",
                  name: "Considered",
                  img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
                  tag: "Chelsea Leather Boots",
                },
              ].map((c) => (
                <div key={c.roman} className="col-12 col-md-4">
                  <div
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      height: "360px",
                      position: "relative",
                      boxShadow: "0 15px 35px var(--shadow)",
                    }}
                  >
                    <img
                      src={c.img}
                      alt={c.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(12,13,18,0.9) 100%)",
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: 900,
                          color: "#e07a42",
                          fontFamily: "serif",
                        }}
                      >
                        {c.roman}
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
                          {c.tag}
                        </div>
                        <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>
                          {c.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* =================================================
          PRODUCT CONTENT
      ================================================= */}
      <div
        id="catalog-section"
        className="container-fluid px-3 px-lg-5 position-relative"
        style={{
          paddingTop: "40px",
          paddingBottom: "50px",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#e07a42", textTransform: "uppercase", letterSpacing: "1px" }}>
              COLLECTION
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              New Arrivals
            </h2>
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            Showing {filteredProducts.length} curated products
          </div>
        </div>
        {filteredProducts.length > 0 ? (
          <>
            <ProductList
              products={currentProducts}
              onAddToCart={
                handleAddToCart
              }
              onAddToWishlist={
                handleAddToWishlist
              }
              onBuyNow={
                handleBuyNow
              }
              onViewDetails={
                handleViewDetails
              }
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-5 gap-2">
                <button
                  type="button"
                  className="btn px-3 py-2"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    background: "var(--card)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>

                <div className="px-3 py-2" style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  type="button"
                  className="btn px-3 py-2"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    background: "var(--card)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          // =================================================
          // EMPTY STATE
          // =================================================
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              minHeight: "65vh",
            }}
          >
            <div
              className="text-center position-relative theme-card"
              style={{
                maxWidth: "520px",
                width: "100%",
                padding: "55px 35px",
                borderRadius: "28px",
                background:
                  "var(--card)",
                color:
                  "var(--text-primary)",
                border:
                  "1px solid var(--border)",
                boxShadow:
                  "0 25px 70px var(--shadow)",
              }}
            >
              {/* Icon */}
              <div
                className="d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "28px",
                  background:
                    "var(--muted-bg)",
                  border:
                    "1px solid var(--border)",
                  boxShadow:
                    "0 15px 35px var(--shadow)",
                }}
              >
                <span
                  style={{
                    fontSize: "42px",
                    opacity: 0.75,
                  }}
                >
                  🔍
                </span>
              </div>

              {/* Heading */}
              <h3
                className="mt-4 mb-2"
                style={{
                  color:
                    "var(--text-primary)",
                  fontWeight: 800,
                  letterSpacing:
                    "-0.4px",
                }}
              >
                No Products Found
              </h3>

              {/* Description */}
              <p
                className="mb-4"
                style={{
                  color:
                    "var(--text-secondary)",
                  fontSize: "15px",
                  lineHeight: 1.6,
                }}
              >
                No products match your
                current search or filters.
              </p>

              {/* Refresh */}
              <button
                type="button"
                className="btn text-white px-4 py-2"
                onClick={() =>
                  window.location.reload()
                }
                style={{
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #6366f1, #7c3aed)",
                  boxShadow:
                    "0 10px 25px rgba(99,102,241,0.25)",
                }}
              >
                Refresh Products
              </button>
            </div>
          </div>
        )}
        {/* =================================================
            3D PRODUCT SHOWCASE: Shop the Collection (Frame 00:41)
        ================================================= */}
        {!searchTerm && !selectedCategory && (
          <>
            <div
              style={{
                marginTop: "70px",
                marginBottom: "50px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "28px",
                padding: "40px 32px",
                boxShadow: "0 20px 60px var(--shadow)",
              }}
            >
              <div className="row align-items-center g-4">
                <div className="col-12 col-lg-7">
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                      color: "#e07a42",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    CURATED SELECTION
                  </div>
                  <h2
                    style={{
                      fontSize: "34px",
                      fontWeight: 900,
                      letterSpacing: "-0.5px",
                      color: "var(--text-primary)",
                      marginBottom: "12px",
                    }}
                  >
                    Shop the Collection
                  </h2>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.6,
                      color: "var(--text-secondary)",
                      maxWidth: "480px",
                      marginBottom: "24px",
                    }}
                  >
                    Interactive 3D preview. Click and drag in 360° to inspect tactile stitching,
                    weather-treated finishes, and structural drape.
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 900,
                        color: "var(--text-primary)",
                      }}
                    >
                      ₹1,499
                    </span>
                    <button
                      type="button"
                      className="btn px-4 py-2 rounded-pill fw-bold"
                      style={{
                        background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
                        color: "#fff",
                        border: "none",
                        boxShadow: "0 6px 18px rgba(224, 122, 66, 0.4)",
                      }}
                      onClick={() => {
                        const hatProd = products.find((p) => p.name?.toLowerCase().includes("hat")) || products[0];
                        if (hatProd) handleAddToCart(hatProd.id);
                      }}
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>

                <div className="col-12 col-lg-5 d-flex justify-content-center">
                  <ThreeDProductViewer
                    modelType="hat"
                    size={260}
                    autoRotate={true}
                    interactive={true}
                    label="Mustard Bucket Hat • 360° View"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                A CLOSER LOOK (Frame 00:42)
            ================================================= */}
            <div style={{ marginBottom: "60px" }}>
              <div className="text-center mb-4">
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                    color: "#e07a42",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  IN FOCUS
                </div>
                <h2 style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
                  A Closer Look
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  Two pieces at a time. Straight from the edit.
                </p>
              </div>

              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div
                    style={{
                      borderRadius: "24px",
                      overflow: "hidden",
                      background: "#16171d",
                      border: "1px solid var(--border)",
                      height: "440px",
                      position: "relative",
                      boxShadow: "0 20px 45px var(--shadow)",
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
                      alt="Vintage Olive Graphic Tee"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(12,13,18,0.92) 100%)",
                        padding: "32px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: "#e07a42", fontWeight: 700, letterSpacing: "1px" }}>
                        T-SHIRT
                      </div>
                      <h3 style={{ fontSize: "24px", fontWeight: 900, color: "#fff", margin: "4px 0 16px 0" }}>
                        VINTAGE OLIVE GRAPHIC TEE
                      </h3>
                      <div>
                        <a
                          href="#catalog-section"
                          className="btn btn-outline-light rounded-pill px-4 py-2"
                          style={{ fontSize: "12px", fontWeight: 700 }}
                        >
                          VIEW PRODUCT ➔
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div
                    style={{
                      borderRadius: "24px",
                      overflow: "hidden",
                      background: "#16171d",
                      border: "1px solid var(--border)",
                      height: "440px",
                      position: "relative",
                      boxShadow: "0 20px 45px var(--shadow)",
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
                      alt="Oversized Washed Brown Hoodie"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(12,13,18,0.92) 100%)",
                        padding: "32px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: "#e07a42", fontWeight: 700, letterSpacing: "1px" }}>
                        HOODIES & SWEATSHIRTS
                      </div>
                      <h3 style={{ fontSize: "24px", fontWeight: 900, color: "#fff", margin: "4px 0 16px 0" }}>
                        OVERSIZED WASHED BROWN HOODIE
                      </h3>
                      <div>
                        <a
                          href="#catalog-section"
                          className="btn btn-outline-light rounded-pill px-4 py-2"
                          style={{ fontSize: "12px", fontWeight: 700 }}
                        >
                          VIEW PRODUCT ➔
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;