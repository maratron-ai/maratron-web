"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import axios from "axios";
import SocialFeed from "@components/social/SocialFeed";
import { Button, Spinner, Card } from "@components/ui";
import type { RunGroup } from "@maratypes/social";

export default function GroupPage() {
  const { data: session } = useSession();
  const { profile, loading: profileLoading } = useSocialProfile();
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [group, setGroup] = useState<RunGroup | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroup = async () => {
    try {
      const { data } = await axios.get<RunGroup>(
        `/api/social/groups/${id}?profileId=${profile?.id ?? ""}`
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
    await axios.post(`/api/social/groups/${id}/join`, {
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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 max-w-screen-lg py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          {!group.isMember && (
            <Button onClick={handleJoin}>Join Group</Button>
          )}
        </div>
        {group.description && (
          <p className="text-foreground/70">{group.description}</p>
        )}
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
        </Card>
        <SocialFeed groupId={group.id} />
      </main>
    </div>
  );
}
