interface Props {
  label: string;
  name: string;
  value: string;
  editing: boolean;
  onChange: (field: string, value: string) => void;
}

export function TextAreaField({
  label,
  name,
  value,
  editing,
  onChange,
}: Props) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      {editing ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
          rows={3}
        />
      ) : (
        <p className="mt-1">{value || "N/A"}</p>
      )}
    </div>
  );
}
