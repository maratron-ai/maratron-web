// @maratypes/runningPlan.ts

import { Pace } from "./run";

// main type
export interface RunningPlan {
  id?: string;
  userId: string;
  planData: RunningPlanData; // Use the renamed type here.
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlannedRun {
  type: "easy" | "tempo" | "interval" | "long" | "marathon";
  unit: "miles" | "kilometers";
  targetPace: Pace;
  mileage: number;
  notes?: string;
}

export interface WeekPlan {
  weekNumber: number;
  weeklyMileage: number;
  unit: "miles" | "kilometers";
  runs: PlannedRun[];
  notes?: string;
}

export interface RunningPlanData {
  weeks: number;
  schedule: WeekPlan[];
  notes?: string;
}
