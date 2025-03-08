import { calculatePaceForVO2Max } from "./jackDaniels";

export interface PlannedRun {
  type: "easy" | "tempo" | "interval" | "long";
  targetPace: string; // Format: mm:ss
  mileage: number;
  notes?: string;
}

export interface WeekPlan {
  weekNumber: number;
  runs: PlannedRun[];
}

export interface RunningPlanData {
  weeks: number;
  schedule: WeekPlan[];
}

export function generateRunningPlan(
  weeks: number,
  targetDistance: number, // in miles
  targetPace: string, // in "mm:ss" format (goal race pace)
  vo2max: number
): RunningPlanData {
  const schedule: WeekPlan[] = [];

  // Helper functions to convert between "mm:ss" strings and seconds.
  function parsePace(pace: string): number {
    const [min, sec] = pace.split(":").map(Number);
    return min * 60 + sec;
  }
  function formatPace(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  // Use VO₂ max to calculate the user's current pace for the target race distance.
  // Convert target distance from miles to meters.
  const targetDistanceMeters = targetDistance * 1609.34;
  const currentPaceString = calculatePaceForVO2Max(
    targetDistanceMeters,
    vo2max
  );
  const currentPaceSec = parsePace(currentPaceString);

  // Parse the target race pace.
  const targetPaceSec = parsePace(targetPace);

  // Easy Run:
  // Initial easy pace: 5% slower than current pace.
  // Final easy pace: equals target pace.
  const initialEasyPaceSec = currentPaceSec * 1.05;
  const finalEasyPaceSec = targetPaceSec;
  // Easy run distance is fixed at 25% of the target distance (rounded up).
  const easyRunDistance = Math.ceil(targetDistance * 0.25);

  // Tempo Run:
  // Pace starts 15% slower than target and improves linearly to 10% slower.
  const initialTempoPaceSec = targetPaceSec * 1.15;
  const finalTempoPaceSec = targetPaceSec * 1.1;
  // Distance for tempo run starts at 20% of target and goes to 30%.
  const initialTempoDistance = targetDistance * 0.2;
  const finalTempoDistance = targetDistance * 0.3;

  // Helper: Linear interpolation.
  const lerp = (start: number, end: number, t: number): number =>
    start + (end - start) * t;

  for (let week = 1; week <= weeks; week++) {
    const progress = weeks === 1 ? 1 : (week - 1) / (weeks - 1);

    // Interpolate easy run pace (in seconds) for this week.
    const weekEasyPaceSec = lerp(
      initialEasyPaceSec,
      finalEasyPaceSec,
      progress
    );
    const weekEasyPace = formatPace(weekEasyPaceSec);

    // Interpolate tempo run pace and distance for this week.
    const weekTempoPaceSec = lerp(
      initialTempoPaceSec,
      finalTempoPaceSec,
      progress
    );
    const weekTempoPace = formatPace(weekTempoPaceSec);
    const weekTempoDistance = lerp(
      initialTempoDistance,
      finalTempoDistance,
      progress
    );

    // Long Run: Distance increases linearly from 45% of target to the full target distance.
    const weekLongDistance = lerp(
      targetDistance * 0.45,
      targetDistance,
      progress
    );

    // For tempo runs, include warm-up and cool-down (each 10% of the tempo distance).
    const warmUpDistance = weekTempoDistance * 0.1;
    const coolDownDistance = weekTempoDistance * 0.1;
    const tempoNotes = `Include ${warmUpDistance.toFixed(
      1
    )} miles warm-up and ${coolDownDistance.toFixed(1)} miles cool-down.`;

    // Assemble this week's plan.
    const weekPlan: WeekPlan = {
      weekNumber: week,
      runs: [
        {
          type: "easy",
          targetPace: weekEasyPace,
          mileage: easyRunDistance,
        },
        {
          type: "tempo",
          targetPace: weekTempoPace,
          mileage: weekTempoDistance,
          notes: tempoNotes,
        },
        {
          type: "long",
          targetPace: weekEasyPace, // Suggest using the easy pace for long runs.
          mileage: weekLongDistance,
        },
        {
          type: "interval",
          targetPace: "00:00", // Placeholder for interval runs.
          mileage: 0,
          notes: "Interval details to be determined",
        },
      ],
    };

    schedule.push(weekPlan);
  }

  return {
    weeks,
    schedule,
  };
}
