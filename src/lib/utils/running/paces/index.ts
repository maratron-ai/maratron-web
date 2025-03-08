import { calculatePaceForVO2Max } from "@utils/running/jackDaniels";

export function parsePace(pace: string): number {
  const [min, sec] = pace.split(":").map(Number);
  return min * 60 + sec;
}

export function formatPace(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function getPacesFromRacePace(racePaceSec: number) {
  return {
    easy: formatPace(racePaceSec * 1.25),
    marathon: formatPace(racePaceSec * 1.05),
    threshold: formatPace(racePaceSec * 0.95),
    interval: formatPace(racePaceSec * 0.9),
    race: formatPace(racePaceSec),
  };
}

export function getPaces(vo2max: number, targetDistance: number) {
  const racePaceSec = parsePace(calculatePaceForVO2Max(targetDistance, vo2max));
  return getPacesFromRacePace(racePaceSec);
}
