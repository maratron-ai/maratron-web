"use client";

import { useEffect, useState } from "react";
import { getRun } from "@lib/api/run";
import type { Run } from "@maratypes/run";

export default function RunDetailPage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const fetched: Run = await getRun(params.id);
        setRun(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRun();
  }, [params.id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!run) return <div className="p-4">Run not found.</div>;

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-bold mb-4">Run Details</h1>
      <p>
        <span className="font-semibold">Date:</span>{" "}
        {new Date(run.date).toLocaleString()}
      </p>
      <p>
        <span className="font-semibold">Distance:</span>{" "}
        {run.distance} {run.distanceUnit}
      </p>
      <p>
        <span className="font-semibold">Duration:</span>{" "}
        {run.duration}
      </p>
      {run.trainingEnvironment && (
        <p>
          <span className="font-semibold">Environment:</span>{" "}
          {run.trainingEnvironment}
        </p>
      )}
      {run.elevationGain && (
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
  );
}
