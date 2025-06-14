"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@hooks/useUser";
import { TrainingLevel } from "@maratypes/user";
import ToggleSwitch from "@components/ToggleSwitch";
import { Spinner } from "@components/ui";
import RunningPlanDisplay from "./RunningPlanDisplay";
import {
  generate5kPlan,
  generate10kPlan,
  generateHalfMarathonPlan,
  generateClassicMarathonPlan,
} from "@utils/running/plans/distancePlans";
import { RunningPlanData } from "@maratypes/runningPlan";
import { listRunningPlans } from "@lib/api/plan";
import { assignDatesToPlan } from "@utils/running/planDates";
import {
  defaultPlanName,
  getDistanceLabel,
  RaceType,
} from "@utils/running/planName";


const DISTANCE_INFO: Record<RaceType, { miles: number; km: number; weeks: number }> = {
  "5k": { miles: 3.1, km: 5, weeks: 8 },
  "10k": { miles: 6.2, km: 10, weeks: 10 },
  half: { miles: 13.1, km: 21.1, weeks: 12 },
  full: { miles: 26.2, km: 42.2, weeks: 16 },
};

const DEFAULT_RACE: RaceType = "full";

const PlanGenerator: React.FC = () => {
  const { profile: user, loading } = useUser();

  // Set initial state to user's info (if available), fallback to defaults
const [raceType, setRaceType] = useState<RaceType>(DEFAULT_RACE);
const [distanceUnit, setDistanceUnit] = useState<"miles" | "kilometers">(
  "miles"
);
const [weeks, setWeeks] = useState<number>(DISTANCE_INFO[DEFAULT_RACE].weeks);
const [targetDistance, setTargetDistance] = useState<number>(
  DISTANCE_INFO[DEFAULT_RACE].miles
);
  const [vdot, setVdot] = useState<number>(30);
  const [useTotalTime, setUseTotalTime] = useState<boolean>(false);
  const [targetPace, setTargetPace] = useState<string>("10:00");
  const [targetTotalTime, setTargetTotalTime] = useState<string>("3:45:00");
  const [planData, setPlanData] = useState<RunningPlanData | null>(null);
  const [showJson, setShowJson] = useState<boolean>(false);
  const [planName, setPlanName] = useState<string>(
    defaultPlanName(DEFAULT_RACE, 1)
  );
  const [endDate, setEndDate] = useState<string>("");

  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel>(
    TrainingLevel.Beginner
  );
  const [runsPerWeek, setRunsPerWeek] = useState<number>(4);
  const [crossTrainingDays, setCrossTrainingDays] = useState<number>(0);

  useEffect(() => {
    if (crossTrainingDays > 7 - runsPerWeek) {
      setCrossTrainingDays(7 - runsPerWeek);
    }
  }, [runsPerWeek, crossTrainingDays]);

  useEffect(() => {
    const fetchName = async () => {
      if (!user?.id) return;
      try {
        const all = await listRunningPlans();
        const userPlans = all.filter((p: { userId: string; name?: string }) => p.userId === user.id);
        const label = getDistanceLabel(raceType);
        const count = userPlans.filter((p: { name: string; }) => p.name?.startsWith(label)).length; // not sure if p's type is right
        setPlanName(defaultPlanName(raceType, count + 1));
      } catch (err) {
        console.error(err);
      }
    };
    fetchName();
  }, [user?.id, raceType]);
  // const [defaultShoeId, setDefaultShoeId] = useState<string | undefined>(
  //   undefined
  // );

  // On load/fetch, update state defaults from user profile
  useEffect(() => {
    if (user) {
      if (user.trainingLevel) setTrainingLevel(user.trainingLevel);
      setVdot(user.VDOT ?? 30);
      if (user.defaultDistanceUnit) setDistanceUnit(user.defaultDistanceUnit);
      // if (user.defaultShoeId) setDefaultShoeId(user.defaultShoeId);
      // Optionally, set other user-specific defaults
    } else {
      setVdot(30);
    }
  }, [user]);

  useEffect(() => {
    const info = DISTANCE_INFO[raceType];
    setWeeks(info.weeks);
    setTargetDistance(
      distanceUnit === "kilometers" ? info.km : info.miles
    );
  }, [raceType, distanceUnit]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const opts = {
      weeks,
      distanceUnit,
      trainingLevel,
      vdot,
      targetPace: useTotalTime ? undefined : targetPace,
      targetTotalTime: useTotalTime ? targetTotalTime : undefined,
      runsPerWeek,
      crossTrainingDays,
    };
    let plan: RunningPlanData;
    switch (raceType) {
      case "5k":
        plan = generate5kPlan(opts);
        break;
      case "10k":
        plan = generate10kPlan(opts);
        break;
      case "half":
        plan = generateHalfMarathonPlan(opts);
        break;
      default:
        plan = generateClassicMarathonPlan(opts);
        break;
    }
    // Assign default start and end dates if not provided
    const today = new Date();
    const base = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const diff = (7 - base.getUTCDay()) % 7;
    base.setUTCDate(base.getUTCDate() + (diff === 0 ? 7 : diff));
    const assumedStartDate = base.toISOString().slice(0, 10);
    let assumedEndDate = endDate;

    if (!endDate) {
      const projectedEndDate = new Date(today);
      projectedEndDate.setDate(today.getDate() + weeks * 7);

      // Adjust to nearest following Sunday
      const dayOfWeek = projectedEndDate.getDay(); // 0 is Sunday
      const daysToAdd = (7 - dayOfWeek) % 7;
      projectedEndDate.setDate(projectedEndDate.getDate() + daysToAdd);

      assumedEndDate = projectedEndDate.toISOString().slice(0, 10);
    }

    const withDates = assignDatesToPlan(plan, {
      startDate: assumedStartDate,
      endDate: assumedEndDate,
    });
    setPlanData(withDates);
    setEndDate(withDates.endDate?.slice(0, 10) ?? "");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Generate Your Running Plan
      </h1>
      {loading ? (
        <div className="flex justify-center py-4">
          <Spinner className="h-5 w-5" />
        </div>
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
              className="border p-2 rounded bg-background text-foreground"
            />
          </div>
          {/* Race Date */}
          <div className="flex flex-col">
            <label htmlFor="raceDate" className="mb-1">
              Race Date:
            </label>
            <input
              id="raceDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded bg-background text-foreground"
            />
          </div>
          {/* Race Selection */}
          <div className="flex flex-col">
            <label htmlFor="raceType" className="mb-1">
              Race Distance:
            </label>
            <select
              id="raceType"
              value={raceType}
              onChange={(e) => setRaceType(e.target.value as RaceType)}
              className="border p-2 rounded bg-background text-foreground"
            >
              <option value="5k">5K</option>
              <option value="10k">10K</option>
              <option value="half">Half Marathon</option>
              <option value="full">Marathon</option>
            </select>
            <span className="text-sm mt-1">
              Target Distance: {targetDistance} {distanceUnit}
            </span>
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
              className="border p-2 rounded bg-background text-foreground"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
          </select>
        </div>
        {/* Runs Per Week */}
        <div className="flex flex-col">
          <label htmlFor="runsPerWeek" className="mb-1">
            Runs per Week:
          </label>
          <input
            id="runsPerWeek"
            type="number"
            min={2}
            max={5}
            value={runsPerWeek}
            onChange={(e) => setRunsPerWeek(Number(e.target.value))}
            className="border p-2 rounded bg-background text-foreground"
          />
        </div>
        {/* Cross Training Days */}
        <div className="flex flex-col">
          <label htmlFor="crossDays" className="mb-1">
            Cross Training Days:
          </label>
          <input
            id="crossDays"
            type="number"
            min={0}
            max={7 - runsPerWeek}
            value={crossTrainingDays}
            onChange={(e) =>
              setCrossTrainingDays(Math.min(7 - runsPerWeek, Number(e.target.value)))
            }
            className="border p-2 rounded bg-background text-foreground"
          />
        </div>
        {/* Goal Input Mode */}
        <div className="flex flex-col">
            {/* <label htmlFor="inputMode" className="mb-1">
              Goal Input:
            </label> */}
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
                className="border p-2 rounded bg-background text-foreground"
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
                className="border p-2 rounded bg-background text-foreground"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-foreground p-2 rounded hover:bg-primary/80"
          >
            Generate Plan
          </button>
        </form>
      )}
      {planData && (
        <div className="mt-6">
          <RunningPlanDisplay
            planData={planData}
            planName={planName}
            showPlanMeta
            showBulkDaySetter
            onPlanNameChange={setPlanName}
            onPlanChange={setPlanData}
          />
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
                  className="ml-2 text-primary underline"
                >
                  Copy JSON
                </button>
              )}
            </label>
            {showJson && (
              <pre className="bg-background p-4 rounded overflow-x-auto mt-2 text-foreground">
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
