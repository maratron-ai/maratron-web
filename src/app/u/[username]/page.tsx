import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import type { SocialProfile, RunPost } from "@maratypes/social";
import FollowUserButton from "@components/social/FollowUserButton";
import ProfileInfoCard from "@components/social/ProfileInfoCard";
import LikeButton from "@components/social/LikeButton";
import CommentSection from "@components/social/CommentSection";
import { Card } from "@components/ui";
import { prisma } from "@lib/prisma";
import { PROFILE_POST_LIMIT } from "@lib/socialLimits";

async function getProfileData(username: string) {
  const profile = await prisma.socialProfile.findUnique({
    where: { username },
    include: {
      user: {
        select: {
          name: true,
          avatarUrl: true,
          createdAt: true,
          _count: { select: { runs: true } },
        },
      },
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
    where: { socialProfileId: profile.id },
    include: { _count: { select: { likes: true, comments: true } } },
    orderBy: { createdAt: "desc" },
    take: PROFILE_POST_LIMIT,
  });
  const likeActivity = await prisma.like.count({ where: { socialProfileId: profile.id } });
  const commentActivity = await prisma.comment.count({ where: { socialProfileId: profile.id } });

  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    bio: profile.bio,
    avatarUrl: profile.user.avatarUrl,
    userCreatedAt: profile.user.createdAt,
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

  const profile: SocialProfile = {
    id: data.id,
    userId: data.userId,
    username: data.username,
    bio: data.bio,
    avatarUrl: data.avatarUrl,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    name: data.name,
    runCount: data.runCount,
    totalDistance: data.totalDistance,
    followerCount: data.followerCount,
    followingCount: data.followingCount,
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 max-w-screen-lg py-8 flex flex-col gap-8">
        <div className="w-full flex flex-col items-stretch space-y-4">
          <ProfileInfoCard
            profile={profile}
            user={{ avatarUrl: data.avatarUrl ?? undefined, createdAt: data.userCreatedAt }}
            isSelf={isSelf}
          />
          {!isSelf && <FollowUserButton profileId={data.id} />}
        </div>
        <section className="w-full space-y-6">
          <h2 className="text-xl font-semibold">Posts</h2>
          {data.posts.length === 0 && <p>No posts yet.</p>}
          {data.posts.map((post: RunPost) => (
            <Card key={post.id} className="space-y-2 p-4">
              <p className="text-base font-semibold">
                {post.distance} mi in {post.time}
              </p>
              <div className="text-sm text-foreground opacity-60">
                {new Date(post.createdAt).toLocaleString()}
              </div>
              {post.caption && <p className="mt-2">{post.caption}</p>}
              {post.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.photoUrl} alt="Run photo" className="mt-2 rounded-md" />
              )}
              <div className="flex gap-2 mt-2 items-start">
                <LikeButton
                  postId={post.id}
                  initialLiked={false}
                  initialCount={post._count?.likes ?? 0}
                />
                <CommentSection
                  postId={post.id}
                  initialCount={post._count?.comments ?? 0}
                />
              </div>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
