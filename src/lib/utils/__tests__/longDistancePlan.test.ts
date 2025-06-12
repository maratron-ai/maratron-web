import { generateLongDistancePlan, TrainingLevel } from "../running/plans/longDistancePlan";

describe("generateLongDistancePlan cutback weeks", () => {
  it("inserts cutback mileage every 4th week", () => {
    const plan = generateLongDistancePlan(
      12,
      13.1,
      "miles",
      TrainingLevel.Beginner,
      40,
      13.1
    );
    const week4 = plan.schedule[3];
    const week5 = plan.schedule[4];
    expect(week4.notes).toContain("Cutback");
    expect(week4.weeklyMileage).toBeLessThan(week5.weeklyMileage);
  });

  it("sets final run as marathon race", () => {
    const weeks = 12;
    const plan = generateLongDistancePlan(
      weeks,
      26.2,
      "miles",
      TrainingLevel.Beginner,
      45,
      26.2
    );
    const lastWeek = plan.schedule[weeks - 1];
    expect(lastWeek.runs).toHaveLength(1);
    const lastRun = lastWeek.runs[0];
    expect(lastRun.type).toBe("marathon");
    expect(lastWeek.notes).toBe("Race week");
  });
});
