import { generateShortDistancePlan, TrainingLevel } from "../running/plans/shortDistancePlan";

describe("generateShortDistancePlan", () => {
  it("sets final run as race", () => {
    const weeks = 6;
    const plan = generateShortDistancePlan(weeks, 6.2, "miles", TrainingLevel.Beginner, 40);
    const lastWeek = plan.schedule[weeks - 1];
    expect(lastWeek.runs).toHaveLength(1);
    const lastRun = lastWeek.runs[0];
    expect(lastRun.type).toBe("race");
    expect(lastWeek.notes).toBe("5K Week!");
  });

  it("splits easy mileage into multiple runs", () => {
    const plan = generateShortDistancePlan(8, 6.2, "miles", TrainingLevel.Beginner, 40);
    plan.schedule.slice(0, -1).forEach((week) => {
      const easyRuns = week.runs.filter((r) => r.type === "easy");
      expect(easyRuns.length).toBeGreaterThan(1);
    });
  });

  it("labels 10k race week", () => {
    const weeks = 8;
    const plan = generateShortDistancePlan(weeks, 10, "kilometers", TrainingLevel.Beginner, 40);
    const lastWeek = plan.schedule[weeks - 1];
    expect(lastWeek.notes).toBe("10K Week!");
  });

  it("throws for week counts outside 4-16", () => {
    expect(() =>
      generateShortDistancePlan(3, 6.2, "miles", TrainingLevel.Beginner, 40)
    ).toThrow();
    expect(() =>
      generateShortDistancePlan(17, 6.2, "miles", TrainingLevel.Beginner, 40)
    ).toThrow();
  });
});
