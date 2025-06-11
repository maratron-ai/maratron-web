"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import RecentRuns from "@components/RecentRuns";
import TrainingPlansList from "@components/TrainingPlansList";
import WeeklyRuns from "@components/WeeklyRuns";
import ShoesList from "@components/ShoesList";
import DashboardStats from "@components/DashboardStats";
import { Card } from "@components/ui";
import {
  PlusCircle,
  ClipboardList,
  Shoe,
  User as UserIcon,
  Upload,
  BarChart2,
} from "lucide-react";

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

      <DashboardStats />

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        {/* Wrap grid in a max-width container */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/runs/new" className="block">
              <Card className="flex items-center gap-2 hover:bg-accent/10 transition">
                <PlusCircle className="text-primary" />
                <span>Add a Run</span>
              </Card>
            </Link>
            <Link href="/plan-generator" className="block">
              <Card className="flex items-center gap-2 hover:bg-accent/10 transition">
                <ClipboardList className="text-primary" />
                <span>Generate Training Plan</span>
              </Card>
            </Link>
            <Link href="/shoes/new" className="block">
              <Card className="flex items-center gap-2 hover:bg-accent/10 transition">
                <Shoe className="text-primary" />
                <span>Add New Shoes</span>
              </Card>
            </Link>
            <Link href="/userProfile" className="block">
              <Card className="flex items-center gap-2 hover:bg-accent/10 transition">
                <UserIcon className="text-primary" />
                <span>Edit Profile</span>
              </Card>
            </Link>
            <Card className="flex items-center gap-2 text-gray-500">
              <Upload />
              <span>Upload workout file (coming soon)</span>
            </Card>
            <Card className="flex items-center gap-2 text-gray-500">
              <BarChart2 />
              <span>View progress analytics (coming soon)</span>
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
