import { useState, useCallback } from "react";
import userProfileSchema from "@lib/schemas/userProfileSchema";
import isYupValidationError from "@lib/utils/validation/isYupValidationError";
import { UserProfile } from "@maratypes/user";
import { updateUserProfile } from "@lib/api/user/user";

export function useUserProfileForm(
  initial: UserProfile,
  onSuccess: (u: UserProfile) => void
) {
  const [formData, setFormData] = useState<Partial<UserProfile>>(initial);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const toggleEditing = useCallback(() => {
    setValidationErrors([]);
    setIsEditing((f) => !f);
    setFormData(initial);
  }, [initial]);

  const handleChange = useCallback((field: keyof UserProfile, value: UserProfile[keyof UserProfile]) => {
    setFormData((fd) => ({ ...fd, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setValidationErrors([]);
    const raw = { id: initial.id, ...formData };
    try {
      const valid = await userProfileSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      });
      const { id, ...payload } = valid as { id: string } & Partial<UserProfile>;
      const updated = await updateUserProfile(id, payload);
      onSuccess(updated);
      setIsEditing(false);
    } catch (err) {
      if (isYupValidationError(err)) {
        setValidationErrors(err.inner.map((e) => e.message));
      } else {
        console.error(err);
      }
    }
  }, [formData, initial, onSuccess]);

  return {
    formData,
    isEditing,
    validationErrors,
    toggleEditing,
    handleChange,
    handleSave,
  };
}
