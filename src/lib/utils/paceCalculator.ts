import { RacePace } from "@types/pace";

/**
 * Converts pace (minutes per km) to a formatted mm:ss string
 */
const formatPace = (pace: number): string => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Calculate race paces using Riegel's formula.
 * @param timeInMinutes - User's known race time (in minutes).
 * @param distanceKm - Distance of the known race (in km).
 * @returns Array of estimated paces for standard race distances.
 */
export const calculateRacePaces = (
  timeInMinutes: number,
  distanceKm: number
): RacePace[] => {
  const distances = [
    { name: "5K", km: 5 },
    { name: "10K", km: 10 },
    { name: "Half Marathon", km: 21.0975 },
    { name: "Marathon", km: 42.195 },
  ];

  return distances.map(({ name, km }) => {
    // Riegel's formula: T2 = T1 * (D2 / D1) ^ 1.06
    const predictedTime = timeInMinutes * Math.pow(km / distanceKm, 1.06);
    const pacePerKm = predictedTime / km;
    const pacePerMile = pacePerKm * 1.60934;

    return {
      distance: name,
      pacePerMile: formatPace(pacePerMile),
      pacePerKm: formatPace(pacePerKm),
    };
  });
};
