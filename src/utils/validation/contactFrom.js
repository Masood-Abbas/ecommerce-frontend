import * as Yup from "yup";
export const contactFormSchema =  Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      message: Yup.string().required("Message is required"),
    })