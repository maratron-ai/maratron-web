import { SelectField } from "./FormFields";
import { CheckboxGroupField } from "./FormFields/CheckboxGroupField";
import { UserProfile } from "@maratypes/user";
import { ChangeHandler } from "./GoalsSection";
import styles from "./Section.module.css";
import type { DayOfWeek } from "@maratypes/user";
import type { Device } from "@maratypes/user";

// derive select options for Device
const deviceValues: Device[] = [
  "Garmin",
  "Polar",
  "Suunto",
  "Fitbit",
  "Apple Watch",
  "Samsung Galaxy Watch",
  "Coros",
  "Other",
];
const deviceOptions = deviceValues.map((d) => ({ label: d, value: d }));

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
          <CheckboxGroupField<DayOfWeek>
            label="Preferred Training Days"
            name="preferredTrainingDays"
            options={[
              { label: "Monday", value: "Monday" },
              { label: "Tuesday", value: "Tuesday" },
              { label: "Wednesday", value: "Wednesday" },
              { label: "Thursday", value: "Thursday" },
              { label: "Friday", value: "Friday" },
              { label: "Saturday", value: "Saturday" },
              { label: "Sunday", value: "Sunday" },
            ]}
            value={formData.preferredTrainingDays || []}
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
            value={formData.preferredTrainingEnvironment || ""}
            editing={isEditing}
            onChange={onChange}
          />
          <SelectField
            label="Device"
            name="device"
            options={deviceOptions}
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
              {(Array.isArray(formData.preferredTrainingDays) ? formData.preferredTrainingDays.join(", ") : "N/A")}
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
