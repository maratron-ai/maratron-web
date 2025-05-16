"use client";

import React, { useState, FormEvent } from "react";
import type { Run, Pace } from "@maratypes/run";
import runSchema from "@lib/schemas/runSchema";
import calculatePace from "@lib/utils/running/calculatePace";
import isYupValidationError from "@lib/utils/validation/isYupValidationError";
import { useAuth } from "@hooks/useAuth";

import { Card, Button } from "@components/ui";
import {
  TextField,
  SelectField,
  TextAreaField,
} from "@components/ui/FormField";

import { getLocalDateTime } from "@utils/time/getLocalDateTime";

// Options matching @maratypes/run types
const distanceUnits = ["miles", "kilometers"] as const;
const environments = ["outdoor", "treadmill", "indoor", "mixed"] as const;
const gainUnits = ["miles", "kilometers", "meters", "feet"] as const;

interface FormData {
  date: string;
  hours: number;
  minutes: number;
  distance: number;
  distanceUnit: (typeof distanceUnits)[number];
  trainingEnvironment?: (typeof environments)[number];
  elevationGain?: number;
  elevationGainUnit?: (typeof gainUnits)[number];
  notes?: string;
}

interface RunFormProps {
  onSubmit: (run: Run) => void;
}

const RunForm: React.FC<RunFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const now = getLocalDateTime();

  const initialData: FormData = {
    date: now,
    hours: 0,
    minutes: 0,
    distance: 0,
    distanceUnit: distanceUnits[0],
    trainingEnvironment: undefined,
    elevationGain: undefined,
    elevationGainUnit: undefined,
    notes: "",
  };

  const [form, setForm] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");

  // Generic field updater handles strings and numbers
  const handleFieldChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name as keyof FormData]:
        typeof prev[name as keyof FormData] === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    try {
      // Combine hours/minutes into duration string
      const duration = `${form.hours.toString().padStart(2, "0")}:${form.minutes
        .toString()
        .padStart(2, "0")}:00`;
      const payload = {
        date: form.date,
        duration,
        distance: form.distance,
        distanceUnit: form.distanceUnit,
        trainingEnvironment: form.trainingEnvironment,
        elevationGain: form.elevationGain,
        elevationGainUnit: form.elevationGainUnit,
        notes: form.notes,
      };

      const valid = await runSchema.validate(payload, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (!user) throw new Error("You must be logged in to submit a run.");

      const paceValue = calculatePace(valid.duration, valid.distance);
      const run: Run = {
        date: new Date(valid.date),
        duration: valid.duration,
        distance: valid.distance,
        distanceUnit: valid.distanceUnit,
        trainingEnvironment: valid.trainingEnvironment || undefined,
        elevationGain: valid.elevationGain || undefined,
        elevationGainUnit: valid.elevationGainUnit || undefined,
        notes: valid.notes || undefined,
        pace: { unit: valid.distanceUnit, pace: paceValue } as Pace,
        userId: user.id,
      };

      onSubmit(run);
      setSuccess("Run added successfully!");
      setForm(initialData);
    } catch (err: unknown) {
      if (isYupValidationError(err)) {
        setErrors(err.inner.map((e: Error) => e.message));
      } else if (err instanceof Error) {
        setErrors([err.message]);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  return (
    <Card className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add a Run</h2>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {errors.length > 0 && (
        <div className="space-y-1 mb-4">
          {errors.map((err, i) => (
            <p key={i} className="text-red-600 text-sm">
              {err}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="Date & Time"
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleFieldChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Hours"
            name="hours"
            type="number"
            min="0"
            value={form.hours}
            onChange={handleFieldChange}
            required
          />
          <TextField
            label="Minutes"
            name="minutes"
            type="number"
            min="0"
            max="59"
            value={form.minutes}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Distance"
            name="distance"
            type="number"
            value={form.distance}
            onChange={handleFieldChange}
            required
          />
          <SelectField
            label="Distance Unit"
            name="distanceUnit"
            options={distanceUnits.map((u) => ({ value: u, label: u }))}
            value={form.distanceUnit}
            onChange={handleFieldChange}
            required
          />
        </div>

        <SelectField
          label="Training Environment"
          name="trainingEnvironment"
          options={environments.map((e) => ({ value: e, label: e }))}
          value={form.trainingEnvironment || ""}
          onChange={handleFieldChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Elevation Gain"
            name="elevationGain"
            type="number"
            value={form.elevationGain || 0}
            onChange={handleFieldChange}
          />
          <SelectField
            label="Elevation Gain Unit"
            name="elevationGainUnit"
            options={gainUnits.map((u) => ({ value: u, label: u }))}
            value={form.elevationGainUnit || ""}
            onChange={handleFieldChange}
          />
        </div>

        <TextAreaField
          label="Notes"
          name="notes"
          value={form.notes || ""}
          onChange={handleFieldChange}
          rows={3}
        />

        <div className="flex justify-end">
          <Button type="submit">Add Run</Button>
        </div>
      </form>
    </Card>
  );
};

export default RunForm;
