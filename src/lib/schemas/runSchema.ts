import * as Yup from "yup";

const runSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  duration: Yup.string()
    .required("Duration is required")
    .matches(
      /^[0-9]{1,2}:[0-5][0-9]:[0-5][0-9]$/,
      "Duration must be in HH:MM:SS format (e.g., 01:30:45)"
    ),
  distance: Yup.number()
    .required("Distance is required")
    .moreThan(0, "Distance must be greater than 0"),
  distanceUnit: Yup.string()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .oneOf(["miles", "kilometers"], "Select a valid distance unit")
    .required("Distance unit is required"),
  trainingEnvironment: Yup.string()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .oneOf(
      ["outdoor", "treadmill", "indoor", "mixed"],
      "Select a valid training environment"
    )
    .notRequired(),
  elevationGain: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .notRequired(),
  elevationGainUnit: Yup.string()
    .oneOf(["miles", "kilometers", "meters", "feet"])
    .optional(),
  notes: Yup.string().notRequired(),
});


export default runSchema;