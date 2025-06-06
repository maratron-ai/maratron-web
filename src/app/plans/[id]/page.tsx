"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRunningPlan } from "@lib/api/plan";
import type { RunningPlan } from "@maratypes/runningPlan";
import RunningPlanDisplay from "@components/RunningPlanDisplay";

interface PageProps {
  params: { id: string };
}

export default function PlanPage({ params }: PageProps) {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<RunningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const fetched: RunningPlan = await getRunningPlan(params.id);
        if (session?.user && fetched.userId !== session.user.id) {
          router.push("/home");
          return;
        }
        setPlan(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [params.id, session?.user, router]);

  if (status === "loading" || loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!plan) {
    return <div className="p-4">Plan not found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Training Plan</h1>
      <RunningPlanDisplay planData={plan.planData} />
    </div>
  );
}
