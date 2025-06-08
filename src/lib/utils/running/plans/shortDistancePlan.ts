import { calculatePaceForVO2Max } from "../jackDaniels";
import { WeekPlan, RunningPlanData, PlannedRun } from "@maratypes/runningPlan";
import { formatPace } from "@utils/running/paces";

// const formatPace = (sec: number): string => {
//   const m = Math.floor(sec / 60);
//   const s = Math.round(sec % 60);
//   return `${m}:${s.toString().padStart(2, "0")}`;
// };

const MIN_WEEKS = 6;
const FOUR_WEEK_CYCLE = 4;
const TAPER_FACTOR = 0.75;
const FOUR_WEEK_FACTOR = 0.85;
const EASY_PERCENT = 0.2;
const TEMPO_PERCENT = 0.25;
const WUCD_PERCENT = 0.1; // warm-up/cool-down as fraction of run

export const Units = ["miles", "kilometers"] as const;
export type Unit = (typeof Units)[number];

export enum TrainingLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

const RAW_INTERVAL_WORKOUTS = [
  {
    description: "10×400 m sprints",
    reps: 10,
    distanceMeters: 400,
    notes: "Sprint at I-pace with 60–90 s jog recovery.",
  },
  {
    description: "6×800 m repeats",
    reps: 6,
    distanceMeters: 800,
    notes: "Run at I-pace with equal jog recovery.",
  },
  {
    description: "8×200 m hills",
    reps: 8,
    distanceMeters: 200,
    notes: "Uphill at I-pace, jog downhill.",
  },
  {
    description: "5×1 km repeats",
    reps: 5,
    distanceMeters: 1000,
    notes: "Run at I-pace with 2–3 min recovery.",
  },
] as const;

export interface IntervalWorkout {
  description: string;
  reps: number;
  distanceMeters: number;
  notes: string;
}

// -- Validation to enforce data validity at edges
function validateWorkout(w: Partial<IntervalWorkout>): IntervalWorkout {
  if (!w.description || w.reps! <= 0 || w.distanceMeters! <= 0 || !w.notes) {
    throw new Error(`Invalid workout entry: ${JSON.stringify(w)}`);
  }
  return w as IntervalWorkout;
}
export const INTERVAL_WORKOUTS: readonly IntervalWorkout[] =
  RAW_INTERVAL_WORKOUTS.map((w) => validateWorkout(w));

interface PaceZones {
  easy: string;
  marathon: string;
  tempo: string;
  interval: string;
}

// -- Immutable progression state
interface ProgressionState {
  week: number;
  mileage: number;
}
function computeMileageProgression(
  weeks: number,
  startingMileage: number,
  taperStart: number,
  volumeRule: { increasePct: number; maxAdd: number }
): ProgressionState[] {
  return Array.from({ length: weeks }, (_, i) => i + 1).reduce<
    ProgressionState[]
  >((acc, week) => {
    const prev = acc[acc.length - 1]?.mileage ?? startingMileage;
    let mileage: number;
    if (week >= taperStart) {
      mileage = prev * TAPER_FACTOR;
    } else if (week % FOUR_WEEK_CYCLE === 0) {
      mileage = prev * FOUR_WEEK_FACTOR;
    } else {
      mileage = Math.min(
        prev * (1 + volumeRule.increasePct),
        prev + volumeRule.maxAdd
      );
    }
    return [...acc, { week, mileage }];
  }, []);
}

