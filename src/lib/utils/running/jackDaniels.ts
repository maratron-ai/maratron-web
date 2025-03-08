
export const calculateVO2MaxJackDaniels = (
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

  const vo2Max = vo2 / vo2MaxPercentage;

  return vo2Max;
};


function formatPace(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function calculatePaceForVO2Max(
  distanceMeters: number,
  targetVO2Max: number
): string {
  // Set reasonable bounds (in seconds) for the race time.
  // Lower bound: very fast race; upper bound: very slow.
  let low = distanceMeters / 10; // best-case (faster) time estimate
  let high = distanceMeters / 1; // worst-case (slower) time estimate
  let mid = 0;
  const tolerance = 0.1; // acceptable difference in VO₂ max
  const maxIterations = 50;

  for (let i = 0; i < maxIterations; i++) {
    mid = (low + high) / 2;
    const computedVO2 = calculateVO2MaxJackDaniels(distanceMeters, mid);
    if (Math.abs(computedVO2 - targetVO2Max) < tolerance) {
      break;
    }
    // If the computed VO2 is too low, the runner must be running faster (shorter time).
    if (computedVO2 < targetVO2Max) {
      high = mid;
    } else {
      low = mid;
    }
  }
  const distanceMiles = distanceMeters / 1609.34;
  const paceSecondsPerMile = mid / distanceMiles;
  return formatPace(paceSecondsPerMile);
}
