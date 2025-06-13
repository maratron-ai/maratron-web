"use client";
import { useSocialProfile } from "@hooks/useSocialProfile";
import SocialProfileEditForm from "@components/SocialProfileEditForm";

export default function EditSocialProfilePage() {
  const { profile, loading } = useSocialProfile();

  if (loading) return <p className="w-full px-4 py-6">Loading...</p>;
  if (!profile) return <p className="w-full px-4 py-6">Profile not found.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center">
          <SocialProfileEditForm profile={profile} />
        </div>
      </main>
    </div>
  );
}
