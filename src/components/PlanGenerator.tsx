"use client";

import React, { useState } from "react";
import {
  generateRunningPlan,
  RunningPlanData,
} from "@utils/running/plans/baseRunningPlan";
import ToggleSwitch from "./ToggleSwitch";


const PlanGenerator = () => {
  const [weeks, setWeeks] = useState<number>(12);
  const [targetDistance, setTargetDistance] = useState<number>(5); // Target race distance in chosen unit.
  const [distanceUnit, setDistanceUnit] = useState<"miles" | "kilometers">("miles");
  const [useTotalTime, setUseTotalTime] = useState<boolean>(false);
  const [targetPace, setTargetPace] = useState<string>("7:00");
  const [targetTotalTime, setTargetTotalTime] = useState<string>("0:40:00");
  const [vo2max, setVo2max] = useState<number>(45); // User's current VO₂ max.
  const [planData, setPlanData] = useState<RunningPlanData | null>(null);

  // Handler to generate the plan when the form is submitted.
  const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const generatedPlan = generateRunningPlan(
      weeks,
      targetDistance,
      distanceUnit,
      vo2max,
      useTotalTime ? undefined : targetPace,
      useTotalTime ? targetTotalTime : undefined,
    );
    setPlanData(generatedPlan);
  };

  return (
    <div>
      <h1>Generate Your Running Plan</h1>
      <form onSubmit={handleGenerate}>
        <div>
          <label htmlFor="weeks">Weeks:</label>
          <input
            id="weeks"
            type="number"
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="targetDistance">
            Target Distance ({distanceUnit}):
          </label>
          <input
            id="targetDistance"
            type="number"
            step="0.1"
            value={targetDistance}
            onChange={(e) => setTargetDistance(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="distanceUnit">Unit:</label>
          <ToggleSwitch
            checked={distanceUnit === "kilometers"}
            onChange={(checked) =>
              setDistanceUnit(checked ? "kilometers" : "miles")
            }
            leftLabel="Miles"
            rightLabel="Kilometers"
          />
        </div>
        <div>
          <label htmlFor="inputMode">Use Target Total Time?</label>
          <ToggleSwitch
            checked={useTotalTime}
            onChange={(checked) => setUseTotalTime(checked)}
            leftLabel="Pace"
            rightLabel="Total Time"
          />
        </div>
        {useTotalTime ? (
          <div>
            <label htmlFor="targetTotalTime">
              Target Total Time (hh:mm:ss or mm:ss):
            </label>
            <input
              id="targetTotalTime"
              type="text"
              value={targetTotalTime}
              onChange={(e) => setTargetTotalTime(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="targetPace">Target Pace (mm:ss):</label>
            <input
              id="targetPace"
              type="text"
              value={targetPace}
              onChange={(e) => setTargetPace(e.target.value)}
            />
          </div>
        )}
        <div>
          <label htmlFor="vo2max">VO₂ Max:</label>
          <input
            id="vo2max"
            type="number"
            step="0.1"
            value={vo2max}
            onChange={(e) => setVo2max(Number(e.target.value))}
          />
        </div>
        <button type="submit">Generate Plan</button>
      </form>

      {planData && (
        <div>
          <h2>Your Generated Plan</h2>
          <pre>{JSON.stringify(planData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PlanGenerator;
