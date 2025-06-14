import { generateShortDistancePlan, TrainingLevel } from "../running/plans/shortDistancePlan";

describe("generateShortDistancePlan", () => {
  it("sets final run as race", () => {
    const weeks = 6;
    const plan = generateShortDistancePlan(weeks, 6.2, "miles", TrainingLevel.Beginner, 40);
    const lastWeek = plan.schedule[weeks - 1];
    const lastRun = lastWeek.runs[lastWeek.runs.length - 1];
    expect(lastRun.type).toBe("race");
  });

  it("splits easy mileage into multiple runs", () => {
    const plan = generateShortDistancePlan(8, 6.2, "miles", TrainingLevel.Beginner, 40);
    plan.schedule.forEach((week) => {
      const easyRuns = week.runs.filter((r) => r.type === "easy");
      expect(easyRuns.length).toBeGreaterThan(1);
    });
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
