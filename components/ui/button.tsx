import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center border font-medium whitespace-nowrap outline-none select-none transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-transparent hover:bg-primary/90 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground border-transparent hover:bg-destructive/90 shadow-sm",
        outline:
          "border-border bg-background hover:bg-muted text-foreground shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80",
        ghost:
          "border-transparent hover:bg-muted text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline border-transparent p-0",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm rounded-lg gap-2",
        sm: "h-8 px-3 text-xs rounded-md gap-1.5",
        lg: "h-12 px-6 text-base rounded-xl gap-2.5 font-semibold",
        icon: "size-9 rounded-lg p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

