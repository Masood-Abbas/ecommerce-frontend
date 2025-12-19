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

  /*Defaults*/
  const defaultPage = 1;
  const defaultLimit = 10;
  const defaultMinPrice = 0;
  const defaultMaxPrice = 5000;

  /*URL Params*/
  const page = Number(searchParams.get("page")) || defaultPage;
  const limit = Number(searchParams.get("limit")) || defaultLimit;
  const categorynameFromURL = searchParams.get("category") || "";
  const minPriceParam = Number(searchParams.get("minPrice")) || defaultMinPrice;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || defaultMaxPrice;

  /*State*/
  const [filters, setFilters] = useState({
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    maxLimit: defaultMaxPrice,
  });

  const [selectedCategory, setSelectedCategory] = useState(categorynameFromURL);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: defaultPage,
    totalPages: 1,
    totalItems: 0,
  });
  const [openSection, setOpenSection] = useState("category");

  const { fetchApi, loading } = useApiResponse({ method: "GET" });

  /*Fetch Products*/
  const fetchProducts = async (
    catId = "",
    pageNum = page,
    minPrice = filters.minPrice,
    maxPrice = filters.maxPrice
  ) => {
    const params = { page: pageNum, limit, minPrice, maxPrice };

    if (catId) {
      const res = await fetchApi(
        params,
        `/category/getsinglecategory/${catId}`,
        {}
      );
      if (!res) return;

      const data = res.data.data;
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

  /*URL Change Effect*/
  useEffect(() => {
    // Update filters from URL
    setFilters({
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      maxLimit: defaultMaxPrice,
    });

    // Update selected category from URL
    setSelectedCategory(categorynameFromURL);

    // Dynamically calculate categoryId
    const selectedCategoryObj = categories.find(
      (c) => c.name === categorynameFromURL
    );
    const categoryId = selectedCategoryObj ? selectedCategoryObj.id : "";

    fetchProducts(categoryId, page, minPriceParam, maxPriceParam);
  }, [searchParams, categories]);

  /*Pagination*/
  const goToPage = (newPage) => {
    navigate(
      `/products?page=${newPage}&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&${
        selectedCategory ? `&category=${selectedCategory}` : ""
      }`
    );
  };

  /*Apply Filters*/
  const applyFilters = () => {
    navigate(
      `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&${
        selectedCategory ? `&category=${selectedCategory}` : ""
      }`
    );
  };

  /*Category Select*/
  const handleCategorySelect = (category) => {
    const categoryName = category?.name || "";
    setSelectedCategory(categoryName);

    navigate(
      `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}${
        categoryName ? `&category=${categoryName}` : ""
      }`
    );
  };

  /*Loading*/
  if (loading) {
    return (
      <div className="min-h-screen">
        <LoadingSpot text="Fetching Products" />
      </div>
    );
  }

  /*UI*/
  return (
    <div className="main-container py-5 grid grid-cols-12 gap-8">
      {/* Sidebar */}
      <div className="hidden md:block col-span-3">
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          openSection={openSection}
          setOpenSection={setOpenSection}
          handleCategorySelect={handleCategorySelect}
        />
      </div>

      {/* Products */}
      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-medium mb-3">All Products</h1>

        {/* Active Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategory && (
            <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              <span>Category: {selectedCategory}</span>
              <button
                onClick={() =>
                  handleCategorySelect(null) // Remove category
                }
                className="font-bold"
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
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: 0,
                    maxPrice: prev.maxLimit,
                  }))
                }
                className="font-bold"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="font-medium text-lg">{pagination.totalItems} Results</p>

          <select
            value={limit}
            onChange={(e) =>
              navigate(
                `/products?page=1&limit=${e.target.value}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}${
                  selectedCategory ? `&category=${selectedCategory}` : ""
                }`
              )
            }
            className="border rounded-full px-4 py-2"
          >
            <option value="10">Show 10</option>
            <option value="24">Show 24</option>
            <option value="48">Show 48</option>
            <option value="96">Show 96</option>
          </select>
        </div>

        <ProductList products={products} />
        <PaginationSection pagination={pagination} goToPage={goToPage} />
      </div>
    </div>
  );
};

export default ProductPage;
