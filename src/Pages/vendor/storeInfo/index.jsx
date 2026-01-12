import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { Store, Upload } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useApiResponse } from "@/hooks/ResponseApiHook";

const Seller = () => {
  const [preview, setPreview] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const fileInputRef = useRef(null);

  /* UPDATE API */
  const { fetchApi: updateShop, loading: loadingText, error } = useApiResponse({
    method: "patch",
  });

  /* GET SHOP INFO */
  const { fetchApi: fetchShopInfo } = useApiResponse({ method: "get" });

  /* FETCH SHOP DATA */
  useEffect(() => {
    const getShopInfo = async () => {
      const res = await fetchShopInfo({}, "/shop/getsingleshop");
      if (res?.data?.data) {
        const shop = res.data.data;
        setShopData(shop);
        if (shop.images?.length) {
          setPreview(shop.images[0].url);
        }
      }
    };
    getShopInfo();
  }, []);

  /* OPEN FILE SELECTOR */
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  /* HANDLE IMAGE SELECTION AND UPLOAD */
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !shopData?.id) return;

    setPreview(URL.createObjectURL(file));
    setLoadingUpload(true);

    const formData = new FormData();
    formData.append("images", file);

    // Keep old images so backend doesn't remove them
    shopData.images?.forEach((img, i) =>
      formData.append(`existingImages[${i}]`, img.url)
    );

    try {
      const res = await updateShop({}, `/shop/update/${shopData.id}`, formData);
      if (res?.data?.data) {
        setShopData(res.data.data);

        // Remove preview after upload
        setPreview(null);
      }
    } finally {
      setLoadingUpload(false);
      e.target.value = null; // reset input so same file can be selected again
    }
  };

  /* HANDLE TEXT UPDATE TO BACKEND */
  const handleTextUpdate = async (values) => {
    if (!shopData?.id) return;

    const formData = new FormData();
    formData.append("name", values.name || shopData.name);
    formData.append("description", values.description || shopData.description);
    formData.append("address", values.address || shopData.address);
    formData.append("phone", values.phone || shopData.phone);

    // Keep old images
    shopData.images?.forEach((img, i) =>
      formData.append(`existingImages[${i}]`, img.url)
    );

    const res = await updateShop({}, `/shop/update/${shopData.id}`, formData);

    if (res?.data?.data) {
      setShopData(res.data.data);
      if (res.data.data.images?.length) {
        setPreview(res.data.data.images[0].url);
      }
    }
  };

  /* FORM FOR TEXT FIELDS */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: shopData?.name || "",
      description: shopData?.description || "",
      address: shopData?.address || "",
      phone: shopData?.phone || "",
      email: shopData?.owner?.email || "",
    },
    onSubmit: async (values) => {
      await handleTextUpdate(values);
    },
  });

  return (
    <div className="w-full px-4">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-(--primary-color) p-3 rounded-full">
          <Store className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Store Information</h1>
          <p className="text-gray-500 text-sm">
            Update your store details visible to customers
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-8 max-w-5xl space-y-10">
        {/* IMAGE SECTION */}
        <div className="flex items-center gap-6">
          {/* PREVIEW IMAGE */}
          <label className="relative cursor-pointer group">
            <img
              src={preview || "https://via.placeholder.com/80"}
              alt="Store Logo"
              className="w-24 h-24 rounded-full object-cover border "
            />
          </label>

          {/* HIDDEN INPUT */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />

          {/* BUTTON TO SELECT IMAGE */}
          <Button size="sm" variant="outline" onClick={handleSelectClick} disabled={loadingUpload} className="cursor-pointer">
            {loadingUpload ? "Uploading..." : "Select Image"}
          </Button>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-1">Store Name</Label>
            <Input {...formik.getFieldProps("name")} />
          </div>

          <div>
            <Label className="text-base font-medium mb-1">Store Description</Label>
            <Textarea {...formik.getFieldProps("description")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium mb-1">Email</Label>
              <Input type="email" {...formik.getFieldProps("email")} disabled />
            </div>
            <div>
              <Label className="text-base font-medium mb-1">Phone</Label>
              <Input {...formik.getFieldProps("phone")} />
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-1">Address</Label>
            <Input {...formik.getFieldProps("address")} />
          </div>

          <Button type="submit" disabled={loadingText} className="cursor-pointer">
            {loadingText ? "Saving..." : "Save Changes"}
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Seller;
