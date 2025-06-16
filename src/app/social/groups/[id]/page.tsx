"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import SocialFeed from "@components/social/SocialFeed";
import { Button, Spinner } from "@components/ui";
import type { RunGroup } from "@maratypes/social";

export default function GroupPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [group, setGroup] = useState<RunGroup | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroup = async () => {
    try {
      const { data } = await axios.get<RunGroup>(
        `/api/social/groups/${params.id}?profileId=${session?.user?.id ?? ""}`
      );
      setGroup(data);
    } catch {
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const handleJoin = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }
    await axios.post(`/api/social/groups/${params.id}/join`, {
      profileId: session.user.id,
    });
    fetchGroup();
  };

  if (loading)
    return (
      <div className="w-full px-4 py-6 flex justify-center">
        <Spinner className="h-4 w-4" />
      </div>
    );
  if (!group) return <p className="w-full px-4 py-6">Group not found.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          {!group.isMember && (
            <Button onClick={handleJoin}>Join Group</Button>
          )}
        </div>
        {group.description && <p>{group.description}</p>}
        <SocialFeed groupId={group.id} />
      </main>
    </div>
  );
}
