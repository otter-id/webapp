"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const separatorVariants = cva("shrink-0 bg-border", {
  variants: {
    variant: {
      default: "bg-border",
      otter: "bg-yellow-200",
    },
    orientation: {
      horizontal: "h-[1px] w-full",
      vertical: "h-full w-[1px]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "default",
  },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  asChild?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, variant, orientation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(separatorVariants({ variant, orientation, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator, separatorVariants };
