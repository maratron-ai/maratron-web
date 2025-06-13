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
    month: "short",
    year: "2-digit",
  });

  return (
    <Card className="relative p-4 pr-16 flex flex-wrap flex-col sm:flex-row gap-4 items-start overflow-hidden">
      <Image
        src={avatar}
        alt={profile.username}
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0 break-words">
        <h2 className="text-xl font-bold truncate">
          @{profile.username}
          <span className="block text-sm text-foreground opacity-60 font-normal">
            Since {joinedText}
          </span>
        </h2>

        {profile.bio && (
          <p className="text-sm text-foreground/70 break-words">{profile.bio}</p>
        )}
        <div className="hidden sm:flex sm:flex-wrap sm:justify-between gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex gap-4 flex-wrap min-w-0">
            <span className="text-center break-words">{profile.runCount ?? 0} runs</span>
            <span className="text-center break-words">{profile.totalDistance ?? 0} mi</span>
          </div>
          <div className="flex gap-4 flex-wrap min-w-0">
            <span className="text-center break-words">{profile.followerCount ?? 0} followers</span>
            <span className="text-center break-words">{profile.followingCount ?? 0} following</span>
          </div>
        </div>
      </div>
      {isSelf && (
        <Button asChild size="sm" className="absolute top-4 right-4">
          <Link href="/social/profile/edit">Edit</Link>
        </Button>
      )}
    </Card>
  );
}
