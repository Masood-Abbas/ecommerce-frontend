import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PaginationSection from "@/components/user/shared/pagination";
import ProductActions from "@/components/vendor/product/productAction";
import ProductFormDialog from "@/components/vendor/product/productForm";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import SearchInputApi from "@/components/vendor/searchInput";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";

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
    <div className=" p-4 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-6 sm:item-center">
        <div className="flex flex-col">
        <h2 className="text-2xl font-semibold">Products</h2>
        <p className="text-muted-foreground ">
        Manage your product catalog
      </p>
        </div>
        <Button className="bg-(--primary-color) hover:bg-(--hover-primary-color) cursor-pointer" onClick={() => setAddOpen(true)}>Add Product</Button>
      </div>

      {/* Filters */}
      <div className="bg-white py-5 px-4 border border-gray-200 rounded-xl mb-6">
      <div className="flex flex-col sm:flex-row gap-3 ">
        <SearchInputApi onResults={handleSearch} className="bg-gray-100" />
        <select
          className="border rounded px-3 bg-gray-100 cursor-pointer"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="" className="cursor-pointer">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="cursor-pointer">
              {c.name}
            </option>
          ))}
        </select>
      </div>
      </div>

      {/* Products Table */}
      <div className="border rounded-xl  overflow-x-auto">
        <table className="w-full text-sm cursor-default">
          <thead className="bg-gray-100 rounded-xl">
            <tr className="text-base ">
              <th className="p-3 text-left font-semibold ">Product</th>
              <th className="p-3 text-center font-semibold">Category</th>
              <th className="p-3 text-center font-semibold">Price</th>
              <th className="p-3 text-center font-semibold">Stock</th>
              <th className="p-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <LoadingSpot text="Loading Product"/>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center bg-white">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t bg-white rounded-xl">
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
                  <td className="p-2 text-center ">
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
