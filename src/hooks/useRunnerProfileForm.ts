import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import runnerProfileSchema from "@lib/schemas/runnerProfileSchema";
import isYupValidationError from "@lib/utils/validation/isYupValidationError";
import { RunnerProfile } from "@maratypes/runnerProfile";
import { updateRunnerProfile } from "@lib/api/user/user";

export function useRunnerProfileForm(
  initial: RunnerProfile,
  onSuccess: (u: RunnerProfile) => void
) {
  const { update } = useSession();
  const [formData, setFormData] = useState<Partial<RunnerProfile>>(initial);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const toggleEditing = useCallback(() => {
    setValidationErrors([]);
    setIsEditing((f) => !f);
    setFormData(initial);
  }, [initial]);

  const handleChange = useCallback(
    (field: keyof RunnerProfile, value: RunnerProfile[keyof RunnerProfile]) => {
    setFormData((fd) => ({ ...fd, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setValidationErrors([]);
    const raw = { id: initial.id, ...formData };
    try {
      const valid = await runnerProfileSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      });
      const { id, ...payload } = valid as { id: string } & Partial<RunnerProfile>;
      const updated = await updateRunnerProfile(id, payload);
      onSuccess(updated);
      if (update) {
        try {
          await update({ user: { avatarUrl: updated.avatarUrl ?? null } });
        } catch (e) {
          console.error("Failed to refresh session", e);
        }
      }
      setIsEditing(false);
    } catch (err) {
      if (isYupValidationError(err)) {
        setValidationErrors(err.inner.map((e) => e.message));
      } else {
        console.error(err);
      }
    }
  }, [formData, initial, onSuccess, update]);

  return {
    formData,
    isEditing,
    validationErrors,
    toggleEditing,
    handleChange,
    handleSave,
  };
}
