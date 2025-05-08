// pages/signup/profile/page.tsx

'use client'

import { useEffect } from "react";

import { UserProfile } from "@maratypes/user";
import UserProfileForm from "@components/UserProfileForm";
import { useUserStore } from "@store/userStore";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@lib/api/user/user";

export default function OnboardingProfile() {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  // Redirect to signup if no user in store
  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to signup");
      router.replace("/signup");
    }
  }, [user, router]);

  // Don't render until we have a user
  if (!user) {
    return null;
  }

  const onSave = async (updated: UserProfile) => {
    await updateUserProfile(user.id, updated);
    setUser(updated);
    router.push("/home");
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">
        Almost done—tell us about your running!
      </h1>
      <UserProfileForm
        initialUser={user}
        onSave={onSave}
        alwaysEdit
        submitLabel="Finish Setup"
      />
    </div>
  );
}
