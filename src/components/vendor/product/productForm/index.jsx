import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useApiResponse } from "@/hooks/ResponseApiHook";

export default function AddProductPopup({ onProductAdded }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
    categoryId: "",
  });

  const { fetchApi, loading } = useApiResponse({ method: "post" });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("stock", formData.stock);
    payload.append("categoryId", formData.categoryId);
    formData.images.forEach((file, i) => payload.append(`images[${i}]`, file));

    const response = await fetchApi(payload, `/shop/products`);
    if (response?.data?.success) {
      onProductAdded(); // refresh products
      setOpen(false); // close modal
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        images: [],
        categoryId: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">+ Add Product</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category ID</label>
            <Input
              name="categoryId"
              type="number"
              value={formData.categoryId}
              onChange={handleChange}
              placeholder="Category ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <Input
              type="file"
              name="images"
              multiple
              onChange={handleChange}
              accept="image/*"
            />
            {formData.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.images.map((img, idx) => (
                  <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {img.name || img}
                  </span>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
              {loading ? "Saving..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
