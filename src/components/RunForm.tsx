"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import * as Yup from "yup";
import { Run, Pace } from "@maratypes/run";
import isYupValidationError from "@lib/utils/validation/isYupValidationError";
import runSchema from "@lib/schemas/runSchema";
import calculatePace from "@lib/utils/running/calculatePace";
import { useAuth } from "../hooks/useAuth";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface RunFormData {
  date: string;
  duration: string;
  distance: number;
  distanceUnit: "miles" | "kilometers";
  trainingEnvironment?: string;
  elevationGain?: number;
  elevationGainUnit?: "miles" | "kilometers" | "meters" | "feet";
  notes?: string;
}

interface RunFormProps {
  onSubmit: (run: Run) => void;
}

export const RunForm: React.FC<RunFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const defaultDateTime = new Date().toISOString().slice(0, 16);

  const initial: RunFormData = {
    date: defaultDateTime,
    duration: "",
    distance: 0,
    distanceUnit: "miles",
    trainingEnvironment: undefined,
    elevationGain: undefined,
    elevationGainUnit: undefined,
    notes: undefined,
  };

  const [form, setForm] = useState<RunFormData>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    try {
      const valid = await runSchema.validate(form as any, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (!user) throw new Error("Please log in to add a run.");

      const paceValue = calculatePace(valid.duration, valid.distance);
      const run: Run = {
        date: new Date(valid.date),
        duration: valid.duration,
        distance: valid.distance,
        distanceUnit: valid.distanceUnit,
        trainingEnvironment: valid.trainingEnvironment,
        elevationGain: valid.elevationGain,
        elevationGainUnit: valid.elevationGainUnit,
        notes: valid.notes,
        pace: { unit: valid.distanceUnit, pace: paceValue } as Pace,
        userId: user.id,
      };

      onSubmit(run);
      setSuccess("Run added successfully!");
      setForm(initial);
    } catch (err) {
      if (isYupValidationError(err)) {
        setErrors(err.inner.map((e) => e.message));
      } else if (err instanceof Error) {
        setErrors([err.message]);
      } else {
        setErrors(["An unknown error occurred."]);
      }
    }
  };

  return (
    <Card className="max-w-lg mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-xl">Add a Run</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && <p className="text-green-600">{success}</p>}
          {errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((err, i) => (
                <p key={i} className="text-red-600 text-sm">
                  {err}
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="date">Date &amp; Time</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                type="text"
                placeholder="HH:MM:SS"
                pattern="^[0-9]{1,2}:[0-5][0-9]:[0-5][0-9]$"
                title="Format hh:mm:ss"
                value={form.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                name="distance"
                type="number"
                value={form.distance || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="distanceUnit">Unit</Label>
              <Select
                id="distanceUnit"
                name="distanceUnit"
                value={form.distanceUnit}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, distanceUnit: val as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Miles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="miles">Miles</SelectItem>
                  <SelectItem value="kilometers">Kilometers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trainingEnvironment">Environment</Label>
              <Select
                id="trainingEnvironment"
                name="trainingEnvironment"
                value={form.trainingEnvironment || ""}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, trainingEnvironment: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="treadmill">Treadmill</SelectItem>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="elevationGain">Elevation Gain</Label>
              <Input
                id="elevationGain"
                name="elevationGain"
                type="number"
                value={form.elevationGain || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="elevationGainUnit">Gain Unit</Label>
              <Select
                id="elevationGainUnit"
                name="elevationGainUnit"
                value={form.elevationGainUnit || ""}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    elevationGainUnit: val as any,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="feet">Feet</SelectItem>
                  <SelectItem value="miles">Miles</SelectItem>
                  <SelectItem value="kilometers">Kilometers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes || ""}
              onChange={handleChange}
            />
          </div>

          <CardFooter className="flex justify-end">
            <Button type="submit">Add Run</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default RunForm;
