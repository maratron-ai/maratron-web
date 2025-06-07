"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { listRunningPlans, updateRunningPlan } from "@lib/api/plan";
import { createRun } from "@lib/api/run";
import type { RunningPlan } from "@maratypes/runningPlan";
import { assignDatesToPlan } from "@utils/running/planDates";
import { calculateDurationFromPace } from "@utils/running/calculateDuration";

export default function WeeklyRuns() {
  const { data: session } = useSession();
  const [plan, setPlan] = useState<RunningPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plans: RunningPlan[] = await listRunningPlans();
        const active = plans.find(
          (p) => p.active && p.userId === session?.user?.id
        );
        if (active && active.planData) {
          active.planData = assignDatesToPlan(active.planData, {
            startDate: active.startDate?.toString(),
            endDate: active.endDate?.toString(),
          });
          setPlan(active);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [session?.user?.id]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!plan) return <p className="text-gray-500">No active plan.</p>;

  let weekIndex: number;
  if (plan.planData.startDate) {
    const start = new Date(plan.planData.startDate);
    const now = new Date();
    weekIndex = Math.floor(
      (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
        Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
        (7 * 24 * 60 * 60 * 1000)
    );
  } else {
    weekIndex = plan.planData.schedule.findIndex((w) => !w.done);
  }
  if (weekIndex < 0 || !plan.planData.schedule[weekIndex]) {
    return <p className="text-gray-500">Plan completed!</p>;
  }
  const week = plan.planData.schedule[weekIndex];

  const toggleDone = async (idx: number) => {
    if (!plan || !plan.id) return;
    const updated = { ...plan };
    const run = updated.planData.schedule[weekIndex].runs[idx];
    const wasDone = run.done ?? false;
    run.done = !run.done;
    updated.planData.schedule[weekIndex].done = updated.planData.schedule[
      weekIndex
    ].runs.every((r) => r.done);
    try {
      await updateRunningPlan(plan.id, { planData: updated.planData });
      if (!wasDone && run.done) {
        await createRun({
          date: run.date ?? new Date().toISOString(),
          duration: calculateDurationFromPace(run.mileage, run.targetPace.pace),
          distance: run.mileage,
          distanceUnit: run.unit,
          userId: plan.userId,
          name: `${run.type} run`,
        });
      }
      setPlan(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">Runs this week</h3>
      <ul className="space-y-1">
        {week.runs.map((r, i) => (
          <li
            key={i}
            className={r.done ? "text-gray-500 line-through" : undefined}
          >
            <label className="space-x-2">
              <input
                type="checkbox"
                checked={r.done || false}
                onChange={() => toggleDone(i)}
              />
              <span>
                {r.date?.slice(0, 10)} - {r.type} {r.mileage} {r.unit}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
