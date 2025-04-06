import React, { useState } from "react";
import { RunningPlanData, WeekPlan } from "@maratypes/runningPlan";

interface RunningPlanDisplayProps {
  planData: RunningPlanData;
}

const RunningPlanDisplay: React.FC<RunningPlanDisplayProps> = ({
  planData,
}) => {
  return (
    <div className="container p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Your Running Plan</h2>
      {planData.schedule.map((weekPlan) => (
        <CollapsibleWeek key={weekPlan.weekNumber} weekPlan={weekPlan} />
      ))}
    </div>
  );
};

interface CollapsibleWeekProps {
  weekPlan: WeekPlan;
}

const CollapsibleWeek: React.FC<CollapsibleWeekProps> = ({ weekPlan }) => {
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
              <li key={index} className="border-t border-gray-300 pt-2">
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
                {run.notes && (
                  <p>
                    <strong>Notes:</strong> {run.notes}
                  </p>
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
