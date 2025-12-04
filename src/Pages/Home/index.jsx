import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Slider from "../../components/user/slider.jsx";
import ProductCard from "@/components/user/productCard/index.jsx";
import { LiquidFeatureCard } from "@/components/user/featureCard/index.jsx";
import { Button } from "@/components/ui/button.jsx";

import { useApiResponse } from "@/hooks/ResponseApiHook/index.jsx";
import {
  setBestSellingProducts,
  appendAllProducts,
} from "@/Redux/producttSlice/productSlice.jsx";

import { features, slideData } from "@/utils/static/HomeData.jsx";

const Home = () => {
  const [limit] = useState(4);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const effectRan = useRef(false);

  // Best Selling API
  const {
    loading: bestSellingLoading,
    error: bestSellingError,
    fetchApi: fetchBestSelling,
  } = useApiResponse({
    endpoint: "/product/get-top-best-selling-products",
    reduxAction: setBestSellingProducts,
  });

  // All Products API
  const {
    loading: allProductsLoading,
    error: allProductsError,
    fetchApi: fetchAllProducts,
  } = useApiResponse({
    endpoint: "/product/getallproducts",
    reduxAction: appendAllProducts,
  });

  // Load products function
  const loadProducts = async (currentPage) => {
    const res = await fetchAllProducts({ limit, page: currentPage });
    const newItems = res?.data?.data?.products || [];

    if (newItems.length < limit) setHasMore(false);
    return newItems;
  };

  // Initial fetch
  useEffect(() => {
    if (effectRan.current) return;
    fetchBestSelling();
    loadProducts(1);
    effectRan.current = true;
  }, []);

  // Handle Load More
  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);

    await loadProducts(nextPage);

    setLoadingMore(false);
  };

  const { bestSellingProducts = [], allProducts = [] } = useSelector(
    (state) => state.products
  );

  return (
    <div className="main-container">
      {/* Banner Slider */}
      <div className="mt-2 py-4 mb-8">
        <Slider slides={slideData} />
      </div>

      {/* Top Selling */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold mb-6">Top Selling Products</h1>

        {bestSellingLoading && <p>Loading...</p>}
        {bestSellingError && <p>Error loading best selling products</p>}

        <div className="flex flex-wrap justify-between gap-4">
          {bestSellingProducts.map((p) => (
            <div key={p._id} className="w-full sm:w-[45%] lg:w-[23%] transition-all duration-500 ease-in-out opacity-100">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">All Products</h1>
        {allProductsLoading && page === 1 && <p>Loading products...</p>}
        {allProductsError && <p>Error loading products</p>}


        <div className="flex flex-wrap sm:gap-x-6 md:gap-x-15 lg:gap-x-8 gap-y-4 justify-center">
          {allProducts.map((p) => (
            <div
              key={p._id}
              className="w-full sm:w-[45%] lg:w-[23%] transition-all duration-500 ease-in-out opacity-0 animate-fadeIn"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all ${
                loadingMore ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <div className="flex justify-center gap-12 py-12 bg-white">
        {features.map((feature, idx) => (
          <LiquidFeatureCard key={idx} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default Home;
