"use client";

import React from "react";

export interface TextAreaFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  name: string;
  value: string;
  editing?: boolean;
  onChange: (name: string, value: string) => void;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  editing = true,
  onChange,
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block font-medium">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {editing ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-primary"
          {...props}
        />
      ) : (
        <p className="mt-1 text-gray-700 dark:text-gray-300">{value ?? "–"}</p>
      )}
    </div>
  );
};

export default TextAreaField;
