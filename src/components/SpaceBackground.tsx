import React, { useEffect, useRef } from "react";

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic responsiveness
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle star definitions
    interface Star {
      x: number;
      y: number;
      size: number;
      speed: number;
      brightness: number;
      color: string;
    }

    const starColors = ["#ffffff", "#e0f2fe", "#bae6fd", "#fed7aa", "#fecdd3"];
    const stars: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.15 + 0.05,
      brightness: Math.random(),
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    // Large glowing nebulas
    interface Nebula {
      x: number;
      y: number;
      r: number;
      color: string;
      dx: number;
      dy: number;
    }

    const nebulas: Nebula[] = [
      {
        x: width * 0.25,
        y: height * 0.35,
        r: Math.min(width, height) * 0.4,
        color: "rgba(99, 102, 241, 0.07)", // Indigo glow
        dx: 0.04,
        dy: 0.02,
      },
      {
        x: width * 0.75,
        y: height * 0.65,
        r: Math.min(width, height) * 0.45,
        color: "rgba(14, 165, 233, 0.06)", // Ocean sky blue glow
        dx: -0.03,
        dy: -0.05,
      },
      {
        x: width * 0.5,
        y: height * 0.15,
        r: Math.min(width, height) * 0.35,
        color: "rgba(217, 70, 239, 0.04)", // Fuchsia nebula dust
        dx: 0.02,
        dy: -0.03,
      },
    ];

    // Main animation loops
    const animate = () => {
      ctx.fillStyle = "#03000d"; // Cosmic deep void darkness
      ctx.fillRect(0, 0, width, height);

      // 1. Draw glowing nebulas
      nebulas.forEach((neb) => {
        neb.x += neb.dx;
        neb.y += neb.dy;

        // Bounce nebulas slowly inside borders
        if (neb.x - neb.r < 0 || neb.x + neb.r > width) neb.dx *= -1;
        if (neb.y - neb.r < 0 || neb.y + neb.r > height) neb.dy *= -1;

        const grad = ctx.createRadialGradient(
          neb.x,
          neb.y,
          0,
          neb.x,
          neb.y,
          neb.r
        );
        grad.addColorStop(0, neb.color);
        grad.addColorStop(0.5, "rgba(0,0,0,0.02)");
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw & update stars
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // Star twinkling sinus pulse
        star.brightness += Math.random() * 0.04 - 0.02;
        if (star.brightness < 0.2) star.brightness = 0.2;
        if (star.brightness > 1) star.brightness = 1;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.brightness;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
