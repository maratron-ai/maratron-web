import { notFound } from "next/navigation";
import type { SocialUserProfile } from "@maratypes/social";

async function getProfile(username: string): Promise<SocialUserProfile | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/social/profile/${username}`);
  if (!res.ok) return null;
  return res.json();
}

interface Props {
  params: { username: string };
}

export default async function UserProfilePage({ params }: Props) {
  const profile = await getProfile(params.username);
  if (!profile) return notFound();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex items-center gap-4">
        {profile.profilePhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profilePhoto}
            alt={profile.username}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.name ?? profile.username}</h1>
          {profile.bio && <p className="text-foreground/70">{profile.bio}</p>}
        </div>
      </div>
      <div className="flex gap-4 text-foreground/80">
        <span>{profile.runCount ?? 0} runs</span>
        <span>{profile.totalDistance ?? 0} mi total</span>
        <span>{profile.followerCount ?? 0} followers</span>
        <span>{profile.followingCount ?? 0} following</span>
      </div>
    </div>
  );
}
