"use client";

import React, { useState, FormEvent } from "react";
import { Shoe } from "@maratypes/shoe";
import { shoeSchema } from "@lib/schemas/shoeSchema";
import isYupValidationError from "@lib/utils/validation/isYupValidationError";
import { useAuth } from "@hooks/useAuth"; // <<--- add this!

import { Card, Button } from "@components/ui";
import {
  TextField,
  SelectField,
  TextAreaField,
} from "@components/ui/FormField";

import { DistanceUnit } from "@maratypes/basics";

const distanceUnits: DistanceUnit[] = ["miles", "kilometers"];

interface FormData {
  name: string;
  notes?: string;
  distanceUnit: DistanceUnit;
  maxDistance: number;
  currentDistance: number;
  retired: boolean;
}

interface ShoeFormProps {
  onSubmit: (shoe: Shoe) => void;
  initialData?: Partial<FormData>;
}

const initialForm: FormData = {
  name: "",
  notes: "",
  distanceUnit: "miles",
  maxDistance: 500,
  currentDistance: 0,
  retired: false,
};

const ShoeForm: React.FC<ShoeFormProps> = ({ onSubmit, initialData }) => {
  const { user } = useAuth(); // <--- AUTH HOOK HERE!
  const [form, setForm] = useState<FormData>({
    ...initialForm,
    ...initialData,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");

  const handleFieldChange = (
    name: string,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]:
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
      if (!user) throw new Error("You must be logged in to add a shoe.");

      const valid = await shoeSchema.validate(form, {
        abortEarly: false,
        stripUnknown: true,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...rest } = valid; // using spread operator here... look at runForm could explicitly define object

      const shoe: Shoe = {
        ...rest,
        notes: valid.notes || "",
        userId: user.id, // Attach userId here!
      };

      onSubmit(shoe);
      setSuccess("Shoe added successfully!");
      setForm(initialForm);
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
      <h2 className="text-2xl font-semibold mb-4">Add a Shoe</h2>

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
          label="Shoe Name"
          name="name"
          value={form.name}
          onChange={handleFieldChange}
          required
        />

        <TextAreaField
          label="Notes"
          name="notes"
          value={form.notes || ""}
          onChange={handleFieldChange}
          rows={2}
        />

        <SelectField
          label="Distance Unit"
          name="distanceUnit"
          options={distanceUnits.map((u) => ({ value: u, label: u }))}
          value={form.distanceUnit}
          onChange={handleFieldChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Max Distance"
            name="maxDistance"
            type="number"
            min="1"
            value={form.maxDistance}
            onChange={handleFieldChange}
            required
          />
          <TextField
            label="Current Distance"
            name="currentDistance"
            type="number"
            min="0"
            value={form.currentDistance}
            onChange={handleFieldChange}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Add Shoe</Button>
        </div>
      </form>
    </Card>
  );
};

export default ShoeForm;
