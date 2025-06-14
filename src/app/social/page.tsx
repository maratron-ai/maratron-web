"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSocialProfile } from "@hooks/useSocialProfile";
import { useUser } from "@hooks/useUser";
import ProfileInfoCard from "@components/social/ProfileInfoCard";
import ProfileSearch from "@components/social/ProfileSearch";
import SocialFeed from "@components/social/SocialFeed";
import { Button, Spinner } from "@components/ui";

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
        <div className="flex justify-center py-4">
          <Spinner className="h-4 w-4" />
        </div>
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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 max-w-screen-lg py-8 flex flex-col lg:flex-row gap-8">
        <section className="lg:w-2/3 order-2 lg:order-1 space-y-6">
          <SocialFeed />
        </section>
        <aside className="lg:w-1/3 order-1 lg:order-2 space-y-6">
          <ProfileInfoCard profile={profile} user={user ?? undefined} isSelf />
          <div>
            <h2 className="text-lg font-semibold mb-2">Find Runners</h2>
            <ProfileSearch />
          </div>
        </aside>
      </main>
    </div>
  );
}
