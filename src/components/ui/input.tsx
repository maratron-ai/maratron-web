import * as React from "react";
import { Label } from "@components/ui";

export type InputChangeHandler =
  | ((name: string, value: string) => void)
  | ((e: React.ChangeEvent<HTMLInputElement>) => void);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  name?: string;
  value?: string | number;
  editing?: boolean;
  onChange?: InputChangeHandler;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, name, value, editing = true, onChange, className = "", ...inputProps },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      if (onChange.length > 1) {
        (onChange as (name: string, value: string) => void)(
          name ?? "",
          e.target.value
        );
      } else {
        (onChange as React.ChangeEventHandler<HTMLInputElement>)(e);
      }
    };

    const inputElement = editing ? (
      <input
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        ref={ref}
        className={`form-control ${className}`}
        {...inputProps}
      />
    ) : (
      <p className="mt-1 text-foreground dark:text-foreground">{value}</p>
    );

    return label ? (
      <div className="form-group w-full">
        <Label htmlFor={name}>
          {label}
          {inputProps.required && (
            <span className="text-brand-orange-dark ml-1">*</span>
          )}
        </Label>
        {inputElement}
      </div>
    ) : (
      inputElement
    );
  }
);
Input.displayName = "Input";
