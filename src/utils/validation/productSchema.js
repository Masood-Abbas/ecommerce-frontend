import * as Yup from "yup";
export const productSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  description: Yup.string(),
  price: Yup.number().min(0).required("Price is required"),
  stock: Yup.number().min(0).required("Stock is required"),
  images: Yup.array().max(5).notRequired(),
});