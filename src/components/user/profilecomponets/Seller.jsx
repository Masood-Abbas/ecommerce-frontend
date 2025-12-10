import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { updateUserRole } from "@/Redux/authSlice/authSlice";

const Seller = () => {
  const [preview, setPreview] = useState(null);
  const { fetchApi, data, loading, error } = useApiResponse({
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
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      address: Yup.string().required("Address is required"),
      phone: Yup.string().required("Phone is required"),
      image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      await fetchApi({},`/shop/createShope`,formData); 
      console.log("Response:", data);
    },
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("image", file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <Card className="w-full max-w-2xl rounded-2xl shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Create Shop</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Name</Label>
              <Input
                name="name"
                placeholder="Shop name"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="h-11"
              />
              {formik.errors.name && <p className="text-red-500 text-sm">{formik.errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                name="description"
                placeholder="Write shop description"
                onChange={formik.handleChange}
                value={formik.values.description}
                className="min-h-[120px] resize-none"
              />
              {formik.errors.description && (
                <p className="text-red-500 text-sm">{formik.errors.description}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Address</Label>
              <Input
                name="address"
                placeholder="Lahore, Pakistan"
                onChange={formik.handleChange}
                value={formik.values.address}
                className="h-11"
              />
              {formik.errors.address && (
                <p className="text-red-500 text-sm">{formik.errors.address}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Phone</Label>
              <Input
                name="phone"
                placeholder="+92 333 111442"
                onChange={formik.handleChange}
                value={formik.values.phone}
                className="h-11"
              />
              {formik.errors.phone && <p className="text-red-500 text-sm">{formik.errors.phone}</p>}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Shop Image</Label>
              <Input type="file" accept="image/*" onChange={handleImage} />
              {formik.errors.image && <p className="text-red-500 text-sm">{formik.errors.image}</p>}

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-28 h-28 rounded-lg border mt-2 object-cover"
                />
              )}
            </div>

            <Button type="submit" className="w-full h-11 text-base font-medium rounded-xl">
              {loading ? "Submitting..." : "Submit"}
            </Button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Seller;
