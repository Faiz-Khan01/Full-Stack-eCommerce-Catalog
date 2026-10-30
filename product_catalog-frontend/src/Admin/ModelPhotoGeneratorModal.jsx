import React, { useState } from "react";

/**
 * ModelPhotoGeneratorModal
 * As demonstrated in frames 00:07 - 00:10 of the reference video.
 * Generates AI photoshoot variations on mannequins or real models in custom settings.
 */
const ModelPhotoGeneratorModal = ({ isOpen, onClose, onAddPhoto, productName = "Product" }) => {
  const [step, setStep] = useState(1); // 1: Model, 2: Setting, 3: Generated Results
  const [selectedModel, setSelectedModel] = useState("photo"); // "mannequin" | "photo"
  const [selectedSetting, setSelectedSetting] = useState("nature"); // "none" | "studio" | "cafe" | "indoor" | "urban" | "nature"
  const [isGenerating, setIsGenerating] = useState(false);

  const settingsList = [
    {
      id: "none",
      title: "No change",
      desc: "Keep the photo's original backdrop",
      img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "studio",
      title: "Studio",
      desc: "Neutral backdrop",
      img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "cafe",
      title: "Outdoor cafe",
      desc: "Cafe terrace",
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "indoor",
      title: "Cosy Indoor",
      desc: "Warm interior",
      img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "urban",
      title: "Urban street",
      desc: "Gritty backdrops",
      img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
    },
    {
      id: "nature",
      title: "Nature",
      desc: "Beach & sea",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80",
    },
  ];

  const generatedBeachPhotos = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#14151b",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "24px",
          padding: "28px",
          color: "#ffffff",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(224, 122, 66, 0.15)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#e07a42",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "4px",
              }}
            >
              MODEL PHOTO GENERATOR
            </div>
            <h4 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
              for {productName}
            </h4>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="d-flex align-items-center justify-content-center gap-4 mb-4">
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: step >= 1 ? "#e07a42" : "#27272a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              1
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: step >= 1 ? "#fff" : "rgba(255,255,255,0.4)" }}>
              Model
            </span>
          </div>
          <div style={{ width: "30px", height: "1px", background: "rgba(255,255,255,0.15)" }} />
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: step >= 2 ? "#e07a42" : "#27272a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              2
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: step >= 2 ? "#fff" : "rgba(255,255,255,0.4)" }}>
              Setting
            </span>
          </div>
          <div style={{ width: "30px", height: "1px", background: "rgba(255,255,255,0.15)" }} />
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: step >= 3 ? "#e07a42" : "#27272a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              3
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: step >= 3 ? "#fff" : "rgba(255,255,255,0.4)" }}>
              Lighting & Result
            </span>
          </div>
        </div>

        {/* Step 1: Model Choice */}
        {step === 1 && (
          <div>
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div
                  onClick={() => setSelectedModel("mannequin")}
                  style={{
                    border: selectedModel === "mannequin" ? "2px solid #e07a42" : "1px solid rgba(255, 255, 255, 0.1)",
                    background: selectedModel === "mannequin" ? "rgba(224, 122, 66, 0.08)" : "#1a1b22",
                    borderRadius: "16px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    height: "100%",
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>👤</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                    Shop mannequin
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                    Replace display figures, retain body shape.
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div
                  onClick={() => setSelectedModel("photo")}
                  style={{
                    border: selectedModel === "photo" ? "2px solid #e07a42" : "1px solid rgba(255, 255, 255, 0.1)",
                    background: selectedModel === "photo" ? "rgba(224, 122, 66, 0.08)" : "#1a1b22",
                    borderRadius: "16px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    height: "100%",
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>✨</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                    A photo of a model
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                    Upload someone, keep their clothes and features, then scene change.
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <button
                onClick={onClose}
                className="btn"
                style={{
                  background: "#1c1d24",
                  color: "rgba(255,255,255,0.7)",
                  borderRadius: "10px",
                  padding: "8px 20px",
                  fontSize: "13px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="btn"
                style={{
                  background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
                  color: "#ffffff",
                  borderRadius: "10px",
                  padding: "8px 24px",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: "none",
                }}
              >
                Next ➔
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Setting Choice */}
        {step === 2 && (
          <div>
            {isGenerating ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border mb-3"
                  style={{ width: "40px", height: "40px", color: "#e07a42" }}
                />
                <h5 style={{ fontWeight: 700 }}>Synthesizing Photorealistic Scene...</h5>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                  Generating 3 daylight beach setting variations on high-fashion model...
                </p>
              </div>
            ) : (
              <>
                <div className="row g-3 mb-4">
                  {settingsList.map((item) => (
                    <div key={item.id} className="col-4">
                      <div
                        onClick={() => setSelectedSetting(item.id)}
                        style={{
                          border: selectedSetting === item.id ? "2px solid #e07a42" : "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "14px",
                          overflow: "hidden",
                          cursor: "pointer",
                          background: "#1c1d24",
                        }}
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          style={{ width: "100%", height: "85px", objectFit: "cover" }}
                        />
                        <div style={{ padding: "8px 10px" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700 }}>{item.title}</div>
                          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    onClick={() => setStep(1)}
                    className="btn"
                    style={{
                      background: "#1c1d24",
                      color: "rgba(255,255,255,0.7)",
                      borderRadius: "10px",
                      padding: "8px 20px",
                      fontSize: "13px",
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="btn"
                    style={{
                      background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
                      color: "#ffffff",
                      borderRadius: "10px",
                      padding: "8px 24px",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "none",
                    }}
                  >
                    Generate Photos ⚡
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Generated Photos Result */}
        {step === 3 && (
          <div>
            <div
              style={{
                background: "rgba(224, 122, 66, 0.1)",
                border: "1px solid rgba(224, 122, 66, 0.25)",
                borderRadius: "12px",
                padding: "10px 14px",
                fontSize: "12px",
                marginBottom: "16px",
              }}
            >
              ✨ Generated 3 photos of the person wearing the relaxed fit trousers in a beach setting
              with natural daylight.
            </div>

            <div className="row g-3 mb-4">
              {generatedBeachPhotos.map((url, idx) => (
                <div key={idx} className="col-4">
                  <div
                    style={{
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      position: "relative",
                      background: "#1c1d24",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Photo ${idx + 1}`}
                      style={{ width: "100%", height: "170px", objectFit: "cover" }}
                    />
                    <button
                      onClick={() => {
                        onAddPhoto(url);
                        onClose();
                      }}
                      className="btn w-100"
                      style={{
                        background: "#e07a42",
                        color: "#fff",
                        borderRadius: "0",
                        fontSize: "12px",
                        fontWeight: 700,
                        padding: "6px 0",
                        border: "none",
                      }}
                    >
                      + Add to Product
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end">
              <button
                onClick={onClose}
                className="btn"
                style={{
                  background: "#1c1d24",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "8px 24px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelPhotoGeneratorModal;
