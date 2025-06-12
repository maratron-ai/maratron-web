import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import type { SocialUserProfile } from "@maratypes/social";

export function useSocialProfile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<SocialUserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        setProfile(null);
        return;
      }
      setLoading(true);
      try {
        const { data } = await axios.get<SocialUserProfile>(
          `/api/social/profile/byUser/${session.user.id}`
        );
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session?.user?.id]);

  return { profile, loading };
}
