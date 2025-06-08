import {
  generate5kPlan,
  generate10kPlan,
  generateHalfMarathonPlan,
  generateClassicMarathonPlan,
} from "../running/plans/distancePlans";
import { TrainingLevel } from "../running/plans/baseRunningPlan";

describe("distance-specific plan generators", () => {
  it("creates a 5k plan with correct race distance", () => {
    const plan = generate5kPlan({
      distanceUnit: "miles",
      trainingLevel: TrainingLevel.Beginner,
      vo2max: 40,
      startingWeeklyMileage: 10,
    });
    const last = plan.schedule[plan.schedule.length - 1];
    expect(last.runs[0].mileage).toBeCloseTo(3.1);
  });

  it("creates a 10k plan with correct race distance", () => {
    const plan = generate10kPlan({
      distanceUnit: "miles",
      trainingLevel: TrainingLevel.Beginner,
      vo2max: 40,
      startingWeeklyMileage: 10,
    });
    const last = plan.schedule[plan.schedule.length - 1];
    expect(last.runs[0].mileage).toBeCloseTo(6.2);
  });

  it("creates a half marathon plan with correct race distance", () => {
    const plan = generateHalfMarathonPlan({
      distanceUnit: "kilometers",
      trainingLevel: TrainingLevel.Intermediate,
      vo2max: 45,
      startingWeeklyMileage: 20,
    });
    const last = plan.schedule[plan.schedule.length - 1];
    expect(last.runs[0].mileage).toBeCloseTo(21.1, 1);
  });

  it("creates a marathon plan with 16 weeks by default", () => {
    const plan = generateClassicMarathonPlan({
      distanceUnit: "miles",
      trainingLevel: TrainingLevel.Advanced,
      vo2max: 50,
      startingWeeklyMileage: 30,
    });
    expect(plan.schedule.length).toBe(16);
  });
});
