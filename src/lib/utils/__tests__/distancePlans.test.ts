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

  it("easy run pace is slower than race pace and distance not over race", () => {
    const plan = generateClassicMarathonPlan({
      distanceUnit: "miles",
      trainingLevel: TrainingLevel.Beginner,
      vo2max: 40,
      startingWeeklyMileage: 200,
    });
    const firstWeek = plan.schedule[0];
    const easyRun = firstWeek.runs.find((r) => r.type === "easy")!;
    const racePace = firstWeek.runs.find((r) => r.type === "long")!.targetPace
      .pace;
    const parse = (s: string) => {
      const [m, s2] = s.split(":");
      return parseInt(m) * 60 + parseInt(s2);
    };
    expect(easyRun.mileage).toBeLessThanOrEqual(26.2);
    expect(parse(easyRun.targetPace.pace)).toBeGreaterThan(parse(racePace));
  });

  it("weekly mileage peaks before taper", () => {
    const plan = generateClassicMarathonPlan({
      distanceUnit: "miles",
      trainingLevel: TrainingLevel.Beginner,
      vo2max: 40,
      startingWeeklyMileage: 20,
    });
    const mileages = plan.schedule.map((w) => w.weeklyMileage);
    const peak = Math.max(...mileages.slice(0, -1));
    const peakIndex = mileages.indexOf(peak);
    expect(peakIndex).toBe(12); // week 13 (0-based index 12)
    expect(mileages[13]).toBeLessThan(peak);
  });
});
