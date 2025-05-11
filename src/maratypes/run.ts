// @maratypes/run.ts

export interface Run {
  id?: string;
  date: Date; // date and time of run
  duration: string; // Format: HH:MM (or total duration in minutes)
  distance: number;
  distanceUnit: "miles" | "kilometers";
  trainingEnvironment?: "outdoor" | "treadmill" | "indoor" | "mixed";
  pace?: Pace;
  elevationGain?: number;
  elevationGainUnit?: "miles" | "kilometers" | "meters" | "feet";
  notes?: string;
  userId?: string;
}

export interface Pace {
  unit: "miles" | "kilometers";
  pace: string; // e.g., in mm:ss format per unit
}

export type PaceZone = "E" | "M" | "T" | "I" | "R";
