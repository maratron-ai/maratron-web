import * as React from "react";
import { cn } from "@lib/utils/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-md",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
