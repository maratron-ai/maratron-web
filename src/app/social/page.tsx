"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import { useUser } from "@hooks/useUser";
import ProfileInfoCard from "@components/social/ProfileInfoCard";
import ProfileSearch from "@components/social/ProfileSearch";
import SocialFeed from "@components/social/SocialFeed";
import { Button } from "@components/ui";

export default function SocialHomePage() {
  const { data: session } = useSession();
  const { profile, loading } = useSocialProfile();
  const { profile: user } = useUser();

  if (!session?.user) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <p>Please log in to access social features.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <p>Loading...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-2">
        <p>Create your social profile first.</p>
        <Button asChild>
          <Link href="/social/profile/new">Create Social Profile</Link>
        </Button>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 flex space-x-8">
        <aside className="w-1/4 bg-gray-100 p-4">
          {/* Placeholder vertical sidebar */}
          <p>Sidebar</p>
        </aside>
        <section className="w-1/2">
          <ProfileSearch />
          <SocialFeed />
        </section>
        <aside className="w-1/4">
          <ProfileInfoCard profile={profile} user={user ?? undefined} isSelf />
        </aside>
      </main>
    </div>
  );
}
