import {
  generate5kPlan,
  generateHalfMarathonPlan,
  DistancePlanOptions,
} from "../running/plans/distancePlans";
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

  it("adds the requested number of cross training days", () => {
    const opts: DistancePlanOptions = {
      distanceUnit: "miles",
      trainingLevel: TrainingLevel.Beginner,
      vdot: 40,
      runsPerWeek: 5,
      crossTrainingDays: 2,
    };
    const plan = generate5kPlan(opts);
    const week1 = plan.schedule[0];
    const crossCount = week1.runs.filter((r) => r.type === "cross").length;
    expect(crossCount).toBe(2);
  });

  it("produces four runs with two easy days when requested", () => {
    const plan = generateHalfMarathonPlan({
      distanceUnit: "miles",
      trainingLevel: TrainingLevel.Beginner,
      vdot: 40,
      runsPerWeek: 4,
    });
    const week1 = plan.schedule[0];
    const easyCount = week1.runs.filter((r) => r.type === "easy").length;
    expect(week1.runs).toHaveLength(4);
    expect(easyCount).toBe(2);
  });
});
