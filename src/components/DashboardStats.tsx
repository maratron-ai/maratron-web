"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { listRuns } from "@lib/api/run";
import { listRunningPlans } from "@lib/api/plan";
import { Card } from "@components/ui";
import { Activity, Flag, ClipboardList } from "lucide-react";

export default function DashboardStats() {
  const { data: session } = useSession();
  const [totalRuns, setTotalRuns] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      try {
        const runs = await listRuns();
        const userRuns = runs.filter((r) => r.userId === session.user.id);
        setTotalRuns(userRuns.length);
        setTotalDistance(
          userRuns.reduce((sum, r) => sum + r.distance, 0)
        );

        const plans = await listRunningPlans();
        const active = plans.find(
          (p) => p.userId === session.user?.id && p.active
        );
        setActivePlan(active?.name ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  if (loading) return <p className="text-gray-500">Loading summary...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
      <Card className="flex items-center space-x-4">
        <Activity className="text-primary" />
        <div>
          <p className="text-2xl font-bold">{totalRuns}</p>
          <p className="text-sm text-foreground/70">Total Runs</p>
        </div>
      </Card>
      <Card className="flex items-center space-x-4">
        <Flag className="text-primary" />
        <div>
          <p className="text-2xl font-bold">{totalDistance.toFixed(1)}</p>
          <p className="text-sm text-foreground/70">Total Distance</p>
        </div>
      </Card>
      <Card className="flex items-center space-x-4">
        <ClipboardList className="text-primary" />
        <div>
          <p className="text-lg font-semibold">
            {activePlan || "No Active Plan"}
          </p>
          <p className="text-sm text-foreground/70">Training Plan</p>
        </div>
      </Card>
    </div>
  );
}
