import React, { useState } from "react";
import { RunningPlanData, WeekPlan, PlannedRun } from "@maratypes/runningPlan";
import { DayOfWeek } from "@maratypes/basics";
import { setDayForRunType } from "@utils/running/setRunDay";
import { parsePace, formatPace } from "@utils/running/paces";
import RunTypeDayMatrix from "./RunTypeDayMatrix";

interface RunningPlanDisplayProps {
  planData: RunningPlanData;
  planName?: string;
  editable?: boolean;
  onPlanChange?: (plan: RunningPlanData) => void;
}

const RunningPlanDisplay: React.FC<RunningPlanDisplayProps> = ({
  planData,
  planName,
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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        {planName || "Your Running Plan"}
      </h2>
      {editable && (
        <BulkDaySetter
          planData={planData}
          onPlanChange={onPlanChange}
        />
      )}
      <RunTypeDayMatrix
        planData={planData}
        editable={editable}
        onPlanChange={onPlanChange}
      />
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
  const isWeekComplete = weekPlan.runs.every(run => run.done);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const days: DayOfWeek[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const runTypes = ["easy", "tempo", "interval", "long", "marathon"] as const;

  return (
    <div
      className={`border border-accent rounded shadow-sm mb-4 ${
        isWeekComplete ? "bg-background text-foreground/60" : ""
      }`}
    >
      <div
        className={`flex justify-between items-center p-4 cursor-pointer ${
          isWeekComplete ? "bg-accent" : "bg-accent/30"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h3 className="text-xl font-semibold text-foreground">
          Week {weekPlan.weekNumber}
          {weekPlan.phase && ` – ${weekPlan.phase} phase`} - Total Mileage:
          {" "}
          {weekPlan.weeklyMileage} {weekPlan.unit}
          {weekPlan.notes && ` – ${weekPlan.notes}`}
          {isWeekComplete ? " (Complete)" : ""}
        </h3>
        <span className="text-2xl">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div
          className={`p-4 text-foreground ${
            isWeekComplete ? "bg-background" : "bg-accent/50"
          }`}
        >
          <p className="mb-2">Start: {weekPlan.startDate?.slice(0, 10)}</p>
          {weekPlan.notes && <p className="mb-2">{weekPlan.notes}</p>}
          <ul className="space-y-3">
            {weekPlan.runs.map((run, index) => {
              const past = run.date ? new Date(run.date) < new Date() : false;
              const classes =
                past || run.done ? "text-foreground/60 line-through" : "";
              return (
                <li
                  key={index}
                  className={`border-t border-accent pt-2 space-y-1 ${classes}`}
                >
                  {editable ? (
                    <div className="space-y-1">
                      <label className="block">
                        <span className="mr-2">Type:</span>
                        <select
                          value={run.type}
                          onChange={(e) =>
                            updateRun(
                              weekIndex,
                              index,
                              "type",
                              e.target.value
                            )
                          }
                          className="border p-1 rounded text-foreground"
                        >
                          {runTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
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
                          className="border p-1 rounded text-foreground"
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
                          className="border p-1 rounded text-foreground"
                        />
                      </label>
                      <label className="block">
                        <span className="mr-2">Day:</span>
                        <select
                          value={run.day || "Sunday"}
                          onChange={(e) =>
                            updateRun(
                              weekIndex,
                              index,
                              "day",
                              e.target.value as DayOfWeek
                            )
                          }
                          className="border p-1 rounded text-foreground"
                        >
                          {days.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mr-2">Notes:</span>
                        <input
                          type="text"
                          value={run.notes || ""}
                          onChange={(e) =>
                            updateRun(weekIndex, index, "notes", e.target.value)
                          }
                          className="border p-1 rounded text-foreground w-full"
                        />
                      </label>
                      <label className="block">
                        <input
                          type="checkbox"
                          checked={run.done || false}
                          onChange={(e) =>
                            updateRun(
                              weekIndex,
                              index,
                              "done",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        Mark done
                      </label>
                    </div>
                  ) : (
                    <>
                      <p>
                        <strong>Type:</strong>{" "}
                        {run.type.charAt(0).toUpperCase() + run.type.slice(1)}
                      </p>
                      <p>
                        <strong>Mileage:</strong> {run.mileage} {run.unit}
                      </p>
                      <p>
                        <strong>Target Pace:</strong> {run.targetPace.pace} per{" "}
                        {run.targetPace.unit}
                      </p>
                      {run.day && (
                        <p>
                          <strong>Day:</strong> {run.day}
                        </p>
                      )}
                      {run.date && (
                        <p>
                          <strong>Date:</strong> {run.date.slice(0, 10)}
                        </p>
                      )}
                      {run.notes && (
                        <p>
                          <strong>Notes:</strong> {run.notes}
                        </p>
                      )}
                      {typeof run.done !== "undefined" && (
                        <p>
                          <input
                            type="checkbox"
                            checked={run.done}
                            onChange={(e) =>
                              updateRun(
                                weekIndex,
                                index,
                                "done",
                                e.target.checked
                              )
                            }
                            className="mr-2"
                            disabled={!editable}
                          />
                          <span>Done</span>
                        </p>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

interface BulkDaySetterProps {
  planData: RunningPlanData;
  onPlanChange?: (plan: RunningPlanData) => void;
}

const BulkDaySetter: React.FC<BulkDaySetterProps> = ({ planData, onPlanChange }) => {
  const days: DayOfWeek[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const runTypes: PlannedRun["type"][] = ["easy", "tempo", "interval", "long", "marathon"];
  const [type, setType] = useState<PlannedRun["type"]>("easy");
  const [day, setDay] = useState<DayOfWeek>("Monday");

  const apply = () => {
    if (!onPlanChange) return;
    const updated = setDayForRunType(planData, type, day);
    onPlanChange(updated);
  };

  return (
    <div className="mb-4 flex items-center gap-2 justify-center">
      <span>Set all</span>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as PlannedRun["type"])}
        className="border p-1 rounded text-foreground"
      >
        {runTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <span>runs to</span>
      <select
        value={day}
        onChange={(e) => setDay(e.target.value as DayOfWeek)}
        className="border p-1 rounded text-foreground"
      >
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={apply}
        className="bg-primary text-foreground px-3 py-1 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default RunningPlanDisplay;
