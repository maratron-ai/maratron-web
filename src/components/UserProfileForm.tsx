import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useUserStore } from "@store/userStore";
import { updateUserProfile, createUserProfile } from "@lib/api/user/user";
import { UserProfile } from "@maratypes/user";
import * as Yup from "yup";
import userProfileSchema from "@lib/schemas/userProfileSchema";
import isYupValidationError from "@utils/isYupValidationError";

const initialFormData: UserProfile = {
  id: "",
  name: "",
  email: "",
  age: undefined,
  gender: "",
  trainingLevel: "beginner",
  VO2Max: undefined,
  goals: [],
  avatarUrl: undefined,
  yearsRunning: undefined,
  weeklyMileage: undefined,
  height: undefined,
  weight: undefined,
  injuryHistory: undefined,
  preferredTrainingDays: undefined,
  preferredTrainingEnvironment: undefined,
  device: undefined,
};

const UserProfileForm = () => {
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState<UserProfile>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleGoalsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      goals: e.target.value.split(",").map((goal) => goal.trim()),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setValidationErrors([]);

    try {
      // Validate and transform the data using Yup
      const validData = await userProfileSchema.validate(formData, {
        abortEarly: false,
        stripUnknown: true,
      });

      // Final normalization: convert any remaining nulls to undefined,
      // and ensure the goals array contains only strings.
      const cleanData = {
        ...validData,
        age: validData.age === null ? undefined : validData.age,
        VO2Max: validData.VO2Max === null ? undefined : validData.VO2Max,
        yearsRunning:
          validData.yearsRunning === null ? undefined : validData.yearsRunning,
        weeklyMileage:
          validData.weeklyMileage === null
            ? undefined
            : validData.weeklyMileage,
        height: validData.height === null ? undefined : validData.height,
        weight: validData.weight === null ? undefined : validData.weight,
        avatarUrl:
          validData.avatarUrl === null ? undefined : validData.avatarUrl,
        // Filter goals to ensure they are strings
        goals: (validData.goals ?? []).filter(
          (goal): goal is string => goal !== undefined
        ),
      };

      let returnedUser: UserProfile;
      const { id, ...payload } = cleanData;

      if (!id) {
        returnedUser = await createUserProfile(payload);
        setMessage("User created successfully!");
      } else {
        returnedUser = await updateUserProfile(id, payload);
        setMessage("Profile updated successfully!");
      }
      setUser(returnedUser);
    } catch (err: unknown) {
      if (isYupValidationError(err)) {
        const errors = err.inner.map((e: Yup.ValidationError) => e.message);
        setValidationErrors(errors);
        setMessage("Validation failed. Please check the form.");
      } else if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setMessage(
            "A user with this email already exists. Please use a different email or update your profile."
          );
        } else {
          setMessage("Failed to save profile: " + err.message);
        }
      } else if (err instanceof Error) {
        setMessage("Failed to save profile: " + err.message);
      } else {
        setMessage("Failed to save profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Profile</h2>

      {validationErrors.length > 0 && (
        <div className="error-messages">
          {validationErrors.map((err, index) => (
            <p key={index} style={{ color: "red" }}>
              {err}
            </p>
          ))}
        </div>
      )}

      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={formData.name ?? ""}
        onChange={handleChange}
        required
      />

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email ?? ""}
        onChange={handleChange}
        required
      />

      <label>Age:</label>
      <input
        type="number"
        name="age"
        value={formData.age ?? ""}
        onChange={handleChange}
      />

      <label>Gender:</label>
      <select
        name="gender"
        value={formData.gender ?? ""}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="non-binary">Non-binary</option>
        <option value="other">Other</option>
      </select>

      <label>Training Level:</label>
      <select
        name="trainingLevel"
        value={formData.trainingLevel ?? ""}
        onChange={handleChange}
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <label>VO2 Max:</label>
      <input
        type="number"
        name="VO2Max"
        value={formData.VO2Max ?? ""}
        onChange={handleChange}
      />

      <label>Goals (comma-separated):</label>
      <textarea
        name="goals"
        value={formData.goals.join(", ") ?? ""}
        onChange={handleGoalsChange}
      />

      <label>Avatar URL:</label>
      <input
        type="text"
        name="avatarUrl"
        value={formData.avatarUrl ?? ""}
        onChange={handleChange}
      />

      <label>Years Running:</label>
      <input
        type="number"
        name="yearsRunning"
        value={formData.yearsRunning ?? ""}
        onChange={handleChange}
      />

      <label>Weekly Mileage (miles):</label>
      <input
        type="number"
        name="weeklyMileage"
        value={formData.weeklyMileage ?? ""}
        onChange={handleChange}
      />

      <label>Height (inches):</label>
      <input
        type="number"
        name="height"
        value={formData.height ?? ""}
        onChange={handleChange}
      />

      <label>Weight (lbs):</label>
      <input
        type="number"
        name="weight"
        value={formData.weight ?? ""}
        onChange={handleChange}
      />

      <label>Injury History:</label>
      <textarea
        name="injuryHistory"
        value={formData.injuryHistory ?? ""}
        onChange={handleChange}
      />

      <label>Preferred Training Days (e.g., Mon, Wed, Fri):</label>
      <input
        type="text"
        name="preferredTrainingDays"
        value={formData.preferredTrainingDays ?? ""}
        onChange={handleChange}
      />

      <label>Preferred Training Environment:</label>
      <select
        name="preferredTrainingEnvironment"
        value={formData.preferredTrainingEnvironment ?? ""}
        onChange={handleChange}
      >
        <option value="outdoor">Outdoor</option>
        <option value="treadmill">Treadmill</option>
        <option value="indoor">Indoor</option>
        <option value="mixed">Mixed</option>
      </select>

      <label>Device (e.g., Garmin, Apple Watch):</label>
      <input
        type="text"
        name="device"
        value={formData.device ?? ""}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default UserProfileForm;
