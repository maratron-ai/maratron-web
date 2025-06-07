// @maratypes/runningPlan.ts

import { Pace } from "./run";
import { DistanceUnit } from "@maratypes/basics";


// main type
export interface RunningPlan {
  id?: string;
  userId: string;
  name: string;
  planData: RunningPlanData; // Use the renamed type here.
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlannedRun {
  type: "easy" | "tempo" | "interval" | "long" | "marathon";
  unit: DistanceUnit;
  targetPace: Pace;
  mileage: number;
  notes?: string;
}

export interface WeekPlan {
  weekNumber: number;
  weeklyMileage: number;
  unit: DistanceUnit;
  runs: PlannedRun[];
  notes?: string;
}

export interface RunningPlanData {
  weeks: number;
  schedule: WeekPlan[];
  notes?: string;
}
