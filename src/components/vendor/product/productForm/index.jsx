import { useState, useRef, useEffect } from "react";
import { X, ImagePlus } from "lucide-react";
import { Formik } from "formik";
import { useSelector } from "react-redux";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { productSchema } from "@/utils/validation/productSchema";
import { Button } from "@/components/ui/button";

export default function ProductFormDialog({ open, setOpen, mode = "add", product, onSuccess }) {
  const formikRef = useRef(null);
  const { items: categories = [] } = useSelector(state => state.categories || {});
  const shopId = useSelector(s => s.shop?.shopData?.id);

  const { fetchApi, loading } = useApiResponse({ method: mode === "edit" ? "patch" : "post" });
  const [previews, setPreviews] = useState([]);

  // Load edit images
  useEffect(() => {
    if (open && mode === "edit" && product?.images?.length) {
      setPreviews(product.images.map(img => ({ url: img.url, existing: true })));
    }
  }, [open, mode, product]);

  // Reset form on close
  useEffect(() => {
    if (!open) {
      previews.forEach(p => p.file && URL.revokeObjectURL(p.url));
      setPreviews([]);
      formikRef.current?.resetForm();
    }
  }, [open]);

  const initialValues = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    categoryId: product?.category?.id || "",
    images: [],
  };

  const handleImages = (files, setFieldValue, values) => {
    const selected = Array.from(files).slice(0, 5 - previews.length);
    const mapped = selected.map(file => ({ file, url: URL.createObjectURL(file), existing: false }));
    setPreviews(prev => [...prev, ...mapped]);
    setFieldValue("images", [...values.images, ...selected]);
  };

  const removeImage = (index, setFieldValue, values) => {
    const img = previews[index];
    if (img?.file) URL.revokeObjectURL(img.url);
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (!img.existing) {
      setFieldValue("images", values.images.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => { if (key !== "images") formData.append(key, val); });
    values.images.forEach(file => formData.append("images", file));

    const endpoint = mode === "edit" ? `/product/updateproduct/${product.id}` : `/product/shops/${shopId}/create`;
    const res = await fetchApi({}, endpoint, formData);

    if (res?.data?.success) {
      resetForm();
      setPreviews([]);
      setOpen(false);
      onSuccess?.();
    }
  };

  if (!open) return null; 

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{mode === "edit" ? "Update Product" : "Add Product"}</h2>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={productSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit} className="space-y-5 text-start">
                {/* Product Name */}
                <div>
                  <label className="block font-medium mb-1">Product Name *</label>
                  <input
                    name="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full border rounded px-3 py-2 "
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={values.description}
                    onChange={handleChange}
                    placeholder="Product description"
                    className="w-full border rounded px-3 py-2 "
                  />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Price *</label>
                    <input
                      name="price"
                      type="number"
                      value={values.price}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 "
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Stock *</label>
                    <input
                      name="stock"
                      type="number"
                      value={values.stock}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 "
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-medium mb-1">Category *</label>
                  <select
                    name="categoryId"
                    value={values.categoryId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 "
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                </div>

                {/* Images */}
                <div>
                  <label className="block font-medium mb-1">Product Images ({previews.length}/5)</label>
                  <label
                    className={`flex flex-col  gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition hover:bg-gray-50
                    ${previews.length >= 5 ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload images</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleImages(e.target.files, setFieldValue, values)}
                    />
                  </label>

                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {previews.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img.url} className="h-24 w-full rounded-md object-cover border" />
                          <button
                            type="button"
                            onClick={() => removeImage(i, setFieldValue, values)}
                            className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                {mode === "add" ? (
                  <Button
                    type="submit"
                    className="w-full bg-(--primary-color) hover:bg-(--hover-primary-color) text-white py-2 rounded"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Product"}
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      className="border border-gray-300 rounded py-2 bg-white hover:bg-white text-black"
                      onClick={() => setOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-(--primary-color) hover:bg-(--hover-primary-color) text-white py-2 rounded"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Product"}
                    </Button>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
