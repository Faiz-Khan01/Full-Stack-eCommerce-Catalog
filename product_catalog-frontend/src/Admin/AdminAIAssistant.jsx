import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThreeDChromeOrb from "../components/ThreeDChromeOrb";
import api from "../services/api";
import Swal from "sweetalert2";

const AdminAIAssistant = () => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState("Gemini 2.0 Flash");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Pre-load demo image option
  const demoImageOption = {
    name: "a894d53c-c849-pants.jpg",
    url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
    status: "Ready",
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleAttachDemo = () => {
    setAttachedImage(demoImageOption);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedImage({
        name: file.name.length > 20 ? `${file.name.substring(0, 16)}...` : file.name,
        url,
        status: "Ready",
      });
    }
  };

  const handleSuggestionClick = (promptText) => {
    handleSendMessage(promptText);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() && !attachedImage) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: query,
      image: attachedImage ? { ...attachedImage } : null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const sentImage = attachedImage;
    setAttachedImage(null);
    setIsThinking(true);

    // Dynamic AI response logic
    setTimeout(async () => {
      let thoughtSeconds = 2;
      let thoughtSteps = 1;
      let aiContent = "";
      let productAction = null;

      const lower = query.toLowerCase();

      if (lower.includes("add") || lower.includes("product") || sentImage) {
        thoughtSteps = 2;
        thoughtSeconds = 3;
        aiContent =
          "I analyzed the attached item and extracted product metadata: relaxed-fit drawstring casual trousers in dark charcoal/black with elasticized waistband and tonal hardware. I have prepared a draft listing ready for your catalog.";
        productAction = {
          type: "CREATE_PRODUCT",
          title: "Relaxed Fit Drawstring Pants - Black",
          price: "₹2,499",
          category: "Pants & Trousers",
          stock: 25,
          image:
            sentImage?.url ||
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80",
        };
      } else if (lower.includes("how is my store doing") || lower.includes("store")) {
        thoughtSteps = 3;
        thoughtSeconds = 2;
        aiContent =
          "Store Performance Summary:\n• Total Revenue is at ₹84.3K (+16.2% vs last month)\n• Conversion Rate is holding strong at 4.9%\n• Active orders: 36 pending fulfillment\n• Customer retention increased by +8.4% over the last 30 days.";
      } else if (lower.includes("running out") || lower.includes("stock")) {
        thoughtSteps = 1;
        thoughtSeconds = 1;
        aiContent =
          "Inventory Alert:\n• Relaxed Fit Drawstring Pants: 5 units remaining (Critical)\n• Camel Wool Trench Coat: 3 units remaining\n• Vintage Olive Graphic Tee: 8 units remaining\n\nRecommendation: Restock 20 units of Relaxed Fit Drawstring Pants to prevent lost checkout conversions.";
      } else if (lower.includes("orders to ship") || lower.includes("orders")) {
        thoughtSteps = 2;
        thoughtSeconds = 2;
        aiContent =
          "You have 12 priority shipments awaiting courier pickup today:\n• Order #1042 — Sara Malik (₹2,499) — Standard Priority\n• Order #1043 — Julian Vance (₹4,499) — Express Courier\n• Order #1044 — Marcus Reed (₹1,899) — Standard Priority\n\nAll labels have been generated and batch invoices are synchronized.";
      } else if (lower.includes("best sellers")) {
        thoughtSteps = 1;
        thoughtSeconds = 2;
        aiContent =
          "Top 3 Best Selling Products this month:\n1. Army Green Puffer Jacket — 142 units sold (₹26.8K)\n2. Camel Wool Trench Coat — 98 units sold (₹44.0K)\n3. Indigo Denim Trucker Jacket — 86 units sold (₹10.2K)";
      } else {
        aiContent =
          `I processed your request regarding "${query}". Everything across the inventory, storefront, and order pipeline is synchronized. Let me know if you would like me to generate photo assets, update inventory, or launch a campaign.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: aiContent,
          thoughtSteps,
          thoughtSeconds,
          productAction,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsThinking(false);
    }, 1500);
  };

  const handleApplyProductToStore = async (action) => {
    try {
      Swal.fire({
        title: "Product Listing Created!",
        text: `"${action.title}" at ${action.price} has been drafted. Opening in Catalog...`,
        icon: "success",
        confirmButtonColor: "#e07a42",
      }).then(() => {
        navigate("/admin/products");
      });
    } catch {
      navigate("/admin/products");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 110px)",
        color: "#ffffff",
        position: "relative",
      }}
    >
      {/* Top AI Header */}
      <div
        className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3 pb-3"
        style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              background: "rgba(224, 122, 66, 0.15)",
              border: "1px solid rgba(224, 122, 66, 0.35)",
              borderRadius: "12px",
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#e07a42", fontSize: "14px" }}>✨</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="Gemini 2.0 Flash" style={{ background: "#1c1d24", color: "#fff" }}>
                Gemini 2.0 Flash
              </option>
              <option value="Gemini 1.5 Pro" style={{ background: "#1c1d24", color: "#fff" }}>
                Gemini 1.5 Pro
              </option>
              <option value="Claude 3.5 Sonnet" style={{ background: "#1c1d24", color: "#fff" }}>
                Claude 3.5 Sonnet
              </option>
            </select>
          </div>

          <div
            style={{
              background: "#1c1d24",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              padding: "6px 12px",
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.75)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🔑</span>
            <span>Demo API keys</span>
          </div>
        </div>

        <button
          onClick={() => setMessages([])}
          className="btn"
          style={{
            background: "#1a1b22",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.8)",
            borderRadius: "10px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          + New Session
        </button>
      </div>

      {/* Main Content Area */}
      {messages.length === 0 ? (
        // Hero Center Display
        <div
          className="d-flex flex-column align-items-center justify-content-center flex-1 my-auto"
          style={{ minHeight: "52vh", textAlign: "center" }}
        >
          {/* Floating Chrome 3D Orb */}
          <div className="mb-3">
            <ThreeDChromeOrb size={170} interactive={true} />
          </div>

          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            Good to see you, Demo.
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "14px",
              maxWidth: "480px",
              marginBottom: "32px",
            }}
          >
            Your intelligent luxury atelier assistant. Ask questions, analyze catalog performance,
            or drop an apparel photo to draft a listing with 3D animation.
          </p>
        </div>
      ) : (
        // Message History
        <div
          className="flex-1 overflow-y-auto mb-4"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            paddingRight: "8px",
            maxHeight: "65vh",
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: m.role === "user" ? "75%" : "85%",
              }}
            >
              {m.role === "user" ? (
                <div
                  style={{
                    background: "#1e2029",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "18px 18px 4px 18px",
                    padding: "16px 20px",
                    color: "#ffffff",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  {/* Attached Image if any */}
                  {m.image && (
                    <div
                      className="mb-3 d-flex align-items-center gap-3 p-2 rounded-3"
                      style={{
                        background: "#13141a",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                      }}
                    >
                      <img
                        src={m.image.url}
                        alt="attachment"
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600 }}>{m.image.name}</div>
                        <div style={{ fontSize: "10px", color: "#10b981" }}>✓ Ready</div>
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: "14px", lineHeight: 1.5 }}>{m.content}</div>
                </div>
              ) : (
                <div
                  style={{
                    background: "#14151b",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "18px 18px 18px 4px",
                    padding: "20px 24px",
                    color: "#ffffff",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {/* Thought Step Accordion */}
                  <div
                    className="d-flex align-items-center gap-2 mb-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "11px",
                      color: "rgba(255, 255, 255, 0.65)",
                      display: "inline-flex",
                    }}
                  >
                    <span>⚡ {m.thoughtSteps || 1} step</span>
                    <span>•</span>
                    <span>Thought for {m.thoughtSeconds || 2}s</span>
                  </div>

                  {/* Main text content */}
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: "rgba(255, 255, 255, 0.9)",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {m.content}
                  </div>

                  {/* Product Action Card if generated */}
                  {m.productAction && (
                    <div
                      className="mt-3 p-3 rounded-3"
                      style={{
                        background: "#1d1e27",
                        border: "1px solid rgba(224, 122, 66, 0.3)",
                      }}
                    >
                      <div className="d-flex gap-3 align-items-center">
                        <img
                          src={m.productAction.image}
                          alt="Product"
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "10px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="flex-1">
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                            {m.productAction.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "#e07a42", fontWeight: 700 }}>
                            {m.productAction.price} • Stock: {m.productAction.stock}
                          </div>
                          <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)" }}>
                            Category: {m.productAction.category}
                          </div>
                        </div>
                        <button
                          onClick={() => handleApplyProductToStore(m.productAction)}
                          className="btn"
                          style={{
                            background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 700,
                            borderRadius: "10px",
                            padding: "8px 16px",
                            border: "none",
                            boxShadow: "0 4px 14px rgba(224, 122, 66, 0.4)",
                          }}
                        >
                          Open in Editor ➔
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div
              style={{
                alignSelf: "flex-start",
                background: "#14151b",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px 18px 18px 4px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#e07a42",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <div
                className="spinner-border spinner-border-sm"
                role="status"
                style={{ borderWidth: "2px" }}
              />
              <span>Gemini is analyzing catalog & synthesizing recommendations...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Suggestion Chips */}
      <div
        className="d-flex align-items-center justify-content-center gap-2 mb-3 flex-wrap"
        style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
      >
        <button
          onClick={() => handleSuggestionClick("How is my store doing?")}
          style={chipStyle}
        >
          ✨ How is my store doing?
        </button>
        <button
          onClick={() => handleSuggestionClick("What is running out?")}
          style={chipStyle}
        >
          ✨ What is running out?
        </button>
        <button
          onClick={() => handleSuggestionClick("Orders to ship")}
          style={chipStyle}
        >
          ✨ Orders to ship
        </button>
        <button
          onClick={() => handleSuggestionClick("Best sellers")}
          style={chipStyle}
        >
          ✨ Best sellers
        </button>
      </div>

      {/* Floating Prompt Input Box */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          background: "#191a22",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "12px 16px",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Attachment Card Preview if attached */}
        {attachedImage && (
          <div
            className="d-inline-flex align-items-center gap-3 p-2 mb-2 rounded-3"
            style={{
              background: "#242632",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <img
              src={attachedImage.url}
              alt="Preview"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "6px",
                objectFit: "cover",
              }}
            />
            <div style={{ paddingRight: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#fff" }}>
                {attachedImage.name}
              </div>
              <div style={{ fontSize: "10px", color: "#10b981", fontWeight: 700 }}>
                ● {attachedImage.status}
              </div>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                padding: "2px 6px",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="d-flex align-items-center gap-2"
        >
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: "none" }}
          />

          {/* Attachment Paperclip Button */}
          <button
            type="button"
            onClick={() => {
              if (!attachedImage) {
                handleAttachDemo();
              } else {
                fileInputRef.current?.click();
              }
            }}
            title="Attach product photo or garment"
            style={{
              background: "transparent",
              border: "none",
              color: attachedImage ? "#e07a42" : "rgba(255, 255, 255, 0.6)",
              fontSize: "18px",
              cursor: "pointer",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            📎
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              attachedImage
                ? "Describe what you want to do (e.g. 'add this product, the price is ₹2,499')..."
                : "Ask me anything..."
            }
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "14px",
            }}
          />

          <button
            type="submit"
            disabled={!input.trim() && !attachedImage}
            style={{
              background:
                input.trim() || attachedImage
                  ? "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)"
                  : "#282a36",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() || attachedImage ? "pointer" : "not-allowed",
              boxShadow:
                input.trim() || attachedImage ? "0 4px 12px rgba(224, 122, 66, 0.4)" : "none",
              transition: "all 0.2s",
            }}
          >
            ➔
          </button>
        </form>
      </div>
    </div>
  );
};

const chipStyle = {
  background: "#16171f",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "30px",
  padding: "6px 14px",
  fontSize: "12px",
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.8)",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export default AdminAIAssistant;
