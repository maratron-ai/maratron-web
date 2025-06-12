import { calculatePaceForVO2Max } from "../jackDaniels";
import { WeekPlan, RunningPlanData, PlannedRun } from "@maratypes/runningPlan";
import { formatPace } from "@utils/running/paces";

// const formatPace = (sec: number): string => {
//   const m = Math.floor(sec / 60);
//   const s = Math.round(sec % 60);
//   return `${m}:${s.toString().padStart(2, "0")}`;
// };

const MIN_WEEKS = 8;
const TAPER_WEEKS: number = 2;
const EASY_PERCENT = 0.15;
const TEMPO_PERCENT = 0.2;
const WUCD_PERCENT = 0.1; // warm-up/cool-down as fraction of run
const CUTBACK_FREQUENCY = 4;
const CUTBACK_FACTOR = 0.85;

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
export enum TrainingPhase {
  Base = "Base",
  Build = "Build",
  Peak = "Peak",
  Taper = "Taper",
}

interface ProgressionState {
  week: number;
  mileage: number;
  phase: TrainingPhase;
  cutback?: boolean;
}

function computeLinearProgression(
  weeks: number,
  startMileage: number,
  maxMileage: number,
  taperWeeks: number
): ProgressionState[] {
  const progressWeeks = weeks - taperWeeks;

  const baseWeeks = Math.max(1, Math.round(progressWeeks * 0.4));
  const buildWeeks = Math.max(1, Math.round(progressWeeks * 0.4));
  let peakWeeks = progressWeeks - baseWeeks - buildWeeks;
  if (peakWeeks < 1) {
    peakWeeks = 1;
  }

  const states: ProgressionState[] = [];
  for (let i = 0; i < progressWeeks; i++) {
    const ratio = progressWeeks === 1 ? 1 : i / (progressWeeks - 1);
    const baseMileage = startMileage + (maxMileage - startMileage) * ratio;
    let mileage = baseMileage;
    let cutback = false;
    if ((i + 1) % CUTBACK_FREQUENCY === 0) {
      mileage = baseMileage * CUTBACK_FACTOR;
      cutback = true;
    }
    let phase: TrainingPhase;
    if (i < baseWeeks) phase = TrainingPhase.Base;
    else if (i < baseWeeks + buildWeeks) phase = TrainingPhase.Build;
    else phase = TrainingPhase.Peak;
    states.push({ week: i + 1, mileage, phase, cutback });
  }

  for (let j = 0; j < taperWeeks; j++) {
    const ratio = taperWeeks === 1 ? 1 : j / (taperWeeks - 1);
    const mileage = maxMileage - (maxMileage - startMileage) * ratio;
    states.push({
      week: progressWeeks + j + 1,
      mileage,
      phase: TrainingPhase.Taper,
    });
  }
  return states;
}

export function generateLongDistancePlan(
  weeks: number,
  targetDistance: number,
  distanceUnit: Unit,
  trainingLevel: TrainingLevel,
  vo2max: number,
  _startingWeeklyMileage: number,
  targetPace?: string,
  targetTotalTime?: string
): RunningPlanData {
  if (weeks < MIN_WEEKS) throw new Error(`Plan must be ≥ ${MIN_WEEKS} weeks.`);
  if (targetDistance <= 0) throw new Error("Distance must be > 0");
  if (targetDistance < 13) {
    throw new Error(
      "generateLongDistancePlan is intended for half and full marathons"
    );
  }

  // -- helpers
  const parseHMS = (s: string): number => {
    const parts = s.split(":").map(Number);
    return parts.length === 3
      ? parts[0] * 3600 + parts[1] * 60 + parts[2]
      : parts[0] * 60 + parts[1];
  };

  const roundToHalf = (n: number): number => Math.round(n * 2) / 2;

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

  // -- weekly mileage bounds
  const isHalfMarathon =
    (distanceUnit === "miles" && targetDistance <= 13.2) ||
    (distanceUnit === "kilometers" && targetDistance <= 21.2);

  const levelBounds = isHalfMarathon
    ? {
        [TrainingLevel.Beginner]: { startMult: 1.0, endMult: 1.7 },
        [TrainingLevel.Intermediate]: { startMult: 1.1, endMult: 1.9 },
        [TrainingLevel.Advanced]: { startMult: 1.2, endMult: 2.1 },
      }
    : {
        [TrainingLevel.Beginner]: { startMult: 1.0, endMult: 1.4 },
        [TrainingLevel.Intermediate]: { startMult: 1.1, endMult: 1.5 },
        [TrainingLevel.Advanced]: { startMult: 1.2, endMult: 1.6 },
      } as const;

  const { startMult, endMult } = levelBounds[trainingLevel];

  const startMileage = targetDistance * startMult;
  const maxMileage = targetDistance * endMult;

  const longBounds = {
    [TrainingLevel.Beginner]: { startPct: 0.4, peakPct: 0.65 },
    [TrainingLevel.Intermediate]: { startPct: 0.5, peakPct: 0.75 },
    [TrainingLevel.Advanced]: { startPct: 0.6, peakPct: 0.85 },
  } as const;

  const { startPct, peakPct } = longBounds[trainingLevel];
  const initialLong = targetDistance * startPct;
  const peakLong = targetDistance * peakPct;

  const progression = computeLinearProgression(
    weeks,
    startMileage,
    maxMileage,
    TAPER_WEEKS
  );

  const progressWeeks = weeks - TAPER_WEEKS;

  const schedule: WeekPlan[] = progression.map(({ week, mileage, phase, cutback }) => {

    // Long-run progression logic
    let longDist: number;
    if (week > progressWeeks) {
      const taperIndex = week - progressWeeks - 1;
      const ratio = TAPER_WEEKS === 1 ? 1 : taperIndex / (TAPER_WEEKS - 1);
      longDist = peakLong - (peakLong - targetDistance) * ratio;
    } else {
      const ratio =
        progressWeeks === 1 ? 1 : (week - 1) / (progressWeeks - 1);
      longDist = initialLong + (peakLong - initialLong) * ratio;
    }

    // Interval workout with rep-specific pace
    const workout = INTERVAL_WORKOUTS[(week - 1) % INTERVAL_WORKOUTS.length];
    const intervalMileage = roundToHalf(
      (workout.reps * workout.distanceMeters) / toMeters
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
    const easyMileage = roundToHalf(mileage * EASY_PERCENT);
    const tempoMileage = roundToHalf(mileage * TEMPO_PERCENT);
    const tempoNotes = `Tempo at T-pace (${
      zones.tempo
    }) for ${tempoMileage} ${distanceUnit}, plus ${WUCD_PERCENT * 100}% WU/CD`;

    let runs: PlannedRun[];
    if (week === weeks) {
      runs = [
        {
          type: "marathon",
          unit: distanceUnit,
          mileage: roundToHalf(targetDistance),
          targetPace: { unit: distanceUnit, pace: zones.marathon },
        },
      ];
    } else {
      runs = [
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
          mileage: roundToHalf(longDist),
          targetPace: { unit: distanceUnit, pace: zones.marathon },
        },
      ];
    }

    const weeklyMileage = roundToHalf(runs.reduce((tot, r) => tot + r.mileage, 0));

    const notes =
      week === weeks
        ? "Race week"
        : `${phase} phase${cutback ? " - Cutback" : ""}`;

    return {
      weekNumber: week,
      weeklyMileage,
      unit: distanceUnit,
      runs,
      phase,
      notes,
    };
  });

  return { weeks, schedule, notes: "Generated by Maratron" };
}
