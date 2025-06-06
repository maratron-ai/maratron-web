"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { listRuns } from "@lib/api/run";
import type { Run } from "@maratypes/run";

export default function RecentRuns() {
  const { data: session } = useSession();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const allRuns: Run[] = await listRuns();
        const userId = session?.user?.id;
        let filtered = allRuns;
        if (userId) {
          filtered = allRuns.filter((r) => r.userId === userId);
        }
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRuns(filtered.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, [session?.user?.id]);

  if (loading) return <p className="text-gray-500">Loading runs...</p>;
  if (runs.length === 0)
    return <p className="text-gray-500">No runs recorded yet.</p>;

  return (
    <ul className="space-y-2">
      {runs.map((run) => (
        <li key={run.id} className="border p-2 rounded">
          <span className="font-semibold">
            {new Date(run.date).toLocaleDateString()}
          </span>
          {`: ${run.distance} ${run.distanceUnit}`}
        </li>
      ))}
    </ul>
  );
}
