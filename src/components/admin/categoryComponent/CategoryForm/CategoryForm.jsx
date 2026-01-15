import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { useApiResponse } from "@/hooks/ResponseApiHook";

const categorySchema = Yup.object({
  name: Yup.string().required("Name is required"),
  status: Yup.string().required("Status is required"),
});


export default function CategoryFormDialog({
  open,
  setOpen,
  mode = "add", 
  data:category,
  onSuccess,
}) {
  const formikRef = useRef(null);

  const { fetchApi, loading } = useApiResponse({
    method: mode === "edit" ? "patch" : "post",
  });

  
  useEffect(() => {
    if (!open) {
      formikRef.current?.resetForm();
    }
  }, [open]);

  const initialValues = {
    name: category?.name || "",
    status: category?.status || "active",
  };

//   submit
  const handleSubmit = async (values, { resetForm }) => {
    const endpoint =
      mode === "edit"
        ? `/category/updatecategory/${category.id}`
        : `/category/create`;

    const res = await fetchApi({}, endpoint, values);

    if (res?.data?.success) {
      resetForm();
      setOpen(false);
      onSuccess?.(); 
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "edit" ? "Update Category" : "Add Category"}
          </h2>
          <button onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={categorySchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, errors, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block font-medium mb-1">
                    Category Name *
                  </label>
                  <input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter category name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block font-medium mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm">{errors.status}</p>
                  )}
                </div>

                {/* Buttons */}
                {mode === "add" ? (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Category"}
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Category"}
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
