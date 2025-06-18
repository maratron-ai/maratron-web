"use client";

import { useState } from "react";
import { Button, Input, Label } from "@components/ui";
import { SelectField } from "@components/ui/FormField";
import { calculateVDOTJackDaniels } from "@utils/running/jackDaniels";
import { parseDuration } from "@utils/time";
import { updateUser } from "@lib/api/user/user";

interface Props {
  userId: string;
  onComplete?: () => void;
}

export default function VDOTEstimator({ userId, onComplete }: Props) {
  const [distance, setDistance] = useState<"5k" | "10k">("5k");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const seconds = parseDuration(time);
    if (!seconds) {
      setError("Please enter time as mm:ss or hh:mm:ss");
      return;
    }
    setSaving(true);
    try {
      const meters = distance === "5k" ? 5000 : 10000;
      const vdot = Math.round(calculateVDOTJackDaniels(meters, seconds));
      await updateUser(userId, { VDOT: vdot });
      if (onComplete) onComplete();
    } catch (err) {
      console.error(err);
      setError("Failed to save VDOT");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <Label htmlFor="distance">Race Distance</Label>
        <SelectField
          name="distance"
          label=""
          value={distance}
          onChange={(_, value) => setDistance(value as "5k" | "10k")}
          options={[
            { value: "5k", label: "5K" },
            { value: "10k", label: "10K" },
          ]}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <Label htmlFor="time">Race Time (mm:ss or hh:mm:ss)</Label>
        <Input
          id="time"
          value={time}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
          placeholder="30:00"
        />
      </div>
      {error && <p className="text-brand-orange-dark">{error}</p>}
      <Button
        type="submit"
        disabled={saving}
        className="btn-link"
      >
        {saving ? "Saving..." : "Save VDOT"}
      </Button>
    </form>
  );
}
