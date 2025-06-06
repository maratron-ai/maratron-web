"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@lib/api/user/user";
import UserProfileForm from "@components/UserProfileForm";
import { UserProfile } from "@maratypes/user";
import { useEffect } from "react";

export default function OnboardingProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If not authenticated, redirect to signup
  useEffect(() => {
    if (status === "loading") return; // Wait for loading
    if (!session?.user) {
      router.replace("/signup");
    }
  }, [session, status, router]);

  // Don't render until loaded & logged in
  if (status === "loading" || !session?.user) {
    return null;
  }

  // Prefill the form using session.user
  // You'll need to load any additional fields from your database if needed
  const initialUser: UserProfile = {
    id: session.user.id!,
    name: session.user.name ?? "",
    email: session.user.email ?? "",

    // ...other fields (may need to fetch from API if your UserProfile is more than name/email)
  };

  const onSave = async (updated: UserProfile) => {
    await updateUserProfile(initialUser.id, updated);
    // Optionally update client state here
    router.push("/home");
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">
        Almost done—tell us about your running!
      </h1>
      <UserProfileForm
        initialUser={initialUser}
        onSave={onSave}
        alwaysEdit
        submitLabel="Finish Setup"
      />
    </div>
  );
}
