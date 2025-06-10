import PlanGenerator from "@components/PlanGenerator";
import { Card } from "@components/ui";

const PlanGeneratorPage = () => {
  return (
    <main className="p-4 flex justify-center">
      <Card className="w-full max-w-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Plan Generator</h1>
        <PlanGenerator />
      </Card>
    </main>
  );
};

export default PlanGeneratorPage;
