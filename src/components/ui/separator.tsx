import * as React from "react";
import { Separator as SeparatorPrimitive } from "@radix-ui/react-separator";
import { cn } from "@lib/utils/cn";

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive>
>(({ className, orientation = "horizontal", decorative = false, ...props }, ref) => (
  <SeparatorPrimitive
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.displayName;
