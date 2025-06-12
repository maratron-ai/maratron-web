"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import { followUser } from "@lib/api/social";
import { Button } from "@components/ui";

interface Props {
  profileId: string;
}

export default function FollowUserButton({ profileId }: Props) {
  const { data: session } = useSession();
  const { profile } = useSocialProfile();
  const [done, setDone] = useState(false);

  if (!session?.user || !profile || profile.id === profileId) return null;

  const onFollow = async () => {
    try {
      await followUser(profile.id, profileId);
      setDone(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button onClick={onFollow} size="sm" disabled={done} className="mt-2">
      {done ? "Following" : "Follow"}
    </Button>
  );
}
