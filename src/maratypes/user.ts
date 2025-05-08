export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  trainingLevel: "beginner" | "intermediate" | "advanced";
  VO2Max?: number;
  goals: string[];
  avatarUrl?: string;
  yearsRunning?: number;
  weeklyMileage?: number;
  height?: number;
  weight?: number;
  injuryHistory?: string;
  preferredTrainingDays?: DayOfWeek[];
  preferredTrainingEnvironment?: "outdoor" | "treadmill" | "indoor" | "mixed";
  device?: string;
}
