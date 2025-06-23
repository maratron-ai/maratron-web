import { XMLParser } from "fast-xml-parser";
import type { Run } from "@maratypes/run";
import { DistanceUnit } from "@maratypes/basics";
import calculatePace from "./calculatePace";

export interface ParseTcxOptions {
  userId: string;
  shoeId?: string;
  distanceUnit?: DistanceUnit;
}

function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function parseTcx(tcx: string, options: ParseTcxOptions): Run {
  const parser = new XMLParser({ ignoreAttributes: false });
  const data = parser.parse(tcx);

  const activity =
    data?.TrainingCenterDatabase?.Activities?.Activity;
  if (!activity) {
    throw new Error("Invalid TCX data");
  }

  const laps = Array.isArray(activity.Lap) ? activity.Lap : [activity.Lap];
  let totalTime = 0;
  let totalDistanceMeters = 0;

  for (const lap of laps) {
    totalTime += parseFloat(lap.TotalTimeSeconds);
    totalDistanceMeters += parseFloat(lap.DistanceMeters);
  }

  const date = new Date(activity.Id);
  const distanceUnit = options.distanceUnit ?? "kilometers";
  const distanceKm = totalDistanceMeters / 1000;
  const distance =
    distanceUnit === "miles"
      ? parseFloat((distanceKm / 1.60934).toFixed(2))
      : parseFloat(distanceKm.toFixed(2));
  const duration = formatSeconds(totalTime);
  const pace = calculatePace(duration, distance);

  return {
    date,
    duration,
    distance,
    distanceUnit,
    pace: { unit: distanceUnit, pace },
    trainingEnvironment: "outdoor",
    userId: options.userId,
    shoeId: options.shoeId,
    name: activity.Notes ?? undefined,
  };
}

export default parseTcx;
