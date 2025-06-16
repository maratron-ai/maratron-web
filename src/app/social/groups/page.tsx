"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import { listGroups } from "@lib/api/social";
import type { RunGroup } from "@maratypes/social";
import { Button, Spinner } from "@components/ui";

export default function GroupsPage() {
  const { profile, loading: profileLoading } = useSocialProfile();
  const [groups, setGroups] = useState<RunGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listGroups(profile?.id);
        setGroups(data);
      } finally {
        setLoading(false);
      }
    };
    if (!profileLoading) load();
  }, [profile?.id, profileLoading]);

  const yourGroups = groups.filter((g) => g.isMember);
  const otherGroups = groups.filter((g) => !g.isMember);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Run Groups</h1>
          <Button asChild>
            <Link href="/social/groups/new">Create Group</Link>
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner className="h-4 w-4" />
          </div>
        ) : (
          <div className="space-y-6">
            {yourGroups.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Your Groups</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {yourGroups.map((g) => (
                    <li key={g.id}>
                      <Link href={`/social/groups/${g.id}`} className="hover:underline">
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold mb-2">All Groups</h2>
              <ul className="list-disc ml-6 space-y-1">
                {otherGroups.map((g) => (
                  <li key={g.id}>
                    <Link href={`/social/groups/${g.id}`} className="hover:underline">
                      {g.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
