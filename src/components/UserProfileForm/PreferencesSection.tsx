import { TextField, SelectField } from "./FormFields";
import { UserProfile } from "@maratypes/user";
import { ChangeHandler } from "./GoalsSection";
import styles from "./Section.module.css";
import {DayOfWeek} from "@maratypes/user";

interface Props {
  formData: Partial<UserProfile & { preferredTrainingDays?: DayOfWeek[] }>;
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
          {/* Preferred Training Days */}
          <div className="col-span-full flex flex-wrap gap-4">
            {([
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ] as DayOfWeek[]).map((day) => (
              <label key={day} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={Array.isArray(formData.preferredTrainingDays) ? formData.preferredTrainingDays.includes(day) : false}
                  onChange={(e) => {
                    const current = Array.isArray(formData.preferredTrainingDays)
                      ? [...formData.preferredTrainingDays]
                      : [];
                    if (e.target.checked) {
                      current.push(day);
                    } else {
                      const idx = current.indexOf(day);
                      if (idx > -1) current.splice(idx, 1);
                    }
                    onChange("preferredTrainingDays", current);
                  }}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-white">{day}</span>
              </label>
            ))}
          </div>
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
