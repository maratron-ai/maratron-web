// src/hooks/useAuth.ts
import axios from "axios";
import { useUserStore } from "../store/userStore";
import { UserProfile } from "@maratypes/user";

export const useAuth = () => {
  const { user, setUser, clearUser } = useUserStore();

  const login = async (
    email: string,
    password: string
  ): Promise<UserProfile> => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const userData: UserProfile = response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      clearUser();
    } catch (error) {
      console.error("Logout failed:", error);
      clearUser();
    }
  };

  return { user, login, logout };
};
