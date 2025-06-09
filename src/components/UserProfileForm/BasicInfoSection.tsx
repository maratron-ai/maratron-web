import { TextField, SelectField } from "@components/ui";
import { UserProfile } from "@maratypes/user";
import styles from "./Section.module.css";
import type { Gender } from "@maratypes/user";
import { uploadAvatar } from "@lib/api/user/user";

// runtime list of gender options
const genderValues: Gender[] = ["Male", "Female", "Other"];

// derive select options for Gender
const genderOptions = genderValues.map((g) => ({
  label: g,
  value: g,
}));

interface Props {
  formData: Partial<UserProfile>;
  isEditing: boolean;
  onChange: (field: keyof UserProfile, value: string) => void;
}

export default function BasicInfoSection({
  formData,
  isEditing,
  onChange,
}: Props) {
  const handleFieldChange = (name: string, value: string) =>
    onChange(name as keyof UserProfile, value);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadAvatar(file);
    onChange("avatarUrl", url);
  };

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Basic Information</h3>
      {isEditing ? (
        <div>
          <div className="flex items-center space-x-4 mb-4">
          <img
            src={formData.avatarUrl || "/Default_pfp.svg"}
            alt="Avatar preview"
            className="w-20 h-20 rounded-full object-cover"
          />
          <TextField
            label="Avatar URL"
            name="avatarUrl"
            value={formData.avatarUrl || ""}
            editing={isEditing}
            onChange={handleFieldChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-4"
          />
        </div>
          <TextField
            label="Name"
            name="name"
            value={formData.name || ""}
            editing={isEditing}
            onChange={handleFieldChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email || ""}
            editing={false}
            onChange={handleFieldChange}
            required
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={formData.age ?? ""}
            editing={isEditing}
            onChange={handleFieldChange}
          />
          <SelectField
            label="Gender"
            name="gender"
            options={genderOptions}
            value={formData.gender || ""}
            editing={isEditing}
            onChange={handleFieldChange}
          />
          <SelectField
            label="Training Level"
            name="trainingLevel"
            options={[
              { label: "Beginner", value: "beginner" },
              { label: "Intermediate", value: "intermediate" },
              { label: "Advanced", value: "advanced" },
            ]}
            value={formData.trainingLevel || "beginner"}
            editing={isEditing}
            onChange={handleFieldChange}
          />
          <TextField
            label="VO₂ Max"
            name="VO2Max"
            type="number"
            value={formData.VO2Max ?? ""}
            editing={isEditing}
            onChange={handleFieldChange}
          />
        </div>
      ) : (
        <dl className={styles.list}>
          <div className="md:col-span-2 flex items-center mb-4">
            <img
              src={formData.avatarUrl || "/Default_pfp.svg"}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <div>
            <dt className={styles.label}>Name</dt>
            <dd className={styles.value}>{formData.name || "N/A"}</dd>
          </div>
          <div>
            <dt className={styles.label}>Email</dt>
            <dd className={styles.value}>{formData.email}</dd>
          </div>
          <div>
            <dt className={styles.label}>Age</dt>
            <dd className={styles.value}>{formData.age ?? "N/A"}</dd>
          </div>
          <div>
            <dt className={styles.label}>Gender</dt>
            <dd className={styles.value}>{formData.gender || "N/A"}</dd>
          </div>
          <div>
            <dt className={styles.label}>Training Level</dt>
            <dd className={`${styles.value} capitalize`}>
              {formData.trainingLevel || "N/A"}
            </dd>
          </div>
          <div>
            <dt className={styles.label}>VO₂ Max</dt>
            <dd className={styles.value}>{formData.VO2Max ?? "N/A"}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