export function generateShortDistancePlan(
  weeks: number,
  targetDistance: number,
  distanceUnit: Unit,
  trainingLevel: TrainingLevel,
  vo2max: number,
  startingWeeklyMileage: number,
  targetPace?: string,
  targetTotalTime?: string
): RunningPlanData {
  if (weeks < MIN_WEEKS) throw new Error(`Plan must be ≥ ${MIN_WEEKS} weeks.`);
  if (targetDistance <= 0) throw new Error("Distance must be > 0");
  if (startingWeeklyMileage <= 0) startingWeeklyMileage = targetDistance;

  // -- helpers
  const parseHMS = (s: string): number => {
    const parts = s.split(":").map(Number);
    return parts.length === 3
      ? parts[0] * 3600 + parts[1] * 60 + parts[2]
      : parts[0] * 60 + parts[1];
  };

  // -- compute goal pace override
  let goalPaceSec: number | undefined;
  if (targetTotalTime) {
    goalPaceSec = parseHMS(targetTotalTime) / targetDistance;
  } else if (targetPace) {
    goalPaceSec = parseHMS(targetPace);
  }

  // -- distance conversions
  const toMeters = distanceUnit === "miles" ? 1609.34 : 1000;
  const raceMeters = targetDistance * toMeters;

  // -- pace zones
  const zones: PaceZones = {
    easy: calculatePaceForVO2Max(raceMeters, vo2max, "E"),
    marathon: calculatePaceForVO2Max(raceMeters, vo2max, "M"),
    tempo: calculatePaceForVO2Max(raceMeters, vo2max, "T"),
    interval: calculatePaceForVO2Max(raceMeters, vo2max, "I"),
  };
  if (goalPaceSec !== undefined) zones.marathon = formatPace(goalPaceSec);

  // -- edge-case validation for tempo pace
  const easySec = parseHMS(zones.easy);
  let tempoSecNum = parseHMS(zones.tempo);
  const marathonSec = parseHMS(zones.marathon);
  if (tempoSecNum >= easySec) {
    tempoSecNum = easySec * 0.95; // Adjust tempo pace to be generically faster than easy pace
    // throw new Error(
    //   `Tempo pace (${zones.tempo}) should be faster than easy pace (${zones.easy}).`
    // );
  }
  if (tempoSecNum >= marathonSec) {
    tempoSecNum = marathonSec * 0.95;
    // throw new Error(
    //   `Tempo pace (${zones.tempo}) should be faster than marathon pace (${zones.marathon}).`
    // );
  }

  // -- bounds for long-run progression
  const levelBounds = {
    [TrainingLevel.Beginner]: { startPct: 0.4, peakPct: 0.65 },
    [TrainingLevel.Intermediate]: { startPct: 0.5, peakPct: 0.75 },
    [TrainingLevel.Advanced]: { startPct: 0.6, peakPct: 0.85 },
  } as const;
  const { startPct, peakPct } = levelBounds[trainingLevel];
  const initialLong = targetDistance * startPct;
  const peakLong = targetDistance * peakPct;

  const volumeRules = {
    [TrainingLevel.Beginner]: { increasePct: 0.05, maxAdd: 5 },
    [TrainingLevel.Intermediate]: { increasePct: 0.1, maxAdd: 10 },
    [TrainingLevel.Advanced]: { increasePct: 0.15, maxAdd: 15 },
  } as const;

  const taperStart = weeks - 2;
  const progression = computeMileageProgression(
    weeks,
    startingWeeklyMileage,
    taperStart,
    volumeRules[trainingLevel]
  );

  const schedule: WeekPlan[] = progression.map(({ week, mileage }) => {
    if (week === weeks) {
      const raceRun: PlannedRun = {
        type: "long",
        unit: distanceUnit,
        mileage: Number(targetDistance.toFixed(1)),
        targetPace: { unit: distanceUnit, pace: zones.marathon },
      };
      return {
        weekNumber: week,
        weeklyMileage: raceRun.mileage,
        unit: distanceUnit,
        runs: [raceRun],
        notes: "Race week",
      };
    }

    // Long-run progression logic
    const longDist =
      week < taperStart
        ? initialLong +
          (peakLong - initialLong) *
            Math.min(Math.max((week - 1) / (taperStart - 1), 0), 1)
        : peakLong * Math.pow(TAPER_FACTOR, week - (taperStart - 1));

    // Interval workout with rep-specific pace
    const workout = INTERVAL_WORKOUTS[(week - 1) % INTERVAL_WORKOUTS.length];
    const intervalMileage = Number(
      ((workout.reps * workout.distanceMeters) / toMeters).toFixed(1)
    );
    const baseIntervalPaceSec = parseHMS(zones.interval);
    const repDistanceUnits = workout.distanceMeters / toMeters;
    const repPaceSec = baseIntervalPaceSec * repDistanceUnits;
    const repPace = formatPace(repPaceSec);
    let intervalNotes = `${workout.description} – ${workout.notes}`;
    intervalNotes += ` Each ${workout.distanceMeters}m in ~${repPace}`;
    if (workout.description.toLowerCase().includes("sprint")) {
      intervalNotes += `; total sprint distance: ${intervalMileage} ${distanceUnit}.`;
    }

    // Easy & tempo runs
    const easyMileage = Number((mileage * EASY_PERCENT).toFixed(1));
    const tempoMileage = Number((mileage * TEMPO_PERCENT).toFixed(1));
    const tempoNotes = `Tempo at T-pace (${
      zones.tempo
    }) for ${tempoMileage} ${distanceUnit}, plus ${WUCD_PERCENT * 100}% WU/CD`;

    const runs: PlannedRun[] = [
      {
        type: "easy",
        unit: distanceUnit,
        mileage: easyMileage,
        targetPace: { unit: distanceUnit, pace: zones.easy },
      },
      {
        type: "interval",
        unit: distanceUnit,
        mileage: intervalMileage,
        targetPace: { unit: distanceUnit, pace: zones.interval },
        notes: intervalNotes,
      },
      {
        type: "tempo",
        unit: distanceUnit,
        mileage: tempoMileage,
        targetPace: { unit: distanceUnit, pace: formatPace(tempoSecNum) },
        notes: tempoNotes,
      },
      {
        type: "long",
        unit: distanceUnit,
        mileage: Number(longDist.toFixed(1)),
        targetPace: { unit: distanceUnit, pace: zones.marathon },
      },
    ];

    const weeklyMileage = Number(
      runs.reduce((tot, r) => tot + r.mileage, 0).toFixed(1)
    );

    return {
      weekNumber: week,
      weeklyMileage,
      unit: distanceUnit,
      runs,
      notes: week >= taperStart ? "Taper week" : undefined,
    };
  });

  return { weeks, schedule, notes: "Generated by Maratron" };
}
