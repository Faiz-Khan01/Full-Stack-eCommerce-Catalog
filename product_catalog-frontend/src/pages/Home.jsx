import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProductList from "../components/ProductList";
import api from "../services/api";

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
          PRODUCT CONTENT
      ================================================= */}
      <div
        className="container-fluid px-3 px-lg-5 position-relative"
        style={{
          paddingTop: "28px",
          paddingBottom: "50px",
        }}
      >
        {filteredProducts.length > 0 ? (
          <ProductList
            products={filteredProducts}
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
      </div>
    </div>
  );
};

export default Home;