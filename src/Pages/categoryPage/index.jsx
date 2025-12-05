import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { Heart } from "lucide-react";
import ProductCard from "@/components/user/productCard";

const CategoryPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query params
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const { fetchApi, loading } = useApiResponse({ method: "GET" });

  const fetchCategory = async () => {
    const params = {
      page,
      limit,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    };

    const res = await fetchApi(params, `/category/getsinglecategory/${id}`, {});
    if (!res) return;

    const data = res.data.data;

    setCategory(data.category);
    setProducts(data.products);

    setPagination({
      page: data.pagination.page,
      totalPages: data.pagination.totalPages,
      totalItems: data.pagination.totalItems || data.products.length,
    });
  };

  useEffect(() => {
    if (id) fetchCategory();
  }, [id, page, limit]);

  const goToPage = (newPage) => {
    navigate(`/category/${id}?page=${newPage}&limit=${limit}`);
  };

  const applyFilters = () => {
    navigate(
      `/category/${id}?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
    );
    fetchCategory();
  };

  if (loading || !category)
    return (
      <div className="main-container flex justify-center py-20 text-xl">
        Loading...
      </div>
    );

  return (
    <div className="main-container py-10 grid grid-cols-12 gap-8">
      
      {/* ---------------- LEFT SIDEBAR (STICKY) ---------------- */}
      <div className="col-span-3 hidden md:block sticky top-24 h-fit">
        <h3 className="font-semibold text-xl mb-4">Filter By:</h3>

        {/* Price Filter */}
        <div className="border-b pb-4 mb-4">
          <h4 className="font-medium mb-2">Price</h4>

          <input
            placeholder="From"
            className="w-full border p-2 rounded mb-2"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
          />

          <input
            placeholder="To"
            className="w-full border p-2 rounded"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          />

          <button
            onClick={applyFilters}
            className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ---------------- RIGHT CONTENT ---------------- */}
      <div className="col-span-12 md:col-span-9">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-3">{category?.name}</h1>

        {/* -------- TOP BAR (Results + Show Dropdown) -------- */}
        <div className="flex justify-between items-center mb-6">

          <p className="text-black font-medium text-lg">
            {pagination.totalItems} Results!
          </p>

          {/* Show Limit Dropdown */}
          <div className="flex items-center gap-2  px-4 py-2 border rounded-full">

            <select
              value={limit}
              onChange={(e) =>
                navigate(`/category/${id}?page=1&limit=${e.target.value}`)
              }
              className=" text-black bg-white rounded-full font-medium focus:outline-none cursor-pointer"
            >
              <option value="2">Show: 2</option>
              <option value="24">Show: 24</option>
              <option value="48">Show: 48</option>
              <option value="96">Show: 96</option>
            </select>

          </div>
        </div>

        {/* ---------------- PRODUCT GRID ---------------- */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
             <ProductCard product={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}

        {/* ---------------- PAGINATION ---------------- */}
        <Pagination className="mt-10">
          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  pagination.page > 1 && goToPage(pagination.page - 1)
                }
                className={
                  pagination.page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => goToPage(i + 1)}
                  isActive={pagination.page === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  pagination.page < pagination.totalPages &&
                  goToPage(pagination.page + 1)
                }
                className={
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default CategoryPage;
