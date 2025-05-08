import { TextField, SelectField } from "./FormFields";
import { UserProfile } from "@maratypes/user";
import { ChangeHandler } from "./GoalsSection";
import styles from "./Section.module.css";

interface Props {
  formData: Partial<UserProfile>;
  isEditing: boolean;
  onChange: ChangeHandler;
}

export default function PreferencesSection({
  formData,
  isEditing,
  onChange,
}: Props) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Preferences & Device</h3>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Preferred Training Days"
            name="preferredTrainingDays"
            value={formData.preferredTrainingDays || ""}
            editing={isEditing}
            onChange={onChange}
          />
          <SelectField
            label="Environment"
            name="preferredTrainingEnvironment"
            options={[
              { label: "Outdoor", value: "outdoor" },
              { label: "Treadmill", value: "treadmill" },
              { label: "Indoor", value: "indoor" },
              { label: "Mixed", value: "mixed" },
            ]}
            value={formData.preferredTrainingEnvironment || "outdoor"}
            editing={isEditing}
            onChange={onChange}
          />
          <TextField
            label="Device"
            name="device"
            value={formData.device || ""}
            editing={isEditing}
            onChange={onChange}
          />
        </div>
      ) : (
        <dl className={styles.list}>
          <div>
            <dt className={styles.label}>Preferred Training Days</dt>
            <dd className={styles.value}>
              {formData.preferredTrainingDays || "N/A"}
            </dd>
          </div>
          <div>
            <dt className={styles.label}>Environment</dt>
            <dd className={styles.value}>
              {formData.preferredTrainingEnvironment || "N/A"}
            </dd>
          </div>
          <div>
            <dt className={styles.label}>Device</dt>
            <dd className={styles.value}>
              {formData.device || "N/A"}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
