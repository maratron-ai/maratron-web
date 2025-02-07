// src/types/user.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: "male" | "female" | "non-binary" | "other";
  VO2Max?: number;
  goals: string[];
  avatarUrl?: string
}