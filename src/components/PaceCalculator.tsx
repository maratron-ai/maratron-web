import { useState } from "react";
import { RacePace } from "@types/pace";
import { calculateRacePaces } from "@lib/utils/paceCalculator";

const PaceCalculator = () => {
  const [raceTime, setRaceTime] = useState(""); // User's race time (minutes)
  const [distance, setDistance] = useState(""); // Distance of the race
  const [paces, setPaces] = useState<RacePace[]>([]);

  const handleCalculate = () => {
    const timeInMinutes = parseFloat(raceTime);
    const distanceKm = parseFloat(distance);

    if (
      isNaN(timeInMinutes) ||
      isNaN(distanceKm) ||
      timeInMinutes <= 0 ||
      distanceKm <= 0
    ) {
      alert("Please enter valid numbers for race time and distance.");
      return;
    }

    setPaces(calculateRacePaces(timeInMinutes, distanceKm));
  };

  return (
    <div>
      <h2>Race Pace Calculator</h2>

      <label>Race Time (minutes):</label>
      <input
        type="number"
        value={raceTime}
        onChange={(e) => setRaceTime(e.target.value)}
      />

      <label>Distance (km):</label>
      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />

      <button onClick={handleCalculate}>Calculate Paces</button>

      {paces.length > 0 && (
        <div>
          <h3>Predicted Paces</h3>
          <ul>
            {paces.map((pace) => (
              <li key={pace.distance}>
                {pace.distance}: {pace.pacePerKm} min/km | {pace.pacePerMile}{" "}
                min/mile
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaceCalculator;
