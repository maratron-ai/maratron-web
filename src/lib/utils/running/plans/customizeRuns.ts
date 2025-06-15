import { RunningPlanData, PlannedRun } from "@maratypes/runningPlan";

export interface CustomizeOptions {
  runsPerWeek: number;
  includeCrossTraining?: boolean;
}

export function customizePlanRuns(
  plan: RunningPlanData,
  { runsPerWeek, includeCrossTraining = false }: CustomizeOptions,
): RunningPlanData {
  if (runsPerWeek < 3 || runsPerWeek > 5) {
    throw new Error("runsPerWeek must be between 3 and 5");
  }

  const schedule = plan.schedule.map((week, idx) => {
    if (week.runs.length <= 1) return week; // race week

    const easyRuns = week.runs.filter((r) => r.type === "easy");
    const longRun = week.runs.find((r) => r.type === "long" || r.type === "marathon");
    const tempoRun = week.runs.find((r) => r.type === "tempo");
    const intervalRun = week.runs.find((r) => r.type === "interval");

    const runs: PlannedRun[] = [];

    if (easyRuns.length > 0) runs.push(easyRuns[0]);
    if (runsPerWeek >= 4 && easyRuns.length > 1) runs.push(easyRuns[1]);

    const altRun = idx % 2 === 0 ? intervalRun : tempoRun;
    if (altRun) runs.push(altRun);

    if (longRun) runs.push(longRun);

    while (includeCrossTraining && runs.length < runsPerWeek) {
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
