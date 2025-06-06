"use client";

import { Run } from "@maratypes/run";
import { Card } from "@components/ui";

interface RunModalProps {
  run: Run;
  onClose: () => void;
}

export default function RunModal({ run, onClose }: RunModalProps) {
  if (!run) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="relative max-w-sm w-full">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-2">
          {new Date(run.date).toLocaleDateString()}
        </h2>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Distance:</span> {run.distance} {run.distanceUnit}
          </p>
          <p>
            <span className="font-semibold">Duration:</span> {run.duration}
          </p>
          {run.pace && (
            <p>
              <span className="font-semibold">Pace:</span> {run.pace.pace} /{run.pace.unit}
            </p>
          )}
          {run.elevationGain !== undefined && (
            <p>
              <span className="font-semibold">Elevation Gain:</span> {run.elevationGain} {run.elevationGainUnit}
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
