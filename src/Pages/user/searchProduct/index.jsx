import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import PaginationSection from "@/components/user/shared/pagination";
import ProductCard from "@/components/user/ProductComponent/productCard";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword") || "";
  const pageParam = parseInt(params.get("page") || "1");

  const [currentPage, setCurrentPage] = useState(pageParam);
  const itemsPerPage = 12;

  const { fetchApi, data, loading } = useApiResponse({
    endpoint: "/product/searchproducts",
    method: "get",
  });

  useEffect(() => {
    if (keyword) {
      fetchApi({
        keyword,
        page: currentPage,
        limit: itemsPerPage,
      });
    }
  }, [keyword, currentPage]);

  // Update URL when page changes
  useEffect(() => {
    navigate(`/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}`, { replace: true });
  }, [currentPage]);

  const goToPage = (page) => setCurrentPage(page);

  const pagination = {
    page: currentPage,
    totalPages: data?.totalPages || 0,
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8 min-h-screen ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-medium text-black flex items-center gap-2">
         Search Results
        </h1>
        {keyword && (
          <p className="text-gray-600 mt-2">
            Showing results for <span className="font-medium">"{keyword}" : </span>  
            <span className="font-medium"> {data?.totalProducts || 0} products</span>
          </p>
        )}
      </div>

      {/* Filters */}
      {/* <div className="flex flex-wrap items-center gap-4 mb-6">
        <select className="border rounded px-3 py-2 bg-white">
          <option>Relevance</option>
          <option>Price Low to High</option>
          <option>Price High to Low</option>
        </select>
      </div> */}

      {/* Loading */}
      {loading && <LoadingSpot text="Loading Product..."/>}

      {/* No results */}
      {!loading && data?.products?.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-500 text-lg">No products found for "{keyword}"</p>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!loading &&
          data?.products?.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
      </div>

      {/* Pagination */}
      
        <PaginationSection pagination={pagination} goToPage={goToPage} />
    </div>
  );
};

export default SearchResultsPage;
