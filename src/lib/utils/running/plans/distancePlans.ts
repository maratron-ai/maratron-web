import { generateRunningPlan, Unit, TrainingLevel } from "./baseRunningPlan";
import type { RunningPlanData } from "@maratypes/runningPlan";

export interface DistancePlanOptions {
  weeks?: number;
  distanceUnit: Unit;
  trainingLevel: TrainingLevel;
  vo2max: number;
  startingWeeklyMileage: number;
  targetPace?: string;
  targetTotalTime?: string;
}

function toDistance(unit: Unit, milesVal: number, kmVal: number): number {
  return unit === "kilometers" ? kmVal : milesVal;
}

export function generate5kPlan(options: DistancePlanOptions): RunningPlanData {
  const {
    weeks = 8,
    distanceUnit,
    trainingLevel,
    vo2max,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  } = options;
  const dist = toDistance(distanceUnit, 3.1, 5);
  return generateRunningPlan(
    weeks,
    dist,
    distanceUnit,
    trainingLevel,
    vo2max,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  );
}

export function generate10kPlan(options: DistancePlanOptions): RunningPlanData {
  const {
    weeks = 10,
    distanceUnit,
    trainingLevel,
    vo2max,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  } = options;
  const dist = toDistance(distanceUnit, 6.2, 10);
  return generateRunningPlan(
    weeks,
    dist,
    distanceUnit,
    trainingLevel,
    vo2max,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  );
}

export function generateHalfMarathonPlan(options: DistancePlanOptions): RunningPlanData {
  const {
    weeks = 12,
    distanceUnit,
    trainingLevel,
    vo2max,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  } = options;
  const dist = toDistance(distanceUnit, 13.1, 21.1);
  return generateRunningPlan(
    weeks,
    dist,
    distanceUnit,
    trainingLevel,
    vo2max,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  );
}

export function generateClassicMarathonPlan(options: DistancePlanOptions): RunningPlanData {
  const {
    weeks = 16,
    distanceUnit,
    trainingLevel,
    vo2max,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  } = options;
  const dist = toDistance(distanceUnit, 26.2, 42.2);
  return generateRunningPlan(
    weeks,
    dist,
    distanceUnit,
    trainingLevel,
    vo2max,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  );
}

export { generateRunningPlan as generateMarathonBasePlan } from "./baseRunningPlan";
