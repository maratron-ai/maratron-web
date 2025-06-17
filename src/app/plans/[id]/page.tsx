"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRunningPlan, updateRunningPlan } from "@lib/api/plan";
import { assignDatesToPlan } from "@utils/running/planDates";
import type { RunningPlan } from "@maratypes/runningPlan";
import RunningPlanDisplay from "@components/training/RunningPlanDisplay";
import { Button, Spinner } from "@components/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PlanPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<RunningPlan | null>(null);
  const [planData, setPlanData] = useState<RunningPlan["planData"] | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const fetched: RunningPlan = await getRunningPlan(id);
        if (fetched.planData) {
          fetched.planData = assignDatesToPlan(fetched.planData, {
            startDate: fetched.startDate?.toString(),
            endDate: fetched.endDate?.toString(),
          });
        }
        if (session?.user && fetched.userId !== session.user.id) {
          router.push("/home");
          return;
        }
        setPlan(fetched);
        setPlanData(fetched.planData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id, session?.user, router]);

  if (status === "loading" || loading) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center py-4">
          <Spinner className="h-5 w-5" />
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-4">
        Plan not found.
      </main>
    );
  }

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">{plan.name}</h1>
      <div className="mb-4 space-x-2">
        <Button
          onClick={() => setEditing((e) => !e)}
          className="block w-auto border-none focus:outline-none focus:ring-0 text-foreground bg-transparent no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
        >
          {editing ? "Cancel" : "Edit"}
        </Button>
        {editing && (
          <Button
            onClick={async () => {
              if (!plan.id || !planData) return;
              try {
                await updateRunningPlan(plan.id, { planData });
                setEditing(false);
                setPlan((p) => (p ? { ...p, planData } : p));
              } catch (err) {
                console.error(err);
              }
            }}
            className="block w-auto border-none focus:outline-none focus:ring-0 text-foreground bg-transparent no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
          >
            Save
          </Button>
        )}
      </div>
      {planData && (
        <RunningPlanDisplay
          planData={planData}
          planName={plan.name}
          editable={editing}
          onPlanChange={setPlanData}
        />
      )}
    </main>
  );
}
