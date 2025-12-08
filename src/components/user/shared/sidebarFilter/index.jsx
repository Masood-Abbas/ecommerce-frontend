import { ChevronDown, ChevronUp, X } from "lucide-react";

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
  mobileFilterOpen,
  setMobileFilterOpen,
}) => {
  const handleCategoryClick = (catId) => {
    const idStr = String(catId);
    setSelectedCategory(idStr);
    navigate(
      `/category/${idStr}?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
    );
    setMobileFilterOpen(false);
  };

  return (
    <>
      {/* OVERLAY - MOBILE */}
      {mobileFilterOpen && (
        <div
          onClick={() => setMobileFilterOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static
          top-0 left-0
          h-full md:h-fit
          w-64 md:w-auto
          bg-white md:bg-transparent
          shadow-md md:shadow-none
          z-50 md:z-auto
          transform transition-transform duration-300
          ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          p-5 md:p-0
        `}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Filters</h3>
          <button onClick={() => setMobileFilterOpen(false)}>
            <X size={22} />
          </button>
        </div>

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
              <div className="flex justify-between mb-2 text-sm">
                <span>Rs.{filters.minPrice}</span>
                <span>Rs.{filters.maxPrice}</span>
              </div>

              {/* Slider Track */}
              <div className="relative w-full h-2 bg-gray-300 rounded">
                <div
                  className="absolute h-2 bg-black rounded"
                  style={{
                    left: `${(filters.minPrice / filters.maxLimit) * 100}%`,
                    width: `${
                      ((filters.maxPrice - filters.minPrice) /
                        filters.maxLimit) *
                      100
                    }%`,
                  }}
                ></div>

                {/* Min slider */}
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

                {/* Max slider */}
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
                onClick={() => {
                  applyFilters();
                  setMobileFilterOpen(false);
                }}
                className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
