import React, { useState, useEffect } from "react";
import type { DayOfWeek } from "@maratypes/basics";
import type { RunningPlanData, PlannedRun } from "@maratypes/runningPlan";
import { setDayForRunType } from "@utils/running/setRunDay";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { Card } from "@components/ui/card";

interface RunTypeDayMatrixProps {
  planData: RunningPlanData;
  editable?: boolean;
  onPlanChange?: (plan: RunningPlanData) => void;
}

const days: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const runTypes: PlannedRun["type"][] = [
  "easy",
  "tempo",
  "interval",
  "long",
  "marathon",
];

function getInitialMapping(plan: RunningPlanData): Record<PlannedRun["type"], DayOfWeek> {
  const mapping: Record<PlannedRun["type"], DayOfWeek> = {
    easy: "Monday",
    tempo: "Tuesday",
    interval: "Wednesday",
    long: "Saturday",
    marathon: "Sunday",
  };
  for (const type of runTypes) {
    for (const week of plan.schedule) {
      const found = week.runs.find(r => r.type === type && r.day);
      if (found && found.day) {
        mapping[type] = found.day;
        break;
      }
    }
  }
  return mapping;
}

const RunTypeDayMatrix: React.FC<RunTypeDayMatrixProps> = ({ planData, editable = false, onPlanChange }) => {
  const [mapping, setMapping] = useState<Record<PlannedRun["type"], DayOfWeek>>(() => getInitialMapping(planData));

  useEffect(() => {
    setMapping(getInitialMapping(planData));
  }, [planData]);

  const handleChange = (type: PlannedRun["type"], day: DayOfWeek) => {
    setMapping(prev => ({ ...prev, [type]: day }));
    if (onPlanChange) {
      const updated = setDayForRunType(planData, type, day);
      onPlanChange(updated);
    }
  };

  return (
    <Card className="p-4 mb-4 space-y-2">
      <h3 className="text-lg font-semibold">Preferred Run Days</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {runTypes.map(type => (
          <div key={type} className="flex items-center justify-between gap-2">
            <span className="capitalize">{type}</span>
            <Select
              value={mapping[type]}
              onValueChange={value => handleChange(type, value as DayOfWeek)}
              disabled={!editable || !onPlanChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {days.map(d => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RunTypeDayMatrix;
