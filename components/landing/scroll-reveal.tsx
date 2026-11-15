"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { usePrefersReducedMotion } from "./use-reduced-motion";

interface ScrollRevealContextValue {
  isVisible: boolean;
  prefersReducedMotion: boolean;
}

const ScrollRevealContext = createContext<ScrollRevealContextValue>({
  isVisible: false,
  prefersReducedMotion: false,
});

export function useScrollReveal() {
  return useContext(ScrollRevealContext);
}

interface ScrollRevealSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "footer" | "header" | "main";
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function ScrollRevealSection({
  as: Component = "section",
  threshold = 0.12,
  rootMargin = "0px 0px -40px 0px",
  triggerOnce = true,
  className,
  children,
  ...props
}: ScrollRevealSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const node = sectionRef.current;
    if (!node) return;

    // Use IntersectionObserver to detect when section enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, prefersReducedMotion]);

  const value = useMemo(
    () => ({ isVisible: isVisible || prefersReducedMotion, prefersReducedMotion }),
    [isVisible, prefersReducedMotion]
  );

  return (
    <ScrollRevealContext.Provider value={value}>
      <Component
        ref={sectionRef as unknown as React.Ref<HTMLDivElement>}
        className={className}
        {...props}
      >
        {children}
      </Component>
    </ScrollRevealContext.Provider>
  );
}

interface ScrollRevealItemProps extends React.HTMLAttributes<HTMLElement> {
  delay?: number; // ms, default: 0
  duration?: number; // ms, default: 650
  yOffset?: number; // px, default: 36
  scaleFrom?: number; // default: 0.97
  as?: "div" | "span" | "li" | "p" | "h1" | "h2" | "h3" | "h4" | "article";
}

export function ScrollRevealItem({
  delay = 0,
  duration = 650,
  yOffset = 36,
  scaleFrom = 0.97,
  as: Component = "div",
  className,
  style,
  children,
  ...props
}: ScrollRevealItemProps) {
  const { isVisible, prefersReducedMotion } = useScrollReveal();

  const isRevealed = isVisible || prefersReducedMotion;

  const animationStyle: React.CSSProperties = prefersReducedMotion
    ? {
        opacity: 1,
        transform: "none",
        ...style,
      }
    : {
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed
          ? "translate3d(0, 0, 0) scale3d(1, 1, 1)"
          : `translate3d(0, ${yOffset}px, 0) scale3d(${scaleFrom}, ${scaleFrom}, 1)`,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: isRevealed ? `${delay}ms` : "0ms",
        willChange: isRevealed ? "auto" : "opacity, transform",
        ...style,
      };

  return (
    <Component
      className={className}
      style={animationStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
