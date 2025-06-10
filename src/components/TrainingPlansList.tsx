"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { listRunningPlans, updateRunningPlan, deleteRunningPlan } from "@lib/api/plan";
import type { RunningPlan } from "@maratypes/runningPlan";
import { Card, Button } from "@components/ui";

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

  const setActive = async (id: string) => {
    try {
      await Promise.all(
        plans.map((p) =>
          p.id
            ? updateRunningPlan(p.id, { active: p.id === id })
            : Promise.resolve()
        )
      );
      setPlans((prev) =>
        prev.map((p) => ({ ...p, active: p.id === id }))
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("activePlanChanged"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    try {
      await deleteRunningPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-gray-500">Loading plans...</p>;
  if (plans.length === 0)
    return <p className="text-gray-500">No plans saved.</p>;

  return (
    <div className="space-y-2">
      {plans.map((plan) => (
        <Card key={plan.id} className="flex justify-between items-start">
          <div>
            <Link href={`/plans/${plan.id ?? ""}`} className="font-semibold underline">
              {plan.name}
            </Link>
            <div className="text-sm">
              {plan.planData?.weeks && <span>{plan.planData.weeks} weeks</span>}
              {plan.startDate && (
                <span className="ml-2">
                  {new Date(plan.startDate).toLocaleDateString()} -
                  {" "}
                  {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : ""}
                </span>
              )}
              {plan.active && (
                <span className="ml-2 text-green-600 font-medium">active</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 space-x-4">
            {!plan.active && plan.id && (
              <Button onClick={() => setActive(plan.id!)} className="text-sm px-2 py-1">
                Set Active
              </Button>
            )}
            {plan.id && (
              <Button
                onClick={() => deletePlan(plan.id!)}
                className="text-sm px-2 py-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
