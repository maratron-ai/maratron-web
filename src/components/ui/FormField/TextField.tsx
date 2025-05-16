// src/components/ui/FormField/TextField.tsx
"use client";

import React from "react";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  name: string;
  value: string | number;
  editing?: boolean;
  onChange: (name: string, value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  value,
  editing = true,
  onChange,
  className = "",
  ...inputProps
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block font-medium">
        {label}
        {inputProps.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {editing ? (
        <input
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-primary"
          {...inputProps}
        />
      ) : (
        <p className="mt-1 text-gray-700 dark:text-gray-300">{value ?? "–"}</p>
      )}
    </div>
  );
};

export default TextField;
