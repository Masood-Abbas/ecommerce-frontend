import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import ProductCard from "@/components/user/productCard";
import { ChevronDown, ChevronUp } from "lucide-react";

const CategoryPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query params
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;

  const { items: categories } = useSelector((state) => state.categories);

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(id);

  // PRICE FILTER STATE
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

  const { fetchApi, loading } = useApiResponse({ method: "GET" });

  // ACCORDION STATE
  const [openSection, setOpenSection] = useState(null); // "category" | "price" | null

  // FETCH CATEGORY / PRODUCTS
  const fetchCategory = async (categoryId = selectedCategory, priceFilter = filters) => {
    if (!categoryId) {
      // No category selected → redirect to products page
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

    // Update state
    setSelectedCategory(data.category.id);
    setCategory(data.category);
    setProducts(data.products);
    setPagination({
      page: data.pagination.page,
      totalPages: data.pagination.totalPages,
      totalItems: data.pagination.totalItems || data.products.length,
    });
  };

  // USE EFFECT
  useEffect(() => {
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 5000;

    setFilters((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
    }));

    fetchCategory();
  }, [selectedCategory, page, limit, searchParams]);

  const goToPage = (newPage) => {
    navigate(
      `/category/${selectedCategory || ""}?page=${newPage}&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
    );
  };

  const applyFilters = () => {
    navigate(
      `/category/${selectedCategory || ""}?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
    );
  };

  const clearCategoryFilter = () => {
    // Remove category → go to products page
    setSelectedCategory(null);
    navigate(`/products`);
  };

  const clearPriceFilter = () => {
    const resetFilters = { ...filters, minPrice: 0, maxPrice: filters.maxLimit };
    setFilters(resetFilters);
    fetchCategory(selectedCategory, resetFilters);
    navigate(
      `/category/${selectedCategory || ""}?page=1&limit=${limit}&minPrice=0&maxPrice=${filters.maxLimit}`
    );
  };

  if (loading || !category)
    return (
      <div className="main-container flex justify-center py-20 text-xl">
        Loading...
      </div>
    );

  return (
    <div className="main-container py-10 grid grid-cols-12 gap-8">
      {/* LEFT SIDEBAR (STICKY) */}
      <div className="col-span-3 hidden md:block sticky top-24 h-fit">
        <h3 className="font-semibold text-xl mb-4">Filter By:</h3>

        {/* CATEGORY FILTER */}
        <div className="border-b pb-6 mb-4">
          <h4
            className="font-medium mb-3 cursor-pointer flex justify-between items-center"
            onClick={() =>
              setOpenSection(openSection === "category" ? null : "category")
            }
          >
            Categories{" "}
            <span>
              {openSection === "category" ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </span>
          </h4>

          {openSection === "category" && (
            <ul className="flex flex-col gap-2 text-sm">
              {categories?.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      fetchCategory(cat.id, filters);
                      navigate(
                        `/category/${cat.id}?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
                      );
                    }}
                    className={`w-full text-left px-2 py-1 rounded ${
                      selectedCategory === cat.id
                        ? "bg-gray-600 text-white"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PRICE SLIDER */}
        <div className="border-b pb-6 mb-4">
          <h4
            className="font-medium mb-3 flex justify-between items-center cursor-pointer"
            onClick={() =>
              setOpenSection(openSection === "price" ? null : "price")
            }
          >
            Price
            <span>
              {openSection === "price" ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </span>
          </h4>

          {openSection === "price" && (
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Rs.{filters.minPrice}</span>
                <span>Rs.{filters.maxPrice}</span>
              </div>

              <div className="relative w-full h-2 bg-gray-300 rounded">
                <div
                  className="absolute h-2 bg-black rounded"
                  style={{
                    left: `${(filters.minPrice / filters.maxLimit) * 100}%`,
                    width: `${
                      ((filters.maxPrice - filters.minPrice) / filters.maxLimit) *
                      100
                    }%`,
                  }}
                ></div>

                <input
                  type="range"
                  min="0"
                  max={filters.maxLimit}
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minPrice: Math.min(
                        Number(e.target.value),
                        filters.maxPrice - 100
                      ),
                    })
                  }
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none 
                    [&::-webkit-slider-thumb]:pointer-events-auto 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-black"
                />

                <input
                  type="range"
                  min="0"
                  max={filters.maxLimit}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: Math.max(
                        Number(e.target.value),
                        filters.minPrice + 100
                      ),
                    })
                  }
                  className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none 
                    [&::-webkit-slider-thumb]:pointer-events-auto 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-black"
                />
              </div>

              <button
                onClick={applyFilters}
                className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-medium mb-3">{category?.name}</h1>

        {/* ACTIVE FILTERS */}
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategory && category?.name && (
            <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              <span>Category: {category.name}</span>
              <button
                onClick={clearCategoryFilter}
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
                onClick={clearPriceFilter}
                className="font-bold text-gray-600 hover:text-black"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <p className="font-medium text-lg">{pagination.totalItems} Results!</p>

          <div className="flex items-center gap-2 px-4 py-2 border rounded-full">
            <select
              value={limit}
              onChange={(e) =>
                navigate(
                  `/category/${selectedCategory || ""}?page=1&limit=${e.target.value}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
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

        {/* PRODUCT GRID */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}

        {/* PAGINATION */}
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  pagination.page > 1 && goToPage(pagination.page - 1)
                }
                className={
                  pagination.page <= 1
                    ? "opacity-50 pointer-events-none"
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
                    ? "opacity-50 pointer-events-none"
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
