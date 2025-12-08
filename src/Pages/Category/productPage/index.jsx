// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useSearchParams, useNavigate } from "react-router-dom";

// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationNext,
//   PaginationPrevious,
//   PaginationLink,
// } from "@/components/ui/pagination";

// import { useApiResponse } from "@/hooks/ResponseApiHook";
// import ProductCard from "@/components/user/productCard";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const ProductPage = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { items: categories } = useSelector((state) => state.categories);

//   // DEFAULT QUERY PARAMS
//   const defaultPage = 1;
//   const defaultLimit = 10;
//   const defaultMinPrice = 0;
//   const defaultMaxPrice = 5000;

//   // Query params
//   const page = Number(searchParams.get("page")) || defaultPage;
//   const limit = Number(searchParams.get("limit")) || defaultLimit;
//   const initialCategory = searchParams.get("category") || null;

//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(initialCategory);

//   // PRICE FILTER STATE
//   const [filters, setFilters] = useState({
//     minPrice: Number(searchParams.get("minPrice")) || defaultMinPrice,
//     maxPrice: Number(searchParams.get("maxPrice")) || defaultMaxPrice,
//     maxLimit: defaultMaxPrice,
//   });

//   const [pagination, setPagination] = useState({
//     page: defaultPage,
//     totalPages: 1,
//     totalItems: 0,
//   });

//   const { fetchApi, loading } = useApiResponse({ method: "GET" });

//   // ACCORDION STATE
//   const [openSection, setOpenSection] = useState(null);

//   // FIRST-TIME URL FIX
//   useEffect(() => {
//     const params = Object.fromEntries([...searchParams]);
//     const missingPage = !params.page;
//     const missingLimit = !params.limit;
//     const missingMinPrice = !params.minPrice;
//     const missingMaxPrice = !params.maxPrice;

//     if (missingPage || missingLimit || missingMinPrice || missingMaxPrice) {
//       navigate(
//         `/products?page=${page}&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`,
//         { replace: true }
//       );
//     }
//   }, []); // run only once on mount

//   // FETCH PRODUCTS
//   const fetchProducts = async () => {
//     const params = {
//       page,
//       limit,
//       minPrice: filters.minPrice,
//       maxPrice: filters.maxPrice,
//       category: selectedCategory,
//     };

//     const res = await fetchApi(params, `/product/getallproducts`, {});
//     if (!res) return;

//     const data = res.data.data;
//     setProducts(data.products);
//     setPagination({
//       page: data.currentPage,
//       totalPages: data.totalPages,
//       totalItems: data.totalProducts,
//     });
//   };

//   // FETCH PRODUCTS ON PARAMS CHANGE
//   useEffect(() => {
//     const minPrice = Number(searchParams.get("minPrice")) || defaultMinPrice;
//     const maxPrice = Number(searchParams.get("maxPrice")) || defaultMaxPrice;
//     const category = searchParams.get("category") || null;

//     setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
//     setSelectedCategory(category);

//     fetchProducts();
//   }, [page, limit, searchParams, selectedCategory]);

//   const goToPage = (newPage) => {
//     navigate(
//       `/products?page=${newPage}&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
//     );
//   };

//   const applyFilters = () => {
//     navigate(
//       `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
//     );
//   };

//   if (loading)
//     return (
//       <div className="main-container flex justify-center py-20 text-xl">
//         Loading...
//       </div>
//     );

//   return (
//     <div className="main-container py-10 grid grid-cols-12 gap-8">
//       {/* LEFT SIDEBAR */}
//       <div className="col-span-3 hidden md:block sticky top-24 h-fit">
//         <h3 className="font-semibold text-xl mb-4">Filter By:</h3>

//         {/* CATEGORY FILTER */}
//         <div className="border-b pb-6 mb-4">
//           <h4
//             className="font-medium mb-3 flex justify-between items-center cursor-pointer"
//             onClick={() =>
//               setOpenSection(openSection === "category" ? null : "category")
//             }
//           >
//             Categories
//             <span>
//               {openSection === "category" ? (
//                 <ChevronUp size={14} />
//               ) : (
//                 <ChevronDown size={14} />
//               )}
//             </span>
//           </h4>

//           {openSection === "category" && (
//             <ul className="flex flex-col gap-2 text-sm">
//               {categories?.map((cat) => (
//                 <li key={cat.id}>
//                   <button
//                     onClick={() => {
//                       setSelectedCategory(cat.id);
//                       navigate(
//                         `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
//                       );
//                     }}
//                     className={`w-full text-left px-2 py-1 rounded ${
//                       selectedCategory === cat.id
//                         ? "bg-gray-600 text-white"
//                         : "hover:bg-gray-200"
//                     }`}
//                   >
//                     {cat.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* PRICE FILTER */}
//         <div className="border-b pb-6 mb-4">
//           <h4
//             className="font-medium mb-3 flex justify-between items-center cursor-pointer"
//             onClick={() =>
//               setOpenSection(openSection === "price" ? null : "price")
//             }
//           >
//             Price
//             <span>
//               {openSection === "price" ? (
//                 <ChevronUp size={14} />
//               ) : (
//                 <ChevronDown size={14} />
//               )}
//             </span>
//           </h4>

