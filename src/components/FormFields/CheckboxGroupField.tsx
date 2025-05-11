/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/components/UserProfileForm/FormFields/CheckboxGroupField.tsx
import React from "react";
import { UserProfile } from "@maratypes/user";

export interface Option<V extends string> {
  label: string;
  value: V;
}

interface Props<U extends string> {
  label: string;
  name: keyof UserProfile;
  options: Option<U>[];
  value: U[];
  editing: boolean;
  onChange: (field: keyof UserProfile, value: U[]) => void;
}

export function CheckboxGroupField<U extends string>({
  label,
  name,
  options,
  value,
  editing,
  onChange,
}: Props<U>) {
  return (
    <div className="mb-4">
      <label className="block font-medium text-gray-200 mb-2">{label}</label>
      {editing ? (
        <div className="flex flex-wrap gap-4">
          {options.map((opt) => (
            <label key={opt.value} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={value.includes(opt.value as U)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? ([...value, opt.value] as U[])
                    : (value.filter((v) => v !== opt.value) as U[]);
                  onChange(name, next);
                }}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-white">{opt.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-white">
          {value.length > 0 ? value.join(", ") : "N/A"}
        </p>
      )}
    </div>
  );
}
