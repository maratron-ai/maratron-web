"use client";

import React, { useState } from "react";
import { generateRunningPlan } from "@utils/running/plans/baseRunningPlan";
import { RunningPlanData } from "@maratypes/runningPlan";
import ToggleSwitch from "./ToggleSwitch";
import RunningPlanDisplay from "./RunningPlanDisplay"; // Import your new component

const PlanGenerator = () => {
  const [weeks, setWeeks] = useState<number>(12);
  const [targetDistance, setTargetDistance] = useState<number>(5); // Target race distance in chosen unit.
  const [distanceUnit, setDistanceUnit] = useState<"miles" | "kilometers">(
    "miles"
  );
  const [useTotalTime, setUseTotalTime] = useState<boolean>(false);
  const [targetPace, setTargetPace] = useState<string>("7:00");
  const [targetTotalTime, setTargetTotalTime] = useState<string>("0:40:00");
  const [vo2max, setVo2max] = useState<number>(45); // User's current VO₂ max.
  const [planData, setPlanData] = useState<RunningPlanData | null>(null);
  const [showJson, setShowJson] = useState<boolean>(false); // State to toggle JSON display

  // Handler to generate the plan when the form is submitted.
  const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const generatedPlan = generateRunningPlan(
      weeks,
      targetDistance,
      distanceUnit,
      vo2max,
      useTotalTime ? undefined : targetPace,
      useTotalTime ? targetTotalTime : undefined
    );
    setPlanData(generatedPlan);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Generate Your Running Plan
      </h1>
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="weeks" className="mb-1">
            Weeks:
          </label>
          <input
            id="weeks"
            type="number"
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="targetDistance" className="mb-1">
            Target Distance ({distanceUnit}):
          </label>
          <input
            id="targetDistance"
            type="number"
            step="0.1"
            value={targetDistance}
            onChange={(e) => setTargetDistance(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="distanceUnit" className="mb-1">
            Unit:
          </label>
          <ToggleSwitch
            checked={distanceUnit === "kilometers"}
            onChange={(checked) =>
              setDistanceUnit(checked ? "kilometers" : "miles")
            }
            leftLabel="Miles"
            rightLabel="Kilometers"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="inputMode" className="mb-1">
            Input Mode:
          </label>
          <ToggleSwitch
            checked={useTotalTime}
            onChange={(checked) => setUseTotalTime(checked)}
            leftLabel="Pace"
            rightLabel="Total Time"
          />
        </div>
        {useTotalTime ? (
          <div className="flex flex-col">
            <label htmlFor="targetTotalTime" className="mb-1">
              Target Total Time (hh:mm:ss or mm:ss):
            </label>
            <input
              id="targetTotalTime"
              type="text"
              value={targetTotalTime}
              onChange={(e) => setTargetTotalTime(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <label htmlFor="targetPace" className="mb-1">
              Target Pace (mm:ss):
            </label>
            <input
              id="targetPace"
              type="text"
              value={targetPace}
              onChange={(e) => setTargetPace(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        )}
        <div className="flex flex-col">
          <label htmlFor="vo2max" className="mb-1">
            VO₂ Max:
          </label>
          <input
            id="vo2max"
            type="number"
            step="0.1"
            value={vo2max}
            onChange={(e) => setVo2max(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Generate Plan
        </button>
      </form>

      {planData && (
        <div className="mt-6">
          <RunningPlanDisplay planData={planData} /> {/* DELETE THIS LATER... ONLY VIEWING JSON FOR EASE OF COPYING*/}
            <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
              type="checkbox"
              id="showJson"
              onChange={(e) => setShowJson(e.target.checked)}
              className="form-checkbox"
              />
                <span>Show JSON</span>
                {showJson && (
                <button
                  type="button"
                  onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(planData, null, 2));
                  alert("JSON copied to clipboard!");
                  }}
                  className="ml-2 text-blue-500 underline"
                >
                  Copy JSON
                </button>
                )}
            </label>
            {showJson && (
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto mt-2 text-gray-800">
              {JSON.stringify(planData, null, 2)}
              </pre>
            )}
            </div>
        </div>
        

        
      )}
    </div>
  );
};

export default PlanGenerator;
