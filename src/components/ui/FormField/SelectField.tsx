"use client";

import React from "react";

export interface SelectFieldProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  editing?: boolean;
  onChange: (name: string, value: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  value,
  editing = true,
  onChange,
  className = "",
  ...selectProps
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block font-medium">
        {label}
        {selectProps.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {editing ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-primary"
          {...selectProps}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <p className="mt-1 text-gray-700 dark:text-gray-300">
          {options.find((opt) => opt.value === value)?.label ?? "–"}
        </p>
      )}
    </div>
  );
};

export default SelectField;
