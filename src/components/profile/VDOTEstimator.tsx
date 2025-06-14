"use client";

import { useState } from "react";
import { Button, Input, Label } from "@components/ui";
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
      <div className="space-y-1">
        <Label htmlFor="distance">Race Distance</Label>
        <select
          id="distance"
          value={distance}
          onChange={(e) => setDistance(e.target.value as "5k" | "10k")}
          className="w-full border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-primary"
        >
          <option value="5k">5K</option>
          <option value="10k">10K</option>
        </select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="time">Race Time (mm:ss or hh:mm:ss)</Label>
        <Input
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="20:00"
        />
      </div>
      {error && <p className="text-brand-orange-dark">{error}</p>}
      <Button
        type="submit"
        disabled={saving}
        className="w-full bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white border-0 hover:from-[var(--brand-from)]/90 hover:to-[var(--brand-to)]/90"
      >
        {saving ? "Saving..." : "Save VDOT"}
      </Button>
    </form>
  );
}
