import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { useSelector } from "react-redux";
import PaginationSection from "@/components/user/shared/pagination";
import AddProductPopup from "@/components/vendor/product/productForm";

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const shopId = useSelector((state) => state.shop?.shopData?.id);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { fetchApi, loading } = useApiResponse({ method: "get" });

  /* ---------- Fetch Products ---------- */
  const handleFetchProduct = async () => {
    if (!shopId) return;

    const response = await fetchApi({ page, limit }, `/shop/${shopId}/products`);
    const res = response?.data;

    if (res?.success) {
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || {});
    }
  };

  /* ---------- Page Change ---------- */
  const goToPage = (newPage) => {
    searchParams.set("page", newPage);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleFetchProduct();
  }, [shopId, page, limit]);

  if (!shopId) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading shop data...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
        {/* Add Product Popup Button */}
        <AddProductPopup onProductAdded={handleFetchProduct} />
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input placeholder="Search products..." className="flex-1" />
        <Button variant="outline" className="whitespace-nowrap">
          All Categories
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center py-6 text-gray-500">Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Product */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={product.images?.[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                    <div className="flex flex-col w-52 sm:w-64">
                      <p className="font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate">{product.description}</p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    Rs {product.price}
                  </td>

                  {/* Stock */}
                  <td className={`px-6 py-4 font-medium ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                    {product.stock}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <PaginationSection
            pagination={{
              page: pagination.currentPage,
              totalPages: pagination.totalPages,
              totalRecords: pagination.totalProducts,
            }}
            goToPage={goToPage}
          />
        </div>
      )}
    </div>
  );
}