//           {openSection === "price" && (
//             <div>
//               <div className="flex justify-between mb-2 text-sm">
//                 <span>Rs.{filters.minPrice}</span>
//                 <span>Rs.{filters.maxPrice}</span>
//               </div>

//               <div className="relative w-full h-2 bg-gray-300 rounded">
//                 <div
//                   className="absolute h-2 bg-black rounded"
//                   style={{
//                     left: `${(filters.minPrice / filters.maxLimit) * 100}%`,
//                     width: `${
//                       ((filters.maxPrice - filters.minPrice) /
//                         filters.maxLimit) *
//                       100
//                     }%`,
//                   }}
//                 ></div>

//                 {/* MIN SLIDER */}
//                 <input
//                   type="range"
//                   min="0"
//                   max={filters.maxLimit}
//                   value={filters.minPrice}
//                   onChange={(e) =>
//                     setFilters({
//                       ...filters,
//                       minPrice: Math.min(
//                         Number(e.target.value),
//                         filters.maxPrice - 100
//                       ),
//                     })
//                   }
//                   className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
//                 />

//                 {/* MAX SLIDER */}
//                 <input
//                   type="range"
//                   min="0"
//                   max={filters.maxLimit}
//                   value={filters.maxPrice}
//                   onChange={(e) =>
//                     setFilters({
//                       ...filters,
//                       maxPrice: Math.max(
//                         Number(e.target.value),
//                         filters.minPrice + 100
//                       ),
//                     })
//                   }
//                   className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
//                 />
//               </div>

//               <button
//                 onClick={applyFilters}
//                 className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
//               >
//                 Apply
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* PRODUCT LIST */}
//       <div className="col-span-12 md:col-span-9">
//         <h1 className="text-3xl font-medium mb-3">All Products</h1>

//         <div className="flex justify-between items-center mb-6">
//           <p className="font-medium text-lg">{pagination.totalItems} Results!</p>

//           <div className="flex items-center gap-2 px-4 py-2 border rounded-full">
//             <select
//               value={limit}
//               onChange={(e) =>
//                 navigate(
//                   `/products?page=1&limit=${e.target.value}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
//                 )
//               }
//               className="bg-white text-black rounded-full font-medium focus:outline-none cursor-pointer"
//             >
//               <option value="10">Show: 10</option>
//               <option value="24">Show: 24</option>
//               <option value="48">Show: 48</option>
//               <option value="96">Show: 96</option>
//             </select>
//           </div>
//         </div>

//         {products.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//             {products.map((p) => (
//               <ProductCard key={p.id} product={p} />
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No products found.</p>
//         )}

//         {/* PAGINATION */}
//         <Pagination className="mt-10">
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious
//                 onClick={() =>
//                   pagination.page > 1 && goToPage(pagination.page - 1)
//                 }
//                 className={
//                   pagination.page <= 1
//                     ? "opacity-50 pointer-events-none"
//                     : "cursor-pointer"
//                 }
//               />
//             </PaginationItem>

//             {Array.from({ length: pagination.totalPages }).map((_, i) => (
//               <PaginationItem key={i}>
//                 <PaginationLink
//                   onClick={() => goToPage(i + 1)}
//                   isActive={pagination.page === i + 1}
//                   className="cursor-pointer"
//                 >
//                   {i + 1}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}

//             <PaginationItem>
//               <PaginationNext
//                 onClick={() =>
//                   pagination.page < pagination.totalPages &&
//                   goToPage(pagination.page + 1)
//                 }
//                 className={
//                   pagination.page >= pagination.totalPages
//                     ? "opacity-50 pointer-events-none"
//                     : "cursor-pointer"
//                 }
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;



// src/pages/ProductPage.jsx

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

  const initialCategory = searchParams.get("category") || null;

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

  // FIX URL ON FIRST LOAD
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    const missing =
      !params.page || !params.limit || !params.minPrice || !params.maxPrice;

    if (missing) {
      navigate(
        `/products?page=${page}&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`,
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

  // REFRESH ON PARAMS CHANGE
  useEffect(() => {
    const minPrice = Number(searchParams.get("minPrice")) || defaultMinPrice;
    const maxPrice = Number(searchParams.get("maxPrice")) || defaultMaxPrice;
    const category = searchParams.get("category") || null;

    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
    setSelectedCategory(category);

    fetchProducts();
  }, [page, limit, searchParams, selectedCategory]);

  // PAGINATION
  const goToPage = (newPage) => {
    navigate(
      `/products?page=${newPage}&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&category=${selectedCategory || ""}`
    );
  };

  // APPLY FILTERS
  const applyFilters = () => {
    navigate(
      `/products?page=1&limit=${limit}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&category=${selectedCategory || ""}`
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

      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
      <div className="col-span-12 md:col-span-9">
        <h1 className="text-3xl font-medium mb-3">All Products</h1>

        <div className="flex justify-between items-center mb-6">
          <p className="font-medium text-lg">
            {pagination.totalItems} Results!
          </p>

          <div className="flex items-center gap-2 px-4 py-2 border rounded-full">
            <select
              value={limit}
              onChange={(e) =>
                navigate(
                  `/category/${selectedCategory}?page=1&limit=${e.target.value}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
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

        <PaginationSection
          pagination={pagination}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
};

export default ProductPage;
