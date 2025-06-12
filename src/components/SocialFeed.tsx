"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import type { RunPost } from "@maratypes/social";
import { useSession } from "next-auth/react";

export default function SocialFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<RunPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchFeed();
  }, [session?.user?.id]);

  if (!session?.user?.id) return <p>Please log in to view your feed.</p>;
  if (loading) return <p className="text-foreground/60">Loading feed...</p>;
  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="border rounded-md p-4">
          <div className="flex items-center gap-2 mb-2">
            {post.userProfile?.profilePhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.userProfile.profilePhoto}
                alt={post.userProfile.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="font-semibold">
              {post.userProfile?.username}
            </span>
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
              className="mt-2 rounded-md"
            />
          )}
        </div>
      ))}
    </div>
  );
}
