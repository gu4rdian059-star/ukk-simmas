import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle = "Data real-time",
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "p-5 transition-all duration-200 hover:shadow-md hover:border-border/80",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{title}</p>
          <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight text-foreground">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-[11px] font-medium text-muted-foreground/80 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            iconBg,
            iconColor
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}

