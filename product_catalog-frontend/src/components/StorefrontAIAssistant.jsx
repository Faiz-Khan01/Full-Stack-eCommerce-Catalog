import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThreeDChromeOrb from "./ThreeDChromeOrb";
import api from "../services/api";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "https://full-stack-ecommerce-catalog.onrender.com";

const getProductImg = (url) => {
  if (!url) return "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=400&auto=format&fit=crop&q=80";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const clean = url.startsWith("/") ? url : `/${url}`;
  return `${BASE_URL}${clean}`;
};

// Fallback catalog in case backend is offline or empty
const FALLBACK_CATALOG = [
  {
    id: "f-1",
    name: "Camel Wool Trench Coat",
    price: 4499,
    category: "Outerwear",
    description: "Premium double-breasted tailored wool trench with storm flap and belt.",
    imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=400&auto=format&fit=crop&q=80",
    size: "M",
  },
  {
    id: "f-2",
    name: "Relaxed Fit Drawstring Pants",
    price: 1499,
    category: "Pants & Trousers",
    description: "Casual tailored trousers in dark charcoal with elasticized waistband.",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&auto=format&fit=crop&q=80",
    size: "M (32\")",
  },
  {
    id: "f-3",
    name: "Italian Craft Chelsea Boots",
    price: 3499,
    category: "Shoes & Footwear",
    description: "Handcrafted calfskin leather Chelsea boots with Goodyear welted sole.",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80",
    size: "UK 9",
  },
  {
    id: "f-4",
    name: "Oud Royale Signature Perfume",
    price: 2899,
    category: "Perfumes & Fragrances",
    description: "Extrait de Parfum with notes of smoky Cambodian agarwood, amber, and damask rose.",
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&auto=format&fit=crop&q=80",
    size: "100 ml",
  },
  {
    id: "f-5",
    name: "Velvet Santal Luxury Fragrance",
    price: 1999,
    category: "Perfumes & Fragrances",
    description: "Warm Australian sandalwood blended with iris, violet, and creamy cardamom.",
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&auto=format&fit=crop&q=80",
    size: "50 ml",
  },
  {
    id: "f-6",
    name: "Heavyweight Boxy Graphic Tee",
    price: 1199,
    category: "Shirts & Tops",
    description: "260 GSM organic combed cotton with dropped shoulders and ribbed neckline.",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80",
    size: "L",
  },
];

