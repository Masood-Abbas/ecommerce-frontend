import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { updateUserRole } from "@/Redux/authSlice/authSlice";

import { Store, MapPin, Phone, FileText } from "lucide-react";

const Seller = () => {
  const [preview, setPreview] = useState(null);

  const { fetchApi, loading, error } = useApiResponse({
    method: "post",
    reduxAction: updateUserRole,
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Shop name is required"),
      description: Yup.string().required("Description is required"),
      address: Yup.string().required("Address is required"),
      phone: Yup.string().required("Phone is required"),
      image: Yup.mixed().required("Shop image is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      await fetchApi({}, `/shop/createShope`, formData);
    },
  });

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    formik.setFieldValue("image", file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="w-full px-4">
      {/* TOP HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-linear-to-r from-(--primary-color) to-[#873d3d] p-3 rounded-full">
          <Store className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Become a Seller</h1>
          <p className="text-gray-500 text-sm">
            Fill in your shop details to start selling
          </p>
        </div>
      </div>

      {/* MAIN FORM */}
      <div className="bg-white w-full rounded-2xl shadow-sm border p-8 max-w-5xl">
        <h2 className="text-xl font-semibold mb-1">Shop Information</h2>
        <p className="text-gray-500 text-sm mb-8">
          Please provide your shop details to register as a seller.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/* SHOP NAME */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-medium">
               Shop Name <span className="text-red-500">*</span>
            </Label>
            <Input
              name="name"
              type="text"
              placeholder="Enter your shop name"
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
              className="w-full border-b border-gray-300 pb-2 outline-none focus:border-red-500 transition"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}
          </div>

          {/* ADDRESS */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-medium">
               Address<span className="text-red-500">*</span>
            </Label>
            <Input
              name="address"
              type="text"
              placeholder="Enter your shop address"
              onChange={formik.handleChange}
              value={formik.values.address}
              onBlur={formik.handleBlur}
              className="w-full border-b border-gray-300 pb-2 outline-none focus:border-red-500 transition"
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-red-500 text-sm">{formik.errors.address}</p>
            )}
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-medium">
              Phone Number<span className="text-red-500">*</span>
            </Label>
            <Input
              name="phone"
              type="text"
              placeholder="+92 300 0000000"
              onChange={formik.handleChange}
              value={formik.values.phone}
              onBlur={formik.handleBlur}
              className="w-full border-b border-gray-300 pb-2 outline-none focus:border-red-500 transition"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm">{formik.errors.phone}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-medium">
               Description<span className="text-red-500">*</span>
            </Label>
            <Textarea
              name="description"
              placeholder="Describe your shop and what you sell..."
              onChange={formik.handleChange}
              value={formik.values.description}
              onBlur={formik.handleBlur}
              className="w-full min-h-[120px] border-b border-gray-300 pb-2 outline-none focus:border-red-500 transition"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* IMAGE */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Shop Image<span className="text-red-500">*</span></Label>
            <Input type="file" accept="image/*" onChange={handleImage} onBlur={() => formik.setFieldTouched("image", true)} />

            {formik.touched.image && formik.errors.image && (
              <p className="text-red-500 text-sm">{formik.errors.image}</p>
            )}

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 border rounded-lg object-cover mt-2"
              />
            )}
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full h-11 text-base font-medium rounded-xl bg-(--primary-color) hover:bg-(--hover-primary-color)"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Seller;
