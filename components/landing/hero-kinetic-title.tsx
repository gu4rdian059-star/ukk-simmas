"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePrefersReducedMotion } from "./use-reduced-motion";

const KEYWORDS = [
  "teratur.",
  "terarah.",
  "efisien.",
  "transparan.",
  "modern.",
];

export function HeroKineticTitle() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [outgoingKeyword, setOutgoingKeyword] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set revealed after initial stagger completes (140ms + 700ms = 840ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // Advance to next keyword with slide-up + fade effect
  const advanceKeyword = useCallback(() => {
    if (prefersReducedMotion) {
      setKeywordIndex((prev) => (prev + 1) % KEYWORDS.length);
      return;
    }

    setOutgoingKeyword(KEYWORDS[keywordIndex]);
    const nextIdx = (keywordIndex + 1) % KEYWORDS.length;
    setKeywordIndex(nextIdx);
    setIsRotating(true);

    // Reset rotating state after animation finishes
    setTimeout(() => {
      setIsRotating(false);
      setOutgoingKeyword(null);
    }, 450);
  }, [keywordIndex, prefersReducedMotion]);

  // Set up 2.5s auto-rotation timer
  const resetTimer = useCallback(() => {
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
    }
    if (!prefersReducedMotion) {
      rotationTimerRef.current = setInterval(() => {
        advanceKeyword();
      }, 2500);
    }
  }, [advanceKeyword, prefersReducedMotion]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
      }
    };
  }, [resetTimer]);

  // Click handler: immediately jump to next keyword and reset 2.5s timer
  const handleKeywordClick = () => {
    if (isRotating) return;
    advanceKeyword();
    resetTimer();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleKeywordClick();
    }
  };

  const currentKeyword = KEYWORDS[keywordIndex];

  return (
    <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] mb-6 select-none">
      {/* Line 1: Magang */}
      <span
        className={`block ${
          isRevealed ? "overflow-visible" : "overflow-hidden"
        } pt-1 pb-1 -mt-1 -mb-1`}
      >
        <span className="inline-block hero-word-reveal-0">
          <span className="inline-block hero-hover-track cursor-default">
            Magang
          </span>
        </span>
      </span>

      {/* Line 2: lebih */}
      <span
        className={`block ${
          isRevealed ? "overflow-visible" : "overflow-hidden"
        } pt-1 pb-1 -mt-1 -mb-1`}
      >
        <span className="inline-block hero-word-reveal-1">
          <span className="inline-block text-muted-foreground/60 font-semibold hero-hover-track cursor-default">
            lebih
          </span>
        </span>
      </span>

      {/* Line 3: Rotating Keyword */}
      <span
        className={`block ${
          isRevealed ? "overflow-visible" : "overflow-hidden"
        } pt-1 pb-2 -mt-1 -mb-2`}
      >
        <span className="inline-block hero-word-reveal-2">
          <span
            className="relative inline-flex items-baseline align-top overflow-hidden pt-1 pb-1.5 -mt-1 -mb-1.5 focus:outline-hidden"
            role="button"
            tabIndex={0}
            onClick={handleKeywordClick}
            onKeyDown={handleKeyDown}
            title="Klik untuk lanjut ke kata berikutnya"
            aria-label={`Kata kunci magang: ${currentKeyword}. Klik untuk lanjut ke kata berikutnya.`}
          >
            {/* Outgoing Word */}
            {outgoingKeyword && !prefersReducedMotion && (
              <span
                key={`out-${outgoingKeyword}`}
                aria-hidden="true"
                className="absolute left-0 top-0 whitespace-nowrap hero-keyword-out pointer-events-none select-none"
              >
                <span className="inline-block hero-hover-track">
                  {outgoingKeyword}
                </span>
              </span>
            )}

            {/* Incoming / Active Word */}
            <span
              key={`in-${currentKeyword}`}
              className={`relative whitespace-nowrap ${
                isRotating && !prefersReducedMotion ? "hero-keyword-in" : ""
              }`}
            >
              <span className="inline-block hero-hover-track cursor-pointer text-foreground">
                {currentKeyword}
              </span>
            </span>
          </span>
        </span>
      </span>
    </h1>
  );
}
