"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { UserProfile } from "@maratypes/user";

// Client-side auth hook
export const useAuth = () => {
  const { user, setUser, clearUser } = useUserStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Add a loading state for hydration

  useEffect(() => {
    let cancelled = false;

    // Only hydrate if no user is set already
    if (!user) {
      setLoading(true);
      axios
        .get("/api/auth/me")
        .then((res) => {
          if (!cancelled && res.data && res.data.id) {
            setUser(res.data as UserProfile);
          }
        })
        .catch(() => {
          if (!cancelled) {
            clearUser();
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setError("");
    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { validateStatus: (status) => status < 500 } // Treat 4xx responses as resolved
      );
      if (response.status === 401) {
        setError("Invalid email or password.");
        return;
      }
      setUser(response.data as UserProfile);
    } catch (err: unknown) {
      console.error("Login failed:", err);
      setError("An unexpected error occurred during login.");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      clearUser();
    }
  };

  // Expose a loading state so you can block UI until hydration is done, if desired
  return { user, error, login, logout, loading };
};
