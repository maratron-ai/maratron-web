import { DayOfWeek } from "./basics";
import { Shoe } from "./shoe"; // Import your shoe type

export enum TrainingLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

export type TrainingEnvironment = "outdoor" | "treadmill" | "indoor" | "mixed";

export type Device =
  | "Garmin"
  | "Polar"
  | "Suunto"
  | "Fitbit"
  | "AppleWatch"
  | "SamsungGalaxyWatch"
  | "Coros"
  | "Other";

export type Gender = "Male" | "Female" | "Other";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: Gender;
  trainingLevel?: TrainingLevel;
  VO2Max?: number;
  goals?: string[];
  avatarUrl?: string;
  yearsRunning?: number;
  weeklyMileage?: number;
  height?: number;
  weight?: number;
  injuryHistory?: string;
  preferredTrainingDays?: DayOfWeek[];
  preferredTrainingEnvironment?: TrainingEnvironment;
  device?: Device;

  shoes?: Shoe[];
  defaultShoeId?: string;
}
