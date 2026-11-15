"use client";

import React, { useEffect, useState } from "react";
import { useScrollReveal } from "./scroll-reveal";

interface AnimatedCounterProps {
  value: string; // e.g., "142+", "98%", "324", "200+"
  duration?: number;
}

export function AnimatedCounter({
  value,
  duration = 1500,
}: AnimatedCounterProps) {
  const { isVisible, prefersReducedMotion } = useScrollReveal();

  // Parse numeric part and suffix as primitive values so useEffect never re-triggers on re-render
  const match = value.match(/^(\d+)(.*)$/);
  const hasMatch = Boolean(match);
  const targetNumber = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || !hasMatch) {
      return;
    }

    if (!isVisible) {
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quartic curve for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      const nextValue = Math.round(eased * targetNumber);

      setCount(nextValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(targetNumber);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, prefersReducedMotion, targetNumber, duration, hasMatch]);

  if (!hasMatch || prefersReducedMotion) {
    return <>{value}</>;
  }

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}
