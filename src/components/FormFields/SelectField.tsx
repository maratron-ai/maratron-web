import { UserProfile } from "@maratypes/user";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  name: keyof UserProfile;
  options: Option[];
  value: string;
  editing: boolean;
  onChange: (field: keyof UserProfile, value: string) => void;
}

export function SelectField({
  label,
  name,
  options,
  value,
  editing,
  onChange,
}: Props) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      {editing ? (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
        >
          <option value="" disabled hidden>
            Select {label}
          </option>
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
