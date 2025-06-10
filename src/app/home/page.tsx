"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, Button } from "@components/ui";
import RecentRuns from "@components/RecentRuns";
import TrainingPlansList from "@components/TrainingPlansList";
import WeeklyRuns from "@components/WeeklyRuns";
import ShoesList from "@components/ShoesList";

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
            <Card className="p-4 flex items-center justify-center">
              <Button asChild className="w-full">
                <Link href="/runs/new">Add a Run</Link>
              </Button>
            </Card>
            <Card className="p-4 flex items-center justify-center">
              <Button asChild className="w-full">
                <Link href="/plan-generator">Generate Training Plan</Link>
              </Button>
            </Card>
            <Card className="p-4 flex items-center justify-center">
              <Button asChild className="w-full">
                <Link href="/shoes/new">Add New Shoes</Link>
              </Button>
            </Card>
            <Card className="p-4 flex items-center justify-center">
              <Button asChild className="w-full">
                <Link href="/userProfile">Edit Profile</Link>
              </Button>
            </Card>
            <Card className="p-4 flex items-center justify-center">
              <Button disabled className="w-full" variant="secondary">
                Upload workout file (coming soon)
              </Button>
            </Card>
            <Card className="p-4 flex items-center justify-center">
              <Button disabled className="w-full" variant="secondary">
                View progress analytics (coming soon)
              </Button>
            </Card>
          </div>
        </div>
      </section>
      <h2 className="text-2xl font-semibold mb-4">Recent Runs</h2>
      <div className="max-w-4xl mx-auto">
        <section>
          <RecentRuns />
        </section>
      </div>

      <h2 className="text-2xl font-semibold mb-4">This Week&apos;s Runs</h2>
      <div className="max-w-4xl mx-auto">
        <section>
          <WeeklyRuns />
        </section>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Your Training Plan</h2>
      <div className="max-w-4xl mx-auto">
        <section>
          <TrainingPlansList />
        </section>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Shoes</h2>
      <div className="max-w-4xl mx-auto">
        <section>
          <ShoesList />
        </section>
      </div>
    </main>
  );
}
