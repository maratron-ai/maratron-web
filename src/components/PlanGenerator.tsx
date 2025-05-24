"use client";
import React, { useState, useEffect } from "react";
import { useUserProfile } from "@hooks/useUserProfile";
import { TrainingLevel } from "@maratypes/user";
import ToggleSwitch from "./ToggleSwitch";
import RunningPlanDisplay from "./RunningPlanDisplay";
import { generateRunningPlan } from "@utils/running/plans/baseRunningPlan";
import { RunningPlanData } from "@maratypes/runningPlan";

const DEFAULT_WEEKS = 16;
const DEFAULT_DISTANCE = 26.2;
const DEFAULT_UNIT = "miles";

const PlanGenerator: React.FC = () => {
  const { profile: user, loading } = useUserProfile();

  // Set initial state to user's info (if available), fallback to defaults
  const [weeks, setWeeks] = useState<number>(DEFAULT_WEEKS);
  const [targetDistance, setTargetDistance] =
    useState<number>(DEFAULT_DISTANCE);
  const [distanceUnit, setDistanceUnit] = useState<"miles" | "kilometers">(
    DEFAULT_UNIT
  );
  const [startingWeeklyMileage, setstartingWeeklyMileage] =
    useState<number>(20);
  const [vo2max, setVo2max] = useState<number>(45);
  const [useTotalTime, setUseTotalTime] = useState<boolean>(false);
  const [targetPace, setTargetPace] = useState<string>("10:00");
  const [targetTotalTime, setTargetTotalTime] = useState<string>("3:45:00");
  const [planData, setPlanData] = useState<RunningPlanData | null>(null);
  const [showJson, setShowJson] = useState<boolean>(false);

  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel>(
    TrainingLevel.Beginner
  );
  const [defaultShoeId, setDefaultShoeId] = useState<string | undefined>(
    undefined
  );

  // On load/fetch, update state defaults from user profile
  useEffect(() => {
    if (user) {
      if (user.trainingLevel) setTrainingLevel(user.trainingLevel);
      if (user.weeklyMileage) setstartingWeeklyMileage(user.weeklyMileage);
      if (user.VO2Max) setVo2max(user.VO2Max);
      if (user.defaultShoeId) setDefaultShoeId(user.defaultShoeId);
      // Optionally, set other user-specific defaults
    }
  }, [user]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = generateRunningPlan(
      weeks,
      targetDistance,
      distanceUnit,
      trainingLevel,
      vo2max,
      startingWeeklyMileage,
      useTotalTime ? undefined : targetPace,
      useTotalTime ? targetTotalTime : undefined,
    );
    setPlanData(plan);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Generate Your Running Plan
      </h1>
      {loading ? (
        <p className="text-center">Loading user profile...</p>
      ) : (
        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Weeks */}
          <div className="flex flex-col">
            <label htmlFor="weeks" className="mb-1">
              Weeks:
            </label>
            <input
              id="weeks"
              type="number"
              min={8}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          {/* Target Distance */}
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
          {/* Unit Toggle */}
          <div className="flex flex-col">
            <label htmlFor="distanceUnit" className="mb-1">
              Unit:
            </label>
            <ToggleSwitch
              checked={distanceUnit === "kilometers"}
              onChange={(c) => setDistanceUnit(c ? "kilometers" : "miles")}
              leftLabel="Miles"
              rightLabel="Kilometers"
            />
          </div>
          {/* Current Weekly Mileage */}
          <div className="flex flex-col">
            <label htmlFor="currentMileage" className="mb-1">
              Starting Weekly Mileage ({distanceUnit}):
            </label>
            <input
              id="currentMileage"
              type="number"
              step="1"
              value={startingWeeklyMileage}
              onChange={(e) => setstartingWeeklyMileage(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          {/* VO₂ Max */}
          <div className="flex flex-col">
            <label htmlFor="vo2max" className="mb-1">
              VO₂ Max:
            </label>
            <input
              id="vo2max"
              type="number"
              step="1"
              value={vo2max}
              onChange={(e) => setVo2max(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          {/* Training Level */}
          <div className="flex flex-col">
            <label htmlFor="trainingLevel" className="mb-1">
              Training Level:
            </label>
            <select
              id="trainingLevel"
              value={trainingLevel}
              onChange={(e) =>
                setTrainingLevel(e.target.value as TrainingLevel)
              }
              className="border p-2 rounded"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          {/* Goal Input Mode */}
          <div className="flex flex-col">
            <label htmlFor="inputMode" className="mb-1">
              Goal Input:
            </label>
            <ToggleSwitch
              checked={useTotalTime}
              onChange={(c) => setUseTotalTime(c)}
              leftLabel="Pace"
              rightLabel="Total Time"
            />
          </div>
          {/* Target Pace or Total Time */}
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Generate Plan
          </button>
        </form>
      )}
      {planData && (
        <div className="mt-6">
          <RunningPlanDisplay planData={planData} />
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showJson}
                onChange={(e) => setShowJson(e.target.checked)}
                className="form-checkbox"
              />
              <span>Show JSON</span>
              {showJson && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(planData, null, 2)
                    );
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
