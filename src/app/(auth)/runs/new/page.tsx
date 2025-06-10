import CreateRun from "@components/CreateRun";
import { Card } from "@components/ui";

const NewRunPage = () => (
  <main className="p-4 flex justify-center">
    <Card className="w-full max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Add a Run</h1>
      <CreateRun />
    </Card>
  </main>
);

export default NewRunPage;
