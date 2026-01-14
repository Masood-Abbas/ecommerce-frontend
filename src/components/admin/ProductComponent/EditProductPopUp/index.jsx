import { useState } from "react";
import { X } from "lucide-react";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { Button } from "@/components/ui/button";

export default function ProductStatusDialog({
  open,
  setOpen,
  data,
  onSuccess,
}) {
  console.log("product", data);
  const { fetchApi, loading } = useApiResponse({ method: "patch" });
  const [status, setStatus] = useState(data?.status || "active");

  const handleSubmit = async () => {
    const res = await fetchApi(
      {},
      `/admin/adminupdateproductstatus/${data.id}`,
      { status }
    );

    if (res?.data?.success) {
      setOpen(false);
      onSuccess?.();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Update Status</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <Button
            className="w-full bg-(--primary-color) hover:bg-(--hover-primary-color) text-white py-2 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </div>
    </div>
  );
}
