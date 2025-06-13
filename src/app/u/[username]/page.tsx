"use client";
import { useEffect, useState } from "react";
import ProfileInfoCard from "@components/ProfileInfoCard";
import type { UserProfile } from "@maratypes/user";

interface PageProps {
  params: { username: string };
}

export default function UserPage({ params }: PageProps) {
  const { username } = params;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${username}`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data as UserProfile);
      } catch {
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : profile ? (
        <div className="max-w-md w-full">
          <ProfileInfoCard profile={profile} />
        </div>
      ) : null}
    </main>
  );
}
