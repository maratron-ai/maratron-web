import * as Yup from "yup";
import type { DayOfWeek, TrainingLevel, TrainingEnvironment, Device } from "@maratypes/user";

const userProfileSchema = Yup.object().shape({
  id: Yup.string().nullable(),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  age: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null
        ? undefined
        : Number(originalValue)
    )
    .min(10, "Age must be at least 10")
    .nullable()
    .default(undefined),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"])
    .nullable()
    .default(undefined),
  trainingLevel: Yup.string()
    .oneOf(["beginner", "intermediate", "advanced"] as TrainingLevel[])
    .nullable()
    .default("beginner"),
  VO2Max: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null
        ? undefined
        : Number(originalValue)
    )
    .min(10, "VO2Max must be at least 10")
    .nullable()
    .default(undefined),
  goals: Yup.array().of(Yup.string()),
  avatarUrl: Yup.string()
    .url("Invalid URL")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value
    )
    .nullable()
    .default(undefined),
  yearsRunning: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null
        ? undefined
        : Number(originalValue)
    )
    .min(0, "Years running cannot be negative")
    .nullable()
    .default(undefined),
  weeklyMileage: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null
        ? undefined
        : Number(originalValue)
    )
    .min(0, "Weekly mileage cannot be negative")
    .nullable()
    .default(undefined),
  height: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null
        ? undefined
        : Number(originalValue)
    )
    .min(0, "Height must be positive")
    .nullable()
    .default(undefined),
  weight: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null
        ? undefined
        : Number(originalValue)
    )
    .min(0, "Weight must be positive")
    .nullable()
    .default(undefined),
  injuryHistory: Yup.string().nullable().default(undefined),
  preferredTrainingDays: Yup.array()
    .of(
      Yup.string().oneOf([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ] as DayOfWeek[])
    )
    .nullable()
    .default([]),
  preferredTrainingEnvironment: Yup.string()
    .oneOf(["outdoor", "treadmill", "indoor", "mixed"] as TrainingEnvironment[])
    .nullable()
    .default("mixed"),
  device: Yup.string()
    .oneOf([
      "Garmin",
      "Polar",
      "Suunto",
      "Fitbit",
      "AppleWatch",
      "SamsungGalaxyWatch",
      "Coros",
      "Other",
    ] as Device[])
    .nullable()
    .default(undefined),
});

export default userProfileSchema;
