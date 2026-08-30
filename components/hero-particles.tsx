"use client";

import { useEffect, useRef } from "react";

interface AntigravityProps {
  particleColor?: string;
  accentColor?: string;
  repelRadius?: number;
  repelStrength?: number;
  maxParticles?: number;
}

export default function HeroParticles({
  particleColor = "#0284c7", // Sky blue for visibility on light theme
  accentColor = "#29AEEE",   // Zia NFC brand cyan-blue
  repelRadius = 180,
  repelStrength = 2200,
  maxParticles = 120,
}: AntigravityProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let rafId: number;
    let isInside = false;

    // Smoothed cursor coordinates for ring lag
    let cursorX = -1000;
    let cursorY = -1000;
    let ringX = -1000;
    let ringY = -1000;

    const mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      lastX: -1000,
      lastY: -1000,
    };

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx?.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    const parent = canvas.parentElement || document.body;

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      if (mouse.lastX !== -1000) {
        mouse.vx = (newX - mouse.lastX) * 0.7;
        mouse.vy = (newY - mouse.lastY) * 0.7;
      } else {
        mouse.vx = 0;
        mouse.vy = 0;
      }

      mouse.x = newX;
      mouse.y = newY;
      mouse.lastX = newX;
      mouse.lastY = newY;
      cursorX = newX;
      cursorY = newY;
      isInside = true;

      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = "1";
      }
    }

    function onMouseEnter() {
      isInside = true;
    }

    function onMouseLeave() {
      isInside = false;
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.vx = 0;
      mouse.vy = 0;
      mouse.lastX = -1000;
      mouse.lastY = -1000;

      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    }

    parent.addEventListener("mousemove", onMouseMove as EventListener);
    parent.addEventListener("mouseenter", onMouseEnter as EventListener);
    parent.addEventListener("mouseleave", onMouseLeave as EventListener);

    const calcCount = Math.min(
      maxParticles,
      Math.max(40, Math.floor((W * H) / 9500))
    );

    class Particle {
      x: number = 0;
      y: number = 0;
      baseR: number = 1.2;
      r: number = 1.2;
      driftX: number = 0;
      driftY: number = 0;
      vx: number = 0;
      vy: number = 0;
      twinklePhase: number = 0;
      colorVariation: number = 0;

      constructor() {
        this.reset(true);
      }

      reset(initial: boolean) {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.baseR = 1.0 + Math.random() * 2.2;
        this.r = this.baseR;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.15 + Math.random() * 0.45;
        this.driftX = Math.cos(angle) * speed;
        this.driftY = Math.sin(angle) * speed;
        this.vx = this.driftX;
        this.vy = this.driftY;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.colorVariation = Math.random();
        if (!initial) this.spawnEdge();
      }

      spawnEdge() {
        const side = Math.floor(Math.random() * 4);
        if (side === 0) {
          this.x = -10;
          this.y = Math.random() * H;
        } else if (side === 1) {
          this.x = W + 10;
          this.y = Math.random() * H;
        } else if (side === 2) {
          this.x = Math.random() * W;
          this.y = -10;
        } else {
          this.x = Math.random() * W;
          this.y = H + 10;
        }
      }

      update() {
        // Organic fluid drift & momentum
        this.vx += (this.driftX - this.vx) * 0.03;
        this.vy += (this.driftY - this.vy) * 0.03;

        if (isInside && mouse.x !== -1000) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist2 = dx * dx + dy * dy;
          const radius2 = repelRadius * repelRadius;

          if (dist2 < radius2) {
            const dist = Math.sqrt(dist2) || 0.001;
            const force =
              ((1 - dist / repelRadius) * repelStrength) /
              (dist * dist + 350);
            this.vx += (dx / dist) * force * 0.025;
            this.vy += (dy / dist) * force * 0.025;

            // Transmit cursor movement wake
            this.vx += mouse.vx * 0.035;
            this.vy += mouse.vy * 0.035;
          }
        }

        // Friction / Damping
        this.vx *= 0.975;
        this.vy *= 0.975;
        this.x += this.vx;
        this.y += this.vy;

        // Wrap or reset outside bounds
        if (
          this.x < -30 ||
          this.x > W + 30 ||
          this.y < -30 ||
          this.y > H + 30
        ) {
          this.reset(false);
        }

        // Alive breathing / twinkle
        this.twinklePhase += 0.03;
        this.r = this.baseR + Math.sin(this.twinklePhase) * 0.5;
      }

      draw(context: CanvasRenderingContext2D) {
        let near = 0;
        if (isInside && mouse.x !== -1000) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          near = Math.max(0, 1 - dist / repelRadius);
        }

        context.beginPath();
        context.arc(this.x, this.y, this.r + near * 2.5, 0, Math.PI * 2);

        // Highlight nearby particles with radiant brand blue
        if (near > 0.1) {
          context.fillStyle = accentColor;
          context.globalAlpha = 0.65 + near * 0.35;
          context.shadowColor = accentColor;
          context.shadowBlur = 8 + near * 16;
        } else {
          context.fillStyle =
            this.colorVariation > 0.5 ? particleColor : accentColor;
          context.globalAlpha = 0.25 + Math.sin(this.twinklePhase) * 0.12;
          context.shadowColor = accentColor;
          context.shadowBlur = 3;
        }

        context.fill();
        context.shadowBlur = 0;
        context.globalAlpha = 1;
      }
    }

    const particles = Array.from(
      { length: calcCount },
      () => new Particle()
    );

    function drawConnections(context: CanvasRenderingContext2D) {
      context.lineWidth = 0.8;
      const maxConnectDist = 110;
      const maxConnectDistSq = maxConnectDist * maxConnectDist;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;

          if (d2 < maxConnectDistSq) {
            const dist = Math.sqrt(d2);
            const alpha = (1 - dist / maxConnectDist) * 0.22;

            // Extra glow if near mouse
            let mouseBonus = 0;
            if (isInside && mouse.x !== -1000) {
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const mdx = midX - mouse.x;
              const mdy = midY - mouse.y;
              const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mDist < repelRadius) {
                mouseBonus = (1 - mDist / repelRadius) * 0.45;
              }
            }

            context.strokeStyle = `rgba(41, 174, 238, ${Math.min(
              0.85,
              alpha + mouseBonus
            )})`;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Dampen mouse velocity
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      // Smooth lag for ring follower
      if (ringRef.current && isInside) {
        ringX += (cursorX - ringX) * 0.16;
        ringY += (cursorY - ringY) * 0.16;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      drawConnections(ctx);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }

      rafId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", onMouseMove as EventListener);
      parent.removeEventListener("mouseenter", onMouseEnter as EventListener);
      parent.removeEventListener("mouseleave", onMouseLeave as EventListener);
    };
  }, [particleColor, accentColor, repelRadius, repelStrength, maxParticles]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      />
      {/* Floating Center Cursor Glow Dot */}
      <div
        ref={cursorRef}
        className="pointer-events-none absolute top-0 left-0 hidden md:block opacity-0 transition-opacity duration-300 ease-out"
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: accentColor,
          boxShadow: `0 0 16px 5px ${accentColor}aa, 0 0 32px 10px rgba(56, 189, 248, 0.45)`,
          zIndex: 10,
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      {/* Lagging Outer Orbital Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute top-0 left-0 hidden md:block opacity-0 transition-opacity duration-300 ease-out"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: `1.5px solid ${accentColor}77`,
          background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
          zIndex: 9,
          willChange: "transform",
        }}
        aria-hidden="true"
      />
    </>
  );
}
