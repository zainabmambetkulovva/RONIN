import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ronin-neon disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-ronin-neon text-white hover:bg-ronin-neon-bright shadow-neon hover:shadow-lg",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 shadow-sm",
        outline:
          "border border-ronin-neon/40 bg-transparent text-ronin-neon hover:bg-ronin-neon/10 hover:border-ronin-neon",
        secondary:
          "bg-ronin-purple-mid text-white hover:bg-ronin-purple-light",
        ghost:
          "hover:bg-ronin-purple/20 text-gray-300 hover:text-white",
        link:
          "text-ronin-neon underline-offset-4 hover:underline",
        neon:
          "relative overflow-hidden bg-transparent border border-ronin-neon/60 text-ronin-neon hover:border-ronin-neon hover:shadow-neon transition-all",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
