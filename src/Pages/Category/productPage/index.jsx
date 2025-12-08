import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useApiResponse } from "@/hooks/ResponseApiHook";
import FilterSidebar from "@/components/user/shared/sidebarFilter";
import ProductList from "@/components/user/shared/products";
import PaginationSection from "@/components/user/shared/pagination";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items: categories } = useSelector((state) => state.categories);

  // DEFAULTS
  const defaultPage = 1;
  const defaultLimit = 10;
  const defaultMinPrice = 0;
  const defaultMaxPrice = 5000;

  // PARAMS
  const page = Number(searchParams.get("page")) || defaultPage;
  const limit = Number(searchParams.get("limit")) || defaultLimit;
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // PRICE FILTERS
  const [filters, setFilters] = useState({
    minPrice: Number(searchParams.get("minPrice")) || defaultMinPrice,
    maxPrice: Number(searchParams.get("maxPrice")) || defaultMaxPrice,
    maxLimit: defaultMaxPrice,
  });

  const [pagination, setPagination] = useState({
    page: defaultPage,
    totalPages: 1,
    totalItems: 0,
  });

  const { fetchApi, loading } = useApiResponse({ method: "GET" });

  const [openSection, setOpenSection] = useState(null);

  // SYNC URL ON FIRST LOAD
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    const missing =
      !params.page || !params.limit || !params.minPrice || !params.maxPrice;

    if (missing) {
      navigate(
        `/products?page=${page}&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&category=${selectedCategory}`,
        { replace: true }
      );
    }
  }, []);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const params = {
      page,
      limit,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      category: selectedCategory,
    };

    const res = await fetchApi(params, `/product/getallproducts`, {});
    if (!res) return;

    const data = res.data.data;

    setProducts(data.products);
    setPagination({
      page: data.currentPage,
      totalPages: data.totalPages,
      totalItems: data.totalProducts,
    });
  };

  // RUN WHEN URL PARAMS CHANGE
  useEffect(() => {
    const minPrice = Number(searchParams.get("minPrice")) || defaultMinPrice;
    const maxPrice = Number(searchParams.get("maxPrice")) || defaultMaxPrice;
    const category = searchParams.get("category") || "";

    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
    setSelectedCategory(category);

    fetchProducts();
  }, [page, limit, searchParams]);

  // PAGINATION
  const goToPage = (newPage) => {
    navigate(
      `/products?page=${newPage}&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&category=${selectedCategory}`
    );
  };

  // APPLY FILTERS
  const applyFilters = () => {
    navigate(
      `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&category=${selectedCategory}`
    );
  };

  if (loading)
    return (
      <div className="main-container flex justify-center py-20 text-xl">
        Loading...
      </div>
    );

  return (
    <div className="main-container py-10 grid grid-cols-12 gap-8">

      {/* SIDEBAR — DESKTOP ONLY */}
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
        <h1 className="text-3xl font-medium mb-3">All Products</h1>

        <div className="flex justify-between items-center mb-6">
          <p className="font-medium text-lg">{pagination.totalItems} Results!</p>

          {/* LIMIT SELECT */}
          <div className="flex items-center gap-2 px-4 py-2 border rounded-full">
            <select
              value={limit}
              onChange={(e) =>
                navigate(
                  `/products?page=1&limit=${e.target.value}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&category=${selectedCategory}`
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
