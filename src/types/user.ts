// src/types/user.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: "male" | "female" | "non-binary" | "other";
  trainingLevel: "beginner" | "intermediate" | "advanced";
  goals: string[];
  avatarUrl?: string
}