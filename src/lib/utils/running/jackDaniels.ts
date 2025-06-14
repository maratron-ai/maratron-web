import { formatPace } from "@utils/running/paces";

export const calculateVDOTJackDaniels = (
  distanceMeters: number,
  timeSeconds: number
): number => {
  
  const timeMinutes = timeSeconds / 60;

  const velocity = distanceMeters / timeMinutes;

  const vo2MaxPercentage =
    0.8 +
    0.1894393 * Math.exp(-0.012778 * timeMinutes) +
    0.2989558 * Math.exp(-0.1932605 * timeMinutes);

  const vo2 = -4.6 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);

  const vdot = vo2 / vo2MaxPercentage;

  return vdot;
};

type PaceZone = "E" | "M" | "T" | "I" | "R";

const ZONE_FACTORS: Record<PaceZone, number> = {
  E: 0.7, // easy
  M: 0.88, // marathon
  T: 0.95, // threshold
  I: 1.02, // interval
  R: 1.08, // repetition
};


/**
 * Invert Daniels’ VO₂→pace model for a given zone.
 *
 * @param distanceMeters  Race distance in meters
 * @param targetVDOT      Runner’s VDOT
 * @param zone            One of "E","M","T","I","R"
 * @returns               Pace string "mm:ss" per mile
 */
export function calculatePaceForVDOT(
  distanceMeters: number,
  targetVDOT: number,
  zone: PaceZone
): string {
  // adjust VO₂ for zone intensity
  const zonalVO2 = targetVDOT * ZONE_FACTORS[zone];

  // binary search bounds on race time (in seconds)
  let low = distanceMeters / 10; // super-fast
  let high = distanceMeters / 1; // super-slow
  let mid = 0;

  for (let i = 0; i < 50; i++) {
    mid = (low + high) / 2;
    const vo2 = calculateVDOTJackDaniels(distanceMeters, mid);
    if (Math.abs(vo2 - zonalVO2) < 0.1) break;
    if (vo2 < zonalVO2) {
      // mid is too slow (VO₂ too low), speed up
      high = mid;
    } else {
      // mid is too fast (VO₂ too high), slow down
      low = mid;
    }
  }

  // convert race time to pace per mile
  const metersPerMile = 1609.34;
  const paceSec = mid / (distanceMeters / metersPerMile);
  return formatPace(paceSec);
}
