// src/components/PaceCalculator.tsx
import React, { useState } from "react";
import {
  RacePrediction,
  calculateRacePaces,
} from "@lib/utils/calculateRacePaces";

const PaceCalculator: React.FC = () => {
  const [raceTime, setRaceTime] = useState(""); // Known race time in minutes
  const [distance, setDistance] = useState(""); // Known race distance in kilometers
  const [predictions, setPredictions] = useState<RacePrediction[]>([]);

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

    const preds = calculateRacePaces(timeInMinutes, distanceKm);
    setPredictions(preds);
  };

  return (
    <div>
      <h2>Race Pace Calculator</h2>
      <label>Known Race Time (minutes):</label>
      <input
        type="number"
        value={raceTime}
        onChange={(e) => setRaceTime(e.target.value)}
      />

      <label>Known Race Distance (km):</label>
      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />

      <button onClick={handleCalculate}>Calculate Predictions</button>

      {predictions.length > 0 && (
        <div>
          <h3>Race Predictions</h3>
          <ul>
            {predictions.map((pred, index) => (
              <li key={index}>
                <strong>{pred.target}:</strong> Predicted Time:{" "}
                {pred.predictedTime}, Pace per Km: {pred.pacePerKm}, Pace per
                Mile: {pred.pacePerMile}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaceCalculator;
