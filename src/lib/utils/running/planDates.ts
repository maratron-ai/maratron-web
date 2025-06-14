export type { DayOfWeek } from "@maratypes/basics";
import { DayOfWeek } from "@maratypes/basics";
import type { RunningPlanData } from "@maratypes/runningPlan";

function parseDateUTC(date: string | Date): Date {
  if (date instanceof Date) return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // treat plain dates as UTC to avoid timezone offsets
  return new Date(date.includes("T") ? date : `${date}T00:00:00Z`);
}

function startOfDayUTC(date: Date): Date {
  const d = parseDateUTC(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = parseDateUTC(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

function startOfWeekSunday(date: Date): Date {
  const d = startOfDayUTC(date);
  const diff = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}

function nextSunday(from: Date = new Date()): Date {
  const base = startOfDayUTC(from);
  const diff = (7 - base.getUTCDay()) % 7;
  base.setUTCDate(base.getUTCDate() + (diff === 0 ? 7 : diff));
  return base;
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
  let baseStart: Date;
  if (startDate) {
    baseStart = startOfDayUTC(parseDateUTC(startDate));
  } else if (endDate) {
    baseStart = addWeeks(startOfDayUTC(parseDateUTC(endDate)), -(plan.weeks - 1));
  } else {
    baseStart = nextSunday();
  }
  const today = startOfDayUTC(new Date());
  if (baseStart < today) baseStart = today;

  const schedule = plan.schedule.map((week, wi) => {
    const weekStart = startOfWeekSunday(addWeeks(baseStart, wi));
    const runs = week.runs.map((r) => {
      let date: Date;
      if (
        endDate &&
        wi === plan.weeks - 1 &&
        (r.type === "race" || r.type === "marathon")
      ) {
        date = startOfDayUTC(parseDateUTC(endDate));
      } else {
        const idx = r.day ? dayIndex(r.day) : 0;
        date = addDays(weekStart, idx);
        if (wi === 0 && date < baseStart) {
          date = baseStart;
        }
      }
      return { ...r, date: date.toISOString() };
    });
    const done = runs.every((r) => r.done);
    return { ...week, startDate: weekStart.toISOString(), runs, done };
  });

  const end = endDate
    ? startOfDayUTC(parseDateUTC(endDate))
    : startOfWeekSunday(addWeeks(baseStart, plan.weeks - 1));

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
