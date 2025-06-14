import { generateLongDistancePlan, Unit, TrainingLevel } from "./longDistancePlan";
import { generateShortDistancePlan } from "./shortDistancePlan";
import type { RunningPlanData } from "@maratypes/runningPlan";

export interface DistancePlanOptions {
  weeks?: number;
  distanceUnit: Unit;
  trainingLevel: TrainingLevel;
  vdot: number;
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
    vdot,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  } = options;
  const dist = toDistance(distanceUnit, 3.1, 5);
  return generateShortDistancePlan(
    weeks,
    dist,
    distanceUnit,
    trainingLevel,
    vdot,
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
    vdot,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  } = options;
  const dist = toDistance(distanceUnit, 6.2, 10);
  return generateShortDistancePlan(
    weeks,
    dist,
    distanceUnit,
    trainingLevel,
    vdot,
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
    vdot,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  } = options;
  const dist = toDistance(distanceUnit, 13.1, 21.1);
  return generateLongDistancePlan(
    weeks,
    dist,
    distanceUnit,
    trainingLevel,
    vdot,
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
    vdot,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  } = options;
  const dist = toDistance(distanceUnit, 26.2, 42.2);
  return generateLongDistancePlan(
    weeks,
    dist,
    distanceUnit,
    trainingLevel,
    vdot,
    startingWeeklyMileage,
    targetPace,
    targetTotalTime,
  );
}

export { generateLongDistancePlan as generateMarathonBasePlan } from "./longDistancePlan";
