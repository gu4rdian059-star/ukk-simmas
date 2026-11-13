import React from "react";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  title?: string;
  subtitle?: string;
  showText?: boolean;
  textSize?: string;
}

export function Logo({
  className,
  iconClassName,
  title = "vernoncorp",
  subtitle,
  showText = true,
  textSize = "text-sm",
}: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
        <GraduationCap className={cn("h-5 w-5", iconClassName)} />
      </div>
      {showText && (
        <div className="flex flex-col min-w-0">
          <span
            className={cn(
              "font-bold tracking-tight text-foreground whitespace-nowrap leading-tight",
              textSize
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/80 leading-tight mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

