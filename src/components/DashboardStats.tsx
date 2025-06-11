"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { listRuns } from "@lib/api/run";
import { Card } from "@components/ui";

export default function DashboardStats() {
  const { data: session } = useSession();
  const [runCount, setRunCount] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    async function fetchRuns() {
      try {
        const runs = await listRuns();
        const filtered = session?.user
          ? runs.filter((r) => r.userId === session.user.id)
          : runs;
        setRunCount(filtered.length);
        setTotalDistance(
          filtered.reduce((sum, r) => sum + r.distance, 0)
        );
      } catch (err) {
        console.error(err);
      }
    }
    fetchRuns();
  }, [session?.user]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold">{runCount}</div>
        <div className="text-sm text-muted-foreground">Total Runs</div>
      </Card>
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold">{totalDistance.toFixed(1)}</div>
        <div className="text-sm text-muted-foreground">Total Distance</div>
      </Card>
    </div>
  );
}
