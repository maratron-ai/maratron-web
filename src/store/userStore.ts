// src/store/userStore.ts

// This is boilerplate... need to import zustand and figure how to actually use
import { create } from "zustand";
import { UserProfile } from "@types/user";

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
