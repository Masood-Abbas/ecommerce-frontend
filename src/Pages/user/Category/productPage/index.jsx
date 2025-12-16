import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useApiResponse } from "@/hooks/ResponseApiHook";
import FilterSidebar from "@/components/user/shared/sidebarFilter";
import ProductList from "@/components/user/shared/products";
import PaginationSection from "@/components/user/shared/pagination";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items: categories } = useSelector((state) => state.categories);

  // Defaults
  const defaultPage = 1;
  const defaultLimit = 10;
  const defaultMinPrice = 0;
  const defaultMaxPrice = 5000;

  // Extract params from URL
  const page = Number(searchParams.get("page")) || defaultPage;
  const limit = Number(searchParams.get("limit")) || defaultLimit;
  const categoryId = searchParams.get("category") || "";
  const minPriceParam = Number(searchParams.get("minPrice")) || defaultMinPrice;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || defaultMaxPrice;

  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  const [filters, setFilters] = useState({
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    maxLimit: defaultMaxPrice,
  });
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: defaultPage,
    totalPages: 1,
    totalItems: 0,
  });
  const [openSection, setOpenSection] = useState("category");

  const { fetchApi, loading } = useApiResponse({ method: "GET" });

  // Helper to fetch products
  const fetchProducts = async (
    catId = "",
    pageNum = page,
    minPrice = filters.minPrice,
    maxPrice = filters.maxPrice
  ) => {
    if (catId) {
      // Category API
      const params = { page: pageNum, limit, minPrice, maxPrice };
      const res = await fetchApi(
        params,
        `/category/getsinglecategory/${catId}`,
        {}
      );
      if (!res) return;

      const data = res.data.data;
      // Filter by price client-side if needed
      const filtered = data.products.filter(
        (p) => p.price >= minPrice && p.price <= maxPrice
      );

      setProducts(filtered);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalItems || filtered.length,
      });
    } else {
      // All products API
      const params = { page: pageNum, limit, minPrice, maxPrice };
      const res = await fetchApi(params, `/product/getallproducts`, {});
      if (!res) return;

      const data = res.data.data;
      setProducts(data.products);
      setPagination({
        page: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalProducts,
      });
    }
  };

  // Fetch on URL changes
  useEffect(() => {
    setFilters({
      ...filters,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
    });
    setSelectedCategory(categoryId);
    fetchProducts(categoryId, page, minPriceParam, maxPriceParam);
  }, [searchParams]);

  // Pagination handler
  const goToPage = (newPage) => {
    navigate(
      `/products?page=${newPage}&limit=${limit}&minPrice=${
        filters.minPrice
      }&maxPrice=${filters.maxPrice}${
        selectedCategory ? `&category=${selectedCategory}` : ""
      }`
    );
  };

  // Apply filters button
  const applyFilters = () => {
    navigate(
      `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${
        filters.maxPrice
      }${selectedCategory ? `&category=${selectedCategory}` : ""}`
    );
  };

  // Sidebar category click
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    navigate(
      `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&category=${catId}`
    );
  };

  if (loading)
    return (
      <div className="min-h-screen">
        <LoadingSpot text="Fetch Product" />
      </div>
    );

  return (
    <div className="main-container py-10 grid grid-cols-12 gap-8">
      {/* Sidebar */}
      <div className="hidden md:block col-span-3">
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          openSection={openSection}
          setOpenSection={setOpenSection}
          handleCategorySelect={handleCategorySelect}
        />
      </div>

      {/* Main Content */}
      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-medium mb-3">All Products</h1>

        {/* ACTIVE FILTERS */}
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategory && (
            <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              <span>
                Category:{" "}
                {
                  categories.find(
                    (c) => String(c.id) === String(selectedCategory)
                  )?.name
                }
              </span>
              <button
                onClick={() => {
                  setSelectedCategory("");
                  navigate(
                    `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
                  );
                }}
                className="font-bold text-gray-600 hover:text-black"
              >
                ×
              </button>
            </div>
          )}

          {(filters.minPrice > 0 || filters.maxPrice < filters.maxLimit) && (
            <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              <span>
                Price: Rs.{filters.minPrice} - Rs.{filters.maxPrice}
              </span>
              <button
                onClick={() => {
                  const resetFilters = {
                    ...filters,
                    minPrice: 0,
                    maxPrice: filters.maxLimit,
                  };
                  setFilters(resetFilters);
                  fetchProducts(selectedCategory, 1, 0, filters.maxLimit);
                  navigate(
                    `/products?page=1&limit=${limit}&minPrice=0&maxPrice=${
                      filters.maxLimit
                    }${selectedCategory ? `&category=${selectedCategory}` : ""}`
                  );
                }}
                className="font-bold text-gray-600 hover:text-black"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Products Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="font-medium text-lg">
            {pagination.totalItems} Results!
          </p>

          <div className="flex items-center gap-2 px-4 py-2 border rounded-full">
            <select
              value={limit}
              onChange={(e) =>
                navigate(
                  `/products?page=1&limit=${e.target.value}&minPrice=${
                    filters.minPrice
                  }&maxPrice=${filters.maxPrice}${
                    selectedCategory ? `&category=${selectedCategory}` : ""
                  }`
                )
              }
              className="bg-white text-black rounded-full font-medium focus:outline-none cursor-pointer"
            >
              <option value="10">Show: 10</option>
              <option value="24">Show: 24</option>
              <option value="48">Show: 48</option>
              <option value="96">Show: 96</option>
            </select>
          </div>
        </div>

        <ProductList products={products} />
        <PaginationSection pagination={pagination} goToPage={goToPage} />
      </div>
    </div>
  );
};

export default ProductPage;
