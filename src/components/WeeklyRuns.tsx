"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { listRunningPlans, updateRunningPlan } from "@lib/api/plan";
import { createRun } from "@lib/api/run";
import { Card, Select, SelectTrigger, SelectContent, SelectItem, SelectValue, Checkbox, Progress } from "@components/ui";
import type { RunningPlan } from "@maratypes/runningPlan";
import { assignDatesToPlan } from "@utils/running/planDates";
import { calculateDurationFromPace } from "@utils/running/calculateDuration";

export default function WeeklyRuns() {
  const { data: session } = useSession();
  const [plan, setPlan] = useState<RunningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const handle = () => setRefresh((r) => r + 1);
    window.addEventListener("activePlanChanged", handle);
    return () => window.removeEventListener("activePlanChanged", handle);
  }, []);

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
  }, [session?.user?.id, refresh]);

  if (loading) return <p className="text-foreground/60">Loading...</p>;
  if (!plan) return <p className="text-foreground/60">No active plan.</p>;

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
  if (weekIndex < 0) {
    return (
      <p className="text-foreground/60">
        {plan.name} training begins {plan.planData.startDate?.slice(0, 10)}
      </p>
    );
  }
  if (!plan.planData.schedule[weekIndex]) {
    return <p className="text-foreground/60">Plan completed!</p>;
  }
  const week = plan.planData.schedule[weekIndex];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;

  const changeDay = async (idx: number, day: typeof days[number]) => {
    if (!plan || !plan.id) return;
    const updated = { ...plan };
    updated.planData.schedule[weekIndex].runs[idx].day = day;
    updated.planData = assignDatesToPlan(updated.planData, {
      startDate: plan.startDate?.toString(),
      endDate: plan.endDate?.toString(),
    });
    try {
      await updateRunningPlan(plan.id, { planData: updated.planData });
      setPlan(updated);
    } catch (err) {
      console.error(err);
    }
  };

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
          date: new Date().toISOString(),
          duration: calculateDurationFromPace(run.mileage, run.targetPace.pace),
          distance: run.mileage,
          distanceUnit: run.unit,
          userId: plan.userId,
          name: `Week ${weekIndex + 1} - ${run.type}`,
        });
      }
      setPlan(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const completed = week.runs.filter((r) => r.done).length;
  const progressValue = (completed / week.runs.length) * 100;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        {plan.name} - Week {week.weekNumber}
      </h3>
      <Progress value={progressValue} />
      <div className="space-y-2">
        {week.runs.map((r, i) => {
          const classes = r.done ? "text-foreground/60 line-through" : undefined;
          return (
            <Card key={i} className={`flex items-center justify-between ${classes}`}>
              <div>
                <p className="font-semibold">
                  {r.date?.slice(0, 10)} - {r.type}
                </p>
                <p>
                  {r.mileage} {r.unit} @ {r.targetPace.pace}
                </p>
                {r.notes && <p className="text-sm">{r.notes}</p>}
                <label className="block text-sm mt-1">
                  <span className="mr-2">Day:</span>
                  <Select
                    value={r.day || "Sunday"}
                    onValueChange={(val) => changeDay(i, val as typeof days[number])}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </div>
              <label className="flex items-center space-x-2">
                <Checkbox checked={r.done || false} onCheckedChange={() => toggleDone(i)} />
                <span>{r.done ? "Completed" : "Mark done"}</span>
              </label>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
