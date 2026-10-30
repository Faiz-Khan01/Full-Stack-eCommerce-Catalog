import React, { useEffect, useRef, useState } from "react";

/**
 * ThreeDProductViewer
 * Interactive 3D Product / Model Viewer with mouse drag-to-rotate, auto-orbit,
 * and luxury metallic/fabric perspective shading.
 * Used on dashboard cards and storefront "Curated Selection".
 */
const ThreeDProductViewer = ({
  modelType = "hat", // "hat", "sneaker", "jacket"
  size = 200,
  autoRotate = true,
  interactive = true,
  label = "",
}) => {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState({ x: -10, y: 25 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animId;
    if (autoRotate) {
      const step = () => {
        if (!isDraggingRef.current) {
          setRotation((prev) => ({
            x: prev.x,
            y: (prev.y + 0.6) % 360,
          }));
        }
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [autoRotate]);

  const handleMouseDown = (e) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !interactive) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotation((prev) => ({
      x: Math.max(-45, Math.min(45, prev.x - dy * 0.5)),
      y: (prev.y + dx * 0.8) % 360,
    }));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        width: size,
        height: size,
        position: "relative",
        cursor: interactive ? "grab" : "default",
        perspective: 900,
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 3D Ambient Pedestal Glow */}
      <div
        style={{
          position: "absolute",
          width: size * 0.75,
          height: size * 0.22,
          bottom: size * 0.08,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(224, 122, 66, 0.35) 0%, rgba(224, 122, 66, 0.05) 50%, transparent 80%)",
          filter: "blur(10px)",
          transform: "rotateX(70deg)",
          pointerEvents: "none",
        }}
      />

      {/* 3D Rotating Wrapper */}
      <div
        style={{
          width: size * 0.75,
          height: size * 0.75,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isDraggingRef.current ? "none" : "transform 0.1s linear",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {modelType === "hat" ? (
          // 3D Mustard / Metallic Bucket Hat Model
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Crown of hat */}
            <div
              style={{
                position: "absolute",
                width: "70%",
                height: "55%",
                top: "15%",
                left: "15%",
                borderRadius: "32% 32% 16% 16%",
                background: "radial-gradient(circle at 35% 25%, #f59e0b 0%, #d97706 40%, #b45309 75%, #78350f 100%)",
                boxShadow: "inset 0 -8px 16px rgba(0,0,0,0.4), inset 0 6px 12px rgba(255,255,255,0.4), 0 12px 24px rgba(0,0,0,0.5)",
                transform: "translateZ(15px)",
              }}
            >
              {/* Seam line */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "2px",
                  top: "65%",
                  background: "rgba(0,0,0,0.25)",
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                }}
              />
              {/* Brand patch tag */}
              <div
                style={{
                  position: "absolute",
                  width: "22px",
                  height: "14px",
                  bottom: "12%",
                  left: "38%",
                  background: "#18181b",
                  borderRadius: "2px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#e07a42",
                  fontSize: "6px",
                  fontWeight: 900,
                  letterSpacing: "0.5px",
                }}
              >
                ARQ
              </div>
            </div>

            {/* Hat Brim Layer 1 */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "38%",
                bottom: "10%",
                left: "0%",
                borderRadius: "50%",
                background: "linear-gradient(180deg, #d97706 0%, #b45309 45%, #78350f 85%)",
                boxShadow: "0 18px 30px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.3)",
                transform: "rotateX(75deg) translateZ(0px)",
              }}
            />

            {/* Hat Brim Underside Shadow */}
            <div
              style={{
                position: "absolute",
                width: "88%",
                height: "32%",
                bottom: "12%",
                left: "6%",
                borderRadius: "50%",
                background: "#451a03",
                boxShadow: "inset 0 4px 10px rgba(0,0,0,0.8)",
                transform: "rotateX(75deg) translateZ(-8px)",
                opacity: 0.85,
              }}
            />
          </div>
        ) : (
          // 3D Sneaker / Luxury Shoe Model
          <div
            style={{
              width: "100%",
              height: "70%",
              borderRadius: "40px 15px 12px 18px",
              background: "linear-gradient(135deg, #1f2937 0%, #111827 50%, #e07a42 100%)",
              boxShadow: "0 16px 32px rgba(0,0,0,0.5), inset 0 4px 10px rgba(255,255,255,0.25)",
              position: "relative",
              transform: "translateZ(10px)",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: -8,
                left: 0,
                right: 0,
                height: "14px",
                borderRadius: "0 0 10px 10px",
                background: "#ffffff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        )}
      </div>

      {/* Label and 360 Hint */}
      {label && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span>🔄</span>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
};

export default ThreeDProductViewer;
