import * as React from "react";
import { cn } from "@lib/utils/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "form-control flex min-h-[80px] resize-none placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
