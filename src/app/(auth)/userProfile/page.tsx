// src/app/userProfile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import UserProfileForm from "@components/UserProfileForm";
import { UserProfile } from "@maratypes/user";
import { getUserProfile, updateUserProfile } from "@lib/api/user/user";

export default function UserProfilePage() {
  const { data: session, status, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch full profile after session loads
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const userProfile = await getUserProfile(session.user.id);
          setProfile(userProfile);
        } catch {
          setError("Failed to load user profile.");
        } finally {
          setLoading(false);
        }
      } else if (status === "authenticated" && !session?.user?.id) {
        setError("Session loaded, but user ID is missing.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session, status]);

  // Handle save
  const handleSave = async (updated: UserProfile) => {
    try {
      setLoading(true);
      await updateUserProfile(updated.id, updated);
      setProfile(updated);
      await update({ user: { avatarUrl: updated.avatarUrl ?? null } });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Not authenticated
  if (status === "loading") {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }
  if (status !== "authenticated" || !session.user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>
          Please{" "}
          <a href="/login" className="underline text-blue-600">
            log in
          </a>{" "}
          to view your profile.
        </p>
      </div>
    );
  }

  // Profile loading or error
  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading profile...</div>;
  }
  if (error) {
    return <div className="max-w-4xl mx-auto p-6 text-red-600">{error}</div>;
  }

  // Render the form
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      {saveSuccess && (
        <div className="mb-4 text-green-600">Profile updated!</div>
      )}
      {profile && <UserProfileForm initialUser={profile} onSave={handleSave} />}
    </div>
  );
}
