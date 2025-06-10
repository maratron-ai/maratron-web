"use client";

import { Run } from "@maratypes/run";
import { Card } from "@components/ui";
import { getRunName } from "@utils/running/getRunName";

interface RunModalProps {
  run: Run;
  onClose: () => void;
}

export default function RunModal({ run, onClose }: RunModalProps) {
  if (!run) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="relative w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full">
        <button
          aria-label="Close"
          onClick={onClose}
          className="
            absolute 
            top-2 right-2 
            bg-transparent 
            text-2xl font-bold 
            text-gray-500 dark:text-gray-300 
            hover:text-gray-200 dark:hover:text-white 
            focus:outline-none
          "
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {run.name || getRunName(run)}
        </h2>
        <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
          <p>
            <span className="font-semibold">Distance:</span> {run.distance}{" "}
            {run.distanceUnit}
          </p>
          <p>
            <span className="font-semibold">Duration:</span> {run.duration}
          </p>
          {run.pace && (
            <p>
              <span className="font-semibold">Pace:</span> {run.pace.pace} /{" "}
              {run.pace.unit}
            </p>
          )}
          {run.elevationGain !== undefined && (
            <p>
              <span className="font-semibold">Elevation Gain:</span>{" "}
              {run.elevationGain} {run.elevationGainUnit}
            </p>
          )}
          {run.notes && (
            <p>
              <span className="font-semibold">Notes:</span> {run.notes}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
