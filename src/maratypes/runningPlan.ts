import { Pace } from "./run";

// main type
export interface RunningPlan {
  id?: string;
  userId: string;
  planData: RunningPlanData; // Use the renamed type here.
  createdAt?: Date;
  updatedAt?: Date;
}

// single run
export interface PlannedRun {
  type: "easy" | "tempo" | "interval" | "long";
  targetPace: Pace;
  mileage: number;
}

// week of runs
export interface WeekPlan {
  weekNumber: number;
  runs: PlannedRun[];
}

// data
export interface RunningPlanData {
  weeks: number;
  schedule: WeekPlan[];
}
