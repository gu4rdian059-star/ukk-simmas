"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionDropdownItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "destructive";
  separatorBefore?: boolean;
}

interface ActionDropdownProps {
  items: ActionDropdownItem[];
  ariaLabel?: string;
  className?: string;
  align?: "end" | "start";
}

export function ActionDropdown({
  items,
  ariaLabel = "Menu Aksi",
  className,
  align = "end",
}: ActionDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});
  const [mounted, setMounted] = React.useState(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const approximateMenuHeight = items.length * 36 + 24;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Check if menu should open upwards
    const openUpwards = spaceBelow < approximateMenuHeight && spaceAbove > spaceBelow;

    const newStyle: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999,
      minWidth: "12rem",
    };

    if (align === "end") {
      newStyle.right = Math.max(8, window.innerWidth - rect.right);
    } else {
      newStyle.left = Math.max(8, rect.left);
    }

    if (openUpwards) {
      newStyle.bottom = Math.max(8, window.innerHeight - rect.top + 6);
    } else {
      newStyle.top = Math.min(window.innerHeight - 40, rect.bottom + 6);
    }

    setMenuStyle(newStyle);
  }, [items.length, align]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = (e: Event) => {
      // Don't close if user scrolls inside the menu itself
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          "h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none cursor-pointer",
          isOpen && "bg-muted text-foreground",
          className
        )}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen &&
        mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            onClick={(e) => e.stopPropagation()}
            className="w-48 rounded-2xl border border-border/80 bg-white p-1.5 shadow-xl text-left animate-in fade-in zoom-in-95 duration-100 select-none dark:bg-card"
          >
            {items.map((item, index) => {
              const Icon = item.icon;
              const isDestructive = item.variant === "destructive";

              return (
                <React.Fragment key={index}>
                  {item.separatorBefore && (
                    <div className="border-t border-border/60 my-1" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      item.onClick();
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors text-left cursor-pointer",
                      isDestructive
                        ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                        : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isDestructive ? "text-red-600" : "text-muted-foreground"
                        )}
                      />
                    )}
                    <span>{item.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}
