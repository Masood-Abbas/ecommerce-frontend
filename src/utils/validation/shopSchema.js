 import * as Yup from "yup";
export const ShopSchema =Yup.object({
      name: Yup.string().required("Shop name is required"),
      description: Yup.string().required("Description is required"),
      address: Yup.string().required("Address is required"),
      phone: Yup.string().required("Phone is required"),
      image: Yup.mixed().required("Shop image is required"),
    })