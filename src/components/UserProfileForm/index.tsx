"use client";

import { UserProfile } from "@maratypes/user";
import BasicInfoSection from "./BasicInfoSection";
import PhysicalStatsSection from "./PhysicalStatsSection";
import GoalsSection from "./GoalsSection";
import PreferencesSection from "./PreferencesSection";
import { useUserProfileForm } from "@hooks/useUserProfileForm";

interface Props {
  initialUser: UserProfile;
  onSave: (u: UserProfile) => void;
  /** always show fields in edit mode */
  alwaysEdit?: boolean;
  submitLabel?: string;
}

export default function UserProfileForm({ 
  initialUser, 
  onSave, 
  alwaysEdit = false, 
  submitLabel = "Save Profile"
}: Props) {
  const {
    formData,
    isEditing,
    validationErrors,
    handleChange,
    handleSave,
    toggleEditing,
  } = useUserProfileForm(initialUser, onSave);
  // if alwaysEdit, override hook state
  const editing = alwaysEdit ? true : isEditing;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="bg-background p-6 rounded-lg shadow-lg space-y-6"
    >
      <div className="flex justify-between items-center border-b border-accent pb-4">
        <h2 className="text-3xl font-bold text-foreground">Your Profile</h2>
        {!alwaysEdit && (
          <button
            type="button"
            onClick={toggleEditing}
            className={`px-4 py-2 rounded font-medium text-foreground ${
              editing
                ? "bg-accent hover:bg-accent/80"
                : "bg-primary hover:bg-primary/80"
            }`}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        )}
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-700 bg-opacity-10 text-red-400 rounded">
          <ul className="list-disc list-inside">
            {validationErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <BasicInfoSection
        formData={formData}
        isEditing={editing}
        onChange={handleChange}
      />
      <PhysicalStatsSection
        formData={formData}
        isEditing={editing}
        onChange={handleChange}
      />
      <GoalsSection
        formData={formData}
        isEditing={editing}
        onChange={handleChange}
      />
      <PreferencesSection
        formData={formData}
        isEditing={editing}
        onChange={handleChange}
      />

      {editing && (
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-foreground font-semibold px-6 py-2 rounded transition-colors"
          >
            {submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}
