import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useApiResponse } from "@/hooks/ResponseApiHook";
import PaginationSection from "@/components/user/shared/pagination";
import FilterSidebar from "@/components/user/shared/sidebarFilter";
import ProductList from "@/components/user/ProductComponent/productsList";
// import FilterSidebar from "@/components/user/shared/filterSidebar";
// import ProductList from "@/components/user/shared/productList";
// import PaginationSection from "@/components/user/shared/paginationSection";

const CategoryPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;

  const { items: categories } = useSelector((state) => state.categories);

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(id);
  const [filters, setFilters] = useState({
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 5000,
    maxLimit: 5000,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [openSection, setOpenSection] = useState("category");

  const { fetchApi, loading } = useApiResponse({ method: "GET" });

  const fetchCategory = async (
    categoryId = selectedCategory,
    priceFilter = filters
  ) => {
    if (!categoryId) {
      navigate(`/products`);
      return;
    }

    const params = {
      page,
      limit,
      minPrice: priceFilter.minPrice,
      maxPrice: priceFilter.maxPrice,
    };

    const url = `/category/getsinglecategory/${categoryId}`;
    const res = await fetchApi(params, url, {});
    if (!res) return;

    const data = res.data.data;
    setSelectedCategory(data.category.id);
    setCategory(data.category);
    setProducts(data.products);
    setPagination({
      page: data.pagination.page,
      totalPages: data.pagination.totalPages,
      totalItems: data.pagination.totalItems || data.products.length,
    });
  };

  useEffect(() => {
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 5000;
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
    fetchCategory();
  }, [selectedCategory, page, limit, searchParams]);

  const goToPage = (newPage) => {
    navigate(
      `/category/${
        selectedCategory || ""
      }?page=${newPage}&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${
        filters.maxPrice
      }`
    );
  };

  const applyFilters = () => {
    navigate(
      `/category/${selectedCategory || ""}?page=1&limit=${limit}&minPrice=${
        filters.minPrice
      }&maxPrice=${filters.maxPrice}`
    );
  };

  if (loading || !category)
    return (
      <div className="main-container flex justify-center py-20 text-xl">
        Loading...
      </div>
    );

  return (
    <div className="main-container py-5 grid grid-cols-12 gap-8">
      {/* SIDEBAR */}
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
          limit={limit}
          navigate={navigate}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-medium mb-3">{category.name}</h1>

        {/* ACTIVE FILTERS */}
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategory && (
            <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              <span>
                Category:{" "}
                {categories.find((c) => c.id === selectedCategory)?.name}
              </span>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  navigate(`/products`);
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
                  fetchCategory(selectedCategory, resetFilters);
                  navigate(
                    `/category/${
                      selectedCategory || ""
                    }?page=1&limit=${limit}&minPrice=0&maxPrice=${
                      filters.maxLimit
                    }`
                  );
                }}
                className="font-bold text-gray-600 hover:text-black"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <p className="font-medium text-lg">
            {pagination.totalItems} Results!
          </p>
          <div className="flex items-center gap-2 px-4 py-2 border rounded-full">
            <select
              value={limit}
              onChange={(e) =>
                navigate(
                  `/category/${selectedCategory || ""}?page=1&limit=${
                    e.target.value
                  }&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
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

export default CategoryPage;
