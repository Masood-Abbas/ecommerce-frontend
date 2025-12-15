import * as Yup from "yup";
export const CheckoutSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  postalCode: Yup.string().required("Postal code is required"),
});
