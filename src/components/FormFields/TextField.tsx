import { UserProfile } from "@maratypes/user";
interface Props {
  label: string;
  name: keyof UserProfile;
  type?: string;
  value: string | number;
  editing: boolean;
  required?: boolean;
  onChange: (field: keyof UserProfile, value: string) => void;
}

export function TextField({
  label,
  name,
  type = "text",
  value,
  editing,
  required,
  onChange,
}: Props) {
  return (
    <div>
      <label className="block font-medium">
        {label}
        {required && "*"}
      </label>
      {editing ? (
        <input
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
        />
      ) : (
        <p className="mt-1">{value || "N/A"}</p>
      )}
    </div>
  );
}
