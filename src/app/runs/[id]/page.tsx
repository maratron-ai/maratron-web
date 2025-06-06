"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRun } from "@lib/api/run";
import type { Run } from "@maratypes/run";

interface PageProps {
  params: { id: string };
}

export default function RunPage({ params }: PageProps) {
  const { data: session, status } = useSession();
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const fetched: Run = await getRun(params.id);
        if (session?.user && fetched.userId !== session.user.id) {
          router.push("/home");
          return;
        }
        setRun(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRun();
  }, [params.id, session?.user, router]);

  if (status === "loading" || loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!run) {
    return <div className="p-4">Run not found.</div>;
  }

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
