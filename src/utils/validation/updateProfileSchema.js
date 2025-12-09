 import * as Yup from "yup";
 
 export const updateProfileSchema = Yup.object({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").notRequired(),
    role: Yup.string(),
  });