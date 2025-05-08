import { UserProfile } from "@maratypes/user";

export interface Option<V extends string = string> {
  label: string;
  value: V;
}

interface Props<V extends string = string> {
  label: string;
  name: keyof UserProfile;
  options: Option<V>[];
  value: V;
  editing: boolean;
  onChange: (field: keyof UserProfile, value: string) => void;
}

export function SelectField<V extends string = string>({
  label,
  name,
  options,
  value,
  editing,
  onChange,
}: Props<V>) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      {editing ? (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value as V)}
          className="mt-1 w-full border rounded px-2 py-1"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <p className="mt-1">
          {options.find((o) => o.value === value)?.label || "N/A"}
        </p>
      )}
    </div>
  );
}
