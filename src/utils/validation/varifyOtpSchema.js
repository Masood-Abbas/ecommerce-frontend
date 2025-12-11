import * as Yup from "yup";

export const VarifyOtpSchema = Yup.object({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be 6 digits"),
});
