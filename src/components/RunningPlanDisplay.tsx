import React, { useState } from "react";
import { RunningPlanData, WeekPlan } from "@maratypes/runningPlan";
import { parsePace, formatPace } from "@utils/running/paces";

interface RunningPlanDisplayProps {
  planData: RunningPlanData;
  editable?: boolean;
  onPlanChange?: (plan: RunningPlanData) => void;
}

const RunningPlanDisplay: React.FC<RunningPlanDisplayProps> = ({
  planData,
  editable = false,
  onPlanChange,
}) => {
  const updateRun = (weekIdx: number, runIdx: number, field: string, value: unknown) => {
    if (!onPlanChange) return;
    const newSchedule = planData.schedule.map((w, wi) => {
      if (wi !== weekIdx) return w;
      const runs = w.runs.map((r, ri) =>
        ri === runIdx ? { ...r, [field]: value } : r
      );
      return { ...w, runs };
    });
    onPlanChange({ ...planData, schedule: newSchedule });
  };
  return (
    <div className="container p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Your Running Plan</h2>
      {planData.schedule.map((weekPlan, wi) => (
        <CollapsibleWeek
          key={weekPlan.weekNumber}
          weekPlan={weekPlan}
          editable={editable}
          weekIndex={wi}
          updateRun={updateRun}
        />
      ))}
    </div>
  );
};

interface CollapsibleWeekProps {
  weekPlan: WeekPlan;
  editable: boolean;
  weekIndex: number;
  updateRun: (weekIdx: number, runIdx: number, field: string, value: unknown) => void;
}

const CollapsibleWeek: React.FC<CollapsibleWeekProps> = ({
  weekPlan,
  editable,
  weekIndex,
  updateRun,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="border border-gray-300 rounded shadow-sm mb-4">
      <div
        className="flex justify-between items-center p-4 bg-gray-300 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h3 className="text-xl font-semibold text-gray-800">
          Week {weekPlan.weekNumber} - Total Mileage: {weekPlan.weeklyMileage}{" "}
          {weekPlan.unit}
        </h3>
        <span className="text-2xl">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div className="p-4 bg-gray-400 text-gray-800">
          <ul className="space-y-3">
            {weekPlan.runs.map((run, index) => (
              <li key={index} className="border-t border-gray-300 pt-2 space-y-1">
                <p>
                  <strong>Type:</strong>{" "}
                  {run.type.charAt(0).toUpperCase() + run.type.slice(1)}
                </p>
                {editable ? (
                  <div className="space-y-1">
                    <label className="block">
                      <span className="mr-2">Mileage:</span>
                      <input
                        type="number"
                        step="0.1"
                        value={run.mileage}
                        onChange={(e) =>
                          updateRun(
                            weekIndex,
                            index,
                            "mileage",
                            Math.round(Number(e.target.value) * 10) / 10
                          )
                        }
                        className="border p-1 rounded text-black"
                      />
                      <span className="ml-1">{run.unit}</span>
                    </label>
                    <label className="block">
                      <span className="mr-2">Target Pace:</span>
                      <input
                        type="text"
                        value={run.targetPace.pace}
                        onChange={(e) =>
                          updateRun(weekIndex, index, "targetPace", {
                            ...run.targetPace,
                            pace: formatPace(parsePace(e.target.value)),
                          })
                        }
                        className="border p-1 rounded text-black"
                      />
                    </label>
                    <label className="block">
                      <span className="mr-2">Notes:</span>
                      <input
                        type="text"
                        value={run.notes || ""}
                        onChange={(e) =>
                          updateRun(weekIndex, index, "notes", e.target.value)
                        }
                        className="border p-1 rounded text-black w-full"
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <p>
                      <strong>Mileage:</strong> {run.mileage} {run.unit}
                    </p>
                    <p>
                      <strong>Target Pace:</strong> {run.targetPace.pace} per {run.targetPace.unit}
                    </p>
                    {run.notes && (
                      <p>
                        <strong>Notes:</strong> {run.notes}
                      </p>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RunningPlanDisplay;
