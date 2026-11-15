"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "./use-reduced-motion";

export function HeroMockupInteractive() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    setTilt({
      rotateX: -y * 12, // max 6deg tilt
      rotateY: x * 12,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false });
  };

  const transformStyle: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${
          tilt.isHovered ? 1.02 : 1
        }, ${tilt.isHovered ? 1.02 : 1}, 1)`,
        transition: tilt.isHovered
          ? "transform 150ms cubic-bezier(0.16, 1, 0.3, 1)"
          : "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
      };

  const badgeTransformStyle: React.CSSProperties = prefersReducedMotion
    ? {}
    : {
        transform: `translate3d(${tilt.rotateY * 0.9}px, ${
          -tilt.rotateX * 0.9
        }px, 24px) scale(${tilt.isHovered ? 1.08 : 1})`,
        transition: tilt.isHovered
          ? "transform 150ms cubic-bezier(0.16, 1, 0.3, 1)"
          : "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
      };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative hero-float-slow"
    >
      <div style={transformStyle} className="relative">
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-background">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-success/50" />
            <div className="ml-3 flex-1 h-5 rounded bg-border/60 max-w-[160px]" />
          </div>
          <Image
            src="/dashboard-mockup.png"
            alt="Tampilan Dashboard jagang company"
            width={840}
            height={840}
            priority
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Floating Live Badge */}
        <div
          style={badgeTransformStyle}
          className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-xl px-3.5 py-2.5 shadow-lg border border-primary-foreground/10 flex items-center gap-1.5 hero-badge-float"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[10px] uppercase tracking-[0.15em] font-bold">
            Live
          </p>
        </div>
      </div>
    </div>
  );
}

