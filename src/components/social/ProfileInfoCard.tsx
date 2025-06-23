"use client";
import Image from "next/image";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import type { SocialProfile } from "@maratypes/social";
import type { User } from "@maratypes/user";
import type { Run } from "@maratypes/run";
import { Card, Button } from "@components/ui";
import UserStatsDialog from "@components/social/UserStatsDialog";
import FollowUserButton from "@components/social/FollowUserButton";

interface Props {
  profile: SocialProfile;
  user?: Pick<User, "avatarUrl" | "createdAt">;
  isSelf?: boolean;
  followers?: SocialProfile[];
  following?: SocialProfile[];
  runs?: Run[];
}

export default function ProfileInfoCard({
  profile,
  user,
  isSelf,
  followers,
  following,
  runs,
}: Props) {
  const avatar = user?.avatarUrl || profile.profilePhoto || "/default_profile.png";
  const joined = user?.createdAt ?? profile.createdAt;
  const joinedText = new Date(joined).toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });


  // const pathname = usePathname();

  return (
    <>
    <Card className="relative p-4 flex flex-wrap flex-col sm:flex-row gap-4 items-start overflow-hidden">
      <Image
        src={avatar}
        alt={profile.username}
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover border border-brand-to bg-brand-from"
      />
      <div className="flex-1 min-w-0 break-words">
        <h2 className="text-xl font-bold truncate">
          <a href={`/u/${profile.username}`} className="font-semibold">
            @{profile.username}
          </a>
          <span className="block text-sm text-foreground opacity-60 font-normal">
            Since {joinedText}
          </span>
        </h2>

        {profile.bio && (
          <p className="text-sm text-foreground opacity-70 break-words">
            {profile.bio}
          </p>
        )}
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-center items-center text-center gap-4 text-sm text-muted-foreground">
        <UserStatsDialog
          title="Runs"
          trigger={
            <div className="flex items-baseline justify-center w-full sm:w-auto gap-1 cursor-pointer hover:underline">
              <span className="text-lg font-semibold">
                {profile.runCount ?? 0} runs
              </span>
            </div>
          }
        >
          {runs && runs.length > 0 ? (
            <ul className="list-disc ml-4 space-y-1 text-left">
              {runs.map((r) => (
                <li key={r.id}>
                  {r.name || new Date(r.date).toLocaleDateString()} - {r.distance}{" "}
                  {r.distanceUnit}
                </li>
              ))}
            </ul>
          ) : (
            <p>No runs found.</p>
          )}
        </UserStatsDialog>
        {/* <div className="flex items-baseline justify-center w-full sm:w-auto gap-1">
          <span className="text-lg font-semibold">
            {profile.postCount ?? 0} posts
          </span>
        </div> */}
        <UserStatsDialog
          title="Distance"
          trigger={
            <div className="flex items-baseline justify-center w-full sm:w-auto gap-1 cursor-pointer hover:underline">
              <span className="text-lg font-semibold">
                {profile.totalDistance ?? 0} mi
              </span>
            </div>
          }
        >
          {runs && runs.length > 0 ? (
            <ul className="list-disc ml-4 space-y-1 text-left">
              {runs.map((r) => (
                <li key={r.id}>
                  {r.name || new Date(r.date).toLocaleDateString()} - {r.distance}{" "}
                  {r.distanceUnit}
                </li>
              ))}
            </ul>
          ) : (
            <p>No runs found.</p>
          )}
        </UserStatsDialog>
        <UserStatsDialog
          title="Followers"
          trigger={
            <div className="flex items-baseline justify-center w-full sm:w-auto gap-1 cursor-pointer hover:underline">
              <span className="text-lg font-semibold">
                {profile.followerCount ?? 0} followers
              </span>
            </div>
          }
        >
          {followers && followers.length > 0 ? (
            <ul className="space-y-1">
              {followers.map((f) => (
                <li key={f.id}>
                  <Link href={`/u/${f.username}`} className="underline">
                    @{f.username}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No followers yet.</p>
          )}
        </UserStatsDialog>
        <UserStatsDialog
          title="Following"
          trigger={
            <div className="flex items-baseline justify-center w-full sm:w-auto gap-1 cursor-pointer hover:underline">
              <span className="text-lg font-semibold">
                {profile.followingCount ?? 0} following
              </span>
            </div>
          }
        >
          {following && following.length > 0 ? (
            <ul className="space-y-1">
              {following.map((f) => (
                <li key={f.id}>
                  <Link href={`/u/${f.username}`} className="underline">
                    @{f.username}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Not following anyone.</p>
          )}
        </UserStatsDialog>
      </div>
      {isSelf ? (
        <Button
          asChild
          size="sm"
          className="absolute top-4 right-4 text-foreground bg-transparent no-underline transition-colors hover:text-background hover:no-underline hover:bg-brand-from"
        >
          <Link href="/social/profile/edit">Edit</Link>
        </Button>
      ) : (
        <div className="absolute top-4 right-4">
          <FollowUserButton profileId={profile.id} />
        </div>
      )}
    </Card>

    </>
  );
}
