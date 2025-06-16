import Link from "next/link";
import { Button } from "@components/ui";

export default function GroupsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <h1 className="text-2xl font-bold">Run Groups</h1>
        <Button asChild>
          <Link href="/social/groups/new">Create Group</Link>
        </Button>
      </main>
    </div>
  );
}
