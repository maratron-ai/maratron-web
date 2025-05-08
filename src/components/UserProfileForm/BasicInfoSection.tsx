import { TextField, SelectField } from "./FormFields";
import { UserProfile } from "@maratypes/user";
import styles from "./Section.module.css";

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
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Basic Information</h3>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Name"
            name="name"
            value={formData.name || ""}
            editing={isEditing}
            onChange={onChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email || ""}
            editing={isEditing}
            onChange={onChange}
            required
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={formData.age ?? ""}
            editing={isEditing}
            onChange={onChange}
          />
          <TextField
            label="Gender"
            name="gender"
            value={formData.gender || ""}
            editing={isEditing}
            onChange={onChange}
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
            onChange={onChange}
          />
          <TextField
            label="VO₂ Max"
            name="VO2Max"
            type="number"
            value={formData.VO2Max ?? ""}
            editing={isEditing}
            onChange={onChange}
          />
        </div>
      ) : (
        <dl className={styles.list}>
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