const StorefrontAIAssistant = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [catalog, setCatalog] = useState(FALLBACK_CATALOG);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome! I am your AI Stylist & Shopping Advisor. Ask me to find perfumes, style outfits, check shoe & clothing sizes, or track your orders.",
      time: "Just now",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Load products from backend catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get("/products");
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        if (list.length > 0) {
          // Merge backend products with fallback items for rich multi-category answers
          setCatalog([...list, ...FALLBACK_CATALOG]);
        }
      } catch (err) {
        // Use fallback catalog
      }
    };
    fetchCatalog();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "✨ Recommend luxury perfumes",
    "👟 Show trending shoes & size guide",
    "🧥 Style an evening outfit",
    "📏 Sizing guide for shirts & pants",
    "📦 How do I track my order?",
  ];

  // Try item in fitting room
  const handleWearItem = (product) => {
    window.dispatchEvent(
      new CustomEvent("wearInFittingRoom", {
        detail: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: getProductImg(product.imageUrl),
          category: product.category?.name || product.category || "Apparel",
        },
      })
    );
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [
      ...messages,
      {
        role: "user",
        content: query,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        products: [],
      },
    ];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase().trim();
      let reply = "";
      let matchedProducts = [];

      // 1. PERFUMES & FRAGRANCES
      if (
        q.includes("perfume") ||
        q.includes("fragrance") ||
        q.includes("scent") ||
        q.includes("cologne") ||
        q.includes("oud") ||
        q.includes("attar")
      ) {
        matchedProducts = catalog.filter((p) => {
          const t = `${p.name} ${p.category?.name || p.category || ""} ${p.description || ""}`.toLowerCase();
          return (
            t.includes("perfume") ||
            t.includes("fragrance") ||
            t.includes("oud") ||
            t.includes("santal") ||
            t.includes("scent")
          );
        });

        if (matchedProducts.length === 0) {
          matchedProducts = FALLBACK_CATALOG.filter((p) => p.category.includes("Perfume"));
        }

        reply =
          "Here are our signature luxury perfumes crafted with rare essences. Available in **50 ml** (Travel Spray) and **100 ml** (Signature Atelier Flacon). Each bottle offers 12+ hours of long-lasting sillage.";
      }

      // 2. SHOES & FOOTWEAR
      else if (
        q.includes("shoe") ||
        q.includes("boot") ||
        q.includes("sneaker") ||
        q.includes("footwear") ||
        q.includes("loafer")
      ) {
        matchedProducts = catalog.filter((p) => {
          const t = `${p.name} ${p.category?.name || p.category || ""} ${p.description || ""}`.toLowerCase();
          return t.includes("shoe") || t.includes("boot") || t.includes("sneaker") || t.includes("footwear");
        });

        if (matchedProducts.length === 0) {
          matchedProducts = FALLBACK_CATALOG.filter((p) => p.category.includes("Shoes"));
        }

        reply =
          "Explore our handcrafted footwear collection. All shoes follow standard Indian & UK sizing (**UK 7 to UK 11 / EU 41 to 45**). Crafted with genuine Goodyear welting and memory foam insoles for all-day comfort.";
      }

      // 3. PANTS, TROUSERS & JEANS
      else if (
        q.includes("pant") ||
        q.includes("trouser") ||
        q.includes("jean") ||
        q.includes("bottom")
      ) {
        matchedProducts = catalog.filter((p) => {
          const t = `${p.name} ${p.category?.name || p.category || ""} ${p.description || ""}`.toLowerCase();
          return t.includes("pant") || t.includes("trouser") || t.includes("jean");
        });

        if (matchedProducts.length === 0) {
          matchedProducts = FALLBACK_CATALOG.filter((p) => p.category.includes("Pants"));
        }

        reply =
          "Here are our relaxed and tailored bottoms. Available in waist sizes **S (30\")**, **M (32\")**, **L (34\")**, and **XL (36\")**. Perfect for casual drape or smart-formal styling.";
      }

      // 4. SHIRTS, JACKETS, COATS & OUTFITS
      else if (
        q.includes("shirt") ||
        q.includes("jacket") ||
        q.includes("coat") ||
        q.includes("tee") ||
        q.includes("outfit") ||
        q.includes("recommend") ||
        q.includes("top pick") ||
        q.includes("dinner")
      ) {
        matchedProducts = catalog.filter((p) => {
          const t = `${p.name} ${p.category?.name || p.category || ""} ${p.description || ""}`.toLowerCase();
          return t.includes("coat") || t.includes("jacket") || t.includes("tee") || t.includes("shirt");
        });

        if (matchedProducts.length === 0) {
          matchedProducts = FALLBACK_CATALOG.slice(0, 3);
        }

        reply =
          "For modern distinction, we recommend pairing our **Camel Wool Trench Coat** with **Relaxed Fit Drawstring Pants** and **Italian Chelsea Boots**. Sizing is true-to-fit (**S, M, L, XL**). Tap the 🧥 button to try on any piece!";
      }

      // 5. SIZING GUIDE SPECIFIC
      else if (q.includes("size") || q.includes("sizing") || q.includes("fit") || q.includes("measurement")) {
        reply =
          "📏 **Official Atelier Sizing & Volume Guide:**\n\n" +
          "• **Shirts & Outerwear:** S (Chest 38\"), M (Chest 40\"), L (Chest 42\"), XL (Chest 44\")\n" +
          "• **Pants & Trousers:** S (Waist 30\"), M (Waist 32\"), L (Waist 34\"), XL (Waist 36\")\n" +
          "• **Footwear (UK):** UK 7 (EU 41), UK 8 (EU 42), UK 9 (EU 43), UK 10 (EU 44), UK 11 (EU 45)\n" +
          "• **Perfumes & Scents:** 50 ml (Travel Spray), 100 ml (Signature Flacon), 150 ml (Grand Edition)\n\n" +
          "Need a bespoke recommendation? Ask about any specific garment!";
      }

      // 6. ORDER TRACKING & SHIPPING
      else if (q.includes("track") || q.includes("order") || q.includes("shipping") || q.includes("delivery")) {
        reply =
          "📦 **Order & Delivery Information:**\n\n" +
          "• **Free Shipping:** Available on all orders over ₹999 across India.\n" +
          "• **Delivery Time:** 2-4 business days via Express Bluedart / Delhivery.\n" +
          "• **Tracking:** You can track live courier checkpoints under the 'Track Order' page using your Order ID and email.";
      }

      // 7. BUDGET / PRICE QUERIES (e.g. Under 2000, 3000)
      else if (q.includes("under") || q.includes("budget") || q.includes("price") || q.includes("cheap") || q.includes("discount")) {
        const numbers = q.match(/\d+/g);
        const limit = numbers ? parseInt(numbers[0], 10) : 3000;
        matchedProducts = catalog.filter((p) => Number(p.price || 0) <= limit).slice(0, 4);

        if (matchedProducts.length === 0) {
          matchedProducts = catalog.slice(0, 3);
        }

        reply = `Here are our top curated selections under ₹${limit.toLocaleString("en-IN")}:`;
      }

      // 8. GENERAL SEARCH QUERY
      else {
        // Try searching catalog by any word in query
        const words = q.split(/\s+/).filter((w) => w.length > 2);
        matchedProducts = catalog.filter((p) => {
          const t = `${p.name} ${p.category?.name || p.category || ""} ${p.description || ""}`.toLowerCase();
          return words.some((w) => t.includes(w));
        }).slice(0, 4);

        if (matchedProducts.length > 0) {
          reply = `I found ${matchedProducts.length} curated item${matchedProducts.length > 1 ? "s" : ""} matching "${query}":`;
        } else {
          matchedProducts = catalog.slice(0, 3);
          reply =
            `I have tailored our latest high-fashion collection for "${query}". You can test any piece in the 3D Virtual Fitting Room or ask me about specific shirts, shoes, pants, and perfumes!`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          products: matchedProducts.slice(0, 4),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1060,
            background: "linear-gradient(135deg, #18181b 0%, #0d0e12 100%)",
            border: "1px solid rgba(224, 122, 66, 0.45)",
            borderRadius: "40px",
            padding: "8px 18px 8px 10px",
            color: "#ffffff",
            boxShadow:
              "0 12px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(224, 122, 66, 0.25)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
            e.currentTarget.style.borderColor = "#e07a42";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.borderColor = "rgba(224, 122, 66, 0.45)";
          }}
        >
          <div style={{ width: "32px", height: "32px" }}>
            <ThreeDChromeOrb size={32} interactive={false} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "13px", letterSpacing: "-0.2px" }}>
              AI Stylist
            </div>
            <div style={{ fontSize: "9px", color: "#e07a42", textAlign: "left", lineHeight: 1 }}>
              ● Live Concierge
            </div>
          </div>
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "380px",
            maxWidth: "calc(100vw - 32px)",
            height: "580px",
            maxHeight: "calc(100vh - 48px)",
            background: "rgba(18, 19, 23, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(224, 122, 66, 0.35)",
            borderRadius: "24px",
            boxShadow:
              "0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(224, 122, 66, 0.2)",
            zIndex: 1070,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: "#ffffff",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "linear-gradient(180deg, rgba(30, 31, 38, 0.7) 0%, transparent 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: "34px", height: "34px" }}>
                <ThreeDChromeOrb size={34} interactive={false} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "14px", letterSpacing: "-0.2px", color: "#fff" }}>
                  AI Personal Stylist
                </div>
                <div style={{ fontSize: "10px", color: "#e07a42", fontWeight: 700 }}>
                  ✦ Fashion, Sizing & Fragrance Advisor
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                padding: "6px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                }}
              >
                <div
                  style={{
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)"
                        : "#23242b",
                    color: "#ffffff",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {msg.content}

                  {/* Interactive Product Mini-Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2.5 pt-2 border-top border-secondary border-opacity-25 d-flex flex-column gap-2">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          style={{
                            background: "rgba(15, 16, 20, 0.75)",
                            borderRadius: "12px",
                            padding: "8px 10px",
                            border: "1px solid rgba(224, 122, 66, 0.25)",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <img
                            src={getProductImg(prod.imageUrl)}
                            alt={prod.name}
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "8px",
                              objectFit: "contain",
                              background: "#181920",
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#fff",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {prod.name}
                            </div>
                            <div style={{ fontSize: "11px", color: "#e07a42", fontWeight: 800 }}>
                              ₹{Number(prod.price || 0).toLocaleString("en-IN")}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleWearItem(prod)}
                              title="Try in Fitting Room"
                              style={{
                                background: "rgba(224, 122, 66, 0.15)",
                                border: "1px solid rgba(224, 122, 66, 0.35)",
                                color: "#e07a42",
                                borderRadius: "8px",
                                padding: "4px 8px",
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              🧥 Fit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/product/${prod.id}`);
                              }}
                              title="View details"
                              style={{
                                background: "rgba(255, 255, 255, 0.06)",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                color: "#fff",
                                borderRadius: "8px",
                                padding: "4px 8px",
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              ↗
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "9px",
                    color: "rgba(255, 255, 255, 0.4)",
                    marginTop: "4px",
                    textAlign: msg.role === "user" ? "right" : "left",
                    padding: "0 4px",
                  }}
                >
                  {msg.time}
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#23242b",
                  padding: "10px 16px",
                  borderRadius: "16px 16px 16px 4px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <div
                  className="spinner-grow spinner-grow-sm"
                  style={{ width: "6px", height: "6px", color: "#e07a42" }}
                />
                <div
                  className="spinner-grow spinner-grow-sm"
                  style={{ width: "6px", height: "6px", color: "#e07a42", animationDelay: "0.2s" }}
                />
                <div
                  className="spinner-grow spinner-grow-sm"
                  style={{ width: "6px", height: "6px", color: "#e07a42", animationDelay: "0.4s" }}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div
            style={{
              padding: "6px 16px",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
            }}
          >
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(p)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  padding: "5px 12px",
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.8)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#e07a42";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              background: "#18191f",
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#22232b",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "30px",
                padding: "4px 8px 4px 16px",
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about perfumes, shoes, sizes, outfits..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "13px",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#e07a42",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(224, 122, 66, 0.4)",
                }}
              >
                ➔
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StorefrontAIAssistant;
