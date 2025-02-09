import { useState, useEffect } from "react";
import { useUserStore } from "@store/userStore";
import { updateUserProfile } from "@lib/api/user";
import { UserProfile } from "@types/user";

const UserProfileForm = () => {
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    age: undefined,
    gender: undefined,
    trainingLevel: "beginner",
    VO2Max: undefined,
    goals: [],
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load user data into form when user state changes
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  // Handle input changes
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateUserProfile(formData.id, formData);
      setUser(formData); // Update Zustand store
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Profile</h2>

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

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default UserProfileForm;
