"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { listRuns } from "@lib/api/run";
import { getRunName } from "@utils/running/getRunName";
import type { Run } from "@maratypes/run";
import RunModal from "@components/runs/RunModal";
import { Spinner } from "@components/ui";

export default function RunsList() {
  const { data: session } = useSession();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  const categorize = (date: Date): string => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    if (date >= startOfWeek) return "This week";
    if (date >= startOfMonth) return "This month";
    if (date >= startOfYear) return "This year";
    return "1 year +";
  };

  const groupedRuns = runs.reduce<Record<string, Run[]>>((acc, run) => {
    const key = categorize(new Date(run.date));
    if (!acc[key]) acc[key] = [];
    acc[key].push(run);
    return acc;
  }, {});

  const sections = ["This week", "This month", "This year", "1 year +"];

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
        setRuns(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
    const handle = () => fetchRuns();
    window.addEventListener("runsUpdated", handle);
    return () => window.removeEventListener("runsUpdated", handle);
  }, [session?.user?.id]);

  if (loading)
    return (
      <div className="flex justify-center py-4">
        <Spinner className="h-4 w-4" />
      </div>
    );
  if (runs.length === 0)
    return <p className="text-foreground opacity-60">No runs recorded yet.</p>;

  return (
    <>
      {sections.map((section) => {
        const list = groupedRuns[section];
        if (!list || list.length === 0) return null;
        return (
          <div key={section} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{section}</h2>
            <ul className="space-y-2">
              {list.map((run) => (
                <li
                  key={run.id}
                  className="border p-2 rounded cursor-pointer hover:bg-accent hover:opacity-10"
                  onClick={() => setSelectedRun(run)}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {run.name || getRunName(run)}
                    </span>
                    <span className="text-sm opacity-70">
                      {new Date(run.date).toISOString().slice(0, 10)}
                    </span>
                  </div>
                  <span>{`${run.distance} ${run.distanceUnit}`}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {selectedRun && (
        <RunModal run={selectedRun} onClose={() => setSelectedRun(null)} />
      )}
    </>
  );
}
