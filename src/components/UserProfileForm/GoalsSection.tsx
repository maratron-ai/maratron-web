import styles from "./Section.module.css";
import { TextAreaField } from "./FormFields";
import { UserProfile } from "@maratypes/user";

// Generic change handler for exactly matching UserProfile field types
export type ChangeHandler = <K extends keyof UserProfile>(
  field: K,
  value: UserProfile[K]
) => void;

interface Props {
  formData: Partial<UserProfile>;
  isEditing: boolean;
  onChange: ChangeHandler;
}

export default function GoalsSection({ formData, isEditing, onChange }: Props) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>Training & Goals</h3>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextAreaField
            label="Goals (comma-separated)"
            name="goals"
            value={(formData.goals || []).join(", ")}
            editing={isEditing}
            onChange={(field, value: string) =>
              onChange(field, value.split(",").map((s) => s.trim()))
            }
          />
          <TextAreaField
            label="Injury History"
            name="injuryHistory"
            value={formData.injuryHistory || ""}
            editing={isEditing}
            onChange={onChange}
          />
        </div>
      ) : (
        <dl className={styles.list}>
          <div>
            <dt className={styles.label}>Goals</dt>
            <dd className={styles.value}>
              {(formData.goals || []).join(", ") || "N/A"}
            </dd>
          </div>
          <div>
            <dt className={styles.label}>Injury History</dt>
            <dd className={styles.value}>
              {formData.injuryHistory || "N/A"}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
