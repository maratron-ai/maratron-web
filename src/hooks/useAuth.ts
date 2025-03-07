import axios from "axios";
import { useState } from "react";
import { useUserStore } from "../store/userStore";
import { UserProfile } from "@maratypes/user";

// this just calls the functions written in pages/api/auth/ 

export const useAuth = () => {
  const { user, setUser, clearUser } = useUserStore();
  const [error, setError] = useState("");

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

  return { user, error, login, logout };
};
