// src/components/filters/FilterSidebar.jsx

import { ChevronDown, ChevronUp } from "lucide-react";

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  filters,
  setFilters,
  applyFilters,
  openSection,
  setOpenSection,
  limit,
  navigate,
}) => {
  // Ensure selectedCategory is always a string
  const handleCategoryClick = (catId) => {
    const idStr = String(catId);
    setSelectedCategory(idStr);
    navigate(
      `/category/${idStr}?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
    );
  };

  return (
    <div className="col-span-3 hidden md:block sticky top-24 h-fit">
      <h3 className="font-semibold text-xl mb-4">Filter By:</h3>

      {/* CATEGORY FILTER */}
      <div className="border-b pb-6 mb-4">
        <h4
          className="font-medium mb-3 flex justify-between items-center cursor-pointer"
          onClick={() =>
            setOpenSection(openSection === "category" ? null : "category")
          }
        >
          Categories
          {openSection === "category" ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </h4>

        {openSection === "category" && (
          <ul className="flex flex-col gap-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full text-left px-2 py-1 rounded ${
                    selectedCategory === String(cat.id)
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

      {/* PRICE FILTER */}
      <div className="border-b pb-6 mb-4">
        <h4
          className="font-medium mb-3 flex justify-between items-center cursor-pointer"
          onClick={() =>
            setOpenSection(openSection === "price" ? null : "price")
          }
        >
          Price
          {openSection === "price" ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </h4>

        {openSection === "price" && (
          <div>
            {/* Price Labels */}
            <div className="flex justify-between mb-2 text-sm">
              <span>Rs.{filters.minPrice}</span>
              <span>Rs.{filters.maxPrice}</span>
            </div>

            {/* Price Slider */}
            <div className="relative w-full h-2 bg-gray-300 rounded">
              {/* Filled Range */}
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

              {/* MIN Slider */}
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

              {/* MAX Slider */}
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

            {/* Apply Button */}
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
  );
};

export default FilterSidebar;
