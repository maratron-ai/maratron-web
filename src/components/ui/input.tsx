import * as React from "react";
import { Label } from "@components/ui";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label: string;
  name: string;
  value: string | number | undefined;
  editing?: boolean;
  onChange: (name: string, value: string) => void;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, value, editing = true, onChange, className = "", ...inputProps }, ref) => {
    return (
      <div className="space-y-1 w-full">
        <Label htmlFor={name} className="block font-medium">
          {label}
          {inputProps.required && (
            <span className="text-brand-orange-dark ml-1">*</span>
          )}
        </Label>

        {editing ? (
          <input
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            ref={ref}
            className={`mt-1 h-10 w-full rounded-md border border-accent-2 bg-accent-2 opacity-80 px-2 py-1 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-accent-2 focus:ring-offset-2 ${className}`}
            {...inputProps}
          />
        ) : (
          <p className="mt-1 text-foreground dark:text-foreground">{value}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
