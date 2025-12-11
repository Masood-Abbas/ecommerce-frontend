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
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      address: Yup.string().required("Address is required"),
      phone: Yup.string().required("Phone is required"),
      image: Yup.mixed().required("Image is required"),
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
    <>
      <h1 className="text-2xl font-bold mb-6">Become a Seller</h1>

      <div className="flex justify-center px-4 mt-10">
        <Card className="w-full max-w-2xl rounded-2xl shadow-lg border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Create Your Shop
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">

              {/* NAME */}
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  name="name"
                  placeholder="Shop name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.errors.name && (
                  <p className="text-red-500 text-xs">{formik.errors.name}</p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  placeholder="Write shop description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  className="min-h-[120px]"
                />
                {formik.errors.description && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              {/* ADDRESS */}
              <div className="space-y-1">
                <Label>Address</Label>
                <Input
                  name="address"
                  placeholder="Lahore, Pakistan"
                  onChange={formik.handleChange}
                  value={formik.values.address}
                />
                {formik.errors.address && (
                  <p className="text-red-500 text-xs">{formik.errors.address}</p>
                )}
              </div>

              {/* PHONE */}
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  name="phone"
                  placeholder="+92 333 111442"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
                {formik.errors.phone && (
                  <p className="text-red-500 text-xs">{formik.errors.phone}</p>
                )}
              </div>

              {/* IMAGE UPLOAD */}
              <div className="space-y-1">
                <Label>Shop Image</Label>
                <Input type="file" accept="image/*" onChange={handleImage} />

                {formik.errors.image && (
                  <p className="text-red-500 text-xs">{formik.errors.image}</p>
                )}

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-28 h-28 border rounded-lg object-cover mt-2"
                  />
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium rounded-xl bg-(--primary-color) hover:bg-(--hover-primary-color)"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>

              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Seller;
