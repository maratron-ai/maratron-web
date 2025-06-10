import CreateShoe from "@components/CreateShoe";
import ShoesList from "@components/ShoesList";
import { Card } from "@components/ui";

export default function NewShoePage() {
  return (
    <main className="p-4 flex justify-center">
      <Card className="w-full max-w-xl p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">Add a Shoe</h1>
          <CreateShoe />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Shoes</h2>
          <ShoesList />
        </div>
      </Card>
    </main>
  );
}
