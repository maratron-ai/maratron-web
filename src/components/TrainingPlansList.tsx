"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { listRunningPlans } from "@lib/api/plan";
import type { RunningPlan } from "@maratypes/runningPlan";

export default function TrainingPlansList() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<RunningPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const allPlans: RunningPlan[] = await listRunningPlans();
        const userId = session?.user?.id;
        let filtered = allPlans;
        if (userId) {
          filtered = allPlans.filter((p) => p.userId === userId);
        }
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt ?? "").getTime() -
            new Date(a.createdAt ?? "").getTime()
        );
        setPlans(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [session?.user?.id]);

  if (loading) return <p className="text-gray-500">Loading plans...</p>;
  if (plans.length === 0)
    return <p className="text-gray-500">No plans saved.</p>;

  return (
    <ul className="space-y-2">
      {plans.map((plan) => (
        <li key={plan.id} className="border p-2 rounded">
          <Link href={`/plans/${plan.id ?? ""}`} className="block">
            <span className="font-semibold">
              {plan.createdAt
                ? new Date(plan.createdAt).toLocaleDateString()
                : "Unnamed Plan"}
            </span>
            {plan.planData?.weeks && ` - ${plan.planData.weeks} weeks`}
          </Link>
        </li>
      ))}
    </ul>
  );
}
