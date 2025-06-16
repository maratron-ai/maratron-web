"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import axios from "axios";
import SocialFeed from "@components/social/SocialFeed";
import { Button, Spinner, Card } from "@components/ui";
import type { RunGroup } from "@maratypes/social";

export default function GroupPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const { profile, loading: profileLoading } = useSocialProfile();
  const router = useRouter();
  const [group, setGroup] = useState<RunGroup | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroup = async () => {
    try {
      const { data } = await axios.get<RunGroup>(
        `/api/social/groups/${params.id}?profileId=${profile?.id ?? ""}`
      );
      setGroup(data);
    } catch {
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileLoading) {
      fetchGroup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profileLoading]);

  const handleJoin = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }
    if (!profile?.id) return;
    await axios.post(`/api/social/groups/${params.id}/join`, {
      profileId: profile.id,
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
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          {!group.isMember && (
            <Button onClick={handleJoin}>Join Group</Button>
          )}
        </div>
        {group.description && <p>{group.description}</p>}
        <Card className="p-4 space-y-2">
          <p className="text-sm text-foreground/60">
            Created {new Date(group.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm">Members: {group.memberCount}</p>
          {group.totalDistance !== undefined && (
            <p className="text-sm">
              Total Distance: {group.totalDistance.toFixed(2)} mi
            </p>
          )}
          {group.members && group.members.length > 0 && (
            <div>
              <p className="font-semibold mb-1">Users</p>
              <ul className="list-disc ml-6">
                {group.members.map((m) => (
                  <li key={m.id}>{m.username}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
        <SocialFeed groupId={group.id} />
      </main>
    </div>
  );
}
