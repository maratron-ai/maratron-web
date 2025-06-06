"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import RecentRuns from "@components/RecentRuns";
import TrainingPlansList from "@components/TrainingPlansList";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main className="p-6">Loading...</main>;
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Maratron</h1>
        <p className="mb-6">
          Please{" "}
          <Link href="/login" className="underline text-primary">
            sign in
          </Link>{" "}
          to access your dashboard.
        </p>
      </main>
    );
  }

  const userName = session.user.name || session.user.email;

  return (
    <main className="min-h-screen bg-background text-foreground p-4 space-y-10">
      <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        {/* Wrap grid in a max-width container */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/runs/new"
              className="border rounded p-4 hover:bg-accent/20"
            >
              Add a Run
            </Link>
            <Link
              href="/plan-generator"
              className="border rounded p-4 hover:bg-accent/20"
            >
              Generate Training Plan
            </Link>
            <Link
              href="/shoes/new"
              className="border rounded p-4 hover:bg-accent/20"
            >
              Add New Shoes
            </Link>
            <Link
              href="/userProfile"
              className="border rounded p-4 hover:bg-accent/20"
            >
              Edit Profile
            </Link>
            <div className="border rounded p-4 text-gray-500">
              Upload workout file (coming soon)
            </div>
            <div className="border rounded p-4 text-gray-500">
              View progress analytics (coming soon)
            </div>
          </div>
        </div>
      </section>
      <h2 className="text-2xl font-semibold mb-4">Recent Runs</h2>
      <div className="max-w-4xl mx-auto">
        <section>
          <RecentRuns />
        </section>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Your Training Plan</h2>
      <div className="max-w-4xl mx-auto">
        <section>
          <TrainingPlansList />
        </section>
      </div>
    </main>
  );
}
