import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getProductSizes } from "../utils/productSizes";

/**
 * Luxury 3D Virtual Fitting Room Widget
 * Directly fits the user's selected product onto a high-fashion 3D Atelier Mannequin Torso
 * or Editorial Model with real-time scaling (S, M, L, XL), laser scanning physics,
 * garment removal controls, and direct Cart checkout.
 */

const MODEL_PROFILES = [
  {
    id: "mannequin",
    name: "3D Mannequin",
    tag: "Sculpted Atelier Bust",
    icon: "🕴️",
  },
  {
    id: "oliver",
    name: "Oliver",
    tag: "Athletic M • 186cm",
    icon: "🧔",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "elena",
    name: "Elena",
    tag: "Runway S • 178cm",
    icon: "👩",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
  },
];



const DEFAULT_PICKS = [
  {
    id: "sample-1",
    name: "Camel Wool Trench Coat",
    price: 4499,
    category: "Outerwear",
    imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "sample-2",
    name: "Relaxed Fit Drawstring Pants",
    price: 1499,
    category: "Bottoms",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "sample-3",
    name: "Italian Craft Chelsea Boots",
    price: 3499,
    category: "Footwear",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80",
  },
];

const FittingRoomWidget = () => {
  const { user } = useAuth() || {};
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModel, setActiveModel] = useState(MODEL_PROFILES[0]);
  const [picks, setPicks] = useState(DEFAULT_PICKS);
  const [activeItem, setActiveItem] = useState(DEFAULT_PICKS[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isDressing, setIsDressing] = useState(false);
  const [dressingPhase, setDressingPhase] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [showPins, setShowPins] = useState(true);

  const dressingTimerRef = useRef(null);

  // Trigger luxury AI Dressing sequence
  const startDressingSequence = (item) => {
    setActiveItem(item);
    setIsDressing(true);
    setDressingPhase(1);

    if (dressingTimerRef.current) clearTimeout(dressingTimerRef.current);

    setTimeout(() => setDressingPhase(2), 450);
    setTimeout(() => setDressingPhase(3), 950);
    dressingTimerRef.current = setTimeout(() => {
      setIsDressing(false);
      setDressingPhase(0);
    }, 1450);
  };

  // Listen to Global "wearInFittingRoom" Event
  useEffect(() => {
    const handleWearEvent = (e) => {
      const product = e.detail;
      if (!product) return;

      // Expand fitting room immediately
      setIsOpen(true);

      // Add to picks list if not already present
      setPicks((prev) => {
        const exists = prev.some((p) => String(p.id) === String(product.id));
        if (exists) return prev;
        return [product, ...prev];
      });

      // Start the animated dressing sequence with the newly arrived product
      startDressingSequence(product);
    };

    window.addEventListener("wearInFittingRoom", handleWearEvent);
    return () => {
      window.removeEventListener("wearInFittingRoom", handleWearEvent);
      if (dressingTimerRef.current) clearTimeout(dressingTimerRef.current);
    };
  }, []);

  // Handle 360 Spin Auto-Rotation
  useEffect(() => {
    let interval;
    if (isAutoSpinning) {
      interval = setInterval(() => {
        setRotationAngle((prev) => (prev + 2) % 360);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isAutoSpinning]);

  // Remove an item from the wardrobe rack
  const handleRemoveItem = (itemId, e) => {
    if (e) e.stopPropagation();
    setPicks((prev) => {
      const updated = prev.filter((item) => String(item.id) !== String(itemId));
      if (activeItem && String(activeItem.id) === String(itemId)) {
        if (updated.length > 0) {
          startDressingSequence(updated[0]);
        } else {
          setActiveItem(null);
        }
      }
      return updated;
    });
  };

  // Clear all picks from wardrobe
  const handleClearAll = (e) => {
    if (e) e.stopPropagation();
    setPicks([]);
    setActiveItem(null);
  };

  // Add active look to Cart
  const handleAddLookToCart = async () => {
    if (!activeItem) {
      Swal.fire({
        icon: "info",
        title: "No Garment Selected",
        text: "Please select or drape a garment in the fitting room first.",
        background: "#18181b",
        color: "#ffffff",
      });
      return;
    }

    try {
      // 1. Save to localStorage guestCart & cart (compatible with all app pages)
      const CART_STORAGE_KEY = "guestCart";
      const existingGuestCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
      const itemToAdd = {
        id: activeItem.id,
        productId: activeItem.id,
        name: activeItem.name,
        price: activeItem.price,
        imageUrl: activeItem.imageUrl,
        quantity: 1,
        size: selectedSize,
        product: {
          id: activeItem.id,
          name: activeItem.name,
          price: activeItem.price,
          imageUrl: activeItem.imageUrl,
        },
      };

      const existingIndex = existingGuestCart.findIndex(
        (c) => String(c.id || c.productId) === String(activeItem.id)
      );

      if (existingIndex > -1) {
        existingGuestCart[existingIndex].quantity = (existingGuestCart[existingIndex].quantity || 1) + 1;
      } else {
        existingGuestCart.push(itemToAdd);
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(existingGuestCart));
      localStorage.setItem("cart", JSON.stringify(existingGuestCart));

      // 2. If user is logged in and product is a database ID, sync with backend cart API
      if (user?.email && !isNaN(Number(activeItem.id))) {
        try {
          await api.post(`/cart/add/${activeItem.id}?email=${encodeURIComponent(user.email)}`);
        } catch (apiErr) {
          console.warn("Backend cart sync notice:", apiErr?.message);
        }
      }

      // 3. Dispatch global cart update event for Navbar and Cart page
      window.dispatchEvent(new Event("cartUpdated"));

      // 4. Show success modal with quick action to open Cart
      Swal.fire({
        icon: "success",
        title: "Garment Added to Cart!",
        html: `<b>${activeItem.name}</b> (Size: <b>${selectedSize}</b>) added to your shopping bag.<br/><span style="color:#e07a42; font-weight:700;">₹${Number(activeItem.price || 0).toLocaleString("en-IN")}</span>`,
        showCancelButton: true,
        confirmButtonText: "View Cart 🛒",
        cancelButtonText: "Continue Shopping",
        confirmButtonColor: "#e07a42",
        cancelButtonColor: "#27272a",
        background: "#18181b",
        color: "#ffffff",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/cart");
        }
      });
    } catch (err) {
      console.error("Cart error:", err);
      Swal.fire({
        icon: "error",
        title: "Could not add to cart",
        text: err.message,
        background: "#18181b",
        color: "#ffffff",
      });
    }
  };

  // Compute dynamic sizes based on active garment (Shoes, Perfume, Apparel, Pants)
  const availableSizes = getProductSizes(activeItem);
  const currentSizeObj = availableSizes.find((s) => s.label === selectedSize) || availableSizes[0] || { label: "M", scale: 1.0 };

  // Sync selectedSize if activeItem changes and selectedSize is invalid
  useEffect(() => {
    if (activeItem && availableSizes.length > 0) {
      const match = availableSizes.find((s) => s.label === selectedSize);
      if (!match) {
        const def = availableSizes.find((s) => s.isDefault) || availableSizes[0];
        setSelectedSize(def.label);
      }
    }
  }, [activeItem]);

  // Minimized Trigger Button (Docked at bottom-left)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn d-flex align-items-center gap-2 fitting-room-trigger-pill"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          zIndex: 1040,
          background: "#14151b",
          border: "1px solid rgba(224, 122, 66, 0.45)",
          borderRadius: "30px",
          padding: "10px 18px",
          color: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(224, 122, 66, 0.25)",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "13px",
          letterSpacing: "0.2px",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <span style={{ fontSize: "16px" }}>🧥</span>
        <span>Virtual Fitting Room</span>
        <span
          style={{
            background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
            color: "#fff",
            borderRadius: "12px",
            padding: "2px 8px",
            fontSize: "11px",
            fontWeight: 800,
            marginLeft: "2px",
          }}
        >
          {picks.length}
        </span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Virtual Fitting Room Preview"
      className="fitting-room-modal"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        width: "350px",
        background: "rgba(18, 19, 24, 0.96)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "1px solid rgba(224, 122, 66, 0.35)",
        borderRadius: "24px",
        padding: "18px",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(224, 122, 66, 0.2)",
        zIndex: 1050,
        color: "#ffffff",
        animation: "fittingSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes fittingSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes laserScanVertical {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes matrixPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.45; }
        }
        @keyframes haloGlow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        @keyframes garmentPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .fitting-pick-thumbnail {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fitting-pick-thumbnail:hover {
          transform: translateY(-2px);
          border-color: #e07a42 !important;
        }
        .fit-pin-pulse {
          animation: haloGlow 2s infinite ease-in-out;
        }
      `}</style>

      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "rgba(224, 122, 66, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(224, 122, 66, 0.3)",
            }}
          >
            <span style={{ fontSize: "14px" }}>🧥</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "-0.3px", color: "#ffffff" }}>
              Fitting Room
            </div>
            <div style={{ fontSize: "10px", color: "#e07a42", lineHeight: 1, fontWeight: 700 }}>
              ✦ Live Garment Fit & Drape
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-1">
          {/* Pins toggle */}
          <button
            type="button"
            onClick={() => setShowPins(!showPins)}
            style={{
              background: showPins ? "rgba(224, 122, 66, 0.2)" : "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${showPins ? "#e07a42" : "rgba(255, 255, 255, 0.1)"}`,
              borderRadius: "8px",
              color: showPins ? "#e07a42" : "rgba(255, 255, 255, 0.6)",
              padding: "4px 7px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
            title="Toggle Tailor Pins"
          >
            Pins {showPins ? "ON" : "OFF"}
          </button>

          {/* 360 Spin Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoSpinning(!isAutoSpinning)}
            style={{
              background: isAutoSpinning ? "rgba(224, 122, 66, 0.25)" : "rgba(255, 255, 255, 0.06)",
              border: `1px solid ${isAutoSpinning ? "#e07a42" : "rgba(255, 255, 255, 0.1)"}`,
              borderRadius: "8px",
              color: isAutoSpinning ? "#e07a42" : "rgba(255, 255, 255, 0.7)",
              padding: "4px 8px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="Toggle 360° View"
          >
            360° {isAutoSpinning ? "■" : "▶"}
          </button>

          {/* Minimize Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
              fontSize: "16px",
              lineHeight: 1,
              padding: "4px 6px",
            }}
            title="Minimize"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Model Selection Switcher */}
      <div className="d-flex align-items-center gap-1 mb-2 p-1 rounded-3" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
        {MODEL_PROFILES.map((m) => {
          const isSelected = activeModel.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setActiveModel(m);
                if (activeItem) startDressingSequence(activeItem);
              }}
              style={{
                flex: 1,
                border: "none",
                background: isSelected ? "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)" : "transparent",
                color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                borderRadius: "8px",
                padding: "4px 6px",
                fontSize: "11px",
                fontWeight: isSelected ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <span>{m.icon}</span>
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          HERO VIEWPORT: ACTUAL PRODUCT FITTED ON 3D MANNEQUIN
      ========================================================== */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "260px",
          borderRadius: "16px",
          overflow: "hidden",
          background: "radial-gradient(circle at 50% 30%, #22242f 0%, #0d0e13 100%)",
          border: "1px solid rgba(224, 122, 66, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
          perspective: "1000px",
        }}
      >
        {/* Ambient Halo Glow */}
        <div
          style={{
            position: "absolute",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(224, 122, 66, 0.3) 0%, transparent 70%)",
            filter: "blur(25px)",
            pointerEvents: "none",
            animation: "haloGlow 4s infinite ease-in-out",
          }}
        />

        {/* 3D Model Artwork Container with Interactive Spin */}
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `rotateY(${rotationAngle}deg)`,
            transition: isAutoSpinning ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* VIEW A: 3D Atelier Mannequin Torso Mode (Hero Fit) */}
          {activeModel.id === "mannequin" ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Sculpted Mannequin Bust SVG Silhouette */}
              <svg
                viewBox="0 0 200 300"
                style={{
                  position: "absolute",
                  height: "94%",
                  width: "auto",
                  opacity: 0.4,
                  filter: "drop-shadow(0 0 12px rgba(0,0,0,0.9))",
                  pointerEvents: "none",
                }}
              >
                <defs>
                  <linearGradient id="bustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#52525e" />
                    <stop offset="50%" stopColor="#282933" />
                    <stop offset="100%" stopColor="#121318" />
                  </linearGradient>
                </defs>
                {/* Neck & finial */}
                <ellipse cx="100" cy="24" rx="14" ry="14" fill="url(#bustGrad)" stroke="#666" strokeWidth="1" />
                <path d="M 94 36 L 94 62 L 106 62 L 106 36 Z" fill="url(#bustGrad)" />
                {/* Shoulders & Torso */}
                <path d="M 44 80 Q 100 65 156 80 L 144 185 Q 100 200 56 185 Z" fill="url(#bustGrad)" stroke="#777" strokeWidth="1" />
                {/* Lower body taper */}
                <path d="M 56 185 Q 100 200 144 185 L 148 235 Q 100 250 52 235 Z" fill="url(#bustGrad)" stroke="#666" strokeWidth="1" />
                {/* Brushed Pedestal Stand */}
                <rect x="98" y="240" width="4" height="50" fill="#e07a42" opacity="0.8" />
                <ellipse cx="100" cy="292" rx="40" ry="6" fill="#e07a42" opacity="0.5" />
              </svg>

              {/* ACTUAL PRODUCT FITTED ONTO THE MANNEQUIN */}
              {activeItem ? (
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    width: "190px",
                    height: "210px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${currentSizeObj.scale})`,
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      filter: isDressing
                        ? "brightness(0.6) blur(4px)"
                        : "drop-shadow(0 15px 30px rgba(0,0,0,0.85)) drop-shadow(0 0 12px rgba(224, 122, 66, 0.4))",
                      borderRadius: "14px",
                      transition: "all 0.35s ease",
                    }}
                  />

                  {/* Tailor Fit Measurement Pins */}
                  {showPins && !isDressing && (
                    <>
                      <div
                        className="fit-pin-pulse"
                        style={{
                          position: "absolute",
                          top: "16%",
                          left: "8%",
                          background: "#e07a42",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          boxShadow: "0 0 10px #e07a42",
                          cursor: "pointer",
                        }}
                        title={`Shoulder Width: ${currentSizeObj.shoulder}`}
                      />
                      <div
                        className="fit-pin-pulse"
                        style={{
                          position: "absolute",
                          top: "42%",
                          right: "6%",
                          background: "#e07a42",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          boxShadow: "0 0 10px #e07a42",
                          cursor: "pointer",
                        }}
                        title={`Chest Width: ${currentSizeObj.chest}`}
                      />
                      <div
                        className="fit-pin-pulse"
                        style={{
                          position: "absolute",
                          bottom: "18%",
                          left: "12%",
                          background: "#e07a42",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          boxShadow: "0 0 10px #e07a42",
                          cursor: "pointer",
                        }}
                        title="Waist Drape: Bespoke Contour"
                      />
                    </>
                  )}
                </div>
              ) : (
                <div style={{ zIndex: 2, textAlign: "center", padding: "16px", color: "rgba(255,255,255,0.4)" }}>
                  <div style={{ fontSize: "28px", marginBottom: "6px" }}>🧥</div>
                  <div style={{ fontSize: "12px", fontWeight: 700 }}>Atelier Mannequin Ready</div>
                  <div style={{ fontSize: "10px", marginTop: "2px" }}>Tap 🧥 Hanger on any product to drape it!</div>
                </div>
              )}
            </div>
          ) : (
            /* VIEW B: Human Model View (Oliver / Elena) with Garment Composite */
            <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={activeModel.image}
                alt={activeModel.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: isDressing ? "brightness(0.65) blur(3px)" : "contrast(1.05)",
                  transition: "filter 0.35s ease",
                }}
              />
              {/* Product Inset Overlay on Model */}
              {activeItem && !isDressing && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "45px",
                    right: "12px",
                    width: "85px",
                    height: "85px",
                    borderRadius: "14px",
                    background: "rgba(18, 19, 24, 0.85)",
                    backdropFilter: "blur(12px)",
                    border: "2px solid #e07a42",
                    padding: "4px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.6), 0 0 15px rgba(224,122,66,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.name}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "10px" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-8px",
                      background: "#e07a42",
                      color: "#fff",
                      fontSize: "8px",
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    Draped Item
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dressed Garment Holographic Projection / Header Badge */}
          {activeItem && !isDressing && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                right: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(15, 16, 20, 0.88)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(224, 122, 66, 0.4)",
                borderRadius: "12px",
                padding: "6px 10px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                pointerEvents: "auto",
                zIndex: 4,
              }}
            >
              <img
                src={activeItem.imageUrl}
                alt={activeItem.name}
                style={{ width: "30px", height: "30px", borderRadius: "6px", objectFit: "cover" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {activeItem.name}
                </div>
                <div style={{ fontSize: "10px", color: "#e07a42", fontWeight: 800 }}>
                  ₹{Number(activeItem.price || 0).toLocaleString("en-IN")} • Size: {selectedSize}
                </div>
              </div>

              {/* Remove button to take off item */}
              <button
                type="button"
                onClick={(e) => handleRemoveItem(activeItem.id, e)}
                title="Remove garment from model"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  fontSize: "11px",
                  lineHeight: 1,
                  padding: 0,
                  transition: "all 0.2s ease",
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* =====================================================
            AI DRESSING / LASER SCANNING OVERLAY
        ====================================================== */}
        {isDressing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10, 11, 15, 0.78)",
              backdropFilter: "blur(6px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              textAlign: "center",
              zIndex: 10,
            }}
          >
            {/* Cyber Matrix Wireframe Grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(224, 122, 66, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(224, 122, 66, 0.15) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                animation: "matrixPulse 1.2s infinite ease-in-out",
                pointerEvents: "none",
              }}
            />

            {/* Glowing Laser Beam Scanning Across Model */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, transparent, #e07a42, #ffffff, #e07a42, transparent)",
                boxShadow: "0 0 15px #e07a42, 0 0 30px #e07a42",
                animation: "laserScanVertical 1.4s infinite ease-in-out",
                pointerEvents: "none",
              }}
            />

            {/* Spinning AI Luxury Orb */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "2px solid rgba(224, 122, 66, 0.25)",
                borderTopColor: "#e07a42",
                borderRightColor: "#ffffff",
                animation: "spin 0.8s linear infinite",
                marginBottom: "12px",
                boxShadow: "0 0 20px rgba(224, 122, 66, 0.5)",
              }}
            />

            {/* Dynamic Status Text */}
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.2px" }}>
              {dressingPhase === 1 && "Fitting Garment to 3D Mannequin..."}
              {dressingPhase === 2 && "Simulating Fabric Drape & Tension..."}
              {dressingPhase === 3 && "Rendering Bespoke Tailored Fit..."}
            </div>

            <div style={{ fontSize: "10px", color: "#e07a42", fontWeight: 700, marginTop: "4px" }}>
              ✦ {activeItem?.name || "Garment"} Fitted for {activeModel.name}
            </div>
          </div>
        )}

        {/* Model Spec Footer Bar */}
        {!isDressing && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              right: "10px",
              background: "rgba(15, 16, 20, 0.82)",
              backdropFilter: "blur(10px)",
              padding: "6px 10px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              fontSize: "10px",
              color: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 4,
            }}
          >
            <span>{activeModel.name} • Chest: {currentSizeObj.chest}</span>
            <span style={{ color: "#10b981", fontWeight: 700 }}>✓ Tailored Fit</span>
          </div>
        )}
      </div>

      {/* Sizing / Volume Scale Selector (Dynamic: Shirts, Pants, Shoes, Perfume) */}
      <div className="d-flex align-items-center justify-content-between mb-2 px-1">
        <span style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.8)" }}>
          {availableSizes[0]?.label?.includes("ml") ? "Volume" : "Size"}
        </span>
        <div className="d-flex align-items-center gap-1" style={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
          {availableSizes.map((s) => {
            const isSel = selectedSize === s.label;
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  setSelectedSize(s.label);
                  if (activeItem) startDressingSequence(activeItem);
                }}
                title={s.desc || s.label}
                style={{
                  background: isSel ? "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)" : "rgba(255, 255, 255, 0.06)",
                  border: isSel ? "1px solid #e07a42" : "1px solid rgba(255, 255, 255, 0.12)",
                  color: isSel ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                  borderRadius: "6px",
                  padding: "3px 8px",
                  fontSize: "10px",
                  fontWeight: isSel ? 800 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          YOUR PICKS ROW (Interactive Wardrobe Rack)
      ========================================================== */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Wardrobe Rack ({picks.length})
        </span>
        <div className="d-flex align-items-center gap-2">
          {picks.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "11px",
                cursor: "pointer",
                padding: 0,
              }}
              title="Clear all picks"
            >
              Clear
            </button>
          )}
          {activeItem && (
            <button
              type="button"
              onClick={() => startDressingSequence(activeItem)}
              style={{
                background: "none",
                border: "none",
                color: "#e07a42",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
              }}
            >
              ⚡ Re-drape
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Thumbnails */}
      <div
        className="d-flex align-items-center gap-2 mb-3 pb-1"
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {picks.length === 0 ? (
          <div
            style={{
              padding: "12px",
              textAlign: "center",
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.45)",
              width: "100%",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "10px",
              border: "1px dashed rgba(255, 255, 255, 0.1)",
            }}
          >
            Wardrobe empty. Tap 🧥 on products to try!
          </div>
        ) : (
          picks.map((item, idx) => {
            const isCurrent = activeItem?.id === item.id;
            return (
              <div
                key={`${item.id}-${idx}`}
                className="fitting-pick-thumbnail"
                title={`${item.name} (₹${item.price})`}
                onClick={() => startDressingSequence(item)}
                style={{
                  width: "52px",
                  height: "52px",
                  minWidth: "52px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: isCurrent ? "2px solid #e07a42" : "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: isCurrent ? "0 0 12px rgba(224, 122, 66, 0.5)" : "none",
                  cursor: "pointer",
                  background: "#1c1d24",
                  position: "relative",
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Individual Item Remove Button */}
                <button
                  type="button"
                  onClick={(e) => handleRemoveItem(item.id, e)}
                  title="Remove from wardrobe"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    background: "rgba(0, 0, 0, 0.75)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    lineHeight: 1,
                    zIndex: 2,
                  }}
                >
                  ✕
                </button>

                {isCurrent && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "#e07a42",
                      height: "3px",
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================
          ACTIONS (Add Look to Cart + Instructions)
      ========================================================== */}
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          onClick={handleAddLookToCart}
          className="btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2"
          style={{
            background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "14px",
            fontSize: "12px",
            fontWeight: 800,
            boxShadow: "0 6px 18px rgba(224, 122, 66, 0.35)",
            cursor: "pointer",
          }}
        >
          <span>🛒</span>
          <span>Add Outfit to Cart (Size: {selectedSize})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            Swal.fire({
              icon: "info",
              title: "3D Virtual Fitting Room",
              html: `
                <div style="font-size:13px; color:#ccc; text-align:left; line-height:1.6;">
                  <b>How to drape items:</b><br/>
                  1. Tap the <b>🧥 Coat Hanger button</b> on any product card in the store.<br/>
                  2. The actual garment is immediately mounted and fitted onto the <b>3D Atelier Mannequin</b>.<br/>
                  3. Use <b>S, M, L, XL</b> to test different fit scalings with real measurements.<br/>
                  4. Toggle <b>360° ▶</b> to inspect all angles.<br/>
                  5. Remove items anytime using the <b>✕</b> on any thumbnail.
                </div>
              `,
              background: "#18181b",
              color: "#ffffff",
              confirmButtonColor: "#e07a42",
            });
          }}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "14px",
          }}
          title="Fitting Room Instructions"
        >
          ?
        </button>
      </div>
    </aside>
  );
};

export default FittingRoomWidget;
