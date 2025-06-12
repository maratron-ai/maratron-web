import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import type { SocialUserProfile, RunPost } from "@maratypes/social";
import FollowUserButton from "@components/FollowUserButton";
import { prisma } from "@lib/prisma";

async function getProfileData(username: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { username },
    include: {
      user: { select: { name: true, _count: { select: { runs: true } } } },
      _count: { select: { followers: true, following: true } },
      followers: { select: { follower: true } },
      following: { select: { following: true } },
    },
  });
  if (!profile) return null;

  const total = await prisma.run.aggregate({
    where: { userId: profile.userId },
    _sum: { distance: true },
  });
  const posts = await prisma.runPost.findMany({
    where: { userProfileId: profile.id },
    include: { _count: { select: { likes: true, comments: true } } },
    orderBy: { createdAt: "desc" },
  });
  const likeActivity = await prisma.like.count({ where: { userProfileId: profile.id } });
  const commentActivity = await prisma.comment.count({ where: { userProfileId: profile.id } });

  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    bio: profile.bio,
    profilePhoto: profile.profilePhoto,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    name: profile.user.name,
    runCount: profile.user._count.runs,
    totalDistance: total._sum.distance ?? 0,
    followerCount: profile._count.followers,
    followingCount: profile._count.following,
    posts,
    followers: profile.followers.map((f) => f.follower),
    following: profile.following.map((f) => f.following),
    likeActivity,
    commentActivity,
  } as const;
}

interface Props {
  params: { username: string };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = params;
  const data = await getProfileData(username);
  if (!data) return notFound();

  const session = await getServerSession(authOptions);
  const isSelf = session?.user?.id === data.userId;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="max-w-3xl mx-auto">
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-6 p-4 rounded-md bg-background border">
              {data.profilePhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.profilePhoto}
                  alt={data.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{data.name ?? data.username}</h1>
                {data.bio && <p className="text-foreground/70">{data.bio}</p>}
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-md text-center text-sm text-muted-foreground">
              <span>{data.runCount ?? 0} runs</span>
              <span>{data.totalDistance ?? 0} mi total</span>
              <span>{data.followerCount ?? 0} followers</span>
              <span>{data.followingCount ?? 0} following</span>
            </div>
          </div>

          <div className="p-4">
            {isSelf ? (
              <Link href="/social/profile/edit" className="text-primary underline">
                Edit Profile
              </Link>
            ) : (
              <FollowUserButton profileId={data.id} />
            )}
          </div>

          <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Posts</h2>
            {data.posts.length === 0 && <p>No posts yet.</p>}
            {data.posts.map((post: RunPost) => (
              <div key={post.id} className="border rounded-lg bg-card shadow-sm p-4 space-y-2">
                <p className="text-base font-semibold">
                  {post.distance} mi in {post.time}
                </p>
                {post.caption && <p className="mt-2">{post.caption}</p>}
                {post.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.photoUrl}
                    alt="Run photo"
                    className="mt-2 rounded-md"
                  />
                )}
                <div className="text-sm text-foreground/60 mt-1">
                  <span>{post._count?.likes ?? 0} likes</span>{" "}
                  <span>{post._count?.comments ?? 0} comments</span>
                </div>
              </div>
            ))}
          </div>

          {isSelf && (
            <div className="p-4 border rounded-md bg-background space-y-2">
              <h2 className="text-xl font-semibold">Followers</h2>
              <ul className="list-disc ml-6">
                {data.followers.map((f: SocialUserProfile) => (
                  <li key={f.id}>
                    <Link href={`/u/${f.username}`} className="hover:underline">
                      {f.username}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="text-xl font-semibold">Following</h2>
              <ul className="list-disc ml-6">
                {data.following.map((f: SocialUserProfile) => (
                  <li key={f.id}>
                    <Link href={`/u/${f.username}`} className="hover:underline">
                      {f.username}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-foreground/60">
                Likes made: {data.likeActivity} | Comments made: {data.commentActivity}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
