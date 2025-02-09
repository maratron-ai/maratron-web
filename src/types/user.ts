// src/types/user.ts
import { RacePace } from "@types/pace";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: "male" | "female" | "non-binary" | "other";
  trainingLevel?: "beginner" | "intermediate" | "advanced";
  VO2Max?: number;
  goals: string[];
  avatarUrl?: string;
  createdAt?: string; // ISO timestamp when user was created
  updatedAt?: string; // ISO timestamp for last profile update
  initialPace?: RacePace;
  goalPace?: RacePace;
}