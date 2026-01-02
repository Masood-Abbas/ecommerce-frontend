import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PaginationSection from "@/components/user/shared/pagination";
import ProductActions from "@/components/vendor/product/productAction";
import ProductFormDialog from "@/components/vendor/product/productForm";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import SearchInputApi from "@/components/vendor/searchInput";

export default function VendorProducts() {
  const shopId = useSelector((s) => s.shop?.shopData?.id);
  const { items: categories = [] } = useSelector((s) => s.categories || {});

  const [products, setProducts] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const { fetchApi, loading } = useApiResponse({ method: "get" });

  // Fetch products (category + search + pagination)
  const fetchProducts = async () => {
    if (!shopId) return;

    const params = {
      page,
      limit,
      categoryId: selectedCategory || undefined,
      search: searchText || undefined,
    };

    const res = await fetchApi(params, `/shop/${shopId}/products`);

    if (res?.data?.success) {
      // Ensure products is always array
      setProducts(
        Array.isArray(res.data.data.products) ? res.data.data.products : []
      );
      setPagination(res.data.data.pagination || {});
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [shopId, page, selectedCategory, searchText]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSearch = (text) => {
    setSearchText(text);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const goToPage = (p) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", p);
    setSearchParams(newParams);
  };

  return (
    <div className="bg-white p-4 rounded border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4 sm:item-center">
        <div className="flex flex-col">
        <h2 className="text-2xl font-semibold">Products</h2>
        <p className="text-muted-foreground mb-4">
        Manage your product catalog
      </p>
        </div>
        <Button className="bg-(--primary-color) hover:bg-(--hover-primary-color)" onClick={() => setAddOpen(true)}>Add Product</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInputApi onResults={handleSearch} />
        <select
          className="border rounded px-3"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr className="text-base ">
              <th className="p-2 text-left font-semibold ">Product</th>
              <th className="p-2 text-center font-semibold">Category</th>
              <th className="p-2 text-center font-semibold">Price</th>
              <th className="p-2 text-center font-semibold">Stock</th>
              <th className="p-2 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">
                    <div className="flex gap-2 items-center">
                      <img
                        src={p.images?.[0]?.url || "/placeholder.png"}
                        className="w-10 h-10 rounded"
                      />
                      <span className="truncate max-w-[150px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-2 text-center">{p.category?.name || "-"}</td>
                  <td className="p-2 text-center">$ {p.price}</td>
                  <td className="p-2 text-center">{p.stock}</td>
                  <td className="p-2 text-center">
                    <ProductActions product={p} onRefresh={fetchProducts} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationSection
        pagination={{
          page: pagination.currentPage || 1,
          totalPages: pagination.totalPages || 1,
          totalRecords: pagination.totalProducts || 0,
        }}
        goToPage={goToPage}
      />

      {/* Add Product Dialog */}
      <ProductFormDialog
        open={addOpen}
        setOpen={setAddOpen}
        mode="add"
        onSuccess={fetchProducts}
      />
    </div>
  );
}
