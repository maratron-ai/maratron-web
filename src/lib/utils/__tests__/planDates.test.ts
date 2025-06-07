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
    const result = assignDatesToPlan(data, { startDate: "2024-06-30" });
    expect(result.schedule[0].startDate).toBe("2024-06-30T00:00:00.000Z");
    expect(result.schedule[0].runs[0].date).toBe("2024-07-01T00:00:00.000Z");
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
