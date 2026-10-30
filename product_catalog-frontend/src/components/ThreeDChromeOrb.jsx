import React, { useEffect, useRef } from "react";

/**
 * ThreeDChromeOrb
 * High-performance 3D Chrome / Metallic Fluid Sphere rendered via Canvas 2D / procedural raymarching
 * Matches the floating 3D chrome orb seen in the AI Assistant reference video.
 */
const ThreeDChromeOrb = ({ size = 260, interactive = true }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      time += 0.025;
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.36;

      ctx.clearRect(0, 0, w, h);

      // Ambient outer glow
      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.5);
      outerGlow.addColorStop(0, "rgba(224, 122, 66, 0.22)");
      outerGlow.addColorStop(0.5, "rgba(255, 200, 150, 0.08)");
      outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Floating vertical bobbing
      const bobY = Math.sin(time * 1.5) * 6;
      const sphereY = cy + bobY;

      // Base chrome sphere gradient
      const lightX = cx + (mouse.x * 0.4 + Math.cos(time * 0.8) * 0.2) * radius;
      const lightY = sphereY + (mouse.y * 0.4 + Math.sin(time * 0.8) * 0.2 - 0.3) * radius;

      const sphereGrad = ctx.createRadialGradient(
        lightX,
        lightY,
        radius * 0.1,
        cx,
        sphereY,
        radius
      );
      sphereGrad.addColorStop(0, "#ffffff");
      sphereGrad.addColorStop(0.15, "#e8e5e0");
      sphereGrad.addColorStop(0.35, "#8a8d93");
      sphereGrad.addColorStop(0.65, "#23262d");
      sphereGrad.addColorStop(0.85, "#14151a");
      sphereGrad.addColorStop(1, "#07080b");

      // Draw main sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, sphereY, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.clip();

      // Fluid chrome iridescent distortion waves
      for (let i = 0; i < 4; i++) {
        const waveAngle = time * (0.8 + i * 0.3) + i * 1.2;
        const waveOffset = Math.sin(waveAngle) * (radius * 0.3);
        const waveGrad = ctx.createLinearGradient(
          cx - radius,
          sphereY + waveOffset,
          cx + radius,
          sphereY - waveOffset
        );
        waveGrad.addColorStop(0, "rgba(224, 122, 66, 0.0)");
        waveGrad.addColorStop(0.3, i % 2 === 0 ? "rgba(255, 220, 180, 0.4)" : "rgba(180, 200, 255, 0.3)");
        waveGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.65)");
        waveGrad.addColorStop(0.7, i % 2 === 0 ? "rgba(224, 122, 66, 0.35)" : "rgba(140, 160, 220, 0.3)");
        waveGrad.addColorStop(1, "rgba(0, 0, 0, 0.0)");

        ctx.fillStyle = waveGrad;
        ctx.beginPath();
        ctx.ellipse(
          cx + Math.cos(time + i) * 15,
          sphereY + Math.sin(time * 1.2 + i) * 15,
          radius * 0.9,
          radius * 0.45,
          (time * 0.5 + i * 0.8),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Metallic rim specular reflection (luxury copper / chrome rim)
      const rimGrad = ctx.createRadialGradient(
        cx,
        sphereY,
        radius * 0.85,
        cx,
        sphereY,
        radius
      );
      rimGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      rimGrad.addColorStop(0.7, "rgba(224, 122, 66, 0.35)");
      rimGrad.addColorStop(0.95, "rgba(255, 240, 220, 0.8)");
      rimGrad.addColorStop(1, "rgba(255, 255, 255, 0.95)");

      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(cx, sphereY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Sharp primary chrome hotspot / glare
      ctx.beginPath();
      ctx.ellipse(
        lightX,
        lightY,
        radius * 0.22,
        radius * 0.14,
        -0.4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 18;
      ctx.fill();

      ctx.restore();

      // Floating orbit particles
      for (let p = 0; p < 8; p++) {
        const pAngle = time * 0.7 + (p * Math.PI) / 4;
        const pDistX = Math.cos(pAngle) * (radius * 1.28);
        const pDistY = Math.sin(pAngle * 1.3) * (radius * 0.65) + bobY;
        const pSize = 1.5 + Math.sin(time + p) * 0.8;
        const pAlpha = 0.3 + Math.sin(time * 2 + p) * 0.3;

        ctx.fillStyle = p % 2 === 0 ? `rgba(224, 122, 66, ${pAlpha})` : `rgba(255, 255, 255, ${pAlpha})`;
        ctx.beginPath();
        ctx.arc(cx + pDistX, cy + pDistY, Math.max(0.8, pSize), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        style={{
          width: size,
          height: size,
          display: "block",
          filter: "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.6))",
        }}
      />
    </div>
  );
};

export default ThreeDChromeOrb;
