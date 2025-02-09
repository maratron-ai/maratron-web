
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