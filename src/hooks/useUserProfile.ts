// src/hooks/useUserProfile.ts
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserProfile } from "@maratypes/user";
import axios from "axios";

export function useUserProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setLoading(true);
      axios
        .get(`/api/users/${session.user.id}`)
        .then((res) => setProfile(res.data))
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    } else {
      setProfile(null);
    }
  }, [session?.user?.id]);

  return { profile, loading };
}
