import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Slider from "../../../components/user/slider.jsx/index.jsx";
import ProductCard from "@/components/user/ProductComponent/productCard/index.jsx";
import { LiquidFeatureCard } from "@/components/user/featureCard/index.jsx";
import { Button } from "@/components/ui/button.jsx";
import Spinner from "@/components/ui/spinner/spiner.jsx";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner.jsx";

import { features, slideData } from "@/utils/static/HomeData.jsx";
import { useApiResponse } from "@/hooks/ResponseApiHook/index.jsx";
import {
  setBestSellingProducts,
  setAllProducts,
  appendAllProducts,
} from "@/Redux/producttSlice/productSlice.jsx";

const Home = () => {
  const dispatch = useDispatch();

  const [limit] = useState(4);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { bestSellingProducts = [], allProducts = [] } = useSelector(
    (state) => state.products
  );

  // Best Selling API
  const {
    loading: bestSellingLoading,
    error: bestSellingError,
    fetchApi: fetchBestSelling,
  } = useApiResponse({
    endpoint: "/product/get-top-best-selling-products",
    reduxAction: null,
  });

  // All Products API
  const {
    loading: allProductsLoading,
    error: allProductsError,
    fetchApi: fetchAllProducts,
  } = useApiResponse({
    endpoint: "/product/getallproducts",
    reduxAction: null,
  });

  // Load products function
  const loadProducts = async (currentPage) => {
    // Fetch top selling products (only once)
    if (currentPage === 1) {
      const bestRes = await fetchBestSelling();
      const bestItems =
        bestRes?.data?.data?.products && Array.isArray(bestRes.data.data.products)
          ? bestRes.data.data.products
          : [];
      dispatch(setBestSellingProducts(bestItems));
    }

    // Fetch all products
    const allRes = await fetchAllProducts({ limit, page: currentPage });
    const newItems =
      allRes?.data?.data?.products && Array.isArray(allRes.data.data.products)
        ? allRes.data.data.products
        : [];

    if (currentPage === 1) {
      dispatch(setAllProducts(newItems)); 
    } else {
      dispatch(appendAllProducts(newItems)); 
    }

    if (newItems.length < limit) setHasMore(false);
  };

  // Initial fetch
  useEffect(() => {
    loadProducts(1);
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

  return (
    <div className="main-container py-5">
      {/* Banner Slider */}
      <div className="mb-8">
        <Slider slides={slideData} />
      </div>

      {/* Top Selling Products */}
      <section className="my-10">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-6 bg-[#DB4444] rounded-[3px]"></span>
            <span className="text-base font-semibold font-Inter text-[#DB4444]">
              This Month
            </span>
          </div>
          <h1 className="text-4xl font-samibold font-Inter my-3">
            Top Selling Products
          </h1>
        </div>

        {bestSellingLoading && <Spinner />}
        {bestSellingError && <p>Error loading best selling products</p>}

        <div className="flex flex-wrap justify-between gap-4">
          {(Array.isArray(bestSellingProducts) ? bestSellingProducts : []).map(
            (p) => (
              <div
                key={p.id}
                className="w-full sm:w-[45%] lg:w-[23%] transition-all duration-500 ease-in-out opacity-100"
              >
                <ProductCard product={p} />
              </div>
            )
          )}
        </div>
      </section>

      {/* All Products */}
      <section className="my-10">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-6 bg-[#DB4444] rounded-[3px]"></span>
            <span className="text-base font-semibold font-Inter text-[#DB4444]">
              Our Product
            </span>
          </div>
          <h1 className="text-4xl font-samibold my-3">Explore Our Products</h1>
        </div>

        {allProductsLoading && page === 1 && <Spinner />}
        {allProductsError && <p>Error loading products</p>}

        <div className="flex flex-wrap sm:gap-6 md:gap-15 lg:gap-8 justify-center">
          {(Array.isArray(allProducts) ? allProducts : []).map((p) => (
            <div
              key={p.id}
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
              className={`cursor-pointer px-6 py-3 bg-[#DB4444] text-white font-semibold rounded-lg shadow-md hover:bg-[#E07575] transition-all ${
                loadingMore ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loadingMore ? <LoadingSpot className="p-0" /> : "Load More"}
            </Button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <div className="flex justify-center gap-12 py-12 bg-white">
        {(Array.isArray(features) ? features : []).map((feature) => (
          <LiquidFeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default Home;
