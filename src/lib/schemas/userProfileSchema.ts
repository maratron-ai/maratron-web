import * as Yup from "yup";

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
  gender: Yup.string(),
  trainingLevel: Yup.string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .required("Training level is required")
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
  preferredTrainingDays: Yup.string().nullable().default(undefined),
  preferredTrainingEnvironment: Yup.string()
    .oneOf(["outdoor", "treadmill", "indoor", "mixed"])
    .default("mixed"),
  device: Yup.string().nullable().default(undefined),
});

export default userProfileSchema;
