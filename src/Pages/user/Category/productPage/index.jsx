import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useApiResponse } from "@/hooks/ResponseApiHook";
import FilterSidebar from "@/components/user/shared/sidebarFilter";

import PaginationSection from "@/components/user/shared/pagination";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import ProductHeader from "@/components/user/ProductComponent/productHeader";
import ProductList from "@/components/user/ProductComponent/productsList";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items: categories } = useSelector((state) => state.categories);

  /* Defaults */
  const defaultPage = 1;
  const defaultLimit = 10;
  const defaultMinPrice = 0;
  const defaultMaxPrice = 5000;

  /* URL Params */
  const page = Number(searchParams.get("page")) || defaultPage;
  const limit = Number(searchParams.get("limit")) || defaultLimit;
  const categoryFromURL = searchParams.get("category") || "";
  const minPriceParam = Number(searchParams.get("minPrice")) || defaultMinPrice;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || defaultMaxPrice;

  /* State */
  const [filters, setFilters] = useState({
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    maxLimit: defaultMaxPrice,
  });

  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: defaultPage,
    totalPages: 1,
    totalItems: 0,
  });

  const [openSection, setOpenSection] = useState("category");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { fetchApi, loading } = useApiResponse({ method: "GET" });

  /* Fetch Products */
  const fetchProducts = async (categoryId = "") => {
    const params = {
      page,
      limit,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    };

    if (categoryId) {
      const res = await fetchApi(
        params,
        `/category/getsinglecategory/${categoryId}`,
        {}
      );
      if (!res) return;

      const data = res.data.data;
      const filtered = data.products.filter(
        (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
      );

      setProducts(filtered);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        totalItems: filtered.length,
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

  useEffect(() => {
    setFilters({
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      maxLimit: defaultMaxPrice,
    });

    setSelectedCategory(categoryFromURL);

    const categoryObj = categories.find((c) => c.name === categoryFromURL);

    fetchProducts(categoryObj?.id || "");
  }, [searchParams, categories]);

  const applyFilters = () => {
    navigate(
      `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${
        filters.maxPrice
      }${selectedCategory ? `&category=${selectedCategory}` : ""}`
    );
  };

  const handleCategorySelect = (category) => {
    const name = category?.name || "";
    setSelectedCategory(name);

    navigate(
      `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${
        filters.maxPrice
      }${name ? `&category=${name}` : ""}`
    );
  };

  const clearPriceFilter = () => {
    navigate(
      `/products?page=1&limit=${limit}&minPrice=0&maxPrice=${defaultMaxPrice}${
        selectedCategory ? `&category=${selectedCategory}` : ""
      }`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <LoadingSpot text="Fetching Products" />
      </div>
    );
  }

  return (
    <div className="main-container py-5 grid grid-cols-12 gap-6">
      {/* Desktop Sidebar */}
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

      <div className="col-span-12 md:col-span-9 px-2 md:px-0">
        {/* Header UI Component */}
        <ProductHeader
          title="All Products"
          mobileFilterOpen={mobileFilterOpen}
          setMobileFilterOpen={setMobileFilterOpen}
          categories={categories}
          selectedCategory={selectedCategory}
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          openSection={openSection}
          setOpenSection={setOpenSection}
          handleCategorySelect={handleCategorySelect}
        />

        {/* Active Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategory && (
            <div className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              Category: {selectedCategory}
              <button onClick={() => handleCategorySelect(null)}>×</button>
            </div>
          )}

          {(filters.minPrice > 0 || filters.maxPrice < filters.maxLimit) && (
            <div className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              Price: Rs.{filters.minPrice} - Rs.{filters.maxPrice}
              <button onClick={clearPriceFilter}>×</button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="font-medium text-lg">{pagination.totalItems} Results</p>
          <div className="pr-2 border rounded-full">
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
            className=" px-4 py-2 pr-6 "
          >
            <option value="10">Show 10</option>
            <option value="24">Show 24</option>
            <option value="48">Show 48</option>
            <option value="96">Show 96</option>
          </select>
          </div>
        </div>

        <ProductList products={products} />
        <PaginationSection pagination={pagination} />
      </div>
    </div>
  );
};

export default ProductPage;
