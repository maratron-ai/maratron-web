"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { listRuns } from "@lib/api/run";
import { Card } from "@components/ui";
import { useUserProfile } from "@hooks/useUserProfile";

export default function DashboardStats() {
  const { data: session } = useSession();
  const { profile } = useUserProfile();
  const [runCount, setRunCount] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [unit, setUnit] = useState<"miles" | "kilometers">("miles");

  useEffect(() => {
    async function fetchRuns() {
      try {
        const runs = await listRuns();
        const filtered = session?.user
          ? runs.filter((r) => r.userId === session.user.id)
          : runs;
        setRunCount(filtered.length);

        const defaultUnit = profile?.defaultDistanceUnit || "miles";
        setUnit(defaultUnit);

        const total = filtered.reduce((sum, r) => {
          if (r.distanceUnit === defaultUnit) return sum + r.distance;
          if (r.distanceUnit === "miles" && defaultUnit === "kilometers") {
            return sum + r.distance * 1.60934;
          }
          if (r.distanceUnit === "kilometers" && defaultUnit === "miles") {
            return sum + r.distance * 0.621371;
          }
          return sum;
        }, 0);
        setTotalDistance(total);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRuns();
  }, [session?.user, profile?.defaultDistanceUnit]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Link href="/runs">
        <Card className="p-4 text-center hover:bg-accent-3/10 cursor-pointer">
          <div className="text-2xl font-bold">{runCount}</div>
          <div className="text-sm text-muted-foreground">Total Runs</div>
        </Card>
      </Link>
      <Card className="p-4 text-center">
        <div className="text-2xl font-bold flex items-baseline justify-center gap-1">
          {totalDistance.toFixed(1)}
          <span className="text-base text-muted-foreground">
            {unit === "miles" ? "mi" : "km"}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">Total Distance</div>
      </Card>
    </div>
  );
}
