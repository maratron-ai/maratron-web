export type { DayOfWeek } from "@maratypes/basics";
import { DayOfWeek } from "@maratypes/basics";
import type { RunningPlanData } from "@maratypes/runningPlan";

function startOfWeekSunday(date: Date): Date {
  const d = new Date(date);
  const diff = d.getDay();
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

const dayIndexMap: Record<DayOfWeek, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export function dayIndex(day: DayOfWeek): number {
  return dayIndexMap[day];
}

export function assignDatesToPlan(
  plan: RunningPlanData,
  opts: { startDate?: string; endDate?: string }
): RunningPlanData {
  const { startDate, endDate } = opts;
  if (!startDate && !endDate) return plan;
  const baseStart = startDate
    ? startOfWeekSunday(new Date(startDate))
    : addWeeks(startOfWeekSunday(new Date(endDate!)), -(plan.weeks - 1));
  const schedule = plan.schedule.map((week, wi) => {
    const weekStart = addWeeks(baseStart, wi);
    const runs = week.runs.map((r) => {
      const idx = r.day ? dayIndex(r.day) : 0;
      const date = addDays(weekStart, idx);
      return { ...r, date: date.toISOString() };
    });
    const done = runs.every((r) => r.done);
    return { ...week, startDate: weekStart.toISOString(), runs, done };
  });
  const end = addWeeks(baseStart, plan.weeks - 1);
  return {
    ...plan,
    schedule,
    startDate: baseStart.toISOString(),
    endDate: end.toISOString(),
  };
}

export function removeDatesFromPlan(plan: RunningPlanData): RunningPlanData {
  const schedule = plan.schedule.map((week) => ({
    ...week,
    startDate: undefined,
    runs: week.runs.map((r) => ({ ...r, date: undefined })),
  }));
  return {
    ...plan,
    schedule,
    startDate: undefined,
    endDate: undefined,
  };
}
