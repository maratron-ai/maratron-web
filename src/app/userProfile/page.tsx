"use client";

import type { UserProfile } from '@maratypes/user';
import { useUserStore } from "@store/userStore";
import { useAuth } from "@hooks/useAuth";
import Image from "next/image";
import { useState } from 'react';
import * as Yup from 'yup';
import userProfileSchema from '@lib/schemas/userProfileSchema';
import isYupValidationError from '@lib/utils/validation/isYupValidationError';

const UserProfilePage = () => {
  const { user } = useUserStore();
  const { logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age ?? "",
    gender: user?.gender || "",
    trainingLevel: user?.trainingLevel || "",
    VO2Max: user?.VO2Max ?? "",
    height: user?.height ?? "",
    weight: user?.weight ?? "",
    yearsRunning: user?.yearsRunning ?? "",
    weeklyMileage: user?.weeklyMileage ?? "",
    goals: user?.goals?.join(", ") || "",
    injuryHistory: user?.injuryHistory || "",
    preferredTrainingDays: user?.preferredTrainingDays || "",
    preferredTrainingEnvironment: user?.preferredTrainingEnvironment || "",
    device: user?.device || "",
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  async function handleSave() {
    if (!user) return;
    // clear previous validation errors
    setValidationErrors([]);
    // prepare raw data including id for validation
    const raw = {
      id: user.id,
      ...formData,
      goals: formData.goals.split(',').map((s) => s.trim()),
      age: Number(formData.age),
      VO2Max: Number(formData.VO2Max),
      height: Number(formData.height),
      weight: Number(formData.weight),
      yearsRunning: Number(formData.yearsRunning),
      weeklyMileage: Number(formData.weeklyMileage),
    };
    try {
      // client-side validation
      const validData = await userProfileSchema.validate(raw, {
        abortEarly: false,
        stripUnknown: true,
      });
      const payload = validData as { id: string } & Partial<UserProfile>;
      // persist to backend
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.statusText}`);
      const updated = (await res.json()) as UserProfile;
      useUserStore.getState().setUser(updated);
      setIsEditing(false);
    } catch (err) {
      if (isYupValidationError(err)) {
        // show validation messages
        const messages = err.inner.map((e: Yup.ValidationError) => e.message);
        setValidationErrors(messages);
      } else {
        console.error(err);
        // TODO: surface server errors as needed
      }
    }
  }
  
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Please log in or create a profile to view your information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Logout and Edit Buttons */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Save
          </button>
        )}
      </div>
      {validationErrors.length > 0 && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          <ul className="list-disc list-inside">
            {validationErrors.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Header: Most important info at the top */}
      <div className="flex items-center mb-8">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl || "/default-avatar.png"}
            alt={`${user.name}'s avatar`}
            width={96}
            height={96}
            className="rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mr-4">
            <span className="text-2xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
        )}
        <div className="flex flex-col w-full">
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="text-3xl font-bold border rounded px-2 py-1 mb-1 w-full"
            />
          ) : (
            <h1 className="text-3xl font-bold">
              {user.name || "Unnamed User"}
            </h1>
          )}
          {isEditing ? (
            <input
              type="text"
              value={formData.email}
              onChange={handleChange("email")}
              className="text-gray-500 border rounded px-2 py-1 w-full"
            />
          ) : (
            <p className="text-gray-500">{user.email}</p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Age:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.age}
                onChange={handleChange("age")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">{user.age ?? "N/A"}</span>
            )}
          </div>
          <div>
            <strong>Gender:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.gender}
                onChange={handleChange("gender")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">{user.gender || "N/A"}</span>
            )}
          </div>
          <div>
            <strong>Training Level:</strong>
            {isEditing ? (
              <select
                value={formData.trainingLevel}
                onChange={handleChange("trainingLevel")}
                className="ml-2 border rounded px-2 py-1 w-full"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            ) : (
              <span className="ml-2">{user.trainingLevel || "N/A"}</span>
            )}
          </div>
          <div>
            <strong>VO2 Max:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.VO2Max}
                onChange={handleChange("VO2Max")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">{user.VO2Max ?? "N/A"}</span>
            )}
          </div>
        </div>
      </section>

      {/* Physical Stats */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Physical Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Height:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.height}
                onChange={handleChange("height")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">
                {user.height ? `${user.height} inches` : "N/A"}
              </span>
            )}
          </div>
          <div>
            <strong>Weight:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.weight}
                onChange={handleChange("weight")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">
                {user.weight ? `${user.weight} lbs` : "N/A"}
              </span>
            )}
          </div>
          <div>
            <strong>Years Running:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.yearsRunning}
                onChange={handleChange("yearsRunning")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">{user.yearsRunning ?? "N/A"}</span>
            )}
          </div>
          <div>
            <strong>Weekly Mileage:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.weeklyMileage}
                onChange={handleChange("weeklyMileage")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">
                {user.weeklyMileage ? `${user.weeklyMileage} miles` : "N/A"}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Training & Goals */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Training & Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Goals:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.goals}
                onChange={handleChange("goals")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">
                {user.goals && user.goals.length > 0
                  ? user.goals.join(", ")
                  : "N/A"}
              </span>
            )}
          </div>
          <div>
            <strong>Injury History:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.injuryHistory}
                onChange={handleChange("injuryHistory")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">{user.injuryHistory || "N/A"}</span>
            )}
          </div>
        </div>
      </section>

      {/* Preferences & Device */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preferences & Device</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Preferred Training Days:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.preferredTrainingDays}
                onChange={handleChange("preferredTrainingDays")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">
                {user.preferredTrainingDays || "N/A"}
              </span>
            )}
          </div>
          <div>
            <strong>Preferred Environment:</strong>
            {isEditing ? (
              <select
                value={formData.preferredTrainingEnvironment}
                onChange={handleChange("preferredTrainingEnvironment")}
                className="ml-2 border rounded px-2 py-1 w-full"
              >
                <option value="outdoor">Outdoor</option>
                <option value="treadmill">Treadmill</option>
                <option value="indoor">Indoor</option>
                <option value="mixed">Mixed</option>
              </select>
            ) : (
              <span className="ml-2">
                {user.preferredTrainingEnvironment || "N/A"}
              </span>
            )}
          </div>
          <div>
            <strong>Device:</strong>
            {isEditing ? (
              <input
                type="text"
                value={formData.device}
                onChange={handleChange("device")}
                className="ml-2 border rounded px-2 py-1 w-full"
              />
            ) : (
              <span className="ml-2">{user.device || "N/A"}</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfilePage;
