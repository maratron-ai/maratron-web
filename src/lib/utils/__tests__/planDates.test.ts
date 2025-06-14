import { assignDatesToPlan, removeDatesFromPlan } from "../running/planDates";
import { RunningPlanData } from "@maratypes/runningPlan";

describe("assignDatesToPlan", () => {
  it("assigns week and run dates from start date", () => {
    const data: RunningPlanData = {
      weeks: 2,
      schedule: [
        { weekNumber: 1, weeklyMileage: 10, unit: "miles", runs: [{ type: "easy", unit: "miles", targetPace: { unit: "miles", pace: "10:00" }, mileage: 5, day: "Monday" }] },
        { weekNumber: 2, weeklyMileage: 10, unit: "miles", runs: [{ type: "easy", unit: "miles", targetPace: { unit: "miles", pace: "10:00" }, mileage: 5, day: "Monday" }] },
      ],
    };
    const future = new Date();
    const daysToMonday = (8 - future.getUTCDay()) % 7; // next Monday
    future.setUTCDate(future.getUTCDate() + daysToMonday);
    const str = future.toISOString().slice(0, 10);
    const result = assignDatesToPlan(data, { startDate: str });
    const start = new Date(str);
    const startOfWeek = new Date(start);
    startOfWeek.setUTCDate(start.getUTCDate() - start.getUTCDay());
    expect(result.schedule[0].startDate).toBe(startOfWeek.toISOString());
    expect(result.schedule[0].runs[0].date).toBe(`${str}T00:00:00.000Z`);
  });

  it("prevents past start dates", () => {
    const data: RunningPlanData = {
      weeks: 1,
      schedule: [
        {
          weekNumber: 1,
          weeklyMileage: 10,
          unit: "miles",
          runs: [
            { type: "easy", unit: "miles", targetPace: { unit: "miles", pace: "10:00" }, mileage: 5, day: "Monday" },
          ],
        },
      ],
    };
    const past = new Date();
    past.setDate(past.getDate() - 30);
    const result = assignDatesToPlan(data, { startDate: past.toISOString().slice(0,10) });
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).toISOString();
    expect(result.startDate).toBe(todayUTC);
  });

  it("defaults to next Sunday when no dates given", () => {
    const data: RunningPlanData = {
      weeks: 1,
      schedule: [
        {
          weekNumber: 1,
          weeklyMileage: 10,
          unit: "miles",
          runs: [
            {
              type: "easy",
              unit: "miles",
              targetPace: { unit: "miles", pace: "10:00" },
              mileage: 5,
              day: "Monday",
            },
          ],
        },
      ],
    };
    const result = assignDatesToPlan(data, {});
    const today = new Date();
    const base = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const diff = (7 - base.getUTCDay()) % 7;
    base.setUTCDate(base.getUTCDate() + (diff === 0 ? 7 : diff));
    expect(result.startDate).toBe(base.toISOString());
  });

  it("clears all dates from the plan", () => {
    const data: RunningPlanData = {
      weeks: 1,
      schedule: [
        {
          weekNumber: 1,
          weeklyMileage: 10,
          unit: "miles",
          runs: [
            {
              type: "easy",
              unit: "miles",
              targetPace: { unit: "miles", pace: "10:00" },
              mileage: 5,
              day: "Monday",
              date: "2024-07-01T00:00:00.000Z",
              done: false,
            },
          ],
          startDate: "2024-06-30T00:00:00.000Z",
          done: false,
        },
      ],
      startDate: "2024-06-30T00:00:00.000Z",
      endDate: "2024-06-30T00:00:00.000Z",
    };
    const result = removeDatesFromPlan(data);
    expect(result.startDate).toBeUndefined();
    expect(result.schedule[0].startDate).toBeUndefined();
    expect(result.schedule[0].runs[0].date).toBeUndefined();
  });
});
