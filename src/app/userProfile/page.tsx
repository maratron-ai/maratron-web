"use client";

import { useUserStore } from "@store/userStore";
import { useAuth } from "@hooks/useAuth";
import UserProfileForm from "@components/UserProfileForm";
import { UserProfile } from "@maratypes/user";

export default function UserProfilePage() {
  const { user, setUser } = useUserStore();
  const { logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Please log in or create a profile to view your information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <UserProfileForm
        initialUser={user}
        onSave={(updated: UserProfile) => setUser(updated)}
      />
    </div>
  );
}