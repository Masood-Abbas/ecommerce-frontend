import * as Yup from "yup";

export const ForgetPasswordSchema = 
  Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });