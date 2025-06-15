import { RunningPlanData, PlannedRun } from "@maratypes/runningPlan";

export interface CustomizeOptions {
  runsPerWeek: number;
  crossTrainingDays?: number;
}

export function customizePlanRuns(
  plan: RunningPlanData,
  { runsPerWeek, crossTrainingDays = 0 }: CustomizeOptions,
): RunningPlanData {
  if (runsPerWeek < 3 || runsPerWeek > 5) {
    throw new Error("runsPerWeek must be between 3 and 5");
  }

  if (crossTrainingDays < 0) {
    throw new Error("crossTrainingDays cannot be negative");
  }

  if (runsPerWeek + crossTrainingDays > 7) {
    throw new Error("Total workout days cannot exceed 7 per week");
  }

  const schedule = plan.schedule.map((week, idx) => {
    if (week.runs.length <= 1) {
      const runs = [...week.runs];
      for (let i = 0; i < crossTrainingDays; i++) {
        runs.splice(runs.length - 1, 0, {
          type: "cross",
          unit: week.unit,
          mileage: 0,
          targetPace: { unit: week.unit, pace: "" },
          notes: "Cross training",
        });
      }
      return { ...week, runs };
    }

    const easyRuns = week.runs.filter((r) => r.type === "easy");
    const longRun = week.runs.find((r) => r.type === "long" || r.type === "marathon");
    const tempoRun = week.runs.find((r) => r.type === "tempo");
    const intervalRun = week.runs.find((r) => r.type === "interval");

    const runs: PlannedRun[] = [];

    if (easyRuns.length > 0) runs.push(easyRuns[0]);
    if (runsPerWeek >= 4) {
      if (easyRuns.length > 1) {
        runs.push(easyRuns[1]);
      } else if (easyRuns.length === 1) {
        runs.push({ ...easyRuns[0] });
      }
    }

    if (runsPerWeek === 5) {
      if (tempoRun) runs.push(tempoRun);
      if (intervalRun) runs.push(intervalRun);
    } else {
      const altRun = idx % 2 === 0 ? intervalRun : tempoRun;
      if (altRun) runs.push(altRun);
    }

    if (longRun) runs.push(longRun);

    for (let i = 0; i < crossTrainingDays; i++) {
      runs.splice(runs.length - 1, 0, {
        type: "cross",
        unit: week.unit,
        mileage: 0,
        targetPace: { unit: week.unit, pace: "" },
        notes: "Cross training",
      });
    }

    const weeklyMileage = runs.reduce((tot, r) => tot + (r.mileage || 0), 0);

    return { ...week, runs, weeklyMileage };
  });

  return { ...plan, schedule };
}
