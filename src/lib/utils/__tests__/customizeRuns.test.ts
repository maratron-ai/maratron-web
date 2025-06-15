import { generate5kPlan, DistancePlanOptions } from "../running/plans/distancePlans";
import { TrainingLevel } from "../running/plans/longDistancePlan";


describe("customizePlanRuns", () => {
  it("reduces to three runs with alternating quality workouts", () => {
    const base = generate5kPlan({
      distanceUnit: "miles",
      trainingLevel: TrainingLevel.Beginner,
      vdot: 40,
      runsPerWeek: 3,
    });
    const week1Types = base.schedule[0].runs.map((r) => r.type);
    const week2Types = base.schedule[1].runs.map((r) => r.type);
    expect(base.schedule[0].runs).toHaveLength(3);
    expect(base.schedule[1].runs).toHaveLength(3);
    expect(week1Types).toContain("interval");
    expect(week2Types).toContain("tempo");
  });

  it("adds cross training placeholders", () => {
    const opts: DistancePlanOptions = {
      distanceUnit: "miles",
      trainingLevel: TrainingLevel.Beginner,
      vdot: 40,
      runsPerWeek: 5,
      includeCrossTraining: true,
    };
    const plan = generate5kPlan(opts);
    const week1 = plan.schedule[0];
    expect(week1.runs.some((r) => r.type === "cross")).toBe(true);
  });
});
