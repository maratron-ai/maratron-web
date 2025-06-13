"use client";
import Image from "next/image";
import Link from "next/link";
import type { SocialProfile } from "@maratypes/social";
import type { User } from "@maratypes/user";
import { Card, Button } from "@components/ui";

interface Props {
  profile: SocialProfile;
  user?: Pick<User, "avatarUrl" | "createdAt">;
  isSelf?: boolean;
}

export default function ProfileInfoCard({ profile, user, isSelf }: Props) {
  const avatar = user?.avatarUrl || profile.profilePhoto || "/default_profile.png";
  const joined = user?.createdAt ?? profile.createdAt;
  const joinedText = new Date(joined).toLocaleDateString(undefined, {
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <Card className="p-4 flex gap-4 items-start">
      <Image
        src={avatar}
        alt={profile.username}
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1 space-y-1">
        <h2 className="text-xl font-bold">{profile.name ?? profile.username}</h2>
        <p className="text-sm text-foreground/60">
          @{profile.username} • Joined {joinedText}
        </p>
        {profile.bio && <p className="text-sm text-foreground/70">{profile.bio}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground mt-2">
          <span>{profile.runCount ?? 0} runs</span>
          <span>{profile.totalDistance ?? 0} mi</span>
          <span>{profile.followerCount ?? 0} followers</span>
          <span>{profile.followingCount ?? 0} following</span>
        </div>
      </div>
      {isSelf && (
        <Button asChild size="sm" className="self-start">
          <Link href="/social/profile/edit">Edit</Link>
        </Button>
      )}
    </Card>
  );
}
