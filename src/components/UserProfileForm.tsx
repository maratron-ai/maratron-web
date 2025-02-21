import { useState, useEffect } from "react";
import { useUserStore } from "@store/userStore";
import { updateUserProfile } from "@lib/api/user";
import { UserProfile } from "@types/user";
import * as Yup from "yup";

// Define a Yup validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  age: Yup.number().min(10, "Age must be at least 10").nullable(),
  gender: Yup.string(),
  trainingLevel: Yup.string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .required("Training level is required"),
  VO2Max: Yup.number().min(10, "VO2Max must be at least 10").nullable(),
  goals: Yup.array().of(Yup.string()),
  avatarUrl: Yup.string().url("Invalid URL").nullable(),
  // New fields
  yearsRunning: Yup.number()
    .min(0, "Years running cannot be negative")
    .nullable(),
  weeklyMileage: Yup.number()
    .min(0, "Weekly mileage cannot be negative")
    .nullable(),
  height: Yup.number().min(0, "Height must be positive").nullable(),
  weight: Yup.number().min(0, "Weight must be positive").nullable(),
  injuryHistory: Yup.string(),
  preferredTrainingDays: Yup.string(),
  preferredTrainingEnvironment: Yup.string()
    .oneOf(["outdoor", "treadmill", "indoor", "mixed"])
    .required("Preferred training environment is required"),
  device: Yup.string(),
});

const UserProfileForm = () => {
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    age: undefined,
    gender: "",
    trainingLevel: "beginner",
    VO2Max: undefined,
    goals: [],
    avatarUrl: "",
    // New fields
    yearsRunning: undefined,
    weeklyMileage: undefined,
    height: undefined,
    weight: undefined,
    injuryHistory: "",
    preferredTrainingDays: "",
    preferredTrainingEnvironment: "outdoor",
    device: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load user data into form when user state changes
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  // Handle standard input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle goals array (comma-separated input)
  const handleGoalsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      goals: e.target.value.split(",").map((goal) => goal.trim()),
    }));
  };

  // Handle form submission with Yup validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setValidationErrors([]);

    try {
      // Validate formData using the schema (will throw if invalid)
      await validationSchema.validate(formData, { abortEarly: false });
      // If valid, update the user profile via your API
      await updateUserProfile(formData.id, formData);
      setUser(formData); // Update Zustand store
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      // If there are validation errors, set them for display
      if (err.inner) {
        const errors = err.inner.map((error: any) => error.message);
        setValidationErrors(errors);
        setMessage("Validation failed. Please check the form.");
      } else {
        setMessage("Failed to update profile.");
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
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
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
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="non-binary">Non-binary</option>
        <option value="other">Other</option>
      </select>

      <label>Training Level:</label>
      <select
        name="trainingLevel"
        value={formData.trainingLevel}
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
        value={formData.goals.join(", ")}
        onChange={handleGoalsChange}
      />

      <label>Avatar URL:</label>
      <input
        type="text"
        name="avatarUrl"
        value={formData.avatarUrl}
        onChange={handleChange}
      />

      {/* Additional Fields */}

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
        value={formData.injuryHistory}
        onChange={handleChange}
      />

      <label>Preferred Training Days (e.g., Mon, Wed, Fri):</label>
      <input
        type="text"
        name="preferredTrainingDays"
        value={formData.preferredTrainingDays}
        onChange={handleChange}
      />

      <label>Preferred Training Environment:</label>
      <select
        name="preferredTrainingEnvironment"
        value={formData.preferredTrainingEnvironment}
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
        value={formData.device}
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
