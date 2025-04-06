import { calculatePaceForVO2Max } from "../jackDaniels";
// import { Pace } from "@maratypes/run";
import { WeekPlan, RunningPlanData } from "@maratypes/runningPlan";


/**
 * Generate a running plan.
 *
 * The user may provide either a target pace (in "mm:ss" format per unit) or a target total time (in "hh:mm:ss" or "mm:ss" format).
 * If targetTotalTime is provided, it will be used to calculate the target pace.
 *
 * @param weeks - Number of training weeks.
 * @param targetDistance - The target race distance.
 * @param distanceUnit - The unit of targetDistance ("miles" or "kilometers").
 * @param targetPace - The goal race pace in "mm:ss" format (per unit).
 * @param targetTotalTime - The goal total race time in "hh:mm:ss" (or "mm:ss") format.
 * @param vo2max - The user’s current VO₂ max.
 * @returns A RunningPlanData object containing a schedule of runs.
 */
export function generateRunningPlan(
  weeks: number,
  targetDistance: number,
  distanceUnit: "miles" | "kilometers",
  vo2max: number,
  targetPace?: string,
  targetTotalTime?: string,
): RunningPlanData {
  const schedule: WeekPlan[] = [];

  // conversion factors
  const milesToMeters = 1609.34;
  const kmToMeters = 1000;

  function parsePace(pace: string): number {
    const [min, sec] = pace.split(":").map(Number);
    return min * 60 + sec;
  }

  function formatPace(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  // Helper function: convert a total time string ("hh:mm:ss" or "mm:ss") to seconds.
  function parseTotalTime(time: string): number {
    const parts = time.split(":").map(Number);
    if (parts.length === 3) {
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    } else if (parts.length === 2) {
      // If only minutes and seconds are provided, treat it like a pace.
      return parsePace(time);
    } else {
      throw new Error(
        "Invalid time format. Use mm:ss for pace or hh:mm:ss for total time."
      );
    }
  }

  // Determine target pace in seconds per unit.
  let targetPaceSec: number;
  if (targetTotalTime) {
    const totalTimeSec = parseTotalTime(targetTotalTime);
    targetPaceSec = totalTimeSec / targetDistance;
  } else if (targetPace) {
    targetPaceSec = parsePace(targetPace);
  } else {
    throw new Error("Must provide either a target pace or target total time.");
  }

  const targetDistanceMeters =
    distanceUnit === "miles"
      ? targetDistance * milesToMeters
      : targetDistance * kmToMeters;

  // Get the runner's current pace (using VO₂ max) for the target race distance.
  const currentPaceString = calculatePaceForVO2Max(
    targetDistanceMeters,
    vo2max
  );
  const currentPaceSec = parsePace(currentPaceString);

  // --- EASY RUN ---
  // Easy run pace: interpolate from 5% slower than current pace to target pace. if current pace is faster than target pace, use target pace.
  const initialEasyPaceSec =
    currentPaceSec * 1.05 < targetPaceSec
      ? targetPaceSec
      : currentPaceSec * 1.05;
  const finalEasyPaceSec = targetPaceSec;
  // Easy run distance: fixed at 25% of target distance.
  const easyRunDistance = Math.ceil(targetDistance * 0.25);


  // --- TEMPO RUN ---
  // Tempo run pace: interpolate from 15% slower than target to 10% slower.
  const initialTempoPaceSec = targetPaceSec * .9;
  const finalTempoPaceSec = targetPaceSec * .85;
  // Tempo run distance: from 20% to 30% of target distance.
  const initialTempoDistance = targetDistance * 0.2;
  const finalTempoDistance = targetDistance * 0.3;

  // --- INTERVAL WORKOUTS ---
  // Define an array of popular interval workouts.
  type IntervalWorkout = {
    description: string;
    reps: number;
    repDistanceMiles: number; // stored as miles
    notes: string;
  };

  const intervalWorkouts: IntervalWorkout[] = [
    {
      description: "10 x 400m",
      reps: 10,
      repDistanceMiles: 0.25, // approx 400m
      notes: "Run 400m repeats at interval pace with 60-90s recovery.",
    },
    {
      description: "6 x 800m",
      reps: 6,
      repDistanceMiles: 0.5, // approx 800m
      notes: "Run 800m repeats at interval pace with equal jog recovery.",
    },
    {
      description: "5 x 1000m",
      reps: 5,
      repDistanceMiles: 0.62, // approx 1000m
      notes: "Run 1000m repeats at interval pace with 2-3 min recovery.",
    },
    {
      description: "4 x 1 mile",
      reps: 4,
      repDistanceMiles: 1,
      notes: "Run mile repeats at interval pace with 3-4 min recovery.",
    },
    {
      description: "Ladder: 400-800-1200-800-400",
      reps: 5, // treated as 5 segments; total distance is computed below
      repDistanceMiles: 0.25, // base unit; see notes for ladder specifics
      notes:
        "Perform a ladder workout with increasing then decreasing distances. Adjust recovery as needed.",
    },
  ];

  // --- LONG RUN ---
  // Long run distance: interpolate from 45% of target distance to the full target distance.
  // We assume long run pace is the same as the easy run pace.

  // Helper: Linear interpolation.
  const lerp = (start: number, end: number, t: number): number =>
    start + (end - start) * t;

  for (let week = 1; week <= weeks; week++) {
    const progress = weeks === 1 ? 1 : (week - 1) / (weeks - 1);

    // --- EASY RUN for this week ---
    const weekEasyPaceSec = lerp(
      initialEasyPaceSec,
      finalEasyPaceSec,
      progress
    );
    const weekEasyPace = formatPace(weekEasyPaceSec);

    // --- TEMPO RUN for this week ---
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
    // For tempo runs, include warm-up and cool-down (10% of tempo distance each).
    const warmUpDistance = weekTempoDistance * 0.1;
    const coolDownDistance = weekTempoDistance * 0.1;
    const tempoNotes = `Include ${warmUpDistance.toFixed(
      1
    )} ${distanceUnit} warm-up and ${coolDownDistance.toFixed(
      1
    )} ${distanceUnit} cool-down.`;

    // --- LONG RUN for this week ---
    const weekLongDistance = lerp(
      targetDistance * 0.45,
      targetDistance,
      progress
    );

    // --- INTERVAL RUN for this week ---
    // Select one interval workout (cycling through the array).
    const selectedInterval =
      intervalWorkouts[(week - 1) % intervalWorkouts.length];
    // Convert interval rep distance to the appropriate unit.
    const intervalDistance =
      distanceUnit === "miles"
        ? selectedInterval.reps * selectedInterval.repDistanceMiles
        : selectedInterval.reps * selectedInterval.repDistanceMiles * 1.60934;
    // Set interval pace to be 5% faster than the current pace.
    const intervalPaceSec = currentPaceSec * 0.95;
    const intervalPace = formatPace(intervalPaceSec);
    const intervalNotes = `${selectedInterval.description}: ${selectedInterval.notes}`;

    // Calculate total weekly distance.
    const totalDistance =
      easyRunDistance + weekTempoDistance + weekLongDistance + intervalDistance;

    // Assemble this week's plan.
    const weekPlan: WeekPlan = {
      weekNumber: week,
      weeklyMileage: Number(totalDistance.toFixed(1)),
      unit: distanceUnit,
      runs: [
        {
          type: "easy",
          unit: distanceUnit,
          targetPace: { unit: distanceUnit, pace: weekEasyPace },
          mileage: easyRunDistance,
        },
        {
          type: "tempo",
          unit: distanceUnit,
          targetPace: { unit: distanceUnit, pace: weekTempoPace },
          mileage: Number(weekTempoDistance.toFixed(1)),
          notes: tempoNotes,
        },
        {
          type: "long",
          unit: distanceUnit,
          targetPace: { unit: distanceUnit, pace: weekEasyPace },
          mileage: Number(weekLongDistance.toFixed(1)),
        },
        {
          type: "interval",
          unit: distanceUnit,
          targetPace: { unit: distanceUnit, pace: intervalPace },
          mileage: Number(intervalDistance.toFixed(1)),
          notes: intervalNotes,
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
