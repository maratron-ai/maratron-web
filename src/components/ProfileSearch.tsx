"use client";
import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { SocialUserProfile } from "@maratypes/social";
import { Input, Button, Card } from "@components/ui";
import FollowUserButton from "@components/FollowUserButton";
import Image from "next/image";

export default function ProfileSearch() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SocialUserProfile[]>([]);
  const [myProfileId, setMyProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProfile = async () => {
      if (session?.user?.id) {
        try {
          const { data } = await axios.get<SocialUserProfile>(
            `/api/social/profile/byUser/${session.user.id}`
          );
          setMyProfileId(data.id);
        } catch {
          setMyProfileId(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchMyProfile();
  }, [session?.user?.id]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.get<SocialUserProfile[]>(
        `/api/social/search?q=${encodeURIComponent(query)}`
      );
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const { data } = await axios.get<SocialUserProfile[]>(
          `/api/social/search?q=${encodeURIComponent(query)}`
        );
        setResults(data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);


  if (!session?.user?.id) return <p>Please log in to search.</p>;
  if (loading) return <p className="text-foreground/60">Loading...</p>;
  if (!myProfileId)
    return (
      <div className="space-y-2">
        <p>Create your social profile first.</p>
        <Button asChild>
          <a href="/social/profile/new">Create Social Profile</a>
        </Button>
      </div>
    );

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          placeholder="Search runners"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>
      <div className="space-y-4">
        {results.map((p) => (
          <Card key={p.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={p.avatarUrl || "/default_profile.png"}
                alt={p.username}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <a href={`/u/${p.username}`} className="font-semibold">
                  {p.name ?? p.username}
                </a>
                {p.bio && <p className="text-foreground/70">{p.bio}</p>}
                <div className="text-sm text-foreground/60">
                  <span>{p.runCount ?? 0} runs</span>{" "}
                  <span>{p.followerCount ?? 0} followers</span>
                </div>
              </div>
            </div>
            {myProfileId && myProfileId !== p.id && (
              <FollowUserButton profileId={p.id} />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
