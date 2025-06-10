"use client";

import PaceCalculator from "@components/PaceCalculator";
import CreateRun from "@components/CreateRun";
import AuthTest from "@components/AuthTest";
import PlanGenerator from "@components/PlanGenerator";
import CreateShoe from "@components/CreateShoe";
import { Card } from "@components/ui";

const ProfilePage = () => {
  return (
    <main className="p-4 flex justify-center">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Profile Page</h1>
        <PaceCalculator />
        <CreateRun />
        <AuthTest />
        <PlanGenerator />
        <CreateShoe />
      </Card>
    </main>
  );
};

export default ProfilePage;
