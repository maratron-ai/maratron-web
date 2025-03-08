"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import * as Yup from "yup";
import { Run, Pace } from "@maratypes/run";
import isYupValidationError from "@lib/utils/validation/isYupValidationError";
import { useAuth } from "../hooks/useAuth"; // adjust the import path as needed
import runSchema from "@lib/schemas/runSchema";
import calculatePace from "@lib/utils/running/calculatePace";

interface RunFormData {
  date: string;
  duration: string; // Format: "HH:MM:SS"
  distance: number;
  distanceUnit: string; // "miles" or "kilometers"
  trainingEnvironment: string;
  elevationGain?: number;
  elevationGainUnit?: string; // Now accepts "miles", "kilometers", "meters", or "feet"
  notes: string;
}

interface RunFormProps {
  onSubmit: (run: Run) => void;
}

const RunForm: React.FC<RunFormProps> = ({ onSubmit }) => {
  const { user } = useAuth(); // Grab the current user
  const defaultDateTime = new Date().toISOString().slice(0, 16);

  const initialFormData: RunFormData = {
    date: defaultDateTime,
    duration: "",
    distance: 0,
    distanceUnit: "",
    trainingEnvironment: "",
    elevationGain: undefined,
    elevationGainUnit: "",
    notes: "",
  };

  const [formData, setFormData] = useState<RunFormData>(initialFormData);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : 0) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setMessage("");

    try {
      const validData = await runSchema.validate(formData, {
        abortEarly: false,
        stripUnknown: true,
      });

      // Ensure a user is logged in before submitting
      if (!user) {
        setErrors(["You must be logged in to submit a run."]);
        return;
      }

      // Calculate pace based on duration (in HH:MM:SS) and distance
      const calculatedPace = calculatePace(
        validData.duration,
        validData.distance
      );

      // Build the final run object, including the current user's ID.
      const run: Run = {
        date: new Date(validData.date),
        duration: validData.duration,
        distance: validData.distance,
        distanceUnit: validData.distanceUnit as "miles" | "kilometers",
        trainingEnvironment: validData.trainingEnvironment || undefined,
        elevationGain: validData.elevationGain ?? undefined,
        // Add the new elevation gain unit if provided
        elevationGainUnit: validData.elevationGainUnit || undefined,
        notes: validData.notes || undefined,
        pace: {
          unit: validData.distanceUnit as "miles" | "kilometers",
          pace: calculatedPace,
        } as Pace,
        // Attach the current user's id to associate the run with a user.
        userId: user.id,
      };

      onSubmit(run);
      setMessage("Run added successfully!");
      setFormData(initialFormData);
    } catch (err: unknown) {
      if (isYupValidationError(err)) {
        setErrors(err.inner.map((e: Yup.ValidationError) => e.message));
      } else if (err instanceof Error) {
        setErrors([err.message]);
      } else {
        setErrors(["An unexpected error occurred"]);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Run</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {errors.length > 0 &&
        errors.map((error, idx) => (
          <p key={idx} style={{ color: "red" }}>
            {error}
          </p>
        ))}

      <label>Date &amp; Time of Run:</label>
      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <label>Duration (HH:MM:SS):</label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        placeholder="HH:MM:SS"
        pattern="^[0-9]{1,2}:[0-5][0-9]:[0-5][0-9]$"
        title="Please enter the duration in HH:MM:SS format (e.g., 01:30:45)."
        required
      />

      <label>Distance:</label>
      <input
        type="number"
        name="distance"
        value={formData.distance || ""}
        onChange={handleChange}
        required
      />

      <label>Distance Unit:</label>
      <select
        name="distanceUnit"
        value={formData.distanceUnit}
        onChange={handleChange}
        required
      >
        <option value="">Select</option>
        <option value="miles">Miles</option>
        <option value="kilometers">Kilometers</option>
      </select>

      <label>Training Environment:</label>
      <select
        name="trainingEnvironment"
        value={formData.trainingEnvironment}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option value="outdoor">Outdoor</option>
        <option value="treadmill">Treadmill</option>
        <option value="indoor">Indoor</option>
        <option value="mixed">Mixed</option>
      </select>

      <label>Elevation Gain:</label>
      <input
        type="number"
        name="elevationGain"
        value={formData.elevationGain || ""}
        onChange={handleChange}
      />

      <label>Elevation Gain Unit:</label>
      <select
        name="elevationGainUnit"
        value={formData.elevationGainUnit || ""}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option value="miles">Miles</option>
        <option value="kilometers">Kilometers</option>
        <option value="meters">Meters</option>
        <option value="feet">Feet</option>
      </select>

      <label>Notes:</label>
      <textarea name="notes" value={formData.notes} onChange={handleChange} />

      <button type="submit">Add Run</button>
    </form>
  );
};

export default RunForm;
