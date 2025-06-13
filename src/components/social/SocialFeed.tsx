"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import type { RunPost } from "@maratypes/social";
import { useSession } from "next-auth/react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import CreateSocialPost from "@components/social/CreateSocialPost";
import LikeButton from "@components/social/LikeButton";
import CommentSection from "@components/social/CommentSection";
import { Button, Dialog, DialogContent } from "@components/ui";
import Link from "next/link";
import Image from "next/image";

export default function SocialFeed() {
  const { data: session } = useSession();
  const { profile, loading: profileLoading } = useSocialProfile();
  const [posts, setPosts] = useState<RunPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchFeed = async () => {
    if (!session?.user?.id) return;
    try {
      const { data } = await axios.get<RunPost[]>(
        `/api/social/feed?userId=${session.user.id}`
      );
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  if (!session?.user?.id) return <p>Please log in to view your feed.</p>;
  if (profileLoading || loading) return <p className="text-foreground/60">Loading feed...</p>;
  if (!profile)
    return (
      <div className="space-y-2">
        <p>You need a social profile to use the feed.</p>
        <Button asChild>
          <a href="/social/profile/new">Create Social Profile</a>
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <CreateSocialPost onCreated={fetchFeed} />
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div key={post.id} className="border rounded-md p-4">
          <div className="flex items-center gap-2 mb-1">
            <Image
              src={
                post.socialProfile?.user?.avatarUrl || "/default_profile.png"
              }
              alt={post.socialProfile?.username || "avatar"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            {post.socialProfile?.username && (
              <Link
                href={`/u/${post.socialProfile.username}`}
                className="font-semibold hover:underline"
              >
                {post.socialProfile.username}
              </Link>
            )}
          </div>
          <div className="text-sm text-foreground/60 mb-2">
            {new Date(post.createdAt).toLocaleString()}
          </div>
          <p className="font-medium">
            {post.distance} mi in {post.time}
          </p>
          {post.caption && <p className="mt-2">{post.caption}</p>}
          {post.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.photoUrl}
              alt="Run photo"
              className="mt-2 rounded-md h-64 w-64 object-cover cursor-pointer"
              onClick={() => setSelectedImage(post.photoUrl!)}
            />
          )}
          <LikeButton
            postId={post.id}
            initialLiked={post.liked ?? false}
            initialCount={post.likeCount ?? post._count?.likes ?? 0}
          />
          <CommentSection postId={post.id} />
        </div>
      ))}
      <Dialog open={!!selectedImage} onOpenChange={(o) => !o && setSelectedImage(null)}>
        <DialogContent className="p-0">
          {selectedImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedImage}
              alt="Run photo"
              className="w-64 h-64 object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
