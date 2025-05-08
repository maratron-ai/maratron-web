export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type TrainingLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type TrainingEnvironment =
  | "outdoor"
  | "treadmill"
  | "indoor"
  | "mixed";

export type Device = 
  | "Garmin"
  | "Polar"
  | "Suunto"
  | "Fitbit"
  | "Apple Watch"
  | "Samsung Galaxy Watch"
  | "Coros"
  | "Other";

export type Gender =
  | "Male"
  | "Female"
  | "Other";


export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: Gender;
  trainingLevel: TrainingLevel;
  VO2Max?: number;
  goals: string[];
  avatarUrl?: string;
  yearsRunning?: number;
  weeklyMileage?: number;
  height?: number;
  weight?: number;
  injuryHistory?: string;
  preferredTrainingDays?: DayOfWeek[];
  preferredTrainingEnvironment?: TrainingEnvironment;
  device?: Device;
}
